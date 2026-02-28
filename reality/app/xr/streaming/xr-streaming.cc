// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/app/xr/streaming/xr-streaming.h"
#include "reality/app/xr/streaming/xr-streaming-decl.h"

#include "c8/c8-log.h"
#include "c8/io/kj-event-loop.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/release-config.h"
#include "c8/protolog/api-limits.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/scope-timer.h"
#include "c8/stats/self-timing-scope-lock.h"

// Required for our UnityPluginLoad
#ifdef _WIN32
#include "bzl/unity/PluginAPI/IUnityInterface.h"
#endif

namespace c8 {
using MutableXRConfiguration = MutableRootMessage<XRConfiguration>;
using ConstXRConfiguration = ConstRootMessage<XRConfiguration>;

XRStreaming *XRStreaming::createInstance() {
  if (xRStreaming_ != nullptr) {
    destroyInstance();
  }

  xRStreaming_ = new XRStreaming();
  return xRStreaming_;
}

// Returns a reference to a previously created instance of XRStreaming. Results in an error if
// called before an instance is created.
XRStreaming *XRStreaming::getInstance() { return xRStreaming_; }

// Destroys the instance of XRStreaming, if it exists.
void XRStreaming::destroyInstance() {
  C8Log("[xr-streaming] %s", "Destroying instance");
  if (xRStreaming_ != nullptr) {
    delete xRStreaming_;
    xRStreaming_ = nullptr;
  } else {
    C8Log("[xr-streaming] %s", "Already destroyed. Nothing to do");
  }
}

#ifdef _WIN32
// Grab the d3d11 Device for later pipeline execution
void XRStreaming::setD3D11Device(ID3D11Device *device) { d3dDevice_ = device; }
#else
TextureCopier *XRStreaming::buildOsxTextureCopier() {
  // Default to OpenGL since we expect more users to use OpenGL then Metal
  if (renderingSystem_ != RENDERING_SYSTEM_OPENGL) {
    C8Log("[xr-streaming] Building OSX texture using %s", "Metal");
    return new OsxNativeMetalTexture();
  } else {
    C8Log("[xr-streaming] Building OSX texture using %s", "OpenGL");
    return new OsxNativeOpenglTexture();
  }
}
#endif

void XRStreaming::setRenderingSystem(int renderingSystem) {
  C8Log("[xr-streaming] Rendering System = %d", renderingSystem);
  renderingSystem_ = renderingSystem;
}

bool XRStreaming::isRenderingOpenGL() { return renderingSystem_ == RENDERING_SYSTEM_OPENGL; }

// Constructor.
XRStreaming::XRStreaming()
    :
#ifdef _WIN32
      // NOTE(dat): We are assuming that this object is created AFTER UnityPluginLoad happens
      //            which has assigned the d3dDevice_ for Windows.
      nativeTexture_(std::make_unique<WinNativeDirectxTexture>(XRStreaming::d3dDevice_))
#else
      nativeTexture_(XRStreaming::buildOsxTextureCopier())
#endif
{
  C8Log("[xr-streaming] %s", "Constructing Remote Service Thread");
  remoteServiceThread_ =
    new RemoteServiceThread(this, KjEventLoop::getIoProvider(), KjEventLoop::getWaitScope());
  MutableRootMessage<XREnvironment> e;
  e.builder().getEngineInfo().setXrVersion(releaseConfigBuildId());
  environment_ = ConstRootMessage<XREnvironment>(e);
  resetEngine();
}

XRStreaming::~XRStreaming() {
  C8Log("[xr-streaming] %s", "Destructor called");
  if (remoteServiceThread_ != nullptr) {
    delete remoteServiceThread_;
    remoteServiceThread_ = nullptr;
  }
}

void XRStreaming::configure(XRConfiguration::Reader config) {
  std::lock_guard<std::mutex> lock(configLock_);
  // Whitelist and merge in fields that will get passed to the engine now and whenever it's rebuilt.
  if (config.hasCoordinateConfiguration()) {
    MutableRootMessage<XRConfiguration> configMessageBuilder;
    configMessageBuilder.builder().setCoordinateConfiguration(
      config.getCoordinateConfiguration());
    configForEngine_ = ConstRootMessage<XRConfiguration>(configMessageBuilder);
    engine_->configure(configForEngine_.reader());
  }

  if (config.hasMask()) {
    this->xrConfig_ = ConstRootMessage<XRConfiguration>(config);
  }

  // There is a pending config waiting to get flushed to the remote. Just append to it so that it
  // gets sent at the next opportunity.
  if (needsXrReconfig_) {
    // Make a copy of the current config waiting for flush and selectively overwrite fields.
    MutableXRConfiguration configCopy(this->xrRemoteConfig_.reader());
    auto configCopyBuilder = configCopy.builder();
    if (config.hasMask()) {
      configCopyBuilder.setMask(config.getMask());
    }
    if (config.hasGraphicsIntrinsics()) {
      configCopyBuilder.setGraphicsIntrinsics(config.getGraphicsIntrinsics());
    }
    if (config.hasCameraConfiguration()) {
      configCopyBuilder.setCameraConfiguration(config.getCameraConfiguration());
    }
    if (config.hasMobileAppKey()) {
      configCopyBuilder.setMobileAppKey(config.getMobileAppKey());
    }
    if (config.hasImageDetection()) {
      configCopyBuilder.setImageDetection(config.getImageDetection());
    }
    if (config.hasCoordinateConfiguration()) {
      configCopyBuilder.setCoordinateConfiguration(config.getCoordinateConfiguration());
    }
    if (config.hasEngineConfiguration()) {
      configCopyBuilder.setEngineConfiguration(config.getEngineConfiguration());
    }

    this->xrRemoteConfig_ = ConstXRConfiguration(configCopy);
  } else {
    // Any previous configs were already flushed to the remote. Make a new one with the latest
    // config, and mark that this new config needs to be flushed to the remote.
    this->xrRemoteConfig_ = ConstRootMessage<XRConfiguration>(config);
    needsXrReconfig_ = true;
  }
}

void XRStreaming::setManagedCameraRGBATexture(
  void *texHandle, int width, int height, int renderingSystem) {
  C8Log("[xr-streaming] setManagedCameraRGBATexture with renderingSystem %d", renderingSystem);
  nativeTexture_->setManagedCameraRGBATexture(texHandle, width, height);
}

void XRStreaming::setManagedCameraYTexture(
  void *texHandle, int width, int height, int renderingSystem) {
  C8Log("[xr-streaming] %s", "setManagedCameraYVTexture is not supported on streaming");
}

void XRStreaming::setManagedCameraUVTexture(
  void *texHandle, int width, int height, int renderingSystem) {
  C8Log("[xr-streaming] %s", "setManagedCameraUVTexture is not supported on streaming");
}

void XRStreaming::resume() { running_ = true; }

void XRStreaming::recenter() { needsEngineReset_ = true; }

void XRStreaming::pause() { running_ = false; }

// There is a RemoteServiceThread that runs on this thread and will call this method each time
// a message is received from the client. @see XRStreaming() constructor for remoteServiceThread_
// initialization
void XRStreaming::processRecord(
  const XrRemoteRequest::Reader &record, XrRemoteResponse::Builder *response) {
  C8Log("[xr-streaming] %s", "Processing a new record");
  auto request = record.getRealityEngine().getRequest();
  auto sensorData = request.getSensors();
  auto remote = record.getXrRemote();

  updateEnvironment(sensorData);
  if (!running_) {
    return;
  }
  updateRemote(remote);

  pushRealityForward(lastScreenOrientation_, request, response);
  // TODO(scott): get local application name from Unity, etc.
  response->getHeader().getApp().setAppId("XrStreaming");
  response->getHeader().setTimestampNanos(
    sensorData.getCamera().getCurrentFrame().getTimestampNanos());

  // We only set this field when we want the remote app to change its sensor
  // the remote app does not maintain its needChange state
  {
    std::lock_guard<std::mutex> lock(configLock_);
    if (needsXrReconfig_) {
      response->setNewXrConfig(xrRemoteConfig_.reader());
      if (response->getNewXrConfig().hasImageDetection()) {
        C8Log(
          "[xr-streaming] telling client to reconfigure with %d detection images",
          response->getNewXrConfig().getImageDetection().getImageDetectionSet().size());
      } else {
        C8Log(
          "[xr-streaming] %s", "telling client to reconfigure with NO change to detection images");
      }
      // NOTE(dat): If our RPC transport for RemoteServiceThread is in UDP (not as of 20180420), we
      //            need to be careful and make sure the new config is received.
      needsXrReconfig_ = false;
    }
  }

  {
    std::lock_guard<std::mutex> lock(editorAppInfoLock_);
    auto appr = editorAppInfo_.reader();
    if (appr.getScreenOrientation() != XrAppDeviceInfo::XrScreenOrientation::UNSPECIFIED) {
      lastScreenOrientation_ = appr.getScreenOrientation();
    }
    if (appr.getScreenPreview().getWidth() > 0 && appr.getScreenPreview().getData().size() > 0)
      response->setScreenPreview(appr.getScreenPreview());
  }
}

void XRStreaming::updateEnvironment(const RequestSensor::Reader &sensorData) {
  auto frame = sensorData.getCamera().getCurrentFrame();

  // Only update if valid values are set.
  if (!(frame.hasImage() && frame.hasUvImage())) {
    return;
  }

  MutableRootMessage<XREnvironment> e;
  auto image = frame.getImage().getOneOf().getGrayImageData();
  e.builder().setRealityImageWidth(image.getCols());
  e.builder().setRealityImageHeight(image.getRows());

  // TODO(nb): get this from the remote.
  e.builder().getCapabilities().setPositionTracking(
    sensorData.hasARKit() || sensorData.hasARCore() || sensorData.hasTango()
      ? XRCapabilities::PositionalTrackingKind::ROTATION_AND_POSITION
      : XRCapabilities::PositionalTrackingKind::ROTATION_AND_POSITION_NO_SCALE);

  e.builder().getCapabilities().setSurfaceEstimation(
    sensorData.hasARKit()
      ? XRCapabilities::SurfaceEstimationKind::HORIZONTAL_AND_VERTICAL
      : (sensorData.hasARCore() ? XRCapabilities::SurfaceEstimationKind::HORIZONTAL_ONLY
                                : XRCapabilities::SurfaceEstimationKind::FIXED_SURFACES));

  e.builder().getCapabilities().setTargetImageDetection(
    sensorData.hasARKit() ? XRCapabilities::TargetImageDetectionKind::FIXED_SIZE_IMAGE_TARGET
                          : XRCapabilities::TargetImageDetectionKind::UNSUPPORTED);

  e.builder().getEngineInfo().setXrVersion(releaseConfigBuildId());

  std::lock_guard<std::mutex> lock(xrEnvironmentLock_);
  environment_ = ConstRootMessage<XREnvironment>(e);

  MutableRootMessage<XRAppEnvironment> appEnv(appEnvironment_.reader());
  appEnv.builder().getManagedCameraTextures().getRgbaTexture().setWidth(
    environment_.reader().getRealityImageWidth());
  appEnv.builder().getManagedCameraTextures().getRgbaTexture().setHeight(
    environment_.reader().getRealityImageHeight());
  appEnvironment_ = ConstRootMessage<XRAppEnvironment>(appEnv);
}

void XRStreaming::updateRemote(XrRemoteApp::Reader remote) {
  std::lock_guard<std::mutex> lock(remoteLock_);
  remotes_.emplace_back(remote);
}

void XRStreaming::bufferFrameForDisplay(const RequestSensor::Reader &sensorData) {
  auto frame = sensorData.getCamera().getCurrentFrame();
  if (!(frame.hasImage() && frame.hasUvImage())) {
    return;
  }
  ScopeTimingScopeLock lock("display-buffer-lock", displayFrameLock_);

  auto image = frame.getImage().getOneOf().getGrayImageData();
  auto uvImage = frame.getUvImage().getOneOf().getGrayImageData();

  if (
    bufferedY_ == nullptr || bufferedY_->pixels().rows() != image.getRows()
    || bufferedY_->pixels().cols() != image.getCols()
    || bufferedY_->pixels().rowBytes() != image.getBytesPerRow()) {
    bufferedY_.reset(
      new YPlanePixelBuffer(image.getRows(), image.getCols(), image.getBytesPerRow()));
    externalBufferedY_.reset(
      new YPlanePixelBuffer(image.getRows(), image.getCols(), image.getBytesPerRow()));
  }

  if (
    bufferedUV_ == nullptr || bufferedUV_->pixels().rows() != uvImage.getRows()
    || bufferedUV_->pixels().cols() != uvImage.getCols()
    || bufferedUV_->pixels().rowBytes() != uvImage.getBytesPerRow()) {
    bufferedUV_.reset(
      new UVPlanePixelBuffer(uvImage.getRows(), uvImage.getCols(), uvImage.getBytesPerRow()));
    externalBufferedUV_.reset(
      new UVPlanePixelBuffer(uvImage.getRows(), uvImage.getCols(), uvImage.getBytesPerRow()));
  }

  auto yp = bufferedY_->pixels();
  auto uvp = bufferedUV_->pixels();

  auto fyp = constFrameYPixels(frame);
  auto fuvp = constFrameUVPixels(frame);

  copyPixels(fyp, &yp);
  copyPixels(fuvp, &uvp);
}

void XRStreaming::setFrameForDisplay() {
  if (bufferedY_ == nullptr || bufferedUV_ == nullptr) {
    return;
  }

  std::lock_guard<std::mutex> lock(displayFrameLock_);

  nativeTexture_->setFrameForDisplay(
    bufferedY_->pixels().rows(),
    bufferedY_->pixels().cols(),
    bufferedY_->pixels().rowBytes(),
    bufferedY_->pixels().pixels(),
    bufferedUV_->pixels().rowBytes(),
    bufferedUV_->pixels().pixels());
}

void XRStreaming::renderFrameForDisplay() {
  ScopeTimer rt("streaming-reality-engine-render-frame-for-display");
  {
    ScopeTimingScopeLock("display-buffer-lock", displayFrameLock_);
    nativeTexture_->renderFrameForDisplay();
  }
}

// Main method to execute a request.
int32_t XRStreaming::pushRealityForward(
  XrAppDeviceInfo::XrScreenOrientation deviceOrientation,
  const RealityRequest::Reader &request,
  XrRemoteResponse::Builder *responseRecord) {
  auto sensorData = request.getSensors();
  auto frame = sensorData.getCamera().getCurrentFrame();
  if (!(frame.hasImage() && frame.hasUvImage())) {
    return 0;
  }

  ScopeTimer rt("streaming-reality-engine-push-reality-forward");

  MutableRootMessage<RealityRequest> realityRequestMessage;
  MutableRootMessage<RealityResponse> realityResponseMessage;
  auto requestBuilder = realityRequestMessage.builder();
  auto responseBuilder = realityResponseMessage.builder();

  {
    ScopeTimer t("construct-request");

    if (needsEngineReset_) {
      resetEngine();
    }

    {
      std::lock_guard<std::mutex> lock(configLock_);
      requestBuilder.setXRConfiguration(xrConfig_.reader());
    }

    {
      auto a = requestBuilder.getAppContext();
      switch (deviceOrientation) {
        case XrAppDeviceInfo::XrScreenOrientation::PORTRAIT:
          a.setDeviceOrientation(AppContext::DeviceOrientation::PORTRAIT);
          break;
        case XrAppDeviceInfo::XrScreenOrientation::LANDSCAPE_LEFT:
          a.setDeviceOrientation(AppContext::DeviceOrientation::LANDSCAPE_LEFT);
          break;
        case XrAppDeviceInfo::XrScreenOrientation::PORTRAIT_UPSIDE_DOWN:
          a.setDeviceOrientation(AppContext::DeviceOrientation::PORTRAIT_UPSIDE_DOWN);
          break;
        case XrAppDeviceInfo::XrScreenOrientation::LANDSCAPE_RIGHT:
          a.setDeviceOrientation(AppContext::DeviceOrientation::LANDSCAPE_RIGHT);
          break;
        default:
          break;
      }
    }

    if (configuredForCamera()) {
      auto frame = sensorData.getCamera().getCurrentFrame();
      auto yIm = frame.getImage().getOneOf().getGrayImageData();
      auto uvIm = frame.getUvImage().getOneOf().getGrayImageData();

      ConstYPlanePixels srcY(
        yIm.getRows(), yIm.getCols(), yIm.getBytesPerRow(), yIm.getUInt8PixelData().begin());

      ConstUVPlanePixels srcUV(
        uvIm.getRows(), uvIm.getCols(), uvIm.getBytesPerRow(), uvIm.getUInt8PixelData().begin());

      RequestCamera::Builder cameraBuilder = requestBuilder.getSensors().getCamera();
      setCameraPixelPointers(srcY, srcUV, &cameraBuilder);

      if (sensorData.getCamera().hasPixelIntrinsics()) {
        requestBuilder.getSensors().getCamera().setPixelIntrinsics(
          sensorData.getCamera().getPixelIntrinsics());
      }

      if (!requestBuilder.getXRConfiguration().getCameraConfiguration().hasCaptureGeometry()) {
        requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setWidth(
          yIm.getCols());
        requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setHeight(
          yIm.getRows());
      }
    }

    if (sensorData.hasPose()) {
      requestBuilder.getSensors().setPose(sensorData.getPose());
    }

    if (sensorData.hasARKit()) {
      requestBuilder.getSensors().setARKit(sensorData.getARKit());
    }

    if (sensorData.hasTango()) {
      requestBuilder.getSensors().setTango(sensorData.getTango());
    }

    if (sensorData.hasARCore()) {
      requestBuilder.getSensors().setARCore(sensorData.getARCore());
    }

    if (request.hasDebugData()) {
      requestBuilder.setDebugData(request.getDebugData());
    }
  }

  {
    ScopeTimer t("execute-request");
    engine_->execute(requestBuilder.asReader(), &responseBuilder);
  }

  {
    ScopeTimingScopeLock lock("lock-and-swap-reality", realityLock_);
    currentXRReality_ = ConstRootMessage<RealityResponse>(realityResponseMessage);
    currentXRRealityRequest_ = ConstRootMessage<RealityRequest>(realityRequestMessage);
    initialized_ = true;
    bufferFrameForDisplay(sensorData);
  }

  if (responseRecord != nullptr) {
    responseRecord->setRealityResponse(responseBuilder);
  }

  return responseBuilder.getStatus().hasError()
    ? (int32_t)responseBuilder.getStatus().getError().getCode()
    : 0;
}

ConstRootMessage<RealityResponse> *XRStreaming::getCurrentReality() {
  if (!initialized_) {
    MutableRootMessage<RealityRequest> m;
    auto request = m.builder();
    pushRealityForward(XrAppDeviceInfo::XrScreenOrientation::PORTRAIT, request, nullptr);
  }
  std::lock_guard<std::mutex> lock(realityLock_);

  ScopeTimer rt("get-current-reality");
  externalXRReality_ = currentXRReality_.clone();
  setFrameForDisplay();

  MutableRootMessage<RealityRequest> externalXrRequest(currentXRRealityRequest_.reader());
  if (bufferedY_ != nullptr) {
    auto yp = externalBufferedY_->pixels();
    auto uvp = externalBufferedUV_->pixels();
    copyPixels(bufferedY_->pixels(), &yp);
    copyPixels(bufferedUV_->pixels(), &uvp);
    RequestCamera::Builder cameraBuilder = externalXrRequest.builder().getSensors().getCamera();
    setCameraPixelPointers(yp, uvp, &cameraBuilder);
  }
  externalXRRealityRequest_ = ConstRootMessage<RealityRequest>(externalXrRequest);
  return &externalXRReality_;
}

ConstRootMessage<RealityResponse> *XRStreaming::getExternalReality() { return &externalXRReality_; }

ConstRootMessage<RealityRequest> *XRStreaming::getRequestForCurrentReality() {
  return &externalXRRealityRequest_;
}

ConstRootMessage<XREnvironment> *XRStreaming::getXREnvironment() {
  auto instance = getInstance();
  if (instance == nullptr) {
    return getUnspecifiedXREnvironment();
  } else {
    return instance->getXREnvironmentImpl();
  }
}

ConstRootMessage<XRAppEnvironment> *XRStreaming::getXRAppEnvironment() { return &appEnvironment_; }

void XRStreaming::setXRAppEnvironment(XRAppEnvironment::Reader reader) {
  MutableRootMessage<XRAppEnvironment> env(reader);

  if (environment_.reader().getRealityImageWidth() > 0) {
    env.builder().getManagedCameraTextures().getRgbaTexture().setWidth(
      environment_.reader().getRealityImageWidth());
    env.builder().getManagedCameraTextures().getRgbaTexture().setHeight(
      environment_.reader().getRealityImageHeight());
  }

  appEnvironment_ = ConstRootMessage<XRAppEnvironment>(env);
}

ConstRootMessage<XrRemoteApp> &XRStreaming::getXRRemote() {
  std::lock_guard<std::mutex> lock(remoteLock_);
  int numTouches = 0;
  for (auto &r : remotes_) {
    numTouches += r.reader().getTouches().size();
  }
  MutableRootMessage<XrRemoteApp> remote;
  remote.builder().initTouches(numTouches);
  int idx = 0;
  for (auto &r : remotes_) {
    auto sd = r.reader().getDevice();
    auto dd = remote.builder().getDevice();
    // Get device info from the most recent message in the list.
    int w = sd.getScreenWidth();
    int h = sd.getScreenHeight();
    auto o = lastScreenOrientation_;
    if (
      o == XrAppDeviceInfo::XrScreenOrientation::LANDSCAPE_RIGHT
      || o == XrAppDeviceInfo::XrScreenOrientation::LANDSCAPE_LEFT) {
      std::swap(w, h);
    }
    dd.setScreenWidth(w);
    dd.setScreenHeight(h);
    dd.setOrientation(sd.getOrientation());
    dd.setScreenOrientation(o);

    for (auto t : r.reader().getTouches()) {
      auto dt = remote.builder().getTouches()[idx];
      auto tx = t.getPositionX();
      auto ty = t.getPositionY();
      switch (o) {
        case XrAppDeviceInfo::XrScreenOrientation::LANDSCAPE_LEFT:
          tx = sd.getScreenHeight() - t.getPositionY();
          ty = t.getPositionX();
          break;
        case XrAppDeviceInfo::XrScreenOrientation::PORTRAIT_UPSIDE_DOWN:
          tx = sd.getScreenWidth() - t.getPositionX();
          ty = sd.getScreenHeight() - t.getPositionY();
          break;
        case XrAppDeviceInfo::XrScreenOrientation::LANDSCAPE_RIGHT:
          tx = t.getPositionY();
          ty = sd.getScreenWidth() - t.getPositionX();
          break;
        default:
          break;
      }
      dt.setPositionX(tx);
      dt.setPositionY(ty);
      dt.setTimestamp(t.getTimestamp());
      dt.setPhase(t.getPhase());
      dt.setTapCount(t.getTapCount());
      dt.setFingerId(t.getFingerId());
      ++idx;
    }
  }
  remoteExternal_ = ConstRootMessage<XrRemoteApp>(remote);
  remotes_.clear();
  return remoteExternal_;
}

void XRStreaming::setEditorAppInfo(struct c8_NativeByteArray *preview) {
  std::lock_guard<std::mutex> lock(editorAppInfoLock_);
  editorAppInfo_ = ConstRootMessage<XrEditorAppInfo>(preview->bytes, preview->size);

  auto appr = editorAppInfo_.reader();
  if (appr.getScreenOrientation() != XrAppDeviceInfo::XrScreenOrientation::UNSPECIFIED) {
    lastScreenOrientation_ = appr.getScreenOrientation();
  }
}

ConstRootMessage<XrQueryResponse> *XRStreaming::query(XrQueryRequest::Reader request) {
  MutableRootMessage<XrQueryResponse> response;
  auto responseBuilder = response.builder();
  engine_->query(request, &responseBuilder);
  lastQueryResponse_ = ConstRootMessage<XrQueryResponse>(response);
  return &lastQueryResponse_;
}

bool XRStreaming::configuredForCamera() { return true; }

bool XRStreaming::configuredForPose() { return true; }

void XRStreaming::resetEngine() {
  needsEngineReset_ = false;
  engine_.reset(new XREngine());
  engine_->setResetLoggingTreeRoot(true);
  engine_->configure(configForEngine_.reader());
}

ConstRootMessage<XREnvironment> *XRStreaming::getUnspecifiedXREnvironment() {
  MutableRootMessage<XREnvironment> e;
  e.builder().setRealityImageShader(XREnvironment::ImageShaderKind::UNSPECIFIED);
  e.builder().getCapabilities().setPositionTracking(
    XRCapabilities::PositionalTrackingKind::UNSPECIFIED);
  e.builder().getCapabilities().setSurfaceEstimation(
    XRCapabilities::SurfaceEstimationKind::UNSPECIFIED);
  e.builder().getEngineInfo().setXrVersion(releaseConfigBuildId());

  std::lock_guard<std::mutex> lock(xrEnvironmentLock_);
  externalXREnvironment_ = ConstRootMessage<XREnvironment>(e);
  return &externalXREnvironment_;
}

ConstRootMessage<XREnvironment> *XRStreaming::getXREnvironmentImpl() {
  std::lock_guard<std::mutex> lock(xrEnvironmentLock_);
  externalXREnvironment_ = environment_.clone();
  return &externalXREnvironment_;
}

ConstRootMessage<XrRemoteApp> XRStreaming::FALLBACK_REMOTE_APP_DATA =
  ConstRootMessage<XrRemoteApp>();

ConstRootMessage<XREnvironment> XRStreaming::externalXREnvironment_ =
  ConstRootMessage<XREnvironment>();
// Singleton streaming engine instance used across Unity threads.
XRStreaming *XRStreaming::xRStreaming_ = nullptr;
int XRStreaming::renderingSystem_ = 0;
#ifdef _WIN32
ID3D11Device *XRStreaming::d3dDevice_ = nullptr;
#endif

std::mutex XRStreaming::xrEnvironmentLock_;

}  // namespace c8

