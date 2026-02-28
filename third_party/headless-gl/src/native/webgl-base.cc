#include "webgl-base.h"

#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "c8/pixels/opengl/egl.h"
#include "c8/pixels/opengl/eglplatform.h"

#ifdef ANDROID
#include <android_native_app_glue.h>
#endif

using c8::C8Log;

namespace hgl {
namespace internal {

int bytesPerChannel(GLenum type) {
  // Compute bytes per channel using all of the following types:
  // GL_UNSIGNED_BYTE, GL_BYTE, GL_UNSIGNED_SHORT, GL_SHORT, GL_UNSIGNED_INT, GL_INT, GL_HALF_FLOAT,
  // GL_FLOAT, GL_UNSIGNED_SHORT_5_6_5, GL_UNSIGNED_SHORT_4_4_4_4, GL_UNSIGNED_SHORT_5_5_5_1,
  // GL_UNSIGNED_INT_2_10_10_10_REV, GL_UNSIGNED_INT_10F_11F_11F_REV, GL_UNSIGNED_INT_5_9_9_9_REV,
  // GL_UNSIGNED_INT_24_8, and GL_FLOAT_32_UNSIGNED_INT_24_8_REV.
  switch (type) {
    case GL_UNSIGNED_BYTE:
    case GL_BYTE:
      return 1;
    case GL_HALF_FLOAT:
    case GL_UNSIGNED_SHORT:
    case GL_SHORT:
    case GL_UNSIGNED_SHORT_5_6_5:
    case GL_UNSIGNED_SHORT_4_4_4_4:
    case GL_UNSIGNED_SHORT_5_5_5_1:
      return 2;
    case GL_FLOAT:
    case GL_UNSIGNED_INT:
    case GL_INT:
    case GL_UNSIGNED_INT_2_10_10_10_REV:
    case GL_UNSIGNED_INT_10F_11F_11F_REV:
    case GL_UNSIGNED_INT_5_9_9_9_REV:
    case GL_UNSIGNED_INT_24_8:
      return 4;
    case GL_FLOAT_32_UNSIGNED_INT_24_8_REV:
      return 8;
    default:
      // Unknown or invalid type.
      C8_THROW_INVALID_ARGUMENT("Invalid or unknown type 0x%04X", type);
  }
}

int channelsPerPixel(GLenum format) {
  // Compute number of channels per pixel for all of the following:
  // GL_RED, GL_RED_INTEGER, GL_RG, GL_RG_INTEGER, GL_RGB, GL_RGB_INTEGER, GL_RGBA, GL_RGBA_INTEGER,
  // GL_DEPTH_COMPONENT, GL_DEPTH_STENCIL, GL_LUMINANCE_ALPHA, GL_LUMINANCE, and GL_ALPHA.
  switch (format) {
    case GL_RED:
    case GL_RED_INTEGER:
    case GL_LUMINANCE:
    case GL_ALPHA:
    case GL_DEPTH_COMPONENT:
      return 1;
    case GL_RG:
    case GL_RG_INTEGER:
    case GL_LUMINANCE_ALPHA:
    case GL_DEPTH_STENCIL:
      return 2;
    case GL_RGB:
    case GL_RGB_INTEGER:
      return 3;
    case GL_RGBA:
    case GL_RGBA_INTEGER:
      return 4;
    default:
      // Unknown or invalid type.
      C8_THROW_INVALID_ARGUMENT("Invalid or unknown format 0x%04X", format);
  }
}

int bytesPerPixel(GLenum format, GLenum type) {
  return channelsPerPixel(format) * bytesPerChannel(type);
}

// static
AppSingleton &AppSingleton::getInstance(const AppSingletonOptions &options) {
  // Magic-statics in modern C++ ensure the following runs exactly once, even with multiple threads
  // calling getInstance() at the same time.
  static AppSingleton instance(options);
  return instance;
}

AppSingleton::AppSingleton(const AppSingletonOptions &options)
    : surfaceNativeWindow_(nullptr), contextAtomic_(nullptr), display_(EGL_NO_DISPLAY) {
  // If this is the first run, initialize EGL.
#if !C8_USE_ANGLE
  // On non-ANGLE platforms, we can use eglGetDisplay with EGL_DEFAULT_DISPLAY to get the default
  // EGL display.
  display_ = eglGetDisplay(EGL_DEFAULT_DISPLAY);
#else  // C8_USE_ANGLE
  // On ANGLE platforms, we choose to use eglGetPlatformDisplay with EGL_PLATFORM_ANGLE_ANGLE.
  // This attribute is followed by a value that specifies the backend to use.
  std::vector<EGLAttrib> displayAttributes;
  displayAttributes.push_back(EGL_PLATFORM_ANGLE_TYPE_ANGLE);
#ifdef __APPLE__
  // On Apple platforms, we prefer the Metal backend, but we have observed issues when running
  // multiple Metal contexts that result in reproducable thread deadlock within Metal semaphores.
  // Until these are issues are resolved in our ANGLE version, we are handling this by choosing the
  // backend type based on whether the first context in the application is an on-screen context or
  // an off-screen context. This strange approach was originally an unintended bug in earlier
  // versions of our code, but it had the side effect of preventing the indefinite hangs when
  // running the WebGL conformance suite, while keeping the Metal backend when running
  // Native apps that use on-screen contexts, the later of which have never been seen reproducing
  // the deadlocks.
  //
  // For examples of conformance tests that reproduce the deadlocks with a Metal backend, see:
  //   * //c8/dom/webgl/conformance/glsl:implicit  <-- repros on final test iff all other tests run.
  //   * //c8/dom/webgl/conformance/glsl:misc
  //   * //c8/dom/webgl/conformance/glsl:samplers
  //   * //c8/dom/webgl/conformance/textures:misc
  //   * //c8/dom/webgl/conformance:canvas
  //   * //c8/dom/webgl/conformance:context
  //   * //c8/dom/webgl/conformance:rendering  <-- repros on multisample-corruption.html
  if (options.preferMetal) {
    // Use Metal backend if requested.
    displayAttributes.push_back(EGL_PLATFORM_ANGLE_TYPE_METAL_ANGLE);
  } else {
    // Use default backend (OPEN_GL) on Apple platforms if Metal is not requested.
    displayAttributes.push_back(EGL_PLATFORM_ANGLE_TYPE_OPENGL_ANGLE);
  }
#else   // !__APPLE__
  // On Windows and Android, we use the default backend, which is D3D11 on Windows and Vulkan on
  // Android.
  displayAttributes.push_back(EGL_PLATFORM_ANGLE_TYPE_DEFAULT_ANGLE);
#endif  // __APPLE__

  displayAttributes.push_back(EGL_NONE);
  display_ = eglGetPlatformDisplay(EGL_PLATFORM_ANGLE_ANGLE, nullptr, displayAttributes.data());
#endif  // !C8_USE_ANGLE

  if (display_ == EGL_NO_DISPLAY) {
    // If we can't get a display, we can't do anything.
    C8_THROW("Failed to get EGL display");
  }

  // Initialize EGL
  if (!eglInitialize(display_, nullptr, nullptr)) {
    C8_THROW("Failed to initialize EGL");
  }
}

AppSingleton::~AppSingleton() {
  if (display_ != EGL_NO_DISPLAY) {
    eglTerminate(display_);
  }
}

void AppSingleton::setNativeWindow(void *nativeWindow) {
  if (surfaceNativeWindow_ == nativeWindow) {
    // If the native window is the same as the current one, do nothing.
    return;
  }

  WebGLRenderingContextBase *context = contextAtomic_.load();

  if (context) {
    context->createSurface(nativeWindow, 0, 0);
  }
  surfaceNativeWindow_ = nativeWindow;
}

bool AppSingleton::tryAttachContext(WebGLRenderingContextBase *context, void *nativeWindow) {
  if (nativeWindow == nullptr) {
    // If this is offscren rendering, nothing to attach.
    return false;
  }
  WebGLRenderingContextBase *expectedNull = nullptr;
  if (contextAtomic_.compare_exchange_strong(expectedNull, context)) {
    // If the contextAtomic_ was nullptr, then attach the context to the window.
    surfaceNativeWindow_ = nativeWindow;
    return true;
  }
  if (surfaceNativeWindow_ == nativeWindow) {
    // If we are trying to attach a context, but already have a context attached to this
    // native window, it means we should dispose the existing context, and then attach
    // this new context to the window. We also must set the webgl-base global state
    // to be ready for a new context.
    WebGLRenderingContextBase *currContext = contextAtomic_.load();
    if (currContext) {
      currContext->dispose();
      if (AppSingleton::getInstance().detachContext(currContext)) {
        c8::setXrCommandBuffer(nullptr);
      }
      currContext->setToReadyState();
      contextAtomic_.store(context);
      surfaceNativeWindow_ = nativeWindow;
    }
    return true;
  }

  C8Log("Failed to attach context to window, already attached to another context");
  return false;
}

bool AppSingleton::detachContext(WebGLRenderingContextBase *context) {
  WebGLRenderingContextBase *expectedContext = context;
  // If the contextAtomic_ was the attached context, then return true
  return contextAtomic_.compare_exchange_strong(expectedContext, nullptr);
}

void AppSingleton::destroySurface() {
  WebGLRenderingContextBase *context = contextAtomic_.load();
  if (context) {
    context->destroySurface();
  }
  surfaceNativeWindow_ = nullptr;
}

void AppSingleton::attachCurrentThread() {
#ifdef ANDROID
  if (app_) {
    app_->activity->vm->AttachCurrentThread(&env_, nullptr);
  }
#endif
}
void AppSingleton::detachCurrentThread() {
#ifdef ANDROID
  if (app_) {
    app_->activity->vm->DetachCurrentThread();
  }
#endif
}

}  // namespace internal
}  // namespace hgl

