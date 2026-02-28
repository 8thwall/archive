// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/app/xr/android/xr-controller.h"

#ifdef ANDROID

#include "c8/c8-log.h"
#include "c8/map.h"
#include "c8/protolog/xr-extern.h"
#include "c8/protolog/xr-requests.h"
#include "c8/set.h"
#include "c8/string.h"
#include "reality/app/xr/android/xr-native-bridge.h"

using namespace c8;

struct c8::XrControllerPrivateData {
public:
  ConstRootMessage<RealityResponse> currentXRResponse;
  int64_t currentRealityUpdateNumber = 0;
  int64_t updateNumber = 0;
  int64_t lastRealityMicros = 0;
  bool running = false;
  bool started = false;
  bool explicitlyPaused = false;

  bool disableNativeAr = false;
  ConstRootMessage<XREnvironment> xrEnvironment;
  XrNativeBridge bridge;

  xr::Camera cam = xr::Camera::NO_CAMERA();
  xr::Vector3 origin = xr::Vector3(0.0f, 0.0f, 0.0f);
  xr::Quaternion facing = xr::Quaternion(0.0f, 0.0f, 0.0f, 1.0f);
  float scale = 0.0f;

  std::string overrideAppKey;

  TreeMap<int64_t, xr::Surface> currentSurfaces;
  int64_t currentSurfacesUpdateNumber = 0;

  TreeMap<String, xr::DetectionImage> detectionImages;

  xr::Texture2D realityRGBATexture;
  xr::Texture2D realityYTexture;
  xr::Texture2D realityUVTexture;

  RealityResponse::Reader currentReality();

  TreeMap<int64_t, xr::Surface> surfaceMap();
  void updateSurfacesFromXRResponse();
  void runIfPaused();

  static CompressedImageData::Encoding toImageDataEncoding(xr::DetectionImage::Encoding encoding);
  static xr::Surface::Type toSurfaceType(c8::Surface::SurfaceType surfaceType);
};

CompressedImageData::Encoding XrControllerPrivateData::toImageDataEncoding(
  xr::DetectionImage::Encoding encoding) {
  switch (encoding) {
    case xr::DetectionImage::Encoding::RGB24_INVERTED_Y:
      return CompressedImageData::Encoding::RGB24_INVERTED_Y;
    case xr::DetectionImage::Encoding::RGB24:
      return CompressedImageData::Encoding::RGB24;
    default:
      return CompressedImageData::Encoding::UNSPECIFIED;
  }
}

RealityResponse::Reader XrControllerPrivateData::currentReality() {
  if (
    currentXRResponse.reader().getEventId().getEventTimeMicros() == 0L
    || currentRealityUpdateNumber < updateNumber) {
    currentRealityUpdateNumber = updateNumber;
    currentXRResponse = bridge.currentRealityXR();
  }
  return currentXRResponse.reader();
}

XrController::XrController() { this_ = new XrControllerPrivateData(); }

XrController::~XrController() { delete this_; }

xr::Matrix4x4 XrController::cameraIntrinsics() {
  auto r = this_->currentReality();
  auto intrinsics = r.getXRResponse().getCamera().getIntrinsic().getMatrix44f();
  xr::Matrix4x4 np;

  for (int i = 0; i < 4; ++i) {
    for (int j = 0; j < 4; ++j) {
      np(i, j) = intrinsics[j * 4 + i];
    }
  }

  return np;
}

xr::Vector3 XrController::cameraPosition() {
  auto r = this_->currentReality();
  auto pos = r.getXRResponse().getCamera().getExtrinsic().getPosition();
  return xr::Vector3(pos.getX(), pos.getY(), pos.getZ());
}

