// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  data = {
    "//third_party/mediapipe/models:face-detection-front",
    "//third_party/mediapipe/models:face-landmark",
  };
  deps = {
    "//c8:c8-log",
    "//c8:map",
    "//c8:string",
    "//c8/io:file-io",
    "//reality/engine/deepnets:tflite-debug",
    "@org_tensorflow//tensorflow/lite/schema:schema_fbs",
  };
}
cc_end(0xe29319f5);

#include "c8/c8-log.h"
#include "c8/io/file-io.h"
#include "c8/map.h"
#include "c8/string.h"
#include "c8/string/join.h"
#include "reality/engine/deepnets/tflite-debug.h"
#include "tensorflow/lite/schema/schema_generated.h"

using namespace c8;

int main(int argc, char *argv[]) {
  const String modelFile = "third_party/mediapipe/models/face_landmark.tflite";

  C8Log("Reading model %s", modelFile.c_str());
  auto fileData = readFile(modelFile);

  auto model = tflite::GetModel(fileData.data());
  auto g = (*model->subgraphs())[0];
  auto stats = getGraphStats(g);

  C8Log("Tensors at level:");
  for (int i = 0; i < stats.tensorsAtLevel.size(); ++i) {
    const auto &ts = stats.tensorsAtLevel[i];
    C8Log(
      "%2d:\n  %s",
      i,
      strJoin(ts.begin(), ts.end(), "\n  ", [g](int j) {return tensorStr(j, g, 0);}).c_str());
  }

  C8Log("Graph has %d operators, depth is %d", g->operators()->size(), stats.tensorsAtLevel.size());
  for (int i = 0; i < g->outputs()->size(); ++i) {
    auto idx = (*g->outputs())[i];
    C8Log("Output %d is tensor %d with depth %d", i, idx, stats.tensorDepths[idx]);
  }

  C8Log("-----------");

  C8Log("model: %s", modelStr(model, 0).c_str());
}