using namespace c8;

void INTERFACE_CALL c8XRStreaming_onUnityRenderEvent(int eventId) {
  if (XRStreaming::isRenderingOpenGL()) {
    auto *xr = XRStreaming::getInstance();
    if (xr == nullptr) {
      C8Log("[xr-streaming] %s", "xr-streaming onUnityRenderEvent after destroy");
      return;
    }

    // Buffer the current reality for display and query by unity on the next frame.
    xr->getCurrentReality();
  }

  c8XRStreaming_renderFrameForDisplay();
}

UnityRenderingEventFuncType c8XRStreaming_getRenderEventFunc() {
  return c8XRStreaming_onUnityRenderEvent;
}

// Unity plugin load event
#ifdef _WIN32
void UNITY_INTERFACE_EXPORT UNITY_INTERFACE_API UnityPluginLoad(IUnityInterfaces *unityInterfaces) {
  C8Log("[xr-streaming] %s", "Grabbing Unity D3D11 device");
  IUnityGraphicsD3D11 *d3d11 = unityInterfaces->Get<IUnityGraphicsD3D11>();
  XRStreaming::setD3D11Device(d3d11->GetDevice());
}
#endif

DLLEXPORT void c8XRStreaming_setRenderingSystem(int renderingSystem) {
  XRStreaming::setRenderingSystem(renderingSystem);
}