xr::TrackingState XrController::trackingState() {
  auto re = this_->currentReality();
  auto status = re.getXRResponse().getCamera().getTrackingState().getStatus();
  auto reason = re.getXRResponse().getCamera().getTrackingState().getReason();

  xr::TrackingState::Status s = xr::TrackingState::Status::UNSPECIFIED_STATUS;
  xr::TrackingState::Reason r = xr::TrackingState::Reason::UNSPECIFIED_REASON;

  switch (status) {
    case XrTrackingState::XrTrackingStatus::NOT_AVAILABLE:
      s = xr::TrackingState::Status::NOT_AVAILABLE;
      break;
    case XrTrackingState::XrTrackingStatus::LIMITED:
      s = xr::TrackingState::Status::LIMITED;
      break;
    case XrTrackingState::XrTrackingStatus::NORMAL:
      s = xr::TrackingState::Status::NORMAL;
      break;
    default:
      break;
  }

  switch (reason) {
    case XrTrackingState::XrTrackingStatusReason::INITIALIZING:
      r = xr::TrackingState::Reason::INITIALIZING;
      break;
    case XrTrackingState::XrTrackingStatusReason::RELOCALIZING:
      r = xr::TrackingState::Reason::RELOCALIZING;
      break;
    case XrTrackingState::XrTrackingStatusReason::TOO_MUCH_MOTION:
      r = xr::TrackingState::Reason::TOO_MUCH_MOTION;
      break;
    case XrTrackingState::XrTrackingStatusReason::NOT_ENOUGH_TEXTURE:
      r = xr::TrackingState::Reason::NOT_ENOUGH_TEXTURE;
      break;
    default:
      break;
  }

  return xr::TrackingState(s, r);
}

xr::Quaternion XrController::cameraRotation() {
  auto r = this_->currentReality();
  auto rot = r.getXRResponse().getCamera().getExtrinsic().getRotation();
  if (rot.getX() == 0.0f && rot.getY() == 0.0f && rot.getZ() == 0.0f && rot.getW() == 0.0f) {
    return xr::Quaternion(0.0f, 0.0f, 0.0f, 1.0f);
  }
  return xr::Quaternion(rot.getX(), rot.getY(), rot.getZ(), rot.getW());
}

void XrController::updateCameraProjectionMatrix(
  xr::Camera cam, xr::Vector3 origin, xr::Quaternion facing, float scale) {
  if (!capabilities().IsPositionTrackingRotationAndPosition()) {
    float scaleAdjustment = origin.y;
    this_->scale = scaleAdjustment;
  } else {
    this_->scale = scale;
  }
  this_->origin = origin;
  this_->facing = facing;
  this_->cam = cam;
  configureXR();
}

xr::TextureRotation XrController::textureRotation() {
  auto r = this_->currentReality();
  switch (r.getAppContext().getRealityTextureRotation()) {
    case c8::AppContext::RealityTextureRotation::R0:
      return xr::TextureRotation::R0;
    case c8::AppContext::RealityTextureRotation::R90:
      return xr::TextureRotation::R90;
    case c8::AppContext::RealityTextureRotation::R180:
      return xr::TextureRotation::R180;
    case c8::AppContext::RealityTextureRotation::R270:
      return xr::TextureRotation::R270;
    default:
      return xr::TextureRotation::UNSPECIFIED_TEXTURE_ROTATION;
  }
}

float XrController::lightExposure() {
  auto r = this_->currentReality();
  return r.getXRResponse().getLighting().getGlobal().getExposure();
}

float XrController::lightTemperature() {
  auto r = this_->currentReality();
  return r.getXRResponse().getLighting().getGlobal().getTemperature();
}

int64_t XrController::activeSurfaceId() {
  auto r = this_->currentReality();
  return r.getXRResponse().getSurfaces().getActiveSurface().getId().getEventTimeMicros();
}

xr::Surface XrController::surface(int64_t id) {
  auto surface = this_->surfaceMap();
  auto found = surface.find(id);
  return found == surface.end() ? xr::Surface::NO_SURFACE() : found->second;
}

std::vector<xr::Surface> XrController::surfaces() {
  std::vector<xr::Surface> v;
  auto surface = this_->surfaceMap();
  for (const auto &s : surface) {
    v.push_back(s.second);
  }
  return v;
}

float XrController::realityTextureAspectRatio() {
  return (float)this_->xrEnvironment.reader().getRealityImageWidth()
    / (float)this_->xrEnvironment.reader().getRealityImageHeight();
}

