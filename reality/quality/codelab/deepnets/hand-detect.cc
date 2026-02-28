// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Tri Chu (tri@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  data = {
    "//third_party/mediapipe/models:palm-detection",
    "//third_party/mediapipe/models:hand-landmark",
  };
  deps = {
    "//c8:c8-log",
    "//c8:string",
    "//c8/camera:device-infos",
    "//c8/geometry:facemesh-data",
    "//c8/geometry:intrinsics",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/pixels:draw2",
    "//c8/pixels:gl-pixels",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//reality/engine/hands:hand-tracker",
    "//reality/engine/faces:face-geometry",
    "//reality/engine/hands:hand-roi-renderer",
    "//reality/engine/hands:hand-types",
    "//reality/engine/faces:face-roi-shader",
  };
}
cc_end(0xa4c95dd1);

#include <array>
#include <cstdio>
#include <sstream>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/gl-pixels.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/stats/scope-timer.h"
#include "c8/string.h"
#include "c8/string/format.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/faces/face-roi-shader.h"
#include "reality/engine/hands/hand-detector-local-mediapipe.h"
#include "reality/engine/hands/hand-roi-renderer.h"
#include "reality/engine/hands/hand-tracker.h"
#include "reality/engine/hands/hand-types.h"

using namespace c8;

constexpr const char *PALM_MODEL_FILE = "third_party/mediapipe/models/palm_detection_lite.tflite";
constexpr const char *HAND_MODEL_FILE = "third_party/mediapipe/models/hand_landmark_lite.tflite";

void drawDetections(const Vector<DetectedPoints> &hands, RGBA8888PlanePixels im) {
  auto w = im.cols();
  auto h = im.rows();
  auto d = detectionToImageSpace(hands);
  for (const auto &f : d) {
    auto bb = f.boundingBox;
    Vector<HPoint2> box = {
      {bb.upperLeft.x() * w, bb.upperLeft.y() * h},
      {bb.upperRight.x() * w, bb.upperRight.y() * h},
      {bb.lowerRight.x() * w, bb.lowerRight.y() * h},
      {bb.lowerLeft.x() * w, bb.lowerLeft.y() * h},
    };
    drawShape(box, 1, Color::CHERRY, im);
    for (auto pt : f.points) {
      drawPoint({pt.x() * w, pt.y() * h}, 3, Color::MINT, im);
    }
  }
}

String viewportStr(ImageViewport v) {
  return format("{ x: %f, y: %f, w: %f, h: %f }", v.x, v.y, v.w, v.h);
}

String imageStr(ConstPixels p) {
  return format(
    "{ rows: %d, cols: %d, rowBytes: %d, pixels: %p }",
    p.rows(),
    p.cols(),
    p.rowBytes(),
    p.pixels());
}

String detectionRoiStr(const DetectionRoi &roi, const String &indent) {
  auto r = roi.warp;
  std::stringstream s;
  s << "{" << std::endl;
  s << indent << "  id: " << roi.faceId << std::endl;
  s << indent << "  warp: {" << std::endl;
  s << indent << format("    {%f, %f, %f, %f},", r(0, 0), r(0, 1), r(0, 2), r(0, 3)) << std::endl;
  s << indent << format("    {%f, %f, %f, %f},", r(1, 0), r(1, 1), r(1, 2), r(1, 3)) << std::endl;
  s << indent << format("    {%f, %f, %f, %f},", r(2, 0), r(2, 1), r(2, 2), r(2, 3)) << std::endl;
  s << indent << format("    {%f, %f, %f, %f},", r(3, 0), r(3, 1), r(3, 2), r(3, 3)) << std::endl;
  s << indent << "  }" << std::endl;
  s << indent << "}";
  return s.str();
}

String renderedSubImageStr(const RenderedSubImage &r, const String &indent) {
  std::stringstream s;
  s << "{" << std::endl;
  s << indent << "  viewport: " << viewportStr(r.viewport) << std::endl;
  s << indent << "  image: " << imageStr(r.image) << std::endl;
  s << indent << "  roi: " << detectionRoiStr(r.roi, indent + "  ") << std::endl;
  s << indent << "}";
  return s.str();
}

