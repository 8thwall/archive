// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Objective-C implementation of iOS Camera Capture.

#include "reality/app/sensors/arkit/ios-arkit-sensor.h"

#import <ARKit/ARKit.h>
#import <CoreVideo/CoreVideo.h>

#include "c8/c8-log.h"
#include "c8/io/capnp-messages.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-extern.h"
#include "c8/protolog/xr-requests.h"
#include "c8/release-config.h"
#include "reality/app/sensors/arkit/ios-arkit-image-callback.h"
#include "reality/app/xr/ios/c8-helpers.h"
#include "reality/engine/api/base/image-types.capnp.h"

using namespace c8;

namespace {

// As per ARKit Performance Considerations: "Image detection accuracy and performance are reduced
//   with larger numbers of detection images. For best results, use no more than around 25 image
//   in this set."
// https://developer.apple.com/documentation/arkit/arworldtrackingconfiguration/2941063-detectionimages?language=objc#2972101
static constexpr uint32_t MAX_TRACKED_IMAGES = 25;

void setPosition32fList(
  capnp::List<c8::SurfaceVertex>::Builder &output, const vector_float3 *input, int count) {
  for (int i = 0; i < count; ++i) {
    auto p = output[i];
    auto p_i = input[i];
    p.setX(p_i[0]);
    p.setY(p_i[1]);
    p.setZ(p_i[2]);
  }
}

void setTextureCoordList(
  capnp::List<c8::SurfaceTextureCoord>::Builder &output, const vector_float2 *input, int count) {
  for (int i = 0; i < count; ++i) {
    auto p = output[i];
    auto p_i = input[i];
    p.setU(p_i[0]);
    p.setV(p_i[1]);
  }
}

// https://developer.apple.com/documentation/arkit/arplanegeometry/2941051-triangleindices?language=objc
// the number of values in input is 3x the count
void setTriangleIndicesList(
  capnp::List<c8::SurfaceFace>::Builder &output, const int16_t *input, int count) {
  for (int i = 0; i < count; ++i) {
    auto p = output[i];
    p.setV0(input[i * 3 + 0]);
    p.setV1(input[i * 3 + 1]);
    p.setV2(input[i * 3 + 2]);
  }
}

void setImageAnchor(c8::ARKitImageAnchor::Builder &a, const ARImageAnchor *image) {
  float x, y, z, qw, qx, qy, qz;
  a.setUuidHash([image.identifier hash]);
  getCameraPose(image.transform, &qw, &qx, &qy, &qz, &x, &y, &z);
  auto anchorPose = a.getAnchorPose();
  setPosition32f(x, y, z, anchorPose.getTranslation());
  setQuaternion32f(qw, qx, qy, qz, anchorPose.getRotation());
  String name = image.referenceImage.name.UTF8String;
  a.setName(name);
  a.setPhysicalSizeWidth(image.referenceImage.physicalSize.width);
  a.setPhysicalSizeHeight(image.referenceImage.physicalSize.height);
  a.setTrackingStatus(image.isTracked
    ? c8::ARKitImageAnchor::TrackingStatus::FULL_TRACKING
    : c8::ARKitImageAnchor::TrackingStatus::LAST_KNOWN_POSE);
}

void setPlaneAnchor(c8::ARKitPlaneAnchor::Builder &a, const ARPlaneAnchor *plane) {
  float x, y, z, qw, qx, qy, qz;
  a.setUuidHash([plane.identifier hash]);
  getCameraPose(plane.transform, &qw, &qx, &qy, &qz, &x, &y, &z);
  setPosition32f(x, y, z, a.getAnchorPose().getTranslation());
  setQuaternion32f(qw, qx, qy, qz, a.getAnchorPose().getRotation());
  setPosition32f(plane.center[0], plane.center[1], plane.center[2], a.getCenter());
  setPosition32f(plane.extent[0], plane.extent[1], plane.extent[2], a.getExtent());

  a.setAlignment(
    plane.alignment == ARPlaneAnchorAlignmentVertical
      ? ARKitPlaneAnchor::ARKitPlaneAnchorAlignment::VERTICAL
      : ARKitPlaneAnchor::ARKitPlaneAnchorAlignment::HORIZONTAL);

  if ([plane respondsToSelector:@selector(geometry)]) {
    auto arkitGeom = plane.geometry;
    auto geom = a.getGeometry();
    auto geomVertices = geom.initVertices((unsigned int)arkitGeom.vertexCount);
    auto geomTextureCoordinates =
      geom.initTextureCoordinates((unsigned int)arkitGeom.textureCoordinateCount);
    auto geomTriangleIndices = geom.initTriangleIndices((unsigned int)arkitGeom.triangleCount);
    auto geomBoundaryVertices =
      geom.initBoundaryVertices((unsigned int)arkitGeom.boundaryVertexCount);

    setPosition32fList(geomVertices, arkitGeom.vertices, (int)arkitGeom.vertexCount);
    setTextureCoordList(
      geomTextureCoordinates, arkitGeom.textureCoordinates, (int)arkitGeom.textureCoordinateCount);
    setTriangleIndicesList(
      geomTriangleIndices, arkitGeom.triangleIndices, (int)arkitGeom.triangleCount);
    setPosition32fList(
      geomBoundaryVertices, arkitGeom.boundaryVertices, (int)arkitGeom.boundaryVertexCount);
  }
}

void setHitTestResultData(c8_ARKitSensorData &d, ARFrame *frame) {
  auto hitResultTypes = ARHitTestResultTypeFeaturePoint
    | ARHitTestResultTypeEstimatedHorizontalPlane | ARHitTestResultTypeEstimatedVerticalPlane
    | ARHitTestResultTypeExistingPlane | ARHitTestResultTypeExistingPlaneUsingExtent
    | ARHitTestResultTypeExistingPlaneUsingGeometry;
  auto hitTestResults = [frame hitTest:CGPointMake(0.5, 0.5) types:hitResultTypes];

  auto resultsBuilder = d.hitTestResult.builder().initResults((int)hitTestResults.count);
  int index = 0;
  for (ARHitTestResult *result in hitTestResults) {
    auto hitResult = resultsBuilder[index];
    switch (result.type) {
      case ARHitTestResultTypeFeaturePoint:
        hitResult.setType(XRHitResult::Type::FEATURE_POINT);
        break;
      case ARHitTestResultTypeEstimatedHorizontalPlane:
        hitResult.setType(XRHitResult::Type::ESTIMATED_HORIZONTAL_PLANE);
        break;
      case ARHitTestResultTypeEstimatedVerticalPlane:
        hitResult.setType(XRHitResult::Type::ESTIMATED_VERTICAL_PLANE);
        break;
      case ARHitTestResultTypeExistingPlane:
      case ARHitTestResultTypeExistingPlaneUsingExtent:
      case ARHitTestResultTypeExistingPlaneUsingGeometry:
        hitResult.setType(XRHitResult::Type::EXISTING_PLANE);
        break;
      default:
        hitResult.setType(XRHitResult::Type::UNSPECIFIED);
        break;
    }

    if ([result.anchor isKindOfClass:[ARPlaneAnchor class]]) {
      auto anchorBuilder = hitResult.getARKitAnchor();
      setPlaneAnchor(anchorBuilder, (ARPlaneAnchor *)result.anchor);
    }
    hitResult.setCameraDistance(result.distance);

    float x, y, z, qw, qx, qy, qz;
    getCameraPose(result.worldTransform, &qw, &qx, &qy, &qz, &x, &y, &z);

    hitResult.getHitTransform().getPosition().setX(x);
    hitResult.getHitTransform().getPosition().setY(y);
    hitResult.getHitTransform().getPosition().setZ(z);
    hitResult.getHitTransform().getRotation().setW(qw);
    hitResult.getHitTransform().getRotation().setX(qx);
    hitResult.getHitTransform().getRotation().setY(qy);
    hitResult.getHitTransform().getRotation().setZ(qz);

    ++index;
  }
}
}  // namespace

