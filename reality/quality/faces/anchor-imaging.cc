
/*
 * Visualize a box on an image
 */
#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:hpoint",
    "//c8:color",
    "//c8:hpoint",
    "//c8:hmatrix",
    "//c8:vector",
    "//c8:c8-log",
    "//c8/camera:device-infos",
    "//c8/geometry:egomotion",
    "//c8/geometry:face-types",
    "//c8/geometry:facemesh-data",
    "//c8/geometry:intrinsics",
    "//c8/geometry:mesh-types",
    "//c8/io:image-io",
    "//c8/pixels:draw2",
    "//reality/quality/visualization/render:ui2",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0xc5200bbb);

#include <array>
#include <cmath>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/color.h"
#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/face-types.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/mesh-types.h"
#include "c8/io/image-io.h"
#include "c8/pixels/draw2.h"
#include "c8/vector.h"
#include "reality/quality/visualization/render/ui2.h"

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

void visualizeBox(const String &inputFile) {
  RGBA8888PlanePixelBuffer imgBuffer = readImageToRGBA(inputFile);
  auto pixels = imgBuffer.pixels();
  auto intrinsic = Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6);
  intrinsic = Intrinsics::rotateCropAndScaleIntrinsics(intrinsic, pixels.cols(), pixels.rows());
  auto K = HMatrixGen::intrinsic(intrinsic);

  HPoint3 boxCentroid = {0.0f, 0.0f, 0.0f};
  Vector<HPoint3> boxPoints = getBoxPoints(boxCentroid, FACE_WIDTH);

  auto camera = cameraMotion(HPoint3{0.0f, 0.5f, 2.0f}, {0, 0, 1, 0});

  while (true) {
    auto projectedPoints = flatten<2>((K * camera.inv() * boxPoints));

    for (auto face : BOX_INDICES) {
      const auto pointA = projectedPoints[face.a];
      const auto pointB = projectedPoints[face.b];
      const auto pointC = projectedPoints[face.c];

      c8::drawLine(pointA, pointB, 2, c8::Color(0, 255, 0), pixels);
      c8::drawLine(pointB, pointC, 2, c8::Color(0, 255, 0), pixels);
      c8::drawLine(pointC, pointA, 2, c8::Color(0, 255, 0), pixels);
    }

    c8::drawPoints(projectedPoints, 5, c8::Color(255, 0, 0), pixels);

    c8::show("Visualizing box", pixels);
    c8::waitKey(0);
  }
}

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "anchor-imaging usage:\n"
      "    bazel run //reality/quality/faces:anchor-imaging -- /path/to/img.png\n");
    return -1;
  }

  visualizeBox(argv[1]);
}
