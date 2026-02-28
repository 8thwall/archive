// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Train a PcaBasis from AgateMultiHistogram vectors. All source images
// must be the same size to avoid reinitializing the pyramid.
//
// Example Usage:
//   bazel run //reality/quality/training:train-agate-pca-basis-- -v 0.99 \
//       -o  ~/repo/code8/reality/engine/features/agate-pca-basis.capnpbin
//       ~/datasets/benchmark/slam/measuredpose-201807/representative-keyframes/*/*

#include <random>

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:float-vector",
    "//c8:string",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//c8/io:image-io",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//reality/engine/features:agate-multi-histogram",
    "//reality/engine/features:pca-basis",
    "//reality/engine/features:feature-detector",
    "//reality/engine/features:gl-reality-frame",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/features:image-descriptor",
    "//reality/engine/features/api:descriptors.capnp-cc",
    "@cli11",
  };
}
cc_end(0x86ab3eb3);

#include <CLI/CLI.hpp>
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <random>

#include "c8/c8-log.h"
#include "c8/float-vector.h"
#include "c8/io/capnp-messages.h"
#include "c8/io/image-io.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/features/agate-multi-histogram.h"
#include "reality/engine/features/api/descriptors.capnp.h"
#include "reality/engine/features/feature-detector.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/image-descriptor.h"
#include "reality/engine/features/pca-basis.h"

using namespace c8;

using Descriptor = ImageDescriptor32;

Vector<FloatVector> computeAgateVectors(const Vector<String> &input) {
  // Get the image dimensions from the first image.
  RGBA8888PlanePixelBuffer image = readImageToRGBA(input[0]);
  int cols = image.pixels().cols();
  int rows = image.pixels().rows();

  // Create an offscreen gl context.
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  // Initialize the Gr8 feature extractor.
  Gr8FeatureShader shader;
  shader.initialize();

  GlRealityFrame gl;
  gl.initialize(&shader, cols, rows, 0);

  FeatureDetector featureDetector;

  // Load the source pixels into a gl texture.
  GlTexture2D imTexture = makeNearestRGBA8888Texture2D(cols, rows);

  ScopeTimer t("train-agate-pca-basis");

  // Uncomment to train a multi-histogram. Requires 80GB+ RAM with current training pipeline.
  // AgateMultiHistogram32 agate;

  // Train a single-histogram PCA.
  AgateHistogram32 agate;

  Vector<FloatVector> descriptors;

  int n = 0;
  for (const auto &imagePath : input) {
    ++n;
    image = readImageToRGBA(imagePath);

    // All input images must have the same dimension to allow reusing the pyramid.
    if (image.pixels().cols() != cols || image.pixels().rows() != rows) {
      C8Log("[build-descriptor-dictionary] %s", "All input images must have the same dimensions");
      exit(1);
    }

    imTexture.bind();
    imTexture.tex().setPixels(image.pixels().pixels());
    imTexture.unbind();

    gl.draw(imTexture.id(), GlRealityFrame::Options::DEFER_READ);
    gl.readPixels();

    c8_PixelPinholeCameraModel m;
    FrameWithPoints fwp(m);
    Vector<FrameWithPoints> rois;

    featureDetector.detectFeatures(gl.pyramid(), &fwp, &rois);
    descriptors.emplace_back(agate.extract(fwp.store().getFeatures<OrbFeature>()).clone());
  }
  return descriptors;
}

int main(int argc, char *argv[]) {
  CLI::App app{"build-descriptor-dictionary"};

  float retainVariance = 0.99f;
  Vector<String> input;
  String output = "/tmp/descriptor-dictionary.capnpbin";

  app.add_option("-o", output, "Output clusters file");

  app.add_option("-v", retainVariance, "Variance to retain in PCA basis");

  app.add_option("input", input, "Input images")->required()->check(CLI::ExistingFile);

  CLI11_PARSE(app, argc, argv);

  if (input.empty()) {
    C8Log("[build-descriptor-dictionary] %s", "Must specify image files");
    return 1;
  }

  // Process images and sample Descriptors.
  Vector<FloatVector> agateVectors = computeAgateVectors(input);

  C8Log("Found %lu Agate vectors as input to PCA", agateVectors.size());

  PcaBasis pca = PcaBasis::generateBasis(agateVectors.begin(), agateVectors.end(), &retainVariance);

  FloatVector projection = pca.project(agateVectors[0].size());

  C8Log(
    "Trained a PCA basis reducing dimensions from %d to %d, while retaining %g of the variance",
    agateVectors[0].size(),
    projection.size(),
    retainVariance);

  MutableRootMessage<PcaBasisData> basis;
  pca.storeBasis(basis.builder());

  FILE *fd = std::fopen(output.c_str(), "wb");
  if (!fd) {
    C8Log("Failed opening output file %s", output.c_str());
    return 1;
  }

  capnp::writeMessageToFd(fileno(fd), *basis.message());
  C8Log("[build-descriptor-vocabulary] Wrote Agate PCA basis to %s", output.c_str());

  std::fclose(fd);

  return 0;
}