@interface ARKitSensorImpl : NSObject<ARSessionDelegate>

@property(nonatomic, strong) ARSession *session;
@property(nonatomic, strong) NSObject<ARSessionDelegate> *delegateProxy;
@property(nonatomic, strong) ARWorldTrackingConfiguration *configuration;
@property(nonatomic) bool started;
@property(nonatomic) bool configured;

@property(nonatomic) c8_ARKitImageCallback *imageCallback;

// ARSessionDelegate methods.
- (void)session:(ARSession *)session didFailWithError:(NSError *)error;
- (void)sessionWasInterrupted:(ARSession *)session;
- (void)sessionInterruptionEnded:(ARSession *)session;
- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame;

- (void)resume;
- (void)pause;

@end

// This interface wraps our sensor's ARSessionDelegate and a custom delegate.
@interface ARSessionDelegateImpl : NSObject<ARSessionDelegate>

@property(nonatomic, strong) ARKitSensorImpl *sensor;
@property(nonatomic, strong) NSObject<ARSessionDelegate> *customDelegate;

@end

@implementation ARSessionDelegateImpl

- (id)initWithSensorAndDelegate:(ARKitSensorImpl *)sensor
                               :(NSObject<ARSessionDelegate> *)customDelegate {
  if (!(self = [super init])) {
    return nil;
  }
  self.sensor = sensor;
  self.customDelegate = customDelegate;
  return self;
}

