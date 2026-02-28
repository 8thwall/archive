
/*
 * Visualize a box on an image
 */
#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/geometry:facemesh-data",
    "//reality/engine/faces:face-geometry",
  };
}
cc_end(0x32bf7dc4);

#include <array>
#include <cmath>

#include "c8/c8-log.h"
#include "c8/geometry/facemesh-data.h"
#include "reality/engine/faces/face-geometry.h"

using namespace c8;

// Round to the nearest 0.05.
float rnd(float f) {
  float x20 = std::round(f * 20);
  return x20 / 20;
}

int main(int argc, char *argv[]) {
  HPoint3 minVal;
  HPoint3 maxVal;
  calculateBoundingCube(FACEMESH_SAMPLE_VERTICES, &minVal, &maxVal);
  C8Log("x range: %f -- %f", minVal.x(), maxVal.x());
  C8Log("y range: %f -- %f", minVal.y(), maxVal.y());
  C8Log("z range: %f -- %f", minVal.z(), maxVal.z());

  C8Log("x center: %f", 0.5 * (maxVal.x() + minVal.x()));
  C8Log("y center: %f", 0.5 * (maxVal.y() + minVal.y()));
  C8Log("z center: %f", 0.5 * (maxVal.z() + minVal.z()));

  Vector<HPoint3> leftEyePts{
    FACEMESH_SAMPLE_VERTICES[359],
    FACEMESH_SAMPLE_VERTICES[446],
    FACEMESH_SAMPLE_VERTICES[261],
    FACEMESH_SAMPLE_VERTICES[265],
  };

  C8Log(
    "Eye Y: %f",
    .25 * (leftEyePts[0].y() + leftEyePts[1].y() + leftEyePts[2].y() + leftEyePts[3].y()));

  HPoint3 recCenter{
    rnd(0.5f * (maxVal.x() + minVal.x())),
    rnd(.25f * (leftEyePts[0].y() + leftEyePts[1].y() + leftEyePts[2].y() + leftEyePts[3].y())),
    rnd(minVal.z())};

  // TODO(nb): Investigate why canonical model is not tall enough.
  // radY is currently about 1.4 but it should be closer to 1.7 -- 1.8.
  auto radX = std::max(recCenter.x() - minVal.x(), maxVal.x() - recCenter.x());
  auto radY = std::max(recCenter.y() - minVal.y(), maxVal.y() - recCenter.y());
  auto radZ = std::max(recCenter.z() - minVal.z(), maxVal.z() - recCenter.z());

  C8Log(
    "Recommend anchor center: (x: %f, y: %f, z: %f)", recCenter.x(), recCenter.y(), recCenter.z());

  C8Log(
    "Recommend anchor scale: (x: %f, y: %f, z: %f)",
    rnd(radX / radX),
    rnd(radY / radX),
    rnd(radZ / radX));
}
