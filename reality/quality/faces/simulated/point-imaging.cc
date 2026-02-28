
/*
 * Methods for visualizing points
 */
#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:hpoint",
    "//c8:c8-log",
    "//c8:color",
    "//c8:hpoint",
    "//c8:vector",
    "//c8/camera:device-infos",
    "//c8/geometry:egomotion",
    "//c8/geometry:face-types",
    "//c8/geometry:facemesh-data",
    "//c8/geometry:intrinsics",
    "//c8/geometry:mesh",
    "//c8/geometry:mesh-types",
    "//c8/geometry:worlds",
    "//c8/io:image-io",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-transforms",
    "//reality/quality/visualization/render:ui2",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0x7fa8e097);

#include <array>
#include <cmath>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/color.h"
#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/face-types.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/mesh.h"
#include "c8/geometry/mesh-types.h"
#include "c8/geometry/worlds.h"
#include "c8/io/image-io.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/vector.h"
#include "c8/stats/scope-timer.h"
#include "reality/quality/visualization/render/ui2.h"

using namespace c8;

void visualizeMesh(const Vector<HPoint3> &pts, const Vector<MeshIndices> &indices) {
  ScopeTimer t("visualize-mesh");

  auto intrinsic = Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6);
  auto K = HMatrixGen::intrinsic(intrinsic);

  Vector<HPoint3> ego{
    // move right
    {0.05f, 0.0f, 0.0f},
    {0.05f, 0.0f, 0.0f},
    {0.05f, 0.0f, 0.0f},
    {0.05f, 0.0f, 0.0f},
    {0.05f, 0.0f, 0.0f},

    // back to center
    {-0.05f, 0.0f, 0.0f},
    {-0.05f, 0.0f, 0.0f},
    {-0.05f, 0.0f, 0.0f},
    {-0.05f, 0.0f, 0.0f},
    {-0.05f, 0.0f, 0.0f},

    // move left
    {-0.05f, 0.0f, 0.0f},
    {-0.05f, 0.0f, 0.0f},
    {-0.05f, 0.0f, 0.0f},
    {-0.05f, 0.0f, 0.0f},
    {-0.05f, 0.0f, 0.0f},

    // back to center
    {0.05f, 0.0f, 0.0f},
    {0.05f, 0.0f, 0.0f},
    {0.05f, 0.0f, 0.0f},
    {0.05f, 0.0f, 0.0f},
    {0.05f, 0.0f, 0.0f},

    // move up
    {0.0f, 0.05f, 0.0f},
    {0.0f, 0.05f, 0.0f},
    {0.0f, 0.05f, 0.0f},
    {0.0f, 0.05f, 0.0f},
    {0.0f, 0.05f, 0.0f},

    // back to center
    {0.0f, -0.05f, 0.0f},
    {0.0f, -0.05f, 0.0f},
    {0.0f, -0.05f, 0.0f},
    {0.0f, -0.05f, 0.0f},
    {0.0f, -0.05f, 0.0f},

    // move down
    {0.0f, -0.05f, 0.0f},
    {0.0f, -0.05f, 0.0f},
    {0.0f, -0.05f, 0.0f},
    {0.0f, -0.05f, 0.0f},
    {0.0f, -0.05f, 0.0f},

    // back to center
    {0.0f, 0.05f, 0.0f},
    {0.0f, 0.05f, 0.0f},
    {0.0f, 0.05f, 0.0f},
    {0.0f, 0.05f, 0.0f},
    {0.0f, 0.05f, 0.0f},
  };

  auto camera = cameraMotion(HPoint3{0.0f, 0.0f, 0.5f}, {0, 0, 1, 0});

  RGBA8888PlanePixelBuffer buf(intrinsic.pixelsHeight, intrinsic.pixelsWidth);
  auto img = buf.pixels();

  int i = 0;
  while (true) {
    // clear image
    fill(0, 0, 0, 1, &img);

    c8::drawMeshAndNormals(pts, indices, 0.01f, K, camera, 3, img);

    c8::show("Visualizing meshes", img);
    c8::waitKey(0);

    auto translation = HMatrixGen::translation(ego[i].x(), ego[i].y(), ego[i].z());
    // The world position of the camera.
    camera = updateWorldPosition(camera, translation);
    i = (i + 1) % ego.size();
  }
}

int main(int argc, char *argv[]) {
  if (argv[1] == nullptr) {
    visualizeMesh(
      Worlds::denseFaceMeshWorld(), Worlds::denseFaceMeshIndices());
  } else {
    // Pass anything as an argument to see the sparse points, for example:
    //      bazel run //reality/quality/faces/simulated:point-imaging -- 1
    visualizeMesh(
      Worlds::sparseFaceMeshWorld(), Worlds::sparseFaceMeshIndices());
  }
}
