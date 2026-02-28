// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <deque>
#include <memory>
#include <typeinfo>

#include "apps/client/internalqa/omniscope/native/control-panel-element.h"
#include "apps/client/internalqa/omniscope/native/lib/color-palette.h"
#include "apps/client/internalqa/omniscope/native/lib/detection-image.h"
#include "apps/client/internalqa/omniscope/native/lib/view-widgets/scene-widgets.h"
#include "c8/camera/device-infos.h"
#include "c8/color.h"
#include "c8/io/capnp-messages.h"
#include "c8/pixels/opengl/gl-texture.h"
#include "c8/pixels/pixel-buffers.h"
#include "c8/pixels/render/lockable.h"
#include "c8/pixels/render/object8.h"
#include "c8/quaternion.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/api/device/info.capnp.h"
#include "reality/engine/imagedetection/detection-image-tracker.h"
#include "reality/engine/tracking/tracking-sensor-event.h"

namespace c8 {

using OmniDetectionImageMap = TreeMap<String, OmniDetectionImage>;
using ControlPanelConfig = TreeMap<String, ControlPanelElement>;

static const ColorPalette PALETTE = ColorPalette::defaultPalette();
static const ColorPalette LIGHT_PALETTE = ColorPalette::lightPalette();
static const ColorPalette DARK_PALETTE = ColorPalette::darkPalette();

// A simple table where Row ID has to be unique so the row will stay at relatively the same place in
// the table for easy visual inspection
struct Table {
  Vector<String> columns;                      // names of the columns
  TreeMap<String, Vector<String>> dataPerRow;  // rowID -> row data
  TreeMap<String, Color> highlights;           // rowID -> text color
};

struct AxisLimit {
  float minVal = 1.f;
  float maxVal = 0.f;
};

struct Axis {
  String name;
  AxisLimit limits;
};

enum class SeriesPlotType {
  LINE,
  SCATTER,
  BAR,
  STEM,
};

enum class SeriesPlotMarker {
  NONE,
  CIRCLE,
  SQUARE,
  DIAMOND,
  CROSS,
  PLUS,
  ASTERISK,
};

enum class PlotLocation {
  CENTER,
  N,
  S,
  W,
  E,
  NW,
  NE,
  SW,
  SE,
};

struct PlotSeries {
  Vector<float> xs;
  Vector<float> ys;
  SeriesPlotType type = SeriesPlotType::LINE;
  SeriesPlotMarker marker = SeriesPlotMarker::CIRCLE;
  float barWidth = 1.f;  // used with type=BAR
  Color color = {0, 0, 0, 0};
  bool startHidden = false;
};

struct LineSeries {
  Vector<float> data;
};

struct Annotation {
  String text;
  float x = 0.f;
  float y = 0.f;
  float shiftX = 0.f;
  float shiftY = 0.f;
};

struct SeriesPlot {
  TreeMap<String, PlotSeries> dataPerLine;
  String title;
  String description;
  Axis xAxis;
  Axis yAxis;
  TreeMap<String, LineSeries> vLines;
  TreeMap<String, LineSeries> hLines;
  TreeMap<String, Annotation> annotations;
  PlotLocation legendLocation = PlotLocation::NW;
};

struct AppConfiguration {
  int rotation = 0;  // -90, 0, 90 or 180.
  int captureWidth = 0;
  int captureHeight = 0;
  DeviceInfo::Reader deviceInfo;
  String realitySrcName;
  String prebuiltMapSrc;
  String builtMapOut;
  DeviceInfos::DeviceModel deviceModel;
  String deviceManufacturer;
  float responsiveToMetricScale = -1.f;
  OmniDetectionImageMap *imageTargets = nullptr;

  DetectionImagePtrMap detectionImages() {
    DetectionImagePtrMap images;
    if (imageTargets == nullptr) {
      return images;
    }
    for (auto it = imageTargets->begin(); it != imageTargets->end(); it++) {
      images.insert(std::make_pair(it->first, &it->second.detectionImage()));
    }
    return images;
  }

