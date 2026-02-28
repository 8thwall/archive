// Objective-C implementation of iOS Pose Capture.

#include "reality/app/sensors/pose/ios-pose-sensor.h"

#import <AVFoundation/AVFoundation.h>
#import <CoreMotion/CoreMotion.h>

#include "c8/c8-log.h"

using namespace c8;

// Value of a G in m/s^2.
static const float G_ACCELERATION = 9.81f;

@interface C8PoseSensorImpl : NSObject {
@private
  std::unique_ptr<Vector<XRSensorEvent>> eventQueue;
}

@property(nonatomic, strong) NSOperationQueue *rawSensorQueue;
@property(nonatomic, strong) CMMotionManager *motionManager;
@property(nonatomic) bool started;

@end

@implementation C8PoseSensorImpl

- (id)init {
  if (!(self = [super init])) {
    return nil;
  }
  C8Log("[ios-pose-sensor] %s", "create");

  self.rawSensorQueue = [[NSOperationQueue alloc] init];
  self.motionManager = [[CMMotionManager alloc] init];
  self.started = false;
  self->eventQueue.reset(new Vector<XRSensorEvent>());
  self->eventQueue->reserve(100);

  return self;
}

- (void)resume {
  C8Log("[ios-pose-sensor] %s", "resume");
  if (self.started) {
    return;
  }
  C8Log("[ios-pose-sensor] %s", "Start PoseSensor Capture");
  self.started = true;
  if (self.motionManager.deviceMotionAvailable) {
    C8Log("[ios-pose-sensor] %s", "Device motion available; starting updates.");
    [self.motionManager
      startDeviceMotionUpdatesUsingReferenceFrame:CMAttitudeReferenceFrameXArbitraryZVertical];

    [self.motionManager
      startAccelerometerUpdatesToQueue:self.rawSensorQueue
                           withHandler:^(CMAccelerometerData *data, NSError *error) {
                             [self handleAccelerometerData:data];
                           }];
    [self.motionManager startGyroUpdatesToQueue:self.rawSensorQueue
                                    withHandler:^(CMGyroData *data, NSError *error) {
                                      [self handleGyroData:data];
                                    }];
    [self.motionManager
      startMagnetometerUpdatesToQueue:self.rawSensorQueue
                          withHandler:^(CMMagnetometerData *data, NSError *error) {
                            [self handleMagnetometerData:data];
                          }];
  }
}

- (void)handleAccelerometerData:(CMAccelerometerData *)d {
  @synchronized(self) {
    int64_t t = static_cast<int64_t>(d.timestamp * 1e9);
    // iOS represents acceleration in Gs, android uses m/s^2. Convert this to the android style.
    // Also Android inverts the sign for some reason.
    float x = d.acceleration.x * -9.81;
    float y = d.acceleration.y * -9.81;
    float z = d.acceleration.z * -9.81;
    Vector<XRSensorEvent> *queue = self->eventQueue.get();
    queue->push_back(XRSensorEvent(C8_POSE_SENSOR_ACCELEROMETER, t, x, y, z));
    if (self->eventQueue->size() > 10000) {
      Vector<XRSensorEvent> drained;
      [self releaseEventQueue:&drained];
    }
  }
}

- (void)handleGyroData:(CMGyroData *)d {
  @synchronized(self) {
    int64_t t = static_cast<int64_t>(d.timestamp * 1e9);
    float x = d.rotationRate.x;
    float y = d.rotationRate.y;
    float z = d.rotationRate.z;
    Vector<XRSensorEvent> *queue = self->eventQueue.get();
    queue->push_back(XRSensorEvent(C8_POSE_SENSOR_GYROSCOPE, t, x, y, z));
    if (self->eventQueue->size() > 10000) {
      Vector<XRSensorEvent> drained;
      [self releaseEventQueue:&drained];
    }
  }
}