bool XrController::shouldUseRealityRGBATexture() {
  // ARCore devices still use RGBA texture.
  return this_->xrEnvironment.reader().getRealityImageShader()
    == XREnvironment::ImageShaderKind::ARCORE;
}

xr::Texture2D XrController::realityRGBATexture() {
  if (
    this_->realityRGBATexture.format != xr::Texture2D::TextureFormat::UNSPECIFIED_TEXTURE_FORMAT) {
    return this_->realityRGBATexture;
  }

  // Create a texture
  auto appEnvironment = this_->bridge.xrAppEnvironment();
  auto envTex = appEnvironment.reader().getManagedCameraTextures().getRgbaTexture();
  this_->realityRGBATexture = xr::Texture2D(
    envTex.getWidth(), envTex.getHeight(), xr::Texture2D::TextureFormat::RGBA32, envTex.getPtr());

  return this_->realityRGBATexture;
}

void XrController::setAppKey(const std::string &key) { this_->overrideAppKey = key; }

xr::Texture2D XrController::realityYTexture() {
  if (this_->realityYTexture.format != xr::Texture2D::TextureFormat::UNSPECIFIED_TEXTURE_FORMAT) {
    return this_->realityYTexture;
  }

  // Create a texture
  auto appEnvironment = this_->bridge.xrAppEnvironment();
  auto envTex = appEnvironment.reader().getManagedCameraTextures().getYTexture();
  this_->realityYTexture = xr::Texture2D(
    envTex.getWidth(), envTex.getHeight(), xr::Texture2D::TextureFormat::R8, envTex.getPtr());

  return this_->realityYTexture;
}

xr::Texture2D XrController::realityUVTexture() {
  if (this_->realityUVTexture.format != xr::Texture2D::TextureFormat::UNSPECIFIED_TEXTURE_FORMAT) {
    return this_->realityUVTexture;
  }

  // Create a texture
  auto appEnvironment = this_->bridge.xrAppEnvironment();
  auto envTex = appEnvironment.reader().getManagedCameraTextures().getUvTexture();

  this_->realityUVTexture = xr::Texture2D(
    envTex.getWidth(), envTex.getHeight(), xr::Texture2D::TextureFormat::RG16, envTex.getPtr());

  return this_->realityUVTexture;
}

/*
public Shader GetVideoShader() {
  if (xrEnvironment == null) {
    return Shader.Find("Unlit/XRCameraYUVShader");
  }
  switch(xrEnvironment.getRealityImageShader()) {
    case XREnvironment.ImageShaderKind.ARCORE:
      return Shader.Find("Unlit/ARCoreCameraShader");
    default:
      return (ShouldUseRealityRGBATexture()
          ? Shader.Find("Unlit/XRCameraRGBAShader")
          : Shader.Find("Unlit/XRCameraYUVShader"));
  }
}

public Shader GetVideoTextureShader() {
  switch(xrEnvironment.getRealityImageShader()) {
    case XREnvironment.ImageShaderKind.ARCORE:
      return Shader.Find("Unlit/ARCoreTextureShader");
    default:
      return (ShouldUseRealityRGBATexture()
          ? Shader.Find("Unlit/XRTextureRGBAShader")
          : Shader.Find("Unlit/XRTextureYUVShader"));;
  }
}*/

void XrController::recenter() {
  if (capabilities().IsSurfaceEstimationFixedSurfaces()) {
    this_->bridge.recenter();
  }
}

xr::Capabilities XrController::capabilities() { return deviceCapabilities(); }

std::vector<xr::HitTestResult> XrController::hitTest(float x, float y) {
  return hitTest(x, y, std::vector<xr::HitTestResult::Type>());
}

