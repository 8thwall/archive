// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Rishi Parikh (rishi@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {

  visibility = {
    "//visibility:public",
  };
  deps = {
    ":calc-sub-scores",
    ":detect-img",
    "//c8:hpoint",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//c8/pixels/render:renderer",
  };
}
cc_end(0xb3128245);

#include "c8/hpoint.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/pixels.h"
#include "c8/pixels/render/renderer.h"
#include "reality/cloud/imageprocessor/calc-sub-scores.h"
#include "reality/cloud/imageprocessor/detect-img.h"

constexpr int SCENE_WIDTH = 480;
constexpr int SCENE_HEIGHT = 640;

/**
 * Calculates the individual detection score given a particular scene and camera position.
 * Modifies a generated scene to update to a new camera position camPos.
 * Returns a score between 0-4. Each corner that is over 20 pixels away from the true corenr is one
 * less point.
 * @param camPos HMatrix representing the new camera location to move to.
 * @param scene Pointer to the scene containing the background and target image.
 * @param Camera the camera pointer in scene to modify.
 * @param c8_PixelPinholeCameraModel the camera model used to generate the scene. Allows for the
 * program to compute where the quad position should be in pixelspace.
 * @param RGBA8888PlanePixels the original image to detect.
 * @param quadPos the location of the quadPos in scene.
 */
int calcSinglePoseScore(
  const HMatrix &camPos,
  const RGBA8888PlanePixels &originalImage,
  const HMatrix &quadPos,
  Scene &scene,
  Camera *camera,
  c8_PixelPinholeCameraModel k,
  Vector<String> &outPaths,
  Vector<RGBA8888PlanePixelBuffer> *detectedImages) {
  // initialize the renderer.
  Renderer renderer;
  // By default the score is 4.
  int detectionScore = 4;
  camera->setLocal(camPos);
  auto K = HMatrixGen::intrinsic(k);
  // calculate the real positions of the quad vertices/corners using camera position and intrinsics.
  Vector<HPoint3> corners = {
    {-1.0f, -1.0f, 0.0f}, {-1.0f, 1.0f, 0.0f}, {1.0f, 1.0f, 0.0f}, {1.0f, -1.0f, 0.0f}};
  const auto indices = flatten<2>(K * camPos.inv() * quadPos * corners);

  renderer.render(scene);
  auto renderedScene = renderer.result();

  {
    ScopeTimer t("detect-features");
    auto foundCorners = detectImageInScene(
      originalImage, renderedScene.pixels(), &outPaths, detectedImages);
    // if 4 corners were not found, the image was not detected.
    if (foundCorners.size() != 4) {
      return 0;
    }

    // iterate over the found and real corners to see if the target location was correct.
    for (const auto &pt1 : indices) {
      double dist = std::numeric_limits<double>::infinity();
      for (const auto &pt2 : foundCorners) {
        dist = std::min(dist, std::pow((pt1.x() - pt2.x()), 2) + std::pow((pt1.y() - pt2.y()), 2));
      }
      // for every corner that is off by a distance of over 20
      // (20 ^ 2 = 400) the score decreases by 1.
      if (dist > 400) {
        detectionScore --;
      }
    }
  }
  return detectionScore * 5;
}

namespace c8 {

void calcDetectionScore(
  const RGBA8888PlanePixels &originalImage,
  const RGBA8888PlanePixels &background,
  Vector<RGBA8888PlanePixelBuffer> *detectedImages,
  float *detectionScore) {
  *detectionScore = 0;
  // Pick a reasonable camera model for the read image.
  auto k = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_XS), SCENE_WIDTH, SCENE_HEIGHT);

  auto scene = ObGen::scene(SCENE_WIDTH, SCENE_HEIGHT);
  // Attach the background image to the backquad.
  auto &backquad = scene->add(ObGen::backQuad()).setMaterial(MatGen::image());
  backquad.material().colorTexture()->setRgbaPixels(background);
  GeoGen::flipTextureY(&backquad.geometry());

  auto &quad = scene->add(ObGen::quad()).setMaterial(MatGen::image());
  quad.material().colorTexture()->setRgbaPixels(originalImage);
  auto quadPos = HMatrixGen::scale(1.f * originalImage.cols() / originalImage.rows(), 1, 1);
  // if the image is of landscape orientation we must scale the image differently to prevent
  // the image from being too large when rendered in the scene.
  if (originalImage.cols() > originalImage.rows()) {
    quadPos = HMatrixGen::scale(1., 1. * originalImage.rows() / originalImage.cols(), 1);
  }
  quad.setLocal(quadPos);
  // flip the quad texture.
  GeoGen::flipTextureY(&quad.geometry());
  auto &camera = scene->add(ObGen::perspectiveCamera(k, SCENE_WIDTH, SCENE_HEIGHT));

  // Outpaths is the list of paths to save the images for later use/testing
  Vector<String> outPaths;
  // various camera angles and positions to try and detect the image from.
  // randomly positions that ensures the target image is fully visible in the scene.
  // tested on both vertical and horizontal (then rotated) images.
  Vector<HMatrix> cameraPositions = {
    {HMatrixGen::translation(-.25f, -1.f, -3.5f) * HMatrixGen::rotationD(-25., 12., -7.)},
    {HMatrixGen::translation(.15f, -.2f, -4.5f) * HMatrixGen::rotationD(10., -11., 13.)},
    {HMatrixGen::translation(-.25f, -1.3f, -3.5f) * HMatrixGen::rotationD(-20., 14., 7.)},
    {HMatrixGen::translation(-.2f, -.9f, -4.f) * HMatrixGen::rotationD(-11., 12., -13.)},
    {HMatrixGen::translation(0.f, 0.f, -3.f) * HMatrixGen::rotationD(0., 0., 0.)}};
  // iterate over each camera position to try and find image.
  // For each image a score of up to 4 can be reached, 4 meaning that the image was located in the
  // correct coordinates.
  for (const auto &camPos : cameraPositions) {
    *detectionScore += calcSinglePoseScore(
      camPos, originalImage, quadPos, *scene, &camera, k, outPaths, detectedImages);
  }
  // TODO(Rishi) Pass in a single buffer instead of the vector.
}
}  // namespace c8
