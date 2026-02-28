// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    ":image-target-json-loader",
    "//c8:c8-log",
    "//c8:hmatrix",
    "//c8:string",
    "//c8/camera:device-infos",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
    "//c8/geometry:parameterized-geometry",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//c8/string:join",
    "//reality/engine/imagedetection:detection-image",
    "//reality/engine/imagedetection:detection-image-loader",
    "@cxxopts//:cxxopts",
  };
}
cc_end(0xb3d072c6);

#include <array>
#include <cstdio>
#include <cxxopts.hpp>
#include <sstream>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/homography.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/parameterized-geometry.h"
#include "c8/hmatrix.h"
#include "c8/io/file-io.h"
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
#include "image-target-json-loader.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/imagedetection/detection-image-loader.h"
#include "reality/engine/imagedetection/detection-image.h"

using namespace c8;

const char *APP_NAME = "cylindrical-visualize-features";

// Draw a curvy image target and its features.
void drawTargetAndFeatures(
  c8_PixelPinholeCameraModel k,
  const HMatrix &cam,
  CurvyImageGeometry im,
  Vector<HPoint3> &pts,
  Vector<HVector3> &normals,
  const Vector<Color> &colors,
  RGBA8888PlanePixels out) {
  drawCurvyImage(k, cam, im, out);
  drawAxis(cam, HMatrixGen::intrinsic(k), HPoint3(0.0f, 0.0f, 0.0f), 0.2f, out);
  drawPointCloudWithBackCulling(k, cam, pts, normals, colors, out);

  auto curvyEdgePixelsInSearchPixel = curvyTargetEdgePixels(im, k, cam);
  drawPoints(curvyEdgePixelsInSearchPixel, 1, Color::MANGO, out);
}

