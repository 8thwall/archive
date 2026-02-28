// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include <memory>

#include "c8/string.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

#pragma once

namespace c8 {

class RealityStreamFactory {
public:
  static String REMOTE;
  static String STDIN;

  // Set the default value for createFromFlags if no command line flags are passed in.
  static void setDefault(const String &defaultSource);

  // Create a reality stream from the supplied commandline flags -r or --realitySrc, e.g.
  //
  // --realitySrc=remote
  // -r stdin
  // --realitySrc=$HOME/Google\ Drive/datasets/sensorstream/201710/android-galaxyS6-hq.capnpbin
  static std::unique_ptr<RealityStreamInterface> createFromFlags(int argc, char **argv);

  // Create a reality stream from a specification. This can be one of
  //
  // RealityStreamFactory::REMOTE (take input from 8th Wall Remote)
  // RealityStreamFactory::STDIN (take input from stdin)
  //
  // otherwise the source is assumed to be a file name, and we attempt to load and stream from the
  // file.
  static std::unique_ptr<RealityStreamInterface> create(const String &source);

  // Don't construct.
  RealityStreamFactory() = delete;
  RealityStreamFactory(RealityStreamFactory &&) = delete;
  RealityStreamFactory &operator=(RealityStreamFactory &&) = delete;
  RealityStreamFactory(const RealityStreamFactory &) = delete;
  RealityStreamFactory &operator=(const RealityStreamFactory &) = delete;

private:
  static String defaultSource_;
};

}  // namespace c8
