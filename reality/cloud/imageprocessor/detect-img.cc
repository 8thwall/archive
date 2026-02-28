// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Rishi Parikh (rishi@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"detect-img.h"};
  visibility = {
    "//visibility:public",
  };
  deps = {
    "//c8:c8-log",
    "//c8:random-numbers",
    "//c8:string",
    "//c8/camera:device-infos",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
    "//c8/string:format",
    "//c8/string:join",
    "//c8/io:image-io",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/stats:scope-timer",
    "//reality/engine/features:feature-detector",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/geometry:image-warp",
    "//reality/engine/geometry:pose-pnp",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
    "//reality/engine/imagedetection:location",
    "//reality/engine/imagedetection:tracked-image",
    "//reality/engine/features:tracker-input",
  };
}
cc_end(0x2c74f662);

#include <array>
#include <cstdio>
#include <fstream>
#include <iostream>
#include <sstream>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/image-io.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/random-numbers.h"
#include "c8/string.h"
#include "c8/string/format.h"
#include "c8/string/join.h"
#include "reality/cloud/imageprocessor/detect-img.h"
#include "reality/engine/features/feature-detector.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/tracker-input.h"
#include "reality/engine/geometry/image-warp.h"
#include "reality/engine/geometry/pose-pnp.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image.h"
#include "reality/engine/imagedetection/location.h"
#include "reality/engine/imagedetection/tracked-image.h"

namespace c8 {

namespace {

// Extract features using DetectionImageLoader, and draw the extracted pyramid and overlayed feature
// points to files.
DetectionImage extractTargetFeatures(
  const RGBA8888PlanePixels &targetImg,
  c8_PixelPinholeCameraModel k,
  DetectionImageLoader *loader,
  Gr8FeatureShader *shader) {

  // If the image is landscape, it will get rotated for extraction, but the detection image loader
  // doesn't rotate the intrinsics. It's probably best to fix this in the DetectionImageLoader, but
  // we'd need to make sure that it is safe.
  if (targetImg.cols() > targetImg.rows()) {
    k = Intrinsics::rotateCropAndScaleIntrinsics(k, targetImg.rows(), targetImg.cols());
  }
  MutableRootMessage<ImageTargetMetadata> imageTargetMetadata;
  imageTargetMetadata.builder().setType(ImageTargetTypeMsg::PLANAR);
  imageTargetMetadata.builder().setName("image-detect-in-scene");
  imageTargetMetadata.builder().setImageWidth(targetImg.cols());
  imageTargetMetadata.builder().setImageHeight(targetImg.rows());

  loader->initialize(shader, imageTargetMetadata.reader(), k);
  loader->imTexture().bind();
  loader->imTexture().setPixels(targetImg.pixels());
  loader->imTexture().unbind();
  loader->processGpu();
  loader->readDataToCpu();
  return loader->extractFeatures();
}

// Copied from DetectionImageTracker methods.
LocatedImage locate(
  const String &targetFile,
  const HMatrix &poseFromTarget,
  const DetectionImage &t,
  const HMatrix &camPos,
  float scale,
  c8_PixelPinholeCameraModel searchK) {
  ImageRoi roi = {
    ImageRoi::Source::IMAGE_TARGET,
    0,
    targetFile,
    glImageTargetWarp(t.framePoints().intrinsic(), searchK, poseFromTarget)};
  auto pose = updateWorldPosition(camPos, scaleTranslation(scale, poseFromTarget.inv()));

  HPoint3 origin{0.0f, 0.0f, scale};
  HPoint3 impos = pose * origin;
  auto imrot = Quaternion::fromHMatrix(pose);

  HPoint2 llb;
  HPoint2 urb;
  t.framePoints().frameBounds(&llb, &urb);
  return {
    cameraMotion(impos, imrot), (urb.x() - llb.x()) * scale, (urb.y() - llb.y()) * scale, roi};
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

Vector<HPoint2> drawDetectedImageInWorld(
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const LocatedImage &found,
  RGBA8888PlanePixels dest) {
  // Axis in image
  auto K = HMatrixGen::intrinsic(intrinsics);
  drawAxis(found.pose.inv() * extrinsic, K, HPoint3(0.0f, 0.0f, 0.0f), 0.2f, dest);

  auto imCorners = locatedImageCorners(intrinsics, extrinsic, found);

  drawShape(imCorners, 1, Color::PURPLE, dest);
  drawPoints(imCorners, 2, 2, Color::MINT, dest);
  return imCorners;
}

std::vector<HPoint2> drawDetectedImage(
  ConstRGBA8888PlanePixels pix,
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const LocatedImage &found,
  const String &name,
  Vector<String> *outPaths,
  RGBA8888PlanePixelBuffer &pixCopyBuf) {
  drawImageChannelGray(pix, 0, pixCopyBuf.pixels());
  auto imCorners = drawDetectedImageInWorld(intrinsics, extrinsic, found, pixCopyBuf.pixels());
  return imCorners;
}

const FrameWithPoints &getFirstImageTargetRoiFeatures(const Vector<FrameWithPoints> &roiPoints) {
  for (const auto &pts : roiPoints) {
    if (pts.roi().source == ImageRoi::Source::IMAGE_TARGET) {
      return pts;
    }
  }
  return roiPoints[0];
}

}  // namespace

Vector<HPoint2> detectImageInScene(
  RGBA8888PlanePixels targetPix,
  RGBA8888PlanePixels searchPix,
  Vector<String> *outPaths,
  Vector<RGBA8888PlanePixelBuffer> *detectedImages) {
  // Initialize the shader that will be used to detect feature points.
  Gr8FeatureShader shader;
  shader.initialize();

  auto pixCopyBuf = RGBA8888PlanePixelBuffer(searchPix.rows(), searchPix.cols());
  drawImageChannelGray(searchPix, 0, pixCopyBuf.pixels());

  // Extract detection points from the target image and print some stats. The returned
  // DetectionImage<OrbFeature> holds the extracted points / descriptors, as well as matcher data
  // structures for querying target points. The points are represented in ray-space, transformed
  // from pixels with a hypothetical camera that took a photo of the points. Later on, in
  // getPointsAndRays, we compute a 3D model of the points at these ray locations at distance 1 from
  // the origin, and then solve for the camera pose with respect to this model.
  DetectionImageLoader targetLoader;
  auto targetPts = extractTargetFeatures(
    targetPix,
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_XS),
    &targetLoader,
    &shader);

