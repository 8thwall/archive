@0xea7c3f5ff5eed49f;

using Xrom = import "xrom.capnp";

using Cxx = import "/capnp/c++.capnp";
$Cxx.namespace("c8");

interface XromService {
  setXrom @0 (request :Xrom.SetXromRequest);
  updateXrom @1 (request :Xrom.UpdateXromRequest);
}
