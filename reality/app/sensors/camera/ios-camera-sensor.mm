// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Objective-C implementation of iOS Camera Capture.

#include "reality/app/sensors/camera/ios-camera-sensor.h"

#import <AVFoundation/AVFoundation.h>
#import <CoreVideo/CoreVideo.h>
#import <Metal/Metal.h>

#include "c8/c8-log.h"
#include "reality/app/sensors/camera/ios-camera-image-callback.h"

namespace {
  static constexpr bool DEFAULT_AUTOFOCUS_CONFIG = false;
}

using namespace c8;

@interface CameraSensorImpl : NSObject<AVCaptureVideoDataOutputSampleBufferDelegate>

@property(nonatomic, strong) AVCaptureSession *captureSession;
@property(nonatomic, strong) AVCaptureVideoDataOutput *videoOutput;
@property(nonatomic) bool started;
@property(nonatomic) bool configured;
@property(nonatomic) bool enableCameraAutofocus;
@property(nonatomic) c8_CameraImageCallback *imageCallback;
@property(nonatomic) AVCaptureDevice *backCamera;

- (void)captureOutput:(AVCaptureOutput *)captureOutput
  didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer
         fromConnection:(AVCaptureConnection *)connection;

- (void)resume;
- (void)pause;

@end

@implementation CameraSensorImpl

// Return the number of pixels in an AVCaptureDeviceFormat.
static int numPixels(AVCaptureDeviceFormat *format) {
  CMVideoDimensions dimensions = captureFormatDimensons(format);
  return dimensions.height * dimensions.width;
}

// Return the number of pixels in an AVCaptureDeviceFormat.
static CMVideoDimensions captureFormatDimensons(AVCaptureDeviceFormat *format) {
  return CMVideoFormatDescriptionGetDimensions(format.formatDescription);
}

- (id)init {
  if (!(self = [super init])) {
    return nil;
  }
  C8Log("[ios-camera-sensor] %s", "create");
  self.started = false;
  self.configured = false;
  self.enableCameraAutofocus = DEFAULT_AUTOFOCUS_CONFIG;

  self.captureSession = [[AVCaptureSession alloc] init];

  self.imageCallback = nil;

  return self;
}

- (void)configure:(bool)enableCameraAutofocus {
  if (self.configured) {
    return;
  }

  // Find the first back-facing camera.
  NSArray *devices = [AVCaptureDevice devicesWithMediaType:AVMediaTypeVideo];
  for (AVCaptureDevice *device in devices) {
    if (device.position == AVCaptureDevicePositionBack) {
      self.backCamera = device;
      break;
    }
  }

  [self setCameraAutofocus:enableCameraAutofocus];

  // Acquire an input device for the camera.
  NSError *err;
  AVCaptureDeviceInput *deviceInput =
    [[AVCaptureDeviceInput alloc] initWithDevice:self.backCamera error:&err];
  if (err) {
    @throw [NSException exceptionWithName:@"CameraOpenDeviceException"
                                   reason:[err localizedDescription]
                                 userInfo:nil];
  }

  // Add the input device to the capture session.
  if (![self.captureSession canAddInput:deviceInput]) {
    @throw [NSException exceptionWithName:@"CameraAddDeviceException"
                                   reason:@"Could not add device input"
                                 userInfo:nil];
  }

  // Start with the active capture format.
  AVCaptureDeviceFormat *bestFormat = self.backCamera.activeFormat;
  AVFrameRateRange *bestFrameRateRange;

  for (AVCaptureDeviceFormat *format in self.backCamera.formats) {
    for (AVFrameRateRange *range in format.videoSupportedFrameRateRanges) {

      int frameDurationCompare =
        CMTimeCompare(range.minFrameDuration, bestFrameRateRange.minFrameDuration);

      switch (frameDurationCompare) {
        case 0:
          // Prefer more pixels for equal framerates.
          if (numPixels(format) <= numPixels(bestFormat)) {
            continue;
          }
        // FALLTHROUGH
        case -1:
          // This is an unbinned format with a higher framerate.
          if (!format.videoBinned) {
            bestFormat = format;
            bestFrameRateRange = range;
          }
          break;
        case 1:
        default:
          // Skip formats with lower framerates.
          break;
      }
    }
  }

  // Modify the device to use the best format.
  if ([self.backCamera lockForConfiguration:NULL] == YES) {
    self.backCamera.activeFormat = bestFormat;
    self.backCamera.activeVideoMinFrameDuration = bestFrameRateRange.minFrameDuration;
    self.backCamera.activeVideoMaxFrameDuration =
      bestFrameRateRange.minFrameDuration;  // Ensure both min.
    [self.backCamera unlockForConfiguration];
  } else {
    @throw [NSException exceptionWithName:@"CameraConfigurationLockFailure"
                                   reason:@"Could not lock camera for configuration"
                                 userInfo:nil];
  }

  NSLog(@"Active Format: %@", self.backCamera.activeFormat);

  // Create output.
  self.videoOutput = [AVCaptureVideoDataOutput new];
  NSLog(@"%@", [self.videoOutput availableVideoCVPixelFormatTypes]);
  NSDictionary *newSettings = @{
    (NSString *)kCVPixelBufferPixelFormatTypeKey : @(kCVPixelFormatType_420YpCbCr8BiPlanarFullRange)
  };
  self.videoOutput.videoSettings = newSettings;

  // discard if the data output queue is blocked as we process the still image.
  [self.videoOutput setAlwaysDiscardsLateVideoFrames:YES];

  dispatch_queue_t videoOutputQueue =
    dispatch_queue_create("VideoOutputQueue", DISPATCH_QUEUE_SERIAL);
  [self.videoOutput setSampleBufferDelegate:self queue:videoOutputQueue];

  if (![self.captureSession canAddOutput:self.videoOutput]) {
    @throw [NSException exceptionWithName:@"CameraVideoOutputFailure"
                                   reason:@"Could not create video output"
                                 userInfo:nil];
  }

  [self.captureSession beginConfiguration];
  [self.captureSession setSessionPreset:AVCaptureSessionPreset640x480];
  [self.captureSession addInput:deviceInput];
  [self.captureSession addOutput:self.videoOutput];
  [[self.videoOutput connectionWithMediaType:AVMediaTypeVideo]
    setVideoOrientation:AVCaptureVideoOrientationPortrait];
  [self.captureSession commitConfiguration];

  self.configured = true;
}