using namespace hgl::internal;

int WebGLRenderingContextBase::bytesPerRow(
  GLenum format, GLenum type, int width, int unpackRowLength) {
  // See UNPACK_ROW_LENGTH in the OpenGL ES 3.2 spec.
  const int a = unpack_alignment;
  const int s = bytesPerChannel(type);
  const int l = (unpackRowLength == 0) ? width : unpackRowLength;
  const int n = channelsPerPixel(format);

  if (s >= a) {
    return n * l * s;
  } else {
    return (a / s) * ((s * n * l + a - 1) / a);
  }
}

WebGLRenderingContextBase::WebGLRenderingContextBase()
    : cb_(c8::TransferBuffer(/* 128 MB TransferBuffer */ 128 * 1024 * 1024)),
#ifdef ANDROID
      app(nullptr),
      env(nullptr),
#endif
      unpack_flip_y(false),
      unpack_premultiply_alpha(false),
      unpack_colorspace_conversion(0),
      unpack_alignment(4),
      context(EGL_NO_CONTEXT),
      config(nullptr),
      surface(EGL_NO_SURFACE),
      state(GLCONTEXT_STATE_OK),
      CONTEXT_LIST_HEAD(nullptr) {
}

void WebGLRenderingContextBase::startCommandBufferThread() {
  cb_.startThread([](c8::GlBuffer *glBuffer) {
    auto &app = AppSingleton::getInstance();
    app.attachCurrentThread();
    c8::GlBuffer::startThreadFunc(glBuffer);
    app.detachCurrentThread();
  });
}

