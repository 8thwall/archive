// Copyright (c) 2023 Niantic, Inc.
// Original Author: Dat Chu (datchu@nianticlabs.com)
// To cut a mp4 file using ffmpeg, you do
//   ffmpeg -i movie.mp4 -ss 00:00:03 -t 00:00:08 -async 1 cut.mp4
// where -ss is the start time and -t is the duration.
// You can drop -async 1 if you don't care about audio sync. mp4 recorded using our Recorder has no
// audio. You don't want to use -c copy because it won't reencode the video. There might not be a
// keyframe at the start of the cut.

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8/io:capnp-messages",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixels",
    "//c8/protolog/api:log-request.capnp-cc",
    "//c8/stats:scope-timer",
    "//c8/string:join",
    "//c8:c8-log",
    "//c8:c8-log-proto",
    "//c8:exceptions",
    "//c8:process",
    "//reality/quality/visualization/protolog:capnpbin-reader",
  };
}
cc_end(0x9bca6b2b);

#include <array>
#include <string>

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixels.h"
#include "c8/process.h"
#include "c8/protolog/api/log-request.capnp.h"
#include "c8/stats/scope-timer.h"
#include "c8/string/join.h"
#include "reality/quality/visualization/protolog/capnpbin-reader.h"

using namespace c8;

using MutableLogRecord = MutableRootMessage<LogRecord>;
bool VERBOSE = true;

String formatSeconds(float seconds) {
  int minutes = seconds / 60;
  int hours = minutes / 60;

  int baseSeconds = seconds;
  int decimalSeconds = (seconds - baseSeconds) * 1000.0;
  return format("%d:%02d:%02d.%03d", hours, minutes % 60, baseSeconds, decimalSeconds);
}

float parseFloatWithDefault(const char *str, float defaultValue) {
  if (strcmp(str, "-") == 0) {
    return defaultValue;
  }
  return atof(str);
}

void copyFile(const String &input, const String &output) {
  process::ExecuteOptions execOpts;
  execOpts.file = "cp";
  execOpts.redirectStderr = true;

  process::execute(execOpts, {"-n", input, output});
}

void trimVideo(const String &input, const String &output, float startSeconds, float endSeconds) {

  process::ExecuteOptions execOpts;
  execOpts.file = "ffmpeg";
  execOpts.redirectStderr = true;

  c8::Vector<String> args = {"-n", "-i", input};

  if (startSeconds != 0) {
    args.push_back("-ss");
    args.push_back(formatSeconds(startSeconds));
  }

  if (endSeconds < INFINITY) {
    args.push_back("-to");
    args.push_back(formatSeconds(endSeconds));
  }

  args.push_back("-async");
  args.push_back("1");
  args.push_back(output);

  process::execute(execOpts, args);
}

class StreamProcessor {
public:
  StreamProcessor(const char *outFileName, float startSeconds, float endSeconds) {
    startSeconds_ = startSeconds;
    endSeconds_ = endSeconds;
    outFile_ = std::fopen(outFileName, "wb");
  }

  void closeFd() {
    if (outFile_) {
      std::fclose(outFile_);
    }
  }

  ~StreamProcessor() { closeFd(); }

  // NOTE(dat): we are assuming that a new message is given every time and we can modify it in
  // place before writing.
  void processReality(MutableLogRecord *record) {
    ScopeTimer t("process");
    auto reader = record->reader();
    RealityRequest::Reader request = reader.getRealityEngine().getRequest();

    if (!started_) {
      if (VERBOSE) {
        auto deviceInfo = request.getDeviceInfo();
        C8Log(
          "[video-from-datarecorder] Manufacturer %s, Model %s, Os %s %s",
          deviceInfo.getManufacturer().cStr(),
          deviceInfo.getModel().cStr(),
          deviceInfo.getOs().cStr(),
          deviceInfo.getOsVersion().cStr());
      }
      started_ = true;
    }

    double frameTime = request.getSensors().getCamera().getCurrentFrame().getTimestampNanos() / 1e9;
    auto eventQueue = request.getSensors().getPose().getEventQueue();
    // A typical eventQueue looks like this
    // [trim-datarecorder-video] Frame time 1.321000
    // [ ( kind = linearAcceleration,
    //     timestampNanos = 26541000000,
    //     value = (x = -0.016786806, y = -0.02056348, z = 0.09377601),
    //     eventTimestampNanos = 26541000000,
    //     intervalNanos = 16666 ),
    //   ( kind = accelerometer,
    //     timestampNanos = 26541000000,
    //     value = (x = -0.093224145, y = -9.826251, z = 0.20784436),
    //     eventTimestampNanos = 26541000000,
    //     intervalNanos = 16666 ),
    //   ( kind = gyroscope,
    //     timestampNanos = 26541000000,
    //     value = (x = 0.65238, y = 0.94776022, z = -1.1725416),
    //     eventTimestampNanos = 26541000000,
    //     intervalNanos = 16666 ) ]
    // Notice that the event timestamps are generally later than the frame time. This is because
    // motion events are registered on the page 's load. The camera frame might not yet be available
    // then. In the simulator, we shift these event timestamps by subtracting them from the earliest
    // event timestamp we found. Thus, we don't need to modify event timestamps here on crop. We
    // simply need to shift the frame time by the start time.
    if (VERBOSE) {
      C8Log("[trim-datarecorder-video] Frame time %f", frameTime);
      C8LogCapnpMessage(eventQueue);

      if (frameTime < startSeconds_) {
        C8Log("[trim-datarecorder-video] Frame time %f is too early. Skipping", frameTime);
        return;
      }
      if (frameTime > endSeconds_) {
        C8Log("[trim-datarecorder-video] Frame time %f is too late. Skipping", frameTime);
        return;
      }
    }

    if (!foundSomeData_) {
      auto eventQueue =
        record->builder().getRealityEngine().getRequest().getSensors().getPose().getEventQueue();

      if (eventQueue.size() == 0) {
        C8Log(
          "[trim-datarecorder-video] No gyro data found on first frame. Choose a different start "
          "point.");
        exit(1);
      }

      foundSomeData_ = true;
    }

    // Write our capnp message out with its timestamp shifted
    record->builder()
      .getRealityEngine()
      .getRequest()
      .getSensors()
      .getCamera()
      .getCurrentFrame()
      .setTimestampNanos((frameTime - startSeconds_) * 1e9);
    capnp::writeMessageToFd(fileno(outFile_), *(record->message()));
  }