- (BOOL)respondsToSelector:(SEL)aSelector {
  // This delegate responds to any method defined in ARKitSensorImpl or custom delegate.
  if ([self.sensor respondsToSelector:aSelector]) {
    return YES;
  }
  if (self.customDelegate && [self.customDelegate respondsToSelector:aSelector]) {
    return YES;
  }
  return NO;
}

- (NSMethodSignature *)methodSignatureForSelector:(SEL)selector {
  // Return the first available method signature for a supported selector.
  NSMethodSignature *signature = [self.sensor methodSignatureForSelector:selector];
  if (!signature && self.customDelegate) {
    signature = [self.customDelegate methodSignatureForSelector:selector];
  }
  return signature;
}

- (void)forwardInvocation:(NSInvocation *)invocation {
  SEL aSelector = [invocation selector];
  // First, invoke the ARKitSensorImpl method if it is defined.
  if ([self.sensor respondsToSelector:aSelector]) {
    [invocation invokeWithTarget:self.sensor];
  }
  // Invoke the custom delegate method if it is defined.
  if (self.customDelegate && [self.customDelegate respondsToSelector:aSelector]) {
    [invocation invokeWithTarget:self.customDelegate];
  }
}

@end

@implementation ARKitSensorImpl

- (id)init:(void *)sessionPtr :(void *)configPtr :(void *)delegatePtr {
  if (!(self = [super init])) {
    return nil;
  }
  self.started = false;
  self.configured = false;
  self.imageCallback = nil;

  if (sessionPtr == nullptr) {
    C8Log("[ios-arkit-sensor] %s", "create new session");
    // Create new ARSession.
    self.session = [ARSession new];
  } else {
    C8Log("[ios-arkit-sensor] %s", "create with existing session");
    // Use existing ARSession.
    self.session = (__bridge ARSession *)sessionPtr;
  }
  if (configPtr) {
    self.configuration = (__bridge ARWorldTrackingConfiguration *)configPtr;
    NSLog(@"[ios-arkit-sensor] Custom session config %@", self.configuration);
    self.configured = true;
  }
  if (delegatePtr == nullptr) {
    // Sensor class can be a delegate by itself.
    self.session.delegate = self;
  } else {
    // Use a proxy that combines our sensor delegate and the custom one.
    auto customDelegate = (__bridge NSObject<ARSessionDelegate> *)delegatePtr;
    NSLog(@"[ios-arkit-sensor] Custom ARSession delegate %@", customDelegate);
    self.delegateProxy =
      [[ARSessionDelegateImpl alloc] initWithSensorAndDelegate:self:customDelegate];
    self.session.delegate = self.delegateProxy;
  }
  return self;
}

