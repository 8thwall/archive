// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Train a set of cluster centers from Gr8 image features. All source images
// must be the same size to avoid reinitializing the pyramid.
//
// Example Usage:
//   bazel run //reality/quality/training:build-descriptor-dictionary -- -k 256 -s 200000 \
//       -o  ~/repo/code8/reality/engine/features/agate-dictionary-256.capnpbin
//       ~/datasets/benchmark/slam/measuredpose-201807/representative-keyframes/*/*

#include <random>

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:string",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//c8/io:image-io",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//reality/engine/features:feature-detector",
    "//reality/engine/features:gl-reality-frame",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/features:image-descriptor",
    "//reality/engine/features/api:descriptors.capnp-cc",
    "@cli11",
  };
}
cc_end(0xcef0dc24);

#include <CLI/CLI.hpp>
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <random>

#include "c8/c8-log.h"
#include "c8/io/capnp-messages.h"
#include "c8/io/image-io.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/stats/scope-timer.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/features/api/descriptors.capnp.h"
#include "reality/engine/features/feature-detector.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/image-descriptor.h"

using namespace c8;

using Descriptor = OrbFeature;

Vector<ImageDescriptor<Descriptor::size()>> sampleDescriptors(
  const Vector<String> &input, int targetSamples) {
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

  // Make a first pass through all the images, counting the total number of features.
  int totalFeatures = 0;

  ScopeTimer t("kmeans");

  for (const auto &imagePath : input) {
    image = readImageToRGBA(imagePath);

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

    totalFeatures += fwp.size();
  }

  double sampleRate = std::min(1.0, static_cast<double>(targetSamples) / totalFeatures);

  C8Log(
    "[build-descriptor-dictionary] Found %d total features across %lu images",
    totalFeatures,
    input.size());
  C8Log("[build-descriptor-dictionary] Will use a sampling rate of %0.3g", sampleRate);

  constexpr auto descriptorSize = Descriptor::size();

  Vector<ImageDescriptor<descriptorSize>> descriptors;
  descriptors.reserve(targetSamples);

  std::mt19937 rng(0);
  std::uniform_real_distribution<> disReal(0.0, 1.0);

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

    c8_PixelPinholeCameraModel m{80, 80, 40.0f, 40.0f, 600.0f, 600.0f};
    FrameWithPoints fwp(m);
    Vector<FrameWithPoints> rois;

    featureDetector.detectFeatures(gl.pyramid(), &fwp, &rois);

    for (const auto &desc : fwp.store().getFeatures<Descriptor>()) {
      if (descriptors.size() >= targetSamples) {
        return descriptors;
      }
      if (disReal(rng) < sampleRate) {
        descriptors.emplace_back(desc.clone());
      }
    }
  }
  return descriptors;
}

int main(int argc, char *argv[]) {
  CLI::App app{"build-descriptor-dictionary"};

  int k;
  Vector<String> input;
  int targetSamples;
  String output = "/tmp/descriptor-dictionary.capnpbin";

  app.add_option("-k", k, "Number of cluster centers")->required();

  app.add_option("-s", targetSamples, "Number of vectors to use as input")->required();
  app.add_option("-o", output, "Output clusters file");

  app.add_option("input", input, "Input images")->required()->check(CLI::ExistingFile);

  CLI11_PARSE(app, argc, argv);

  if (input.empty()) {
    C8Log("[build-descriptor-dictionary] %s", "Must specify image files");
    return 1;
  }

  constexpr auto descriptorSize = Descriptor::size();

  // Process images and sample Descriptors.
  Vector<ImageDescriptor<descriptorSize>> descriptors = sampleDescriptors(input, targetSamples);

  const auto numDescriptors = descriptors.size();

  C8Log("Using %ld descriptors for clustering", numDescriptors);

  // Seed the cluster indices.
  Vector<int> idx;

  std::random_device rd;
  std::mt19937 rng(rd());
  std::uniform_int_distribution<> disInt(0, descriptors.size() - 1);

  // Pick a random first index.
  idx.push_back(disInt(rng));

  // Sample the rest of the indices proportional to squared distance from minimum match.
  Vector<float> weights(numDescriptors, std::numeric_limits<float>::max());
  for (int i = 1; i < k; ++i) {
    const auto &cluster = descriptors[idx[i - 1]];
    for (int j = 0; j < numDescriptors; ++j) {
      float d = cluster.hammingDistance(descriptors[j]);
      weights[j] = std::min(weights[j], d * d);
    }

    std::discrete_distribution<int> pdf(weights.begin(), weights.end());
    idx.push_back(pdf(rng));
  }

  Vector<Descriptor> clusters;
  for (int id : idx) {
    const auto &cluster = descriptors[id];
    clusters.emplace_back(cluster.clone());
  }

  constexpr int maxIterations = 1000;

  Vector<int> assignments(numDescriptors, -1);
  Vector<int> lastAssignments = assignments;

  // Perform k-means iterations.
  for (int n = 0; n < maxIterations; ++n) {
    // Find the assignments for each descriptor.
    double error = 0.0;
    for (int j = 0; j < numDescriptors; ++j) {
      const auto &descriptor = descriptors[j];
      float closestDistance = std::numeric_limits<float>::max();
      for (int i = 0; i < k; ++i) {
        float d = descriptor.hammingDistance(clusters[i]);
        if (d < closestDistance) {
          closestDistance = d;
          assignments[j] = i;
        }
      }
      error += closestDistance;
    }

    error /= numDescriptors;

    printf("Error for iteration is %g\n", error);

    for (int i = 0; i < k; ++i) {
      Descriptor &cluster = clusters[i];
      Vector<int> bitCounts(descriptorSize << 3);
      int numAssignments = 0;
      for (int j = 0; j < numDescriptors; ++j) {
        if (assignments[j] != i) {
          continue;
        }
        numAssignments++;
        const auto &desc = descriptors[j];
        for (int p = 0; p < descriptorSize; ++p) {
          const int bitStart = p << 3;
          int data = desc.data()[p];
          for (int b = 0; b < 8; ++b) {
            bitCounts[bitStart + b] += data & 0b1;
            data = data >> 1;
          }
        }
      }
      const int halfway = numAssignments >> 1;
      for (int p = 0; p < descriptorSize; ++p) {
        const int bitStart = p << 3;

        uint8_t &byte = cluster.mutableData()[p];
        byte = 0;

        for (int b = 7; b >= 0; --b) {
          // Since vectors are binary, we choose the value for each bit that is
          // most common across each of the vectors assigned to the cluster.
          byte = (byte << 1) | (bitCounts[bitStart + b] >= halfway);
        }
      }
    }
    if (lastAssignments == assignments) {
      printf("Converged in %d iterations\n", n + 1);
      break;
    }
    lastAssignments = assignments;
  }

  MutableRootMessage<DescriptorDictionary> dictionary;

  dictionary.builder().setDescriptorSize(descriptorSize);
  dictionary.builder().initData(clusters.size() * descriptorSize);
  auto outputIter = dictionary.builder().getData().begin();

  for (const auto &cluster : clusters) {
    std::copy(cluster.data(), cluster.data() + cluster.size(), outputIter);
    std::advance(outputIter, cluster.size());
  }

  FILE *fd = std::fopen(output.c_str(), "wb");
  if (!fd) {
    C8Log("[build-descriptor-vocabulary] Failed opening file %s", output.c_str());
    return 1;
  }

  capnp::writeMessageToFd(fileno(fd), *dictionary.message());
  C8Log("[build-descriptor-vocabulary] Wrote clusters to %s", output.c_str());

  std::fclose(fd);

  return 0;
}