std::vector<xr::HitTestResult> XrController::hitTest(
  float x, float y, std::vector<xr::HitTestResult::Type> includedTypes) {
  MutableRootMessage<XrQueryRequest> queryMessage;
  auto query = queryMessage.builder();
  auto ht = query.getHitTest();
  ht.setX(x);
  ht.setY(y);
  if (includedTypes.size() > 0) {
    query.getHitTest().initIncludedTypes(includedTypes.size());
    for (int i = 0; i < includedTypes.size(); ++i) {
      auto type = includedTypes[i];
      switch (type) {
        case xr::HitTestResult::Type::FEATURE_POINT:
          ht.getIncludedTypes().set(i, XrHitTestResult::ResultType::FEATURE_POINT);
          break;
        case xr::HitTestResult::Type::ESTIMATED_SURFACE:
          ht.getIncludedTypes().set(i, XrHitTestResult::ResultType::ESTIMATED_SURFACE);
          break;
        case xr::HitTestResult::Type::DETECTED_SURFACE:
          ht.getIncludedTypes().set(i, XrHitTestResult::ResultType::DETECTED_SURFACE);
          break;
        default:
          // pass
          break;
      }
    }
  }
  auto response = this_->bridge.query(queryMessage);
  std::vector<xr::HitTestResult> results = std::vector<xr::HitTestResult>();
  for (auto hit : response.reader().getHitTest().getHits()) {
    auto type = xr::HitTestResult::Type::UNSPECIFIED;
    switch (hit.getType()) {
      case XrHitTestResult::ResultType::FEATURE_POINT:
        type = xr::HitTestResult::Type::FEATURE_POINT;
        break;
      case XrHitTestResult::ResultType::ESTIMATED_SURFACE:
        type = xr::HitTestResult::Type::ESTIMATED_SURFACE;
        break;
      case XrHitTestResult::ResultType::DETECTED_SURFACE:
        type = xr::HitTestResult::Type::DETECTED_SURFACE;
        break;
      default:
        type = xr::HitTestResult::Type::UNSPECIFIED;
        break;
    }
    xr::Vector3 position = xr::Vector3(
      hit.getPlace().getPosition().getX(),
      hit.getPlace().getPosition().getY(),
      hit.getPlace().getPosition().getZ());
    xr::Quaternion rotation(
      hit.getPlace().getRotation().getX(),
      hit.getPlace().getRotation().getY(),
      hit.getPlace().getRotation().getZ(),
      hit.getPlace().getRotation().getW());
    float distance = hit.getDistance();
    results.push_back(xr::HitTestResult(type, position, rotation, distance));
  }
  return results;
}

std::vector<xr::WorldPoint> XrController::worldPoints() {
  auto r = this_->currentReality();
  std::vector<xr::WorldPoint> pts;
  for (auto pt : r.getFeatureSet().getPoints()) {
    auto p = pt.getPosition();
    pts.push_back(
      xr::WorldPoint(pt.getId(), xr::Vector3(p.getX(), p.getY(), p.getZ()), pt.getConfidence()));
  }
  return pts;
}

std::vector<xr::DetectedImageTarget> XrController::detectedImageTargets() {
  auto r = this_->currentReality();
  std::vector<xr::DetectedImageTarget> pts;
  for (auto target : r.getXRResponse().getDetection().getImages()) {
    std::string name = target.getName();
    pts.push_back(xr::DetectedImageTarget(
      target.getId(),
      name,
      xr::Vector3(
        target.getPlace().getPosition().getX(),
        target.getPlace().getPosition().getY(),
        target.getPlace().getPosition().getZ()),
      xr::Quaternion(
        target.getPlace().getRotation().getX(),
        target.getPlace().getRotation().getY(),
        target.getPlace().getRotation().getZ(),
        target.getPlace().getRotation().getW()),
      target.getWidthInMeters(),
      target.getHeightInMeters()));
  }
  return pts;
}

