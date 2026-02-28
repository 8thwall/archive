// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"omniscope-processing-thread.h"};
  deps = {
    ":load-image-targets",
    ":omniscope-thread-channel",
    ":ui-config",
    "//apps/client/internalqa/omniscope/native:omniscope-app",
    "//apps/client/internalqa/omniscope/imgui/imgui-notify:layout-notification",
    "//c8:color",
    "//c8:quaternion",
    "//c8:string",
    "//c8:vector",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/io:file-io",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-buffers",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels/opengl:gl-headers",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels/pipeline:gl-texture-pipeline",
    "//c8/protolog:xr-requests",
    "//c8/string:split",
    "//reality/engine/api/device:info.capnp-cc",
    "//reality/quality/benchmark:sensor-adjustment",
    "//reality/engine/features:gr8-feature-shader",
    "//reality/quality/synthetic:synthetic-scenes",
    "//reality/quality/visualization/xrom/framework:disk-reality-stream",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
    "//reality/quality/visualization/xrom/framework:remote-reality-stream",
  };
}
cc_end(0xc523fdcf);

#include <chrono>
#include <thread>

#include "apps/client/internalqa/omniscope/imgui/imgui-notify/layout-notification.h"
#include "apps/client/internalqa/omniscope/imgui/load-image-targets.h"
#include "apps/client/internalqa/omniscope/imgui/omniscope-processing-thread.h"
#include "apps/client/internalqa/omniscope/native/omniscope-app.h"
#include "c8/c8-log-proto.h"
#include "c8/camera/device-infos.h"
#include "c8/color.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/file-io.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/egl.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pipeline/gl-texture-pipeline.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-buffers.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-requests.h"
#include "c8/quaternion.h"
#include "c8/string/split.h"
#include "c8/vector.h"
#include "reality/engine/api/device/info.capnp.h"
#include "reality/engine/features/gr8-feature-shader.h"
#include "reality/quality/benchmark/sensor-adjustment.h"
#include "reality/quality/synthetic/synthetic-scenes.h"
#include "reality/quality/visualization/xrom/framework/disk-reality-stream.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"
#include "reality/quality/visualization/xrom/framework/remote-reality-stream.h"

using namespace std::chrono_literals;

namespace c8 {

namespace {
float scaleFromJson(const String &fullSequenceName) {
  auto json = readJsonFile("reality/quality/benchmark/sequences.json");
  auto sequenceName = split(fullSequenceName, "/").back();
  if (!json.contains(sequenceName) || !json[sequenceName].contains("scale")) {
    return -1.f;
  }
  return json[sequenceName]["scale"].get<float>();
}
}  // namespace

// Keep in sync with camera-controls.cc and omniscope-layout-thread.cc.
const TreeMap<int, String> handledKeys = {
  {97, "a"},
  {119, "w"},
  {100, "d"},
  {115, "s"},
  {113, "q"},
  {101, "e"},
  {108, "l"},
  {106, "j"},
  {105, "i"},
  {107, "k"},
  {111, "o"},
  {117, "u"},
  {9, "tab"},
};

class OmniscopeCallback : public RealityStreamCallback {
public:
  OmniscopeCallback(UiConfig *uiConfig, OmniscopeThreadChannel *channel)
      : uiConfig_(uiConfig), channel_(channel) {
    for (const auto &group : app_.viewGroupNames()) {
      app_.setViewGroup(group);
      omniscopeState_.views[group] = app_.viewNames();
    }
    app_.setViewGroup(app_.viewGroupNames()[0]);
  }

  void initializeView(
    int rotation,
    int captureWidth,
    int captureHeight,
    DeviceInfo::Reader deviceInfo,
    float responsiveToMetricScale) {
    ScopeTimer::reset();
    ScopeTimer rt("init");
    AppConfiguration appConfig;
    appConfig.rotation = rotation;
    appConfig.captureWidth = captureWidth;
    appConfig.captureHeight = captureHeight;
    appConfig.deviceInfo = deviceInfo;
    appConfig.realitySrcName = uiConfig_->get().realitySrc;
    appConfig.prebuiltMapSrc = uiConfig_->get().prebuiltMapSrc;
    appConfig.builtMapOut = uiConfig_->get().builtMapOut;
    appConfig.deviceModel = DeviceInfos::getDeviceModel(deviceInfo);
    appConfig.deviceManufacturer = deviceInfo.getManufacturer();
    appConfig.responsiveToMetricScale = responsiveToMetricScale;
    appConfig.imageTargets = &detectionImages_;

    app_.current()->configure(appConfig);
    app_.current()->initialize(lastData_.viewData);
    app_.current()->initialize(thisData_.viewData);
    app_.current()->setSyntheticSceneName(uiConfig_->get().syntheticSceneName);
    hasLastData_ = false;
    hasThisData_ = false;

    pipeline_.initialize(captureWidth, captureHeight, 1, 9);

    needsViewInit_ = false;
  }

