// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Riyaan Bakhda (riyaanbakhda@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":log-record-reader",
    ":capnpbin-reader",
    ":json-reader",
    "@com_google_googletest//:gtest_main",
  };
  data = {
    "//reality/quality/visualization/protolog/data:reader-test-data",
  };
}
cc_end(0x41a7cbd7);

#include "gmock/gmock.h"
#include "gtest/gtest.h"
#include "reality/quality/visualization/protolog/capnpbin-reader.h"
#include "reality/quality/visualization/protolog/json-reader.h"
#include "reality/quality/visualization/protolog/log-record-reader.h"

using MutableLogRecord = c8::MutableRootMessage<c8::LogRecord>;

namespace c8 {

class LogRecordReaderTest : public ::testing::Test {};

TEST_F(LogRecordReaderTest, ReadCapnpbinMoreThanAvailableReturnFalse) {
  LogRecordReader *reader =
    CapnpbinReader::open("reality/quality/visualization/protolog/data/empty_log");
  MutableRootMessage<LogRecord> loggedMessage;
  EXPECT_FALSE(reader->read(&loggedMessage));
}

TEST_F(LogRecordReaderTest, ReadJsonMoreThanAvailableReturnFalse) {
  LogRecordReader *reader =
    JsonReader::open("reality/quality/visualization/protolog/data/capture.json");
  MutableLogRecord loggedMessage;
  EXPECT_TRUE(reader->read(&loggedMessage));
  EXPECT_TRUE(reader->read(&loggedMessage));
  EXPECT_TRUE(reader->read(&loggedMessage));
  EXPECT_FALSE(reader->read(&loggedMessage));
}

}  // namespace c8