// Default configuration for the sensor
- (void)configure {
  if (self.configured) {
    return;
  }

  // TODO(nb): only set these when configured via api.
  self.configuration = [ARWorldTrackingConfiguration new];
  self.configuration.lightEstimationEnabled = true;
  self.configuration.planeDetection = ARPlaneDetectionHorizontal | ARPlaneDetectionVertical;
  if ([self.configuration respondsToSelector:@selector(isAutoFocusEnabled)]) {
    self.configuration.autoFocusEnabled = false;
  }
  self.configured = true;

  if (self.started) {
    [self runSession];  // Re-run to pick up the new config
  }
}

// Configure the ARKit via the API.
- (void)configureViaXRConfig:(c8::XRConfiguration::Reader)config {
  if (!self.configured) {
    self.configuration = [ARWorldTrackingConfiguration new];
  }

  if (config.hasMask()) {
    auto maskConfig = config.getMask();
    self.configuration.lightEstimationEnabled = maskConfig.getLighting();

    NSUInteger planeDetection = ARPlaneDetectionNone;
    if (maskConfig.getSurfaces()) {
      planeDetection |= ARPlaneDetectionHorizontal;
    }
    if (maskConfig.getVerticalSurfaces()) {
      planeDetection |= ARPlaneDetectionVertical;
    }

    self.configuration.planeDetection = planeDetection;

    bool enableCameraAutofocus = config.getCameraConfiguration().getAutofocus();
    C8Log(
      "[ios-arkit-sensor] %s %s", "Autofocus is set to", enableCameraAutofocus ? "true" : "false");
    if ([self.configuration respondsToSelector:@selector(isAutoFocusEnabled)]) {
      self.configuration.autoFocusEnabled = enableCameraAutofocus;
    } else {
      C8Log(
        "[ios-arkit-sensor] %s",
        "Configuration does not respond to isAutoFocusEnabled. Will not change.");
    }
  }

  // Enabling depth mapping
  if (config.getCameraConfiguration().getDepthMapping()) {
    C8Log("[ios-arkit-sensor] %s", "Configuration sets scene depth");

    if ([ARWorldTrackingConfiguration supportsFrameSemantics:ARFrameSemanticSmoothedSceneDepth]) {
      C8Log("[ios-arkit-sensor] %s", "Configuration supports scene depth");
      self.configuration.frameSemantics |= ARFrameSemanticSmoothedSceneDepth;
    } else {
      C8Log("[ios-arkit-sensor] %s", "Configuration doesn't support scene depth");
    }
  } else {
    C8Log("[ios-arkit-sensor] %s", "Configuration didn't set scene depth");
  }



  if (
    config.hasImageDetection() &&
    [self.configuration respondsToSelector:@selector(detectionImages)]) {
    auto referenceImages = config.getImageDetection().getImageDetectionSet();
    int numReferenceImages = referenceImages.size();
    C8Log("[ios-arkit-sensor] Configuring with %d detection images", numReferenceImages);
    // Create CVPixelBuffer list and pass to ARKit
    // https://developer.apple.com/documentation/corevideo/1456979-cvpixelbuffercreatewithbytes?language=objc
    NSMutableArray<ARReferenceImage *> *detectionImages = [NSMutableArray new];
    for (int i = 0; i < numReferenceImages; ++i) {
      c8::XRDetectionImage::Reader referenceImage = referenceImages[i];
      c8::CompressedImageData::Reader image = referenceImage.getImage();
      C8Log(
        "[ios-arkit-sensor] Configuring detection image of width %d height %d and encoding %d",
        image.getWidth(),
        image.getHeight(),
        image.getEncoding());

      void *imageData = (void *)image.getData().begin();
      std::unique_ptr<uint8_t[]> tempData;
      // If not specified, I assume the user knows to do RGB24
      if (image.getEncoding() == c8::CompressedImageData::Encoding::RGB24_INVERTED_Y) {
        int width = image.getWidth();
        int height = image.getHeight();
        int stride = width * 3;
        tempData.reset(new uint8_t[width * height * 3]);
        ConstThreeChannelPixels src(
          height, width, stride, (const uint8_t *)image.getData().begin());
        ThreeChannelPixels dest(height, width, stride, tempData.get());
        flipVertical(src, &dest);
        C8Log("[ios-arkit-sensor] %s", "Flipped the image");
        imageData = (void *)tempData.get();
      }

      CVPixelBufferRef pixBuffer = NULL;
      CVReturn returnCode = CVPixelBufferCreateWithBytes(
        kCFAllocatorDefault,  // default allocator
        image.getWidth(),
        image.getHeight(),
        // TODO(dat): Make sure we are passing down with this format
        // Not all formats are supported
        // https://developer.apple.com/library/content/qa/qa1501/_index.html
        kCVPixelFormatType_24RGB,
        imageData,
        3 * image.getWidth(),
        NULL,  // release callback
        NULL,  // releaseRefCon
        NULL,  // optional pixel attributes
        &pixBuffer);

      C8Log(
        "[ios-arkit-sensor] PixBuffer is %s null. Return code was %d",
        pixBuffer == NULL ? "" : "NOT",
        returnCode);

      ARReferenceImage *arkitReferenceImage =
        [[ARReferenceImage alloc] initWithPixelBuffer:pixBuffer
                                          orientation:kCGImagePropertyOrientationUp
                                        physicalWidth:referenceImage.getRealWidthInMeter()];
      arkitReferenceImage.name = [NSString stringWithUTF8String:referenceImage.getName().cStr()];
      [detectionImages addObject:arkitReferenceImage];
    }
    self.configuration.detectionImages = [NSSet setWithArray:detectionImages];
    if ([self.configuration respondsToSelector:@selector(maximumNumberOfTrackedImages)]) {
      self.configuration.maximumNumberOfTrackedImages =
          numReferenceImages <= MAX_TRACKED_IMAGES ? numReferenceImages : MAX_TRACKED_IMAGES;
    }
  }

  self.configured = true;
  if (self.started) {
    [self runSession];  // Re-run to pick up the new config
  }
}