DLLEXPORT void c8XRStreaming_create() { XRStreaming::createInstance(); }

// Destroy a reality engine.
DLLEXPORT void c8XRStreaming_destroy() { XRStreaming::destroyInstance(); }

// Configure a reality engine.
DLLEXPORT void c8XRStreaming_configureXR(struct c8_NativeByteArray *config) {
  auto *xr = XRStreaming::getInstance();
  if (xr == nullptr) {
    C8Log("[xr-streaming] %s", "xr-streaming configured after destroy");
    return;
  }
  ConstRootMessage<XRConfiguration> m(config->bytes, config->size);
  xr->configure(m.reader());
}

DLLEXPORT void c8XRStreaming_setManagedCameraRGBATexture(
  void *texHandle, int width, int height, int renderingSystem) {
  C8Log(
    "[xr-streaming] setManagedCameraRGBATexture(%p, %d, %d, %d)",
    texHandle,
    width,
    height,
    renderingSystem);
  auto *xr = XRStreaming::getInstance();
  if (xr != nullptr) {
    xr->setManagedCameraRGBATexture(texHandle, width, height, renderingSystem);
  } else {
    C8Log("[xr-streaming] %s", "xr-streaming setManagedCameraRGBATexture after destroy");
  }
}

DLLEXPORT void c8XRStreaming_setManagedCameraYTexture(
  void *texHandle, int width, int height, int renderingSystem) {
  auto *xr = XRStreaming::getInstance();
  if (xr != nullptr) {
    xr->setManagedCameraYTexture(texHandle, width, height, renderingSystem);
  } else {
    C8Log("[xr-streaming] %s", "xr-streaming setManagedCameraYTexture after destroy");
  }
}

