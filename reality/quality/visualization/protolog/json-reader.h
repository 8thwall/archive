// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Riyaan Bakhda (riyaanbakhda@nianticlabs.com)

#pragma once

#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/pixels/pixel-transforms.h"
#include "reality/quality/visualization/protolog/log-record-reader.h"

namespace c8 {

class JsonReader : public LogRecordReader {

public:
  static JsonReader *open(const char *logfile) { return new JsonReader(logfile); }

  JsonReader(const String &logfile) {
    // The logfile is expected to be the path to a "capture.json" file in the MASSF format
    // See https://<REMOVED_BEFORE_OPEN_SOURCING>.atlassian.net/wiki/spaces/AR/pages/360712457/
    // logfile is guaranteed to end with "capture.json" (as checked in log-record-capture.cc)
    captureJson_ = readJsonFile(logfile);
    totalFrameCount_ = captureJson_["frameCount"];
    currentFrame_ = 0;
    logfilePath_ = logfile.substr(0, logfile.length() - 12);  // "capture.json" has length 12
  }

  bool read(MutableRootMessage<LogRecord> *message);

private:
  nlohmann::json captureJson_;
  int currentFrame_ = 0;
  int totalFrameCount_ = 0;
  String logfilePath_;
};

}  // namespace c8
