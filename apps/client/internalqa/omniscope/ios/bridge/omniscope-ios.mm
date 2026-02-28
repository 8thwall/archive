// Copyright (c) 2024 Niantic, Inc.
// Original Author: Riyaan Bakhda (riyaanbakhda@nianticlabs.com)

#include "omniscope-ios.h"

#import <ARKit/ARKit.h>
#import <AVFoundation/AVFoundation.h>
#import <CoreImage/CoreImage.h>
#import <CoreVideo/CoreVideo.h>
#import <Metal/Metal.h>
#import <UIKit/UIKit.h>

#include "apps/client/internalqa/omniscope/native/pipeline/omniscope-pipeline.h"
#include "c8/c8-log.h"
#include "c8/exceptions.h"
#include "c8/io/capnp-messages.h"
#include "c8/pixels/opengl/egl.h"
#include "c8/pixels/opengl/gl-error.h"
#include "c8/pixels/opengl/gl.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/api-limits.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/scope-timer.h"
#include "reality/app/xr/ios/xr-ios-interface.h"

#include <memory>
#include <mutex>
#include <thread>

namespace {

bool isArKitSupported() {
  if (@available(iOS 11.0, *)) {
    return [ARWorldTrackingConfiguration isSupported];
  }

  return false;
}

bool isMetalSupported() {
  id<MTLDevice> device = MTLCreateSystemDefaultDevice();
  return (device);
}

}  // namespace

namespace c8 {

class OmniscopeIos : public RealityPostprocessor {
public:
  static void createInstance() {
    if (instance_ == nullptr) {
      instance_.reset(new OmniscopeIos());
    }
  }

  static OmniscopeIos *getInstance() {
    if (instance_ == nullptr) {
      C8_THROW("[omniscope-ios] Attempting to get the instance before it's created.");
    }
    return instance_.get();
  }

  static void destroyInstance() { instance_.reset(); }

  ~OmniscopeIos() {
    {
      std::unique_lock lock(mutex_);
      shutdown_ = true;
    }
    cv_.notify_all();
    processCpuThread_->join();
    renderThread_->join();

    OmniscopePipeline::destroyInstance();
  }

  void configure(const XRConfiguration::Reader &config) {
    auto *pipeline = OmniscopePipeline::getInstance();
    pipeline->configure(config);
  }

  void createCaptureContext(void *captureContext) {
    auto *pipeline = OmniscopePipeline::getInstance();
    pipeline->createCaptureContext(captureContext, false);
  }

  void destroyCaptureContext() {
    auto *pipeline = OmniscopePipeline::getInstance();
    pipeline->destroyCaptureContext();
  }

  void initializeCameraPipeline(int captureWidth, int captureHeight) {
    auto *pipeline = OmniscopePipeline::getInstance();
    pipeline->initializeCameraPipeline(captureWidth, captureHeight);

    cameraFramePixelBufferRGBA_.reset(new RGBA8888PlanePixelBuffer(captureHeight, captureWidth));
    std::memset(
      cameraFramePixelBufferRGBA_->pixels().pixels(),
      0,
      cameraFramePixelBufferRGBA_->pixels().rowBytes()
        * cameraFramePixelBufferRGBA_->pixels().rows());
  }

  // NOTE: Gets called in XRIos::pause().
  void pause() override {
    auto *pipeline = OmniscopePipeline::getInstance();
    pipeline->pause();

    // Pause all background threads.
    {
      std::unique_lock lock(mutex_);
      isRunning_ = false;
    }
    cv_.notify_all();
  }

  // NOTE: Gets called in XRIos::resume().
  void resume() override {
    auto *pipeline = OmniscopePipeline::getInstance();
    pipeline->resume();

    // Resume all background threads.
    {
      std::unique_lock lock(mutex_);
      isRunning_ = true;
    }
    cv_.notify_all();
  }

