// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:random-numbers",
    "//c8:string",
    "//c8/camera:device-infos",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
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
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/features:feature-detector",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/geometry:image-warp",
    "//reality/engine/geometry:pose-pnp",
    "//reality/engine/features:tracker-input",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
    "//reality/engine/imagedetection:location",
    "//reality/engine/imagedetection:tracked-image",
  };
}
cc_end(0x600077bc);

#include <array>
#include <cstdio>
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
#include "reality/engine/features/feature-detector.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/tracker-input.h"
#include "reality/engine/geometry/image-warp.h"
#include "reality/engine/geometry/pose-pnp.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image.h"
#include "reality/engine/imagedetection/location.h"
#include "reality/engine/imagedetection/tracked-image.h"

using namespace c8;

const char *APP_NAME = "planar-detect";

using TexWarper =
  std::function<void(const HMatrix &mvp, int rotation, GlTexture src, GlFramebufferObject *dest)>;

void writeOutputImage(ConstRGBA8888PlanePixels pix, const String &name, Vector<String> *outPaths) {
  outPaths->push_back(format("/tmp/%s_%02d_%s", APP_NAME, outPaths->size(), name.c_str()));
  writeImage(pix, outPaths->back());
}

// Draw features over a copy of the image, and write the copy to a file.
void drawFeaturesToFile(
  const TargetWithPoints &detectionPts,
  const Gr8Pyramid &pyramid,
  const String &imName,
  Vector<String> *outPaths) {
  auto pix = pyramid.level(0);
  RGBA8888PlanePixelBuffer pixCopyBuf(pix.rows(), pix.cols());
  auto pixCopy = pixCopyBuf.pixels();
  drawImageChannelGray(pix, 0, pixCopy);
  drawFeatures(detectionPts, pixCopy);
  writeOutputImage(pixCopy, imName, outPaths);
}

void drawFeaturesToFile(
  const TrackerInput &detectionPts,
  const Gr8Pyramid &pyramid,
  const String &imName,
  Vector<String> *outPaths) {
  auto pix = pyramid.level(0);
  {
    RGBA8888PlanePixelBuffer pixCopyBuf(pix.rows(), pix.cols());
    auto pixCopy = pixCopyBuf.pixels();
    drawImageChannelGray(pix, 0, pixCopy);
    drawFeatures(detectionPts.framePoints, pixCopy);
    writeOutputImage(pixCopy, imName, outPaths);
  }
  {
    RGBA8888PlanePixelBuffer pixCopyBuf(2 * pix.rows(), 2 * pix.cols());
    for (int i = 0; i < detectionPts.roiPoints.size(); ++i) {
      auto out = crop(
        pixCopyBuf.pixels(), pix.rows(), pix.cols(), (i / 2) * pix.rows(), (i % 2) * pix.cols());
      drawImageChannelGray(pix, 0, out);
      drawFeatures(detectionPts.roiPoints[i], out);
    }
    writeOutputImage(pixCopyBuf.pixels(), format("roi-%s", imName.c_str()), outPaths);
  }
}

void drawImageChannels(ConstRGBA8888PlanePixels pix, const String &name, Vector<String> *outPaths) {
  RGBA8888PlanePixelBuffer pixCopyBuf(2 * pix.rows(), 2 * pix.cols());
  for (int i = 0; i < 4; ++i) {
    auto out =
      crop(pixCopyBuf.pixels(), pix.rows(), pix.cols(), (i / 2) * pix.rows(), (i % 2) * pix.cols());
    drawImageChannel(pix, i, out);
  }
  writeOutputImage(pixCopyBuf.pixels(), name, outPaths);
}

