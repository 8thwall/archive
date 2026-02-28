@0xd66c6d7fe544711d;

using Cxx = import "/capnp/c++.capnp";
$Cxx.namespace("c8");

using Java = import "/capnp/java.capnp";
$Java.package("com.the8thwall.reality.quality.labels.api");
$Java.outerClassname("GroundHomographyLabels");  # Must match this file's name!

struct GroundHomographyLabel {
  labelNumber @0: Int32;
  label @1: GroundHomographyFramePair;
}

struct GroundHomographyMotionLabel {
  labelNumber @0: Int32;
  frameTimeNanos @1: Int64;
  intrinsics @2: GroundHomographyCameraIntrinsics;
  xrDevicePose @3: GroundHomographyQuaternion;
  cameraScaledPosition @4: GroundHomographyScaledPosition;
  cameraRotation @5: GroundHomographyQuaternion;
}

struct GroundHomographyFramePair {
  first @0: GroundHomographyFrame;
  second @1: GroundHomographyFrame;
}

struct GroundHomographyFrame {
  frameTimeNanos @0: Int64;
  intrinsics @1: GroundHomographyCameraIntrinsics;
  xrDevicePose @2: GroundHomographyQuaternion;
  matchA @3: GroundHomographyCameraRay;
  matchB @4: GroundHomographyCameraRay;
}

struct GroundHomographyCameraRay {
  x @0: Float32;
  y @1: Float32;
}

struct GroundHomographyCameraIntrinsics {
  # Intrinsic parameters used to construct the pinhole camera matrix.
  pixelsWidth @0: Int32;
  pixelsHeight @1: Int32;
  centerPointX @2: Float32;
  centerPointY @3: Float32;
  focalLengthHorizontal @4: Float32;
  focalLengthVertical @5: Float32;
}

struct GroundHomographyQuaternion {
  w @0: Float32;
  x @1: Float32;
  y @2: Float32;
  z @3: Float32;
}

struct GroundHomographyScaledPosition {
  x @0: Float32;
  y @1: Float32;
  z @2: Float32;
}
