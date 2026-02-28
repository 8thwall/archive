// Copyright (c) 2022 Niantic, Inc.
// Original Author: Lynn Dang (lynndang@nianticlabs.com)
//
// Takes in an image and generates semantics from the image. Provides two visualizations of the
// semantics: individual classes in separate images and the max of all classes in one image.

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "@cli11//:cli11",
    "//c8:c8-log",
    "//c8:color",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/pixels:gl-pixels",
    "//c8/pixels:gpu-pixels-resizer",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/string:format",
    "//reality/engine/deepnets:multiclass-operations",
    "//reality/engine/semantics:semantics-classifier",
  };
  data = {
    "//reality/engine/semantics/data:semanticsnetportrait",
  };

  testonly = 1;
}
cc_end(0x9d306840);

#include <CLI/CLI.hpp>

#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/pixels/gl-pixels.h"
#include "c8/pixels/gpu-pixels-resizer.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/format.h"
#include "reality/engine/deepnets/multiclass-operations.h"
#include "reality/engine/semantics/semantics-classifier.h"

using namespace c8;

static constexpr char SEMANTICS_PORTRAIT_TFLITE_PATH[] =
  "reality/engine/semantics/data/semantics_mobilenetv3_separable_quarter_fp16.tflite";

int main(int argc, char *argv[]) {
  CLI::App app{"semantics-from-generator"};

  String inputFile;
  String outFolder;
  app.add_option("-i,--input", inputFile, "Input image file path.")->required();
  app.add_option("-o,--output", outFolder, "Output folder path.")->required();

  CLI11_PARSE(app, argc, argv);

  SemanticsClassifier classifier(readFile(SEMANTICS_PORTRAIT_TFLITE_PATH));

  // Reading in a given image.
  ScopeTimer t("semantics-from-generator");
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();
  auto im = readImageToRGBA(inputFile);
  auto pix = im.pixels();
  auto srcTexture = readImageToLinearTexture(pix);

  C8Log("Read input image of size (%d x %d)", pix.rows(), pix.cols());

  const int height = classifier.getInputHeight();
  const int width = classifier.getInputWidth();
  const int numClasses = classifier.getNumberOfClasses();

  // Resize image for semantics.
  GpuPixelsResizer inputGen;
  inputGen.drawNextImage();
  inputGen.draw(srcTexture.tex(), width, height);
  inputGen.read();

  auto image = inputGen.claimImage();

  writeImage(image, format("%s/semantics-input.jpg", outFolder.c_str()));

  // Classify image into semantics.
  Vector<FloatPixels> semanticsRes;
  classifier.generateSemantics(image, semanticsRes, {});

  // Writes an image for each class and its confidence level for the semantic.
  for (int i = 0; i < numClasses; ++i) {
    float *semanticOutput = semanticsRes[i].pixels();
    RGBA8888PlanePixelBuffer outIm(height, width);
    auto outPix = outIm.pixels();
    for (int c = 0; c < width; ++c) {
      for (int r = 0; r < height; ++r) {
        float semVal = semanticOutput[c + r * width];
        auto color = Color::viridis(semVal);
        auto *pix = &outPix.pixels()[r * outPix.rowBytes() + 4 * c];
        pix[0] = color.r();
        pix[1] = color.g();
        pix[2] = color.b();
      }
    }
    writeImage(outPix, format("%s/semantics-%02d.jpg", outFolder.c_str(), i));
  }

  // Writes a single image displaying max of all classes together.
  RGBA8888PlanePixelBuffer outIm(height, width);
  auto outPix = outIm.pixels();
  maxMultiClassMap(semanticsRes, numClasses, outPix);
  writeImage(outPix, format("%s/semantics-class.jpg", outFolder.c_str()));
}