// Extract features using DetectionImageLoader, and draw the extracted pyramid and overlayed feature
// points to files.
DetectionImage extractTargetFeatures(
  const String &targetFile,
  c8_PixelPinholeCameraModel k,
  DetectionImageLoader *loader,
  Gr8FeatureShader *shader) {
  // Read the target image from disk.
  C8Log("[planar-detect] Reading image %s", targetFile.c_str());
  auto targetImg = readImageToRGBA(targetFile);
  auto pix = targetImg.pixels();

  // If the image is landscape, it will get rotated for extraction, but the detection image loader
  // doesn't rotate the intrinsics. It's probably best to fix this in the DetectionImageLoader, but
  // we'd need to make sure that it is safe.
  if (pix.cols() > pix.rows()) {
    k = Intrinsics::rotateCropAndScaleIntrinsics(k, pix.rows(), pix.cols());
  }
  MutableRootMessage<ImageTargetMetadata> imageTargetMetadata;
  imageTargetMetadata.builder().setType(ImageTargetTypeMsg::PLANAR);
  imageTargetMetadata.builder().setName(targetFile);
  imageTargetMetadata.builder().setImageWidth(pix.cols());
  imageTargetMetadata.builder().setImageHeight(pix.rows());

  loader->initialize(shader, imageTargetMetadata.reader(), k);
  loader->imTexture().bind();
  loader->imTexture().setPixels(pix.pixels());
  loader->imTexture().unbind();
  loader->processGpu();
  loader->readDataToCpu();
  return loader->extractFeatures();
}

void drawMatches(
  ConstRGBA8888PlanePixels targetPix,
  const TargetWithPoints &targetPts,
  ConstRGBA8888PlanePixels searchPix,
  const FrameWithPoints &searchPts,
  const Vector<PointMatch> &matches,
  const String &name,
  Vector<String> *outPaths) {
  RGBA8888PlanePixelBuffer outPixBuf(
    std::max(targetPix.rows(), searchPix.rows()), targetPix.cols() + searchPix.cols());
  fill(Color::BLACK, outPixBuf.pixels());

  drawImageChannelGray(
    targetPix, 0, crop(outPixBuf.pixels(), targetPix.rows(), targetPix.cols(), 0, 0));
  drawImageChannelGray(
    searchPix,
    0,
    crop(outPixBuf.pixels(), searchPix.rows(), searchPix.cols(), 0, targetPix.cols()));

  auto targetLoc = targetPts.pixels();
  auto searchLoc = searchPts.pixels();
  for (auto match : matches) {
    auto dest = searchLoc[match.wordsIdx];
    drawLine(
      targetLoc[match.dictionaryIdx],
      {static_cast<float>(dest.x() + targetPix.cols()), dest.y()},
      1,
      Color::MINT,
      outPixBuf.pixels());
  }

  writeOutputImage(outPixBuf.pixels(), name, outPaths);
}

