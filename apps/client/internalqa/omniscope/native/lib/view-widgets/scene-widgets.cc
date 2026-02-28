// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "scene-widgets.h",
  };
  deps = {
    "//c8:hmatrix",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels/render:object8",
    "//reality/engine/features:frame-point",
  };
  visibility = {
    "//apps/client/internalqa/omniscope:__subpackages__",
  };
}
cc_end(0x9b83959e);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/scene-widgets.h"
#include "c8/geometry/intrinsics.h"
#include "c8/hmatrix.h"
#include "c8/pixels/draw3-widgets.h"

namespace c8 {
namespace {
String mayAddPrefix(const String &prefix, const String &name) {
  if (prefix.empty()) {
    return name;
  }

  return prefix + "-" + name;
}
}  // namespace

void initializeCameraExtrinsic(
  const HMatrix &extrinsic,
  Camera *camera,
  bool *shouldInitWorldSceneCameraExtrinsic,
  const HMatrix &transform) {
  if (*shouldInitWorldSceneCameraExtrinsic) {
    *shouldInitWorldSceneCameraExtrinsic = false;
    camera->setLocal(extrinsic * transform);
  }
}

void initWorldScene(
  Scene *worldScene,
  DeviceInfos::DeviceModel deviceModel,
  int viewportWidth,
  int viewportHeight,
  bool extraWideIntrinsics) {
  // Create a scene camera with field of view matched to the device, initially placed to the left
  // and forward of the user's starting position so that we can see the user's camera as the scene
  // starts.
  auto captureIntrinsics = Intrinsics::getCameraIntrinsics(deviceModel);
  auto wideFlScale = extraWideIntrinsics
    ? static_cast<float>(viewportHeight) / static_cast<float>(viewportWidth)
    : 1.f;
  captureIntrinsics.focalLengthHorizontal *= wideFlScale;
  captureIntrinsics.focalLengthVertical *= wideFlScale;
  worldScene->add(
    ObGen::positioned(
      ObGen::perspectiveCamera(captureIntrinsics, viewportWidth, viewportHeight),
      HMatrixGen::translation(-5.0f, 1.0f, 2.0f) * HMatrixGen::zDegrees(-15.0f)
        * HMatrixGen::yDegrees(90.0f)));

  worldScene->add(quadrantLights());

  // Create the environment background.
  auto &backQuad = worldScene->add(ObGen::named(ObGen::backQuad(), "environment"))
                     .setMaterial(MatGen::colorOnly());
  backQuad.geometry().setColors({Color::GRAY_03, Color::GRAY_04, Color::GRAY_05, Color::GRAY_05});

  // Create an axis visualization.
  worldScene->add(ObGen::named(orientedPoint({0.0f, -1.0f, 1.0f}, {}, 0.5f), "origin"));

  // Add floor visualization.
  worldScene->add(
    ObGen::named(
      ObGen::positioned(groundLineGrid(11, 1.0f), HMatrixGen::translateY(-1.001f)), "ground"));
}

void initCameraScene(
  Scene *cameraScene, DeviceInfos::DeviceModel deviceModel, int viewportWidth, int viewportHeight) {
  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  auto captureIntrinsics = Intrinsics::getCameraIntrinsics(deviceModel);
  cameraScene->add(ObGen::perspectiveCamera(captureIntrinsics, viewportWidth, viewportHeight));

  cameraScene->add(quadrantLights());

  // Add the background camera feed. This needs to have y inverted because the input texture was
  // inverted.
  cameraScene
    ->add(
      ObGen::positioned(ObGen::named(ObGen::backQuad(), "camerafeed"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  // Create an axis visualization.
  cameraScene->add(ObGen::named(orientedPoint({0.0f, -1.0f, 1.0f}, {}, 0.5f), "origin"));
}

void initWorldPoints(Object8 *parent, const String &prefix) {
  parent->add(ObGen::named(ObGen::pointCloud({}), mayAddPrefix(prefix, "undead")))
    .setEnabled(false);
  parent->add(ObGen::named(ObGen::pointCloud({}), mayAddPrefix(prefix, "recent-ground")));
  parent->add(ObGen::named(ObGen::pointCloud({}), mayAddPrefix(prefix, "tenured-ground")));
  parent->add(ObGen::named(ObGen::pointCloud({}), mayAddPrefix(prefix, "recent-triangulated")));
  parent->add(ObGen::named(ObGen::pointCloud({}), mayAddPrefix(prefix, "tenured-triangulated")));
  parent->add(ObGen::named(ObGen::pointCloud({}), mayAddPrefix(prefix, "recent-sky")));
  parent->add(ObGen::named(ObGen::pointCloud({}), mayAddPrefix(prefix, "tenured-sky")));
  parent->add(ObGen::named(ObGen::pointCloud({}), mayAddPrefix(prefix, "recent-depth")));
  parent->add(ObGen::named(ObGen::pointCloud({}), mayAddPrefix(prefix, "tenured-depth")));
  parent->add(ObGen::named(ObGen::pointCloud({}), mayAddPrefix(prefix, "cloud")));
}

}  // namespace c8
