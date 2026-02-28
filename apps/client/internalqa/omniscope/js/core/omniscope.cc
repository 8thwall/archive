// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#ifdef JAVASCRIPT

#include <emscripten.h>
#include <emscripten/bind.h>

#include "apps/client/internalqa/omniscope/native/lib/detection-image.h"
#include "apps/client/internalqa/omniscope/native/omniscope-app.h"
#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/capnp-messages.h"
#include "c8/quaternion.h"
#include "c8/stats/scope-timer.h"
#include "c8/symbol-visibility.h"
#include "c8/vector.h"
#include "reality/engine/api/device/info.capnp.h"
#include "reality/engine/features/gl-reality-frame.h"

using namespace c8;

namespace {

// View group to use until user selection is implemented, e.g.
// FEATURES_VIEW_GROUP or IMAGE_TARGET_VIEW_GROUP.
constexpr const char *VIEW_GROUP = FEATURES_VIEW_GROUP;

struct Data {
  OmniscopeApp app;
  FrameInput lastData;
  FrameInput thisData;
  bool hasLastData = false;
  bool hasThisData = false;

  std::unique_ptr<Gr8FeatureShader> glShader;
  OmniDetectionImageMap detectionImages;

  ~Data() { C8Log("[omniscope] %s", "data delete."); }
};

Data &data() {
  static Data d;
  return d;
}

OmniDetectionImage newDetectionImage(
  ImageTargetMetadata::Reader imageTargetMetadataReader, DeviceInfos::DeviceModel m) {
  OmniDetectionImage im;
  if (data().glShader == nullptr) {
    data().glShader.reset(new Gr8FeatureShader());
    data().glShader->initialize();
  }
  im.initialize(
    data().glShader.get(), imageTargetMetadataReader, Intrinsics::getCameraIntrinsics(m));

  // preview texture is a smaller image that helpfully matches the pyramid size for point display.
  // We likely don't want this in production.
  auto l0 = im.gl().pyramid().levels[0];

  C8Log("[omniscope] preview size will be %dx%d", l0.w, l0.h);

  return im;
}

DeviceInfos::DeviceModel deviceModel(
  const char *os, const char *osVersion, const char *manufacturer, const char *model) {
  MutableRootMessage<DeviceInfo> deviceInfoMsg;
  deviceInfoMsg.builder().setOs(os);
  deviceInfoMsg.builder().setOsVersion(osVersion);
  deviceInfoMsg.builder().setManufacturer(manufacturer);
  deviceInfoMsg.builder().setModel(model);
  return DeviceInfos::getDeviceModel(deviceInfoMsg.reader());
}

}  // namespace