void drawReconstructedTarget(
  const HMatrix &cam,
  CurvyImageGeometry im,
  Vector<HPoint3> &pts,
  Vector<HVector3> &normals,
  const Vector<Color> &colors,
  RGBA8888PlanePixels out) {
  auto allCamRays = flatten<2>(cam.inv() * pts);
  auto transformedNormals = cam.inv() * normals;

  Vector<HPoint2> camRaysInView;
  Vector<Color> colorsInView;

  // Test points for visibility againt camera ray normals.
  for (int i = 0; i < pts.size(); ++i) {
    HVector3 rayVector{allCamRays[i].x(), allCamRays[i].y(), 1.0f};
    if (transformedNormals[i].dot(rayVector) < 0) {
      camRaysInView.push_back({allCamRays[i].x(), allCamRays[i].y()});
      colorsInView.push_back(colors[i]);
    }
  }

  // Reconstruct visible feature pixels in image target space.
  auto reconstructedPixels = mapFromGeometry(im, cameraRaysToTargetWorld(im, camRaysInView, cam));

  // Compute the pixel scale difference between the image target and output.
  float scale = static_cast<float>(out.rows()) / im.srcRows;
  if (scale * im.srcCols > out.cols()) {
    scale = static_cast<float>(out.cols()) / im.srcCols;
  }

  // Crop out the inner central region of the output that matches the aspect ratio of the target.
  int outRows = scale * im.srcRows;
  int outCols = scale * im.srcCols;
  int startX = 0.5 * (out.cols() - outCols);
  int startY = 0.5 * (out.rows() - outRows);
  auto outCrop = crop(out, outRows, outCols, startY, startX);

  // Draw the border of the image target region.
  drawShape(
    {
      {0.0f, 0.0f},
      {static_cast<float>(outCrop.cols() - 1), 0.0f},
      {static_cast<float>(outCrop.cols() - 1), static_cast<float>(outCrop.rows() - 1)},
      {0.0f, static_cast<float>(outCrop.rows() - 1)},
    },
    1,
    Color::MANGO,
    outCrop);

  // Scale the reconstructed points to the output image and draw them.
  for (int i = 0; i < reconstructedPixels.size(); ++i) {
    HPoint2 scaledPt{reconstructedPixels[i].x() * scale, reconstructedPixels[i].y() * scale};
    drawPoint(scaledPt, 0, colorsInView[i], outCrop);
  }
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

void runCurvyFeatureVisualization(
  const String &filename, const CurvySpec &spec, Vector<String> *outPaths) {
  // Read the image from disk.
  C8Log("[cylindrical-visualize-features] Reading image %s", filename.c_str());
  auto img = readImageToRGBA(filename);
  auto pix = img.pixels();

  // Initialize the shader that will be used to detect feature points.
  GlRealityFrame gl;
  Gr8FeatureShader shader;
  shader.initialize();

  // Extract detection points from the image and print some stats.
  auto detectionPts = extractFeatures(pix, &gl, &shader);
  C8Log(
    "[cylindrical-visualize-features] Extracted %d features from %s",
    detectionPts.size(),
    filename.c_str());

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

  // Draw the points over the source image and save the image.
  drawPoints(imPts, 3, Color::MANGO, pix);
  outPaths->push_back(format("/tmp/%s_%02d_image-with-features.jpg", APP_NAME, outPaths->size()));
  writeImage(pix, outPaths->back());

  // Make a representation of the image's 3d geometry.
  CurvyImageGeometry imGeo, fullGeo;
  curvyForTarget(pix.cols(), pix.rows(), spec, &imGeo, &fullGeo);
  C8Log("[cylindrical-visualize-features] imGeo=%s", imGeo.toString().c_str());

  Vector<HPoint3> targetModelPts;
  Vector<HVector3> targetModelNormals;
  mapToGeometry(imGeo, imPts, &targetModelPts, &targetModelNormals);
  // Get the image source colors of the image.
  auto colors = pixelColors(pix, imPts);

  RGBA8888PlanePixelBuffer curvySurfaceReconstruction(imGeo.srcRows, imGeo.srcCols);
  fill(Color::BLACK, curvySurfaceReconstruction.pixels());
  auto reconstructed = mapFromGeometry(imGeo, targetModelPts);
  for (int i = 0; i < reconstructed.size(); ++i) {
    drawPoint(reconstructed[i], 1, colors[i], curvySurfaceReconstruction.pixels());
  }
  outPaths->push_back(format("/tmp/%s_%02d_reconstructed-target.png", APP_NAME, outPaths->size()));
  writeImage(curvySurfaceReconstruction.pixels(), outPaths->back());

  // Construct a full image forward visualization
  // NOTE(dat): This is slower than doing a backward visualization but less code
  // Backward visualization requires scanning the output image to get pixel, find those pixel
  // in the model space, then in the target space in order to draw the output image.
  Vector<HPoint2> allImPts;
  allImPts.reserve(pix.cols() * pix.rows());
  for (int i = 0; i < pix.cols(); i++) {
    for (int j = 0; j < pix.rows(); j++) {
      allImPts.emplace_back(static_cast<float>(i), static_cast<float>(j));
    }
  }
  auto fullColors = pixelColors(pix, allImPts);
  Vector<HPoint3> fullModelPts;
  Vector<HVector3> fullModelNormals;
  mapToGeometry(imGeo, allImPts, &fullModelPts, &fullModelNormals);

  // Construct a visualization of the image target feature points from different views. This is a
  // 7x7 grid where each element is size 200x300, and each view is rotated 20 degrees from the
  // previous element, i,e. [60, 40, 20, 0, -20, -40 -60] degrees in the x and y directions.
  RGBA8888PlanePixelBuffer outbuf(7 * 300, 7 * 200);
  RGBA8888PlanePixelBuffer reconstructions(7 * 300, 7 * 200);
  RGBA8888PlanePixelBuffer wrappedBuf(7 * 300, 7 * 200);
  fill(Color::BLACK, outbuf.pixels());
  fill(Color::BLACK, reconstructions.pixels());
  fill(Color::BLACK, wrappedBuf.pixels());

  auto k = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6), 200, 300);

  for (int i = 0; i < 7; ++i) {
    for (int j = 0; j < 7; ++j) {
      // Extract the region of the buffer to draw to.
      auto out = crop(outbuf.pixels(), 300, 200, i * 300, j * 200);
      auto reconstruction =
        crop(reconstructions.pixels(), 300 - 10, 200 - 10, i * 300 + 5, j * 200 + 5);
      auto wrapped = crop(wrappedBuf.pixels(), 300, 200, i * 300, j * 200);

      // Starting at the origin, rotate the desired amount, and then back up, so that the camera is
      // always facing the origin.
      auto pos = updateWorldPosition(
        updateWorldPosition(HMatrixGen::i(), HMatrixGen::rotationD((3 - i) * 20, (3 - j) * 20, 0)),
        HMatrixGen::translation(0, 0, -1.5));

      // Draw the image and its features with a camera at the specified location.
      drawTargetAndFeatures(k, pos, imGeo, targetModelPts, targetModelNormals, colors, out);
      drawReconstructedTarget(
        pos, imGeo, targetModelPts, targetModelNormals, colors, reconstruction);
      drawTargetAndFeatures(k, pos, imGeo, fullModelPts, fullModelNormals, fullColors, wrapped);
    }
  }

  outPaths->push_back(format("/tmp/%s_%02d_feature-images.png", APP_NAME, outPaths->size()));
  writeImage(outbuf.pixels(), outPaths->back());
  outPaths->push_back(format("/tmp/%s_%02d_reconstructed-targets.png", APP_NAME, outPaths->size()));
  writeImage(reconstructions.pixels(), outPaths->back());
  outPaths->push_back(format("/tmp/%s_%02d_wrapped-images.png", APP_NAME, outPaths->size()));
  writeImage(wrappedBuf.pixels(), outPaths->back());
}

