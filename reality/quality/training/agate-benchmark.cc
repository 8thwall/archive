// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Benchmark for Agate descriptors, comparing quality to global matching.
//
// Example Usage:
//   bazel run //reality/quality/training:agate-benchmark -- -e multidescriptor128 \
//     ~/datasets/benchmark/slam/measuredpose-201807/representative-keyframes/lobby-tour/*
//
// Example Result:
//   Using 116 supplied images for benchmark with 50 images as queries
//   Recall @ N metric:
//      1   /    2    /    4    /    8    /   16
//     74.0% /  94.0%  /  100.0%  /  100.0%  /  100.0%
//   Triplets ranking accuracy metric:
//     99.0% after 1052 comparisons between matching and non-matching pairs
//     80.9% after 460 comparisons between matching and matching pairs
//   ROC metric:
//     96.9% Area Under Curve (AUC)

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
    "//reality/engine/features:agate-descriptor",
    "//reality/engine/features:agate-histogram",
    "//reality/engine/features:agate-multi-histogram",
    "//reality/engine/features:agate-pca",
    "//reality/engine/features:feature-detector",
    "//reality/engine/features:gl-reality-frame",
    "//reality/engine/features:global-matcher",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/engine/features:image-descriptor",
    "//reality/engine/features:pca-basis",
    "//reality/engine/features:point-matches",
    "//reality/engine/features/api:descriptors.capnp-cc",
    "@cli11",
  };
  testonly = 1;
}
cc_end(0xbe45f2b9);

#include <CLI/CLI.hpp>
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <functional>
#include <random>

#include "c8/c8-log.h"
#include "c8/float-vector.h"
#include "c8/io/capnp-messages.h"
#include "c8/io/image-io.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/features/agate-descriptor.h"
#include "reality/engine/features/agate-histogram.h"
#include "reality/engine/features/agate-multi-histogram.h"
#include "reality/engine/features/agate-pca.h"
#include "reality/engine/features/api/descriptors.capnp.h"
#include "reality/engine/features/feature-detector.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/global-matcher.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/image-descriptor.h"
#include "reality/engine/features/pca-basis.h"
#include "reality/engine/features/point-matches.h"

using namespace c8;

using Descriptor = OrbFeature;

// Number of point matches needed to consider two images a 'match'.
static constexpr int matchThreshold = 10;

