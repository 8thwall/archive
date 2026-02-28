// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <utility>

#include "apps/client/internalqa/omniscope/native/lib/detection-image.h"
#include "c8/color.h"
#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/pixels/gr8-pyramid.h"
#include "c8/pixels/pixels.h"
#include "c8/quaternion.h"
#include "c8/vector.h"
#include "reality/engine/api/reality.capnp.h"
#include "reality/engine/features/frame-point.h"
#include "reality/engine/features/gr8gl.h"
#include "reality/engine/features/image-point.h"
#include "reality/engine/imagedetection/tracked-image.h"
#include "reality/engine/tracking/tracker.h"

namespace c8 {

void getInlierResiduals(
  c8_PixelPinholeCameraModel k,
  const HMatrix &camMotion,
  const Vector<HPoint3> &worldPts,
  const Vector<HPoint2> &camRays,
  const Vector<uint8_t> &inliers,
  Vector<std::pair<HPoint2, HPoint2>> *inlierResiduals);

Vector<HPoint2> locatedImageCorners(
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const LocatedImage &found);

void drawDetectedImage(
  const DetectionImage &im,
  c8_PixelPinholeCameraModel k,
  const HMatrix &camMotion,
  RGBA8888PlanePixels dest);

void drawDetectedImageDark(
  const DetectionImage &im,
  c8_PixelPinholeCameraModel k,
  const HMatrix &camMotion,
  RGBA8888PlanePixels dest);

void drawDetectedImage(
  const DetectionImage &im,
  c8_PixelPinholeCameraModel k,
  const HMatrix &camMotion,
  const Vector<Color> &colors,
  RGBA8888PlanePixels dest);

// Only work for planar
void drawDetectedImageInWorld(
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const DetectionImage &detectionImage,
  const HMatrix &pose,
  float scale,
  RGBA8888PlanePixels dest);

// Draw taking into account the image geometry
void drawDetectedImageInWorld(
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const LocatedImage &found,
  const DetectionImage &detectionImage,
  RGBA8888PlanePixels dest);

// Draw detection image full geometry texture
// Only applicable to CURVY image target
void drawDetectedImageTargetTexture(
  const OmniDetectionImage &detectionImage,
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  RGBA8888PlanePixels dest);

// Get the features from the pyramid.
FrameWithPoints getFeatures(
  c8_PixelPinholeCameraModel k,
  const Gr8Pyramid &pyramid,
  Gr8Gl *gr8,
  DetectionConfig config = DETECTION_CONFIG_ALL_ORB_GORB);

// Get the features of ROIs from the pyramid.
Vector<FrameWithPoints> getFeaturesRoi(
  c8_PixelPinholeCameraModel k,
  const Gr8Pyramid &pyramid,
  Gr8Gl *gr8,
  DetectionConfig config = DETECTION_CONFIG_ALL_ORB_GORB);

double targetRatioInImage(
  const DetectionImage &im, const c8_PixelPinholeCameraModel &k, const HMatrix &pose);

double cosineAngle(const HMatrix &current, const HMatrix &next);

HMatrix executeTracker(
  Tracker *tracker,
  DetectionImagePtrMap targets,
  RandomNumbers *random,
  const DeviceInfos::DeviceModel &deviceModel,
  const String &deviceManufacturer,
  const FrameWithPoints &frame,
  const Vector<FrameWithPoints> &roiFrame,
  const Gr8Pyramid &pyramid,
  Quaternion devicePose,
  RequestPose::Reader eventQueue,
  int64_t timeNanos,
  int64_t videoTimeNanos,
  int64_t frameTimeNanos,
  MutableRootMessage<XrTrackingState> *statusPtr = nullptr,
  float latitude = 0.f,
  float longitude = 0.f,
  float horizontalAccuracy = 0.f);

}  // namespace c8