  void glProcess(
    uint32_t cameraTexture,
    float qw,
    float qx,
    float qy,
    float qz,
    double videoTimeNanos,
    double frameTimeNanos,
    double timeNanos,
    double latitude,
    double longitude,
    double horizontalAccuracy,
    RequestPose::Reader requestPoseReader,
    RealityRequest::Reader rawRequest,
    RealityResponse::Reader rawResponse) {
    ScopeTimer rt("gl-process");
    std::swap(lastData_, thisData_);

    hasLastData_ |= hasThisData_;
    hasThisData_ = true;

    app_.current()->readGl(lastData_.viewData.get());
    thisData_.frameData.cameraTexture = cameraTexture;
    thisData_.frameData.devicePose = Quaternion{qw, qx, qy, qz};
    thisData_.frameData.videoTimeNanos = static_cast<int64_t>(videoTimeNanos);
    thisData_.frameData.frameTimeNanos = static_cast<int64_t>(frameTimeNanos);
    thisData_.frameData.timeNanos = static_cast<int64_t>(timeNanos);
    thisData_.frameData.latitude = latitude;
    thisData_.frameData.longitude = longitude;
    thisData_.frameData.horizontalAccuracy = horizontalAccuracy;
    thisData_.frameData.eventQueue = requestPoseReader;
    thisData_.frameData.rawDataRecorderFrame.request = {rawRequest};
    thisData_.frameData.rawDataRecorderFrame.response = {rawResponse};
    app_.current()->drawGl(thisData_);
  }

  void cpuProcessAndRenderDisplay(RealityStreamInterface *stream) {
    if (hasLastData_) {
      ScopeTimer rt("cpu-process-and-render-display");
      app_.current()->processCpu(lastData_.viewData.get());

      if (goto_ > omniscopeState_.frame) {
        omniscopeState_.frame++;
        return;
      }

      while (true) {
        while (app_.current()->hasNotification()) {
          layoutNotification(app_.current()->popNotification());
        }
        {
          auto lock = app_.current()->lockableScene()->lock();
          app_.current()->renderDisplay(lastData_.viewData.get());
        }
        glFlush();
        omniscopeState_.displayTex = lastData_.viewData->displayTex();
        omniscopeState_.text = lastData_.viewData->text();
        omniscopeState_.seriesPlots = lastData_.viewData->seriesPlots();
        omniscopeState_.tables = lastData_.viewData->tables();
        omniscopeState_.controlPanelElements = app_.current()->controlPanelConfigPtr();
        omniscopeState_.scene = app_.current()->lockableScene();
        copyNamedPixelBuffers(omniscopeState_.images, lastData_.viewData->images());
        {
          c8::MutableRootMessage<c8::LoggingSummary> summaryMessage;
          LoggingSummary::Builder summary = summaryMessage.builder();
          ScopeTimer::exportSummary(&summary);
          omniscopeState_.summary = {summaryMessage};
        }

        auto events = channel_->pollEvents();
        bool breakWhile = terminated_;
        Vector<Touch> touches;
        for (const auto &e : events) {
          switch (e.kind) {
            case OmniscopeUiEvent::TOGGLE_PAUSE:
              omniscopeState_.paused = !omniscopeState_.paused;
              break;
            case OmniscopeUiEvent::GO_NEXT:
              ++omniscopeState_.frame;
              goNext();
              breakWhile = true;
              break;
            case OmniscopeUiEvent::GO_PREV:
              ++omniscopeState_.frame;
              goPrev();
              breakWhile = true;
              break;
            case OmniscopeUiEvent::STEP:
              breakWhile = true;
              break;
            case OmniscopeUiEvent::SELECT_VIEW:
              ++omniscopeState_.frame;
              selectView(e.view.group, e.view.view);
              breakWhile = true;
              break;
            case OmniscopeUiEvent::TOUCH:
              touches.push_back(e.touch);
              break;
            case OmniscopeUiEvent::KEY_PRESSED: {
              auto val = static_cast<int>(e.value);
              if (!app_.current()->handleKey(val) && handledKeys.find(val) == handledKeys.end()) {
                C8Log("[omniscope-processing-thread] unhandled keypress: %d ('%c')", val, val);
              }
              break;
            }
            case OmniscopeUiEvent::STOP:
              if (stream != nullptr) {
                stream->stop();
              }
              breakWhile = true;
              break;
            case OmniscopeUiEvent::SHUTDOWN:
              terminated_ = true;
              if (stream != nullptr) {
                stream->stop();
              }
              breakWhile = true;
              break;
            case OmniscopeUiEvent::ADD_CURRENT_CAMERA_LOCATION:
              addCurrentCameraPosition();
              break;
            case OmniscopeUiEvent::JUMP_TO_CAMERA_LOCATION:
              setCurrentCameraPosition(e.view.view);
              break;
            default:
              // nothing to do.
              break;
          }
        }

        gotTouches(touches);

        breakWhile |= !omniscopeState_.paused;

        if (breakWhile) {
          break;
        }

        std::this_thread::sleep_for(20ms);

        channel_->setOmniscopeState(omniscopeState_);
      }
      ++omniscopeState_.frame;
    }
  }