String renderResultStr(const HandRenderResult &r) {
  std::stringstream s;
  s << "{" << std::endl;
  s << "  rawPixels: " << imageStr(r.rawPixels) << std::endl;
  s << "  handDetectImage: " << renderedSubImageStr(r.handDetectImage, "  ") << std::endl;

  for (int i = 0; i < r.handMeshImages.size(); ++i) {
    s << "  handMeshImages[" << i << "]: " << renderedSubImageStr(r.handMeshImages[i], "  ")
      << std::endl;
  }
  s << "}" << std::endl;
  return s.str();
}

Vector<uint8_t> loadPalmModel() {
  C8Log("Reading model %s", PALM_MODEL_FILE);
  return readFile(PALM_MODEL_FILE);
}

Vector<uint8_t> loadHandModel() {
  C8Log("Reading model %s", HAND_MODEL_FILE);
  return readFile(HAND_MODEL_FILE);
}

void runHandDetection(const String &filename) {
  C8Log("Reading image %s", filename.c_str());
  auto im = readImageToRGBA(filename);
  auto pix = im.pixels();

  auto k = Intrinsics::cropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6), pix.cols(), pix.rows());

  FaceRoiShader shader;
  shader.initialize();

  HandRoiRenderer renderer(HAND_DETECTION_INPUT_SIZE);
  renderer.initialize(&shader, pix.cols(), pix.rows(), HAND_LANDMARK_DETECTION_INPUT_SIZE);

  auto srcTexture = readImageToLinearTexture(pix);

  renderer.draw(srcTexture.id(), GpuReadPixelsOptions::DEFER_READ);
  renderer.readPixels();
  auto r = renderer.result();

  HandTracker tracker;
  tracker.setPalmDetectModel(loadPalmModel());
  tracker.setHandDetectModel(loadHandModel());
  tracker.setMaxTrackedHands(2);

  // Run tracking on the first render, which only has a global roi.
  auto result = tracker.track(r, k);
  C8Log(
    "First run %d local hits, %d global hits",
    result.localHands->size(),
    result.globalHands->size());

  // Set the detected hands on the renderer and render again to draw the ROIs.
  // We want to use the output of the hand mesh to refine the aspect ratio of the hand. Run a few
  // times to allow the mesh to settle.
  for (int i = 0; i < 5; ++i) {
    renderer.setDetectedHands(
      result.localHands->empty() ? *result.globalHands : *result.localHands);
    renderer.draw(srcTexture.id(), GpuReadPixelsOptions::DEFER_READ);
    renderer.readPixels();
    r = renderer.result();
    // Run tracking on the second render, which has local regions of interest.
    result = tracker.track(r, k);
    C8Log(
      "Found %d local hits, %d global hits", result.localHands->size(), result.globalHands->size());
  }

  // Write the crops and ROI to files to help generate data for unit tests.
  int cropIdx = 0;
  for (const auto &rim : r.handMeshImages) {
    String cropPath = format("/tmp/crop-%d.jpg", cropIdx++);
    C8Log("Writing cropped image to %s", cropPath.c_str());
    writePixelsToJpg(rim.image, cropPath);
  }

  C8Log("render: %s", renderResultStr(r).c_str());

  String roiPath = "/tmp/roi.jpg";
  C8Log("Writing rendered image to %s", roiPath.c_str());
  writePixelsToJpg(r.rawPixels, roiPath);

  drawDetections(*result.localHands, im.pixels());

  String outPath = "/tmp/detections.jpg";
  C8Log("Writing cropped image to %s", outPath.c_str());
  writePixelsToJpg(im.pixels(), outPath);
}

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "crop usage:\n"
      "    bazel run //reality/quality/codelab/deepnets:hand-detect -- /path/to/img.jpg\n");
    return -1;
  }
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  {
    ScopeTimer t("hand-detect");
    runHandDetection(argv[1]);
  }
  ScopeTimer::logDetailedSummary();
}