  String getNextImageTargetName(const String &currentName) {
    if (imageTargets == nullptr || currentName == "") {
      return "";
    }
    auto it = imageTargets->find(currentName);
    it++;

    if (it == imageTargets->end()) {
      it = imageTargets->begin();
    }
    return it->first;
  }
};

struct RecordedFrame {
  ConstRootMessage<RealityRequest> request;
  ConstRootMessage<RealityResponse> response;
};

struct FrameData {
  // Inputs to the pipeline stages provided by the framework.
  int64_t videoTimeNanos = 0;
  int64_t frameTimeNanos = 0;
  int64_t timeNanos = 0;
  uint32_t cameraTexture = 0;
  uint32_t cameraBuffer = 0;
  double latitude = 0.;
  double longitude = 0.;
  double horizontalAccuracy = 0.;
  Quaternion devicePose;
  ConstRootMessage<RequestPose> eventQueue;
  // For some tasks, it can be important to have access to the raw recorded frame. For example, it
  // may contain information from native AR frameworks. Views should take care with this data and
  // only use it when required. In particular, it may not be set at all (for live omniscope runtimes
  // that don't use pre-recorded data), or it may not contain any particular type of data depending
  // on the parameters of recording.
  RecordedFrame rawDataRecorderFrame;
};

// Abstract class for a component that produces a bit of data by rendering on the gpu and reads it
// back.
class GlDataProducer {
public:
  virtual void drawGl(FrameData &in) = 0;
  virtual void readGl() = 0;
  virtual ~GlDataProducer() = default;
};

// Abstract class for rendering to a texture.
class GlTextureRenderer {
public:
  virtual void renderDisplay() = 0;
  virtual GlTexture displayTex() = 0;
  virtual int displayBuffer() = 0;
  virtual ~GlTextureRenderer() = default;
};

// Base class for data produced in cpu processing, which can be used in rendering.
class CpuProcessingResult {
public:
  virtual ~CpuProcessingResult() = default;
};

enum NotificationType {
  NOTIF_NONE,
  NOTIF_SUCCESS,
  NOTIF_WARNING,
  NOTIF_ERROR,
  NOTIF_INFO,
  NOTIF_COUNT
};

struct OmniscopeNotification {
  NotificationType type;
  int dismissTimeMs;
  String message;
};

// OmniscopeViewData holds a coherent set of computed data about a frame as it is processed on cpu,
// gpu, and rendered. This class delegates zero or more data producers for materializing data on
// each frame, and delegates rendering to exactly one GlTextureRenderer.
//
// Usage:
//
// In an omniscope view that needs both features and a low res camera preview produced on the gpu,
// and which will be displaying an image of size 3*640 x 480, initialize the view's data as:
//
//   dataPtr.reset(new OmniscopeViewData()
//     ->addProducer(std::make_unique<FeaturesDataProducer>(appConfig, glShader))
//     ->addProducer(std::make_unique<CameraPreviewDataProducer>(appConfig, texCopier))
//     ->setRenderer(std::make_unique<PixelBufferTextureRenderer>(3 * 640, 480)));
//
// Later, to access values, call:
//
//   auto pyramid = data->producer<FeaturesDataProducer>().pyramid();
//   auto camPixels = data->producer<CameraPreviewDataProducer>().cameraPreview();
//   auto displayPixels = data->renderer<PixelBufferTextureRenderer>().displayBuf();
//
// Some renderers can be configured to take in references to images or textures owned by data
// producers, to avoid unneeded copies or other efficiency bottlenecks. For example, to render
// the camera preview buffer directly:
//
//   // Create view data that gets features and camera preview, and renders camera preview buffer.
//   dataPtr.reset(new OmniscopeViewData(appConfig)
//     ->addProducer(std::make_unique<FeaturesDataProducer>(appConfig, glShader))
//     ->addProducer(std::make_unique<CameraPreviewDataProducer>(appConfig, texCopier))
//     ->setRenderer(std::make_unique<ProducedPixelsTextureRenderer>()));
//
//   // Tell the renderer to draw the image buffer containing the camera feed low res preview. If
//   // the view modifies this feed, any modifications will also be displayed.
//   dataPtr->renderer<ProducedPixelsTextureRenderer>().setPixels(
//     dataPtr->producer<CameraPreviewDataProducer>().cameraPreview());
class OmniscopeViewData {
public:
  // Fields from frame input.
  int64_t videoTimeNanos() const { return frameDataCopy_.videoTimeNanos; }
  int64_t frameTimeNanos() const { return frameDataCopy_.frameTimeNanos; }
  int64_t timeNanos() const { return frameDataCopy_.timeNanos; }
  double latitude() const { return frameDataCopy_.latitude; }
  double longitude() const { return frameDataCopy_.longitude; }
  double horizontalAccuracy() const { return frameDataCopy_.horizontalAccuracy; }
  Quaternion devicePose() const { return frameDataCopy_.devicePose; }
  RequestPose::Reader eventQueue() const { return frameDataCopy_.eventQueue.reader(); }
  uint32_t cameraTexture() const { return frameDataCopy_.cameraTexture; }
  const RecordedFrame &rawDataRecorderFrame() const { return frameDataCopy_.rawDataRecorderFrame; }

