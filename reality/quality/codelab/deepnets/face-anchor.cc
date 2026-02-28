// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nathan Waters (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  data = {
    "//third_party/mediapipe/models:face-detection-front",
    "//third_party/mediapipe/models:face-landmark",
  };
  deps = {
    "//c8:c8-log",
    "//c8:string",
    "//c8/camera:device-infos",
    "//c8/geometry:facemesh-data",
    "//c8/geometry:intrinsics",
    "//c8/geometry:mesh-types",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/pixels:draw2",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:gl-pixels",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//reality/engine/ears:ear-types",
    "//reality/engine/faces:face-detector-local",
    "//reality/engine/faces:face-detector-global",
    "//reality/engine/faces:face-geometry",
    "//reality/engine/faces:face-roi-renderer",
    "//reality/engine/faces:face-roi-shader",
  };
}
cc_end(0x0bcfff8f);

#include <array>
#include <cstdio>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/mesh-types.h"
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
#include "reality/engine/ears/ear-types.h"
#include "reality/engine/faces/face-detector-global.h"
#include "reality/engine/faces/face-detector-local.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/faces/face-roi-renderer.h"
#include "reality/engine/faces/face-roi-shader.h"

using namespace c8;

Vector<MeshIndices> BOX_INDICES = {
  {0, 2, 1},
  {2, 3, 1},
  {4, 6, 5},
  {6, 7, 5},
  {4, 5, 1},
  {5, 0, 1},
  {7, 6, 2},
  {6, 3, 2},
  {5, 7, 0},
  {7, 2, 0},
  {1, 3, 4},
  {3, 6, 4},
};

Vector<HPoint3> getBoxPoints(HPoint3 &location, float w) {
  const float x = location.x();
  const float y = location.y();
  const float z = location.z();

  const float hw = w / 2.0f;

  return {
    {x + hw, y + hw, z + hw},
    {x + hw, y + hw, z - hw},
    {x + hw, y - hw, z + hw},
    {x + hw, y - hw, z - hw},
    {x - hw, y + hw, z - hw},
    {x - hw, y + hw, z + hw},
    {x - hw, y - hw, z - hw},
    {x - hw, y - hw, z + hw},
  };
}

FaceDetectorGlobal loadFaceDetector() {
  const String modelFile = "third_party/mediapipe/models/face_detection_front.tflite";
  C8Log("Reading model %s", modelFile.c_str());
  return {readFile(modelFile)};
}

FaceDetectorLocal loadFaceMesher(EarConfig &earConfig) {
  const String modelFile = "third_party/mediapipe/models/face_landmark.tflite";
  C8Log("Reading model %s", modelFile.c_str());
  return {readFile(modelFile), earConfig};
}

void runFaceDetection(const String &filename) {
  C8Log("Reading image %s", filename.c_str());
  auto im = readImageToRGBA(filename);
  auto pix = im.pixels();

  FaceRoiShader shader;
  shader.initialize();

  FaceRoiRenderer renderer;
  renderer.initialize(&shader, pix.cols(), pix.rows());

  auto srcTexture = readImageToLinearTexture(pix);

  renderer.draw(srcTexture.id(), GpuReadPixelsOptions::DEFER_READ);
  renderer.readPixels();
  auto r = renderer.result();

  EarConfig earConfig;
  auto detector = loadFaceDetector();
  auto mesher = loadFaceMesher(earConfig);

  auto intrinsics = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6), pix.cols(), pix.rows());

  auto faces = detector.detectFaces(r.faceDetectImage, intrinsics);

  C8Log("Found %d hits", faces.size());

  // Set the detected faces on the renderer and render again to draw the ROIs.
  renderer.setDetectedFaces(faces);
  renderer.draw(srcTexture.id(), GpuReadPixelsOptions::DEFER_READ);
  renderer.readPixels();
  r = renderer.result();

  auto rayPoints = detectionToRaySpace(faces[0]);
  auto headTransform = computeAnchorTransform(rayPoints);
  Vector<HPoint3> boxPoints = getBoxPoints(headTransform.position, FACE_WIDTH);
  auto projectedPoints = flatten<2>((HMatrixGen::intrinsic(intrinsics) * boxPoints));

  drawMesh(projectedPoints, BOX_INDICES, c8::Color(0, 255, 0), 1, pix);

  String cropPath = "/tmp/crop-0.jpg";
  C8Log("Writing cropped image to %s", cropPath.c_str());
  writePixelsToJpg(r.faceMeshImages[0].image, cropPath);

  String outPath = "/tmp/crop-bbox.jpg";
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
      "    bazel run //reality/quality/codelab/deepnets:face-anchor -- "
      "./reality/engine/deepnets/testdata/crop.jpg\n");
    return -1;
  }
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  {
    ScopeTimer t("face-detect");
    runFaceDetection(argv[1]);
  }
  ScopeTimer::logDetailedSummary();
}
