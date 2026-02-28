// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Test vlfeat library.

#include <random>
#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    "//c8/io:image-io",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8:vector",
    "//reality/engine/features:gl-reality-frame",
    "//reality/engine/features:gr8gl",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/quality/datasets:benchmark-dataset",
    "@com_google_googletest//:gtest_main",
    "@vlfeat//:vl",
  };
}
cc_end(0x63cca571);

#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/vector.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/engine/features/gr8gl.h"
#include "c8/stats/scope-timer.h"
#include "reality/quality/datasets/benchmark-dataset.h"

#include "gtest/gtest.h"

#include <vl/kmeans.h>
#include <vl/mathop.h>
#include <vl/vlad.h>

namespace c8 {

class VlfeatTest : public ::testing::Test {
public:
  VlfeatTest()
      : numImages(BenchmarkDataset::size(BenchmarkName::SIMPLE10_480x640)),
        index(0) {
    // Preload all of the benchmark images.
    images.reserve(numImages);
    for (int i = 0; i < numImages; ++i) {
      images.emplace_back(BenchmarkDataset::loadRGBA(BenchmarkName::SIMPLE10_480x640, i));
    }
  }

  // Get the next benchmark image.
  RGBA8888PlanePixels nextImage() {
    auto image = images[index].pixels();
    index = (index + 1) % numImages;
    return image;
  }

protected:
  const int numImages;
  Vector<RGBA8888PlanePixelBuffer> images;
  int index;
};

TEST_F(VlfeatTest, KmeansVlad) {
  ScopeTimer t("kmeans-vlad");
  // Create an offscreen gl context.
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  // Initialize shaders.
  Gr8FeatureShader shader;
  shader.initialize();

  auto img = nextImage();

  GlRealityFrame gl;
  gl.initialize(&shader, img.cols(), img.rows(), 0);

  // These mirrors the parameters that are in 8th Wall XR.
  auto gr8 = Gr8Gl::create();

  // Load the source pixels into a gl texture.
  GlTexture2D imTexture = makeNearestRGBA8888Texture2D(img.cols(), img.rows());

  int features = 0;
  Vector<float> featureData;

  for (int i = 0; i < numImages; ++i, img = nextImage()) {
    imTexture.bind();
    imTexture.tex().setPixels(img.pixels());
    imTexture.unbind();

    gl.draw(imTexture.id(), GlRealityFrame::Options::DEFER_READ);
    gl.readPixels();
    auto pts = gr8.detectAndCompute(gl.pyramid());

    for (const auto &pt : pts) {
      const auto &desc = pt.features().get<OrbFeature>();
      featureData.insert(std::end(featureData), desc.data(), desc.data() + desc.size());
      ++features;
    }
  }

  printf(
    "Found %d features across %d images, dataSize = %lu\n",
    features,
    numImages,
    featureData.size());

  constexpr int k = 64;
  constexpr int descriptorSize = Gr8Gl::descriptorSize();
  constexpr int imageFeatureSize = k * descriptorSize;

  double energy;
  const float *centers;
  // Use float data and the L2 distance for clustering
  std::unique_ptr<VlKMeans, decltype(vl_kmeans_delete) *> kmeans = {
    vl_kmeans_new(VL_TYPE_FLOAT, VlDistanceL2),
    vl_kmeans_delete,
  };

  // Use Lloyd algorithm
  vl_kmeans_set_algorithm(kmeans.get(), VlKMeansLloyd);
  // Initialize the cluster centers by randomly sampling the data
  vl_kmeans_init_centers_with_rand_data(
    kmeans.get(), featureData.data(), featureData.size() / features, features, k);
  // Run at most 100 iterations of cluster refinement using Lloyd algorithm
  vl_kmeans_set_max_num_iterations(kmeans.get(), 100);
  vl_kmeans_refine_centers(kmeans.get(), featureData.data(), features);
  // Obtain the energy of the solution
  energy = vl_kmeans_get_energy(kmeans.get());
  // Obtain the cluster centers
  centers = reinterpret_cast<const float *>(vl_kmeans_get_centers(kmeans.get()));

  std::vector<std::array<float, imageFeatureSize>> imageFeatures;

  for (int i = 0; i < numImages; ++i, img = nextImage()) {
    imTexture.bind();
    imTexture.tex().setPixels(img.pixels());
    imTexture.unbind();

    gl.draw(imTexture.id(), GlRealityFrame::Options::DEFER_READ);
    gl.readPixels();
    auto pts = gr8.detectAndCompute(gl.pyramid());

    // Features in this image
    featureData.clear();
    features = 0;

    for (const auto &pt : pts) {
      const auto &desc = pt.features().get<OrbFeature>();
      featureData.insert(std::end(featureData), desc.data(), desc.data() + desc.size());
      ++features;
    }

    printf("Found %d features in image %d, dataSize = %lu\n", features, i, featureData.size());

    // Create the VLAD feature for this image.
    std::unique_ptr<vl_uint32[], decltype(vl_free) *> indexes = {
      reinterpret_cast<vl_uint32 *>(vl_malloc(sizeof(vl_uint32) * features)), vl_free};
    std::unique_ptr<float[], decltype(vl_free) *> distances = {
      reinterpret_cast<float *>(vl_malloc(sizeof(float) * features)), vl_free};
    std::unique_ptr<float[], decltype(vl_free) *> assignments = {
      reinterpret_cast<float *>(vl_malloc(sizeof(float) * features * k)), vl_free};
    std::unique_ptr<float[], decltype(vl_free) *> enc = {
      reinterpret_cast<float *>(vl_malloc(sizeof(float) * imageFeatureSize)), vl_free};

    // find nearest cluster centers for the data that should be encoded
    vl_kmeans_quantize(kmeans.get(), indexes.get(), distances.get(), featureData.data(), features);

    // convert indexes array to assignments array,
    // which can be processed by vl_vlad_encode
    memset(assignments.get(), 0, sizeof(float) * features * k);
    for (int i = 0; i < features; i++) {
      assignments[i * k + indexes[i]] = 1.;
    }

    // Encode the VLAD feature.
    vl_vlad_encode(
      enc.get(),
      VL_TYPE_FLOAT,
      vl_kmeans_get_centers(kmeans.get()),
      featureData.size() / features,
      k,
      featureData.data(),
      features,
      assignments.get(),
      0);

    imageFeatures.emplace_back();
    memcpy(imageFeatures.back().data(), enc.get(), sizeof(float) * imageFeatureSize);
  }

  VlFloatVectorComparisonFunction distFn = vl_get_vector_comparison_function_f(VlDistanceL2);

  printf("\n");

  // Print L2 distance between image features.
  for (int i = 0; i < imageFeatures.size(); ++i) {
    for (int j = 0; j < imageFeatures.size(); ++j) {
      float distance = 0.0;
      vl_eval_vector_comparison_on_all_pairs_f(
        &distance,
        imageFeatureSize,
        imageFeatures[i].data(),
        1,
        imageFeatures[j].data(),
        1,
        distFn);

      printf("Distance from image %d to %d is %f\n", i, j, distance);

      if (i == j) {
        EXPECT_EQ(0.0f, distance);
      } else {
        EXPECT_LT(0.0f, distance);
      }
    }
    printf("\n");
  }
}

}  // namespace c8