// Run cylindrical-visualize-features two different ways:
//  1) bazel run //reality/quality/imagetargets:cylindrical-visualize-features -- -i
//  /path/to/target.jpg -j /path/to/targets.json
//    - target.jpg is the key that we will look for in targets.json to construct the image target
//    geometry.
//  2) bazel run //reality/quality/imagetargets:cylindrical-visualize-features -- -i
//  /path/to/target.jpg -a 0.399 -r false -c 1.0,1.0,0.0,0.0 -b 1.0
int main(int argc, char *argv[]) {
  cxxopts::Options options(argv[0]);
  options.add_options()(
    "i,imagePath", "path to texture of the cropped curved image target", cxxopts::value<String>())(
    "j,targetsJson", "path to the targets JSON file", cxxopts::value<String>()->default_value(""))(
    "a,arc", "arc value between (0,1]", cxxopts::value<float>())(
    "r,rotated", "is the texture rotated", cxxopts::value<bool>())(
    "c,crop",
    "CurvyOuterCrop values comma-separated, e.g. -crop 1.2,1.0,0.0,0.0",
    cxxopts::value<Vector<float>>()->default_value("1.0,1.0,0.0,0.0"))(
    "b,base", "CurvySpec.base value", cxxopts::value<float>()->default_value("1.0"));
  auto result = options.parse(argc, argv);
  String imagePath = result["imagePath"].as<String>();
  CurvySpec spec;

  auto targetsJson = result["targetsJson"].as<String>();
  if (!std::empty(targetsJson)) {
    C8Log("[cylindrical-visualize-features] JSON file target geometry input");
    auto targetName = imagePath;
    const size_t lastSlashIdx = imagePath.find_last_of("\\/");
    if (std::string::npos != lastSlashIdx) {
      targetName.erase(0, lastSlashIdx + 1);
    }
    C8Log(
      "Looking in JSON file %s for target with key: \"%s\"",
      targetsJson.c_str(),
      targetName.c_str());
    auto targetJson = readJsonFile(targetsJson, targetName);
    spec = curvySpecFromTargetJson(targetJson);
  } else {
    C8Log("[cylindrical-visualize-features] Command line target geometry input");
    auto arc = result["arc"].as<float>();
    auto cropVals = result["crop"].as<Vector<float>>();
    float base = result["base"].as<float>();
    bool rotated = result["rotated"].as<bool>();
    if (result.count("arc") == 0) {
      C8Log("You have to provide the arc of the curve image target between (0,1]", "");
      return -1;
    }
    if (result.count("imagePath") == 0) {
      C8Log("You have to specify the texture to visualize the features from", "");
      return -1;
    }
    CurvyOuterCrop crop{cropVals[0], cropVals[1], cropVals[2], cropVals[3]};
    spec = CurvySpec{arc, rotated, crop, base};
  }
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  Vector<String> outPaths;
  {
    ScopeTimer t(APP_NAME);
    runCurvyFeatureVisualization(imagePath, spec, &outPaths);
  }
  C8Log("------------------\nTiming summary:");
  ScopeTimer::logDetailedSummary();
  C8Log("------------------\nWrote output:");
  for (const auto &s : outPaths) {
    C8Log("%s", s.c_str());
  }
}
