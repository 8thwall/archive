// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  data = {
    "//third_party/mediapipe/models:face-detection-front",
  };
  deps = {
    "//c8:c8-log",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//c8/string:join",
    "//reality/engine/deepnets:tflite-interpreter",
  };
}
cc_end(0x1965de21);

// TODO(nb): "@org_tensorflow//tensorflow/lite/delegates/xnnpack:xnnpack_delegate",

#include <array>
#include <cstdio>

#include "c8/c8-log.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixels.h"
#include "c8/string/join.h"
#include "reality/engine/deepnets/tflite-interpreter.h"

using namespace c8;

// Currently we're hardcoding that we're taking a 128x128 crop of an input image; really we
// should be resizing and letterboxing the input.
int cropRowStart = 0;
int cropColStart = 110;

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "crop usage:\n"
      "    bazel run //reality/quality/codelab/deepnets:tflite -- /path/to/img.jpg\n");
    return -1;
  }
  C8Log("Reading image %s", argv[1]);
  auto im = readImageToRGBA(argv[1]);
  auto pix = im.pixels();

  // TODO(nb):  Do something better than crop the input image at 128x128.
  int cropRows = 128;
  int cropCols = 128;

  RGBA8888PlanePixels cropPix(
    cropRows,
    cropCols,
    pix.rowBytes(),
    pix.pixels() + cropRowStart * pix.rowBytes() + cropColStart * 4);

  const String modelFile = "third_party/mediapipe/models/face_detection_front.tflite";
  C8Log("Reading model %s", modelFile.c_str());
  TFLiteInterpreter interpreter(readFile(modelFile), 376832);

  auto *dst = interpreter->typed_input_tensor<float>(0);
  const float s = 1.0f / 127.5f;
  const uint8_t *src = cropPix.pixels();
  const uint8_t *srcStart = src;
  const uint8_t *srcEnd = srcStart + cropPix.cols() * 4;
  for (int r = 0; r < cropPix.rows(); ++r) {
    src = srcStart;
    while (src != srcEnd) {
      dst[0] = src[0] * s - 1.0f;
      dst[1] = src[1] * s - 1.0f;
      dst[2] = src[2] * s - 1.0f;
      src += 4;
      dst += 3;
    }
    srcStart += cropPix.rowBytes();
    srcEnd += cropPix.rowBytes();
  }

  interpreter->Invoke();

  const auto &outputTensorIdxs = interpreter->outputs();
  C8Log("invoked model and got %d outputs", outputTensorIdxs.size());
  for (int i = 0; i < outputTensorIdxs.size(); ++i) {
    auto *tensor = interpreter->tensor(outputTensorIdxs[i]);
    auto *dims = tensor->dims;
    C8Log("%d: %s[%s]", i, tensor->name, strJoin(dims->data, dims->data + dims->size, "|").c_str());
  }

  auto numBoxes = interpreter->tensor(outputTensorIdxs[1])->dims->data[1];
  int pos = 0;
  auto *classOutput = interpreter->typed_output_tensor<float>(1);
  float thresh = 0.75f;
  float st = -std::log((1.0f - thresh) / thresh);
  C8Log("using score threshold %f", st);
  for (int i = 0; i < numBoxes; ++i) {
    if (classOutput[i] > st) {
      ++pos;
    }
  }
  C8Log("Found %d hits", pos);

  String outPath = "/tmp/crop.jpg";
  C8Log("Writing cropped image to %s", outPath.c_str());
  writePixelsToJpg(cropPix, outPath);
}
