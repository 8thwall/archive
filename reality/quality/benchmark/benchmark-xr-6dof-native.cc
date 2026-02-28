// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8/camera:device-infos",
    "//c8/geometry:intrinsics",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8:parameter-data",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/pixels:base64",
    "//c8/stats:logging-summaries",
    "//c8:parameter-data",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/protolog:xr-requests",
    "//reality/engine/api/device:info.capnp-cc",
    "//reality/engine/features:gl-reality-frame",
    "//reality/engine/logging:xr-log-preparer",
    "//reality/quality/benchmark:sensor-adjustment",
    "//reality/quality/datasets/measuredpose:measured-pose-eval",
    "//reality/quality/synthetic:synthetic-scenes",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
    "@cli11//:cli11",
    "@json//:json",
  };
  data = {
    "//reality/quality/benchmark:sequences",
  };
}
cc_end(0x7e7e2037);

#include <CLI/CLI.hpp>
#include <iostream>
#include <memory>
#include <nlohmann/json.hpp>
#include <optional>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/parameter-data.h"
#include "c8/pixels/base64.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/logging-summaries.h"
#include "reality/engine/features/gl-reality-frame.h"
#include "reality/engine/logging/xr-log-preparer.h"
#include "reality/quality/benchmark/sensor-adjustment.h"
#include "reality/quality/datasets/measuredpose/measured-pose-eval.h"
#include "reality/quality/synthetic/synthetic-scenes.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

using namespace c8;

namespace {
struct Settings {
  // Skip frames to simulate that the sequence was recorded at `desiredFps`.
  bool skipFrame;
  // Simulate slow fps when initializing.
  bool simulateSlowFpsWhenInitializing;
  int desiredFps;
};

const Settings &settings() {
  static int paramsVersion_ = -1;
  static Settings settings_;
  if (globalParams().version() == paramsVersion_) {
    return settings_;
  }
  settings_ = {
    globalParams().getOrSet("BenchmarkXr6dofNative.skipFrame", false),
    globalParams().getOrSet("BenchmarkXr6dofNative.simulateSlowFpsWhenInitializing", false),
    globalParams().getOrSet("BenchmarkXr6dofNative.desiredFps", -1),
  };
  paramsVersion_ = globalParams().version();
  return settings_;
}

// For `simulateSlowFpsWhenInitializing` mode, how much we slow down the `desiredFps` by. This
// models starting at `desiredFps` and then gradually dropping to 50% of `desiredFps` and comming
// back to `desiredFps`.
const Vector<float> INIT_SLOWDOWN{1.f, 0.7f, 0.6f, 0.55f, 0.5f, 0.5f, 0.55f, 0.6f, 0.7f, 0.9f};

std::optional<float> maybeValueFromSequenceJson(const String &sequenceName, const String &key) {
  const auto sequenceJsonFilePath = "reality/quality/benchmark/sequences.json";
  auto json = readJsonFile(sequenceJsonFilePath);
  if (!json.contains(sequenceName) || !json[sequenceName].contains(key)) {
    return {};
  }
  return json[sequenceName][key].get<float>();
}

}  // namespace

class BenchmarkCallback : public RealityStreamCallback {
public:
  BenchmarkCallback(
    const String &realitySrcName,
    const String &prebuiltMapSrc,
    std::optional<float> trueScaleValue = {},
    std::optional<float> baselineFps = {})
      : trueScaleValue_(trueScaleValue), baselineFps_(baselineFps) {
    if (settings().simulateSlowFpsWhenInitializing && !settings().skipFrame) {
      C8_THROW(
        "[benchmark-xr-6dof-native] Must set `skipFrame` to true if in "
        "`simulateSlowFpsWhenInitializing` mode.");
    }
    if (settings().skipFrame) {
      if (settings().desiredFps < 1 || *baselineFps_ < 1 || settings().desiredFps > *baselineFps_) {
        C8_THROW("[benchmark-xr-6dof-native] invalid setting for `skipFrame` mode");
      }
      desiredFpsFrameDelta_ = *baselineFps_ / static_cast<float>(settings().desiredFps);
    }
  }

  void modifyRequestMask(XRRequestMask::Builder mask) {
    if (trueScaleValue_) {
      mask.setEstimateScale(true);
    }
  }