  void addCurrentCameraPosition() {
    if (omniscopeState_.scene == nullptr) {
      C8Log(
        "[omniscope-processing-thread] Cannot save new camera position while scene is switching");
      return;
    }
    auto newConfig = uiConfig_->get();
    auto lock = omniscopeState_.scene->lock();
    auto &worldScene = omniscopeState_.scene->ref().find<Scene>("world-view");
    auto &camera = worldScene.find<Camera>();
    newConfig.realitySrcToCameraPositions[newConfig.realitySrc].push_back(camera.local());
    uiConfig_->set(newConfig);
  }

  void setCurrentCameraPosition(int idx) {
    auto configData = uiConfig_->get();
    auto lock = omniscopeState_.scene->lock();
    auto &worldScene = omniscopeState_.scene->ref().find<Scene>("world-view");
    auto &camera = worldScene.find<Camera>();
    auto &local = configData.realitySrcToCameraPositions[configData.realitySrc][idx];
    camera.setLocal(local);
    omniscopeState_.scene->ref().setNeedsRerender(true);
  }

  void goPrev() {
    app_.goPrev();
    auto newConfig = uiConfig_->get();
    newConfig.viewIdx = app_.currentView();
    uiConfig_->set(newConfig);
    needsViewInit_ = true;
  }

  void goNext() {
    app_.goNext();
    auto newConfig = uiConfig_->get();
    newConfig.viewIdx = app_.currentView();
    uiConfig_->set(newConfig);
    needsViewInit_ = true;
  }

  // Currently, this function is called only during initialization.  It sets up a synthetic scene
  // that replaces the camera feed but still uses the original recording's other sensors.
  void setSyntheticScene(const String &sceneName) {
    // Reset the synthetic scene.
    syntheticScene_.reset();
    if (sceneName != "None" && sceneName != "") {
      // The user has specified a synthetic scene.  Set the synthetic scene and update the view.
      syntheticScene_ =
        syntheticScene(sceneName, captureIntrinsics_, captureWidth_, captureHeight_);
    }

    // Set the synthetic scene name value on the OmniscopeView.
    app_.current()->setSyntheticSceneName(sceneName);
    needsViewInit_ = true;
  }

  void selectView(const String &group, int view) {
    app_.setViewGroup(group);
    app_.setView(view);
    int vgNum = 0;
    for (int i = 0; i < app_.viewGroupNames().size(); ++i) {
      if (group == app_.viewGroupNames()[i]) {
        vgNum = i;
        break;
      }
    }
    auto newConfig = uiConfig_->get();
    newConfig.viewIdx = view;
    newConfig.viewGroupIdx = vgNum;
    uiConfig_->set(newConfig);
    needsViewInit_ = true;
  }

