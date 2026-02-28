// Copyright (c) 2024 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#include "egl-display-layer-ios.h"

#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "c8/pixels/opengl/egl.h"
#include "c8/pixels/opengl/eglext.h"
#include "c8/protolog/xr-extern.h"

#include <memory>

namespace c8 {

namespace {

// TODO(yuhsianghuang): Make this a common utility function.
const char *getEglErrorMessage() {
  switch (eglGetError()) {
    case EGL_SUCCESS:
      return "EGL_SUCCESS";
    case EGL_NOT_INITIALIZED:
      return "EGL_NOT_INITIALIZED";
    case EGL_BAD_ACCESS:
      return "EGL_BAD_ACCESS";
    case EGL_BAD_ALLOC:
      return "EGL_BAD_ALLOC";
    case EGL_BAD_ATTRIBUTE:
      return "EGL_BAD_ATTRIBUTE";
    case EGL_BAD_CONTEXT:
      return "EGL_BAD_CONTEXT";
    case EGL_BAD_CONFIG:
      return "EGL_BAD_CONFIG";
    case EGL_BAD_CURRENT_SURFACE:
      return "EGL_BAD_CURRENT_SURFACE";
    case EGL_BAD_DISPLAY:
      return "EGL_BAD_DISPLAY";
    case EGL_BAD_SURFACE:
      return "EGL_BAD_SURFACE";
    case EGL_BAD_MATCH:
      return "EGL_BAD_MATCH";
    case EGL_BAD_PARAMETER:
      return "EGL_BAD_PARAMETER";
    case EGL_BAD_NATIVE_PIXMAP:
      return "EGL_BAD_NATIVE_PIXMAP";
    case EGL_BAD_NATIVE_WINDOW:
      return "EGL_BAD_NATIVE_WINDOW";
    case EGL_CONTEXT_LOST:
      return "EGL_CONTEXT_LOST";
    default:
      return "UNKNOWN";
  }
}

}  // namespace

// Adapter class that wraps EGLDisplay, EGLContext, and EGLSurface, which are bound to a CALayer
// from the iOS side upon initialization.
class EglDisplayLayerIos {
public:
  static void createInstance(EGLNativeWindowType layer) {
    if (instance_ == nullptr) {
      instance_.reset(new EglDisplayLayerIos(layer));
    }
  }

  static EglDisplayLayerIos *getInstance() {
    if (instance_ == nullptr) {
      C8_THROW("[egl-display-layer-ios] Attempting to get the instance before it's created.");
    }
    return instance_.get();
  }

  static void destroyInstance() { instance_.reset(); }

  ~EglDisplayLayerIos() {
    if (eglDisplay_ != EGL_NO_DISPLAY) {
      unbind();

      if (eglContext_ != EGL_NO_CONTEXT) {
        eglDestroyContext(eglDisplay_, eglContext_);
      }

      if (eglSurface_ != EGL_NO_SURFACE) {
        eglDestroySurface(eglDisplay_, eglSurface_);
      }

      if (eglDisplay_ != EGL_NO_DISPLAY) {
        eglTerminate(eglDisplay_);
      }
    }
  }

  EGLDisplay getDisplay() const { return eglDisplay_; }

  EGLSurface getSurface() const { return eglSurface_; }

  EGLContext getContext() const { return eglContext_; }

  // Binds the EGL context to the current thread.
  // NOTE: Must be called before issuing any drawing commands to draw correctly onto the CALayer.
  void bind() const {
    if (
      (eglContext_ == eglGetCurrentContext()) && (eglSurface_ == eglGetCurrentSurface(EGL_READ))
      && (eglSurface_ == eglGetCurrentSurface(EGL_DRAW))) {
      // Context and surface are already current. Nothing to do.
      return;
    }
    if (eglMakeCurrent(eglDisplay_, eglSurface_, eglSurface_, eglContext_) == EGL_FALSE) {
      C8Log("[egl-display-layer-ios@bind] eglMakeCurrent failed: %s", getEglErrorMessage());
    }
  }

  // Unbinds the EGL context from the current thread.
  void unbind() const {
    if (eglMakeCurrent(eglDisplay_, EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT) == EGL_FALSE) {
      C8Log("[egl-display-layer-ios@unbind] eglMakeCurrent failed: %s", getEglErrorMessage());
    }
  }

