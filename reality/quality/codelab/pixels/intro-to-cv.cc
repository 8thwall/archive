// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)
// The code in this file is meant to accompany Intro to CV
// https://docs.google.com/presentation/d/<REMOVED_BEFORE_OPEN_SOURCING>

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/io:image-io",
    "//c8/pixels/opengl:gl-error",
    "//c8/pixels:draw2",
    "//c8/pixels:draw2-widgets",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/pixels/opengl:gl-texture",
    "//c8/pixels/opengl:gl-program",
    "//c8/pixels/opengl:gl-quad",
    "//c8/pixels/opengl:texture-transforms",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/stats:scope-timer",
    "//reality/quality/codelab/pixels/data:pixels-codelab-shaders",
  };
  data = {
    "//reality/quality/codelab/pixels/data:img",
  };
  copts = {
    "-DGL_SILENCE_DEPRECATION",
  };
}
cc_end(0xc102d565);

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/image-io.h"
#include "c8/pixels/draw2-widgets.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/opengl/gl-program.h"
#include "c8/pixels/opengl/gl-quad.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/opengl/texture-transforms.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/stats/scope-timer.h"
#include "reality/quality/codelab/pixels/data/pixels-codelab-shaders.h"

using namespace c8;

const char *APP_NAME = "intro-to-cv";
static const double PI = 3.1415926535;

void putPixel(int r, int c, RGB888PlanePixels pix, Color color = Color::PURPLE) {
  pix.pixels()[r * pix.rowBytes() + c * 3 + 0] = color.r();
  pix.pixels()[r * pix.rowBytes() + c * 3 + 1] = color.g();
  pix.pixels()[r * pix.rowBytes() + c * 3 + 2] = color.b();
}

// Create a 25x25 RGB image (RGB888PlanePixelBuffer).
// Fill it with Color::BLUE. Color pixels on the down-left diagonal Color::CHERRY and on the
// up-right diagonal Color::MANGO. Write the output to a .png file.
void createAndSaveSimpleImage(Vector<String> *outPaths) {
  int w = 25;
  int h = 25;
  RGB888PlanePixelBuffer buffer(h, w);
  RGB888PlanePixels pix = buffer.pixels();

  // Color background blue
  fill(Color::BLUE.r(), Color::BLUE.g(), Color::BLUE.b(), &pix);

  // Color diagonals
  for (int r = 0; r < pix.rows(); ++r) {
    // Top left to bottom right
    putPixel(r, r, pix, Color::CHERRY);

    // Bottom left to top right
    putPixel(r, pix.rows() - r - 1, pix, Color::MANGO);
  }

  outPaths->push_back(format("/tmp/%s_%02d_diagonals.png", APP_NAME, outPaths->size()));
  writeImage(pix, outPaths->back());
}

// Create a 75x50 RGB image and fill it with Color::BLACK.
// Crop this into 6 25x25 sub-images, and draw a different colored circle in each one.
// Write the whole buffer to a .png file.
void createAndChopUpImage(Vector<String> *outPaths) {
  const float SIZE = 25;
  const Vector<Color> colors{
    Color::CHERRY, Color::MANGO, Color::MINT, Color::LIGHT_PURPLE, Color::WHITE, Color::GRAY_04};
  RGBA8888PlanePixelBuffer buffer(2 * SIZE, 3 * SIZE);
  fill(Color::BLACK, buffer.pixels());

  for (int i = 0; i < 2; ++i) {
    for (int j = 0; j < 3; ++j) {
      auto out = crop(buffer.pixels(), SIZE, SIZE, i * SIZE, j * SIZE);

      // Note - you could draw a single point big enough to be a circle.
      // drawPoint({SIZE / 2, SIZE / 2}, SIZE / 2, colors[3 * i + j], out);

      // Or draw a ring of points.
      float r = SIZE / 2;
      for (float angle = 0; angle < 360; angle += 0.1) {
        float x1 = r * cos(angle * PI / 180);
        float y1 = r * sin(angle * PI / 180);
        HPoint2 pt{SIZE / 2 + x1, SIZE / 2 + y1};
        drawPoint(pt, .1f, colors[3 * i + j], out);
      }
    }
  }

  outPaths->push_back(format("/tmp/%s_%02d_circles.png", APP_NAME, outPaths->size()));
  writeImage(buffer.pixels(), outPaths->back());
}