WebGLRenderingContextBase::~WebGLRenderingContextBase() {
  Nan::HandleScope();

  while (CONTEXT_LIST_HEAD) {
    CONTEXT_LIST_HEAD->dispose();
  }
}

void WebGLRenderingContextBase::setToReadyState() { state = GLCONTEXT_STATE_OK; }

unsigned char *WebGLRenderingContextBase::unpackPixels(
  unsigned int type, unsigned int format, int width, int height, unsigned char *pixels) {

  /* Compute pixel size */
  int pixelSize = 1;
  if (type == GL_UNSIGNED_BYTE || type == GL_FLOAT) {
    if (type == GL_FLOAT) {
      pixelSize = 4;
    }
    switch (format) {
      case GL_ALPHA:
      case GL_LUMINANCE:
        break;
      case GL_LUMINANCE_ALPHA:
        pixelSize *= 2;
        break;
      case GL_RGB:
        pixelSize *= 3;
        break;
      case GL_RGBA:
        pixelSize *= 4;
        break;
    }
  } else {
    pixelSize = 2;
  }

  /* Compute row stride */
  int rowStride = pixelSize * width;
  if ((rowStride % unpack_alignment) != 0) {
    rowStride += unpack_alignment - (rowStride % unpack_alignment);
  }

  int imageSize = rowStride * height;
  unsigned char *unpacked = new unsigned char[imageSize];

  if (unpack_flip_y) {
    for (int i = 0, j = height - 1; j >= 0; ++i, --j) {
      memcpy(
        reinterpret_cast<void *>(unpacked + j * rowStride),
        reinterpret_cast<void *>(pixels + i * rowStride),
        width * pixelSize);
    }
  } else {
    memcpy(reinterpret_cast<void *>(unpacked), reinterpret_cast<void *>(pixels), imageSize);
  }

  /* Premultiply alpha unpacking */
  if (unpack_premultiply_alpha && (format == GL_LUMINANCE_ALPHA || format == GL_RGBA)) {

    for (int row = 0; row < height; ++row) {
      for (int col = 0; col < width; ++col) {
        unsigned char *pixel = unpacked + (row * rowStride) + (col * pixelSize);
        if (format == GL_LUMINANCE_ALPHA) {
          pixel[0] *= pixel[1] / 255.0;
        } else if (type == GL_UNSIGNED_BYTE) {
          float scale = pixel[3] / 255.0;
          pixel[0] *= scale;
          pixel[1] *= scale;
          pixel[2] *= scale;
        } else if (type == GL_UNSIGNED_SHORT_4_4_4_4) {
          int r = pixel[0] & 0x0f;
          int g = pixel[0] >> 4;
          int b = pixel[1] & 0x0f;
          int a = pixel[1] >> 4;

          float scale = a / 15.0;
          r *= scale;
          g *= scale;
          b *= scale;

          pixel[0] = r + (g << 4);
          pixel[1] = b + (a << 4);
        } else if (type == GL_UNSIGNED_SHORT_5_5_5_1) {
          if ((pixel[0] & 1) == 0) {
            pixel[0] = 1; /* why does this get set to 1?!?!?! */
            pixel[1] = 0;
          }
        }
      }
    }
  }

  return unpacked;
}

