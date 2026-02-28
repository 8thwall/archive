// Copyright (c) 2022 Niantic, Inc.
// Original Author: Yuyan SOng (yuyansong@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:string",
    "//c8/io:file-io",
    "//c8/string:format",
    "//reality/engine/deepnets:tflite-model-operations",
    "//third_party/half:half",
    "@cli11//:cli11",
  };
}
cc_end(0x2367d0a2);

#include <CLI/CLI.hpp>
#include <iostream>
#include <string>

#include "c8/c8-log.h"
#include "c8/io/file-io.h"
#include "c8/string.h"
#include "c8/string/format.h"
#include "reality/engine/deepnets/tflite-model-operations.h"
#include "tensorflow/lite/schema/schema_generated.h"
#include "third_party/half/half.hpp"

using namespace c8;

void rewriteAndRotateTensors(const String &inModelFile, bool rotCW, const String &outModelName) {
  C8Log("Reading model %s", inModelFile.c_str());
  auto fileData = readFile(inModelFile);

  auto newModel = rotateModel(fileData.data(), rotCW);

  C8Log("Original model had size %d", fileData.size());
  C8Log("Got new model with size %d", newModel.size());

  // Write the model into a new file for testing.
  writeFile(outModelName, newModel.data(), newModel.size());
  C8Log("Wrote file %s", outModelName.c_str());
}

int main(int argc, char *argv[]) {
  CLI::App app{"model-rotator"};

  bool rotCW = false;
  String inputFile;
  String outFile;
  app.add_flag("-c,--cw", rotCW, "Rotate clockwise. Default is counter clockwise.");
  app.add_option("-i,--input", inputFile, "Input model path.")->required();
  app.add_option("-o,--output", outFile, "Output model path.")->required();

  CLI11_PARSE(app, argc, argv);

  rewriteAndRotateTensors(inputFile, rotCW, outFile);

  return 0;
}
