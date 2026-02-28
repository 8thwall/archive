@0xa659b33756e7bfc3;

using Cxx = import "/capnp/c++.capnp";
$Cxx.namespace("c8");

using Java = import "/capnp/java.capnp";
$Java.package("com.the8thwall.reality.quality.visualization.xrom.api");
$Java.outerClassname("Xrom");  # Must match this file's name!

struct SetXromRequest {
  app @0 :XromNode;
}

struct UpdateXromRequest {
  enum Flush {
    unspecified @0;
    flushAfterUpdates @1;
  }

  # latest image and all previous sensor data
  flush @0 :Flush;
  updates @1 :List(XromUpdateNode);
}

struct XromNodeRef {
  id @0 :Int64;
  userKey @1 :Text;
}

struct XromNode {
  id @0 :Int64;
  userKey @1 :Text;
  children @2 :List(XromNode);
  data @3: XromNodeData;
}

struct XromNodeData {
  kind :union {
    unspecified @0 :XromUnspecified;
    app @1 :XromApp;
    view2d @2 :XromView2d;
    view3d @3 :XromView3d;
    component2d @4 :XromComponent2d;
    component3d @5 :XromComponent3d;
  }
}

struct XromUnspecified {
  # no data.
}

struct XromUpdateNode {
  enum SpecialOperation {
    unspecified @0;
    delete @1;
  }
  node @0 :XromNodeRef;
  parent @1 :XromNodeRef;
  data @2 :XromNodeData;
  specialOperation @3 :SpecialOperation;
}

struct XromApp {
  name @0 :Text;
  layout @1 :XromComponent;
}

struct XromView2d {
  name @0 :Text;
  image @1 :XromComponent;
}

struct XromView3d {
  name @0 :Text;
  camera @1 :XromSceneCamera;
  copyView @2 :XromNodeRef;
}

struct XromSceneCamera {
  place @0: XromPlace3;
  # TODO(nb): FOV
}

struct XromComponent2d {
}

struct XromComponent3d {
  place @0 :XromPlace3;
  scale @1 :Float32;
  component @2 :XromComponent;
}

struct XromComponent {
  type @0 :Text;
  data @1 :Data;
}

struct XromPoint3 {
  x @0 :Float32;
  y @1 :Float32;
  z @2 :Float32;
}

struct XromQuaternion {
  w @0 :Float32;
  x @1 :Float32;
  y @2 :Float32;
  z @3 :Float32;
}

struct XromPlace3 {
  point @0 :XromPoint3;
  facing @1 :XromQuaternion;
}
