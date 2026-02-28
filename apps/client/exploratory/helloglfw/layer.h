// Copyright (c) 2023 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)

#pragma once

#include "c8/pixels/opengl/gl-version.h"

#if C8_HAS_EGL

#include "c8/pixels/opengl/egl.h"

struct GLFWwindow;

EGLNativeWindowType getOpenGlLayer(GLFWwindow *window);
EGLNativeWindowType getMetalLayer(GLFWwindow *window);

#endif  // C8_HAS_EGL