- (void)resume {
  C8Log("[ios-arkit-sensor] %s", "resume");
  if (self.started) {
    return;
  }
  if (!self.configured) {
    [self configure];
  }
  C8Log("[ios-arkit-sensor] %s", "Start ARKitSensor Capture");
  self.started = true;
  [self runSession];
}

// NOTE(dat): ARKit will transition to a new config if you change your config
//            There is an option to wipe the current state as well.
//            see
//            https://developer.apple.com/documentation/arkit/arsession/2875735-runwithconfiguration
- (void)runSession {
  // We must set the ARKit configuration on our session using reflection
  // since we cannot determine which configuration class we're using at compile time.
  SEL selector = NSSelectorFromString(@"runWithConfiguration:");
  IMP imp = [self.session methodForSelector:selector];
  void (*runWithConfigurationFunc)(id, SEL, NSObject *) = (void (*)(id, SEL, NSObject *))imp;
  runWithConfigurationFunc(self.session, selector, self.configuration);
}

- (void)pause {
  C8Log("[ios-arkit-sensor] %s", "pause");
  if (!self.started) {
    return;
  }
  C8Log("[ios-arkit-sensor] %s", "Stop ARKitSensor Capture");
  self.started = false;
  [self.session pause];
}

- (void)session:(ARSession *)session didFailWithError:(NSError *)error {
  // Present an error message to the user
}

- (void)sessionWasInterrupted:(ARSession *)session {
  // Inform the user that the session has been interrupted, for example, by presenting an overlay
}

