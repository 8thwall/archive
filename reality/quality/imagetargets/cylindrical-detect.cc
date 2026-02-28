// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    ":image-target-json-loader",
    "//c8:c8-log",
    "//c8:random-numbers",
    "//c8:string",
    "//c8/camera:device-infos",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/pixels/opengl:gl-framebuffer",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/features:feature-detector",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/geometry:image-warp",
    "//reality/engine/geometry:pose-pnp",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
    "//reality/engine/imagedetection:detection-image-tracker",
    "//reality/engine/features:tracker-input",
    "//reality/engine/imagedetection:location",
    "//reality/engine/imagedetection:tracked-image",
    "@cxxopts//:cxxopts",
  };
}
cc_end(0x93873fea);

#include <array>
#include <cstdio>
#include <cxxopts.hpp>
#include <fstream>
#include <sstream>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/file-io.h"
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
#include "image-target-json-loader.h"
#include "reality/engine/features/feature-detector.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/tracker-input.h"
#include "reality/engine/geometry/image-warp.h"
#include "reality/engine/geometry/pose-pnp.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image-tracker.h"
#include "reality/engine/imagedetection/detection-image.h"
#include "reality/engine/imagedetection/location.h"
#include "reality/engine/imagedetection/tracked-image.h"

using namespace c8;

const char *APP_NAME = "cylindrical-detect";

using CurvyTexWarper = std::function<void(
  CurvyImageGeometry geom,
  const HMatrix &intrinsics,
  const HMatrix &globalPose,
  int rotation,
  float roiAspectRatio,
  HPoint2 searchDims,
  GlTexture src,
  GlFramebufferObject *dest)>;
using TexWarper =
  std::function<void(const HMatrix &mvp, int rotation, GlTexture src, GlFramebufferObject *dest)>;

void writeOutputImage(ConstRGBA8888PlanePixels pix, const String &name, Vector<String> *outPaths) {
  outPaths->push_back(format("/tmp/%s_%02d_%s", APP_NAME, outPaths->size(), name.c_str()));
  writeImage(pix, outPaths->back());
}

Color getColor(ConstRGBA8888PlanePixels im, HPoint2 p) {
  int r = std::round(p.y());
  int c = std::round(p.x());
  if (r < 0 || r >= im.rows() || c < 0 || c >= im.cols()) {
    return Color::MANGO;
  }
  const auto *pix = im.pixels() + r * im.rowBytes() + 4 * c;
  return Color(pix[0], pix[1], pix[2]);
}

// Draw features over a copy of the image, and write the copy to a file.
void drawFeaturesToFile(
  const TargetWithPoints &detectionPts,
  ConstRGBA8888PlanePixels pix,
  const String &imName,
  Vector<String> *outPaths) {
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
  Gr8FeatureShader *shader,
  const CurvySpec &spec) {
  // Read the target image from disk.
  C8Log("Reading image %s", targetFile.c_str());
  auto targetImg = readImageToRGBA(targetFile);
  auto pix = targetImg.pixels();

  // If the image is landscape, it will get rotated for extraction, but the detection image loader
  // doesn't rotate the intrinsics. It's probably best to fix this in the DetectionImageLoader, but
  // we'd need to make sure that it is safe.
  if (pix.cols() > pix.rows()) {
    k = Intrinsics::rotateCropAndScaleIntrinsics(k, pix.rows(), pix.cols());
  }
  MutableRootMessage<ImageTargetMetadata> imageTargetMetadata;
  imageTargetMetadata.builder().setType(ImageTargetTypeMsg::CURVY);
  imageTargetMetadata.builder().setName(targetFile);
  imageTargetMetadata.builder().setImageWidth(pix.cols());
  imageTargetMetadata.builder().setImageHeight(pix.rows());
  imageTargetMetadata.builder().setIsRotated(spec.isRotated);

  loader->initialize(shader, imageTargetMetadata.reader(), k);
  loader->setGeometry(pix.cols(), pix.rows(), spec);
  loader->imTexture().bind();
  loader->imTexture().setPixels(pix.pixels());
  loader->imTexture().unbind();
  loader->processGpu();
  loader->readDataToCpu();
  return loader->extractFeatures();
}

