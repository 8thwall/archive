// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  data = {
    "//third_party/mediapipe/models:face-detection-front",
    "//third_party/mediapipe/models:face-landmark",
    "//third_party/mediapipe/models:face-landmark-attention",
    "//reality/engine/hands/data:handmeshmodel",
  };
  deps = {
    "//c8:c8-log",
    "//c8:map",
    "//c8:string",
    "//c8/io:file-io",
    "//c8/string:format",
    "//reality/engine/deepnets:tflite-debug",
    "@org_tensorflow//tensorflow/lite/schema:schema_fbs",
  };
}
cc_end(0xdc51f88c);

#include "c8/c8-log.h"
#include "c8/io/file-io.h"
#include "c8/map.h"
#include "c8/string.h"
#include "c8/string/format.h"
#include "reality/engine/deepnets/tflite-debug.h"
#include "tensorflow/lite/schema/schema_generated.h"

using namespace c8;

// FlatBuffer building:
//
// FlatBuffers have two important data types for building: Offsets and Tables. An Offset is
// a reference to a datastructure in the flatbuffer, and a table is a pure native implementation
// (without flatbuffers) of the whole structure tree. Given a flatbuffer struct like "Model", its
// offset is given by Offset<Model> and its table will be ModelT. For implementing generics,
// Model::NativeTableType == ModelT and ModelT::TableType == Model.
//
// Offsets can be unpacked into tables and tables can be packed into offsets. Since offsets are
// only valid for their buffers, this means that to transfer structured data from one buffer to
// another requires unpacking from the source buffer and and re-packing to the destination.
// Unpacking data from a table creates a new pointer to the pure native data structure that must
// be deleted.
//
// In FlatBuffers, creating a data structure refers to allocating a datastructure in the data and
// simultaneously populating its data. Data strcutures can be created in three ways:
//  *  CreateXyz: Create from a table of the current data type. Under the hood, this calls Pack.
//  *  CreateXyz: Create from offsets of all non-primitive children (including vectors and strings).
//  *  CreateXyzDirect(...): Create using native primitives for strings and lists, and offsets for
//     all other children. CreateVector / CreateString will be called under the hood to add these
//     variable sized structures to the buffer.
// Notably, creating an offset from child tables is not supprted. Those children must be first
// created (from their tables) and then supplied as inputs to either of the child-based creation
// methods above.
//
// Based on the above, the easiest way to manipulate flatbuffer data is to unpack a buffer into the
// native table type, modify it, then pack when you're ready to write.

// Serialize a NativeTableType pointer (e.g. ModelT) into a vector.
template <typename T>
Vector<uint8_t> serialize(T *m) {
  flatbuffers::FlatBufferBuilder fbb;
  FinishModelBuffer(fbb, T::TableType::Pack(fbb, m));
  Vector<uint8_t> data(fbb.GetSize());
  std::copy(fbb.GetBufferPointer(), fbb.GetBufferPointer() + fbb.GetSize(), data.begin());
  return data;
}

// Load a model and build a new identical model with the provided description and with the subgraph
// names (typcially one subgraph) rewritten to the supplied name, and write the new model to a
// file.
void rewriteNameAndDescription(
  const String &modelFile, const String &modelName, const String &modelDescription) {

  C8Log("Reading model %s", modelFile.c_str());
  auto fileData = readFile(modelFile);

  std::unique_ptr<tflite::ModelT> model(tflite::GetModel(fileData.data())->UnPack());

  model->description = modelDescription;
  for (auto &g : model->subgraphs) {
    if (g == nullptr) {
      continue;
    }
    g->name = modelName;
  }

  auto newModel = serialize(model.get());

  C8Log("Original model had size %d", fileData.size());
  C8Log("Got new model with size %d", newModel.size());

  const String outFile = format("/tmp/%s.fb", modelName.c_str());
  writeFile(outFile, newModel.data(), newModel.size());
  C8Log("Wrote file %s", outFile.c_str());
}

int main(int argc, char *argv[]) {
  const String descriptionApache2 =
    "Original License: Apache 2.0 "
    "github.com/8thwall/mediapipe/blob/d68f5e416903e3d756ebe07d08c4a3b911741a91/LICENSE; "
    "Modifications by 8th Wall Inc.";
  const String descriptionNiantic = "Copyright Niantic, Inc. All Rights Reserved.";

  rewriteNameAndDescription(
    "third_party/mediapipe/models/face_detection_front.tflite", "face_basic", descriptionApache2);
  rewriteNameAndDescription(
    "third_party/mediapipe/models/face_landmark.tflite", "face_detail", descriptionApache2);
  rewriteNameAndDescription(
    "third_party/mediapipe/models/face_landmark_with_attention.tflite",
    "face_landmark_with_attention",
    descriptionApache2);
  rewriteNameAndDescription(
    "reality/engine/hands/data/hand_mesh_v2.tflite", "hand_mesh_v2", descriptionNiantic);
}
