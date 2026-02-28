// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
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
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
  };
}
cc_end(0x93b7080d);

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
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/string.h"
#include "c8/string/format.h"
#include "c8/string/join.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image.h"

using namespace c8;

const char *APP_NAME = "planar-visualize-features";

// Definition for a planar image's geometry. This is meant to provide an analogue for curvy
// targets.
struct PlanarGeometry {
  // Basic 3d parameters.
  float width;
  float height;
  // Info needed for mapping from image space to 3d model space.
  int srcRows;
  int srcCols;
};

// Guess a geometry for a planar image target based on its pixel dimensions.
PlanarGeometry geometryForImage(ConstPixels p) {
  float maxDim = std::max(p.rows() - 1, p.cols() - 1);
  return {(p.cols() - 1) / maxDim, (p.rows() - 1) / maxDim, p.rows(), p.cols()};
}

// Project points in the image space to 3d points.
Vector<HPoint3> pixelsToModel(const Vector<HPoint2> &imPts, PlanarGeometry imGeo) {
  float xc = 0.5f * (imGeo.srcCols - 1);
  float yc = 0.5f * (imGeo.srcRows - 1);
  float sx = imGeo.width / (imGeo.srcCols - 1);
  float sy = imGeo.height / (imGeo.srcRows - 1);
  Vector<HPoint3> worldPts;
  std::transform(
    imPts.begin(),
    imPts.end(),
    std::back_inserter(worldPts),
    [xc, yc, sx, sy](HPoint2 p) -> HPoint3 {
      return {sx * (p.x() - xc), -sy * (p.y() - yc), 0.0f};
    });
  return worldPts;
}

// Draw the image target boundaries in 3d for a specified PlanarGeometry.
void drawPlanarImage(
  c8_PixelPinholeCameraModel k,
  const HMatrix &cam,
  PlanarGeometry im,
  Color c,
  RGBA8888PlanePixels out) {
  auto x = im.width * 0.5f;
  auto y = im.height * 0.5f;
  auto z = 0.0f;
  Vector<HPoint3> worldCorners = {
    {-x, -y, z},
    {-x, y, z},
    {x, y, z},
    {x, -y, z},
  };
  auto pix = flatten<2>((HMatrixGen::intrinsic(k) * cam.inv()) * worldCorners);
  drawShape(pix, 1, c, out);
}

// Draw a planar image target and its features.
void drawTargetAndFeatures(
  c8_PixelPinholeCameraModel k,
  const HMatrix &cam,
  PlanarGeometry im,
  Vector<HPoint3> &pts,
  const Vector<Color> &colors,
  RGBA8888PlanePixels out) {
  drawPlanarImage(k, cam, im, Color::DUSTY_VIOLET, out);
  drawPointCloud(k, cam, pts, colors, out);
}

// This "extract features" method gets image features in pixel space. In the engine, we use a
// DetectionImageLoader to load images to a TargetImage32 struct which represents points in ray
// space.
ImagePoints extractFeatures(
  ConstRGBA8888PlanePixels pix, GlRealityFrame *gl, Gr8FeatureShader *shader) {

  // Load the source pixels into a webgl texture.
  GlTexture2D imTexture = makeLinearRGBA8888Texture2D(pix.cols(), pix.rows());

  imTexture.bind();
  imTexture.tex().setPixels(pix.pixels());
  imTexture.unbind();

  int rotation = pix.cols() > pix.rows() ? 90 : 0;
  gl->initialize(shader, pix.cols(), pix.rows(), rotation);

  // In DetectionImageLoader, these gl steps are split into different methods that are invokable
  // by the caller. This allows processing to be spread across different frames in a way that
  // doesn't block the UI on load.
  gl->draw(imTexture.id(), GlRealityFrame::Options::DEFER_READ);
  gl->readPixels();

  auto l0 = gl->pyramid().levels[0];
  auto px = l0.w;
  float s = rotation == 90 ? pix.rows() * 1.0f / px : pix.cols() * 1.0f / px;
  Gr8Gl featureDetector = Gr8Gl::create();
  auto imPoints = featureDetector.detectAndCompute(gl->pyramid(), 2500);
  if (rotation == 90) {
    for (auto &pt : imPoints) {
      auto location = pt.location();
      auto x = location.pt.y;
      location.pt.y = px - 1 - location.pt.x;
      location.pt.x = x;
      location.pt.x *= s;
      location.pt.y *= s;
      pt.setLocation(location);
    }
  } else {
    for (auto &pt : imPoints) {
      auto location = pt.location();
      location.pt.x *= s;
      location.pt.y *= s;
      pt.setLocation(location);
    }
  }
  return imPoints;
}