xr::Capabilities XrController::deviceCapabilities() {
  xr::Capabilities::PositionTracking position =
    xr::Capabilities::PositionTracking::UNSPECIFIED_POSITION_TRACKING;
  xr::Capabilities::SurfaceEstimation surface =
    xr::Capabilities::SurfaceEstimation::UNSPECIFIED_SURFACE_ESTIMATION;
  xr::Capabilities::TargetImageDetection imageDetect =
    xr::Capabilities::TargetImageDetection::UNSPECIFIED_TARGET_IMAGE_DETECTION;

  auto envMessage = this_->bridge.xrEnvironment();
  auto env = envMessage.reader();

  switch (env.getCapabilities().getPositionTracking()) {
    case XRCapabilities::PositionalTrackingKind::ROTATION_AND_POSITION:
      position = xr::Capabilities::PositionTracking::ROTATION_AND_POSITION;
      break;
    case XRCapabilities::PositionalTrackingKind::ROTATION_AND_POSITION_NO_SCALE:
      position = xr::Capabilities::PositionTracking::ROTATION_AND_POSITION_NO_SCALE;
      break;
    default:
      position = xr::Capabilities::PositionTracking::UNSPECIFIED_POSITION_TRACKING;
      break;
  }

  switch (env.getCapabilities().getSurfaceEstimation()) {
    case XRCapabilities::SurfaceEstimationKind::FIXED_SURFACES:
      surface = xr::Capabilities::SurfaceEstimation::FIXED_SURFACES;
      break;
    case XRCapabilities::SurfaceEstimationKind::HORIZONTAL_ONLY:
      surface = xr::Capabilities::SurfaceEstimation::HORIZONTAL_ONLY;
      break;
    case XRCapabilities::SurfaceEstimationKind::HORIZONTAL_AND_VERTICAL:
      surface = xr::Capabilities::SurfaceEstimation::HORIZONTAL_AND_VERTICAL;
      break;
    default:
      surface = xr::Capabilities::SurfaceEstimation::UNSPECIFIED_SURFACE_ESTIMATION;
      break;
  }

  switch (env.getCapabilities().getTargetImageDetection()) {
    case XRCapabilities::TargetImageDetectionKind::UNSUPPORTED:
      imageDetect = xr::Capabilities::TargetImageDetection::UNSUPPORTED;
      break;
    case XRCapabilities::TargetImageDetectionKind::FIXED_SIZE_IMAGE_TARGET:
      imageDetect = xr::Capabilities::TargetImageDetection::FIXED_SIZE_IMAGE_TARGET;
      break;
    default:
      imageDetect = xr::Capabilities::TargetImageDetection::UNSPECIFIED_TARGET_IMAGE_DETECTION;
      break;
  }

  return xr::Capabilities(position, surface, imageDetect);
}

void XrController::configureXR() {
  // Set compute mask and camera config.
  {
    MutableRootMessage<XRConfiguration> configMessageBuilder;
    auto config = configMessageBuilder.builder();
    auto configMask = config.getMask();
    configMask.setLighting(enableLighting);
    configMask.setCamera(enableCamera);
    configMask.setSurfaces(enableSurfaces);
    configMask.setVerticalSurfaces(enableVerticalSurfaces);
    configMask.setFeatureSet(true);

    config.getCameraConfiguration().setAutofocus(enableCameraAutofocus);
    config.setMobileAppKey(this_->overrideAppKey);

    auto graphicsIntrinsicsConfig = config.getGraphicsIntrinsics();
    graphicsIntrinsicsConfig.setTextureWidth((int)this_->cam.pixelRectWidth);
    graphicsIntrinsicsConfig.setTextureHeight((int)this_->cam.pixelRectHeight);
    graphicsIntrinsicsConfig.setNearClip(this_->cam.nearClipPlane);
    graphicsIntrinsicsConfig.setFarClip(this_->cam.farClipPlane);
    graphicsIntrinsicsConfig.setDigitalZoomHorizontal(1.0f);
    graphicsIntrinsicsConfig.setDigitalZoomVertical(1.0f);

    this_->bridge.configure(configMessageBuilder);
  }

  // Set coordiante system.
  {
    MutableRootMessage<XRConfiguration> configMessageBuilder;
    auto coords = configMessageBuilder.builder().getCoordinateConfiguration();
    coords.setAxes(CoordinateSystemConfiguration::CoordinateAxes::X_LEFT_Y_UP_Z_FORWARD);
    setQuaternion32f(
      this_->facing.w,
      this_->facing.x,
      this_->facing.y,
      this_->facing.z,
      coords.getOrigin().getRotation());
    setPosition32f(
      this_->origin.x, this_->origin.y, this_->origin.z, coords.getOrigin().getPosition());
    coords.setScale(this_->scale);

    this_->bridge.configure(configMessageBuilder);
  }
}