  // NOTE: Gets called in XRIos::pushRealityForward() after executing the request with the engine.
  RealityResponse::Reader update(
    RealityRequest::Reader request, RealityResponse::Reader respose) override {
    ScopeTimer t("omniscope-ios-handle-reality-update");

    auto *pipeline = OmniscopePipeline::getInstance();

    // Preprocess camera frame for OmniscopePipeline: convert the incoming frame from YUV format to
    // RGB(A) and then draw it onto the GL texture managed by OmniscopePipeline.
    // TODO(yuhsianghuang): Move to XRIos or OmnniscopeProcessor?
    {
      ScopeTimer t("preprocess-camera-frame");

      const auto cameraFrame = request.getSensors().getCamera().getCurrentFrame();
      const auto cameraFrameY = cameraFrame.getImage().getOneOf().getGrayImagePointer();
      const auto cameraFrameUV = cameraFrame.getUvImage().getOneOf().getGrayImagePointer();

      ConstYPlanePixels pixelsY(
        cameraFrameY.getRows(),
        cameraFrameY.getCols(),
        cameraFrameY.getBytesPerRow(),
        reinterpret_cast<uint8_t *>(cameraFrameY.getUInt8PixelDataPointer()));
      ConstUVPlanePixels pixelsUV(
        cameraFrameUV.getRows(),
        cameraFrameUV.getCols(),
        cameraFrameUV.getBytesPerRow(),
        reinterpret_cast<uint8_t *>(cameraFrameUV.getUInt8PixelDataPointer()));
      auto cameraFramePixelsRGBA = cameraFramePixelBufferRGBA_->pixels();

      yuvToRgb(pixelsY, pixelsUV, &cameraFramePixelsRGBA);

      GLint boundTexture = 0;
      glGetIntegerv(GL_TEXTURE_BINDING_2D, &boundTexture);
      glBindTexture(GL_TEXTURE_2D, pipeline->getSourceTexture());

      {
        ScopeTimer tt("opengl-draw-sub-image-rgba");
        glTexSubImage2D(
          GL_TEXTURE_2D,                  // target
          0,                              // level
          0,                              // x-offset
          0,                              // y-offset
          cameraFramePixelsRGBA.cols(),   // width
          cameraFramePixelsRGBA.rows(),   // height
          GL_RGBA,                        // format
          GL_UNSIGNED_BYTE,               // type
          cameraFramePixelsRGBA.pixels()  // data
        );
        checkGLError("[omniscope-ios] glTexSubImage2D");
      }

      glBindTexture(GL_TEXTURE_2D, static_cast<GLuint>(boundTexture));
    }

    // CAPTURE_AND_PROCESS_GPU stage
    constexpr float mtx[16] = {0};
    pipeline->processGlFrameAndStageRequest(mtx, request);

    // Here we simply return an empty RealityResponse because we don't have a RealityResponse before
    // the PROCESS_CPU stage is done. Plus, since the RealityResponse from Omniscope doesn't contain
    // XRResponse, XRIos won't handle it at all.
    return ConstRootMessage<RealityResponse>().reader();
  }

  void createBackgroundThreads(
    EGLDisplay eglDisplay, EGLSurface eglSurface, EGLContext eglContext) {
    if ((processCpuThread_ != nullptr) && (renderThread_ != nullptr)) {
      C8_THROW("[omniscope-ios] Background threads are already created.");
    }

    isRunning_ = false;

    // Thread for PROCESS_CPU stage.
    processCpuThread_ = std::make_unique<std::thread>([this]() {
      while (true) {
        {
          std::unique_lock lock(mutex_);
          cv_.wait(lock, [this] { return shutdown_ || isRunning_; });
          if (shutdown_) {
            return;
          }
        }

        // TODO(yuhsianghuang): Keep a copy of the response?
        auto *pipeline = OmniscopePipeline::getInstance();
        pipeline->executeStagedRequestAndGetSerializedResponsePtr();
      }
    });

    // Thread for RENDER stage.
    // TODO(yuhsianghuang): Manage EglDisplayLayerIos within OmniscopeIos, or even on renderThread_?
    renderThread_ = std::make_unique<std::thread>([this, eglDisplay, eglSurface, eglContext]() {
      // Bind the context to the render thread. This is essentially calling
      // EglDisplayLayerIos::makeCurrent().
      if (eglMakeCurrent(eglDisplay, eglSurface, eglSurface, eglContext) == EGL_FALSE) {
        C8Log("[omniscope-ios][renderThread] eglMakeCurrent failed: %d", eglGetError());
      }

      while (true) {
        {
          std::unique_lock lock(mutex_);
          cv_.wait(lock, [this] { return shutdown_ || isRunning_; });
          if (shutdown_) {
            return;
          }
        }

        auto *pipeline = OmniscopePipeline::getInstance();
        pipeline->renderFrameForDisplay();

        // Swap buffers to display the rendered frame on screen. This is essentially calling
        // EglDisplayLayerIos::present().
        if (eglSwapBuffers(eglDisplay, eglSurface) == EGL_FALSE) {
          C8Log("[omniscope-ios][renderThread] eglSwapBuffers failed: %d", eglGetError());
        }
      }
    });
  }

  int currentView() {
    auto *pipeline = OmniscopePipeline::getInstance();
    return pipeline->currentView();
  }

  void setView(int index) {
    auto *pipeline = OmniscopePipeline::getInstance();
    pipeline->setView(index);
  }

  void goNext() {
    auto *pipeline = OmniscopePipeline::getInstance();
    pipeline->goNext();
  }

  void goPrev() {
    auto *pipeline = OmniscopePipeline::getInstance();
    pipeline->goPrev();
  }

  void gotTouches(int count) {
    auto *pipeline = OmniscopePipeline::getInstance();
    pipeline->gotTouches(count);
  }

  std::unique_ptr<Vector<uint8_t>> getAndResetAnalyticsRecord(
    ConstRootMessage<LogRecordHeader> &logRecordHeader) {
    auto *pipeline = OmniscopePipeline::getInstance();
    return pipeline->getAndResetAnalyticsRecord(logRecordHeader.reader());
  }

private:
  OmniscopeIos() { OmniscopePipeline::createInstance(); }

