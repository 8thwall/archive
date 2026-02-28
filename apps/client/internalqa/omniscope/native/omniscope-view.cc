// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include <filesystem>

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "omniscope-view.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:control-panel-element",
    "//apps/client/internalqa/omniscope/native/lib:color-palette",
    "//apps/client/internalqa/omniscope/native/lib:detection-image",
    "//apps/client/internalqa/omniscope/native/lib/view-widgets:scene-widgets",
    "//c8:c8-log",
    "//c8:quaternion",
    "//c8:string",
    "//c8:color",
    "//c8/camera:device-infos",
    "//c8/pixels:pixel-buffers",
    "//c8/pixels/render:object8",
    "//c8/pixels/render:lockable",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//c8/pixels/opengl:gl-texture",
    "//reality/engine/api/device:info.capnp-cc",
    "//reality/engine/tracking:tracking-sensor-event",
    "//reality/engine/imagedetection:detection-image-tracker",
  };
  visibility = {
    "//apps/client/internalqa/omniscope:__subpackages__",
  };
}
cc_end(0x32c88cf6);

#include <stdarg.h>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/c8-log.h"

namespace c8 {

namespace {

constexpr int MAX_NOTIFICATION_QUEUE_SIZE = 100;

}  // namespace

// Processing. By default omniscope views delegate to their data providers for these functions,
// but they can override this behavior if needed.
void OmniscopeView::drawGl(FrameInput &in) { in.viewData->drawGl(in.frameData); }

void OmniscopeView::readGl(OmniscopeViewData *viewData) { viewData->readGl(); }

void OmniscopeView::renderDisplay(OmniscopeViewData *viewData) { viewData->renderDisplay(); }

OmniscopeViewData *OmniscopeViewData::setRenderer(std::unique_ptr<GlTextureRenderer> &&renderer) {
  renderer_ = std::move(renderer);
  return this;
}

OmniscopeViewData *OmniscopeViewData::setCpuProcessingResult(
  std::unique_ptr<CpuProcessingResult> &&cpuProcessingResult) {
  cpuProcessingResult_ = std::move(cpuProcessingResult);
  return this;
}

void OmniscopeViewData::drawGl(FrameData &in) {
  frameDataCopy_.videoTimeNanos = in.videoTimeNanos;
  frameDataCopy_.frameTimeNanos = in.frameTimeNanos;
  frameDataCopy_.timeNanos = in.timeNanos;
  frameDataCopy_.devicePose = in.devicePose;
  frameDataCopy_.eventQueue = ConstRootMessage<RequestPose>(in.eventQueue.reader());
  frameDataCopy_.cameraTexture = in.cameraTexture;
  frameDataCopy_.latitude = in.latitude;
  frameDataCopy_.longitude = in.longitude;
  frameDataCopy_.horizontalAccuracy = in.horizontalAccuracy;
  frameDataCopy_.rawDataRecorderFrame.request =
    ConstRootMessage<RealityRequest>(in.rawDataRecorderFrame.request.reader());
  frameDataCopy_.rawDataRecorderFrame.response =
    ConstRootMessage<RealityResponse>(in.rawDataRecorderFrame.response.reader());

  {
    ScopeTimer t("draw-gl");
    for (auto &p : producers_) {
      p.second->drawGl(in);
    }
  }
}

void OmniscopeViewData::readGl() {
  ScopeTimer t("read-gl");
  for (auto &p : producers_) {
    p.second->readGl();
  }
}

void OmniscopeViewData::renderDisplay() { renderer_->renderDisplay(); }

void OmniscopeView::pushNotification(
  NotificationType type, int dismissTimeMs, const char *message, ...) {
  if (notifications_.size() >= MAX_NOTIFICATION_QUEUE_SIZE) {
    notifications_.pop_front();
  }
  va_list args;
  va_start(args, message);
  static char notificationBuffer[4096];
  vsnprintf(notificationBuffer, sizeof(notificationBuffer), message, args);
  va_end(args);
  notifications_.emplace_back(OmniscopeNotification{type, dismissTimeMs, notificationBuffer});
}

bool OmniscopeView::hasNotification() { return !notifications_.empty(); }

OmniscopeNotification OmniscopeView::popNotification() {
  auto notif = notifications_.front();
  notifications_.pop_front();
  return notif;
}

RGBA8888PlanePixels OmniscopeViewData::mutableImage(const String &tag, int rows, int cols) {
  // If the existing image at this tag has the same size as we're requesting, return it.
  auto &imgBuffer = images_[tag];
  if (imgBuffer.pixels().rows() == rows && imgBuffer.pixels().cols() == cols) {
    return imgBuffer.pixels();
  }
  // Otherwise, allocate a new image buffer with the requested size, and return that.
  images_[tag] = RGBA8888PlanePixelBuffer(rows, cols);
  return images_[tag].pixels();
}

SeriesPlot &seriesPlot(
  OmniscopeViewData *data,
  const String &window,
  const String &title,
  const Axis &xAxis,
  const Axis &yAxis) {
  auto &p = data->mutableSeriesPlot(window);
  p.title = title;
  p.xAxis = xAxis;
  p.yAxis = yAxis;
  return p;
}

void addLine(
  SeriesPlot &p,
  const String &name,
  const Vector<float> &xs,
  const Vector<float> &ys,
  bool startHidden) {
  auto &d = p.dataPerLine[name];
  d.xs = xs;
  d.ys = ys;
  d.startHidden = startHidden;
}

void addLine(
  SeriesPlot &p,
  const String &name,
  const Vector<float> &xs,
  const Vector<float> &ys,
  Color color,
  SeriesPlotType type,
  SeriesPlotMarker marker,
  bool startHidden) {
  auto &d = p.dataPerLine[name];
  d.xs = xs;
  d.ys = ys;
  d.color = color;
  d.type = type;
  d.marker = marker;
  d.startHidden = startHidden;
}

void addVLines(SeriesPlot &p, const String &name, const Vector<float> &vals) {
  p.vLines[name].data = vals;
}

void addHLines(SeriesPlot &p, const String &name, const Vector<float> &vals) {
  p.hLines[name].data = vals;
}

void addAnnotation(
  SeriesPlot &p,
  const String &name,
  float x,
  float y,
  float shiftX,
  float shiftY,
  const String &text) {
  auto &annotation = p.annotations[name];
  annotation.text = text;
  annotation.x = x;
  annotation.y = y;
  annotation.shiftX = shiftX;
  annotation.shiftY = shiftY;
}

}  // namespace c8
