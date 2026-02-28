// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Reduce the dimensionality in a PcaBasisData by dropping basis vectors.
//
// Example Usage:
//   // Reduce dimensionality to 32-dimensions.
//   bazel run //reality/quality/training:reduce-pca-basis -- -d 32 \
//       -i ~/repo/code8/reality/engine/features/agate-pca-basis-99.capnpbin
//       -o  ~/repo/code8/reality/engine/features/agate-pca-basis-32d.capnpbin

#include <random>

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:float-vector",
    "//c8:string",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//reality/engine/features:pca-basis",
    "//reality/engine/features/api:descriptors.capnp-cc",
    "@cli11",
  };
}
cc_end(0x98366e11);

#include <CLI/CLI.hpp>
#include <algorithm>
#include <cstdio>
#include <cstdlib>
#include <random>

#include "c8/c8-log.h"
#include "c8/float-vector.h"
#include "c8/io/capnp-messages.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/features/api/descriptors.capnp.h"
#include "reality/engine/features/pca-basis.h"

using namespace c8;

int main(int argc, char *argv[]) {
  CLI::App app{"reduce-pca-basis"};

  int d = 0;
  String input;
  String output;

  app.add_option("-o", output, "Output PcaBasisData file")->required();

  app.add_option("-d", d, "Output dimensionality")->required();

  app.add_option("-i", input, "Input PcaBasisData file")->required()->check(CLI::ExistingFile);

  CLI11_PARSE(app, argc, argv);

  MutableRootMessage<PcaBasisData> inputBasisData;

  {
    FILE *fd = std::fopen(input.c_str(), "rb");
    if (!fd) {
      C8Log("[reduce-pca-basis] %s", "File opening failed");
      exit(1);
    }
    capnp::readMessageCopyFromFd(
      fileno(fd), *inputBasisData.message(), NO_TRAVERSAL_LIMIT_READER_OPTIONS);
    std::fclose(fd);
  }

  PcaBasis pca = PcaBasis::loadBasis(inputBasisData.reader());

  MutableRootMessage<PcaBasisData> outputBasisData;
  pca.storeBasis(outputBasisData.builder(), d);

  C8Log(
    "Reducing PCA basis dimensions from %d to %d",
    inputBasisData.reader().getBasis().size() / inputBasisData.reader().getBasisVectorSize(),
    outputBasisData.reader().getBasis().size() / outputBasisData.reader().getBasisVectorSize());

  {
    FILE *fd = std::fopen(output.c_str(), "wb");
    if (!fd) {
      C8Log("Failed opening output file %s", output.c_str());
      return 1;
    }

    capnp::writeMessageToFd(fileno(fd), *outputBasisData.message());
    std::fclose(fd);
  }
  C8Log("Wrote PCA basis to %s", output.c_str());

  return 0;
}