- (void)setCameraAutofocus:(bool)enableCameraAutofocus {
  if (!self.backCamera) {
    @throw [NSException exceptionWithName:@"CameraNotFoundException"
                                   reason:@"Could not find back camera"
                                 userInfo:nil];
  }

  // Focus
  NSError *error = nil;
  if ([self.backCamera lockForConfiguration:&error]) {
    if (enableCameraAutofocus && [self.backCamera isFocusModeSupported:AVCaptureFocusModeContinuousAutoFocus]) {
      [self.backCamera setFocusMode:AVCaptureFocusModeContinuousAutoFocus];
    } else if ([self.backCamera isFocusModeSupported:AVCaptureFocusModeAutoFocus]) {
      // Focus once and then lock
      [self.backCamera setFocusMode:AVCaptureFocusModeAutoFocus];
    }
    [self.backCamera unlockForConfiguration];
  } else {
    C8Log("%s", "Could not lock camera configuration");
  }
  self.enableCameraAutofocus = enableCameraAutofocus;
}

- (void)captureOutput:(AVCaptureOutput *)captureOutput
  didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer
         fromConnection:(AVCaptureConnection *)connection {
  if (captureOutput != self.videoOutput) {
    return;
  }

  if (self.imageCallback == nil) {
    return;
  }

  // Call the image callback if set.
  CVPixelBufferRef buf = CMSampleBufferGetImageBuffer(sampleBuffer);
  CMTime timestamp = CMSampleBufferGetPresentationTimeStamp(sampleBuffer);
  double denom = 1e9 / timestamp.timescale;
  c8_IosCameraData d;
  d.timestampNanos = static_cast<int64_t>(timestamp.value * denom);
  d.pixels = &buf;
  CVPixelBufferLockBaseAddress(buf, 0);
  self.imageCallback->processFrame(d);
  CVPixelBufferUnlockBaseAddress(buf, 0);
}

- (void)captureOutput:(AVCaptureOutput *)captureOutput
              didDrop:(CMSampleBufferRef)sampleBuffer
       fromConnection:(AVCaptureConnection *)connection {
  if (captureOutput != self.videoOutput) {
    return;
  }

  C8Log("%s", "Dropped a frame!");
}

- (void)resume {
  C8Log("[ios-camera-sensor] %s", "resume");
  if (self.started) {
    return;
  }
  if (!self.configured) {
    // Default configuring autofocus to false
    [self configure:DEFAULT_AUTOFOCUS_CONFIG];
  }
  C8Log("[ios-camera-sensor] %s", "Start CameraSensor Capture");
  self.started = true;
  [self.captureSession startRunning];
}

- (void)pause {
  C8Log("[ios-camera-sensor] %s", "pause");
  if (!self.started) {
    return;
  }
  C8Log("[ios-camera-sensor] %s", "Stop CameraSensor Capture");
  self.started = false;
  [self.captureSession stopRunning];
}

@end

extern "C" c8_CameraSensor *c8CameraSensor_create() {
  // Take manual ownership of ObjC class an return as a C pointer.
  return (__bridge_retained c8_CameraSensor *)[[CameraSensorImpl alloc] init];
}

void c8CameraSensor_setImageCallback(c8_CameraSensor *camera, c8_CameraImageCallback *callback) {
  CameraSensorImpl *impl = (__bridge CameraSensorImpl *)camera;
  [impl setImageCallback:callback];
}

extern "C" void c8CameraSensor_destroy(c8_CameraSensor *camera) {
  C8Log("[ios-camera-sensor] %s", "destroy");
  CFRelease(camera);
}

extern "C" void c8CameraSensor_configure(struct c8_CameraSensor *camera, bool enableCameraAutofocus) {
  CameraSensorImpl *impl = (__bridge CameraSensorImpl *)camera;
  [impl configure:enableCameraAutofocus];
}

extern "C" void c8CameraSensor_resume(c8_CameraSensor *camera) {
  CameraSensorImpl *impl = (__bridge CameraSensorImpl *)camera;
  [impl resume];
}

extern "C" void c8CameraSensor_pause(c8_CameraSensor *camera) {
  CameraSensorImpl *impl = (__bridge CameraSensorImpl *)camera;
  [impl pause];
}