DLLEXPORT void c8XRStreaming_setManagedCameraUVTexture(
  void *texHandle, int width, int height, int renderingSystem) {
  auto *xr = XRStreaming::getInstance();
  if (xr != nullptr) {
    xr->setManagedCameraUVTexture(texHandle, width, height, renderingSystem);
  } else {
    C8Log("[xr-streaming] %s", "xr-streaming setManagedCameraUVTexture after destroy");
  }
}

DLLEXPORT void c8XRStreaming_renderFrameForDisplay() {
  auto *xr = XRStreaming::getInstance();
  if (xr != nullptr) {
    xr->renderFrameForDisplay();
  } else {
    C8Log("[xr-streaming] %s", "xr-streaming render after destroy");
  }
}

// Resume a reality engine.
DLLEXPORT void c8XRStreaming_resume() {
  auto *xr = XRStreaming::getInstance();
  if (xr != nullptr) {
    xr->resume();
  } else {
    C8Log("[xr-streaming] %s", "xr-streaming resume after destroy");
  }
}

// Recenter a reality engine.
DLLEXPORT void c8XRStreaming_recenter() {
  auto *xr = XRStreaming::getInstance();
  if (xr != nullptr) {
    xr->recenter();
  } else {
    C8Log("[xr-streaming] %s", "xr-streaming recenter after destroy");
  }
}