  // Fields from app configuration.
  int rotation() const { return appConfig_.rotation; }
  int captureWidth() const { return appConfig_.captureWidth; }
  int captureHeight() const { return appConfig_.captureHeight; }
  DeviceInfos::DeviceModel deviceModel() const { return appConfig_.deviceModel; }
  const OmniDetectionImageMap *imageTargets() const { return appConfig_.imageTargets; }

  // Constructor.
  OmniscopeViewData(AppConfiguration appConfig) : appConfig_(appConfig) {}

  // Set code that can be used in the draw / read steps that can be accessed in the cpu processing
  // step.
  template <typename T>
  OmniscopeViewData *addProducer(std::unique_ptr<T> &&producer) {
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
  OmniscopeViewData *setRenderer(std::unique_ptr<GlTextureRenderer> &&renderer);

  template <typename T>
  T &renderer() {
    return dynamic_cast<T &>(*renderer_);
  }

  // Data that can be passed from the cpu processing step to the render step.
  OmniscopeViewData *setCpuProcessingResult(
    std::unique_ptr<CpuProcessingResult> &&cpuProcessingResult);

  template <typename T>
  T &cpuProcessingResult() {
    return dynamic_cast<T &>(*cpuProcessingResult_);
  }

  // Lifecycle methods.
  void drawGl(FrameData &in);
  void readGl();
  void renderDisplay();

  // Results of this frame that should be displayed in the UI.
  GlTexture displayTex() { return renderer_->displayTex(); }
  int displayBuffer() { return renderer_->displayBuffer(); }

  const TreeMap<String, String> &text() const { return text_; }
  void setText(const String &tag, const String &content) { text_[tag] = content; }
  void clearText(const String &tag) { text_.erase(tag); }

  const TreeMap<String, SeriesPlot> &seriesPlots() const { return seriesPlots_; }
  SeriesPlot &mutableSeriesPlot(const String &tag) { return seriesPlots_[tag]; }
  void setSeriesPlot(const String &tag, const SeriesPlot &seriesPlot) {
    seriesPlots_[tag] = seriesPlot;
  }

  const TreeMap<String, Table> &tables() const { return tables_; }
  Table &mutableTable(const String &tag) { return tables_[tag]; }
  void setTable(const String &tag, const Table &table) { tables_[tag] = table; }

  const TreeMap<String, RGBA8888PlanePixelBuffer> &images() const { return images_; };
  RGBA8888PlanePixels mutableImage(const String &tag, int rows, int cols);
  void setImage(const String &tag, ConstRGBA8888PlanePixels image) {
    images_[tag] = clonePixels(image);
  }

private:
  // Data producers and renderer.
  TreeMap<String, std::unique_ptr<GlDataProducer>> producers_;
  std::unique_ptr<GlTextureRenderer> renderer_;
  std::unique_ptr<CpuProcessingResult> cpuProcessingResult_;

  // Copied from the FrameData at the start of the frame.
  FrameData frameDataCopy_;
  AppConfiguration appConfig_;

  // Data owned by the viewdata.
  TreeMap<String, String> text_;
  TreeMap<String, SeriesPlot> seriesPlots_;
  TreeMap<String, Table> tables_;
  TreeMap<String, RGBA8888PlanePixelBuffer> images_;
};

struct FrameInput {
  // Data about the frame (camera and sensors) at the time of capture.
  FrameData frameData;

  // Data that is owned by the view and will be marshalled through the pipeline stages by the
  // framework.
  std::unique_ptr<OmniscopeViewData> viewData;
};

struct Touch {
  float x = -1.0f;
  float y = -1.0f;
};

class OmniscopeView {
public:
  // Default constructor.
  OmniscopeView() = default;
  virtual ~OmniscopeView() noexcept(false) {}