  // Pointer to the singleton instance of this class.
  static std::unique_ptr<OmniscopeIos> instance_;

  // Pixel buffer for the incoming camera frames.
  std::unique_ptr<RGBA8888PlanePixelBuffer> cameraFramePixelBufferRGBA_;

  // Background threads.
  std::unique_ptr<std::thread> processCpuThread_;
  std::unique_ptr<std::thread> renderThread_;

  // For background threads synchronization.
  std::mutex mutex_;
  std::condition_variable cv_;
  bool shutdown_ = false;
  bool isRunning_ = false;
};

// Singleton OmniscopeIos instance.
std::unique_ptr<OmniscopeIos> OmniscopeIos::instance_ = nullptr;

}  // namespace c8

C8_PUBLIC
void c8OmniscopeIos_create() { OmniscopeIos::createInstance(); }

C8_PUBLIC
void c8OmniscopeIos_destroy() { OmniscopeIos::destroyInstance(); }

C8_PUBLIC
void c8OmniscopeIos_configureXR(struct c8_NativeByteArray *configBytes) {
  auto *omniscope = OmniscopeIos::getInstance();

  c8::ConstRootMessage<XRConfiguration> configMessage(configBytes->bytes, configBytes->size);

  return omniscope->configure(configMessage.reader());
}

C8_PUBLIC
void c8OmniscopeIos_configureXRLegacy(struct c8_XRConfigurationLegacy *config) {
  auto *omniscope = OmniscopeIos::getInstance();

  c8::MutableRootMessage<XRConfiguration> configMessage;
  auto configBuilder = configMessage.builder();
  setXRConfigurationLegacy(*config, &configBuilder);

  return omniscope->configure(configBuilder.asReader());
}

C8_PUBLIC
void c8OmniscopeIos_createCaptureContext(void *captureContext) {
  auto *omniscope = OmniscopeIos::getInstance();
  omniscope->createCaptureContext(captureContext);
}

C8_PUBLIC
void c8OmniscopeIos_destroyCaptureContext() {
  auto *omniscope = OmniscopeIos::getInstance();
  omniscope->destroyCaptureContext();
}

C8_PUBLIC
void c8OmniscopeIos_initializeCameraPipeline() {
  auto *omniscope = OmniscopeIos::getInstance();
  // TODO(yuhsianghuang): Get dimensions from XRIos instead of hardcoding.
  omniscope->initializeCameraPipeline(
    C8_API_LIMITS_IMAGE_PROCESSING_WIDTH, C8_API_LIMITS_IMAGE_PROCESSING_HEIGHT);
}

C8_PUBLIC
void c8OmniscopeIos_setXRRealityPostprocessor() {
  auto *xr = XRIos::getInstance();
  auto *omniscope = OmniscopeIos::getInstance();
  xr->setRealityPostprocessor(omniscope);
}

C8_PUBLIC
void c8OmniscopeIos_createBackgroundThreads(void *eglDisplay, void *eglSurface, void *eglContext) {
  auto *omniscope = OmniscopeIos::getInstance();
  omniscope->createBackgroundThreads(
    static_cast<EGLDisplay>(eglDisplay),
    static_cast<EGLSurface>(eglSurface),
    static_cast<EGLContext>(eglContext));
}

C8_PUBLIC
int c8OmniscopeIos_currentView() {
  auto *omniscope = OmniscopeIos::getInstance();
  return omniscope->currentView();
}

C8_PUBLIC
void c8OmniscopeIos_setView(int index) {
  auto *omniscope = OmniscopeIos::getInstance();
  omniscope->setView(index);
}

C8_PUBLIC
void c8OmniscopeIos_goNext() {
  auto *omniscope = OmniscopeIos::getInstance();
  omniscope->goNext();
}

C8_PUBLIC
void c8OmniscopeIos_goPrev() {
  auto *omniscope = OmniscopeIos::getInstance();
  omniscope->goPrev();
}

C8_PUBLIC
void c8OmniscopeIos_gotTouches(int count) {
  auto *omniscope = OmniscopeIos::getInstance();
  omniscope->gotTouches(count);
}

C8_PUBLIC
void c8OmniscopeIos_getAndResetAnalyticsRecord(struct c8_NativeByteArray *logRecordHeaderBytes) {
  auto *omniscope = OmniscopeIos::getInstance();

  c8::ConstRootMessage<LogRecordHeader> logRecordHeader(
    logRecordHeaderBytes->bytes, logRecordHeaderBytes->size);
  const auto serializedRecord = omniscope->getAndResetAnalyticsRecord(logRecordHeader);

  // Copy the serialized response into the provided byte array.
  *logRecordHeaderBytes = c8_NativeByteArray(
    static_cast<const void *>(serializedRecord->data()), serializedRecord->size());
}