  // Presents the bound CALayer to display the rendered content on screen.
  void present() const {
    if (eglSwapBuffers(eglDisplay_, eglSurface_) == EGL_FALSE) {
      C8Log("[egl-display-layer-ios@present] eglSwapBuffers failed: %s", getEglErrorMessage());
    }
  }

private:
  EglDisplayLayerIos(EGLNativeWindowType layer) : layer_(layer) {
    constexpr EGLint displayAttribs[] = {
      EGL_PLATFORM_ANGLE_TYPE_ANGLE,
      EGL_PLATFORM_ANGLE_TYPE_METAL_ANGLE,
      // For legacy OpenGL backend, use EGL_PLATFORM_ANGLE_TYPE_OPENGL_ANGLE instead.
      EGL_NONE};
    eglDisplay_ = eglGetPlatformDisplayEXT(EGL_PLATFORM_ANGLE_ANGLE, nullptr, displayAttribs);
    if (eglDisplay_ == EGL_NO_DISPLAY) {
      C8_THROW("[egl-display-layer-ios] eglGetPlatformDisplay failed: %s", getEglErrorMessage());
    }
    if (eglInitialize(eglDisplay_, nullptr, nullptr) == EGL_FALSE) {
      C8_THROW("[egl-display-layer-ios] eglInitialize failed: %s", getEglErrorMessage());
    }

    constexpr EGLint attribs[] = {
      EGL_RED_SIZE,
      8,
      EGL_GREEN_SIZE,
      8,
      EGL_BLUE_SIZE,
      8,
      EGL_ALPHA_SIZE,
      8,
      EGL_RENDERABLE_TYPE,
      EGL_OPENGL_ES3_BIT_KHR,
      EGL_NONE,
    };
    EGLConfig eglConfig;
    EGLint numConfigs;
    if (
      (eglChooseConfig(eglDisplay_, attribs, &eglConfig, 1, &numConfigs) == EGL_FALSE)
      || (numConfigs < 1)) {
      C8_THROW("[egl-display-layer-ios] eglChooseConfig failed: %s", getEglErrorMessage());
    }

    constexpr EGLint surfaceAttribs[] = {EGL_NONE};
    eglSurface_ = eglCreateWindowSurface(eglDisplay_, eglConfig, layer_, surfaceAttribs);
    if (eglSurface_ == EGL_NO_SURFACE) {
      C8_THROW("[egl-display-layer-ios] eglCreateWindowSurface failed: %s", getEglErrorMessage());
    }

    constexpr EGLint contextAttribs[] = {EGL_CONTEXT_CLIENT_VERSION, C8_OPENGL_VERSION, EGL_NONE};
    eglContext_ = eglCreateContext(eglDisplay_, eglConfig, EGL_NO_CONTEXT, contextAttribs);
    if (eglContext_ == EGL_NO_CONTEXT) {
      C8_THROW("[egl-display-layer-ios] eglCreateContext failed: %s", getEglErrorMessage());
    }

    if (eglMakeCurrent(eglDisplay_, eglSurface_, eglSurface_, eglContext_) == EGL_FALSE) {
      C8_THROW("[egl-display-layer-ios] eglMakeCurrent failed: %s", getEglErrorMessage());
    }
  }

  // Pointer to the singleton instance of this class.
  static std::unique_ptr<EglDisplayLayerIos> instance_;

  // Pointer to the bound CALayer.
  EGLNativeWindowType layer_ = nullptr;

  // EGL handles.
  EGLDisplay eglDisplay_ = EGL_NO_DISPLAY;
  EGLSurface eglSurface_ = EGL_NO_SURFACE;
  EGLContext eglContext_ = EGL_NO_CONTEXT;
};

// Singleton EglDisplayLayerIos instance.
std::unique_ptr<EglDisplayLayerIos> EglDisplayLayerIos::instance_ = nullptr;

}  // namespace c8

C8_PUBLIC
void c8EglDisplayLayerIos_create(void *layer, int renderingSystem) {
  if (renderingSystem != RENDERING_SYSTEM_METAL) {
    C8_THROW_INVALID_ARGUMENT(
      "[egl-display-layer-ios] Currently only RENDERING_SYSTEM_METAL (2) is supported.");
  }

  c8::EglDisplayLayerIos::createInstance(static_cast<EGLNativeWindowType>(layer));
}

C8_PUBLIC
void c8EglDisplayLayerIos_destroy() { c8::EglDisplayLayerIos::destroyInstance(); }

C8_PUBLIC
void *c8EglDisplayLayerIos_getDisplay() {
  const auto *eglDisplayLayer = c8::EglDisplayLayerIos::getInstance();
  return static_cast<void *>(eglDisplayLayer->getDisplay());
}

C8_PUBLIC
void *c8EglDisplayLayerIos_getSurface() {
  const auto *eglDisplayLayer = c8::EglDisplayLayerIos::getInstance();
  return static_cast<void *>(eglDisplayLayer->getSurface());
}

C8_PUBLIC
void *c8EglDisplayLayerIos_getContext() {
  const auto *eglDisplayLayer = c8::EglDisplayLayerIos::getInstance();
  return static_cast<void *>(eglDisplayLayer->getContext());
}

C8_PUBLIC
void c8EglDisplayLayerIos_bind() {
  const auto *eglDisplayLayer = c8::EglDisplayLayerIos::getInstance();
  eglDisplayLayer->bind();
}

C8_PUBLIC
void c8EglDisplayLayerIos_unbind() {
  const auto *eglDisplayLayer = c8::EglDisplayLayerIos::getInstance();
  eglDisplayLayer->unbind();
}

C8_PUBLIC
void c8EglDisplayLayerIos_present() {
  const auto *eglDisplayLayer = c8::EglDisplayLayerIos::getInstance();
  eglDisplayLayer->present();
}