std::map<std::string, xr::DetectionImage> XrController::detectionImages() {
  return this_->detectionImages;
}

void XrController::setDetectionImages(const std::map<std::string, xr::DetectionImage> &images) {
  this_->detectionImages = images;

  int numImages = this_->detectionImages.size();

  MutableRootMessage<XRConfiguration> configMessageBuilder;
  auto config = configMessageBuilder.builder();
  auto detectionImageSet = config.getImageDetection().initImageDetectionSet(numImages);
  int i = 0;
  for (auto imageItem : this_->detectionImages) {
    auto &name = imageItem.first;
    auto &detectionImage = imageItem.second;

    auto xrDetectionImage = detectionImageSet[i];
    xrDetectionImage.setName(name);
    xrDetectionImage.setRealWidthInMeter(detectionImage.targetWidthInMeters);

    auto cid = xrDetectionImage.getImage();
    cid.setWidth(detectionImage.widthInPixels);
    cid.setHeight(detectionImage.heightInPixels);
    cid.setEncoding(XrControllerPrivateData::toImageDataEncoding(detectionImage.encoding));
    size_t imageBytes = 4 * detectionImage.widthInPixels * detectionImage.heightInPixels;
    cid.initData(imageBytes);
    std::memcpy(cid.getData().begin(), detectionImage.imageData, imageBytes);
    i++;
  }
  this_->bridge.configure(configMessageBuilder);
}

void XrController::disableNativeArEngine(bool isDisabled) {
  this_->disableNativeAr = isDisabled;
  setEngineMode();
}

// Awake is called first at app startup.
void XrController::awake(JNIEnv *env, jobject context) {
  C8Log("[xr-controller] %s", "awake");
  this_->running = false;
  C8Log("[xr-controller] %s", "call bridge.create(...)");
  this_->bridge.create(env, context, renderingSystem());
  /*
  if (EnableRemote()) {
    editorBridge = new XREditorBridge();
  }
  */
  C8Log("[xr-controller] %s", "call bridge.xrEnvironment()");
  this_->xrEnvironment = this_->bridge.xrEnvironment();
  C8Log("[xr-controller] %s", "done");
  // Application.targetFrameRate = 60;
}

void XrController::onEnable() { setEngineMode(); }

// Start is called after OnEnable, but it is only called once for a given script, while OnEnable
// is called after every call to OnDisable.
void XrController::start() {
  this_->started = true;
  this_->lastRealityMicros = 0;
  this_->updateNumber = 0;
  this_->currentRealityUpdateNumber = -1;
  this_->currentSurfacesUpdateNumber = -1;
  configureXR();
  /*
  if (EnableRemote()) {
    editorBridge.Start();
  }
  yield return StartCoroutine("CallPluginAtEndOfFrames");
  */
}

void XrController::update() {
  if (!this_->explicitlyPaused) {
    this_->runIfPaused();
  }

  this_->updateNumber++;

  /*
  if (EnableRemote()) {
    bridge.SetEditorAppInfo(editorBridge.EditorAppInfo());

    bool firstConnect = false;
    if (!remoteConnected) {
      remoteConnected = bridge.IsRemoteConnected();
      firstConnect = remoteConnected;
    }
    if (remoteConnected) {
      auto remoteData = bridge.GetXRRemote();
      if (firstConnect) {
        editorBridge.SetPlayerAspect(remoteData);
        xrEnvironment = XRNativeBridge.GetXREnvironment();
      }
      editorBridge.SendDeviceInfo(remoteData);
      editorBridge.Update();

      // Send camera aspect info to editor on every frame, in case the preview size changes.
      ConfigureXR();
    } else {
      editorBridge.CheckADB();
    }
  }
  */

  auto r = this_->currentReality();
  if (this_->lastRealityMicros >= r.getEventId().getEventTimeMicros()) {
    return;
  }
  this_->lastRealityMicros = r.getEventId().getEventTimeMicros();
}

