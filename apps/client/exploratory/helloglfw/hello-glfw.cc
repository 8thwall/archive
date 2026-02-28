// Copyright (c) 2023 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)
//
// Example Usages:
//   // Run with platform OpenGL:
//   bazel run apps/client/exploratory/helloglfw/hello-glfw --//c8/pixels/opengl:angle=true
//
//   // Run with ANGLE translation to Metal backend.
//   bazel run apps/client/exploratory/helloglfw/hello-glfw --//c8/pixels/opengl:angle=true

#include <GLFW/glfw3.h>

#include <memory>

#include "apps/client/exploratory/helloglfw/embedded-shaders.h"
#include "c8/exceptions.h"
#include "c8/pixels/opengl/client-gl.h"
#include "c8/pixels/opengl/gl-constants.h"
#include "c8/pixels/opengl/gl-program.h"
#include "c8/pixels/opengl/gl-version.h"
#include "c8/pixels/opengl/gl-vertex-array.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/opengl/glext.h"
#include "c8/scope-exit.h"
#include "c8/string.h"

#if C8_USE_ANGLE
#include "bzl/glfw/glfw-extra.h"
#include "c8/pixels/opengl/egl.h"
#include "c8/pixels/opengl/eglext.h"
#endif  // C8_USE_ANGLE

using namespace c8;

const char *const VERTEX_SOURCE = embeddedHelloGlfwVertCStr;
const char *const FRAGMENT_SOURCE = embeddedHelloGlfwFragCStr;

int main(int argc, char *argv[]) {
  if (!glfwInit()) {
    C8_THROW("Could not initialize GLFW");
  }

#if C8_USE_ANGLE
  const char *title = "Hello, ANGLE!";
  glfwWindowHint(GLFW_CLIENT_API, GLFW_NO_API);
#else
  const char *title = "Hello, GFLW!";
  glfwWindowHint(GLFW_CLIENT_API, GLFW_OPENGL_API);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MAJOR, 3);
  glfwWindowHint(GLFW_CONTEXT_VERSION_MINOR, 2);
  glfwWindowHint(GLFW_OPENGL_FORWARD_COMPAT, GLFW_TRUE);
  glfwWindowHint(GLFW_OPENGL_PROFILE, GLFW_OPENGL_CORE_PROFILE);
#endif  // C8_USE_ANGLE

  // Create the window
  const int width = 800;
  const int height = 600;
  GLFWwindow *window = glfwCreateWindow(width, height, title, NULL, NULL);
  if (!window) {
    glfwTerminate();
    C8_THROW("Could not open window");
  }

#if C8_USE_ANGLE
  // Note the terminology - for Apple, the EGL "window" is actually an Apple "layer".
  EGLNativeWindowType nativeWindow = nc_getGlfwNativeWindow(window);
  // Swap this for the for OpenGL backend.
  // EGLNativeWindowType nativeWindow = getOpenGlLayer(window);

  EGLint attrib[] = {
    EGL_PLATFORM_ANGLE_TYPE_ANGLE,
    EGL_PLATFORM_ANGLE_TYPE_METAL_ANGLE,
    // Swap this for the OpenGL backend.
    // EGL_PLATFORM_ANGLE_TYPE_OPENGL_ANGLE,
    EGL_NONE,
  };
  EGLDisplay display = eglGetPlatformDisplayEXT(EGL_PLATFORM_ANGLE_ANGLE, nativeWindow, attrib);
  if (display == EGL_NO_DISPLAY) {
    glfwTerminate();
    C8_THROW("Could not get display");
  }

  if (eglInitialize(display, nullptr, nullptr) == EGL_FALSE) {
    glfwTerminate();
    C8_THROW("Could not initialize EGL");
  }

  EGLint contextAttributes[] = {EGL_CONTEXT_CLIENT_VERSION, 3, EGL_NONE};

  EGLint attribs[] = {
    EGL_RED_SIZE,
    8,
    EGL_GREEN_SIZE,
    8,
    EGL_BLUE_SIZE,
    8,
    EGL_ALPHA_SIZE,
    8,
    EGL_DEPTH_SIZE,
    24,
    EGL_STENCIL_SIZE,
    8,
    EGL_RENDERABLE_TYPE,
    EGL_OPENGL_ES3_BIT,
    EGL_NONE,
  };

  EGLConfig config;
  EGLint numConfigs;
  if (!eglChooseConfig(display, attribs, &config, 1, &numConfigs) || numConfigs < 1) {
    glfwTerminate();
    C8_THROW("Failed to choose a config");
  }

  EGLContext context = eglCreateContext(display, config, EGL_NO_CONTEXT, contextAttributes);

  if (context == EGL_NO_CONTEXT) {
    glfwTerminate();
    C8_THROW("Could not create context");
  }

  EGLSurface surface = eglCreateWindowSurface(display, config, nativeWindow, nullptr);
  if (surface == EGL_NO_SURFACE) {
    glfwTerminate();
    C8_THROW("Could not create window surface, Error: %d", eglGetError());
  }

  if (eglMakeCurrent(display, surface, surface, context) == EGL_FALSE) {
    glfwTerminate();
    C8_THROW("Could not make the context current");
  }
#else   // !C8_USE_ANGLE
  glfwMakeContextCurrent(window);
#endif  // C8_USE_ANGLE

  GlProgram program;

  SCOPE_EXIT([&] { program.cleanup(); });

  constexpr float vertexData[][3] = {
    {0.0f, -0.5f, 0.0f},
    {-0.5f, 0.5f, 0.0f},
    {0.5f, 0.5f, 0.0f},
  };

  constexpr float colorData[][3] = {
    {1.0f, 0.0f, 0.0f},
    {0.0f, 1.0f, 0.0f},
    {0.0f, 0.0f, 1.0f},
  };

  constexpr uint16_t indexData[] = {0, 1, 2};

  program.initialize(VERTEX_SOURCE, FRAGMENT_SOURCE, {"position", "color"}, {});
  glUseProgram(program.program);

  // Set the viewport.
  glViewport(0, 0, width, height);

  // Create the vertex array.
  GlVertexArray vao;

  // Add the index buffer object.
  vao.setIndexBuffer(GL_TRIANGLES, GL_UNSIGNED_SHORT, sizeof(indexData), indexData, GL_STATIC_DRAW);

  // Add a vertex buffer object.
  vao.addVertexBuffer(
    GlVertexAttrib::SLOT_0,
    3,
    GL_FLOAT,
    GL_FALSE,
    0,
    sizeof(vertexData),
    vertexData,
    GL_STATIC_DRAW);

  vao.addVertexBuffer(
    GlVertexAttrib::SLOT_7, 3, GL_FLOAT, GL_FALSE, 0, sizeof(colorData), colorData, GL_STATIC_DRAW);

  while (!glfwWindowShouldClose(window)) {
    // Clear the framebuffer.
    glClearColor(0.2f, 0.3f, 0.3f, 1.0f);
    glClear(GL_COLOR_BUFFER_BIT);

    float time = glfwGetTime();
    glUniform1f(glGetUniformLocation(program.program, "angle"), time);

    // Bind the VAO.
    vao.bind();

    // Draw the vertices.
    vao.drawElements();

    // Swap the buffers.
#if C8_USE_ANGLE
    eglSwapBuffers(display, surface);
#else
    glfwSwapBuffers(window);
#endif

    // Poll for GLFW events.
    glfwPollEvents();
  }

  glfwDestroyWindow(window);
  glfwTerminate();

  return 0;
}