void drawLocalMatches(
  ConstRGBA8888PlanePixels targetPix,
  const TargetWithPoints &targetPts,
  const FrameWithPoints &searchPts,
  const Vector<PointMatch> &matches,
  const String &name,
  Vector<String> *outPaths) {
  RGBA8888PlanePixelBuffer outPixBuf(targetPix.rows(), targetPix.cols());

  drawImageChannelGray(
    targetPix, 0, crop(outPixBuf.pixels(), targetPix.rows(), targetPix.cols(), 0, 0));

  auto targetLoc = targetPts.pixels();
  auto searchPtsWithTargetIntrinsic = searchPts.clone();
  searchPtsWithTargetIntrinsic.rewriteUndistortMatrix(targetPts.intrinsic());
  auto searchLoc = searchPtsWithTargetIntrinsic.pixels();
  for (auto match : matches) {
    drawLine(
      targetLoc[match.dictionaryIdx],
      searchLoc[match.wordsIdx],
      1,
      Color::MINT,
      outPixBuf.pixels());
    drawPoint(targetLoc[match.dictionaryIdx], 1, Color::MANGO, outPixBuf.pixels());
    drawPoint(searchLoc[match.wordsIdx], 1, Color::CHERRY, outPixBuf.pixels());
  }

  writeOutputImage(outPixBuf.pixels(), name, outPaths);
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

void drawDetectedImageInWorld(
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
}

void drawDetectedImage(
  ConstRGBA8888PlanePixels pix,
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const LocatedImage &found,
  const String &name,
  Vector<String> *outPaths) {

  RGBA8888PlanePixelBuffer pixCopyBuf(pix.rows(), pix.cols());
  auto pixCopy = pixCopyBuf.pixels();
  drawImageChannelGray(pix, 0, pixCopy);

  drawDetectedImageInWorld(intrinsics, extrinsic, found, pixCopy);
  writeOutputImage(pixCopy, name, outPaths);
}

const FrameWithPoints &getFirstImageTargetRoiFeatures(const Vector<FrameWithPoints> &roiPoints) {
  for (const auto &pts : roiPoints) {
    if (pts.roi().source == ImageRoi::Source::IMAGE_TARGET) {
      return pts;
    }
  }
  return roiPoints[0];
}

void drawRoi(
  GlTexture2D &im,
  const Gr8Pyramid &pyramid,
  ImageRoi roi,
  HPoint2 roiSize,
  const String &name,
  Vector<String> *outPaths) {
  RGBA8888PlanePixelBuffer outBuf(roiSize.x(), roiSize.y());
  auto o = outBuf.pixels();
  GlFramebufferObject dest;
  dest.initialize(
    makeLinearRGBA8888Texture2D(o.cols(), o.rows()), GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0);
  TexWarper warpTexture = compileWarpRotateTexture2D();

  int rotation = 0;
  if (im.width() > im.height()) {
    rotation = 90;
  }
  warpTexture(roi.warp, rotation, im.tex(), &dest);

  glActiveTexture(GL_TEXTURE0);
  dest.bind();
  dest.tex().bind();
  glReadPixels(0, 0, o.cols(), o.rows(), GL_RGBA, GL_UNSIGNED_BYTE, o.pixels());
  dest.tex().unbind();
  dest.unbind();

  writeOutputImage(o, name, outPaths);
}

void drawScoreHistogram(const Vector<PointMatch> &matches, String name, Vector<String> *outPaths) {
  Vector<int> scoresHistogram(255, {0});
  for (auto match : matches) {
    scoresHistogram[match.descriptorDist] += 1;
  }
  int histMax = 0;
  for (int i = 0; i < scoresHistogram.size(); ++i) {
    histMax = std::max(histMax, scoresHistogram[i]);
  }

  RGBA8888PlanePixelBuffer outBuf(280, 280);
  RGBA8888PlanePixels plotIm = outBuf.pixels();

  auto scale = 255.0 / histMax / 2;
  fill(Color::OFF_WHITE, plotIm);
  drawLine({15.0f, 9.0f}, {271.0f, 9.0f}, 3, Color::PURPLE_GRAY, plotIm);
  drawLine({15.0f, 9.0f + 64.0f}, {271.0f, 9.0f + 64.0f}, 3, Color::PURPLE_GRAY, plotIm);
  drawLine({15.0f, 9.0f + 128.0f}, {271.0f, 9.0f + 128.0f}, 3, Color::PURPLE_GRAY, plotIm);
  drawLine({15.0f, 9.0f + 192.0f}, {271.0f, 9.0f + 192.0f}, 3, Color::PURPLE_GRAY, plotIm);
  drawLine({271.0f, 9.0f}, {271.0f, 265.0f}, 3, Color::PURPLE_GRAY, plotIm);
  drawLine({271.0f - 64.0f, 9.0f}, {271.0f - 64.0f, 265.0f}, 3, Color::PURPLE_GRAY, plotIm);
  drawLine({271.0f - 128.0f, 9.0f}, {271.0f - 128.0f, 265.0f}, 3, Color::PURPLE_GRAY, plotIm);
  drawLine({271.0f - 192.0f, 9.0f}, {271.0f - 192.0f, 265.0f}, 3, Color::PURPLE_GRAY, plotIm);
  putText("32", {9.0f + 64.0f, 265.0f}, Color::PURPLE, Color::OFF_WHITE, plotIm);
  putText("64", {9.0f + 128.0f, 265.0f}, Color::PURPLE, Color::OFF_WHITE, plotIm);
  putText("96", {9.0f + 192.0f, 265.0f}, Color::PURPLE, Color::OFF_WHITE, plotIm);
  putText(format("%4.1f", histMax), {15.0f, 15.0f}, Color::PURPLE, Color::OFF_WHITE, plotIm);
  drawLine({15.0f, 5.0f}, {15.0f, 275.0f}, 3, Color::CHERRY, plotIm);
  drawLine({5.0f, 265.0f}, {275.0f, 265.0f}, 3, Color::CHERRY, plotIm);
  for (int i = 0; i < scoresHistogram.size() / 2; i += 2) {
    float h = (scoresHistogram[i] + scoresHistogram[i + 1]) * scale;
    drawPoint({15.0f + i * 2 + 2, 265.0f - h}, 4, 2, Color::DARK_BLUE, plotIm);
  }

  writeOutputImage(plotIm, name, outPaths);
}

void runPlanarDetect(const String &targetFile, const String &searchFile, Vector<String> *outPaths) {
  // Initialize the shader that will be used to detect feature points.
  Gr8FeatureShader shader;
  shader.initialize();

  // Extract detection points from the target image and print some stats. The returned
  // DetectionImage holds the extracted points / descriptors, as well as matcher data structures
  // for querying target points. The points are represented in ray-space, transformed from pixels
  // with a hypothetical camera that took a photo of the points. Later on, in getPointsAndRays,
  // we compute a 3D model of the points at these ray locations at distance 1 from the origin, and
  // then solve for the camera pose with respect to this model.
  DetectionImageLoader targetLoader;
  auto targetPts = extractTargetFeatures(
    targetFile,
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6),
    &targetLoader,
    &shader);
  C8Log(
    "[planar-detect] Extracted %d features from %s",
    targetPts.framePoints().points().size(),
    targetFile.c_str());

  // Write the pyramid and extracted points.
  drawImageChannels(targetLoader.gl().pyramid().data, "target-pyramid.png", outPaths);
  drawFeaturesToFile(
    targetPts.framePoints(), targetLoader.gl().pyramid(), "target-features.png", outPaths);

  // Read the search image from disk.
  C8Log("[planar-detect] Reading image %s", searchFile.c_str());
  auto searchImg = readImageToRGBA(searchFile);
  auto searchPix = searchImg.pixels();

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
  // If our search image is not 3/4, assume 9/16 since that's the only other case (pixel phone)
  auto deviceType = (static_cast<float>(searchPix.cols()) / searchPix.rows()) < 0.75f
    ? DeviceInfos::GOOGLE_PIXEL4_XL
    : DeviceInfos::APPLE_IPHONE_6;
  c8_PixelPinholeCameraModel searchK = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(deviceType), l0.w, l0.h);
  gl.addNextDrawHiResScans(searchK, {0.0f, 0.0f});

  // Render the pyramid and read back the result.
  gl.draw(searchTexture.id(), GlRealityFrame::Options::DEFER_READ);
  gl.readPixels();

  // Draw the pyramid and ROIs a file.
  drawImageChannels(gl.pyramid().data, "search-pyramid.png", outPaths);

  // Extract features from the search image. TrackerInput holds image points (in ray space) for
  // both the pyramid and extracted ROIs, and also the gravity-oriented pose reported by the phone.
  // Here we set the pose to identity.
  TrackerInput trackerData(searchK, {1.0f, 0.0f, 0.0f, 0.0f});
  FeatureDetector detector;
  detector.detectFeatures(gl.pyramid(), &trackerData.framePoints, &trackerData.roiPoints);

  // Draw extracted features from the image and ROIs.
  drawFeaturesToFile(trackerData, gl.pyramid(), "search-features-pre-detection.png", outPaths);

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
  C8Log(
    "[planar-detect] Global matcher found %d matches with no score limit", globalMatches.size());
  drawScoreHistogram(globalMatches, "global-match-histogram.png", outPaths);

  // Compute global matches again with the default score limit.
  globalMatches.clear();
  targetPts.globalMatcher().match(combinedPoints, &globalMatches);
  C8Log("[planar-detect] Global matcher found %d matches", globalMatches.size());

  // Draw the matches.
  drawMatches(
    targetLoader.gl().pyramid().level(0),
    targetPts.framePoints(),
    gl.pyramid().level(0),
    combinedPoints,
    globalMatches,
    "global-matches.png",
    outPaths);

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
    C8Log("[planar-detect] Target image was not found; we are done.");
    return;
  }

  // Redraw matches using only inliers so that we can see which matches were filtered.
  Vector<PointMatch> globalMatchesInliers;
  for (int i = 0; i < globalInliers.size(); ++i) {
    if (globalInliers[i]) {
      globalMatchesInliers.push_back(globalMatches[i]);
    }
  }
  C8Log(
    "[planar-detect] Found image with global search: %d (%d match inliers)",
    found,
    globalMatchesInliers.size());
  drawMatches(
    targetLoader.gl().pyramid().level(0),
    targetPts.framePoints(),
    gl.pyramid().level(0),
    combinedPoints,
    globalMatchesInliers,
    "global-matches-inliers.png",
    outPaths);

  // Now we know the location of the camera with respect to the target image, but what we want is to
  // locate the target image with respect to the camera.
  auto camPos = HMatrixGen::i();  // known locaction of the camera in world space.
  auto scale = 1.0f;              // guessed scale of the image target.
  auto globalLocatedImage = locate(targetFile, globalPose, targetPts, camPos, scale, searchK);
  drawDetectedImage(
    gl.pyramid().level(0), searchK, camPos, globalLocatedImage, "global-location.png", outPaths);

  // Visualize the ROI we want to extract in our next round of feature extraction.
  HPoint2 roiSize{1.f * gl.pyramid().level(0).cols(), ROI_ASPECT * gl.pyramid().level(0).cols()};
  drawRoi(
    searchTexture,
    gl.pyramid(),
    globalLocatedImage.roi,
    roiSize,
    "region-of-interest.jpg",
    outPaths);

  // Now that we have found the target, rerun feature exatraction focusing in on the image target.
  gl.addNextDrawRoi(globalLocatedImage.roi);
  gl.addNextDrawHiResScans(searchK, {0.0f, 0.0f});

  // Render the pyramid and read back the result.
  gl.draw(searchTexture.id(), GlRealityFrame::Options::DEFER_READ);
  gl.readPixels();

  // Draw the pyramid and ROIs a file.
  drawImageChannels(gl.pyramid().data, "search-pyramid-with-warp.png", outPaths);

  // Extract features from the search image. TrackerInput holds image points (in ray space) for
  // both the pyramid and extracted ROIs, and also the gravity-oriented pose reported by the phone.
  // Here we set the pose to identity.
  trackerData.framePoints.clear();
  trackerData.roiPoints.clear();
  detector.detectFeatures(gl.pyramid(), &trackerData.framePoints, &trackerData.roiPoints);

  // Draw extracted features from the image and ROIs.
  drawFeaturesToFile(trackerData, gl.pyramid(), "search-features-post-detection.png", outPaths);

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

  // Draw the local matches in the space of the image target.
  drawLocalMatches(
    targetLoader.gl().pyramid().level(0),
    targetPts.framePoints(),
    featsRayInTargetView,
    localMatches,
    "local-matches-projected.png",
    outPaths);

  // Draw the matches between both images.
  drawMatches(
    targetLoader.gl().pyramid().level(0),
    targetPts.framePoints(),
    gl.pyramid().level(0),
    localFeatures,
    localMatches,
    "local-matches.png",
    outPaths);
  C8Log("Local matcher found %d matches", localMatches.size());

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
    C8Log("[planar-detect] Target image was not found in local search; we are done.");
    return;
  }

  Vector<PointMatch> localMatchesInliers;
  for (int i = 0; i < localInliers.size(); ++i) {
    if (localInliers[i]) {
      localMatchesInliers.push_back(localMatches[i]);
    }
  }
  C8Log(
    "[planar-detect] Found image with local search: %d (%d match inliers)",
    foundLocal,
    localMatchesInliers.size());
  // Draw the local matches in the space of the image target.
  drawLocalMatches(
    targetLoader.gl().pyramid().level(0),
    targetPts.framePoints(),
    featsRayInTargetView,
    localMatchesInliers,
    "local-matches-projected-inliers.png",
    outPaths);

  // Draw the matches between both images.
  drawMatches(
    targetLoader.gl().pyramid().level(0),
    targetPts.framePoints(),
    gl.pyramid().level(0),
    localFeatures,
    localMatchesInliers,
    "local-matches-inliers.png",
    outPaths);

  // Now we know the location of the camera with respect to the target image, but what we want is to
  // locate the target image with respect to the camera.
  auto localLocatedImage = locate(targetFile, localPose, targetPts, camPos, scale, searchK);
  drawDetectedImage(
    gl.pyramid().level(0), searchK, camPos, localLocatedImage, "local-location.png", outPaths);
}

int main(int argc, char *argv[]) {
  if (argc != 3) {
    C8Log(
      "ERROR: Missing image path(s).\n"
      "\n"
      "%s usage:\n"
      "    bazel run //reality/quality/imagetargets:%s -- "
      "/path/to/target.jpg /path/to/search.jpg\n",
      APP_NAME,
      APP_NAME);
    return -1;
  }
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  Vector<String> outPaths;
  {
    ScopeTimer t(APP_NAME);
    runPlanarDetect(argv[1], argv[2], &outPaths);
  }
  C8Log("------------------\nTiming summary:");
  ScopeTimer::logDetailedSummary();
  C8Log("------------------\nWrote output:");
  for (const auto &s : outPaths) {
    C8Log("%s", s.c_str());
  }
}