/*
void OnGUI() {
  if (EnableRemote() && !remoteConnected) {
    editorBridge.OnGUI();
  }
}
*/

void XrController::onApplicationPause(bool isPaused) {
  this_->explicitlyPaused = isPaused;
  if (!isPaused && this_->started) {
    this_->runIfPaused();
    return;
  }

  if (!this_->running) {
    return;
  }

  this_->running = false;
  this_->bridge.pause();
}

void XrController::onDisable() {
  if (this_->running) {
    onApplicationPause(true);
  }
}

void XrController::onDestroy() { this_->bridge.destroy(); }

void XrController::onApplicationQuit() { this_->bridge.destroy(); }

void XrController::renderFrameForDisplay() { this_->bridge.renderFrameForDisplay(); }

xr::Surface::Type XrControllerPrivateData::toSurfaceType(c8::Surface::SurfaceType surfaceType) {
  switch (surfaceType) {
    case c8::Surface::SurfaceType::HORIZONTAL_PLANE:
      return xr::Surface::Type::HORIZONTAL_PLANE;
    case c8::Surface::SurfaceType::VERTICAL_PLANE:
      return xr::Surface::Type::VERTICAL_PLANE;
    default:
      return xr::Surface::Type::UNSPECIFIED;
  }
}

void XrControllerPrivateData::runIfPaused() {
  if (running) {
    return;
  }
  running = true;
  bridge.resume();
}

TreeMap<int64_t, xr::Surface> XrControllerPrivateData::surfaceMap() {
  if (currentSurfacesUpdateNumber < updateNumber) {
    currentSurfacesUpdateNumber = updateNumber;
    updateSurfacesFromXRResponse();
  }
  return currentSurfaces;
}

void XrControllerPrivateData::updateSurfacesFromXRResponse() {
  auto r = currentReality();

  auto surfaceSet = r.getXRResponse().getSurfaces().getSet();
  auto surfaces = surfaceSet.getSurfaces();
  auto faces = surfaceSet.getFaces();
  auto vertexList = surfaceSet.getVertices();
  auto textureCoordsList = surfaceSet.getTextureCoords();
  // Boundary vertices are available but not used right now

  TreeSet<int64_t> surfacesToRemove;
  for (auto el : currentSurfaces) {
    surfacesToRemove.insert(el.first);
  }

  for (auto surface : surfaces) {
    long id = surface.getId().getEventTimeMicros();
    surfacesToRemove.erase(id);

    auto quat = surface.getNormal().getRotation();

    // Extract basic info about this mesh.
    int beginFaceIndex = surface.getFacesBeginIndex();
    int endFaceIndex = surface.getFacesEndIndex();
    int beginVerticesIndex = surface.getVerticesBeginIndex();
    int endVerticesIndex = surface.getVerticesEndIndex();

    // Support texture coords when the device has it (e.g. ARKit >1.5)
    int beginTextureCoordsIndex = 0;
    bool hasTextureCoords = false;
    if (surface.getTextureCoordsEndIndex() > 0) {
      hasTextureCoords = true;
      beginTextureCoordsIndex = surface.getTextureCoordsBeginIndex();
    }

    auto surfaceType = toSurfaceType(surface.getSurfaceType());
    xr::Quaternion surfaceRotation(quat.getX(), quat.getY(), quat.getZ(), quat.getW());

    // Find surface in the map or add it if not present.
    auto surfaceIterator = currentSurfaces.find(id);
    if (surfaceIterator == currentSurfaces.end()) {
      currentSurfaces[id] = xr::Surface();
      surfaceIterator = currentSurfaces.find(id);
    }

    auto &s = surfaceIterator->second;
    auto &mesh = s.mesh;

    // Update base surface info.
    s.id = id;
    s.type = surfaceType;
    s.rotation = surfaceRotation;

    // Build the vertex and normal arrays.
    int nVertices = endVerticesIndex - beginVerticesIndex;
    mesh.vertices.resize(nVertices);
    mesh.normals.resize(nVertices);
    mesh.uvs.resize(nVertices);

    for (int j = 0; j < nVertices; ++j) {
      int vertexIndex = beginVerticesIndex + j;
      mesh.vertices[j] = xr::Vector3(
        vertexList[vertexIndex].getX(),
        vertexList[vertexIndex].getY(),
        vertexList[vertexIndex].getZ());
      mesh.normals[j] = xr::Vector3(0.0f, 1.0f, 0.0f);

      float u = mesh.vertices[j].x;
      float v = mesh.vertices[j].z;
      if (hasTextureCoords) {
        int textureIndex = beginTextureCoordsIndex + j;
        u = textureCoordsList[textureIndex].getU();
        v = textureCoordsList[textureIndex].getV();
      }
      mesh.uvs[j] = xr::Vector2(u, v);
    }

    // We can just directly copy over the triangles (they are stored in consecutive sets of three
    // vertex indices) as long as we offset the vertex indices.
    int nFaces = endFaceIndex - beginFaceIndex;
    mesh.triangles.resize(nFaces * 3);
    for (int j = 0; j < nFaces; ++j) {
      int v0 = faces[beginFaceIndex].getV0() - beginVerticesIndex;
      int v1 = faces[j + beginFaceIndex].getV1() - beginVerticesIndex;
      int v2 = faces[j + beginFaceIndex].getV2() - beginVerticesIndex;
      mesh.triangles[3 * j] = v0;
      mesh.triangles[3 * j + 1] = v1;
      mesh.triangles[3 * j + 2] = v2;
    }
  }

  // Remove surfaces we no longer receive from the map
  for (int64_t surfaceId : surfacesToRemove) {
    currentSurfaces.erase(surfaceId);
  }
}