// Get the most recent reality.
DLLEXPORT int c8XRStreaming_getCurrentRealityXR(struct c8_NativeByteArray *reality) {
  auto *xr = XRStreaming::getInstance();
  if (xr == nullptr) {
    C8Log("[xr-streaming] %s", "xr-streaming getCurrentReality after destroy");
    return -1;
  }

  ConstRootMessage<RealityResponse> *r;
  if (XRStreaming::isRenderingOpenGL()) {
    // Get the data that was last buffered on a call to c8XRStreaming_onUnityRenderEvent.
    r = xr->getExternalReality();
  } else {
    r = xr->getCurrentReality();  // on windows/metal get current result
  }

  *reality = c8_NativeByteArray{static_cast<const void *>(r->bytes().begin()),
                                static_cast<int>(r->bytes().size())};
  return 0;
}

DLLEXPORT void c8XRStreaming_getXREnvironment(struct c8_NativeByteArray *environment) {
  auto *env = XRStreaming::getXREnvironment();
  *environment = c8_NativeByteArray{static_cast<const void *>(env->bytes().begin()),
                                    static_cast<int>(env->bytes().size())};
}

DLLEXPORT void c8XRStreaming_getXRAppEnvironment(struct c8_NativeByteArray *environment) {
  auto *xr = XRStreaming::getInstance();
  if (xr == nullptr) {
    C8Log("[xr-streaming] %s", "xr-streaming getXRAppEnvironment after destroy");
    return;
  }
  auto *env = xr->getXRAppEnvironment();
  *environment = c8_NativeByteArray{static_cast<const void *>(env->bytes().begin()),
                                    static_cast<int>(env->bytes().size())};
}