  // Load the search pixels into a texture.
  GlTexture2D searchTexture = makeLinearRGBA8888Texture2D(searchPix.cols(), searchPix.rows());
  searchTexture.bind();
  searchTexture.tex().setPixels(searchPix.pixels());
  searchTexture.unbind();

  // Initialize gpu processing for the search texture.
  int rotation = searchPix.cols() > searchPix.rows() ? 90 : 0;
  GlRealityFrame gl;
  gl.initialize(&shader, searchPix.cols(), searchPix.rows(), rotation);

  // Since we're not yet tracking an image, configure the renderer to scan the central portion at
  // higher resolution.
  auto l0 = gl.pyramid().levels[0];
  c8_PixelPinholeCameraModel searchK = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6), l0.w, l0.h);
  gl.addNextDrawHiResScans(searchK, {0.0f, 0.0f});

  // Render the pyramid and read back the result.
  gl.draw(searchTexture.id(), GlRealityFrame::Options::DEFER_READ);
  gl.readPixels();

  // Extract features from the search image. TrackerInput holds image points (in ray space) for
  // both the pyramid and extracted ROIs, and also the gravity-oriented pose reported by the phone.
  // Here we set the pose to identity.
  TrackerInput trackerData(searchK, {1.0f, 0.0f, 0.0f, 0.0f});
  FeatureDetector detector;
  detector.detectFeatures(gl.pyramid(), &trackerData.framePoints, &trackerData.roiPoints);

  // Concatenate features and hi-res features.
  auto combinedPoints = trackerData.framePoints.clone();
  for (const auto &f : trackerData.roiPoints) {
    if (f.roi().source == ImageRoi::Source::HIRES_SCAN) {
      combinedPoints.addAll(f);
    }
  }
  // Compute global matches once with no score limit so that we can see the histogram of scores.
  Vector<PointMatch> globalMatches;
  targetPts.globalMatcher().match(combinedPoints, 256, &globalMatches);

  // Compute global matches again with the default score limit.
  globalMatches.clear();
  targetPts.globalMatcher().match(combinedPoints, &globalMatches);

  // Construct a 3d model of the image target (globalWorldPts) from the matched points, and extract
  // the ray locations of the matched points from the camera.
  Vector<HPoint3> globalWorldPts;
  Vector<HPoint2> globalCamRays;
  HMatrix globalPose = HMatrixGen::i();
  getPointsAndRays(globalMatches, targetPts, combinedPoints, &globalWorldPts, &globalCamRays);

  // Run robustPnP to find the location of the camera with respect to the image target 3d model.
  Vector<uint8_t> globalInliers;
  RobustPoseScratchSpace scratch;
  RandomNumbers random;
  auto found = robustPnP(
    globalWorldPts,
    globalCamRays,
    HMatrixGen::i(),
    {},
    &globalPose,
    &globalInliers,
    &random,
    &scratch);

  if (!found) {
    // if we are not able to find the target, we want to output the scene which failed detection.
    detectedImages->push_back(std::move(pixCopyBuf));
    return {HPoint<2>(0.f, 0.f)};
  }

  // Redraw matches using only inliers so that we can see which matches were filtered.
  Vector<PointMatch> globalMatchesInliers;
  for (int i = 0; i < globalInliers.size(); ++i) {
    if (globalInliers[i]) {
      globalMatchesInliers.push_back(globalMatches[i]);
    }
  }

  // Now we know the location of the camera with respect to the target image, but what we want is to
  // locate the target image with respect to the camera.
  auto camPos = HMatrixGen::i();  // known locaction of the camera in world space.
  auto scale = 1.0f;              // guessed scale of the image target.
  auto globalLocatedImage = locate("targetFile", globalPose, targetPts, camPos, scale, searchK);
  // drawDetectedImage(
  //   gl.pyramid().level(0), searchK, camPos, globalLocatedImage, "global-location.png", outPaths);
  // Now that we have found the target, rerun feature exatraction focusing in on the image target.
  gl.addNextDrawRoi(globalLocatedImage.roi);
  gl.addNextDrawHiResScans(searchK, {0.0f, 0.0f});

  // Render the pyramid and read back the result.
  gl.draw(searchTexture.id(), GlRealityFrame::Options::DEFER_READ);
  gl.readPixels();

  // Extract features from the search image. TrackerInput holds image points (in ray space) for
  // both the pyramid and extracted ROIs, and also the gravity-oriented pose reported by the phone.
  // Here we set the pose to identity.
  trackerData.framePoints.clear();
  trackerData.roiPoints.clear();
  detector.detectFeatures(gl.pyramid(), &trackerData.framePoints, &trackerData.roiPoints);

  // Based on the estimated pose, compute the location where we think the points probably are in
  // the field of view of the camera that took the photo of the image target.
  auto &localFeatures = getFirstImageTargetRoiFeatures(trackerData.roiPoints);
  auto featsRayInTargetView = projectToTargetSpace(targetPts, localFeatures, globalPose);

  // Compute local matches in the space of the image target.
  Vector<PointMatch> localMatches;
  targetPts.localMatcher().useScaleFilter(true);
  targetPts.localMatcher().setDescriptorThreshold(64);
  targetPts.localMatcher().setRoiScale(true);
  targetPts.localMatcher().setRadius(0.1f);
  targetPts.localMatcher().findMatches(featsRayInTargetView, &localMatches);

  Vector<HPoint2> imTargetRays;
  Vector<HPoint2> camRays;
  Vector<float> weights;
  getMatchedRays(localMatches, targetPts, localFeatures, &imTargetRays, &camRays, &weights);
  Vector<uint8_t> localInliers;
  RobustPoseScratchSpace scratch2;
  HMatrix localPose = globalPose;
  bool foundLocal = solveImageTargetHomography(
    imTargetRays,
    camRays,
    weights,
    {10, 20, 500e-6f, 1e-2f, 10.0f},
    &localPose,
    &localInliers,
    &scratch2);

  if (!foundLocal) {
    detectedImages->push_back(std::move(pixCopyBuf));
    return {c8::HPoint<2>(0.f, 0.f)};
  }

  Vector<PointMatch> localMatchesInliers;
  for (int i = 0; i < localInliers.size(); ++i) {
    if (localInliers[i]) {
      localMatchesInliers.push_back(localMatches[i]);
    }
  }
  // Now we know the location of the camera with respect to the target image, but what we want is to
  // locate the target image with respect to the camera.
  auto localLocatedImage = locate("targetFile", localPose, targetPts, camPos, scale, searchK);
  auto imCorners = drawDetectedImage(
    gl.pyramid().level(0),
    searchK,
    camPos,
    localLocatedImage,
    "local-location.png",
    outPaths,
    pixCopyBuf);
  // if we are able to detect the image we want to return the scene with the bounding box for the
  // predicted target location.
  detectedImages->push_back(std::move(pixCopyBuf));

  // TODO(Rishi) have imCorners be an out variable.
  return imCorners;
}
}  // namespace c8
