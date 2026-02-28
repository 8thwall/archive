// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Convert a PcaBasisData to a BinaryPcaData, by converting each float component
// into a single bit based on its sign. Also convert the translations vector
// into an indexed vector with one byte per component.
//
// Example Usage:
//   bazel run //reality/quality/training:binarize-pca-basis -- \
//       -i ~/repo/code8/reality/engine/features/agate-pca-basis-32d.capnpbin
//       -o  ~/repo/code8/reality/engine/features/agate-binary-pca-basis-32d.capnpbin

#include <random>

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:float-vector",
    "//c8:map",
    "//c8:string",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//reality/engine/features:pca-basis",
    "//reality/engine/features/api:descriptors.capnp-cc",
    "@cli11",
  };
}
cc_end(0x4fa086cc);

#include <CLI/CLI.hpp>
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <random>

#include "c8/c8-log.h"
#include "c8/float-vector.h"
#include "c8/io/capnp-messages.h"
#include "c8/map.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/features/api/descriptors.capnp.h"
#include "reality/engine/features/pca-basis.h"

using namespace c8;

int main(int argc, char *argv[]) {
  CLI::App app{"binarize-pca-basis"};

  String input;
  String output;

  app.add_option("-o", output, "Output BinaryPcaData file")->required();

  app.add_option("-i", input, "Input PcaBasisData file")->required()->check(CLI::ExistingFile);

  CLI11_PARSE(app, argc, argv);

  MutableRootMessage<PcaBasisData> inputBasisData;

  {
    FILE *fd = std::fopen(input.c_str(), "rb");
    if (!fd) {
      C8Log("[binarize-pca-basis] %s", "File opening failed");
      exit(1);
    }
    capnp::readMessageCopyFromFd(
      fileno(fd), *inputBasisData.message(), NO_TRAVERSAL_LIMIT_READER_OPTIONS);
    std::fclose(fd);
  }

  PcaBasis pca = PcaBasis::loadBasis(inputBasisData.reader());

  MutableRootMessage<BinaryPcaData> outputBasisData;
  auto builder = outputBasisData.builder();

  // Convert and store the binary basis.
  pca.storeBinaryBasis(builder);

  int basisSize = builder.getBasis().size();
  int bitsPerBlock = sizeof(uint64_t) << 3;
  int dimension = basisSize * bitsPerBlock / builder.getBasisVectorSize();

  C8Log(
    "Wrote %d 64-bit blocks corresponding to bit-matrix of size %dx%d",
    basisSize,
    dimension,
    basisSize * bitsPerBlock / dimension);

  {
    FILE *fd = std::fopen(output.c_str(), "wb");
    if (!fd) {
      C8Log("Failed opening output file %s", output.c_str());
      return 1;
    }

    capnp::writeMessageToFd(fileno(fd), *outputBasisData.message());
    std::fclose(fd);
  }
  C8Log("Wrote binary PCA basis to %s", output.c_str());

  return 0;
}
