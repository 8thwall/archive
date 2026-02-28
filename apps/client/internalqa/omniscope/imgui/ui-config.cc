// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"ui-config.h"};
  deps = {
    "//c8:hmatrix",
    "//c8:map",
    "//c8:string",
    "//c8:vector",
    "//c8/io:file-io",
    "//reality/quality/synthetic:synthetic-scenes",
    "@json//:json",
  };
}
cc_end(0xf454a139);

#include <fstream>
#include <nlohmann/json.hpp>

#include "apps/client/internalqa/omniscope/imgui/ui-config.h"
#include "c8/io/file-io.h"
#include "reality/quality/synthetic/synthetic-scenes.h"

namespace c8 {
namespace {
nlohmann::json toJson(const HMatrix &mat) {
  auto &data = mat.data();
  auto &iData = mat.inverseData();
  auto matrixData = nlohmann::json();
  for (const auto &datum : data) {
    matrixData.push_back(datum);
  }
  for (const auto &datum : iData) {
    matrixData.push_back(datum);
  }
  return matrixData;
}

HMatrix fromJson(const nlohmann::json &data) {
  return {
    {data[0], data[4], data[8], data[12]},
    {data[1], data[5], data[9], data[13]},
    {data[2], data[6], data[10], data[14]},
    {data[3], data[7], data[11], data[15]},
    {data[16], data[20], data[24], data[28]},
    {data[17], data[21], data[25], data[29]},
    {data[18], data[22], data[26], data[30]},
    {data[19], data[23], data[27], data[31]},
  };
}

// These args are only used for a single Omniscope run, and don't persist in omniscope.json
const Vector<String> ONE_TIME_ARGS = {"prebuiltMapSrc", "builtMapOut"};

}  // namespace

void OmniscopeUiConfig::setSource(const String &src) {
  auto recent = recentSources;
  auto el = std::find(recent.begin(), recent.end(), src);
  if (el != recent.end()) {
    recent.erase(el);
  }
  recent.push_front(src);
  if (recent.size() > 30) {
    recent.resize(30);
  }
  recentSources = recent;
  realitySrc = src;
}

OmniscopeUiConfig UiConfig::get() {
  std::lock_guard<std::mutex> lock(configMtx_);
  loadOnce();
  return uiConfig_;
}

void UiConfig::set(const OmniscopeUiConfig &c) {
  std::lock_guard<std::mutex> lock(configMtx_);
  uiConfig_ = c;
  save();
}

void UiConfig::loadOnce() {
  if (savePath_.size() > 0) {
    return;
  }

  auto dir = std::filesystem::path(std::getenv("HOME")) / ".c8";
  std::filesystem::create_directory(dir);  // Create if needed, ignore failure if exists.
  savePath_ = dir / "omniscope.json";

  std::ifstream ifs(savePath_);
  if (!ifs.is_open()) {
    return;
  }
  auto json = nlohmann::json::parse(ifs);

  auto version = json["version"].get<int>();

  if (version >= 1) {
    uiConfig_.datasetsPath = json["datasetsPath"].get<String>();
    auto recentSources = json["recentSources"].get<std::vector<String>>();
    uiConfig_.recentSources.clear();
    for (const auto &fileName : recentSources) {
      if (fileExists(fileName)) {
        uiConfig_.recentSources.push_back(fileName);
      }
    }
  }
  if (version >= 0) {
    uiConfig_.gotoFrame = json["gotoFrame"].get<int>();
    uiConfig_.frameSkip = json["frameSkip"].get<int>();
    uiConfig_.viewIdx = json["viewIdx"].get<int>();
    uiConfig_.viewGroupIdx = json["viewGroupIdx"].get<int>();
    uiConfig_.existingResponse = json["existingResponse"].get<bool>();
    auto realitySrc = json["realitySrc"].get<String>();
    // If the saved realitySrc does not exist, use the most recently used reality source that we
    // found from above. If such source does not exist, pass an empty string(this will cause omni
    // to hang the first time, until you select a sequence, and re-run omni).
    uiConfig_.realitySrc = fileExists(realitySrc) ? realitySrc
      : uiConfig_.recentSources.size() > 0        ? uiConfig_.recentSources.front()
                                                  : "";
  }
  if (version >= 2) {
    uiConfig_.showPerFrameLatency = json["showPerFrameLatency"].get<bool>();
  }
  if (version >= 3) {
    for (const auto &pathToCameraPositions : json["cameraPositions"].items()) {
      for (const auto &mat : pathToCameraPositions.value()) {
        uiConfig_.realitySrcToCameraPositions[pathToCameraPositions.key()].push_back(fromJson(mat));
      }
    }
  }

  if (version >= 4) {
    uiConfig_.syntheticSceneName = json["syntheticSceneName"].get<String>();
  }

  // If we have anything except a valid scene name stored in our JSON then set it to "None".
  const auto &names = syntheticSceneNames();
  if (std::find(names.begin(), names.end(), uiConfig_.syntheticSceneName) == names.end()) {
    uiConfig_.syntheticSceneName = "None";
  }

  auto prebuiltMapSrc = json.contains("prebuiltMapSrc") ? json["prebuiltMapSrc"].get<String>() : "";
  uiConfig_.prebuiltMapSrc = fileExists(prebuiltMapSrc) ? prebuiltMapSrc : "";

  uiConfig_.builtMapOut = json.contains("builtMapOut") ? json["builtMapOut"].get<String>() : "";

  // Delete the used ONE_TIME_ARGS from omniscope.json
  for (const auto &arg : ONE_TIME_ARGS) {
    json.erase(arg);
  }
  std::ofstream ofs(savePath_);
  ofs << std::setw(4) << json;
}

void UiConfig::save() {
  loadOnce();
  auto json = nlohmann::json();
  json["version"] = 4;
  json["frameSkip"] = uiConfig_.frameSkip;
  json["gotoFrame"] = uiConfig_.gotoFrame;
  json["realitySrc"] = uiConfig_.realitySrc;
  json["prebuiltMapSrc"] = uiConfig_.prebuiltMapSrc;
  json["builtMapOut"] = uiConfig_.builtMapOut;
  json["viewGroupIdx"] = uiConfig_.viewGroupIdx;
  json["viewIdx"] = uiConfig_.viewIdx;
  json["datasetsPath"] = uiConfig_.datasetsPath;
  json["recentSources"] = uiConfig_.recentSources;
  json["showPerFrameLatency"] = uiConfig_.showPerFrameLatency;
  json["syntheticSceneName"] = uiConfig_.syntheticSceneName;
  json["existingResponse"] = uiConfig_.existingResponse;
  auto &cameraPositions = json["cameraPositions"];
  for (const auto &pathToPositions : uiConfig_.realitySrcToCameraPositions) {
    auto &path = pathToPositions.first;
    auto &positions = pathToPositions.second;
    auto cameraPositionArray = nlohmann::json();
    for (const auto &pos : positions) {
      cameraPositionArray.push_back(toJson(pos));
    }
    cameraPositions[path] = cameraPositionArray;
  }
  std::ofstream ofs(savePath_);
  ofs << std::setw(4) << json;
}

}  // namespace c8