  void resumeIfPaused() { omniscopeState_.paused = false; }

  void gotTouches(const Vector<Touch> &touches) {
    if (touches.empty()) {
      return;
    }

    ScopeTimer rt("got-touches");
    app_.current()->gotTouches(touches);
  }

  RGBA8888PlanePixelBuffer updateSyntheticScene() {
    // set virtual camera to ARCore estimated camera extrinsic
    syntheticScene_->find<Camera>().setLocal(currentExtrinsic_);

    syntheticRenderer_.render(*syntheticScene_);
    return syntheticRenderer_.result();
  }

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader originalRequest,
    RealityResponse::Reader response) override {
    MutableRootMessage<RealityRequest> requestMessage(originalRequest);
    if (frameSkip_ > 1) {
      // If we are skipping frames, save sensor events to a queue until we are ready to consume all
      // events on the next processed frame.
      savedEventQueues_.push_back(originalRequest.getSensors().getPose());
      if (rawStreamFrameNum_++ % frameSkip_ != 0) {
        // Skip this frame.
        return;
      } else {
        // Process this frame.
        setEventsOnFrame(savedEventQueues_, requestMessage.builder());
        savedEventQueues_.clear();
      }
    }

    ScopeTimer t("process-reality");

    auto request = requestMessage.reader();

    auto frame = request.getSensors().getCamera().getCurrentFrame();
    auto ypix = constFrameYPixels(frame);
    auto uvpix = constFrameUVPixels(frame);

    auto rawExtrinsic = response.getXRResponse().getCamera().getExtrinsic();
    currentExtrinsic_ =
      cameraMotion(toHVector(rawExtrinsic.getPosition()), toQuaternion(rawExtrinsic.getRotation()));

    if (!didInit_) {
      didInit_ = true;
      glShader_.reset(new Gr8FeatureShader());
      glShader_->initialize();
      rgbpixbuf_ = RGBA8888PlanePixelBuffer(ypix.rows(), ypix.cols());
      fill(Color::BLACK, rgbpixbuf_.pixels());
      loadImageTargets(DeviceInfos::getDeviceModel(request.getDeviceInfo()));

      // store camera intrinsics and capture dimensions for synthetic views
      captureWidth_ = ypix.cols();
      captureHeight_ = ypix.rows();
      captureIntrinsics_ =
        Intrinsics::getCameraIntrinsics(DeviceInfos::getDeviceModel(request.getDeviceInfo()));

      // Set the previous and current frame to the same extrinsic.  That way we aren't concerned
      // about teleports in the data on the first frame due to it being more than a meter away
      // from the origin.
      previousExtrinsic_ = currentExtrinsic_;

      setSyntheticScene(uiConfig_->get().syntheticSceneName);
    }

    if (needsViewInit_) {
      auto responsiveToMetricScale = scaleFromJson(uiConfig_->get().realitySrc);
      initializeView(
        0 /* rotation */,
        ypix.cols(),
        ypix.rows(),
        request.getDeviceInfo(),
        responsiveToMetricScale);
      omniscopeState_.clear();
      omniscopeState_.currentViewName = app_.current()->name();
      omniscopeState_.deviceInfo = {
        DeviceInfos::getDeviceModel(request.getDeviceInfo())
          == DeviceInfos::DeviceModel::NOT_SPECIFIED,
        request.getDeviceInfo().getManufacturer(),
        request.getDeviceInfo().getModel(),
        request.getDeviceInfo().getOs(),
        request.getDeviceInfo().getOsVersion(),
      };
      omniscopeState_.responsiveToMetricScale = responsiveToMetricScale;
    }

    auto tex =
      wrapRGBA8888Texture(pipeline_.getReady(ypix.cols(), ypix.rows()), ypix.cols(), ypix.rows());

    auto dp = request.getSensors().getPose().getDevicePose();
    auto eq = request.getSensors().getPose();
    auto videoTimeNanos =
      request.getSensors().getCamera().getCurrentFrame().getVideoTimestampNanos();
    auto frameTimeNanos =
      request.getSensors().getCamera().getCurrentFrame().getFrameTimestampNanos();
    auto timeNanos = request.getSensors().getCamera().getCurrentFrame().getTimestampNanos();
    // GPS for VPS information
    auto latitude = request.getSensors().getGps().getLatitude();
    auto longitude = request.getSensors().getGps().getLongitude();
    auto horizontalAccuracy = request.getSensors().getGps().getHorizontalAccuracy();
    // if the user specified a synthetic scene, replace the camera texture with the synthetic
    // scene's render.
    if (syntheticScene_ != nullptr) {
      rgbpixbuf_ = updateSyntheticScene();
      tex.bind();
      // TODO (nathan): Rather than call setPixels, it would preferable to draw the synthetic scene
      // directly onto tex. For that, tex would need a framebuffer which would need to be bound.
      // That way, the rendered output wouldn't need to leave the GPU.
      tex.setPixels(rgbpixbuf_.pixels().pixels());
      tex.unbind();
    } else {
      // use the camera feed
      auto p = rgbpixbuf_.pixels();
      yuvToRgb(ypix, uvpix, &p);

      tex.bind();
      tex.setPixels(p.pixels());
      tex.unbind();
    }
    glProcess(
      tex.id(),
      dp.getW(),
      dp.getX(),
      dp.getY(),
      dp.getZ(),
      videoTimeNanos,
      frameTimeNanos,
      timeNanos,
      latitude,
      longitude,
      horizontalAccuracy,
      eq,
      request,
      response);
    cpuProcessAndRenderDisplay(stream);
    channel_->setOmniscopeState(omniscopeState_);

    // set current frame to be the previous frame for the upcoming frame
    previousExtrinsic_ = currentExtrinsic_;
  }

