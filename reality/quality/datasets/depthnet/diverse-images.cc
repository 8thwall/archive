// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Lynn Dang (lynn@8thwall.com)

/*
 * Loads images from a list of scene directories and selects 10 per scene.
 */
#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:string",
    "//c8/string:split",
    "//c8:vector",
    "//c8/io:image-io",
    "//c8/io:file-io",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//reality/engine/features:agate-descriptor",
    "//reality/engine/features:feature-detector",
    "//reality/engine/features:gl-reality-frame",
    "//reality/engine/features:gr8-feature-shader",
    "@cli11//:cli11",
  };
}
cc_end(0xbebbb8f7);

#include <CLI/CLI.hpp>
#include <filesystem>
#include <iostream>

#include "c8/c8-log.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/string.h"
#include "c8/string/split.h"
#include "c8/vector.h"
#include "reality/engine/features/agate-descriptor.h"
#include "reality/engine/features/feature-detector.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "c8/stats/scope-timer.h"

using namespace c8;

// How many images to choose per directory
constexpr int MAX_NUM_FILES = 10;

Vector<String> getFilesFromArgs(const String &pathStr) {
  Vector<String> files;

  std::filesystem::path directoryPath(pathStr);
  // Go through the directory and keep  the jpg files.
  for (auto &p : std::filesystem::directory_iterator(directoryPath)) {
    if (p.path().extension() == ".jpg") {
      files.push_back(p.path());
    }
  }
  return files;
}

FrameWithPoints computeFeatures(RGBA8888PlanePixels img, GlRealityFrame &gl) {
  // Load the source pixels into a gl texture.
  GlTexture2D imTexture = makeNearestRGBA8888Texture2D(img.cols(), img.rows());
  imTexture.bind();
  imTexture.tex().setPixels(img.pixels());
  imTexture.unbind();

  // Compute the features.
  gl.draw(imTexture.id(), GlRealityFrame::Options::DEFER_READ);
  gl.readPixels();

  // Compute and return the features for a requested index.
  c8_PixelPinholeCameraModel m;
  FrameWithPoints fwp(m);
  Vector<FrameWithPoints> rois;
  FeatureDetector featureDetector;

  featureDetector.detectFeatures(gl.pyramid(), &fwp, &rois);

  return fwp;
}

Vector<String> processFiles(const Vector<String> &files, int width, int height) {
  // If the number of files is already lower than the max, returns all files.
  if (files.size() <= MAX_NUM_FILES) {
    return files;
  }

  // Set up to get the features of each image.
  ScopeTimer t("diverse-images-process-file");
  Gr8FeatureShader shader;
  GlRealityFrame gl;
  Vector<ImageDescriptor32> frames;
  AgateDescriptor128 agate;
  shader.initialize();
  gl.initialize(&shader, width, height, 0);
  TreeSet<int> savedFilesIndex;
  Vector<Vector<int>> distances;

  float expectedRatio = static_cast<float>(width) / height;
  // Get the feature descriptors for each image.
  for (const auto &f : files) {
    auto im = readImageToRGBA(f);
    float calculatedRatio = static_cast<float>(im.pixels().cols()) / im.pixels().rows();
    if (calculatedRatio != expectedRatio) {
      C8_THROW("Incorrect input image ratio.");
    }

    auto frame = computeFeatures(im.pixels(), gl);

    frames.push_back(agate.extract(frame.store().getFeatures<OrbFeature>()));
  }

  // Calculate distances between all the images.
  for (const auto &f : frames) {
    distances.push_back({});
    auto &distancePerFrame = distances.back();

    for (const auto &f2 : frames) {
      distancePerFrame.push_back(f.hammingDistance(f2));
    }
  }

  // Start from the middle image of the scene, and select a number of diverse images based on the
  // distances between the descriptors.
  savedFilesIndex.insert(files.size() / 2);
  while (savedFilesIndex.size() < MAX_NUM_FILES) {
    int bestIdx = -1;
    int maxDist = -1;
    for (int i = 0; i < frames.size(); i++) {
      if (savedFilesIndex.count(i) > 0) {
        continue;
      }

      int minDist = distances[i][0];
      for (auto &j : savedFilesIndex) {
        if (distances[i][j] < minDist) {
          minDist = distances[i][j];
        }
      }

      if (minDist > maxDist) {
        bestIdx = i;
        maxDist = minDist;
      }
    }
    savedFilesIndex.insert(bestIdx);
  }

  // Return the filenames.
  Vector<String> filenames;
  for (int i : savedFilesIndex) {
    filenames.push_back(files[i]);
  }

  return filenames;
}

int main(int argc, char *argv[]) {
  CLI::App app{"diverse-images"};
  String directoriesList;
  String outputFile;
  int width = 256;
  int height = 192;
  // This tool expects an input argument with the full paths to all of the directories which can be
  // done by:
  //  ls -d path/to/hypersim/downloads/*/*/*final_preview/ > /path/to/directories.txt
  // The contents of the directories.txt files will appear as such:
  //    path/to/hypersim/downloads/*/*/*final_preview/ai_055_010/images/scene_cam_01_final_preview/
  // It will then generate the file specified by the second argument with the full paths to each
  // of the images that were selected.
  app
    .add_option(
      "--d,--directories", directoriesList, "File listing the full path to each hypersim scene.")
    ->required()
    ->check(CLI::ExistingFile);
  app
    .add_option(
      "--o,--output",
      outputFile,
      "Destination file to write the full path of each image that was selected.")
    ->required();
  app.add_option(
    "--w,--width",
    width,
    "Width of the image. Dimensions should at least be the same image ratio as the images.");
  app.add_option(
    "--h, --height",
    height,
    "Height of the image. Dimensions should at least be the same image ratio as the images.");
  CLI11_PARSE(app, argc, argv);

  auto ctx = OffscreenGlContext::createRGBA8888Context();

  // Get the directories from the file.
  String directoryString = readTextFile(directoriesList.c_str());
  auto directoryParts = split(directoryString, "\n");
  C8Log("[diverse-images] Number of directories: %d", directoryParts.size());
  FILE *file = fopen(outputFile.c_str(), "w");

  // Select the number of frames to keep for training and save to file to be split later.
  for (const auto &directory : directoryParts) {
    C8Log("[diverse-images] Processing: %s", directory.c_str());
    auto imageFiles = getFilesFromArgs(directory);
    auto savedFiles = processFiles(imageFiles, width, height);
    for (const auto &s : savedFiles) {
      fputs(s.c_str(), file);
      fputs("\n", file);
    }
  }
  fclose(file);
}
