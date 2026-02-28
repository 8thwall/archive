// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <deque>
#include <mutex>

#include "c8/hmatrix.h"
#include "c8/map.h"
#include "c8/string.h"
#include "c8/vector.h"

namespace c8 {

struct OmniscopeUiConfig {
public:
  int gotoFrame = 0;
  int frameSkip = 1;
  int viewIdx = 0;
  int viewGroupIdx = 0;
  String realitySrc;
  String prebuiltMapSrc;
  String builtMapOut;
  String datasetsPath;
  std::deque<String> recentSources;
  bool showPerFrameLatency = false;
  TreeMap<String, Vector<HMatrix>> realitySrcToCameraPositions;
  String syntheticSceneName;
  bool existingResponse = false;

  // Mutators for non-trivial updates.
  void setSource(const String &src);  // Set the realitySrc and update the recentSources.
};

class UiConfig {
public:
  OmniscopeUiConfig get();
  void set(const OmniscopeUiConfig &c);

private:
  std::mutex configMtx_;
  OmniscopeUiConfig uiConfig_;
  String savePath_;

  void loadOnce();
  void save();
};

}  // namespace c8