  void processFinalFrame() {
    ScopeTimer rt("process-final-frame");
    std::swap(lastData_, thisData_);
    hasLastData_ |= hasThisData_;
    hasThisData_ = true;
    app_.current()->readGl(lastData_.viewData.get());
    omniscopeState_.paused = true;
    cpuProcessAndRenderDisplay(nullptr);
    omniscopeState_.text = lastData_.viewData->text();
    omniscopeState_.seriesPlots = lastData_.viewData->seriesPlots();
    omniscopeState_.tables = lastData_.viewData->tables();
    omniscopeState_.done = true;
    channel_->setOmniscopeState(omniscopeState_);
    app_.current()->onEndOfSequence();
  }

  void setGoto(int _goto) { goto_ = _goto; }
  void setFrameSkip(int frameSkip) { frameSkip_ = std::max(frameSkip, 1); }
  void setView(int v) { app_.setView(v); }
  void setViewGroup(int v) { app_.setViewGroup(app_.viewGroupNames()[v]); }
  bool terminated() const { return terminated_; }

private:
  bool didInit_ = false;
  bool needsViewInit_ = true;
  GlTexturePipeline pipeline_;
  int goto_ = 0;
  int rawStreamFrameNum_ = 0;
  int frameSkip_ = 1;
  // If we are skipping frames, queue up sensor events and set them on the next processed frame.
  Vector<ConstRootMessage<RequestPose>> savedEventQueues_;
  bool terminated_ = false;

  OmniscopeApp app_;
  FrameInput lastData_;
  FrameInput thisData_;
  bool hasLastData_ = false;
  bool hasThisData_ = false;

  // Used for synthetic scene
  Renderer syntheticRenderer_;
  std::unique_ptr<Scene> syntheticScene_;
  c8_PixelPinholeCameraModel captureIntrinsics_;
  HMatrix previousExtrinsic_ = HMatrixGen::i();
  HMatrix currentExtrinsic_ = HMatrixGen::i();
  int captureWidth_;
  int captureHeight_;

  std::unique_ptr<Gr8FeatureShader> glShader_;
  OmniDetectionImageMap detectionImages_;
  RGBA8888PlanePixelBuffer rgbpixbuf_;

  OmniscopeProcessingState omniscopeState_;

  // These handles to interthread communication data are owned by OmniscopeProcessingThreadData,
  // which also owns this class.
  UiConfig *uiConfig_;
  OmniscopeThreadChannel *channel_;

  // TODO(nb): selector for image in app.
  void loadImageTargets(DeviceInfos::DeviceModel model) {
    C8Log("[omniscope-processing-thread] %s", "Loading detection images.");
    for (const auto &file : targetFiles()) {
      auto dim = loadImageTargetFile(file, glShader_.get(), model);
      detectionImages_.insert(std::make_pair(dim.detectionImage().getName(), std::move(dim)));
    }
  }
};