void runPlanarFeatureVisualization(const String &filename, Vector<String> *outPaths) {
  // Read the image from disk.
  C8Log("Reading image %s", filename.c_str());
  auto img = readImageToRGBA(filename);
  auto pix = img.pixels();

  // Initialize the shader that will be used to detect feature points.
  GlRealityFrame gl;
  Gr8FeatureShader shader;
  shader.initialize();

  // Extract detection points from the image and print some stats.
  auto detectionPts = extractFeatures(pix, &gl, &shader);
  C8Log("Extracted %d features from %s", detectionPts.size(), filename.c_str());

  // Write the pyramid to a file
  outPaths->push_back(format("/tmp/%s_%02d_feature-pyramid.png", APP_NAME, outPaths->size()));
  writeImage(gl.pyramid().data, outPaths->back());

  // Extract points as pixel locations, discarding descriptor, orientation, and scale info.
  Vector<HPoint2> imPts;
  std::transform(
    detectionPts.begin(),
    detectionPts.end(),
    std::back_inserter(imPts),
    [](const ImagePoint &p) -> HPoint2 {
      return {p.location().pt.x, p.location().pt.y};
    });

  // Get the image source colors of the image.
  auto colors = pixelColors(pix, imPts);

  // Draw the points over the source image and save the image.
  drawPoints(imPts, 3, Color::MANGO, pix);
  outPaths->push_back(format("/tmp/%s_%02d_image-with-features.jpg", APP_NAME, outPaths->size()));
  writeImage(pix, outPaths->back());

  // Make a representation of the image's 3d geometry.
  auto imGeo = geometryForImage(pix);

  // Compute the location of the feature points within the image target's geometry.
  auto targetModelPts = pixelsToModel(imPts, imGeo);

  // Construct a visualization of the image target feature points from different views. This is a
  // 7x7 grid where each element is size 200x300, and each view is rotated 20 degrees from the
  // previous element, i,e. [60, 40, 20, 0, -20, -40 -60] degrees in the x and y directions.
  RGBA8888PlanePixelBuffer outbuf(7 * 300, 7 * 200);
  fill(Color::BLACK, outbuf.pixels());

  auto k = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6), 200, 300);

  for (int i = 0; i < 7; ++i) {
    for (int j = 0; j < 7; ++j) {
      // Extract the region of the buffer to draw to.
      auto out = crop(outbuf.pixels(), 300, 200, i * 300, j * 200);

      // Starting at the origin, rotate the desired amount, and then back up, so that the camera is
      // always facing the origin.
      auto pos = updateWorldPosition(
        updateWorldPosition(HMatrixGen::i(), HMatrixGen::rotationD((3 - i) * 20, (3 - j) * 20, 0)),
        HMatrixGen::translation(0, 0, -1.5));

      // Draw the image and its features with a camera at the specified location.
      drawTargetAndFeatures(k, pos, imGeo, targetModelPts, colors, out);
    }
  }

  outPaths->push_back(format("/tmp/%s_%02d_feature-images.png", APP_NAME, outPaths->size()));
  writeImage(outbuf.pixels(), outPaths->back());
}

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "ERROR: Missing image path.\n"
      "\n"
      "%s usage:\n"
      "    bazel run //reality/quality/imagetargets:%s -- "
      "/path/to/img.jpg\n",
      APP_NAME,
      APP_NAME);
    return -1;
  }
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  Vector<String> outPaths;
  {
    ScopeTimer t(APP_NAME);
    runPlanarFeatureVisualization(argv[1], &outPaths);
  }
  C8Log("------------------\nTiming summary:");
  ScopeTimer::logDetailedSummary();
  C8Log("------------------\nWrote output:");
  for (const auto &s : outPaths) {
    C8Log("%s", s.c_str());
  }
}
