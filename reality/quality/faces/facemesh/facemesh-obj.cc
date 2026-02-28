
/*
 * Script for turning our facemesh constant into an obj file
 */
#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:hpoint",
    "//c8:c8-log",
    "//c8:color",
    "//c8:hpoint",
    "//c8:vector",
    "//c8:string",
    "//c8/geometry:facemesh-data",
    "//c8/geometry:mesh",
    "//c8/pixels:pixel-transforms",
  };
}
cc_end(0x43edeb57);

#include <array>
#include <cmath>
#include <fstream>
#include <iostream>

#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/geometry/mesh.h"
#include "c8/hpoint.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "c8/stats/scope-timer.h"

namespace c8 {

// Creates an obj file from the facemesh data constants
void createFacemeshObj() {
  ScopeTimer t("create-facemesh-obj");
  std::ofstream facemeshObjFile;
  String objPath = "/tmp/facemesh.obj";
  facemeshObjFile.open(objPath, std::ofstream::in | std::ofstream::out | std::ofstream::trunc);

  for (auto vertex : FACEMESH_SAMPLE_VERTICES) {
    facemeshObjFile << "v " << vertex.x() << " " << vertex.y() << " " << vertex.z() << std::endl;
  }

  // Write uvs
  for (int i = 0; i < NUM_FACEMESH_POINTS; i++) {
    const auto uv = FACEMESH_UVS[i];
    facemeshObjFile << "vt " << uv.u << " " << uv.v << std::endl;
  }

  // Write face indices
  for (int i = 0; i < FACEMESH_INDICES.size(); i += 1) {
    // convert indices into a vector for computeVertexNormals
    const auto triangle = FACEMESH_INDICES[i];

    // write face indices.  Note that for obj files the first index is 1 and not 0.
    // We're doing the following format:
    //   f v1/vt1/vn1 v2/vt2/vn2 v3/vt3/vn3
    // This specifies the vertex/uv/vertexNormal index positions, so the first triangle will be
    //   f 128/128/128 35/35/35 140/140/140

    // clang-format off
    facemeshObjFile << "f "
      << triangle.a + 1 << "/" << triangle.a + 1 << "/" << triangle.a + 1 << " "
      << triangle.b + 1 << "/" << triangle.b + 1 << "/" << triangle.b + 1 << " "
      << triangle.c + 1 << "/" << triangle.c + 1 << "/" << triangle.c + 1 << " "
      << std::endl;
    // clang-format on
  }

  // Write vertex normals
  Vector<HVector3> vertexNormals;
  computeVertexNormals(
    FACEMESH_SAMPLE_VERTICES, FACEMESH_INDICES, &vertexNormals);
  for (auto vertNormal : vertexNormals) {
    facemeshObjFile << "vn " << vertNormal.x() << " " << vertNormal.y() << " " << vertNormal.z()
                    << std::endl;
  }

  C8Log("Wrote obj file to %s", objPath.c_str());
  facemeshObjFile.close();
}

}  // namespace c8

int main(int argc, char *argv[]) {
  c8::createFacemeshObj();

  return 0;
}
