// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <mutex>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/map.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/render/lockable.h"
#include "c8/pixels/render/object8.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/api/device/info.capnp.h"

namespace c8 {
void copyNamedPixelBuffers(
  TreeMap<String, RGBA8888PlanePixelBuffer> &lhs,
  const TreeMap<String, RGBA8888PlanePixelBuffer> &rhs);

struct OmniscopeDeviceInfo {
  bool isUnspecifiedModel = true;
  String manufacturer;
  String model;
  String os;
  String osVersion;
};

struct OmniscopeProcessingState {
  GlTexture displayTex;
  TreeMap<String, String> text;
  TreeMap<String, SeriesPlot> seriesPlots;
  TreeMap<String, Table> tables;
  std::shared_ptr<ControlPanelConfig> controlPanelElements;
  std::shared_ptr<Lockable<Scene>> scene;
  TreeMap<String, RGBA8888PlanePixelBuffer> images;
  ConstRootMessage<c8::LoggingSummary> summary;
  bool paused = true;
  String currentViewName;
  int frame = 0;
  TreeMap<String, Vector<String>> views;
  bool done = false;
  OmniscopeDeviceInfo deviceInfo;
  float responsiveToMetricScale = -1.f;
  // When adding new fields here, make sure to update the copy() and clear() methods.

  void copy(const OmniscopeProcessingState &rhs);
  void clear();
};

struct OmniscopeUiEvent {
  enum Kind {
    UNSPECIFIED = 0,
    TOGGLE_PAUSE = 1,
    GO_NEXT = 2,
    GO_PREV = 3,
    STEP = 4,
    SELECT_VIEW = 5,
    TOUCH = 6,
    KEY_PRESSED = 7,
    STOP = 8,
    SHUTDOWN = 9,
    ADD_CURRENT_CAMERA_LOCATION = 10,
    JUMP_TO_CAMERA_LOCATION = 11,
  };

  struct SelectedView {
  public:
    String group;
    int view;
  };

  OmniscopeUiEvent::Kind kind;
  SelectedView view;
  Touch touch;
  double value;  // generic single value, can be reused for several event types.
};

// Channel for passing coherent slices of state back and forth from the rendering thread and the
// processing thread. The goal is to facilitate minimal locking by copying chunks of data in and
// out so that subsequent accesses to a data view can be coherent and lock free.
class OmniscopeThreadChannel {
public:
  void omniscopeState(OmniscopeProcessingState *out);
  void setOmniscopeState(const OmniscopeProcessingState &s);
  void pushEvents(const Vector<OmniscopeUiEvent> &events);

  Vector<OmniscopeUiEvent> pollEvents();

private:
  std::mutex omniscopeStateLock_;
  std::mutex eventQueueLock_;
  Vector<OmniscopeUiEvent> eventQueue_;
  OmniscopeProcessingState omniscopeState_;
};

}  // namespace c8
