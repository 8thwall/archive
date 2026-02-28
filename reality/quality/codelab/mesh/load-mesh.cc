#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/geometry:intrinsics",
    "//c8/io:image-io",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels/render:assimp-assets",
    "//c8/pixels/render:renderer",
  };
}
cc_end(0x63c5aaf9);

#include "c8/c8-log.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/image-io.h"
#include "c8/pixels/render/assimp-assets.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/render/renderer.h"

using namespace c8;

int main(int argc, const char **argv) {
  C8Log("[load-mesh] Reading %s", argv[1]);

  // Print mesh data for the scene, to show an idea of the data structures and their contents.
  auto meshPtr = readDiffuseJpgMesh(argv[1]);
  if (meshPtr == nullptr) {
    C8Log("[load-mesh] failed");
    return 1;
  }

  C8Log("[load-mesh] success");

  printDebugMeshData(argv[1]);
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  auto scene = ObGen::scene(2000, 2000);

  auto &drawMesh = scene->add(std::move(meshPtr));
  auto meshPos = HMatrixGen::translation(0.05f, -0.175f, 0.6f);
  drawMesh.setLocal(meshPos);

  scene->add(ObGen::perspectiveCamera(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_XS), 2000, 2000));

  Renderer renderer;
  renderer.render(*scene);

  auto img = renderer.result();

  writeImage(img.pixels(), "/tmp/load-mesh.jpg");
  C8Log("[load-mesh] Wrote /tmp/load-mesh.jpg");

  return 0;
}