extern "C" {

C8_PUBLIC
void c8EmAsm_addNewDetectionImageTexture(
  uint8_t *imageTargetMetadataBytes,
  int numBytes,
  const char *os,
  const char *osVersion,
  const char *manufacturer,
  const char *model) {
  ConstRootMessage<ImageTargetMetadata> imageTargetMetadata(imageTargetMetadataBytes, numBytes);
  String name = imageTargetMetadata.reader().getName();
  data().detectionImages.insert(
    std::make_pair(
      name,
      newDetectionImage(
        imageTargetMetadata.reader(), deviceModel(os, osVersion, manufacturer, model))));
  EM_ASM_(
    {
      window._c8Omni8 = {};
      window._c8Omni8.imageTargetTexture = GL.textures[$0];
    },
    data().detectionImages.at(name).imTexture().id());
}

C8_PUBLIC
void c8EmAsm_processNewDetectionImageTexture(const char *name) {
  ScopeTimer rt("c8EmAsm_processNewDetectionImageTexture");
  auto &im = data().detectionImages.at(name);

  im.processBlocking();

  C8Log(
    "[omniscope] Detection image %s has %d computed points",
    name,
    im.framePoints().points().size());
}

C8_PUBLIC
void c8EmAsm_onOrientationChange(
  int rotation,
  int captureWidth,
  int captureHeight,
  const char *os,
  const char *osVersion,
  const char *manufacturer,
  const char *model) {
  ScopeTimer rt("c8EmAsm_onOrientationChange");
  AppConfiguration appConfig;
  // TODO(paris): Fill out rest of appConfig
  appConfig.rotation = rotation;
  appConfig.captureWidth = captureWidth;
  appConfig.captureHeight = captureHeight;
  appConfig.deviceModel = deviceModel(os, osVersion, manufacturer, model);
  appConfig.imageTargets = &data().detectionImages;

  // data().app.setViewGroup(VIEW_GROUP);
  data().app.current()->configure(appConfig);
  data().app.current()->initialize(data().lastData.viewData);
  data().app.current()->initialize(data().thisData.viewData);
  data().hasLastData = false;
  data().hasThisData = false;

  EM_ASM_(
    {
      window._c8Omni8 = {};
      window._c8Omni8.displayWidth = $0;
      window._c8Omni8.displayHeight = $1;
      window._c8Omni8.name = UTF8ToString($2, $3);
    },
    data().lastData.viewData->displayTex().width(),
    data().lastData.viewData->displayTex().height(),
    data().app.current()->name().c_str(),
    data().app.current()->name().size());
}

C8_PUBLIC
void c8EmAsm_glProcess(
  uint32_t cameraTexture,
  float qw,
  float qx,
  float qy,
  float qz,
  double videoTimeSeconds,
  double frameTimeSeconds,
  double timeNanos,
  double latitude,
  double longitude,
  double horizontalAccuracy) {
  ScopeTimer rt("c8EmAsm_glProcess");
  std::swap(data().lastData, data().thisData);

  data().hasLastData |= data().hasThisData;
  data().hasThisData = true;

  data().app.current()->readGl(data().lastData.viewData.get());
  data().thisData.frameData.cameraTexture = cameraTexture;
  data().thisData.frameData.devicePose = Quaternion{qw, qx, qy, qz};
  data().thisData.frameData.videoTimeNanos = static_cast<int64_t>(videoTimeSeconds * 1e9);
  data().thisData.frameData.frameTimeNanos = static_cast<int64_t>(frameTimeSeconds * 1e9);
  data().thisData.frameData.timeNanos = static_cast<int64_t>(timeNanos);
  data().thisData.frameData.latitude = latitude;
  data().thisData.frameData.longitude = longitude;
  data().thisData.frameData.horizontalAccuracy = horizontalAccuracy;
  data().app.current()->drawGl(data().thisData);
}

C8_PUBLIC
void c8EmAsm_setNewMeshesFromJs(
  const char *nodeId,
  float *points,
  int pointsLength,
  float *colors,
  int colorsLength,
  uint32_t *triangles,
  int trianglesLength) {
  data().app.current()->setNewMeshesFromJs(
    nodeId, points, pointsLength, colors, colorsLength, triangles, trianglesLength);
}

C8_PUBLIC
void c8EmAsm_cpuProcessAndRenderDisplay() {
  if (data().hasLastData) {
    ScopeTimer rt("c8EmAsm_cpuProcessAndRenderDisplay");
    data().app.current()->processCpu(data().lastData.viewData.get());
    data().app.current()->renderDisplay(data().lastData.viewData.get());
  }

  EM_ASM_(
    {
      window._c8Omni8 = {};
      window._c8Omni8.displayTexture = GL.textures[$0];
    },
    data().lastData.viewData->displayTex().id());
}

C8_PUBLIC
void c8EmAsm_gotTouches(int count) {
  ScopeTimer rt("c8EmAsm_gotTouches");
  Vector<Touch> touches(count);
  data().app.current()->gotTouches(touches);
}

C8_PUBLIC
void c8EmAsm_goNext() { data().app.goNext(); }

void c8EmAsm_goViewId(std::string groupName, int viewId) {
  data().app.setViewGroup(groupName);
  data().app.setView(viewId);
}

std::vector<std::string> c8EmAsm_getViewNames() { return data().app.viewNames(); }

std::map<std::string, std::vector<std::string>> c8EmAsm_getViewGroups() {
  std::map<std::string, std::vector<std::string>> viewGroups;
  auto viewGroupNames = data().app.viewGroupNames();
  for (auto viewGroupName : viewGroupNames) {
    data().app.setViewGroup(viewGroupName);
    Vector<String> viewNames = data().app.viewNames();
    viewGroups.insert(std::make_pair(viewGroupName, viewNames));
  }

  // reset the view group
  data().app.setViewGroup(VIEW_GROUP);
  return viewGroups;
}

EMSCRIPTEN_BINDINGS(Omni8_Module) {
  emscripten::function("goViewId", &c8EmAsm_goViewId);
  emscripten::function("getViewNames", &c8EmAsm_getViewNames);
  emscripten::function("getViewGroups", &c8EmAsm_getViewGroups);
  emscripten::register_vector<std::string>("vector<string>");
  emscripten::register_map<std::string, std::vector<std::string>>("map<string, vector<string>>");
}

C8_PUBLIC
void c8EmAsm_setEventQueue(uint8_t *ptr, int size) {
  data().thisData.frameData.eventQueue = ConstRootMessage<RequestPose>(ptr, size);
}

}  // EXTERN "C"
#endif
