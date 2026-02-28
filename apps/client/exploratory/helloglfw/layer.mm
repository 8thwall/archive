// Copyright (c) 2023 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)

#include "apps/client/exploratory/helloglfw/layer.h"

#if C8_HAS_EGL

#include <GLFW/glfw3.h>
#include <GLFW/glfw3native.h>

#include <QuartzCore/CoreAnimation.h>

EGLNativeWindowType getOpenGlLayer(GLFWwindow *window) {
  NSWindow *ns_window = glfwGetCocoaWindow(window);
  [ns_window.contentView setWantsLayer:YES];
  id layer = nullptr;
  layer = [CAOpenGLLayer layer];
  [ns_window.contentView setLayer:layer];
  return layer;
}

EGLNativeWindowType getMetalLayer(GLFWwindow *window) {
  NSWindow *ns_window = glfwGetCocoaWindow(window);
  [ns_window.contentView setWantsLayer:YES];
  id layer = nullptr;
  layer = [CAMetalLayer layer];
  [ns_window.contentView setLayer:layer];
  return layer;
}

#endif