- (void)handleMagnetometerData:(CMMagnetometerData *)d {
  @synchronized(self) {
    int64_t t = static_cast<int64_t>(d.timestamp * 1e9);
    float x = d.magneticField.x;
    float y = d.magneticField.y;
    float z = d.magneticField.z;
    Vector<XRSensorEvent> *queue = self->eventQueue.get();
    queue->push_back(XRSensorEvent(C8_POSE_SENSOR_MAGNETOMETER, t, x, y, z));
    if (self->eventQueue->size() > 10000) {
      Vector<XRSensorEvent> drained;
      [self releaseEventQueue:&drained];
    }
  }
}

- (void)pause {
  C8Log("[ios-pose-sensor] %s", "pause");
  if (!self.started) {
    return;
  }
  C8Log("[ios-pose-sensor] %s", "Stop PoseSensor Capture");
  self.started = false;
  [self.motionManager stopDeviceMotionUpdates];
}

- (CMQuaternion)attitude {
  CMQuaternion attitude = {0.0, 0.0, 0.0, 1.0};
  if (!self.started) {
    return attitude;
  }
  CMDeviceMotion *motionData = self.motionManager.deviceMotion;
  if (motionData != nil) {
    return motionData.attitude.quaternion;
  }
  return attitude;
}

- (CMAcceleration)acceleration {
  CMAcceleration acceleration = {0.0, 0.0, 0.0};
  if (!self.started) {
    return acceleration;
  }
  CMDeviceMotion *motionData = self.motionManager.deviceMotion;
  if (motionData != nil) {
    return motionData.userAcceleration;
  }
  return acceleration;
}

- (void)releaseEventQueue:(Vector<XRSensorEvent> *)outputQueue {
  @synchronized(self) {
    std::unique_ptr<Vector<XRSensorEvent>> localQueue(new Vector<XRSensorEvent>());
    localQueue->reserve(100);
    self->eventQueue.swap(localQueue);

    outputQueue->clear();
    size_t size = localQueue->size();
    outputQueue->reserve(size + 1);
    for (int i = 0; i < size; ++i) {
      outputQueue->push_back((*localQueue)[i]);
    }

    if (localQueue->size() > size) {
      outputQueue->push_back((*localQueue)[size]);
    }
  }
}

@end

extern "C" c8_PoseSensor *c8PoseSensor_create() {
  // Take manual ownership of ObjC class an return as a C pointer.
  return (__bridge_retained c8_PoseSensor *)[[C8PoseSensorImpl alloc] init];
}

extern "C" void c8PoseSensor_destroy(c8_PoseSensor *pose) {
  C8Log("[ios-pose-sensor] %s", "destroy");
  CFRelease(pose);
}

extern "C" void c8PoseSensor_resume(c8_PoseSensor *pose) {
  C8PoseSensorImpl *impl = (__bridge C8PoseSensorImpl *)pose;
  [impl resume];
}

extern "C" void c8PoseSensor_pause(c8_PoseSensor *pose) {
  C8PoseSensorImpl *impl = (__bridge C8PoseSensorImpl *)pose;
  [impl pause];
}

extern "C" void c8PoseSensor_getAcceleration(c8_PoseSensor *pose, float *ax, float *ay, float *az) {
  C8PoseSensorImpl *impl = (__bridge C8PoseSensorImpl *)pose;
  CMAcceleration acceleration = [impl acceleration];

  *ax = acceleration.x * G_ACCELERATION;
  *ay = acceleration.y * G_ACCELERATION;
  *az = acceleration.z * G_ACCELERATION;
}

extern "C" void c8PoseSensor_getPose(
  c8_PoseSensor *pose, float *x, float *y, float *z, float *qw, float *qx, float *qy, float *qz) {
  C8PoseSensorImpl *impl = (__bridge C8PoseSensorImpl *)pose;
  CMQuaternion attitude = [impl attitude];

  *qx = attitude.x;
  *qy = attitude.y;
  *qz = attitude.z;
  *qw = attitude.w;
}

void c8PoseSensor_releaseEventQueue(c8_PoseSensor *pose, Vector<XRSensorEvent> *eventQueue) {
  C8PoseSensorImpl *impl = (__bridge C8PoseSensorImpl *)pose;
  [impl releaseEventQueue:eventQueue];
}
