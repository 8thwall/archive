// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"omniscope-thread-channel.h"};
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//reality/engine/api/device:info.capnp-cc",
    "//c8/pixels/render:lockable",
    "//c8/pixels/render:object8",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-buffers",
    "//c8/pixels:pixel-transforms",
    "//c8:map",
    "//c8:set",
    "//c8:string",
    "//c8:vector",
  };
}
cc_end(0x3aedb964);

#include "apps/client/internalqa/omniscope/imgui/omniscope-thread-channel.h"
#include "c8/pixels/pixel-buffers.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/set.h"

namespace c8 {

void copyNamedPixelBuffers(
  TreeMap<String, RGBA8888PlanePixelBuffer> &lhs,
  const TreeMap<String, RGBA8888PlanePixelBuffer> &rhs) {
  // Copy image data manually. We need this step because PixelBuffer subclasses are uncopyable.
  TreeSet<String> foundImages;
  Vector<String> removeImages;
  // Iterate over existing images in the destination.
  for (auto &e : lhs) {
    auto key = e.first;
    auto &val = e.second;
    const auto &re = rhs.find(key);
    if (re == rhs.end()) {
      // An image in the destination was not in the source, mark for removal.
      removeImages.push_back(key);
      continue;
    }
    // Update an existing image in the dstination.
    const auto &rval = re->second;
    copyPixelBuffer(val, rval.pixels());
    foundImages.insert(key);
  }
  // Remove images from the destination if they were not in the source.
  for (const auto &key : removeImages) {
    lhs.erase(key);
  }
  // Insert new images from the destination.
  for (const auto &re : rhs) {
    const auto &key = re.first;
    if (foundImages.find(key) == foundImages.end()) {
      const auto &val = re.second;
      copyPixelBuffer(lhs[key], val.pixels());
    }
  }
}

void OmniscopeProcessingState::copy(const OmniscopeProcessingState &rhs) {
  displayTex = rhs.displayTex;
  text = rhs.text;
  seriesPlots = rhs.seriesPlots;
  tables = rhs.tables;
  controlPanelElements = rhs.controlPanelElements;
  scene = rhs.scene;
  copyNamedPixelBuffers(images, rhs.images);
  summary = rhs.summary.clone();
  paused = rhs.paused;
  currentViewName = rhs.currentViewName;
  frame = rhs.frame;
  views = rhs.views;
  done = rhs.done;
  deviceInfo = rhs.deviceInfo;
  responsiveToMetricScale = rhs.responsiveToMetricScale;
}

void OmniscopeProcessingState::clear() {
  displayTex = wrapRGBA8888Texture(0, 0, 0);
  text.clear();
  seriesPlots.clear();
  tables.clear();
  controlPanelElements = nullptr;
  scene = nullptr;
  images.clear();
  summary = {};
  paused = true;
  currentViewName = "";
  done = false;
  deviceInfo = {};
  responsiveToMetricScale = -1.f;
}

void OmniscopeThreadChannel::omniscopeState(OmniscopeProcessingState *out) {
  std::lock_guard<std::mutex> lock(omniscopeStateLock_);
  out->copy(omniscopeState_);
}

void OmniscopeThreadChannel::setOmniscopeState(const OmniscopeProcessingState &s) {
  std::lock_guard<std::mutex> lock(omniscopeStateLock_);
  omniscopeState_.copy(s);
}

void OmniscopeThreadChannel::pushEvents(const Vector<OmniscopeUiEvent> &events) {
  std::lock_guard<std::mutex> lock(eventQueueLock_);
  for (const auto &event : events) {
    eventQueue_.push_back(event);
  }
}

Vector<OmniscopeUiEvent> OmniscopeThreadChannel::pollEvents() {
  std::lock_guard<std::mutex> lock(eventQueueLock_);
  auto queuedEvents = eventQueue_;
  eventQueue_.clear();
  return queuedEvents;
}

}  // namespace c8