  void processPreviousReality() {
    if (!gl.hasPyramid()) {
      return;
    }

    buildRealityRequestPyramid(gl.pyramid(), previousRequest_.builder());
    {
      ScopeTimer t("xr-engine-request-execute");
      eval_.addFrame(previousRequest_.builder(), previousResponse_.reader());
    }
  }

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader originalRequest,
    RealityResponse::Reader response) override {

    MutableRootMessage<RealityRequest> requestMessage(originalRequest);
    modifyRequestMask(requestMessage.builder().getXRConfiguration().getMask());
    if (settings().skipFrame) {
      // If we are skipping frames, save sensor events to a queue until we are ready to consume all
      // events on the next processed frame.
      savedEventQueues_.push_back(originalRequest.getSensors().getPose());
      if (rawStreamFrameNum_++ != static_cast<int>(std::round(nextFrameNumberToProcess_))) {
        // Skip this frame.
        return;
      } else {
        // Process this frame.
        setEventsOnFrame(savedEventQueues_, requestMessage.builder());
        savedEventQueues_.clear();
        rawStreamProcessedFrames_++;

        // Slow down the begining fps rate. If we have reached the end of `INIT_SLOWDOWN` that means
        // we are done simulating the initialization slowdown.
        if (
          settings().simulateSlowFpsWhenInitializing && initSlowdownIndex_ < INIT_SLOWDOWN.size()) {
          nextFrameNumberToProcess_ +=
            desiredFpsFrameDelta_ * (1.f / INIT_SLOWDOWN[initSlowdownIndex_++]);
        } else {
          nextFrameNumberToProcess_ += desiredFpsFrameDelta_;
        }
      }
    }
    auto request = requestMessage.reader();

    auto frame = request.getSensors().getCamera().getCurrentFrame();
    auto ypix = constFrameYPixels(frame);
    auto uvpix = constFrameUVPixels(frame);

    auto captureIntrinsics =
      Intrinsics::getCameraIntrinsics(DeviceInfos::getDeviceModel(request.getDeviceInfo()));
    if (!didInit) {
      didInit = true;
      if (glShader == nullptr) {
        glShader.reset(new Gr8FeatureShader());
        glShader->initialize();
      }
      gl.initialize(glShader.get(), ypix.cols(), ypix.rows(), 0);
      srcTex_.initialize();
    }
    if (copyBuffer == nullptr) {
      copyBuffer = new RGBA8888PlanePixelBuffer(ypix.rows(), ypix.cols());
    }

    if (synthName_ != "") {
      // Each frame, take the ARCore measured pose and drive the synthetic scene's camera.
      auto rawExtrinsic = response.getXRResponse().getCamera().getExtrinsic();
      currentExtrinsic_ = cameraMotion(
        toHVector(rawExtrinsic.getPosition()), toQuaternion(rawExtrinsic.getRotation()));

      // Initialization of synthetic data
      if (syntheticScene_ == nullptr) {
        // We will use this synthetic scene to replace the camera feed with our own scene of known
        // dimensions to compare our map generation against.
        syntheticScene_ = syntheticScene(synthName_, captureIntrinsics, ypix.cols(), ypix.rows());

        // Store a normalized into c8 world space version of the synthetic scene on the MeasuredPose
        // so it can compare the map against the synthetic scene.
        normalizedSceneContent_ = syntheticSceneContent(synthName_);
        synthToC8Scale_ = normalizeSyntheticSceneContent(normalizedSceneContent_.get());

        // Set the previous and current frame to the same extrinsic.  That way we aren't concerned
        // about teleports in the data on the first frame due to it being more than a meter away
        // from the origin.
        previousExtrinsic_ = currentExtrinsic_;
      }

      // Let ARCore drive the synthetic camera around the synthetic scene.
      syntheticScene_->find<Camera>().setLocal(currentExtrinsic_);
      synthRenderer_.render(*syntheticScene_.get());
      *copyBuffer = synthRenderer_.result();
    } else {
      // Use original color camera feed as input.
      ScopeTimer t("benchmark-decode-yuv");
      Color c = Color::BLACK;
      auto pix = copyBuffer->pixels();
      fill(c.r(), c.g(), c.b(), c.a(), &pix);
      yuvToRgb(ypix, uvpix, &pix);
    }

    glBindTexture(GL_TEXTURE_2D, srcTex_.texture);
    glTexImage2D(
      GL_TEXTURE_2D,
      0,
      GL_RGBA,
      ypix.cols(),
      ypix.rows(),
      0,
      GL_RGBA,
      GL_UNSIGNED_BYTE,
      copyBuffer->pixels().pixels());
    {
      ScopeTimer rt("benchmark-run");
      {
        ScopeTimer t("gr8-pyramid");
        gl.draw(srcTex_.texture, GlRealityFrame::Options::DEFER_READ);
      }

      processPreviousReality();
    }

    previousRequest_ = MutableRootMessage<RealityRequest>(request);
    previousResponse_ = ConstRootMessage<RealityResponse>(response);
    previousExtrinsic_ = currentExtrinsic_;
  }

  void processFinalFrame() {
    ScopeTimer rt("benchmark-run");
    gl.readPixels();
    processPreviousReality();
    if (settings().skipFrame) {
      C8Log(
        "[benchmark-xr-6dof-native] skipFrame=true: Processed `%d` out of `%d` possible frames. "
        "DesiredFps=%d, BaselineFps=%f",
        rawStreamProcessedFrames_,
        rawStreamFrameNum_,
        settings().desiredFps,
        *baselineFps_);
    }
  }

  float estimateScale() { return eval_.estimateScale(); }

  void setSyntheticScene(const String &synthName) { synthName_ = synthName; }

  void score() {
    // We do percentageTrackingError before pruningInitialResponsiveFrames so we don't
    // discount initial lost frames
    eval_.percentageTrackingToSummarizer("");
    eval_.anchoredMapPointPixelError(estimateScale(), "");
    eval_.predictedMotionErrorToSummarizer("");
    eval_.absoluteTrajectoryErrorToSummarizer("", true);
    if (trueScaleValue_) {
      eval_.scaleErrorToSummarizer("", *trueScaleValue_);
    }
  }

