// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)

#include "reality/app/xr/ios/xr-ios.h"

#import <AVFoundation/AVFoundation.h>
#import <CoreImage/CoreImage.h>
#import <CoreVideo/CoreVideo.h>
#import <Metal/Metal.h>
#import <OpenGLES/ES3/gl.h>
#import <OpenGLES/ES3/glext.h>
#import <UIKit/UIKit.h>
#import <mutex>
#import <vector>

#include <arpa/inet.h>
#include <ifaddrs.h>

#include "c8/c8-log-proto.h"
#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "c8/io/capnp-messages.h"
#include "c8/protolog/xr-extern.h"
#include "c8/protolog/xr-requests.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/app/analytics/ios/xr-analytics-log-header-factory.h"
#include "reality/app/analytics/ios/xr-analytics-upload-controller.h"
#include "reality/app/app/ios-app.h"
#include "reality/app/device/ios-device-info.h"
#include "reality/app/disk/disk-reality-postprocessor.h"
#include "reality/app/validation/ios/xr-validation-controller.h"
#include "reality/app/xr/common/camera-framework.h"
#include "reality/app/xr/ios/xr-ios-interface.h"
#include "reality/app/xr/ios/xr-ios.h"

using namespace c8;

using MutableXrRemoteApp = c8::MutableRootMessage<c8::XrRemoteApp>;

namespace {

static std::unique_ptr<DiskRealityPostprocessor> staticProc = nullptr;

static NSFileHandle *fileHandle_ = nullptr;

DiskRealityPostprocessor *getInstance() {
  if (staticProc != nullptr) {
    return staticProc.get();
  }

  auto *xr = XRIos::getInstance();
  if (xr == nullptr) {
    C8Log("%s", "getInstance missing xr");
    return nullptr;
  }

  auto *proc = dynamic_cast<DiskRealityPostprocessor *>(xr->getRealityPostprocessor());
  if (proc == nullptr) {
    C8Log("%s", "getInstance missing processor");
    return nullptr;
  }

  return proc;
}

}  // namespace

#ifdef __cplusplus
extern "C" {
#endif

// Allocate and initialize a new disk recorder singleton.
C8_PUBLIC
void c8XRIos_createDiskRecorder() {
  C8Log("[xr-disk-ios] %s", "c8XRIos_createDiskRecorder");
  auto *xr = XRIos::getInstance();
  if (xr == nullptr) {
    throw new RuntimeError(
      "Must call XRIos::createInstance before creating DiskRealityPostprocessor.");
  }
  if (staticProc == nullptr) {
    staticProc.reset(new DiskRealityPostprocessor());
    staticProc->setEncodeJpg(true);
  }
  xr->setRealityPostprocessor(staticProc.get());
  xr->setFeatureProvider(std::unique_ptr<FeatureProvider>(new RemoteFeatureProvider()));
}

// Decommission and deallocate.
C8_PUBLIC
void c8XRIos_destroyDiskRecorder() {
  C8Log("[xr-disk-ios] %s", "c8XRIos_destroyDiskRecorder");
  staticProc.reset();
}

C8_PUBLIC
bool c8XRIos_isLogging() {
  // C8Log("[xr-disk-ios] %s", "c8XRIos_isLogging");
  auto *instance = getInstance();
  if (instance == nullptr) {
    return false;
  }

  if (instance->isLogging()) {
    return true;
  }

  return false;
}

C8_PUBLIC
void c8XRIos_logToDisk(int nFrames) {
  C8Log("[xr-disk-ios] %s %d frames", "c8XRIos_logToDisk", nFrames);
  auto *instance = getInstance();
  if (instance == nullptr) {
    C8Log("[xr-disk-ios] %s", "no instance exists for logging.");
    return;
  }

  NSString *tmpDirPath = NSTemporaryDirectory();
  NSUInteger timestamp = [[NSDate date] timeIntervalSince1970];
  NSString *fileName =
    [NSString stringWithFormat:@"%@log.%lu-%d", tmpDirPath, (unsigned long)timestamp, nFrames];

  [[NSFileManager defaultManager] createFileAtPath:fileName contents:nil attributes:nil];
  C8Log(
    "[xr-disk-ios] Opened %s for logging %d frames",
    [fileName cStringUsingEncoding:NSASCIIStringEncoding],
    nFrames);

  if (fileHandle_ != nullptr) {
    C8Log("[xr-disk-ios] %s", "Closing logToDisk file");
    [fileHandle_ closeFile];
    fileHandle_ = nullptr;
  }

  fileHandle_ = [NSFileHandle fileHandleForWritingAtPath:fileName];
  int fd = [fileHandle_ fileDescriptor];
  if (!fd) {
    C8Log("[xr-disk-ios] error getting file descriptor for", fileName);
    return;
  }
  C8Log("[xr-disk-ios] The fd is %d", fd);
  instance->logToDisk(nFrames, fd);
}

#ifdef __cplusplus
}  // extern "C"
#endif