  // Properties
  virtual String name() = 0;

  // Configuration, initialization, and optional cleanup function in headless mode
  virtual void configure(const AppConfiguration &appConfig) = 0;
  virtual void initialize(std::unique_ptr<OmniscopeViewData> &data) = 0;

  // Processing. By default omniscope views delegate to their data providers for these functions,
  // but they can override this behavior if needed.
  virtual void drawGl(FrameInput &in);
  virtual void readGl(OmniscopeViewData *viewData);
  virtual void renderDisplay(OmniscopeViewData *viewData);
  void updateScene(OmniscopeViewData *viewData);

  // This function can be optionally overriden and reimplemented by omniscope views.
  // It is only called at the end of a sequence in omniscope headless
  virtual void onEndOfSequence() {}

#ifdef JAVASCRIPT
  // Passes in mesh data into the view.  This is needed for OmniscopeJS and VPS views.
  virtual void setNewMeshesFromJs(
    const char *nodeId,
    float *points,
    int pointsLength,
    float *colors,
    int colorsLength,
    uint32_t *triangles,
    int trianglesLength) {}
#endif

  void pushNotification(NotificationType type, int dismissTimeMs, const char *message, ...);
  bool hasNotification();
  OmniscopeNotification popNotification();

  // Omniscope views typically override processCpu, but don't need to.
  virtual void processCpu(OmniscopeViewData *viewData) {}

  // Optional Input handlers.
  virtual void gotTouches(const Vector<Touch> &touches) {}

  // Optional handle key, returns true if redraw is required
  virtual bool handleKey(int key) { return false; }

  // Default move constructors.
  OmniscopeView(OmniscopeView &&) = default;
  OmniscopeView &operator=(OmniscopeView &&) = default;

  // Disallow copying.
  OmniscopeView(const OmniscopeView &) = delete;
  OmniscopeView &operator=(const OmniscopeView &) = delete;

  // Control panel elements.
  std::shared_ptr<ControlPanelConfig> controlPanelConfigPtr() { return controlPanelConfig_; }
  ControlPanelConfig &controlPanelConfig() { return *controlPanelConfig_; }

  void setSyntheticSceneName(const String &syntheticSceneName) {
    syntheticSceneName_ = syntheticSceneName;
  }

  const String &syntheticSceneName() const { return syntheticSceneName_; }

  bool hasSyntheticScene() const {
    return syntheticSceneName_ != "" && syntheticSceneName_ != "None";
  }

  // Scene.
  std::shared_ptr<Lockable<Scene>> lockableScene() { return scene_; }
  Scene *scenePtr() { return scene_->ptr(); }
  Scene &scene() { return scene_->ref(); }

private:
  std::shared_ptr<ControlPanelConfig> controlPanelConfig_ = std::make_shared<ControlPanelConfig>();
  std::shared_ptr<Lockable<Scene>> scene_ =
    std::shared_ptr<Lockable<Scene>>(new Lockable<Scene>(std::make_unique<Scene>()));

  String syntheticSceneName_;
  std::deque<OmniscopeNotification> notifications_;
};

SeriesPlot &seriesPlot(
  OmniscopeViewData *data,
  const String &window,
  const String &title,
  const Axis &xAxis,
  const Axis &yAxis);

void addLine(
  SeriesPlot &p,
  const String &name,
  const Vector<float> &xs,
  const Vector<float> &ys,
  bool startHidden);

void addLine(
  SeriesPlot &p,
  const String &name,
  const Vector<float> &xs,
  const Vector<float> &ys,
  Color color = {0, 0, 0, 0},
  SeriesPlotType type = SeriesPlotType::LINE,
  SeriesPlotMarker marker = SeriesPlotMarker::CIRCLE,
  bool startHidden = false);

// Add vertical lines at vals locations
void addVLines(SeriesPlot &p, const String &name, const Vector<float> &vals);

// Add horizontal lines at vals locations
void addHLines(SeriesPlot &p, const String &name, const Vector<float> &vals);

// Add a text annotation to a location (x,y) with the label shifted by (shiftX, shiftY)
// @param name uniquely identify this annotation for plot p. This way you can update your annotation
// content and location each frame.
void addAnnotation(
  SeriesPlot &p,
  const String &name,
  float x,
  float y,
  float shiftX,
  float shiftY,
  const String &text);

}  // namespace c8