Color getRandomColor() {
  static RandomNumbers randNum;
  return {
    static_cast<uint8_t>(randNum.nextUniformInt(0, 255)),
    static_cast<uint8_t>(randNum.nextUniformInt(0, 255)),
    static_cast<uint8_t>(randNum.nextUniformInt(0, 255))};
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
      getRandomColor(),
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

// Locate the target image in the search image
// the ROI can be used for extracting the search image into a pose just like the target image
LocatedImage locate(
  const String &targetFile,
  const HMatrix &poseFromTarget,
  CurvyImageGeometry geom,
  const DetectionImage &t,
  const HMatrix &camPos,
  float scale,
  c8_PixelPinholeCameraModel searchK) {
  // Uncomment this section to use the new curvy ROI using a shader
  geom.radius += SHADER_ROI_RADIUS_INCREASE;
  geom.radiusBottom += SHADER_ROI_RADIUS_INCREASE;
  ImageRoi roi = {
    ImageRoi::Source::CURVY_IMAGE_TARGET,
    0,
    targetFile,
    HMatrixGen::i(),
    geom,
    HMatrixGen::intrinsic(searchK),
    poseFromTarget};
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
  const CurvyImageGeometry &geom,
  RGBA8888PlanePixels dest) {
  // Axis in image
  auto K = HMatrixGen::intrinsic(intrinsics);
  drawAxis(extrinsic, K, HPoint3(0.0f, 0.0f, 0.0f), 0.2f, dest);
  drawCurvyImage(intrinsics, extrinsic, geom, dest);
}

void drawDetectedImage(
  ConstRGBA8888PlanePixels pix,
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const CurvyImageGeometry &geom,
  const String &name,
  Vector<String> *outPaths) {

  RGBA8888PlanePixelBuffer pixCopyBuf(pix.rows(), pix.cols());
  auto pixCopy = pixCopyBuf.pixels();
  drawImageChannelGray(pix, 0, pixCopy);

  drawDetectedImageInWorld(intrinsics, extrinsic, geom, pixCopy);
  writeOutputImage(pixCopy, name, outPaths);
}

void drawDetectedImageWithRoi(
  ConstRGBA8888PlanePixels pix,
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsic,
  const CurvyImageGeometry &geom,
  const String &name,
  Vector<String> *outPaths) {

  RGBA8888PlanePixelBuffer pixCopyBuf(pix.rows(), pix.cols());
  auto pixCopy = pixCopyBuf.pixels();
  drawImageChannelGray(pix, 0, pixCopy);

  drawDetectedImageInWorld(intrinsics, extrinsic, geom, pixCopy);

  auto curvyEdgePixelsInSearchPixel = curvyTargetEdgePixels(geom, intrinsics, extrinsic);
  drawPoints(curvyEdgePixelsInSearchPixel, 1, Color::MANGO, pixCopy);

  writeOutputImage(pixCopy, name, outPaths);
}

const FrameWithPoints &getRoiFeatures(const Vector<FrameWithPoints> &roiPoints) {
  for (const auto &pts : roiPoints) {
    if (
      pts.roi().source == ImageRoi::Source::IMAGE_TARGET
      || pts.roi().source == ImageRoi::Source::CURVY_IMAGE_TARGET) {
      return pts;
    }
  }
  return roiPoints[0];
}

void drawRoi(
  GlTexture2D &im,
  int searchRotation,
  const Gr8Pyramid &pyramid,
  ImageRoi roi,
  const String &name,
  Vector<String> *outPaths) {
  RGBA8888PlanePixelBuffer outBuf(pyramid.level(0).rows(), pyramid.level(0).cols());
  auto o = outBuf.pixels();
  GlFramebufferObject dest;
  dest.initialize(
    makeLinearRGBA8888Texture2D(o.cols(), o.rows()), GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0);
  TexWarper warpTexture = compileWarpRotateTexture2D();

  warpTexture(roi.warp, searchRotation, im.tex(), &dest);

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

// Visualize the ROI that we will extract from the search image.
// This will be done in a shader, but you can iterate on the algorithm with this.
// aspectRatio is the w/h ratio of the ROI where we will lift into
void drawLiftedROICpu(
  ConstRGBA8888PlanePixels searchPix,
  const c8_PixelPinholeCameraModel &searchIntrinsics,
  const HMatrix &globalPose,
  CurvyImageGeometry geom,
  const String &name,
  Vector<String> *outPaths,
  float aspectRatio = 0.75) {
  C8Log("[cylindrical-detect] Drawing Lifted ROI CPU with aspect ratio %f", aspectRatio);
  geom.radius += SHADER_ROI_RADIUS_INCREASE;
  geom.radiusBottom += SHADER_ROI_RADIUS_INCREASE;
  // Adjust dimensions for landscape image targets (including isRotated=true).
  bool isRotated = false;
  if (geom.srcCols > geom.srcRows) {
    isRotated = true;
    std::swap(geom.srcRows, geom.srcCols);
  }

  // Scale the lifted target image to keep the correct aspect ratio
  float roiCols = (static_cast<float>(geom.srcCols) / geom.srcRows > .75f)
    ? geom.srcCols
    : aspectRatio * geom.srcRows;
  float roiRows = (static_cast<float>(geom.srcCols) / geom.srcRows > .75f)
    ? geom.srcCols / aspectRatio
    : geom.srcRows;

  RGBA8888PlanePixelBuffer pixCopyBuf(roiRows, roiCols);
  auto pixCopy = pixCopyBuf.pixels();
  fill(Color::BLACK, pixCopy);
  // drawImageChannelGray(searchPix, 0, pixCopy);

  Vector<HPoint2> liftedTargetPixels;
  liftedTargetPixels.reserve(roiCols * roiRows);
  Vector<HPoint2> originalPixels;
  originalPixels.reserve(roiCols * roiRows);
  for (int i = 0; i < roiCols; i++) {
    for (int j = 0; j < roiRows; j++) {
      HPoint2 originalPointInPixelSpace{static_cast<float>(i), static_cast<float>(j)};
      HPoint2 originalPointInClipSpace = isRotated
        ? HPoint2(
            originalPointInPixelSpace.y() / roiRows,
            1.f - (originalPointInPixelSpace.x() / roiCols))
        : HPoint2(originalPointInPixelSpace.x() / roiCols, originalPointInPixelSpace.y() / roiRows);
      HPoint2 pointInPixelSpace(
        originalPointInClipSpace.x() * roiCols, originalPointInClipSpace.y() * roiRows);

      // out of bound?
      if (pointInPixelSpace.x() > geom.srcCols || pointInPixelSpace.y() > geom.srcRows) {
        drawPoint(originalPointInPixelSpace, 1, Color::MINT, pixCopy);
        continue;
      }

      originalPixels.push_back(originalPointInPixelSpace);
      liftedTargetPixels.push_back(pointInPixelSpace);
    }
  }

  Vector<HPoint3> modelPoints;
  Vector<HVector3> searchNormals;
  mapToGeometry(geom, liftedTargetPixels, &modelPoints, &searchNormals);

  Vector<HVector3> transformedNormals = globalPose.inv() * searchNormals;
  Vector<HPoint3> searchRays = globalPose.inv() * modelPoints;
  Vector<HPoint2> searchPixPts = flatten<2>(HMatrixGen::intrinsic(searchIntrinsics) * searchRays);

  for (int i = 0; i < liftedTargetPixels.size(); ++i) {
    HPoint3 rayPt = searchRays[i];
    HPoint2 pixPt = searchPixPts[i];
    Color color = getColor(searchPix, pixPt);
    HPoint2 originalPointInPixelSpace = originalPixels[i];

    if (transformedNormals[i].dot({rayPt.x(), rayPt.y(), 1.0f}) < 0) {
      drawPoint(originalPointInPixelSpace, 1, color, pixCopy);
      // drawPoint(pixPt, 1, color, pixCopy); // This draws the location of the target on the search
    } else {
      drawPoint(originalPointInPixelSpace, 1, Color::DARK_RED, pixCopy);
    }
  }
  writeOutputImage(pixCopy, name, outPaths);
}

void drawLiftedROIGpu(
  GlTexture2D &searchTexture,
  int searchRotation,
  const Gr8Pyramid &searchPyramid,
  const c8_PixelPinholeCameraModel &searchIntrinsics,
  const HMatrix &globalPose,
  CurvyImageGeometry geom,
  const String &name,
  Vector<String> *outPaths,
  float roiAspectRatio = 0.75) {
  C8Log("[cylindrical-detect] Drawing Lifted ROI GPU with aspect ratio %f", roiAspectRatio);
  geom.radius += SHADER_ROI_RADIUS_INCREASE;
  geom.radiusBottom += SHADER_ROI_RADIUS_INCREASE;
  auto height = searchPyramid.level(0).rows();
  RGBA8888PlanePixelBuffer outBuf(height, height * roiAspectRatio);
  auto o = outBuf.pixels();
  GlFramebufferObject dest;
  dest.initialize(
    makeLinearRGBA8888Texture2D(o.cols(), o.rows()), GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0);
  CurvyTexWarper warpTexture = compileWarpCurvyTexture2D();

  HPoint2 searchDims{
    static_cast<float>(searchPyramid.levels[0].w), static_cast<float>(searchPyramid.levels[0].h)};
  warpTexture(
    geom,
    HMatrixGen::intrinsic(searchIntrinsics),
    globalPose,
    searchRotation,
    roiAspectRatio,
    searchDims,
    searchTexture.tex(),
    &dest);

  glActiveTexture(GL_TEXTURE0);
  dest.bind();
  dest.tex().bind();
  glReadPixels(0, 0, o.cols(), o.rows(), GL_RGBA, GL_UNSIGNED_BYTE, o.pixels());
  dest.tex().unbind();
  dest.unbind();

  writeOutputImage(o, name, outPaths);
}

void drawMatchedPointsOnSearchImage(
  ConstRGBA8888PlanePixels targetPix,
  ConstRGBA8888PlanePixels searchPix,
  const TargetWithPoints &targetFramePoints,
  const FrameWithPoints &searchFramePoints,
  const Vector<PointMatch> &inlierMatches,
  const HMatrix &extrinsics,
  CurvyImageGeometry geom,
  const String &name,
  Vector<String> *outPaths) {
  RGBA8888PlanePixelBuffer pixCopyBuf(searchPix.rows(), searchPix.cols());
  auto pixCopy = pixCopyBuf.pixels();
  drawImageChannelGray(searchPix, 0, pixCopy);

  const auto &targetFramePixels = targetFramePoints.pixels();
  const auto &searchFramePixels = searchFramePoints.pixels();
  // extract matched target pixels and search rays
  Vector<HPoint2> targetPixels;
  Vector<HPoint2> searchPixels;
  for (const PointMatch &match : inlierMatches) {
    searchPixels.push_back(searchFramePixels[match.wordsIdx]);
    targetPixels.push_back(targetFramePixels[match.dictionaryIdx]);
  }
  drawPoints(targetPixels, 2, 2, Color::MANGO, pixCopy);
  drawPoints(searchPixels, 2, 2, Color::MINT, pixCopy);

  C8Log("Mapping geometry for matched points on search image numPoints=%d", targetPixels.size());
  Vector<HPoint3> pts;
  // We need to scale target pixels since the pose is computed on a different src size
  mapToGeometryPoints(geom, targetPixels, &pts);

  // Map these points onto the new image
  Vector<HPoint2> mappedTargetPts =
    flatten<2>((HMatrixGen::intrinsic(searchFramePoints.intrinsic()) * extrinsics.inv()) * pts);
  drawPoints(mappedTargetPts, 2, 2, Color::CHERRY, pixCopy);

  C8Log("Done. Now writing out %s", name.c_str());
  writeOutputImage(pixCopy, name, outPaths);
}

void drawTargetFeaturesOnSearchImage(
  ConstRGBA8888PlanePixels targetPix,
  ConstRGBA8888PlanePixels searchPix,
  const TargetWithPoints &targetFramePoints,
  const c8_PixelPinholeCameraModel &intrinsics,
  const HMatrix &extrinsics,
  CurvyImageGeometry geom,
  const String &name,
  Vector<String> *outPaths) {
  RGBA8888PlanePixelBuffer pixCopyBuf(searchPix.rows(), searchPix.cols());
  auto pixCopy = pixCopyBuf.pixels();
  drawImageChannelGray(searchPix, 0, pixCopy);

  // C8Log("Compute target features in image. Size=%d", targetFramePoints.pixels().size());
  // Vector<HPoint2> targetFeaturesInIm = targetFramePoints.pixels();
  C8Log("Generate all the pixels", "");
  Vector<HPoint2> targetFeaturesInIm;
  for (int i = 0; i < targetPix.cols(); i++) {
    for (int j = 0; j < targetPix.rows(); j++) {
      targetFeaturesInIm.emplace_back(static_cast<float>(i), static_cast<float>(j));
    }
  }
  Vector<HPoint3> pts;
  mapToGeometryPoints(geom, targetFeaturesInIm, &pts);
  Vector<HVector3> normals;
  mapToGeometryNormals(geom, targetFeaturesInIm, &normals);
  C8Log("Compute pixel colors for target pix of size=%d x %d", targetPix.cols(), targetPix.rows());
  auto colors = pixelColors(targetPix, targetFeaturesInIm);
  C8Log("Draw point cloud with back culling.", "");
  drawPointCloudWithBackCulling(intrinsics, extrinsics, pts, normals, colors, pixCopy);
  C8Log("Done. Now writing out %s", name.c_str());
  writeOutputImage(pixCopy, name, outPaths);
}

void runCurvyDetect(
  const String &targetFile,
  const CurvySpec &spec,
  const String &searchFile,
  int searchRotationDirection,
  Vector<String> *outPaths) {
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
  DetectionImage targetPts = extractTargetFeatures(
    targetFile,
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6),
    &targetLoader,
    &shader,
    spec);
  C8Log(
    "Extracted %d features from %s", targetPts.framePoints().points().size(), targetFile.c_str());

  // For an isRotated=true image, the pyramid will contain the original unrotated pixels. But
  // features and poses for the image will be rotated upright, so do that here for use in
  // visualization.
  RGBA8888PlanePixelBuffer targetPixBuffer;
  {
    ConstRGBA8888PlanePixels originalPix = targetLoader.gl().pyramid().level(0);
    targetPixBuffer = spec.isRotated
      ? RGBA8888PlanePixelBuffer(originalPix.cols(), originalPix.rows())
      : RGBA8888PlanePixelBuffer(originalPix.rows(), originalPix.cols());
    auto targetPix = targetPixBuffer.pixels();
    spec.isRotated ? rotate270Clockwise(originalPix, &targetPix)
                   : copyPixels(originalPix, &targetPix);
  }

  // The geometry that our DetectionImage has is the one to be used for mapping
  CurvyImageGeometry curvyGeom = targetPts.getGeometry();
  C8Log("[cylindrical-detect] Input curvy spec: %s", spec.toString().c_str());
  C8Log("[cylindrical-detect] Computed geometry: %s", curvyGeom.toString().c_str());
  C8Log(
    "[cylindrical-detect] Full computed geometry: %s",
    targetPts.getFullGeometry().toString().c_str());

  // Write the pyramid and extracted points.
  drawImageChannels(targetLoader.gl().pyramid().data, "target-pyramid.png", outPaths);
  drawFeaturesToFile(
    targetPts.framePoints(), targetPixBuffer.pixels(), "target-features.png", outPaths);

  // Read the search image from disk.
  C8Log("Reading image %s", searchFile.c_str());
  auto searchImg = readImageToRGBA(searchFile);
  auto searchPix = searchImg.pixels();

  // Load the search pixels into a texture.
  GlTexture2D searchTexture = makeLinearRGBA8888Texture2D(searchPix.cols(), searchPix.rows());
  searchTexture.bind();
  searchTexture.tex().setPixels(searchPix.pixels());
  searchTexture.unbind();

  // Initialize gpu processing for the search texture.
  int searchRotation = (searchPix.cols() > searchPix.rows()) ? searchRotationDirection : 0;
  GlRealityFrame gl;
  gl.initialize(&shader, searchPix.cols(), searchPix.rows(), searchRotation);

  // Since we're not yet tracking an image, configure the renderer to scan the central portion at
  // higher resolution.
  auto l0 = gl.pyramid().levels[0];
  c8_PixelPinholeCameraModel searchK = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6), l0.w, l0.h);
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
  C8Log("Global matcher found %d matches with no score limit", globalMatches.size());
  drawScoreHistogram(globalMatches, "global-match-histogram.png", outPaths);

  // Compute global matches again with the default score limit.
  globalMatches.clear();
  targetPts.globalMatcher().match(combinedPoints, 50, &globalMatches);
  C8Log("Global matcher found %d matches", globalMatches.size());

  // Draw the matches.
  drawMatches(
    targetPixBuffer.pixels(),
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
  // pyramid level 0 is where the features are in pixel coordinates

  getPointsOnGeometry(globalMatches, targetPts.framePoints().pixels(), curvyGeom, &globalWorldPts);
  getMatchedCamRays(globalMatches, combinedPoints, &globalCamRays);

  // C8Log("globalPoints=[", "");
  // for (HPoint3 &pt: globalWorldPts) {
  //   C8Log("%f, %f, %f,", pt.x(), pt.y(), pt.z());
  // }
  // C8Log("]", "");

  HMatrix globalPose = HMatrixGen::i();
  // Run robustPnP to find the location of the camera with respect to the image target 3d model.
  Vector<uint8_t> globalInliers;
  RobustPoseScratchSpace scratch;
  RandomNumbers random;
  auto found = robustPnP(
    globalWorldPts,
    globalCamRays,
    HMatrixGen::i(),
    // Cylinder
    // {.35f, 1e-2f, 7, 200e-6, 10, 100, -9.0f, 0.67f, 45.0f},
    // Cone
    {.20f, 1e-2f, 7, 200e-6, 10, 100, -9.0f, 0.67f, 45.0f},
    &globalPose,
    &globalInliers,
    &random,
    &scratch);

  if (!found) {
    C8Log("Target image was not found; we are done.");
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
    "Found image with global search: %d (%d match inliers)", found, globalMatchesInliers.size());
  drawMatches(
    targetPixBuffer.pixels(),
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
  auto globalLocatedImage =
    locate(targetFile, globalPose, curvyGeom, targetPts, camPos, scale, searchK);
  C8Log("Global pose %s", extrinsicToString(globalPose).c_str());

  C8Log(
    "Drawing to size=%d x %d. Curvy src rows=%d cols=%d",
    gl.pyramid().level(0).rows(),
    gl.pyramid().level(0).cols(),
    curvyGeom.srcRows,
    curvyGeom.srcCols);
  drawMatchedPointsOnSearchImage(
    targetPixBuffer.pixels(),
    gl.pyramid().level(0),
    targetPts.framePoints(),
    combinedPoints,
    globalMatchesInliers,
    globalPose,
    curvyGeom,
    "matched-pairs.png",
    outPaths);

  drawTargetFeaturesOnSearchImage(
    targetPixBuffer.pixels(),
    gl.pyramid().level(0),
    targetPts.framePoints(),
    combinedPoints.intrinsic(),
    globalPose,
    curvyGeom,
    "overlay-global-location.png",
    outPaths);

  drawDetectedImageWithRoi(
    gl.pyramid().level(0),
    combinedPoints.intrinsic(),
    globalPose,
    curvyGeom,
    "global-location.png",
    outPaths);

  // Visualize the ROI we want to extract in our next round of feature extraction.
  drawRoi(
    searchTexture,
    searchRotation,
    gl.pyramid(),
    globalLocatedImage.roi,
    "region-of-interest.jpg",
    outPaths);

  drawLiftedROICpu(
    gl.pyramid().level(0),
    combinedPoints.intrinsic(),
    globalPose,
    curvyGeom,
    "lifted-roi-cpu.png",
    outPaths,
    ROI_ASPECT);

  drawLiftedROIGpu(
    searchTexture,
    searchRotation,
    gl.pyramid(),
    combinedPoints.intrinsic(),
    globalPose,
    curvyGeom,
    "lifted-roi-gpu.png",
    outPaths,
    ROI_ASPECT);

  // Now that we have found the target, rerun feature extraction focusing in on the image target.
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
  auto &localFeatures = getRoiFeatures(trackerData.roiPoints);
  auto featsRayInTargetView =
    projectSearchRayToTargetRay(targetPts, localFeatures, globalPose, curvyGeom);

  // Compute local matches in the space of the image target.
  Vector<PointMatch> localMatches;
  targetPts.localMatcher().useScaleFilter(true);
  targetPts.localMatcher().setDescriptorThreshold(64);
  targetPts.localMatcher().setRoiScale(true);
  targetPts.localMatcher().setRadius(0.1f);
  targetPts.localMatcher().findMatches(featsRayInTargetView, &localMatches);

  // Draw the local matches in the space of the image target.
  drawLocalMatches(
    targetPixBuffer.pixels(),
    targetPts.framePoints(),
    featsRayInTargetView,
    localMatches,
    "local-matches-projected.png",
    outPaths);

  // Draw the matches between both images.
  drawMatches(
    targetPixBuffer.pixels(),
    targetPts.framePoints(),
    gl.pyramid().level(0),
    localFeatures,
    localMatches,
    "local-matches.png",
    outPaths);
  C8Log("Local matcher found %d matches", localMatches.size());

  Vector<HPoint3> localWorldPts;
  Vector<HPoint2> camRays;
  // NOTE: We are switching between ray space and pixel space
  // .     just to get back to ray space for matching
  // TODO: (dat) avoid explicitly getting into pixel space if possible
  getPointsOnGeometry(localMatches, targetPts.framePoints().pixels(), curvyGeom, &localWorldPts);
  getMatchedCamRays(localMatches, localFeatures, &camRays);

  Vector<uint8_t> localInliers;
  RobustPoseScratchSpace scratch2;
  HMatrix localPose = globalPose;
  bool foundLocal = solvePnP(
    localWorldPts, camRays, {10, 20, 500e-6f, 1e-2f, 10.0f}, &localPose, &localInliers, &scratch2);

  if (!foundLocal) {
    C8Log("Target image was not found in local search; we are done.");
    return;
  }

  Vector<PointMatch> localMatchesInliers;
  for (int i = 0; i < localInliers.size(); ++i) {
    if (localInliers[i]) {
      localMatchesInliers.push_back(localMatches[i]);
    }
  }
  C8Log(
    "Found image with local search: %d (%d match inliers)", foundLocal, localMatchesInliers.size());
  // Draw the local matches in the space of the image target.
  drawLocalMatches(
    targetPixBuffer.pixels(),
    targetPts.framePoints(),
    featsRayInTargetView,
    localMatchesInliers,
    "local-matches-projected-inliers.png",
    outPaths);

  // Draw the matches between both images.
  drawMatches(
    targetPixBuffer.pixels(),
    targetPts.framePoints(),
    gl.pyramid().level(0),
    localFeatures,
    localMatchesInliers,
    "local-matches-inliers.png",
    outPaths);

  // Now we know the location of the camera with respect to the target image, but what we want is to
  // locate the target image with respect to the camera.
  auto localLocatedImage =
    locate(targetFile, localPose, curvyGeom, targetPts, camPos, scale, searchK);
  drawTargetFeaturesOnSearchImage(
    targetPixBuffer.pixels(),
    gl.pyramid().level(0),
    targetPts.framePoints(),
    combinedPoints.intrinsic(),
    localPose,
    curvyGeom,
    "overlay-local-location.png",
    outPaths);
  drawDetectedImageWithRoi(
    gl.pyramid().level(0), searchK, localPose, curvyGeom, "local-location.png", outPaths);
}

// Run cylindrical-detect two different ways:
//  1) bazel run //reality/quality/imagetargets:cylindrical-detect -- -s /path/to/search.png -i
//  /path/to/target.jpg -j /path/to/targets.json
//    - target.jpg is the key that we will look for in targets.json to construct the image target
//    geometry.
//  2) bazel run //reality/quality/imagetargets:cylindrical-detect -- -s /path/to/search.png -i
//  /path/to/target.jpg -a 0.399 -r false -c 1.0,1.0,0.0,0.0 -b 1.0
// Can also set the search rotation direction with -d. This will only affect w > h search images:
// 90 means device has been rotated 90 degrees counterclockwise, and -90 means device has been
// rotated 90 degrees clockwise.
int main(int argc, char *argv[]) {
  cxxopts::Options options(argv[0]);
  options.add_options()(
    "i,imagePath", "path to texture of the cropped curved image target", cxxopts::value<String>())(
    "s,searchPath", "path to camera feed image", cxxopts::value<String>())(
    "d,searchRotationDirection",
    "If the search image has width > height, this determines whether"
    "we set rotation to 90 (counterclockwise phone rotation) or -90 (clockwise phone rotation)",
    cxxopts::value<int>()->default_value("90"))(
    "j,targetsJson", "path to the targets JSON file", cxxopts::value<String>()->default_value(""))(
    "a,arc", "arc value between (0,1]", cxxopts::value<float>())(
    "r,rotated", "is the texture rotated", cxxopts::value<bool>())(
    "c,crop",
    "CurvyOuterCrop values comma-separated, e.g. -crop 1.2,1.0,0.0,0.0",
    cxxopts::value<Vector<float>>()->default_value("1.0,1.0,0.0,0.0"))(
    "b,base", "CurvySpec.base value", cxxopts::value<float>()->default_value("1.0"));
  auto result = options.parse(argc, argv);
  String searchPath = result["searchPath"].as<String>();
  String imagePath = result["imagePath"].as<String>();
  int searchRotationDirection = result["searchRotationDirection"].as<int>();
  CurvySpec spec;

  auto targetsJson = result["targetsJson"].as<String>();
  if (!std::empty(targetsJson)) {
    C8Log("[cylindrical-detect] JSON file target geometry input");
    auto targetName = imagePath;
    const size_t lastSlashIdx = imagePath.find_last_of("\\/");
    if (std::string::npos != lastSlashIdx) {
      targetName.erase(0, lastSlashIdx + 1);
    }
    C8Log(
      "[cylindrical-detect] Looking in JSON file %s for target with key: \"%s\"",
      targetsJson.c_str(),
      targetName.c_str());
    auto targetJson = readJsonFile(targetsJson, targetName);
    spec = curvySpecFromTargetJson(targetJson);
  } else {
    C8Log("[cylindrical-detect] Command line target geometry input");
    auto arc = result["arc"].as<float>();
    auto cropVals = result["crop"].as<Vector<float>>();
    float base = result["base"].as<float>();
    bool rotated = result["rotated"].as<bool>();
    if (result.count("arc") == 0) {
      C8Log(
        "[cylindrical-detect] You have to provide the arc of the curve image target between (0,1]",
        "");
      return -1;
    }
    if (result.count("imagePath") == 0) {
      C8Log(
        "[cylindrical-detect] You have to specify the texture to visualize the features from", "");
      return -1;
    }
    if (result.count("searchPath") == 0) {
      C8Log(
        "[cylindrical-detect] You have to specify the search path (an image from the camera feed",
        "");
      return -1;
    }
    CurvyOuterCrop crop{cropVals[0], cropVals[1], cropVals[2], cropVals[3]};
    spec = CurvySpec{arc, rotated, crop, base};
  }
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  Vector<String> outPaths;
  {
    ScopeTimer t(APP_NAME);
    runCurvyDetect(imagePath, spec, searchPath, searchRotationDirection, &outPaths);
  }
  // C8Log("------------------\nTiming summary:");
  // ScopeTimer::logDetailedSummary();
  C8Log("------------------\nWrote output:");
  for (const auto &s : outPaths) {
    C8Log("%s", s.c_str());
  }
}
