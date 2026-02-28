// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Command line application to transcode media using 8th Wall's media stack.
//
// Example Usage:
//   transcode input.webm output.mp4
//
// Container type is inferred from the extension of the file.
//
// Currently supports the following containers and codecs:
//   - Decoding of mkv/webm/mp4 files with codecs (vp8/vp9/h264/aac/opus)
//   - Encoding of mp4 files with codecs (h264/aac)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8/media:media-transcoder",
    "@cli11//:cli11",
    "@json//:json",
  };
}
cc_end(0x9a5a145a);

#include "c8/media/media-transcoder.h"

#include <CLI/CLI.hpp>
#include <nlohmann/json.hpp>

#define ASSERT_MEDIA(result)                     \
  {                                              \
    MediaStatus status = (result);               \
    if (0 != status.code()) {                    \
      fprintf(stderr, "%s\n", status.message()); \
      exit(status.code());                       \
    }                                            \
  }

using namespace c8;

using Json = ::nlohmann::json;

int main(int argc, char *argv[]) {
  CLI::App app{"transcode - 8th Wall media transcoder"};

  String inputPath;
  String outputPath;
  app.add_option("input", inputPath, "Input file to transcode")
    ->required()
    ->check(CLI::ExistingFile);
  app.add_option("output", outputPath, "Output file to create")->required();

  // Some simplistic defaults for now.
  String vcodec = "h264";
  String acodec = "aac";
  bool optimize = true;

  // Options for audio and video codecs. Must be codecs for which we have
  // encoding support, currently only h264 for video and aac for audio, which
  // are the defaults.
  app.add_option("--vcodec", vcodec, "Video codec");
  app.add_option("--acodec", acodec, "Audio codec");

  int vbitrate = 0;
  app.add_option("--vbitrate", vbitrate, "Video bitrate in bytes");

  // Post-process the encoded video when supported by the muxer. This can do
  // things like put track duration information in a header at the beginning of
  // the file.
  app.add_option("--optimize", optimize, "Optimize transcoded video with a post-processing step");

  CLI11_PARSE(app, argc, argv);

  Json inputOptions, outputOptions;

  inputOptions["path"] = inputPath;

  outputOptions["optimize"] = optimize;
  outputOptions["path"] = outputPath;
  outputOptions["tracks"] = Json::array();

  Json videoTrack;
  videoTrack["name"] = "video";
  videoTrack["codec"] = vcodec;
  if (vbitrate) {
    videoTrack["bitrate"] = vbitrate;
  }
  outputOptions["tracks"].push_back(videoTrack);

  Json audioTrack;
  audioTrack["name"] = "audio";
  audioTrack["codec"] = acodec;
  outputOptions["tracks"].push_back(audioTrack);

  MediaTranscoder transcoder;
  ASSERT_MEDIA(transcoder.open(inputOptions.dump(), outputOptions.dump()));

  String inputInfo, outputInfo;

  ASSERT_MEDIA(transcoder.getInfo(&inputInfo, &outputInfo));

  Json inputMeta = Json::parse(inputInfo);
  Json outputMeta = Json::parse(outputInfo);

  printf("\nInput from '%s'\n", inputMeta["path"].get<std::string>().c_str());
  int i = 0;
  for (const auto &track : inputMeta["tracks"]) {
    printf("  Track #%d:\n", i);
    printf("    %s\n", track.dump().c_str());
  }
  i = 0;
  printf("\nOutput from '%s'\n", outputMeta["path"].get<std::string>().c_str());
  for (const auto &track : outputMeta["tracks"]) {
    printf("  Track #%d:\n", i);
    printf("    %s\n", track.dump().c_str());
    ++i;
  }

  MediaStatus result;
  String metadata;
  while (result.code() == MediaStatus::SUCCESS) {
    result = transcoder.transcode(&metadata);
  }

  if (result.code() != MediaStatus::NO_MORE_FRAMES) {
    ASSERT_MEDIA(result);
  }

  ASSERT_MEDIA(transcoder.close());

  return 0;
}