DLLEXPORT void c8XRStreaming_setXRAppEnvironment(struct c8_NativeByteArray *environment) {
  auto *xr = XRStreaming::getInstance();
  if (xr == nullptr) {
    C8Log("[xr-streaming] %s", "xr-streaming setXRAppEnvironment after destroy");
    return;
  }

  ConstRootMessage<XRAppEnvironment> env(environment->bytes, environment->size);
  xr->setXRAppEnvironment(env.reader());
}

DLLEXPORT void c8XRStreaming_getXRRemote(struct c8_NativeByteArray *remote) {
  auto *xr = XRStreaming::getInstance();
  if (xr != nullptr) {
    auto &rem = XRStreaming::getInstance()->getXRRemote();
    *remote = c8_NativeByteArray{static_cast<const void *>(rem.bytes().begin()),
                                 static_cast<int>(rem.bytes().size())};
  } else {
    C8Log("[xr-streaming] %s", "xr-streaming getXRRemote after destroy");
    auto &rem = XRStreaming::FALLBACK_REMOTE_APP_DATA;
    *remote = c8_NativeByteArray{static_cast<const void *>(rem.bytes().begin()),
                                 static_cast<int>(rem.bytes().size())};
  }
}

// Pause a reality engine.
DLLEXPORT void c8XRStreaming_pause() {
  auto *xr = XRStreaming::getInstance();
  if (xr != nullptr) {
    xr->pause();
  } else {
    C8Log("[xr-streaming] %s", "xr-streaming paused after destroy");
  }
}

DLLEXPORT void c8XRStreaming_setEditorAppInfo(struct c8_NativeByteArray *preview) {
  auto *xr = XRStreaming::getInstance();
  if (xr != nullptr) {
    xr->setEditorAppInfo(preview);
  } else {
    C8Log("[xr-streaming] %s", "xr-streaming set preview after destroy");
  }
}

DLLEXPORT void c8XRStreaming_query(
  struct c8_NativeByteArray *request, struct c8_NativeByteArray *response) {
  auto *xr = XRStreaming::getInstance();
  if (xr != nullptr) {
    ConstRootMessage<XrQueryRequest> requestMessage(request->bytes, request->size);
    auto responseMessage = xr->query(requestMessage.reader());
    *response = c8_NativeByteArray{static_cast<const void *>(responseMessage->bytes().begin()),
                                   static_cast<int>(responseMessage->bytes().size())};
  } else {
    C8Log("[xr-streaming] %s", "xr-streaming query after destroy");
  }
}
#ifdef WIN32

BOOL APIENTRY DllMain(HANDLE hModule, DWORD ul_reason_for_call, LPVOID lpReserved) { return TRUE; }
#endif
