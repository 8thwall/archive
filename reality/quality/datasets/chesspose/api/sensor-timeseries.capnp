@0xe90b805f2b86f490;

using Cxx = import "/capnp/c++.capnp";
$Cxx.namespace("c8");

using Java = import "/capnp/java.capnp";
$Java.package("com.the8thwall.reality.quality.datasets.chesspose.api");
$Java.outerClassname("SensorTimeseries");  # Must match this file's name!

struct Direction {
  x @0: Float32;
  y @1: Float32;
  z @2: Float32;
}

struct Orientation {
  qw @0: Float32;
  qx @1: Float32;
  qy @2: Float32;
  qz @3: Float32;
}

struct DeviceModel {
  manufacturer @0 : Text;
  model @1 : Text;
}

struct SensorEvent {
  accelerometer @0: Direction;
  gyro @1: Direction;
  magnetometer @2: Direction;
}

struct NamedSensor {
  name @0 :Text;
  timestampNanos @1 :Int64;
  values @2 :Direction;
}

struct PoseAndDelta {
  position @0 :Direction;
  orientation @1 :Orientation;
  positionDelta @2 :Direction;
  orientationDelta @3 :Orientation;
  acceleration @4 :Direction;
}

struct NamedPoseAndDelta {
  name @0 :Text;
  poseAndDelta @1 :PoseAndDelta;
}

struct InferredOutput {
  device @0: PoseAndDelta;
  computed @1: PoseAndDelta;
  inertial @2: PoseAndDelta;
}

struct SensorEventContext {
  frameTimeNanos @0: Int64;
  trackId @1: Int64;
  trackIndex @2: Int32;
  sessionId @3: Int64;
  deviceModel @4: DeviceModel;
}

struct SensorTimeseriesEvent {
  sensorTimeNanos @0: Int64;
  # sensorTimeNanos
  context @1: SensorEventContext;
  # context.frameTimeNanos
  # context.trackId
  # context.trackIndex
  # context.sessionId
  # context.deviceModel.manufracturer
  # context.deviceModel.model
  sensor @2: SensorEvent;
  # sensor.accelerometer.x
  # sensor.accelerometer.y
  # sensor.accelerometer.z
  # sensor.gyro.x
  # sensor.gyro.y
  # sensor.gyro.z
  # sensor.magnetometer.x
  # sensor.magnetometer.y
  # sensor.magnetometer.z
  label @3: InferredOutput;
  # label.device.position.x
  # label.device.position.y
  # label.device.position.z
  # label.device.orientation.qw
  # label.device.orientation.qx
  # label.device.orientation.qy
  # label.device.orientation.qz
  # label.device.positionDelta.x
  # label.device.positionDelta.y
  # label.device.positionDelta.z
  # label.device.orientationDelta.qw
  # label.device.orientationDelta.qx
  # label.device.orientationDelta.qy
  # label.device.orientationDelta.qz
  # label.device.acceleration.x
  # label.device.acceleration.y
  # label.device.acceleration.z
  # label.computed.position.x
  # label.computed.position.y
  # label.computed.position.z
  # label.computed.orientation.qw
  # label.computed.orientation.qx
  # label.computed.orientation.qy
  # label.computed.orientation.qz
  # label.computed.positionDelta.x
  # label.computed.positionDelta.y
  # label.computed.positionDelta.z
  # label.computed.orientationDelta.qw
  # label.computed.orientationDelta.qx
  # label.computed.orientationDelta.qy
  # label.computed.orientationDelta.qz
  # label.computed.acceleration.x
  # label.computed.acceleration.y
  # label.computed.acceleration.z
  # label.inertial.position.x
  # label.inertial.position.y
  # label.inertial.position.z
  # label.inertial.orientation.qw
  # label.inertial.orientation.qx
  # label.inertial.orientation.qy
  # label.inertial.orientation.qz
  # label.inertial.positionDelta.x
  # label.inertial.positionDelta.y
  # label.inertial.positionDelta.z
  # label.inertial.orientationDelta.qw
  # label.inertial.orientationDelta.qx
  # label.inertial.orientationDelta.qy
  # label.inertial.orientationDelta.qz
  # label.inertial.acceleration.x
  # label.inertial.acceleration.y
  # label.inertial.acceleration.z
}

struct NamedEvents {
  frameTimeNanos @0: Int64;
  sensors @1: List(NamedSensor);
  labels @2 :List(NamedPoseAndDelta);
}
