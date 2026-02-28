// Copyright (c) 2023 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#pragma once

#include "c8/camera/device-infos.h"
#include "c8/io/capnp-messages.h"
#include "c8/pixels/opengl/gl-framebuffer.h"
#include "c8/pixels/pixel-buffer.h"
#include "reality/engine/api/reality.capnp.h"
#include "reality/engine/features/gl-reality-frame.h"

namespace c8 {

// A list of the pipeline processing stages run on independent threads.
enum class PipelineFrameStage {
  CAPTURE_AND_PROCESS_GPU = 0,
  PROCESS_CPU = 1,
  RENDER = 2,
};

struct PipelineAppConfiguration {
  int rotation = 0;  // -90, 0, 90 or 180.
  int captureWidth = 0;
  int captureHeight = 0;
  DeviceInfo::Reader deviceInfo;
  DeviceInfos::DeviceModel deviceModel;
  String deviceManufacturer;
};

struct FrameInputData {
  uint32_t cameraTexture = 0;
  ConstRootMessage<RealityRequest> request;
  ConstRootMessage<RealityResponse> response;
};

// Abstract class for a component that produces a bit of data by rendering on the gpu and reads it
// back.
class GpuDataProducer {
public:
  virtual void drawGl(FrameInputData &in) = 0;
  virtual void readGl() = 0;
  virtual ~GpuDataProducer() = default;
};

// Abstract class for rendering to a texture.
class GpuSceneRenderer {
public:
  virtual void renderDisplay() = 0;
  virtual GlTexture displayTex() = 0;
  virtual ~GpuSceneRenderer() = default;
};

// Base class for data produced in cpu processing, which can be used in rendering.
class CpuResult {
public:
  virtual ~CpuResult() = default;
};

// PipelineViewData holds a coherent set of computed data about a frame as it is processed on cpu,
// gpu, and rendered. This class delegates zero or more data producers for materializing data on
// each frame, and delegates rendering to exactly one GpuSceneRenderer.
//
// Usage:
//
// In an pipeline view that needs both features and a low res camera preview produced on the gpu,
// and which will be displaying an image of size 3*640 x 480, initialize the view's data as:
//
//   dataPtr.reset(new PipelineViewData()
//     ->addProducer(std::make_unique<FeaturesDataProducer>(appConfig, glShader))
//     ->addProducer(std::make_unique<CameraPreviewDataProducer>(appConfig, texCopier))
//     ->setRenderer(std::make_unique<PixelBufferTextureRenderer>(3 * 640, 480)));
class PipelineViewData {
public:
  // Fields from app configuration.
  int rotation() const { return appConfig_.rotation; }
  int captureWidth() const { return appConfig_.captureWidth; }
  int captureHeight() const { return appConfig_.captureHeight; }
  DeviceInfos::DeviceModel deviceModel() const { return appConfig_.deviceModel; }

  // Constructor.
  PipelineViewData(PipelineAppConfiguration appConfig) : appConfig_(appConfig) {}

  // Set code that can be used in the draw / read steps that can be accessed in the cpu processing
  // step.
  template <typename T>
  PipelineViewData *addProducer(std::unique_ptr<T> &&producer) {
    producers_[typeid(T).name()] = std::move(producer);
    return this;
  }

  template <typename T>
  const T &producer() const {
    return dynamic_cast<T &>(*producers_.at(typeid(T).name()));
  }

  template <typename T>
  T &producer() {
    return dynamic_cast<T &>(*producers_.at(typeid(T).name()));
  }

  // Set code that can be run during the render step.
  PipelineViewData *setRenderer(std::unique_ptr<GpuSceneRenderer> &&renderer);

  template <typename T>
  T &renderer() {
    return dynamic_cast<T &>(*renderer_);
  }

  // Data that can be passed from the cpu processing step to the render step.
  PipelineViewData *setCpuResult(std::unique_ptr<CpuResult> &&cpuProcessingResult);

  template <typename T>
  T &cpuProcessingResult() {
    return dynamic_cast<T &>(*cpuProcessingResult_);
  }

  // Lifecycle methods.
  void drawGl(FrameInputData &in);
  void readGl();
  void renderDisplay();

  // Results of this frame that should be displayed in the UI.
  // GlTexture displayTex() { return renderer_->displayTex(); }
  const FrameInputData &frameData() const { return frameDataCopy_; }

private:
  // Data producers and renderer.
  TreeMap<String, std::unique_ptr<GpuDataProducer>> producers_;
  std::unique_ptr<GpuSceneRenderer> renderer_;
  std::unique_ptr<CpuResult> cpuProcessingResult_;

  // Copied from the FrameInputData at the start of the frame.
  FrameInputData frameDataCopy_;
  PipelineAppConfiguration appConfig_;
};

struct FrameState {
  // Data about the frame (camera and sensors) at the time of capture.
  FrameInputData frameData;

  // Data that is owned by the view and will be marshalled through the pipeline stages by the
  // framework.
  std::unique_ptr<PipelineViewData> viewData;
};

// The state data required for capture, process, and render on each camera frame.
struct PipelineFrame {
  PipelineFrame(int captureWidth, int captureHeight);

  // Default move constructors.
  PipelineFrame(PipelineFrame &&) = default;
  PipelineFrame &operator=(PipelineFrame &&) = default;

  // Disallow copying.
  PipelineFrame(const PipelineFrame &) = delete;
  PipelineFrame &operator=(const PipelineFrame &) = delete;

  // An RGBA Framebuffer and Texture used for rendering to the display.
  GlFramebufferObject displayRgba;
  FrameState frame;
};

class PipelineView {
public:
  // Default constructor.
  PipelineView() = default;
  virtual ~PipelineView() noexcept(false) {}

  // Configuration, initialization, and optional cleanup function in headless mode
  virtual void configure(const PipelineAppConfiguration &appConfig) = 0;
  virtual void initialize(std::unique_ptr<PipelineViewData> &data) = 0;

  // Processing. By default omniscope views delegate to their data providers for these functions,
  // but they can override this behavior if needed.
  virtual void drawGl(FrameState &in);
  virtual void readGl(PipelineViewData *viewData);
  virtual void renderDisplay(PipelineViewData *viewData);
  // void updateScene(PipelineViewData *viewData);

  // Omniscope views typically override processCpu, but don't need to.
  virtual void processCpu(PipelineViewData *viewData){};

  // // Optional Input handlers.
  // virtual void gotTouches(const Vector<Touch> &touches){};

  // Default move constructors.
  PipelineView(PipelineView &&) = default;
  PipelineView &operator=(PipelineView &&) = default;

  // Disallow copying.
  PipelineView(const PipelineView &) = delete;
  PipelineView &operator=(const PipelineView &) = delete;

private:
};

}  // namespace c8