private:
  bool didInit = false;
  GlRealityFrame gl;
  std::unique_ptr<Gr8FeatureShader> glShader;
  RGBA8888PlanePixelBuffer *copyBuffer = nullptr;
  MeasuredPoseEval eval_;
  MutableRootMessage<RealityRequest> previousRequest_;
  Vector<ConstRootMessage<RequestPose>> savedEventQueues_;
  ConstRootMessage<RealityResponse> previousResponse_;
  GlTexture srcTex_;
  String synthName_;
  // The known true scale value for this benchmark if it exists.
  std::optional<float> trueScaleValue_;
  std::optional<float> baselineFps_;
  // Synthetic scene that we use to replace the camera feed.
  std::unique_ptr<Scene> syntheticScene_;
  // This is a duplicate of the synthetic scene's contents, however it is normalized into c8 space.
  std::unique_ptr<Group> normalizedSceneContent_;
  // Scale necessary to convert the synth scene into c8 world scene where the ground = -1.
  float synthToC8Scale_;

  Renderer synthRenderer_;
  HMatrix previousExtrinsic_ = HMatrixGen::i();
  HMatrix currentExtrinsic_ = HMatrixGen::i();

  /////////////////// Skip frame \\\\\\\\\\\\\\\\\\\\\/
  int rawStreamFrameNum_ = 0;
  int rawStreamProcessedFrames_ = 0;
  // How many frames we should skip until we should process the next frames.
  float desiredFpsFrameDelta_ = -1.f;
  // The next frame we should process.
  float nextFrameNumberToProcess_ = 0.f;
  // The index into `INIT_SLOWDOWN` which tells us how much to slow down the fps
  // by if we are in `simulateSlowFpsWhenInitializing` mode.
  int initSlowdownIndex_ = 0;
  /////////////////// Skip frame \\\\\\\\\\\\\\\\\\\\\/
};

String getBase64SessionLogBytes(const String &realitySrcName, const String &commitHash) {
  capnp::MallocMessageBuilder logRecordHeaderMessage;
  auto headerBuilder = logRecordHeaderMessage.initRoot<LogRecordHeader>();
  // Use sequence name + time as the session identifier.
  std::stringstream ss;
  ss << time(NULL);
  headerBuilder.getApp().setSessionId(format("%s-%s", realitySrcName.c_str(), ss.str().c_str()));
  headerBuilder.getApp().setAppId("com.the8thwall.reality.quality.benchmark.benchmark-native");
  headerBuilder.getReality().setEngineVersion(commitHash);

  XRLogPreparer xrLogPreparer;
  std::unique_ptr<c8::Vector<uint8_t>> logBytes =
    xrLogPreparer.prepareLogForUpload(headerBuilder.asReader(), ScopeTimer::summarizer());
  return encode(*(logBytes.get()));
}