void WebGLRenderingContextBase::createSurface(void *nativeWindow, int width, int height) {
  if (surface != EGL_NO_SURFACE) {
    // If the surface is already created, we need to destroy it first.
    destroySurface();
  }
  // Create a new window surface.
  auto &app = AppSingleton::getInstance();
  if (nativeWindow) {
    surface = cb_.runSyncCommand(
      eglCreateWindowSurface, app.display(), config, (EGLNativeWindowType)nativeWindow, nullptr);
  } else {
    EGLint surfaceAttribs[] = {EGL_WIDTH, (EGLint)width, EGL_HEIGHT, (EGLint)height, EGL_NONE};
    surface = cb_.runSyncCommand(eglCreatePbufferSurface, app.display(), config, surfaceAttribs);
  }
  if (surface == EGL_NO_SURFACE) {
    C8Log("Failed to create EGL surface");
    state = GLCONTEXT_STATE_ERROR;
    return;
  }
  // Make the context current with the new surface.
  cb_.queueCommand(eglMakeCurrent, app.display(), surface, surface, context);
}

void WebGLRenderingContextBase::destroySurface() {
  if (surface == EGL_NO_SURFACE) {
    // Surface is already destroyed.
    return;
  }
  auto &app = AppSingleton::getInstance();
  cb_.queueCommand(eglMakeCurrent, app.display(), EGL_NO_SURFACE, EGL_NO_SURFACE, EGL_NO_CONTEXT);
  if (!cb_.runSyncCommand(eglDestroySurface, app.display(), surface)) {
    C8Log("Failed to destroy EGL surface");
  }
  surface = nullptr;
}
