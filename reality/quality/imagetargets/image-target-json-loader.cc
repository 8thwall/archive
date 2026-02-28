// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "image-target-json-loader.h",
  };
  deps = {
    "//c8:c8-log",
    "//c8:string",
    "//c8/geometry:parameterized-geometry",
    "//reality/engine/imagedetection:detection-image-loader",
    "@json//:json",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0x24ed02ef);

#include <cstdio>
#include <fstream>
#include <iostream>
#include <nlohmann/json.hpp>

#include "c8/c8-log.h"
#include "image-target-json-loader.h"
#include "reality/engine/imagedetection/detection-image-loader.h"

namespace c8 {

// Helper function that can be used to print out a curvySpec for input ImageTargetMetadata
void printCurvySpecFromMetadata() {
  MutableRootMessage<ImageTargetMetadata> imageTargetMetadata;
  auto itmBuilder = imageTargetMetadata.builder();
  itmBuilder.setType(ImageTargetTypeMsg::CURVY);

  itmBuilder.getCurvyGeometry().setCurvyCircumferenceTop(273.f);
  itmBuilder.getCurvyGeometry().setCurvyCircumferenceBottom(273.f);
  itmBuilder.getCurvyGeometry().setTargetCircumferenceTop(109.f);
  itmBuilder.getCurvyGeometry().setCurvySideLength(129.f);

  itmBuilder.setOriginalImageWidth(1092);
  itmBuilder.setOriginalImageHeight(1278);
  itmBuilder.setCropOriginalImageX(0);
  itmBuilder.setCropOriginalImageY(0);
  itmBuilder.setCropOriginalImageWidth(1000);
  itmBuilder.setCropOriginalImageHeight(750);

  CurvySpec curvySpec = DetectionImageLoader::buildCurvySpec(imageTargetMetadata.reader());
  C8Log("%s", curvySpec.toString().c_str());
}

CurvySpec curvySpecFromTargetJson(const nlohmann::json &targetData) {
  if (targetData["type"].get<std::string>().compare("CYLINDER") != 0) {
    C8_THROW("Target is not a cylinder.");
  }
  CurvyOuterCrop crop{
    targetData["curvySpec"]["crop"]["outerWidth"].get<float>(),
    targetData["curvySpec"]["crop"]["outerHeight"].get<float>(),
    targetData["curvySpec"]["crop"]["cropStartX"].get<float>(),
    targetData["curvySpec"]["crop"]["cropStartY"].get<float>()};
  return CurvySpec{
    targetData["curvySpec"]["arc"].get<float>(),
    targetData["curvySpec"]["isRotated"].get<bool>(),
    crop,
    targetData["curvySpec"]["base"].get<float>()};
}
}  // namespace c8
