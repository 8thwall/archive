// Copyright (c) 2022 Niantic, Inc.
// Original Author: Dat Chu (datchu@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  data = {
    "//bzl/examples/draco/testdata:draco-asset",
  };
  deps = {
    "//c8/geometry:load-mesh",
    "//c8/geometry:octree",
    "//c8:c8-log",
  };
}
cc_end(0xbe0d4402);

#include "c8/geometry/load-mesh.h"
#include "c8/geometry/octree.h"

using namespace c8;

int main(int argc, char *argv[]) {
  auto mesh = dracoFileToMesh("bzl/examples/draco/testdata/bunny.drc", true, true).value();
  Vector<Box3> boundingBoxes;
  auto octree{Octree::from(mesh, &boundingBoxes)};
  C8Log("[main] Octree construction is done leaf=%d", octree.isLeafNode());

  return 0;
}
