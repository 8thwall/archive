/**
 * Drawing the face mesh uvs.
 */
#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:color",
    "//c8/geometry:facemesh-data",
    "//c8/io:image-io",
    "//c8/pixels:draw2",
  };
}
cc_end(0xdf43b144);

#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/io/image-io.h"
#include "c8/pixels/draw2.h"

using namespace c8;

HPoint2 toPix(UV uv) {
  return {(1.0f - uv.u) * 2047.0f, (1.0f - uv.v) * 2047.0f};
}

void drawUvs(const char* filename) {
  auto uvs = FACEMESH_UVS;
  auto triangles = FACEMESH_INDICES;

  RGBA8888PlanePixelBuffer buf(2048, 2048);
  for (auto t : triangles) {
    drawShape(
      {toPix(uvs[t.a]), toPix(uvs[t.b]), toPix(uvs[t.c])},
      2,
      {0, 0, 0, 255}, // true black
      buf.pixels());
  }

  C8Log("Writing image to %s", filename);
  writeImage(buf.pixels(), filename);
}

int main(int argc, char *argv[]) {
  if (argc != 2) {
    c8::C8Log(
      "%s",
      "ERROR: Missing image path.\n"
      "\n"
      "yuv usage:\n"
      "    bazel run //reality/quality/faces/facemesh:facemesh-draw-uvs -- /path/to/img.png\n");
    return -1;
  }

  drawUvs(argv[1]);
}
