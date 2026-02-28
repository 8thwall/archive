
/*
 * Useful methods for extracting UV information from mesh_map.png for Google's Facemesh
 */
#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "@opencv//:core",
    "@opencv//:imgproc",
    "//c8:hpoint",
    "//c8:c8-log",
    "//c8:color",
    "//c8:hpoint",
    "//c8:vector",
    "//c8/geometry:facemesh-data",
    "//c8/io:image-io",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-transforms",
    "//reality/quality/visualization/render:ui2",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0x514524c3);

#define _USE_MATH_DEFINES

#include <array>
#include <cmath>
#include <opencv2/imgproc.hpp>

#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/hpoint.h"
#include "c8/io/image-io.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/vector.h"
#include "reality/quality/visualization/render/ui2.h"

using namespace c8;

// Returns a boolean specifying if a triangle's three points are in clockwise order
// Algorithm from: https://stackoverflow.com/a/1165943/4447761
bool isClockwise(UV point1, UV point2, UV point3) {
  UV points[3] = {point1, point2, point3};

  int sum = 0;

  for (int i = 0; i <  3; i++) {
    const double x = points[(i + 1) % 3].u - points[i % 3].u;
    const double y = points[(i + 1) % 3].v + points[i % 3].v;
    sum += x * y;
  }

  return (sum >= 0) ? true : false;
}

// Updates the winding order
void setWindingOrder(
  int indices[], const int indexSize, const Vector<UV> &uvs, const int uvSize, bool setClockwise) {
  for (int i = 0; i < indexSize; i+= 3) {
    bool clockwise = isClockwise(uvs[indices[i]], uvs[indices[i + 1]], uvs[indices[i + 2]]);

    // If the user wants clockwise but it's not clockwise, or if the user doesn't want clockwise but
    // it is currently clockwise, then switch the second and third index.
    if (clockwise ^ setClockwise) {
      std::swap(indices[i + 1], indices[i + 2]);
    }
  }
}

void testSetWindingOrder() {
  int exampleIndices[] = {1, 2, 3, 4, 5, 6};
  c8::C8Log(
    "%s %d, %d, %d, %d, %d, %d",
    "At first INDICES is:",
     exampleIndices[0],
     exampleIndices[1],
     exampleIndices[2],
     exampleIndices[3],
     exampleIndices[4],
     exampleIndices[5]);

  setWindingOrder(exampleIndices, 6, FACEMESH_UVS, NUM_FACEMESH_POINTS, false);

  c8::C8Log(
    "%s %d, %d, %d, %d, %d, %d",
    "After setting winding order, INDICES is:",
     exampleIndices[0],
     exampleIndices[1],
     exampleIndices[2],
     exampleIndices[3],
     exampleIndices[4],
     exampleIndices[5]);
}

// Visualizes the circles extracted from an image using cv::HoughCircles
void visualizeHoughCircles(const std::string &inputFile) {
  c8::ScopeTimer t("create-yuv-visualization");

  c8::RGBA8888PlanePixelBuffer src = c8::readImageToRGBA(inputFile);
  c8::RGBA8888PlanePixels pixels = src.pixels();

  c8::YPlanePixelBuffer redBuffer(pixels.cols(), pixels.rows());
  c8::YPlanePixelBuffer blueBuffer(pixels.cols(), pixels.rows());
  c8::YPlanePixelBuffer greenBuffer(pixels.cols(), pixels.rows());
  c8::YPlanePixelBuffer alphaBuffer(pixels.cols(), pixels.rows());

  auto redChannel = redBuffer.pixels();
  auto blueChannel = blueBuffer.pixels();
  auto greenChannel = greenBuffer.pixels();
  auto alphaChannel = alphaBuffer.pixels();

  c8::splitPixels(pixels, &redChannel, &greenChannel, &blueChannel, &alphaChannel);

  c8::OneChannelPixels greenChannelThreshold;

  int greenMin = 224;
  int greenMax = 255;
  int detParam1 = 6;
  int detParam2 = 1;
  int maxSize = 4;
  int minDistance = 10;
  float accumulatorRes = 0.25;

  while (true) {
    // Convert C8 classes to cv::Mat to perform HoughCircles operations
    cv::Mat greenChannelMat(
      greenChannel.rows(),
      greenChannel.cols(),
      CV_8UC1,
      greenChannel.pixels(),
      greenChannel.rowBytes());

    cv::Mat greenChannelThresholdMat(
      greenChannel.rows(), greenChannel.cols(), CV_8UC1, cv::Scalar(0, 0, 255));

    std::vector<cv::Vec3f> cvCircles;

    cv::inRange(
      greenChannelMat,
      cv::Scalar(greenMin, greenMin, greenMin),
      cv::Scalar(greenMax, greenMax, greenMax),
      greenChannelThresholdMat);

    // Apply the Hough Transform to find the circles
    cv::HoughCircles(
      greenChannelThresholdMat,
      cvCircles,
      CV_HOUGH_GRADIENT,  // detection method
      accumulatorRes,     // accumulator resolution in comparison to source
      minDistance,        // minimum distance between the centers of the detected circles
      detParam1,          // detection method (CV_HOUGH_GRADIENT) parameter #1.
      detParam2,          // detection method (CV_HOUGH_GRADIENT) parameter #2.
      1,                  // minimum circle radius
      maxSize             // maximum circle radius
    );

    // convert the circles into HPoints and draw them
    c8::Vector<c8::HPoint2> circles;
    for (size_t i = 0; i < cvCircles.size(); i++) {
      circles.push_back({cvCircles[i][0], cvCircles[i][1]});
    }

    // Draw the circles detected
    c8::drawPoints(circles, 3, c8::Color(255, 0, 0), pixels);

    c8::show("Hough Circles Visualizing UVs", pixels);  // works and has red circles on it!
    c8::waitKey(0);
  }
}

int main(int argc, char *argv[]) {
  if (argc != 2) {
    c8::C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "yuv usage:\n"
      "    bazel run //reality/quality/faces/facemesh:facemesh-uvs -- /path/to/img.png\n");
    return -1;
  }

  visualizeHoughCircles(argv[1]);
}