- (void)sessionInterruptionEnded:(ARSession *)session {
  // Reset tracking and/or remove existing anchors if consistent tracking is required
}

- (void)session:(ARSession *)session didUpdateFrame:(ARFrame *)frame {
  auto intrinsics = frame.camera.intrinsics;

  c8_ARKitSensorData d;

  {
    c8_PixelPinholeCameraModel c;
    c.pixelsWidth = frame.camera.imageResolution.width;
    c.pixelsHeight = frame.camera.imageResolution.height;
    c.centerPointX = intrinsics.columns[2].x;           // (0, 2)
    c.centerPointY = intrinsics.columns[2].y;           // (1, 2)
    c.focalLengthHorizontal = intrinsics.columns[0].x;  // (0, 0)
    c.focalLengthVertical = intrinsics.columns[1].y;    // (1, 1)

    // setPixelPinholeCameraModelRotateToPortrait does non-trivial work.
    setPixelPinholeCameraModelRotateToPortrait(c, d.intrinsicCameraModel.builder());
  }

  {
    float x, y, z, qw, qx, qy, qz;
    getCameraPose(frame.camera.transform, &qw, &qx, &qy, &qz, &x, &y, &z);
    auto p = d.requestARKit.builder().getPose();
    setPosition32f(x, y, z, p.getTranslation());
    setQuaternion32f(qw, qx, qy, qz, p.getRotation());
  }

  {
    int numPlaneAnchors = 0;
    int numImageAnchors = 0;
    for (ARAnchor *anchor in frame.anchors) {
      if ([anchor isKindOfClass:[ARPlaneAnchor class]]) {
        ++numPlaneAnchors;
      } else if ([anchor isKindOfClass:[ARImageAnchor class]]) {
        ++numImageAnchors;
      } else {
        C8Log(
          "[ios-arkit-sensor] %s", "!!!Got ARKit anchor that's neither a plane nor an image!!!");
        continue;
      }
    }

    auto anchors = d.requestARKit.builder().initAnchors(numPlaneAnchors);
    int anchorIdx = 0;
    auto imageAnchors = d.requestARKit.builder().initImageAnchors(numImageAnchors);
    int imageAnchorIdx = 0;
    for (ARAnchor *anchor in frame.anchors) {
      if ([anchor isKindOfClass:[ARPlaneAnchor class]]) {
        auto a = anchors[anchorIdx];
        ++anchorIdx;

        ARPlaneAnchor *plane = (ARPlaneAnchor *)anchor;
        setPlaneAnchor(a, plane);
      } else if ([anchor isKindOfClass:[ARImageAnchor class]]) {
        auto a = imageAnchors[imageAnchorIdx];
        ++imageAnchorIdx;

        ARImageAnchor *imageAnchor = (ARImageAnchor *)anchor;
        setImageAnchor(a, imageAnchor);
      } else {
        continue;
      }
    }
  }

  {
    auto lighting = d.requestARKit.builder().getLightEstimate();
    lighting.setAmbientIntensity(frame.lightEstimate.ambientIntensity);
    lighting.setAmbientColorTemperature(frame.lightEstimate.ambientColorTemperature);
  }

  {
    auto t = d.requestARKit.builder().getTrackingState();
    switch (frame.camera.trackingState) {
      case ARTrackingStateNotAvailable:
        t.setStatus(ARKitTrackingState::ARKitTrackingStatus::NOT_AVAILABLE);
        break;
      case ARTrackingStateLimited:
        t.setStatus(ARKitTrackingState::ARKitTrackingStatus::LIMITED);
        break;
      case ARTrackingStateNormal:
        t.setStatus(ARKitTrackingState::ARKitTrackingStatus::NORMAL);
        break;
      default:
        // Nothing to do.
        break;
    }
    switch (frame.camera.trackingStateReason) {
      case ARTrackingStateReasonNone:
        // Nothing to do.
        break;
      case ARTrackingStateReasonInitializing:
        t.setReason(ARKitTrackingState::ARKitTrackingStatusReason::INITIALIZING);
        break;
      case ARTrackingStateReasonRelocalizing:
        t.setReason(ARKitTrackingState::ARKitTrackingStatusReason::RELOCALIZING);
        break;
      case ARTrackingStateReasonExcessiveMotion:
        t.setReason(ARKitTrackingState::ARKitTrackingStatusReason::EXCESSIVE_MOTION);
        break;
      case ARTrackingStateReasonInsufficientFeatures:
        t.setReason(ARKitTrackingState::ARKitTrackingStatusReason::INSUFFICIENT_FEATURES);
        break;
      default:
        // Nothing to do.
        break;
    }
  }

  // TODO(nb): Get surface data from anchors.
  // https://developer.apple.com/documentation/arkit/arframe?language=objc

  d.timestampNanos = static_cast<int64_t>(frame.timestamp * 1e9);

  if (releaseConfigIsRequestDebugDataEnabled()) {
    setHitTestResultData(d, frame);
  }

  auto pointCloud = frame.rawFeaturePoints;
  auto requestCloudBuilder = d.requestARKit.builder().initPointCloud((int)pointCloud.count);
  for (int i = 0; i < pointCloud.count; ++i) {
    auto point = pointCloud.points[i];
    auto requestPointBuilder = requestCloudBuilder[i];
    requestPointBuilder.setId(pointCloud.identifiers[i]);
    requestPointBuilder.getPosition().setX(point[0]);
    requestPointBuilder.getPosition().setY(point[1]);
    requestPointBuilder.getPosition().setZ(point[2]);
  }

  auto pixels = [frame capturedImage];
  // Nil by default, retrieves depthmap values as float32.
  auto depthPixels = [[frame smoothedSceneDepth] depthMap];
  // Prints out an error if depthPixels is nil, but doesn't crash the app.
  CVPixelBufferLockBaseAddress(pixels, kCVPixelBufferLock_ReadOnly);
  CVPixelBufferLockBaseAddress(depthPixels, kCVPixelBufferLock_ReadOnly);
  d.pixels = pixels;
  d.depthMap = depthPixels;
  self.imageCallback->processFrame(d);
  CVPixelBufferUnlockBaseAddress(depthPixels, kCVPixelBufferLock_ReadOnly);
  CVPixelBufferUnlockBaseAddress(pixels, kCVPixelBufferLock_ReadOnly);
}

