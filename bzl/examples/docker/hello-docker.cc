// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Nathan Waters (nathan@8thwall.com)
//
// CC file to run with Docker.  The arguments to docker vs the executable are split by "--" so the
// first argument goes to the docker run command and the second argument is passed to this
// executable.
// bazel run //bzl/examples/docker:hello-cc-docker --platforms=//bzl:amazonlinux --
// --mount type=bind,source=/absolute/path/to/datasets/dir,target=/root/datasets -- hello=moto

#include "bzl/inliner/rules2.h"

#include <cstdio>
#include <filesystem>

#include "c8/c8-log.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"

using namespace c8;

int main(int argc, char *argv[]) {
  C8Log("Hello, World!");
  C8Log("Num args: %d", argc);
  for (int i = 0; i < argc; i++) {
    C8Log("%s", argv[i]);
  }

  String absDatasetsDir = "/root/datasets";
  for (const auto & file : std::filesystem::directory_iterator(absDatasetsDir)) {
    C8Log("%s", file.path().c_str());
  }
  C8Log("Completed!");
  return 0;
}