struct OmniscopeProcessingThreadData {
public:
  std::unique_ptr<OffscreenGlContext> ctx;
  std::unique_ptr<RealityStreamInterface> rStream;
  std::unique_ptr<OmniscopeCallback> omniscope;
  std::shared_ptr<UiConfig> uiConfig_;
  std::shared_ptr<OmniscopeThreadChannel> channel_;

  void run(
    void *sharedContext,
    std::shared_ptr<UiConfig> uiConfig,
    std::shared_ptr<OmniscopeThreadChannel> channel) {
    uiConfig_ = uiConfig;
    channel_ = channel;
    auto flags = uiConfig_->get();
    C8Log(
      "[omniscope-processing-thread] Running with sharedContext %p and flags: gotoFrame: %d, "
      "frameSkip: %d, viewIdx: %d, "
      "viewGroupIdx: %d, realitySrc: %s",
      sharedContext,
      flags.gotoFrame,
      flags.frameSkip,
      flags.viewIdx,
      flags.viewGroupIdx,
      flags.realitySrc.c_str());
    ctx.reset(new OffscreenGlContext(
      OffscreenGlContext::createRGBA8888Context(reinterpret_cast<void *>(sharedContext))));

    // Create the reality stream. It will create its own context, so we need to reset ours after
    // we call this.
    auto myContext = CGLGetCurrentContext();
    rStream = RealityStreamFactory::create(flags.realitySrc);
    CGLSetCurrentContext(myContext);

    omniscope.reset(new OmniscopeCallback(uiConfig_.get(), channel_.get()));
    omniscope->setViewGroup(flags.viewGroupIdx);
    omniscope->setView(flags.viewIdx);
    omniscope->setGoto(flags.gotoFrame);
    omniscope->setFrameSkip(flags.frameSkip);

    rStream->setCallback(omniscope.get());

    if (auto diskStream = dynamic_cast<DiskRealityStream *>(rStream.get())) {
      diskStream->setUseExistingResponse(flags.existingResponse);
    }

    // For remote streams, start non-paused.
    if (dynamic_cast<RemoteRealityStream *>(rStream.get()) != nullptr) {
      omniscope->resumeIfPaused();
    }
    rStream->spin();
    omniscope->processFinalFrame();
    C8Log("[omniscope-processing-thread] %s", "Done.");
    C8Log("[omniscope-processing-thread] %s", "");
    C8Log("[omniscope-processing-thread] %s", "");
    C8Log("[omniscope-processing-thread] %s", "===================================");
    C8Log("[omniscope-processing-thread] %s", "");
    C8Log("[omniscope-processing-thread] %s", "");
    C8Log("[omniscope-processing-thread] %s", "");
    ScopeTimer::logDetailedSummary();

    while (true) {
      auto events = channel_->pollEvents();
      bool needsShutdown = false;
      for (const auto &e : events) {
        switch (e.kind) {
          case OmniscopeUiEvent::SHUTDOWN:
            needsShutdown = true;
            break;
          default:
            // nothing to do.
            break;
        }
      }
      if (needsShutdown || omniscope->terminated()) {
        channel_->setOmniscopeState({});
        ctx.reset(nullptr);
        omniscope.reset(nullptr);
        rStream.reset(nullptr);
        return;
      }
      std::this_thread::sleep_for(20ms);
    }
  }
};

std::unique_ptr<OmniscopeProcessingThreadData> omniscopeProcessingThreadData;

void processOmniscopeStreamImpl(
  void *sharedContext,
  std::shared_ptr<UiConfig> uiConfig,
  std::shared_ptr<OmniscopeThreadChannel> channel) {
  omniscopeProcessingThreadData.reset(new OmniscopeProcessingThreadData());
  omniscopeProcessingThreadData->run(sharedContext, uiConfig, channel);
}

std::unique_ptr<std::thread> processOmniscopeStream(
  void *sharedContext,
  std::shared_ptr<UiConfig> uiConfig,
  std::shared_ptr<OmniscopeThreadChannel> channel) {

  return std::unique_ptr<std::thread>{
    new std::thread(processOmniscopeStreamImpl, CGLGetCurrentContext(), uiConfig, channel)};
}

}  // namespace c8
