// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Rishi Parikh (rishi@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  deps = {
    ":calc-sub-scores",
    "//c8:hpoint",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels/render:renderer",
    "//reality/engine/features:image-descriptor",
    "//reality/engine/imagedetection:detection-image",
  };
}
cc_end(0xd64c414e);

#include "c8/camera/device-infos.h"
#include "c8/geometry/intrinsics.h"
#include "c8/hpoint.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixels.h"
#include "c8/pixels/render/renderer.h"
#include "reality/cloud/imageprocessor/calc-sub-scores.h"
#include "reality/engine/features/image-descriptor.h"
#include "reality/engine/imagedetection/detection-image.h"

namespace c8 {

Vector<HPoint2> computeSimiliarFeaturePoints(
  const DetectionImage &detectionImage, int poorHammingDist) {

  int hammingDist;
  int i = 0;
  Vector<HPoint3> badDescriptorsLocations;
  for (const auto &d1 : detectionImage.framePoints().store().getFeatures<OrbFeature>()) {
    hammingDist = std::numeric_limits<int>::max();
    for (const auto &d2 : detectionImage.framePoints().store().getFeatures<OrbFeature>()) {
      if (&d1 != &d2) {
        hammingDist = std::min(d1.hammingDistance(d2), hammingDist);
      }
    }
    if (hammingDist <= poorHammingDist) {
      const auto pos3d = HMatrixGen::zDegrees(detectionImage.rotation())
        * detectionImage.framePoints().points()[i].position().extrude();
      badDescriptorsLocations.push_back(pos3d);
    }
    i++;
  }
  return flatten<2>(badDescriptorsLocations);
}

RGBA8888PlanePixelBuffer visualizeSimilarityScore(
  const RGBA8888PlanePixels &originalImage,
  const RGBA8888PlanePixels &patch,
  const Vector<HPoint2> &locations) {

  // Pick a reasonable camera model for the read image.
  const int width = originalImage.cols();
  const int height = originalImage.rows();
  auto k = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_XS), width, height);

  // inialize the scene for similarity score.
  // contains a backquad of the original image.
  auto scene = ObGen::scene(width, height);
  auto &backQuad = scene->add(ObGen::backQuad()).setMaterial(MatGen::image());
  backQuad.material().colorTexture()->setRgbaPixels(originalImage);
  GeoGen::flipTextureY(&backQuad.geometry());
  scene->add(ObGen::perspectiveCamera(k, width, height));

  // generate a subscene with a white background as the mask for the similarity image.
  auto &subScene = scene->add(ObGen::subScene("similarity", {{width, height}}));
  auto &backSubScene = subScene.add(ObGen::backQuad());
  backSubScene.geometry().setColor(Color::WHITE);

  // create a quad at each location and set the texture pixels to be patch.
  for (const auto &point : locations) {
    auto &quad = subScene.add(ObGen::quad()).setMaterial(MatGen::image());
    // set blend function to additive to darken overlaid textures.
    quad.material().setBlendFunction(BlendFunction::ADDITIVE);
    // set opacity and transparency of overlaid input textures.
    quad.material().setOpacity(0.5);
    quad.material().setTransparent(true);
    quad.material().colorTexture()->setRgbaPixels(patch);
    quad.setLocal(
      HMatrixGen::translation(point.x(), point.y(), 1.f) * HMatrixGen::scale(0.1f, 0.1f, 1.0f));
  }

  // render the subscene as a texture quad. This will create an overlay / transparent image on top
  // of the original image. Similar feature points will be marked as red dots. Darker dots indicate
  // multiple bad feature points in the same location.
  subScene.add(ObGen::perspectiveCamera(k, width, height));
  auto &quad = scene->add(ObGen::backQuad()).setMaterial(MatGen::image());
  quad.setMaterial(MatGen::subsceneMaterial("similarity"));
  quad.material().setBlendFunction(BlendFunction::ADDITIVE);
  quad.material().setOpacity(0.75);
  quad.material().setTransparent(true);

  Renderer renderer;
  renderer.render(*scene);
  return renderer.result();
}

float similarityScore(const DetectionImage &detectionImage, const Vector<HPoint2> &locations) {
  return (1.f - ((1.f * locations.size()) / detectionImage.framePoints().pixels().size())) * 100;
}
}  // namespace c8
