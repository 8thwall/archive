// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "reality-stream-factory.h",
  };
  deps = {
    ":disk-reality-stream",
    ":reality-stream-interface",
    ":remote-reality-stream",
    ":stdin-reality-stream",
    "//bzl/inliner:rules",
    "//c8:c8-log",
    "//c8:exceptions",
    "//c8:string",
    "@cxxopts//:cxxopts",
  };
}

#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"

#include <cxxopts.hpp>
#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "reality/quality/visualization/xrom/framework/disk-reality-stream.h"
#include "reality/quality/visualization/xrom/framework/remote-reality-stream.h"
#include "reality/quality/visualization/xrom/framework/stdin-reality-stream.h"

using namespace c8;

String RealityStreamFactory::defaultSource_ = "";
String RealityStreamFactory::REMOTE = "remote";
String RealityStreamFactory::STDIN = "stdin";

void RealityStreamFactory::setDefault(const String &defaultSource) {
  defaultSource_ = defaultSource;
}

std::unique_ptr<RealityStreamInterface> RealityStreamFactory::createFromFlags(
  int argc, char **argv) {
  cxxopts::Options options(argv[0]);
  options.add_options()(
    "r,realitySrc",
    "Source for reality, 'remote' for remote; 'stdin' for stdin, otherwise filename.",
    cxxopts::value<String>()->default_value(defaultSource_));

  String realitySrc;
  try {
    auto result = options.parse(argc, argv);
    realitySrc = result["realitySrc"].as<String>();
  } catch (cxxopts::option_not_exists_exception e) {
    C8Log("[reality-stream-factory] WARNING: unrecognized command-line flag: %s;", e.what());
    C8Log(
      "[reality-stream-factory] %s",
      "If you intended to use flags beyond '-r [xyz]' or '--realitySrc=[xyz], be aware that");
    C8Log(
      "                         %s",
      "extra command line flags interfere with reality-stream-factory; consider using the");
    C8Log("                         %s", "\"create\" interface instead of \"createFromFlags\"");
    throw std::move(e);
  }

  if (realitySrc.empty()) {
    C8_THROW(
      "[reality-stream-factory] No source specified for reality; use -r remote, -r stdin, or "
      "-r [filename]");
  }

  return create(realitySrc);
}

std::unique_ptr<RealityStreamInterface> RealityStreamFactory::create(const String &source) {
  C8Log("[reality-stream-factory] Loading reality from '%s'", source.c_str());
  if (source == REMOTE) {
    return std::unique_ptr<RealityStreamInterface>(new RemoteRealityStream());
  }
  if (source == STDIN) {
    return std::unique_ptr<RealityStreamInterface>(new StdinRealityStream());
  }
  return std::unique_ptr<RealityStreamInterface>(new DiskRealityStream(source));
}