@end

extern "C" c8_ARKitSensor *c8ARKitSensor_create(void* session, void* config, void* delegate) {
  // Take manual ownership of ObjC class an return as a C pointer.
  return (__bridge_retained c8_ARKitSensor *)[[ARKitSensorImpl alloc] init:session:config:delegate];
}

void c8ARKitSensor_setImageCallback(c8_ARKitSensor *arkit, c8_ARKitImageCallback *callback) {
  ARKitSensorImpl *impl = (__bridge ARKitSensorImpl *)arkit;
  [impl setImageCallback:callback];
}

extern "C" void c8ARKitSensor_destroy(c8_ARKitSensor *arkit) {
  C8Log("[ios-arkit-sensor] %s", "destroy");
  CFRelease(arkit);
}

extern "C" void c8ARKitSensor_resume(c8_ARKitSensor *arkit) {
  ARKitSensorImpl *impl = (__bridge ARKitSensorImpl *)arkit;
  [impl resume];
}

extern "C" void c8ARKitSensor_pause(c8_ARKitSensor *arkit) {
  ARKitSensorImpl *impl = (__bridge ARKitSensorImpl *)arkit;
  [impl pause];
}

extern "C" void c8ARKitSensor_configure(
  struct c8_ARKitSensor *arkit, c8::XRConfiguration::Reader config) {
  ARKitSensorImpl *impl = (__bridge ARKitSensorImpl *)arkit;
  [impl configureViaXRConfig:config];
}
