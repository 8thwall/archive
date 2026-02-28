// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:string",
    "//c8/io:file-io",
    "//reality/engine/deepnets:tflite-debug",
    "@org_tensorflow//tensorflow/lite/schema:schema_fbs",
  };
}
cc_end(0x13962e42);

#include "c8/c8-log.h"
#include "c8/io/file-io.h"
#include "c8/string.h"
#include "reality/engine/deepnets/tflite-debug.h"
#include "tensorflow/lite/schema/schema_generated.h"

using namespace c8;

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "%s",
      "ERROR: Missing model path.\n"
      "\n"
      "tflite-graph usage:\n"
      "    bazel run //reality/quality/deepnets:tflite-graph -- /path/to/graph.tflite > g.gv\n");
    return -1;
  }

  // Read the file contents into a buffer that will last for the lifetime of the tflite::Model.
  auto fileData = readFile(argv[1]);

  auto model = tflite::GetModel(fileData.data());
  C8Log("%s", getGraphVizString((*model->subgraphs())[0], model).c_str());
}