int main(int argc, char *argv[]) {
  CLI::App app{"benchmark-xr-6dof-native"};
  bool getSessionLogs = false;
  String commitHash;
  bool verbose = false;
  String realitySrc;
  String prebuiltMapSrc;
  String jsonString;
  String syntheticSceneName;
  auto commitHashOpt =
    app.add_option("--commitHash", commitHash, "Passed in the commit hash used to log to ES.");
  app.add_flag("--getSessionLogs", getSessionLogs, "Whether to get Base64 encoded session logs.")
    ->needs(commitHashOpt);
  app.add_flag("-v,--verbose", verbose, "Whether to print the benchmark output.");
  app.add_option("-j,--json", jsonString, "JSON string to update PARAMETER_DATA with.");
  app.add_option(
    "-s,--synth",
    syntheticSceneName,
    "Name of the synthetic scene you want to replace the camera feed");
  app
    .add_option(
      "-r,--realitySrc",
      realitySrc,
      "Source for reality, 'remote' for remote; 'stdin' for stdin, otherwise filename.")
    ->required();
  app.add_option("-m,--mapSrc", prebuiltMapSrc, "Prebuilt map to load at start of sequence");

  CLI11_PARSE(app, argc, argv);

  if (!jsonString.empty()) {
    globalParams().mergeJsonString(jsonString);
  }

  auto realitySrcName = realitySrc.substr(realitySrc.rfind("/") + 1, realitySrc.size());
  auto rStream = RealityStreamFactory::create(realitySrc);

  auto trueScaleValue = maybeValueFromSequenceJson(realitySrcName, "scale");
  auto baselineFps = maybeValueFromSequenceJson(realitySrcName, "fps");
  if (settings().skipFrame && !baselineFps.has_value()) {
    C8_THROW(
      "[benchmark-xr-6dof-native] 'fps' key not found in sequences.json for realitySrc: %s.",
      realitySrcName.c_str());
  }
  if (settings().skipFrame && settings().desiredFps > *baselineFps) {
    // This is not possible, return early.
    C8Log(
      "[benchmark-xr-6dof-native] Can not run realitySrc: %s because desiredFps(%d) > "
      "baselineFps(%f)",
      realitySrcName.c_str(),
      settings().desiredFps,
      *baselineFps);
    // 'key:used_params' and '/end/' used in tune-parameters.ts
    C8Log(
      "[benchmark-xr-6dof-native] key:used_params /end/%s", globalParams().toJsonString().c_str());
    C8Log("{}");
    return 0;
  }

  if (!fileExists(realitySrc)) {
    C8_THROW("[benchmark-xr-6dof-native] Reality source file not found: %s", realitySrc.c_str());
  }

  // Note: In the future if we need to we can add a vps field into sequences.json. Current
  // approach reduces overhead of adding sequences to sequences.json by just assuming all sequences
  // under vps/arkit are vps sequences. However, when we use a prebuilt map, we don't want VPS
  BenchmarkCallback benchmark(realitySrcName, prebuiltMapSrc, trueScaleValue, baselineFps);
  benchmark.setSyntheticScene(syntheticSceneName);

  C8Log("[benchmark-xr-6dof-native] Processing frames for %s.", realitySrcName.c_str());
  rStream->setCallback(&benchmark);
  rStream->spin();

  benchmark.processFinalFrame();

  benchmark.score();

  if (verbose) {
    C8Log("[benchmark-xr-6dof-native] Computed scale %f", benchmark.estimateScale());
    C8Log("[benchmark-xr-6dof-native] %s", "Done.");
    C8Log("[benchmark-xr-6dof-native] %s", "");
    C8Log("[benchmark-xr-6dof-native] %s", "");
    C8Log("[benchmark-xr-6dof-native] %s", "===================================");
    C8Log("[benchmark-xr-6dof-native] %s", "");
    C8Log("[benchmark-xr-6dof-native] %s", "");
    C8Log("[benchmark-xr-6dof-native] %s", "");
    ScopeTimer::logBriefSummary();
  }

  // 'key:used_params' and '/end/' used in tune-parameters.ts
  C8Log(
    "[benchmark-xr-6dof-native] key:used_params /end/%s", globalParams().toJsonString().c_str());
  nlohmann::json j;
  if (getSessionLogs && !commitHash.empty()) {
    j["base64LogBytes"] = getBase64SessionLogBytes(realitySrcName, commitHash);
  }
  auto &summarizer = *ScopeTimer::summarizer();
  auto perFrameError = summarizer.summary("/benchmark/counters/per-frame-error-1k");
  auto predictedMotionError =
    summarizer.summary("/benchmark/counters/per-frame-motion-prediction-cm-error-1k");
  auto absoluteTrajectoryError =
    summarizer.summary("/benchmark/counters/absolute-trajectory-error-1k");
  auto scaleError = summarizer.summary("/benchmark/counters/scale-error-1000k");
  auto scaleFirstFrameError =
    summarizer.summary("/benchmark/counters/scale-first-frame-error-1000k");
  auto scaleFirstFrameNumber = summarizer.summary("/benchmark/counters/scale-first-frame-number");
  auto percentageTracking = summarizer.summary("/benchmark/counters/percentage-tracking");
  auto engineLatency = summarizer.summary("/xr-engine");
  auto benchmarkLatency = summarizer.summary("/benchmark-run");
  auto pyramidLatency = summarizer.summary("/benchmark-run/gr8-pyramid");

  // Add scale metrics if the true-scale value for this sequence exists. Don't add slam related
  // metric errors since those aren't valid in this mode.
  if (trueScaleValue) {
    auto hasScale = hasCounter(scaleFirstFrameNumber.reader());
    j["scaleError"]["mean"] = hasScale ? counterMean(scaleError.reader()) * 1e-6 : -1;
    j["scaleError"]["q50"] = hasScale ? counterQuantile(.5, scaleError.reader()) * 1e-6 : -1;
    j["scaleError"]["q90"] = hasScale ? counterQuantile(.9, scaleError.reader()) * 1e-6 : -1;
    j["scaleError"]["q99"] = hasScale ? counterQuantile(.99, scaleError.reader()) * 1e-6 : -1;
    j["scaleError"]["firstFrameError"] =
      hasScale ? counterGetSingleValue(scaleFirstFrameError.reader()) * 1e-6 : -1;
    j["scaleError"]["firstFrameNumber"] =
      hasScale ? counterGetSingleValue(scaleFirstFrameNumber.reader()) : -1;
  } else {
    j["perFrameError"]["mean"] = counterMean(perFrameError.reader()) * 1e-3;
    j["perFrameError"]["q50"] = counterQuantile(.5, perFrameError.reader()) * 1e-3;
    j["perFrameError"]["q90"] = counterQuantile(.9, perFrameError.reader()) * 1e-3;
    j["perFrameError"]["q99"] = counterQuantile(.99, perFrameError.reader()) * 1e-3;

    // Root Mean Squared Error is the typical output of ATE.
    j["absoluteTrajectoryError"]["rmse"] = counterRootMean(absoluteTrajectoryError.reader(), 1e-3);
    j["absoluteTrajectoryError"]["mean"] = counterMean(absoluteTrajectoryError.reader()) * 1e-3;
    j["absoluteTrajectoryError"]["q50"] =
      counterQuantile(.5, absoluteTrajectoryError.reader()) * 1e-3;
    j["absoluteTrajectoryError"]["q90"] =
      counterQuantile(.9, absoluteTrajectoryError.reader()) * 1e-3;
    j["absoluteTrajectoryError"]["q99"] =
      counterQuantile(.99, absoluteTrajectoryError.reader()) * 1e-3;

    j["predictedMotionError"]["mean"] = counterMean(predictedMotionError.reader()) * 1e-3;
    j["predictedMotionError"]["q50"] = counterQuantile(.5, predictedMotionError.reader()) * 1e-3;
    j["predictedMotionError"]["q90"] = counterQuantile(.9, predictedMotionError.reader()) * 1e-3;
    j["predictedMotionError"]["q99"] = counterQuantile(.99, predictedMotionError.reader()) * 1e-3;
  }

  j["percentageTracking"]["mean"] = ratioMean(percentageTracking.reader()) * 1e2;

  j["xrEngineLatency"]["mean"] = latencyMean(engineLatency.reader()) * 1e-3;
  j["xrEngineLatency"]["q50"] = latencyQuantile(.5, engineLatency.reader()) * 1e-3;
  j["xrEngineLatency"]["q90"] = latencyQuantile(.9, engineLatency.reader()) * 1e-3;
  j["xrEngineLatency"]["q99"] = latencyQuantile(.99, engineLatency.reader()) * 1e-3;

  j["benchmarkLatency"]["mean"] = latencyMean(benchmarkLatency.reader()) * 1e-3;
  j["benchmarkLatency"]["q50"] = latencyQuantile(.5, benchmarkLatency.reader()) * 1e-3;
  j["benchmarkLatency"]["q90"] = latencyQuantile(.9, benchmarkLatency.reader()) * 1e-3;
  j["benchmarkLatency"]["q99"] = latencyQuantile(.99, benchmarkLatency.reader()) * 1e-3;

  // 'key:result' and '/end/' used in tune-parameters.ts
  C8Log("[benchmark-xr-6dof-native] key:result /end/%s", j.dump().c_str());
  return 0;
}