// Draw a cube from different perspectives, similar to cylindrical-visualize-features or
// planar-visualize-features
void drawCubePerspectives(Vector<String> *outPaths) {
  int WIDTH = 200;
  int HEIGHT = 300;

  // Construct a visualization of a cube from different views. This is a
  // 7x7 grid where each element is size 200x300, and each view is rotated 20 degrees from the
  // previous element, i,e. [60, 40, 20, 0, -20, -40 -60] degrees in the x and y directions.
  RGBA8888PlanePixelBuffer outbuf(7 * HEIGHT, 7 * WIDTH);
  fill(Color::BLACK, outbuf.pixels());

  auto k = Intrinsics::rotateCropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_X), WIDTH, HEIGHT);

  for (int i = 0; i < 7; ++i) {
    for (int j = 0; j < 7; ++j) {
      // Extract the region of the buffer to draw to.
      auto out = crop(outbuf.pixels(), HEIGHT, WIDTH, i * HEIGHT, j * WIDTH);

      // Starting at the origin, rotate the desired amount, and then back up, so that the camera is
      // always facing the origin.
      auto pos = updateWorldPosition(
        updateWorldPosition(HMatrixGen::i(), HMatrixGen::rotationD((3 - i) * 20, (3 - j) * 20, 0)),
        HMatrixGen::translation(0, 0, -2.5));

      drawCubeImageAtScale(k, pos, 1.f, Color::RED, out);

      // Used to color one side yellow to help see the cube better.
      float scale = 1.f / 2;
      Vector<HPoint3> singleSideCorners = {
        {scale, -scale, -scale},
        {scale, scale, -scale},
        {-scale, scale, -scale},
        {-scale, -scale, -scale},
      };

      auto singleSidePix = flatten<2>((HMatrixGen::intrinsic(k) * pos.inv()) * singleSideCorners);
      drawShape(singleSidePix, 1, Color::YELLOW, out);
    }
  }
  outPaths->push_back(format("/tmp/%s_%02d_cube_perspectives.png", APP_NAME, outPaths->size()));
  writeImage(outbuf.pixels(), outPaths->back());
}

// Create a 11x11 grid of cubes of size 0.1, from x=-5 to 5, with bottoms at y=-1, tops at -0.9,
// from z=0.5 to 11.5. Using SAMSUNG_GALAXY_S5, SAMSUNG_GALAXY_S6, and SAMSUNG_GALAXY_S7 profiles,
// construct 3 480x640 images of the scene by multiplying point locations by the intrinsic matrix,
// and then drawing the lines of each cube.
void drawCubeIntrinsics(Vector<String> *outPaths) {
  // TODO(paris)
}

using TexDrawer = std::function<void(
  GlTexture src,
  GlFramebufferObject *dest,
  const HMatrix &mat,
  bool clear,
  int x,
  int y,
  int w,
  int h)>;

// Move an object into a shared_ptr
template <typename T>
decltype(auto) sharedMove(T &&object) {
  return std::make_shared<T>(std::move(object));
}

void drawTexture(
  GlProgramObject &program,
  GlVertexArray &rect,
  GlTexture src,
  GlFramebufferObject *dest,
  const HMatrix &mat,
  bool clear,
  int x,
  int y,
  int w,
  int h) {
  // Bind the destination framebuffer.
  dest->bind();
  glUseProgram(program.id());
  glUniformMatrix4fv(program.location("mvp"), 1, GL_FALSE, mat.data().data());
  rect.bind();
  src.bind();
  glFrontFace(GL_CCW);
  glViewport(x, y, w, h);
  if (clear) {
    glClearColor(45 / 255.0f, 46 / 255.0f, 67 / 255.0f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);
  }
  rect.drawElements();
  src.unbind();
  rect.unbind();
  dest->unbind();
}

