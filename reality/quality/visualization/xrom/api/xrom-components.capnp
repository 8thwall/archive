@0x9462db11f76749a7;

using Xrom = import "xrom.capnp";

using Cxx = import "/capnp/c++.capnp";
$Cxx.namespace("c8");

using Java = import "/capnp/java.capnp";
$Java.package("com.the8thwall.reality.quality.visualization.xrom.api");
$Java.outerClassname("XromComponents");  # Must match this file's name!

struct XromPackedLayout {
  enum AspectMismatchOptions {
    unspecified @0;
    letterbox @1;
    fill @2;
  }
  onAspectMismatch @0: AspectMismatchOptions;
  preferredWindowSize @1: XromSize;
  viewRows @2: List(XromPackedLayoutRow);
}

struct XromPackedLayoutView {
  onAspectMismatch @0: XromPackedLayout.AspectMismatchOptions;
  weight @1: Float32;
}

struct XromPackedLayoutRow {
  weight @0: Float32;
  views @1: List(XromPackedLayoutView);
}

struct XromSize {
  w @0: Float32;
  h @1: Float32;
}

struct XromColor {
  r @0 :Int32;
  g @1 :Int32;
  b @2 :Int32;
  a @3 :Int32;
}

struct XromPoint2 {
  x @0 :Float32;
  y @1 :Float32;
}

struct XromVector3 {
  x @0 :Float32;
  y @1 :Float32;
  z @2 :Float32;
}

struct XromVertexTriangle {
  v0 @0 :Int32;
  v1 @1 :Int32;
  v2 @2 :Int32;
}

struct XromPointSet3d {
  color @0 :XromColor;
  radius @1 :Float32;
  points @2 :List(Xrom.XromPoint3);
}

struct XromMeshVertex {
  point @0 :Xrom.XromPoint3;
  texCoord @1 :XromPoint2;
}

struct XromMeshFace {
  triangle @0 :XromVertexTriangle;
  normal @1 :XromVector3;
}

struct XromMesh3d {
  color @0 :XromColor;
  radius @1 :Float32;
  vertices @2 :List(XromMeshVertex);
  faces @3 :List(XromMeshFace);
}

struct XromCamera3d {
  color @0 :XromColor;
  radius @1 :Float32;

  pixelsWidth @2: Int32;
  pixelsHeight @3: Int32;
  centerPointX @4: Float32;
  centerPointY @5: Float32;
  focalLengthHorizontal @6: Float32;
  focalLengthVertical @7: Float32;
  nearClip @8 :Float32;
  farClip @9 :Float32;
}

struct XromOrigin3d {
  radius @0 :Float32;
  length @1 :Float32;
}

struct XromRgbaColorTexture {
  width @0: Int32;
  height @1: Int32;
  pixels @2: Data;  # 4xWxH
}