/*
private bool ShouldIssuePluginEvent() {
  // Check that we have an RGBA texture and don't manage an RGBA texture.
  if (realityRGBATexture != null
    && xrEnvironment.getRealityImage().getRgbaTexture().getPtr() == 0) {
    return true;
  }
  // Check that we have Y, UV textures and don't manage Y, UV textures.
  if (realityYTexture != null
    && realityUVTexture != null
    && xrEnvironment.getRealityImage().getYTexture().getPtr() == 0
    && xrEnvironment.getRealityImage().getUvTexture().getPtr() == 0) {
    return true;
  }
  return false;
}

private IEnumerator CallPluginAtEndOfFrames() {
  IntPtr renderEventFunc = bridge.GetRenderEventFunc();
  while (renderEventFunc != IntPtr.Zero) {
    // Wait until all frame rendering is done.
    yield return new WaitForEndOfFrame();


    if (ShouldIssuePluginEvent()) {
      // Issue a plugin event such that it is called from the Unity render thread.
      GL.IssuePluginEvent(renderEventFunc, 1); // eventID
      }
    }
  }
*/

int XrController::renderingSystem() { return RENDERING_SYSTEM_OPENGL; }

/*
private bool EnableRemote() {
  return bridge.IsStreamingSupported();
}
*/

void XrController::setEngineMode() {
  XREngineConfiguration::SpecialExecutionMode engineMode =
    XREngineConfiguration::SpecialExecutionMode::NORMAL;
  // if (remoteOnly) {
  //  engineMode = XREngineConfiguration.SpecialExecutionMode.REMOTE_ONLY;
  //}

  if (this_->disableNativeAr) {
    engineMode = XREngineConfiguration::SpecialExecutionMode::DISABLE_NATIVE_AR_ENGINE;
  }

  MutableRootMessage<XRConfiguration> config;
  config.builder().getEngineConfiguration().setMode(engineMode);
  this_->bridge.configure(config);
  this_->xrEnvironment = this_->bridge.xrEnvironment();

  if (this_->cam != xr::Camera::NO_CAMERA()) {
    updateCameraProjectionMatrix(this_->cam, this_->origin, this_->facing, this_->scale);
  }
}

#endif  // ANDROID
