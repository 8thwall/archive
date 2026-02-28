// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/io:image-io",
    "//c8/io:video-writer",
    "//c8/string:format",
  };
}
cc_end(0x4351a8a3);

#include "c8/c8-log.h"
#include "c8/io/image-io.h"
#include "c8/io/video-writer.h"
#include "c8/string/format.h"
#include "c8/stats/scope-timer.h"

using namespace c8;
const char *APP_NAME = "video-from-imgs";

int main(int argc, char *argv[]) {
  if (argc != 2) {
    C8Log(
      "ERROR: Missing input path(s).\n"
      "\n"
      "%s usage:\n"
      "    bazel run //reality/quality/codelab/pixels:%s -- /path/to/sequence\n",
      APP_NAME,
      APP_NAME);
    return -1;
  }
  VideoCollection videos_;
  ScopeTimer t("video-from-imgs");
  for (int i = 0; i < 10; ++i) {
    auto img = readImageToRGBA(format("%s/img_%03d.png", argv[1], i));
    videos_.encode("/tmp/mp4.mp4", img.pixels());
  }
  videos_.finish();
  C8Log("Wrote video /tmp/mp4.mp4");
  return 0;
}