// Create a 1024x1024 framebuffer.
// Load a 480x640 image to a texture. Draw the texture to a 512x512 upper left viewport.
// Draw the same texture to a 240x320 viewport in the upper right quadrant.
// Adjust the y-positions of the vertex and draw to the bottom-left 512x512 viewport so that the
// image is centered without distortion. Set the y-positions back to 1/-1 and modify the vertex
// shader to achieve the same effect when drawing to the bottom right viewport. Read the
// framebuffer pixels and write them to a .jpg
void shaderDrawing(Vector<String> *outPaths) {
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();
  constexpr int WIDTH = 1024;
  constexpr int HEIGHT = 1024;

  // Create a 1024x1024 framebuffer.
  // Can also use: framebuffer = makeLinearRGBA8888Framebuffer(10, 10);
  c8::GlFramebufferObject frameBuffer;
  frameBuffer.initialize(
    makeLinearRGBA8888Texture2D(WIDTH, HEIGHT), GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0);

  // Load a 480x640 image to a texture.
  RGBA8888PlanePixelBuffer image =
    readImageToRGBA("reality/quality/codelab/pixels/data/test480x640.jpg");
  RGBA8888PlanePixels imagePix = image.pixels();
  GlTexture2D imageTexture = makeLinearRGBA8888Texture2D(imagePix.cols(), imagePix.rows());
  imageTexture.bind();
  imageTexture.updateImage(imagePix.pixels());
  imageTexture.unbind();

  // Initialize shaders
  auto vert = embeddedImageVertCStr;
  auto frag = embeddedImageFragCStr;
#ifdef __EMSCRIPTEN__
  if (isWebGL2()) {
    vert = embeddedImageWebgl2VertCStr;
    frag = embeddedImageWebgl2FragCStr;
  }
#endif

  GlProgramObject program;
  program.initialize(
    vert, frag, {{"position", GlVertexAttrib::SLOT_0}, {"uv", GlVertexAttrib::SLOT_2}}, {{"mvp"}});

  // Use default vertex array rect
  GlVertexArray rect = makeVertexArrayRect();

  // Draw the texture to a 512x512 upper left viewport.
  // glViewport sets the viewport to a portion of clip space and the shader fills it completely
  drawTexture(
    program,
    rect,
    imageTexture.tex(),
    &frameBuffer,
    HMatrixGen::i(),
    true,
    0,
    0,
    WIDTH / 2,
    HEIGHT / 2);

  // Like above, draw the same texture to a 240x320 viewport in the upper right quadrant.
  drawTexture(
    program,
    rect,
    imageTexture.tex(),
    &frameBuffer,
    HMatrixGen::i(),
    false,
    WIDTH / 2,
    0,
    240,
    320);

  // Adjust the y-positions of the vertex and draw to the bottom left 512x512 viewport so that the
  // image is centered without distortion.
  GlSubRect subRect{0, HEIGHT / 2, WIDTH / 2, HEIGHT / 2, WIDTH, HEIGHT};
  GlVertexArray bottomLeftRect = makeVertexArrayRect({0, 0, 1, 1, 1, 1}, subRect);
  drawTexture(
    program,
    bottomLeftRect,
    imageTexture.tex(),
    &frameBuffer,
    HMatrixGen::i(),
    false,
    0,
    0,
    WIDTH,
    HEIGHT);

  // Set the y-positions back to 1/-1
  rect = makeVertexArrayRect();

  // Now use the shader to draw to 512x512 bottom right viewport.
  // Here the viewport is the full size of clip space but we use a mvp matrix to only draw to a
  // portion of it.
  HMatrix mvp = HMatrixGen::translation(.5f, .5f, 0.f) * HMatrixGen::rotationD(0, 0, 0)
    * HMatrixGen::scale(.5f, .5f, .5f);
  drawTexture(program, rect, imageTexture.tex(), &frameBuffer, mvp, false, 0, 0, WIDTH, HEIGHT);

  // Read the framebuffer pixels and write them to a .jpg
  RGBA8888PlanePixelBuffer pixelBuffer(1024, 1024);
  readFramebufferRGBA8888Pixels(frameBuffer, pixelBuffer.pixels());

  outPaths->push_back(format("/tmp/%s_%02d_texture_drawing.jpg", APP_NAME, outPaths->size()));
  writeImage(pixelBuffer.pixels(), outPaths->back());
}

int main(int argc, char *argv[]) {
  Vector<String> outPaths;
  {
    ScopeTimer t("into-to-cv");
    createAndSaveSimpleImage(&outPaths);
    createAndChopUpImage(&outPaths);
    drawCubePerspectives(&outPaths);
    drawCubeIntrinsics(&outPaths);
    shaderDrawing(&outPaths);
  }
  C8Log("------------------\nTiming summary:");
  ScopeTimer::logDetailedSummary();
  C8Log("------------------\nWrote output:");
  for (const auto &s : outPaths) {
    C8Log("%s", s.c_str());
  }
}