// Run feature extraction on each of the requested images, returning all of the
// computed FrameWithPoints structures.
Vector<FrameWithPoints> computeFeatures(
  const Vector<String> &input, FeatureDetector &featureDetector) {
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

  // Load the source pixels into a gl texture.
  GlTexture2D imTexture = makeNearestRGBA8888Texture2D(cols, rows);

  Vector<FrameWithPoints> frames;
  frames.reserve(input.size());

  for (const auto &imagePath : input) {
    image = readImageToRGBA(imagePath);

    if (image.pixels().cols() != cols || image.pixels().rows() != rows) {
      C8Log("[agate-benchmark] %s", "All input images must have the same dimensions");
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
    frames.emplace_back(std::move(fwp));
  }
  return frames;
}

// Opaque descriptor base class for the purposes of this benchmark that could be
// implemented as any type, such as a FloatVector or ImageDescriptor.
class AgateBenchmarkDescriptorImpl {
public:
  virtual ~AgateBenchmarkDescriptorImpl(){};

protected:
  AgateBenchmarkDescriptorImpl() = default;
};

class AgateFloatVectorDescriptor : public AgateBenchmarkDescriptorImpl {
public:
  AgateFloatVectorDescriptor(FloatVector &&vector) : vector_(std::move(vector)) {}
  virtual ~AgateFloatVectorDescriptor() override {}

  const FloatVector &vector() const { return vector_; }

private:
  FloatVector vector_;
};

template <size_t N>
class AgateBinaryDescriptor : public AgateBenchmarkDescriptorImpl {
public:
  using Descriptor = ImageDescriptor<N>;

  AgateBinaryDescriptor(Descriptor &&descriptor) : descriptor_(std::move(descriptor)) {}
  virtual ~AgateBinaryDescriptor() override {}

  const Descriptor &descriptor() const { return descriptor_; }

private:
  Descriptor descriptor_;
};

// Wrapper for different types of descriptors, such as FloatVector or
// ImageDescriptor32.
class AgateBenchmarkDescriptor {
public:
  AgateBenchmarkDescriptor(AgateBenchmarkDescriptorImpl *impl) : impl_(impl) {}

  const AgateBenchmarkDescriptorImpl &impl() const { return *impl_; }

private:
  std::unique_ptr<AgateBenchmarkDescriptorImpl> impl_;
};

// Base class for Agate implementations to evaluate in this benchmark.
class AgateImpl {
public:
  virtual ~AgateImpl() noexcept(false){};

  // Extract an Agate descriptor into an opaque type used for this benchmark.
  virtual AgateBenchmarkDescriptor extract(const Vector<OrbFeature> &pts) = 0;

  // Compute the distance between two AgateBenchmarkDescriptors. Implementations override
  // this with the type of distance metric to use.
  virtual float distance(
    const AgateBenchmarkDescriptor &lhs, const AgateBenchmarkDescriptor &rhs) const = 0;
};

// Implementation of AgateImpl for a AgateHistogramExtractor.
class AgateHistogramImpl : public AgateImpl {
public:
  // Specify the dictionaryPath to load a custom dictionary, or leave null to
  // load the default dictionary.
  AgateHistogramImpl(
    const char *dictionaryPath,
    std::function<float(const FloatVector &, const FloatVector &)> distanceMetric)
      : distanceMetric_(distanceMetric) {
    if (dictionaryPath != nullptr) {
      // Load custom dictionary.
      FILE *fd = std::fopen(dictionaryPath, "rb");
      if (!fd) {
        C8Log("[agate-benchmark] %s", "File opening failed");
        exit(1);
      }
      MutableRootMessage<DescriptorDictionary> dictionary;
      capnp::readMessageCopyFromFd(fileno(fd), *dictionary.message());
      std::fclose(fd);

      const int dictionarySize =
        dictionary.reader().getData().size() / dictionary.reader().getDescriptorSize();

      C8Log("Read %d clusters from %s", dictionarySize, dictionaryPath);
      agate_.reset(new AgateHistogram32(dictionary.reader()));
    } else {
      // Load default dictionary.
      agate_.reset(new AgateHistogram32());
    }
  }

  virtual AgateBenchmarkDescriptor extract(const Vector<OrbFeature> &pts) override {
    return {new AgateFloatVectorDescriptor(agate_->extract(pts).clone())};
  }

  virtual float distance(
    const AgateBenchmarkDescriptor &lhs, const AgateBenchmarkDescriptor &rhs) const override {
    return distanceMetric_(
      static_cast<const AgateFloatVectorDescriptor &>(lhs.impl()).vector(),
      static_cast<const AgateFloatVectorDescriptor &>(rhs.impl()).vector());
  }

private:
  std::unique_ptr<AgateHistogram32> agate_;
  std::function<float(const FloatVector &, const FloatVector &)> distanceMetric_;
};

// Implementation of AgateImpl for a AgateMultiHistogramExtractor.
class AgateMultiHistogramImpl : public AgateImpl {
public:
  // Specify the dictionaryPath to load a custom dictionary, or leave null to
  // load the default dictionary.
  AgateMultiHistogramImpl(
    std::function<float(const FloatVector &, const FloatVector &)> distanceMetric)
      : distanceMetric_(distanceMetric) {
    // Load default multi-histogram.
    agate_.reset(new AgateMultiHistogram32());
  }

  virtual AgateBenchmarkDescriptor extract(const Vector<OrbFeature> &pts) override {
    return {new AgateFloatVectorDescriptor(agate_->extract(pts).clone())};
  }

  virtual float distance(
    const AgateBenchmarkDescriptor &lhs, const AgateBenchmarkDescriptor &rhs) const override {
    return distanceMetric_(
      static_cast<const AgateFloatVectorDescriptor &>(lhs.impl()).vector(),
      static_cast<const AgateFloatVectorDescriptor &>(rhs.impl()).vector());
  }

private:
  std::unique_ptr<AgateMultiHistogram32> agate_;
  std::function<float(const FloatVector &, const FloatVector &)> distanceMetric_;
};

// Implementation of AgateImpl for a AgatePca class.
template <typename AgateT>
class AgatePcaImpl : public AgateImpl {
public:
  // Specify the dictionaryPath to load a custom dictionary, or leave null to
  // load the default dictionary.
  AgatePcaImpl(std::function<float(const FloatVector &, const FloatVector &)> distanceMetric)
      : agate_(), distanceMetric_(distanceMetric) {}

  virtual AgateBenchmarkDescriptor extract(const Vector<OrbFeature> &pts) override {
    return {new AgateFloatVectorDescriptor(agate_.extract(pts).clone())};
  }

  virtual float distance(
    const AgateBenchmarkDescriptor &lhs, const AgateBenchmarkDescriptor &rhs) const override {
    return distanceMetric_(
      static_cast<const AgateFloatVectorDescriptor &>(lhs.impl()).vector(),
      static_cast<const AgateFloatVectorDescriptor &>(rhs.impl()).vector());
  }

private:
  AgatePca<AgateT> agate_;
  std::function<float(const FloatVector &, const FloatVector &)> distanceMetric_;
};

// Implementation of AgateImpl for the AgateDescriptor class.
template <typename GlobalDescriptor>
class AgateDescriptorImpl : public AgateImpl {
public:
  // This is the global descriptor. It is coincidence that it is the same size as 1 local
  // descriptor.
  using Descriptor = GlobalDescriptor;

  // Specify the dictionaryPath to load a custom dictionary, or leave null to
  // load the default dictionary.
  AgateDescriptorImpl(std::function<float(const Descriptor &, const Descriptor &)> distanceMetric)
      : agate_(), distanceMetric_(distanceMetric) {}

  virtual AgateBenchmarkDescriptor extract(const Vector<OrbFeature> &pts) override {
    return {new AgateBinaryDescriptor<Descriptor::size()>(agate_.extract(pts))};
  }

  virtual float distance(
    const AgateBenchmarkDescriptor &lhs, const AgateBenchmarkDescriptor &rhs) const override {
    return distanceMetric_(
      static_cast<const AgateBinaryDescriptor<Descriptor::size()> &>(lhs.impl()).descriptor(),
      static_cast<const AgateBinaryDescriptor<Descriptor::size()> &>(rhs.impl()).descriptor());
  }

private:
  AgateDescriptor<Descriptor> agate_;
  std::function<float(const Descriptor &, const Descriptor &)> distanceMetric_;
};

// Implementation of AgateImpl for the AgateDescriptor class.
template <typename GlobalDescriptor>
class AgateMultiDescriptorImpl : public AgateImpl {
public:
  // This is the global descriptor. It is coincidence that it is the same size as 1 local
  // descriptor.
  using Descriptor = GlobalDescriptor;

  // Specify the dictionaryPath to load a custom dictionary, or leave null to
  // load the default dictionary.
  AgateMultiDescriptorImpl(
    std::function<float(const Descriptor &, const Descriptor &)> distanceMetric)
      : agate_(), distanceMetric_(distanceMetric) {}

  virtual AgateBenchmarkDescriptor extract(const Vector<OrbFeature> &pts) override {
    return {new AgateBinaryDescriptor<Descriptor::size()>(agate_.extract(pts))};
  }

  virtual float distance(
    const AgateBenchmarkDescriptor &lhs, const AgateBenchmarkDescriptor &rhs) const override {
    return distanceMetric_(
      static_cast<const AgateBinaryDescriptor<Descriptor::size()> &>(lhs.impl()).descriptor(),
      static_cast<const AgateBinaryDescriptor<Descriptor::size()> &>(rhs.impl()).descriptor());
  }

private:
  AgateDescriptor<Descriptor, AgateMultiPca32> agate_;
  std::function<float(const Descriptor &, const Descriptor &)> distanceMetric_;
};

// Run the triplets ranking metric.
void runTripletsMetric(
  int numQueries,
  const Vector<FrameWithPoints> &frames,
  const AgateImpl &agate,
  const Vector<AgateBenchmarkDescriptor> &agateHistograms,
  FeatureDetector &featureDetector,
  GlobalMatcher<OrbFeature> &globalMatcher) {

  std::srand(0);
  std::uniform_int_distribution<int> dis(0, numQueries - 1);

  const int pairwiseTries = 50 * numQueries;

  std::mt19937 rng(0);
  int hits = 0;
  int matchHits = 0;
  int trys = 0;
  int matchTrys = 0;

  Vector<Vector<std::pair<int, size_t>>> matchingPairs(numQueries);
  Vector<Vector<std::pair<int, size_t>>> nonMatchingPairs(numQueries);

  for (int i = 0; i < numQueries; ++i) {
    const auto &frameQ = frames[i];
    for (int j = 0; j < numQueries; ++j) {
      if (i == j) {
        continue;
      }
      Vector<PointMatch> matches;
      Vector<PointMatch> fullMatches;
      const auto &frameA = frames[j];
      globalMatcher.prepare(frameA, POINT_MATCHES_DIST_TH_GLOBAL);
      globalMatcher.match(frameQ, &fullMatches);
      filterMatches(
        fullMatches,
        frameA,
        frameQ,
        POINT_MATCHES_DIST_TH_GLOBAL,
        POINT_MATCHES_GAUSSIAN_FILTER_DIST_TH_GLOBAL,
        &matches);
      if (matches.size() < matchThreshold) {
        nonMatchingPairs[i].emplace_back(j, matches.size());
      } else {
        matchingPairs[i].emplace_back(j, matches.size());
      }
    }
  }

  for (int i = 0; i < pairwiseTries; ++i) {
    // Choose 'q' via a uniform distribution.
    int q = dis(rng);
    if (matchingPairs[q].size() == 0 || nonMatchingPairs[q].size() == 0) {
      continue;
    }
    // Choose a matching image for 'a'.
    auto [a, matchCountA] = matchingPairs[q][std::rand() % matchingPairs[q].size()];

    // Choose either a matching or non-matching image for 'b'.
    auto [b, matchCountB] = std::rand() % 2 == 0
      ? matchingPairs[q][std::rand() % matchingPairs[q].size()]
      : nonMatchingPairs[q][std::rand() % nonMatchingPairs[q].size()];

    if (matchCountA == matchCountB) {
      // Skip ties.
      continue;
    }

    const auto &agateHistQ = agateHistograms[q];
    const auto &agateHistA = agateHistograms[a];
    const auto &agateHistB = agateHistograms[b];

    float agateDistanceA = agate.distance(agateHistQ, agateHistA);
    float agateDistanceB = agate.distance(agateHistQ, agateHistB);

    bool bothImagesAreMatches = matchCountA >= matchThreshold && matchCountB >= matchThreshold;

    if (matchCountA > matchCountB) {
      if (agateDistanceA < agateDistanceB) {
        if (bothImagesAreMatches) {
          matchHits++;
        } else {
          hits++;
        }
      }
    } else {
      if (agateDistanceA > agateDistanceB) {
        if (bothImagesAreMatches) {
          matchHits++;
        } else {
          hits++;
        }
      }
    }

    if (bothImagesAreMatches) {
      matchTrys++;
    } else {
      trys++;
    }
  }

  C8Log("%s", "Triplets ranking accuracy metric:");
  double accuracyHist = 100.0 * static_cast<double>(hits) / trys;
  double accuracyHistMatches = 100.0 * static_cast<double>(matchHits) / matchTrys;
  C8Log(
    "  %02.1f%% after %d comparisons between matching and non-matching pairs", accuracyHist, trys);
  C8Log(
    "  %02.1f%% after %d comparisons between matching and matching pairs",
    accuracyHistMatches,
    matchTrys);
}

// Run the Recall-at-N metric.
void runRecallMetric(
  int numQueries,
  const Vector<FrameWithPoints> &frames,
  const AgateImpl &agate,
  const Vector<AgateBenchmarkDescriptor> &agateHistograms,
  FeatureDetector &featureDetector,
  GlobalMatcher<OrbFeature> &globalMatcher) {
  Vector<int> bestMatchPosition;

  for (int i = 0; i < numQueries; ++i) {
    Vector<std::tuple<int, int>> globalMatchCount;
    Vector<std::tuple<float, int>> agateDistances;
    for (int j = 0; j < frames.size(); ++j) {
      if (i == j) {
        continue;
      }
      Vector<PointMatch> matches;
      Vector<PointMatch> fullMatches;
      globalMatcher.prepare(frames[j], POINT_MATCHES_DIST_TH_GLOBAL);
      globalMatcher.match(frames[i], &fullMatches);
      filterMatches(
        fullMatches,
        frames[j],
        frames[i],
        POINT_MATCHES_DIST_TH_GLOBAL,
        POINT_MATCHES_GAUSSIAN_FILTER_DIST_TH_GLOBAL,
        &matches);
      globalMatchCount.emplace_back(matches.size(), j);

      const float distance = agate.distance(agateHistograms[i], agateHistograms[j]);
      agateDistances.emplace_back(distance, j);
    }

    auto bestMatch = std::max_element(globalMatchCount.begin(), globalMatchCount.end());
    int bestMatchIdx = std::get<1>(*bestMatch);

    std::sort(agateDistances.begin(), agateDistances.end());

    auto matchesIndex = [bestMatchIdx](std::tuple<float, int> val) {
      return std::get<1>(val) == bestMatchIdx;
    };

    auto iter = std::find_if(agateDistances.begin(), agateDistances.end(), matchesIndex);
    int indexOfBest = std::distance(agateDistances.begin(), iter);
    bestMatchPosition.push_back(indexOfBest);
  }

  {
    C8Log("Recall @ N metric:\n%s", "    1   /    2    /    4    /    8    /   16");

    const auto &bmp = bestMatchPosition;
    auto recallAtN = [&bmp](int N) {
      return 100.0 * std::count_if(bmp.begin(), bmp.end(), [N](int val) { return val < N; })
        / bmp.size();
    };

    C8Log(
      "  %02.1f%% /  %02.1f%%  /  %02.1f%%  /  %02.1f%%  /  %02.1f%%",
      recallAtN(1),
      recallAtN(2),
      recallAtN(4),
      recallAtN(8),
      recallAtN(16));
  }
}

// Run the ROC (Area under curve) metric.
void runRocMetric(
  int numQueries,
  const Vector<FrameWithPoints> &frames,
  const AgateImpl &agate,
  const Vector<AgateBenchmarkDescriptor> &agateHistograms,
  FeatureDetector &featureDetector,
  GlobalMatcher<OrbFeature> &globalMatcher) {
  Vector<std::pair<double, bool>> classification;
  for (int i = 0; i < numQueries; ++i) {
    const auto &frameQ = frames[i];
    const auto &agateHistQ = agateHistograms[i];
    for (int j = 0; j < numQueries; ++j) {
      if (i == j) {
        continue;
      }
      const auto &frameA = frames[j];

      Vector<PointMatch> matches;
      Vector<PointMatch> fullMatches;
      globalMatcher.prepare(frameA, POINT_MATCHES_DIST_TH_GLOBAL);
      globalMatcher.match(frameQ, &fullMatches);
      filterMatches(
        fullMatches,
        frameA,
        frameQ,
        POINT_MATCHES_DIST_TH_GLOBAL,
        POINT_MATCHES_GAUSSIAN_FILTER_DIST_TH_GLOBAL,
        &matches);

      bool isMatch = matches.size() >= matchThreshold;
      const auto &agateHistA = agateHistograms[j];

      double agateDistance = agate.distance(agateHistQ, agateHistA);
      classification.emplace_back(agateDistance, isMatch);
    }
  }

  // Sort the vector by distance so that the area under the ROC curve can be
  // computed by the sum of trapezoids under the curve.
  std::sort(classification.begin(), classification.end());

  double lastTpr = 0.0f;
  double lastFpr = 0.0f;
  double auc = 0.0f;

  for (auto [threshold, _] : classification) {
    int tp = 0;
    int fp = 0;
    int tn = 0;
    int fn = 0;
    for (auto [distance, match] : classification) {
      if (distance <= threshold) {
        if (match) {
          tp++;
        } else {
          fp++;
        }
      } else {
        if (match) {
          fn++;
        } else {
          tn++;
        }
      }
    }
    double tpr = static_cast<double>(tp) / (tp + fn);
    double fpr = static_cast<double>(fp) / (fp + tn);
    auc += (fpr - lastFpr) * (lastTpr + tpr) / 2.0;

    lastTpr = tpr;
    lastFpr = fpr;
  }

  C8Log("%s", "ROC metric:");
  printf("  %2.1f%% Area Under Curve (AUC)\n", 100.0 * auc);
}

int main(int argc, char *argv[]) {
  CLI::App app{"agate-benchmark"};

  Vector<String> input;
  int numQueries = 50;
  Vector<String> metrics = {"recall", "triplets", "roc", "latency"};
  Vector<String> implNames = {
    "histograml1",
    "multihistograml1",
    "pcal2",
    "multipcal2",
    "descriptor128",
    "multidescriptor128"};

  app.add_option("-q", numQueries, "Number of images to use as queries");
  app.add_option("-m", metrics, "Metrics to run {recall, triplets, roc}");
  app.add_option("-e", implNames, "Implementations to run {histograml1, histograml2}");

  app.add_option("input", input, "Input images")->required()->check(CLI::ExistingFile);

  CLI11_PARSE(app, argc, argv);

  if (input.empty()) {
    C8Log("[agate-benchmark] %s", "Must specify image files");
    return 1;
  }

  FeatureDetector featureDetector;
  GlobalMatcher<OrbFeature> globalMatcher;
  ScopeTimer t("agate-benchmark-setup");

  // Compute features for all input images.
  Vector<FrameWithPoints> frames = computeFeatures(input, featureDetector);

  // Randomly shuffle the feature frames.
  std::mt19937 rng(0);
  std::shuffle(frames.begin(), frames.end(), rng);

  C8Log(
    "Using %d supplied images for benchmark with %d images as queries", frames.size(), numQueries);

  Vector<std::pair<String, std::unique_ptr<AgateImpl>>> impls;

  auto hasItem = [](const auto &vec, auto key) {
    return std::find(vec.begin(), vec.end(), key) != vec.end();
  };

  if (hasItem(implNames, "multihistograml1")) {
    impls.emplace_back(
      "Agate Multi-Histograms with L1 distances", new AgateMultiHistogramImpl(&l1Distance));
  }

  if (hasItem(implNames, "multihistograml2")) {
    impls.emplace_back(
      "Agate Multi-Histograms with L2 distances", new AgateMultiHistogramImpl(&l2Distance));
  }

  if (hasItem(implNames, "histograml1")) {
    impls.emplace_back(
      "Agate Histograms with L1 distances", new AgateHistogramImpl(nullptr, &l1Distance));
  }

  auto cosineDistance = [](const FloatVector &a, const FloatVector &b) {
    return 1.0f - innerProduct(a, b);
  };

  auto hammingDistance = [](const auto &a, const auto &b) { return a.hammingDistance(b); };

  if (hasItem(implNames, "histogramcos")) {
    impls.emplace_back(
      "Agate Histograms with cosine distances", new AgateHistogramImpl(nullptr, cosineDistance));
  }

  if (hasItem(implNames, "histograml1approx")) {
    impls.emplace_back(
      "Agate Histograms with approx LSH and L1 distances",
      new AgateHistogramImpl(nullptr, l1Distance));
  }

  if (hasItem(implNames, "histograml2")) {
    impls.emplace_back(
      "Agate Histograms with L2 distances", new AgateHistogramImpl(nullptr, &l2Distance));
  }

  if (hasItem(implNames, "pcal1")) {
    impls.emplace_back(
      "Agate PCA with L1 distances", new AgatePcaImpl<AgateHistogram32>(&l1Distance));
  }

  if (hasItem(implNames, "pcal2")) {
    impls.emplace_back(
      "Agate PCA with L2 distances", new AgatePcaImpl<AgateHistogram32>(&l2Distance));
  }

  if (hasItem(implNames, "multipcal2")) {
    impls.emplace_back(
      "Agate Multi PCA with L2 distances", new AgatePcaImpl<AgateMultiHistogram32>(&l2Distance));
  }

  if (hasItem(implNames, "pcacos")) {
    impls.emplace_back(
      "Agate PCA with cosine distances", new AgatePcaImpl<AgateHistogram32>(cosineDistance));
  }

  if (hasItem(implNames, "descriptor32")) {
    impls.emplace_back(
      "Agate Descriptor with 32 bytes",
      new AgateDescriptorImpl<ImageDescriptor32>(hammingDistance));
  }

  if (hasItem(implNames, "descriptor64")) {
    impls.emplace_back(
      "Agate Descriptor with 64 bytes",
      new AgateDescriptorImpl<ImageDescriptor64>(hammingDistance));
  }

  if (hasItem(implNames, "descriptor128")) {
    impls.emplace_back(
      "Agate Descriptor with 128 bytes",
      new AgateDescriptorImpl<ImageDescriptor<128>>(hammingDistance));
  }

  if (hasItem(implNames, "multidescriptor32")) {
    impls.emplace_back(
      "Agate Multi Descriptor with 32 bytes",
      new AgateMultiDescriptorImpl<ImageDescriptor32>(hammingDistance));
  }

  if (hasItem(implNames, "multidescriptor64")) {
    impls.emplace_back(
      "Agate Multi Descriptor with 64 bytes",
      new AgateMultiDescriptorImpl<ImageDescriptor64>(hammingDistance));
  }

  if (hasItem(implNames, "multidescriptor128")) {
    impls.emplace_back(
      "Agate Multi Descriptor with 128 bytes",
      new AgateMultiDescriptorImpl<ImageDescriptor<128>>(hammingDistance));
  }

  for (auto &[name, impl] : impls) {
    C8Log("%s", "---------------------------------------------------------------------");
    C8Log("Evaluating Benchmark - %s", name.c_str());
    C8Log("%s", "---------------------------------------------------------------------");

    {
      // Compute features and run quality metrics.
      ScopeTimer t("agate-benchmark");

      // Compute all of the Agate histograms.
      Vector<AgateBenchmarkDescriptor> agateHistograms;
      for (const auto &frame : frames) {
        agateHistograms.emplace_back(impl->extract(frame.store().getFeatures<OrbFeature>()));
      }

      if (hasItem(metrics, "recall")) {
        runRecallMetric(numQueries, frames, *impl, agateHistograms, featureDetector, globalMatcher);
      }

      if (hasItem(metrics, "triplets")) {
        runTripletsMetric(
          // numQueries, frames, *impl, agateHistograms, featureDetector);
          numQueries,
          frames,
          *impl,
          agateHistograms,
          featureDetector,
          globalMatcher);
      }

      if (hasItem(metrics, "roc")) {
        runRocMetric(numQueries, frames, *impl, agateHistograms, featureDetector, globalMatcher);
      }
    }

    if (hasItem(metrics, "latency")) {
      C8Log("%s", "Latency metric:");
      // Print out latency metrics.
      MutableRootMessage<LoggingSummary> summary;
      auto summaryBuilder = summary.builder();
      ScopeTimer::exportSummary(&summaryBuilder);

      auto summaryString = "  " + LatencySummarizer::formatSummaryBrief(summaryBuilder);

      // Indent summary by 2-spaces.
      size_t iter = 0;
      while ((iter = summaryString.find("\n", iter)) != String::npos) {
        summaryString.replace(iter, 1, "\n  ");
        iter += 3;
      }
      C8Log("%s", summaryString.c_str());
    }
  }
}
