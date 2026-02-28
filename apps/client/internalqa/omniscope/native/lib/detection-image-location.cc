// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"detection-image-location.h"};
  deps = {
    ":detection-image",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:sensors-widgets",
    "//c8:hpoint",
    "//c8:vector",
    "//c8:color",
    "//c8/geometry:egomotion",
    "//c8/geometry:homography",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels:gr8-pyramid",
    "//c8/pixels:pixels",
    "//reality/engine/geometry:image-warp",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:frame-point",
    "//reality/engine/features:image-point",
    "//reality/engine/imagedetection:tracked-image",
    "//reality/engine/tracking:tracker",
  };
}
cc_end(0xa3bcca0c);

#include "apps/client/internalqa/omniscope/native/lib/detection-image-location.h"
#include "apps/client/internalqa/omniscope/native/lib/view-widgets/sensors-widgets.h"
#include "c8/color.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/homography.h"
#include "c8/geometry/intrinsics.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "reality/engine/api/request/precomputed.capnp.h"
#include "reality/engine/geometry/image-warp.h"

namespace c8 {

void getInlierResiduals(
  c8_PixelPinholeCameraModel k,
  const HMatrix &camMotion,
  const Vector<HPoint3> &worldPts,
  const Vector<HPoint2> &camRays,
  const Vector<uint8_t> &inliers,
  Vector<std::pair<HPoint2, HPoint2>> *inlierResiduals) {
  HMatrix K = HMatrixGen::intrinsic(k);
  inlierResiduals->clear();
  inlierResiduals->reserve(worldPts.size());
  auto proj = K * camMotion.inv();
  for (int i = 0; i < worldPts.size(); ++i) {
    if (!inliers[i]) {
      continue;
    }
    inlierResiduals->push_back(
      {(proj * worldPts[i]).flatten(), (K * camRays[i].extrude()).flatten()});
  }
}

void drawDetectedImage(
  const DetectionImage &im,
  c8_PixelPinholeCameraModel k,
  const HMatrix &camMotion,
  RGBA8888PlanePixels dest) {
  drawDetectedImage(im, k, camMotion, {Color::MINT, Color::MANGO, Color::CHERRY}, dest);
}

void drawDetectedImageDark(
  const DetectionImage &im,
  c8_PixelPinholeCameraModel k,
  const HMatrix &camMotion,
  RGBA8888PlanePixels dest) {
  drawDetectedImage(
    im, k, camMotion, {Color::DULL_BLUE, Color::DULL_YELLOW, Color::DARK_RED}, dest);
}

void drawDetectedImage(
  const DetectionImage &im,
  c8_PixelPinholeCameraModel k,
  const HMatrix &camMotion,
  const Vector<Color> &colors,
  RGBA8888PlanePixels dest) {
  if (im.getType() == DetectionImageType::CURVY) {
    drawCurvyImage(k, camMotion, im.getGeometry(), dest);
  } else {
    // Planar
    auto imCorners = imageTargetCornerPixels(im.framePoints().intrinsic(), k, camMotion);
    drawShape(imCorners, 5, colors[0], dest);
    drawShape(imCorners, 3, colors[1], dest);
    drawPoints(imCorners, 5, 5, colors[2], dest);

    auto K = HMatrixGen::intrinsic(k);
    drawAxis(camMotion, K, {0.0f, 0.0f, 1.0f}, 0.3f, dest);
  }
}

void drawDetectedImageInWorld(
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const DetectionImage &detectionImage,
  const HMatrix &pose,
  float scale,
  RGBA8888PlanePixels dest) {
  auto K = HMatrixGen::intrinsic(intrinsics);
  if (detectionImage.getType() == DetectionImageType::CURVY) {
    auto targetPoseFromCamera = pose.inv() * extrinsic;
    drawAnchor(extrinsic, K, pose, 0.3f * scale, dest);
    drawCurvyImageAtScale(
      intrinsics, targetPoseFromCamera, detectionImage.getGeometry(), scale, dest);
  } else {
    // Axis in image
    drawAxis(pose.inv() * extrinsic, K, HPoint3(0.0f, 0.0f, scale), 0.3f, dest);

    auto imCorners = flatten<2>(
      K * extrinsic.inv() * pose
      * cameraFrameCorners(detectionImage.framePoints().intrinsic(), scale));
    drawShape(imCorners, 5, Color::BLUE, dest);
    drawPoints(imCorners, 5, 5, Color::GREEN, dest);
  }
}

Vector<HPoint2> locatedImageCorners(
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const LocatedImage &found) {
  auto K = HMatrixGen::intrinsic(intrinsics);

  Vector<HPoint3> corners = {
    HPoint3{-found.width / 2.0f, -found.height / 2.0f, 0.0f},
    HPoint3{found.width / 2.0f, -found.height / 2.0f, 0.0f},
    HPoint3{found.width / 2.0f, found.height / 2.0f, 0.0f},
    HPoint3{-found.width / 2.0f, found.height / 2.0f, 0.0f},
  };

  return flatten<2>(K * extrinsic.inv() * found.pose * corners);
}

void drawDetectedImageInWorld(
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const LocatedImage &found,
  const DetectionImage &detectionImage,
  RGBA8888PlanePixels dest) {
  auto K = HMatrixGen::intrinsic(intrinsics);
  if (detectionImage.getType() == DetectionImageType::CURVY) {
    drawCurvyImage(intrinsics, found.targetSpace.pose, detectionImage.getGeometry(), dest);
    drawAxis(found.targetSpace.pose, K, HPoint3(0.0f, 0.0f, 0.0f), 0.2f, dest);

    // Visualize the ROI on the cropped curvy
    auto curvyEdgePixelsInSearchPixel =
      curvyTargetEdgePixels(detectionImage.getGeometry(), intrinsics, found.targetSpace.pose);
    drawPoints(curvyEdgePixelsInSearchPixel, 1, Color::CHERRY, dest);
  } else {
    drawAxis(found.pose.inv() * extrinsic, K, HPoint3(0.0f, 0.0f, 0.0f), 0.2f, dest);
    auto imCorners = locatedImageCorners(intrinsics, extrinsic, found);
    drawShape(imCorners, 9, Color::PURPLE, dest);
    drawPoints(imCorners, 5, 5, Color::MINT, dest);
  }
}

void drawDetectedImageTargetTexture(
  const OmniDetectionImage &detectionImage,
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  RGBA8888PlanePixels dest) {
  auto &im = detectionImage.detectionImage();
  if (im.getType() == DetectionImageType::CURVY) {

    ConstRGBA8888PlanePixels texture = detectionImage.previewPix();
    auto geom = im.getFullGeometry();
    geom.srcCols = texture.cols();
    geom.srcRows = texture.rows();

    Vector<HPoint2> texturePtsInTargetImg;
    Vector<Color> colors;
    texturePtsInTargetImg.reserve(texture.cols() * texture.rows());
    colors.reserve(texture.cols() * texture.rows());
    for (int i = 0; i < texture.cols(); i++) {
      for (int j = 0; j < texture.rows(); j++) {
        texturePtsInTargetImg.emplace_back(static_cast<float>(i), static_cast<float>(j));
        colors.push_back(Color::CANARY);
      }
    }
    Vector<HPoint3> pts;
    mapToGeometryPoints(geom, texturePtsInTargetImg, &pts);
    Vector<HVector3> normals;
    mapToGeometryNormals(geom, texturePtsInTargetImg, &normals);
    drawPointCloudWithBackCulling(intrinsics, extrinsic, pts, normals, colors, dest);
  }
}

FrameWithPoints getFeatures(
  c8_PixelPinholeCameraModel k, const Gr8Pyramid &pyramid, Gr8Gl *gr8, DetectionConfig config) {
  FrameWithPoints framePoints(k);
  auto imagePoints = gr8->detectAndCompute(pyramid, framePoints, config);

  {
    // copy output.
    size_t s = imagePoints.size();
    framePoints.clear();
    framePoints.reserve(s);
    for (const auto &f : imagePoints) {
      auto l = f.location();
      framePoints.addImagePixelPoint(
        HPoint2(l.pt.x, l.pt.y), l.scale, l.angle, l.gravityAngle, f.features().clone());
    }
    framePoints.setExcludedEdgePixels(gr8->edgeThreshold());
  }
  return framePoints;
}

Vector<FrameWithPoints> getFeaturesRoi(
  c8_PixelPinholeCameraModel k, const Gr8Pyramid &pyramid, Gr8Gl *gr8, DetectionConfig config) {
  FrameWithPoints framePoints(k);
  auto imagePointsRoi = gr8->detectAndComputeRois(pyramid, framePoints, config);
  Vector<FrameWithPoints> ret;
  for (const auto &imagePoints : imagePointsRoi) {
    ret.emplace_back(k);
    auto &framePoints = ret.back();
    framePoints.setRoi(pyramid.rois[ret.size() - 1].roi);
    // copy output.
    size_t s = imagePoints.size();
    framePoints.clear();
    framePoints.reserve(s);
    for (const auto &f : imagePoints) {
      auto l = f.location();
      framePoints.addImagePixelPoint(
        HPoint2(l.pt.x, l.pt.y), l.scale, l.angle, l.gravityAngle, f.features().clone());
      // NOTE(nb): The effective excluded pixels could be larger based on the ratio of the roi to
      // the full frame. Also, the ROI could bleed over the edge of the image, so the edge threshold
      // may not be valid anyway.
      framePoints.setExcludedEdgePixels(0);
    }
  }
  return ret;
}

double targetRatioInImage(
  const DetectionImage &im, const c8_PixelPinholeCameraModel &k, const HMatrix &camMotion) {
  auto imCorners = imageTargetCornerPixels(im.framePoints().intrinsic(), k, camMotion);
  auto &pt1 = imCorners[0];
  auto &pt2 = imCorners[1];
  auto &pt3 = imCorners[2];
  auto &pt4 = imCorners[3];
  // area of triangle (pt1, pt2, pt3) + area of triangle (pt1, pt3, pt4)
  auto imageTargetArea = 0.5
      * (pt1.x() * (pt2.y() - pt3.y()) + pt2.x() * (pt3.y() - pt1.y())
         + pt3.x() * (pt1.y() - pt2.y()))
    + 0.5
      * (pt1.x() * (pt3.y() - pt4.y()) + pt3.x() * (pt4.y() - pt1.y()) + pt4.x() * (pt1.y() - pt3.y()));
  return -imageTargetArea / (k.pixelsHeight * k.pixelsWidth);
}

double cosineAngle(const HMatrix &current, const HMatrix &next) {
  auto motion = egomotion(current, next);
  HVector3 zForward{0.0f, 0.0f, 1.0f};
  auto zNew = rotationMat(motion) * zForward;
  return zNew.z();
}

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
  MutableRootMessage<XrTrackingState> *statusPtr,
  float latitude,
  float longitude,
  float horizontalAccuracy) {

  MutableRootMessage<RequestSensor> requestSensor;
  fillRequestSensorMessage(
    eventQueue, timeNanos, videoTimeNanos, frameTimeNanos, 0., 0., 0., requestSensor.builder());

  TrackingSensorFrame tsf;
  auto l0 = pyramid.levels[0];
  auto intrinsics = Intrinsics::getProcessingIntrinsics(deviceModel, l0.w, l0.h);
  prepareTrackingSensorFrame(
    deviceModel, deviceManufacturer, intrinsics, requestSensor.reader(), &tsf);
  tsf.pyramid = pyramid;
  tsf.devicePose = devicePose;
  tsf.latitude = latitude;
  tsf.longitude = longitude;
  tsf.horizontalAccuracy = horizontalAccuracy;

  if (statusPtr != nullptr) {
    return tracker->track(tsf, targets, random, statusPtr->builder());
  }

  MutableRootMessage<XrTrackingState> status;
  return tracker->track(tsf, targets, random, status.builder());
}

}  // namespace c8
