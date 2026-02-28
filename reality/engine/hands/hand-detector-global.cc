// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"
cc_library {
  hdrs = {
    "hand-detector-global.h",
  };
  deps = {
    "//c8:c8-log",
    "//c8:parameter-data",
    "//c8:vector",
    "//c8/stats:scope-timer",
    "//c8/string:join",
    "//c8/pixels:pixel-transforms",
    "//reality/engine/deepnets:tflite-interpreter",
    "//reality/engine/deepnets:detection-anchor-nms",
    "//reality/engine/hands:hand-types",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0x79db690f);

#include <cmath>

#include "c8/c8-log.h"
#include "c8/parameter-data.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/join.h"
#include "reality/engine/deepnets/detection-anchor-nms.h"
#include "reality/engine/hands/hand-detector-global.h"
#include "reality/engine/hands/hand-types.h"

namespace c8 {

namespace {

struct Settings {
  float minConfidence;
};

const Settings &settings() {
  static const Settings settings_{
    globalParams().getOrSet("HandDetectorGlobal.minConfidence", 0.8f),
  };
  return settings_;
}


constexpr float IOU_THRESHOLD = 0.3;

////////////////////////////////////////// PROCESS /////////////////////////////////////////

void removeLetterBoxScale(Vector<Detection> &detections, int width, int height) {
  float xScale = 1;
  float yScale = 1;

  if (height > width) {
    xScale = static_cast<float>(width) / height;
  } else {
    yScale = static_cast<float>(height) / width;
  }

  for (auto &detection : detections) {
    auto bb = detection.locationData.relativeBoundingBox;

    // update the bounding box
    detection.locationData.relativeBoundingBox = {
      ((bb.x - 0.5f) / xScale) + 0.5f,
      ((bb.y - 0.5f) / yScale) + 0.5f,
      bb.w / xScale,
      bb.h / yScale,
    };

    // update the key landmark coordinates
    for (auto &pt : detection.locationData.relativeKeypoints) {
      pt = {((pt.x() - 0.5f) / xScale) + 0.5f, ((pt.y() - 0.5f) / yScale) + 0.5f};
    }
  }
}

}  // namespace

void HandDetectorGlobal::initializeDetection() {
  AnchorOptions options;
  options.inputSizeWidth = 192;
  options.inputSizeHeight = 192;
  anchors_ = generateAnchors(options);

  decodeOptions_.numBoxes = 2016;
  decodeOptions_.numCoords = 18;
  decodeOptions_.numKeypoints = 7;
  decodeOptions_.xScale = 192.0f;
  decodeOptions_.yScale = 192.0f;
  decodeOptions_.wScale = 192.0f;
  decodeOptions_.hScale = 192.0f;
  decodeOptions_.minScoreThresh = settings().minConfidence;
}

Vector<DetectedPoints> HandDetectorGlobal::detectHands(
  RenderedSubImage src, c8_PixelPinholeCameraModel k) {
  ScopeTimer t("global-detect-hands");
  toLetterboxRGBFloat0To1(src.image, 192, 192, interpreter_->typed_input_tensor<float>(0));
  {
    ScopeTimer t1("global-model-invoke");
    interpreter_->Invoke();
  }

  auto fullDetections = processDetections(
    interpreter_->typed_output_tensor<float>(0),
    interpreter_->typed_output_tensor<float>(1),
    anchors_,
    decodeOptions_);
  auto detections = weightedNonMaxSuppression(fullDetections, IOU_THRESHOLD);

  removeLetterBoxScale(detections, src.image.cols(), src.image.rows());

  Vector<DetectedPoints> output;
  output.reserve(detections.size());
  for (const auto &detection : detections) {
    auto bb = detection.locationData.relativeBoundingBox;
    const auto &pts = detection.locationData.relativeKeypoints;

    // enlarge the bounding box of the detected palm to enclose the whole hand
    auto baseFactor = 1.0f;
    auto heightFactor = 2.0f;
    HPoint3 lowerLeft = {bb.x + 0.5f * bb.w - baseFactor * bb.w, bb.y + bb.h, 1.0f};
    HPoint3 lowerRight = {bb.x + 0.5f * bb.w + baseFactor * bb.w, bb.y + bb.h, 1.0f};
    HPoint3 upperLeft = {lowerLeft.x(), lowerLeft.y() - heightFactor * bb.h, 1.0f};
    HPoint3 upperRight = {lowerRight.x(), lowerRight.y() - heightFactor * bb.h, 1.0f};
    HPoint3 newCenter = {
      0.25f * (upperLeft.x() + upperRight.x() + lowerLeft.x() + lowerRight.x()),
      0.25f * (upperLeft.y() + upperRight.y() + lowerLeft.y() + lowerRight.y()),
      1.0f};

    // shift the bounding box to center on middle MCP point
    float mcpDx = pts[HANDDETECTION_MIDDLE_MCP].x() - newCenter.x();
    float mcpDy = pts[HANDDETECTION_MIDDLE_MCP].y() - newCenter.y();
    upperLeft = {upperLeft.x() + mcpDx, upperLeft.y() + mcpDy, upperLeft.z()};
    upperRight = {upperRight.x() + mcpDx, upperRight.y() + mcpDy, upperRight.z()};
    lowerLeft = {lowerLeft.x() + mcpDx, lowerLeft.y() + mcpDy, lowerLeft.z()};
    lowerRight = {lowerRight.x() + mcpDx, lowerRight.y() + mcpDy, lowerRight.z()};
    newCenter = {newCenter.x() + mcpDx, newCenter.y() + mcpDy, newCenter.z()};

    Vector<HPoint3> bbPts = {upperLeft, upperRight, lowerLeft, lowerRight, newCenter};

    // By taking the index finger mcp and pinky mcp, we're able to draw a straight line for
    // determining the orientation of the bounding box.
    // index finger mcp is at 1 and pinky mcp is at 4

    // compensate for aspect ratio distortion.
    auto stretch = HMatrixGen::scale(src.image.cols() - 1, src.image.rows() - 1, 1);
    Vector<HPoint3> mcpPts = {
      {pts[HANDDETECTION_INDEX_MCP].x(), pts[HANDDETECTION_INDEX_MCP].y(), 1.0f},
      {pts[HANDDETECTION_PINKY_MCP].x(), pts[HANDDETECTION_PINKY_MCP].y(), 1.0f},
    };

    auto stretchMcpPts = stretch * mcpPts;
    auto stretchBbpts = stretch * bbPts;

    // atan2 takes arguments: y, x
    // Calculate the rotation angle to make the line between Index Finger MCP and
    // Pinky MCP horizontal.
    // Note:
    // the points are in image space, which has (0,0) at top-left and (1,1) at bottom-right.
    // the difference of y between two points in the image spaces needs to be inverted
    // to get the correct rotation angle.
    auto zRotRad = std::atan2(
      -(stretchMcpPts[1].y() - stretchMcpPts[0].y()), stretchMcpPts[1].x() - stretchMcpPts[0].x());

    auto center = HMatrixGen::translation(stretchBbpts[4].x(), stretchBbpts[4].y(), 0.0f);
    auto transform =
      stretch.inv() * center * HMatrixGen::zRadians(zRotRad) * center.inv() * stretch;
    auto rotBbPts = flatten<2>(transform * bbPts);

    output.push_back(
      {detection.score,
       0,  // global hand detection does not identify left or right hand
       src.viewport,
       src.roi,
       {
         // boundingBox
         rotBbPts[0],  // upper left
         rotBbPts[1],  // upper right
         rotBbPts[2],  // lower left
         rotBbPts[3],  // lower right
       },
       {},
       k});
    auto &d = output.back();
    for (auto pt : detection.locationData.relativeKeypoints) {
      d.points.push_back({pt.x(), pt.y(), 0.0f});
    }
  }

  return output;
}  // namespace c8

}  // namespace c8
