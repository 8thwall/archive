// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"load-image-targets.h"};
  deps = {
    "//apps/client/internalqa/omniscope/native/lib:detection-image",
    "//c8:map",
    "//c8:string",
    "//c8:vector",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/io:image-io",
    "//reality/engine/features:gr8-feature-shader",
  };
}
cc_end(0x87d3e6e7);

#include "apps/client/internalqa/omniscope/imgui/load-image-targets.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/image-io.h"

namespace c8 {

struct StaticTargetConfig {
  bool isStaticTarget;
  float rollAngle;
  float pitchAngle;
};

struct SpecWithDimension {
  int cropWidth;
  int cropHeight;
  CurvySpec spec;
};

const Vector<String> files = {
  "a-sunday-on-la-grande-jatte-seurat.jpg",
  // "a-sunday-on-la-grande-jatte-seurat_rotated.jpg",
  // "biz-card.png",
  // "claude-monet-painting-in-his-garden-at-argenteuil-renoir.jpg",
  // "cornhole.jpg",
  // "crystal-dew.jpg",
  // "diamond.jpg",
  // "dragon.jpg",
  // "flower-big.jpg",
  // "icon-ar-camera.png",
  // "inspectorstest.jpg",
  // "mona-lisa-da-vinci.jpg",
  // "osha.jpg",
  // "pop-space.png",
  // "postcard.png",
  // "rocket-website.png",
  // "starry-night-van-gough.jpg",
  // "sunglasses-big.jpg",
  // "tulip-fields-in-holland-monet.jpg",
  // "dumelaBrew.jpg",
  "tully.jpg",
  // "tully_rotated.jpg",
  // "tyrell.jpg",
  // "19Crime.jpg",
  // "saxjensen.jpg",
  // "amity.jpg",
  // "19CrimeFull.jpg",
  // "unconedTeaParty_l530t0w486h648.jpg",
};

const TreeMap<String, bool> planarImageToIsRotated = {
  {"a-sunday-on-la-grande-jatte-seurat_rotated.jpg", true},
};

const TreeMap<String, StaticTargetConfig> imageToStaticTargetConfig = {
  {"a-sunday-on-la-grande-jatte-seurat.jpg", {false, 0.0f, 0.0f}},
  {"mona-lisa-da-vinci.jpg", {false, 0.0f, 0.0f}},
};

const TreeMap<String, SpecWithDimension> imageToSpec = {
  {"flower-big.jpg", {1440, 1920, {0.6f}}},
  {"tyrell.jpg", {670, 862, {0.32692f}}},
  {"tully.jpg", {743, 960, {0.32692f}}},
  {"tully_rotated.jpg", {480, 640, {0.32692f, true, {1.791f, 1.0406f, 0.3354f, 0.0054f}, 1.f}}},
  {"saxjensen.jpg", {1604, 785, {0.9286f}}},
  {"amity.jpg", {1092, 1278, {0.38}}},
  {"19CrimeFull.jpg", {767, 1291, {0.38}}},
  {"unconedTeaParty_l530t0w486h648.jpg",
   {486, 648, {1.0, false, {3.271984, 1.0, 0.20125, 0.0}, 1.4}}},
};

OmniDetectionImage loadImageTargetFile(
  const String &file, Gr8FeatureShader *glShader, DeviceInfos::DeviceModel model) {
  String fullpath = "apps/client/internalqa/omniscope/opencv/img/" + file;
  OmniDetectionImage dim;
  RGBA8888PlanePixelBuffer imbuffer;

  imbuffer = readImageToRGBA(fullpath);
  C8Log(
    "[omniscope] Image %s had size %dx%d",
    file.c_str(),
    imbuffer.pixels().rows(),
    imbuffer.pixels().cols());

  auto im = imbuffer.pixels();
  if (im.rows() == 0 || im.cols() == 0) {
    C8Log("[omniscope] Couldn't read image: %s", fullpath.c_str());
    return dim;
  }

  // We call DetectionImageLoader's initialize with the PLANAR geometry, which will put the
  // loader into an incomplete state for CURVY image targets. We set the correct
  // geometry and object pose afterward.
  MutableRootMessage<ImageTargetMetadata> imageTargetMetadata;
  imageTargetMetadata.builder().setType(ImageTargetTypeMsg::PLANAR);
  imageTargetMetadata.builder().setName(file);
  imageTargetMetadata.builder().setImageWidth(im.cols());
  imageTargetMetadata.builder().setImageHeight(im.rows());

  auto pIsRotated = planarImageToIsRotated.find(file);
  if (pIsRotated != planarImageToIsRotated.end()) {
    C8Log(
      "[omniscope] Setting planar target %s isRotated's value to %d ",
      file.c_str(),
      pIsRotated->second);
    imageTargetMetadata.builder().setIsRotated(pIsRotated->second);
  }

  auto pStaticTargetConfig = imageToStaticTargetConfig.find(file);
  if (pStaticTargetConfig != imageToStaticTargetConfig.end()) {
    C8Log(
      "[omniscope] Setting static target for %s to %d",
      file.c_str(),
      pStaticTargetConfig->second.isStaticTarget);
    imageTargetMetadata.builder().setIsStaticTarget(pStaticTargetConfig->second.isStaticTarget);
    C8Log(
      "[omniscope] Setting target roll angle for %s to %f",
      file.c_str(),
      pStaticTargetConfig->second.rollAngle);
    imageTargetMetadata.builder().setRollAngle(pStaticTargetConfig->second.rollAngle);
    C8Log(
      "[omniscope] Setting target pitch angle for %s to %f",
      file.c_str(),
      pStaticTargetConfig->second.pitchAngle);
    imageTargetMetadata.builder().setPitchAngle(pStaticTargetConfig->second.pitchAngle);
  }

  auto spec = imageToSpec.find(file);
  if (spec != imageToSpec.end()) {
    C8Log("[omniscope] Loading %s with curvy geometry", file.c_str());
    SpecWithDimension specWithDim = spec->second;
    // Set ImageTargetMetadata isRotated so detection-image-loader initializes k_
    imageTargetMetadata.builder().setIsRotated(specWithDim.spec.isRotated);
    dim.initialize(glShader, imageTargetMetadata.reader(), Intrinsics::getCameraIntrinsics(model));
    dim.setGeometry(specWithDim.cropWidth, specWithDim.cropHeight, specWithDim.spec);
  } else {
    dim.initialize(glShader, imageTargetMetadata.reader(), Intrinsics::getCameraIntrinsics(model));
  }
  dim.imTexture().bind();
  dim.imTexture().setPixels(im.pixels());
  dim.imTexture().unbind();
  dim.processBlocking();
  return dim;
}

Vector<String> targetFiles() { return files; }

}  // namespace c8