  void finish() {
    C8Log("[trim-datarecorder-video] Found some data? %d", foundSomeData_);
    C8Log("----------------\nExecution summary:");
    ScopeTimer::logBriefSummary();
    closeFd();
  }

private:
  FILE *outFile_;
  float startSeconds_;
  float endSeconds_;
  // Has the stream been run yet?
  bool started_ = false;
  bool foundSomeData_ = false;
};

// Assuming fileName is /path/to/file/log.1234413122-foo-bar-adwadwa
// Output /path/to/file/video.1234413122-foo-bar-adwadwa.mp4
String toMp4FileName(const String &fileName) {
  auto logDotLoc = fileName.find("log.");
  return fileName.substr(0, logDotLoc) + "video." + fileName.substr(logDotLoc + 4) + ".mp4";
}

int main(int argc, char *argv[]) {
  if (argc != 5) {
    C8Log(
      "%s",
      "ERROR: Missing sequence or video path.\n"
      "\n"
      "crop usage:\n"
      "    bazel run //reality/quality/codelab/pixels:trim-datarecorder-video -- /path/to/log.1234 "
      "/path/to/cropped-log.1234 startSeconds endSeconds\n");
    return -1;
  }

  float startSeconds = parseFloatWithDefault(argv[3], 0);
  float endSeconds = parseFloatWithDefault(argv[4], INFINITY);

  String videoInput = toMp4FileName(argv[1]);
  String videoOutput = toMp4FileName(argv[2]);

  bool videoExists = access(videoInput.c_str(), F_OK) != -1;

  if (!videoExists) {
    C8Log(
      "[trim-datarecorder-video] Video file %s doesn't exist. Processing logs only.",
      videoInput.c_str());
  }

  if (startSeconds == 0 && endSeconds == INFINITY) {
    C8Log("[trim-datarecorder-video] Copying files directly (no trim)");
    if (videoExists) {
      copyFile(videoInput, videoOutput);
    }
    copyFile(argv[1], argv[2]);
    return 0;
  }

  C8Log("[trim-datarecorder-video] Reading datarecorder log %s", argv[1]);
  C8Log("[trim-datarecorder-video] Writing datarecorder log %s", argv[2]);
  C8Log(
    "[trim-datarecorder-video] Trim to between %f seconds and %f seconds",
    startSeconds,
    endSeconds);

  // Since we need to access LogRecord at the top level without any special image unpacking, we
  // need to read the file as a CapnpbinReader.
  std::unique_ptr<CapnpbinReader> reader(CapnpbinReader::open(argv[1]));
  if (reader == nullptr) {
    C8Log("ERROR: Couldn't open \"%s\" for read.", argv[1]);
    return -1;
  }

  StreamProcessor processor(argv[2], startSeconds, endSeconds);
  std::unique_ptr<MutableLogRecord> loggedMessage(new MutableLogRecord());
  // Start reading through each logged message without decoding the image data
  while (reader->read(loggedMessage.get())) {
    processor.processReality(loggedMessage.get());
    // reset the log record for the next write. Otherwise we might have a long record got half
    // written by the next write
    loggedMessage.reset(new MutableLogRecord());
  }
  processor.finish();

  if (videoExists) {
    trimVideo(videoInput, videoOutput, startSeconds, endSeconds);
  }

  return 0;
}
