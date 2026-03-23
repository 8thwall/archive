#include <nan.h>

#define MINIAUDIO_IMPLEMENTATION
#include <v8.h>

#include <iostream>
#include <memory>
#include <mutex>
#include <queue>
#include <thread>
#include <unordered_map>

#include "miniaudio.h"

// Struct for storing audio data and playback status
struct AudioData {
  // Audio data is planar: all left channel samples followed by all right channel samples
  // [L1, L2, L3, ..., R1, R2, R3, ...]
  // TODO (alanCastillo): experiment with layout to improve cpu cache hit rate
  std::unique_ptr<float[]> data;
  uint32_t numChannels = 0;
  uint32_t frameCount = 0;

  std::mutex mutex;
};

// Struct for storing global audio device state
struct GlobalAudioDevice {
  ma_device device;
  bool isInitialized = false;
  bool isStarted = false;
};

GlobalAudioDevice &getGlobalAudioDevice() {
  static GlobalAudioDevice globalAudioDevice;
  return globalAudioDevice;
}

struct AudioPlayback {
  std::shared_ptr<AudioData> audioData;
  uint32_t currentFrame = 0;

  // distance gain * cone gain * gain from GainNodes
  float totalGain = 0.f;

  // Stereo panning
  float panLeftGain = 0.f;
  float panRightGain = 0.f;
  // true if azimuth is to the left, false if azimuth is to the right
  bool azimuthLeft = false;
  bool paused = false;
  bool finished = false;
  Nan::Callback *finishedCallback = nullptr;

  std::string toString() const {
    return "(currentFrame: " + std::to_string(currentFrame) + ", totalGain: "
      + std::to_string(totalGain) + ", panLeftGain: " + std::to_string(panLeftGain)
      + ", panRightGain: " + std::to_string(panRightGain) + ", azimuthLeft: "
      + (azimuthLeft ? "true" : "false") + ", paused: " + (paused ? "true" : "false")
      + ", finished: " + (finished ? "true" : "false") + ")";
  }
};

struct AudioDataCache {
  std::unordered_map<uint32_t, std::shared_ptr<AudioData>> cache;
};

AudioDataCache &getAudioDataCache() {
  static AudioDataCache audioDataCache;
  return audioDataCache;
}

std::shared_ptr<AudioData> &getAudioDataFromCache(uint32_t key, uint32_t totalSize) {
  auto &cache = getAudioDataCache().cache;
  auto it = cache.find(key);
  if (it == cache.end()) {
    auto newData = std::make_shared<AudioData>();
    newData->data = std::make_unique<float[]>(totalSize);
    auto [inserted_it, success] = cache.emplace(key, newData);
    return inserted_it->second;
  }
  return it->second;
}

void CleanupAudioDataCache() {
  std::cout << "[miniaudio-addon@CleanupAudioDataCache]" << std::endl;
  auto &cache = getAudioDataCache().cache;
  // Note: no need to delete AudioData->data because it is a unique ptr.
  cache.clear();
}

// Queue for handling audio finished events
std::queue<std::function<void()>> finishedCallbackEventQueue;
std::mutex finishedCallbackEventQueueMutex;
uv_async_t processQueueAsyncHandle;
std::atomic<bool> processQueueAsyncHandleInitialized = false;

struct DecoderAsyncData {
  uint32_t length = 0;
  uint32_t numberOfChannels = 0;
  uint32_t sampleRate = 0;
  uint32_t channelSize = 0;
  void *leftChannel = nullptr;
  void *rightChannel = nullptr;
};

// Map to keep track of active playbacks by their IDs.
// TODO(divya): we should never use global variables like this. need to implement proper memory
// management for these playbacks.
std::unordered_map<uint32_t, std::shared_ptr<AudioPlayback>> activePlaybacks;
std::vector<uint32_t> previouslyUnpausedPlaybacks;
using ActivePlaybacks = std::unordered_map<uint32_t, std::shared_ptr<AudioPlayback>>;

uint32_t idCounter = 1;

const int OUTPUT_CHANNELS = 2;
const int OUTPUT_FORMAT = 4;  // 32 bit floats ma_format_f32
const int DEFAULT_SAMPLE_RATE = 44100;

// Callback function for miniaudio device. This function mixes all active playbacks to create the
// final output buffer. reference: https://miniaud.io/docs/examples/simple_mixing.html
void dataCallback(ma_device *device, void *output, const void *input, ma_uint32 frameCount) {
  // Retrieve the map of active playbacks from pUserData
  auto *activePlaybacks = static_cast<ActivePlaybacks *>(device->pUserData);

  // Zero out the output buffer
  float *out = static_cast<float *>(output);
  memset(out, 0, frameCount * device->playback.channels * sizeof(float));

  for (auto it = activePlaybacks->begin(); it != activePlaybacks->end();) {
    auto &playback = it->second;

    // Skip invalid, null, or paused playback objects
    if (!playback || !playback->audioData || playback->paused) {
      ++it;
      continue;
    }

    if (playback->currentFrame >= playback->audioData->frameCount) {
      playback->finished = true;

      auto callback = playback->finishedCallback;
      auto callbackTask = [callback]() {
        Nan::HandleScope scope;
        v8::Local<v8::Value> argv[] = {};
        callback->Call(0, argv);
        delete callback;
      };
      // Add a task to the queue
      {
        std::lock_guard<std::mutex> lock(finishedCallbackEventQueueMutex);
        finishedCallbackEventQueue.push(callbackTask);
      }
      if (processQueueAsyncHandleInitialized) {
        uv_async_send(&processQueueAsyncHandle);
      }
    }

    // Remove finished playbacks from the map (finished can be set to true in StopAudio)
    if (playback->finished) {
      it = activePlaybacks->erase(it);
    } else {
      for (ma_uint32 frame = 0; frame < frameCount; ++frame) {
        // TODO(divya) : why do bad things happen if i remove this check?
        if (playback->currentFrame >= playback->audioData->frameCount) {
          playback->finished = true;
          continue;
        }

        // Ensure thread-safe access to gains
        std::lock_guard<std::mutex> lock(playback->audioData->mutex);

        // // https://webaudio.github.io/web-audio-api/#Spatialization-equal-power-panning
        //   if (azimuthLeft) {
        //       outputL = inputL + inputR * gainL;
        //       outputR = inputR * gainR;
        //   } else {
        //       outputL = inputL * gainL;
        //       outputR = inputR + inputL * gainR;
        //   }
        //   outputL = totalGain * outputL;
        //   outputR = totalGain * outputR;

        // Apply stereo gain for left and right channels
        float sampleL = playback->audioData->data[playback->currentFrame];
        float sampleR =
          playback->audioData->data[playback->audioData->frameCount + playback->currentFrame];

        if (playback->azimuthLeft) {
          // outputL
          out[frame * playback->audioData->numChannels + 0] +=
            (sampleL + playback->panLeftGain * sampleR) * playback->totalGain;
          // outputR
          out[frame * playback->audioData->numChannels + 1] +=
            (sampleR * playback->panRightGain) * playback->totalGain;
        } else {
          // outputL
          out[frame * playback->audioData->numChannels + 0] +=
            (sampleL * playback->panLeftGain) * playback->totalGain;
          // outputR
          out[frame * playback->audioData->numChannels + 1] +=
            (sampleR + playback->panRightGain * sampleL) * playback->totalGain;
        }
        playback->currentFrame++;
      }
      ++it;
    }
  }
}

DecoderAsyncData *decodeAudio(void *audioBuffer, size_t dataSize, uint32_t sampleRate) {
  ma_result result;
  ma_decoder decoder;
  ma_decoder_config config = ma_decoder_config_init(ma_format_f32, OUTPUT_CHANNELS, sampleRate);
  if (dataSize == 0 || !audioBuffer) {
    return NULL;
  }
  result = ma_decoder_init_memory(audioBuffer, dataSize, &config, &decoder);
  if (result != MA_SUCCESS) {
    ma_decoder_uninit(&decoder);
    return NULL;
  }

  ma_uint64 pLength;
  result = ma_decoder_get_length_in_pcm_frames(&decoder, &pLength);
  if (result != MA_SUCCESS) {
    ma_decoder_uninit(&decoder);
    return NULL;
  }

  if (pLength == 0) {
    return NULL;
  }

  int pcmDataSize = OUTPUT_FORMAT * pLength * OUTPUT_CHANNELS;

  void *pcmData = (void *)malloc(pcmDataSize);
  ma_uint64 framesRead;
  result = ma_decoder_read_pcm_frames(&decoder, pcmData, pLength, &framesRead);
  // decoder no longer needed here
  ma_decoder_uninit(&decoder);

  if (result != MA_SUCCESS) {
    free(pcmData);
    return NULL;
  }

  if (framesRead != pLength) {
    free(pcmData);
    return NULL;
  }
  int frameSize = OUTPUT_FORMAT * OUTPUT_CHANNELS;
  int dualChannelFrameSize = frameSize / OUTPUT_CHANNELS;
  int dualChannelSize = pcmDataSize / OUTPUT_CHANNELS;

  int framesToBeProcessed = (pcmDataSize / frameSize);
  if (pcmDataSize % frameSize != 0 || framesToBeProcessed != pLength) {
    free(pcmData);
    return NULL;
  }

  // allocate memory for left and right channels the copy channel data
  void *left = (void *)malloc(dualChannelSize);
  void *right = (void *)malloc(dualChannelSize);

  // audio is interleaved, so we need to de-interleave it
  int byteOffset = 0;
  auto rightPointer = static_cast<uint8_t *>(right);
  auto leftPointer = static_cast<uint8_t *>(left);
  auto pcmDataPointer = static_cast<uint8_t *>(pcmData);

  for (int i = 0; i < pcmDataSize; i += frameSize) {
    memcpy(leftPointer + byteOffset, pcmDataPointer + i, dualChannelFrameSize);
    memcpy(
      rightPointer + byteOffset, pcmDataPointer + i + dualChannelFrameSize, dualChannelFrameSize);
    byteOffset += dualChannelFrameSize;
  }

  free(pcmData);
  return new DecoderAsyncData{
    static_cast<uint32_t>(pLength),
    OUTPUT_CHANNELS,
    sampleRate,
    static_cast<uint32_t>(dualChannelSize),
    left,
    right};
};

// Worker class for decoding audio data
class DecodeAudioWorker : public Nan::AsyncWorker {
public:
  DecodeAudioWorker(
    Nan::Callback *callback, void *audioBuffer, size_t bufferLen, uint32_t sampleRate)
      : AsyncWorker(callback),
        audioBuffer(audioBuffer),
        bufferLength(bufferLen),
        sampleRate(sampleRate) {}

  ~DecodeAudioWorker() { free(audioBuffer); }

  void Execute() override {
    DecoderAsyncData *data = decodeAudio(audioBuffer, bufferLength, sampleRate);

    if (data == NULL) {
      SetErrorMessage("Failed to decode audio");
      return;
    }
    this->length = data->length;
    this->numberOfChannels = data->numberOfChannels;
    this->channelSize = data->channelSize;
    this->left = data->leftChannel;
    this->right = data->rightChannel;
    this->sampleRate = data->sampleRate;
    delete data;
  }

  void HandleOKCallback() override {
    v8::Local<v8::Object> outputObject = Nan::New<v8::Object>();
    Nan::Set(outputObject, Nan::New("sampleRate").ToLocalChecked(), Nan::New(this->sampleRate));
    Nan::Set(
      outputObject,
      Nan::New("numberOfChannels").ToLocalChecked(),
      Nan::New(this->numberOfChannels));
    Nan::Set(outputObject, Nan::New("length").ToLocalChecked(), Nan::New(this->length));
    Nan::Set(
      outputObject,
      Nan::New("left").ToLocalChecked(),
      Nan::NewBuffer(reinterpret_cast<char *>(this->left), this->channelSize).ToLocalChecked());
    Nan::Set(
      outputObject,
      Nan::New("right").ToLocalChecked(),
      Nan::NewBuffer(reinterpret_cast<char *>(this->right), this->channelSize).ToLocalChecked());

    v8::Local<v8::Value> argv[1] = {outputObject};
    Nan::Call(*callback, Nan::GetCurrentContext()->Global(), 1, argv).ToLocalChecked();
  }

  void HandleErrorCallback() override {
    // note we are assuming that the left and right channels were not passed to node
    if (left) {
      free(left);
    }
    if (right) {
      free(right);
    }
    v8::Local<v8::Value> argv[1] = {Nan::Error(ErrorMessage())};
    if (callback && !callback->IsEmpty()) {
      Nan::Call(*callback, Nan::GetCurrentContext()->Global(), 1, argv);
    }
  }

private:
  // input
  void *audioBuffer = nullptr;
  size_t bufferLength = 0;
  uint32_t sampleRate = 0;
  // output
  void *left = nullptr;
  void *right = nullptr;
  uint32_t numberOfChannels = 0;
  uint32_t length = 0;
  uint32_t channelSize = 0;
};

NAN_METHOD(DecodeAudio) {
  if (
    info.Length() < 3 || !info[0]->IsArrayBuffer() || !info[1]->IsNumber()
    || !info[2]->IsFunction()) {
    Nan::ThrowTypeError(
      "Expected 1st argument to be an (ArrayBuffer), 2nd argument to be a "
      "number (sampleRate) and 3rd callback (function)");
    return;
  }
  v8::Local<v8::ArrayBuffer> audioBuffer = info[0].As<v8::ArrayBuffer>();

  uint32_t sampleRate = Nan::To<uint32_t>(info[1]).FromJust();
  Nan::Callback *callback = new Nan::Callback(info[2].As<v8::Function>());

  const auto &contents = audioBuffer->GetBackingStore();
  size_t length = contents->ByteLength();

  void *workerAudioBuffer = malloc(length);
  if (!workerAudioBuffer) {
    Nan::ThrowError("Memory allocation failed");
    return;
  }
  memcpy(workerAudioBuffer, contents->Data(), length);

  Nan::AsyncQueueWorker(new DecodeAudioWorker(callback, workerAudioBuffer, length, sampleRate));
}

NAN_METHOD(PlayAudio) {
  if (
    info.Length() < 6 || !info[0]->IsArray() || !info[1]->IsNumber() || !info[2]->IsNumber()
    || !info[3]->IsNumber() || !info[4]->IsBoolean() || !info[5]->IsFunction()) {
    Nan::ThrowTypeError(
      "Expected (Float32Arrays, sampleRate, totalGain, leftGain, rightGain, "
      "azimuthLeft, finishedCallback).");
    return;
  }
  v8::Local<v8::Array> channels = v8::Local<v8::Array>::Cast(info[0]);
  float totalGain = Nan::To<double>(info[1]).FromJust();
  float panLeftGain = Nan::To<double>(info[2]).FromJust();
  float panRightGain = Nan::To<double>(info[3]).FromJust();
  bool azimuthLeft = Nan::To<bool>(info[4]).FromJust();
  Nan::Callback *finishedCallback = new Nan::Callback(info[5].As<v8::Function>());
  v8::Local<v8::Context> context = info.GetIsolate()->GetCurrentContext();

  // Create a new playback instance
  std::shared_ptr<AudioPlayback> playback = std::make_shared<AudioPlayback>();
  playback->finished = false;
  playback->finishedCallback = finishedCallback;

  uint32_t numChannels = channels->Length();
  uint32_t frameCount = 0;

  // Compute frameCount from the first channel
  v8::Local<v8::Value> firstChannelValue = channels->Get(context, 0).ToLocalChecked();
  v8::Local<v8::Float32Array> firstChannelData =
    v8::Local<v8::Float32Array>::Cast(firstChannelValue);
  frameCount = firstChannelData->Length();  // Assume all channels have the same length.

  // note(alancastillo): we are getting the identity hash from the v8 object.
  uint32_t bufferHash = channels->GetIdentityHash();

  // Setup AudioData and its 1D array to store the stereo audio data
  playback->audioData = getAudioDataFromCache(bufferHash, frameCount * numChannels);

  // Copy channel data to the contiguous 1D array
  for (uint32_t i = 0; i < numChannels; ++i) {
    v8::Local<v8::Value> channelValue = channels->Get(context, i).ToLocalChecked();
    v8::Local<v8::Float32Array> channelData = v8::Local<v8::Float32Array>::Cast(channelValue);

    v8::Local<v8::ArrayBuffer> buffer = channelData->Buffer();
    std::shared_ptr<v8::BackingStore> backingStore = buffer->GetBackingStore();

    memcpy(
      playback->audioData->data.get() + (i * frameCount),
      static_cast<float *>(backingStore->Data()) + (channelData->ByteOffset() / sizeof(float)),
      channelData->ByteLength());
  }

  playback->audioData->numChannels = numChannels;
  playback->audioData->frameCount = frameCount;
  playback->currentFrame = 0;
  playback->totalGain = totalGain;
  playback->panLeftGain = panLeftGain;
  playback->panRightGain = panRightGain;
  playback->azimuthLeft = azimuthLeft;

  if (idCounter == UINT32_MAX) {
    idCounter = 1;
  }
  uint32_t streamId = idCounter++;
  activePlaybacks[streamId] = playback;

  // Return the stream ID
  info.GetReturnValue().Set(Nan::New(streamId));
}

NAN_METHOD(UpdateGain) {
  if (
    info.Length() < 5 || !info[0]->IsNumber() || !info[1]->IsNumber() || !info[2]->IsNumber()
    || !info[3]->IsNumber() || !info[4]->IsBoolean()) {
    Nan::ThrowTypeError("Expected (streamId, totalGain, panLeftGain, panRightGain, panAzimuth).");
    return;
  }

  uint32_t streamId = Nan::To<uint32_t>(info[0]).FromJust();
  float totalGain = Nan::To<double>(info[1]).FromJust();
  float panLeftGain = Nan::To<double>(info[2]).FromJust();
  float panRightGain = Nan::To<double>(info[3]).FromJust();
  bool azimuthLeft = Nan::To<bool>(info[4]).FromJust();

  auto it = activePlaybacks.find(streamId);
  if (it == activePlaybacks.end() || !it->second || !it->second->audioData) {
    return;
  }

  std::lock_guard<std::mutex> lock(it->second->audioData->mutex);
  it->second->totalGain = totalGain;
  it->second->panLeftGain = panLeftGain;
  it->second->panRightGain = panRightGain;
  it->second->azimuthLeft = azimuthLeft;

  info.GetReturnValue().Set(Nan::Undefined());
}

NAN_METHOD(StopAudio) {
  std::cout << "[miniaudio-addon@StopAudio]" << std::endl;
  if (info.Length() < 1 || !info[0]->IsNumber()) {
    Nan::ThrowTypeError("Expected streamId.");
    return;
  }

  uint32_t streamId = Nan::To<uint32_t>(info[0]).FromJust();
  auto it = activePlaybacks.find(streamId);
  if (it == activePlaybacks.end() || !it->second) {
    return;
  }

  it->second->finished = true;
  info.GetReturnValue().Set(Nan::Undefined());
}

NAN_METHOD(PauseAudio) {
  std::cout << "[miniaudio-addon@PauseAudio]" << std::endl;
  if (info.Length() < 1 || !info[0]->IsNumber()) {
    Nan::ThrowTypeError("Expected streamId.");
    return;
  }

  uint32_t streamId = Nan::To<uint32_t>(info[0]).FromJust();
  auto it = activePlaybacks.find(streamId);
  if (it == activePlaybacks.end() || !it->second) {
    info.GetReturnValue().Set(Nan::False());
    return;
  }

  it->second->paused = true;
  info.GetReturnValue().Set(Nan::True());
}

NAN_METHOD(ResumeAudio) {
  std::cout << "[miniaudio-addon@ResumeAudio]" << std::endl;
  if (info.Length() < 1 || !info[0]->IsNumber()) {
    Nan::ThrowTypeError("Expected streamId.");
    return;
  }

  uint32_t streamId = Nan::To<uint32_t>(info[0]).FromJust();
  auto it = activePlaybacks.find(streamId);
  if (it == activePlaybacks.end() || !it->second) {
    info.GetReturnValue().Set(Nan::False());
    return;
  }
  it->second->paused = false;
  info.GetReturnValue().Set(Nan::True());
}

void InitializeGlobalAudioDevice() {
  std::cout << "[miniaudio-addon@InitializeGlobalAudioDevice]" << std::endl;
  GlobalAudioDevice &globalAudioDevice = getGlobalAudioDevice();
  if (!globalAudioDevice.isInitialized) {
    // Configure the device
    ma_device_config deviceConfig = ma_device_config_init(ma_device_type_playback);
    deviceConfig.playback.format = ma_format_f32;
    deviceConfig.playback.channels = OUTPUT_CHANNELS;
    deviceConfig.sampleRate = DEFAULT_SAMPLE_RATE;
    deviceConfig.dataCallback = dataCallback;
    deviceConfig.pUserData = &activePlaybacks;

    // Initialize the device
    if (ma_device_init(NULL, &deviceConfig, &globalAudioDevice.device) != MA_SUCCESS) {
      Nan::ThrowError("Failed to initialize playback device.");
      return;
    }
    globalAudioDevice.isInitialized = true;
  }

  if (!globalAudioDevice.isStarted) {
    // Start the device
    if (ma_device_start(&globalAudioDevice.device) != MA_SUCCESS) {
      Nan::ThrowError("Failed to start playback device.");
      return;
    }
    globalAudioDevice.isStarted = true;
  }
}

void CleanupGlobalAudioDevice() {
  std::cout << "[miniaudio-addon@CleanupGlobalAudioDevice]" << std::endl;
  GlobalAudioDevice &globalAudioDevice = getGlobalAudioDevice();
  if (globalAudioDevice.isStarted) {
    ma_device_stop(&globalAudioDevice.device);
    globalAudioDevice.isStarted = false;
  }
  if (globalAudioDevice.isInitialized) {
    ma_device_uninit(&globalAudioDevice.device);
    globalAudioDevice.isInitialized = false;
  }
}

void cleanupAudio() {
  std::cout << "[miniaudio-addon@cleanupAudio]" << std::endl;
  CleanupGlobalAudioDevice();
  CleanupAudioDataCache();
  // Free memory allocated for active playbacks
  for (auto it = activePlaybacks.begin(); it != activePlaybacks.end();) {
    auto &playback = it->second;
    if (playback->finishedCallback) {
      delete playback->finishedCallback;
    }
    it = activePlaybacks.erase(it);
  }

  uv_close(reinterpret_cast<uv_handle_t *>(&processQueueAsyncHandle), nullptr);
  processQueueAsyncHandleInitialized = false;
}

void pauseAllAudio() {
  previouslyUnpausedPlaybacks.clear();

  for (auto &kv : activePlaybacks) {
    std::cout << "[miniaudio-addon@pauseAllAudio] playbackId: " << kv.first << " "
              << kv.second->toString() << std::endl;
    if (kv.second && !kv.second->paused) {
      kv.second->paused = true;
      previouslyUnpausedPlaybacks.push_back(kv.first);
    }
  }

  // Stop the global audio device to ensure no audio output when app is backgrounded
  GlobalAudioDevice &globalAudioDevice = getGlobalAudioDevice();
  if (globalAudioDevice.isStarted) {
    ma_device_stop(&globalAudioDevice.device);
    globalAudioDevice.isStarted = false;
  }
}

void resumeAllAudio() {
  for (uint32_t playbackId : previouslyUnpausedPlaybacks) {
    auto it = activePlaybacks.find(playbackId);
    if (it != activePlaybacks.end() && it->second) {
      std::cout << "[miniaudio-addon@resumeAllAudio] playbackId: " << playbackId << " "
                << it->second->toString() << std::endl;
      it->second->paused = false;
    }
  }

  previouslyUnpausedPlaybacks.clear();

  // Restart the global audio device when resuming
  GlobalAudioDevice &globalAudioDevice = getGlobalAudioDevice();
  if (globalAudioDevice.isInitialized && !globalAudioDevice.isStarted) {
    if (ma_device_start(&globalAudioDevice.device) == MA_SUCCESS) {
      globalAudioDevice.isStarted = true;
    }
  }
}

void ProcessCallbackQueue(uv_async_t *handle) {
  std::queue<std::function<void()>> localQueue;

  {
    std::lock_guard<std::mutex> lock(finishedCallbackEventQueueMutex);
    std::swap(localQueue, finishedCallbackEventQueue);
  }

  while (!localQueue.empty()) {
    localQueue.front()();
    localQueue.pop();
  }
}

NAN_MODULE_INIT(InitMiniaudio) {
  InitializeGlobalAudioDevice();
  Nan::Set(
    target,
    Nan::New("miniaudioPlayAudio").ToLocalChecked(),
    Nan::GetFunction(Nan::New<v8::FunctionTemplate>(PlayAudio)).ToLocalChecked());
  Nan::Set(
    target,
    Nan::New("miniaudioUpdateGain").ToLocalChecked(),
    Nan::GetFunction(Nan::New<v8::FunctionTemplate>(UpdateGain)).ToLocalChecked());
  Nan::Set(
    target,
    Nan::New("miniaudioStopAudio").ToLocalChecked(),
    Nan::GetFunction(Nan::New<v8::FunctionTemplate>(StopAudio)).ToLocalChecked());
  Nan::Set(
    target,
    Nan::New("miniaudioPauseAudio").ToLocalChecked(),
    Nan::GetFunction(Nan::New<v8::FunctionTemplate>(PauseAudio)).ToLocalChecked());
  Nan::Set(
    target,
    Nan::New("miniaudioResumeAudio").ToLocalChecked(),
    Nan::GetFunction(Nan::New<v8::FunctionTemplate>(ResumeAudio)).ToLocalChecked());
  Nan::Set(
    target,
    Nan::New("miniaudioDecodeAudio").ToLocalChecked(),
    Nan::GetFunction(Nan::New<v8::FunctionTemplate>(DecodeAudio)).ToLocalChecked());

  // TODO(divya): when the addon is loaded using require instead of the initMiniaudioAddon
  // function below, there is currently no mechanism to unload it in the DOM and close this
  // handle. Uncomment this when we have a way to unload the addon.
  // https://niantic.atlassian.net/browse/J8W-4195
  // uv_async_init(uv_default_loop(), &processQueueAsyncHandle, ProcessCallbackQueue);
  // processQueueAsyncHandleInitialized = true;
}

v8::Local<v8::Object> initMiniaudioAddon(
  v8::Isolate *isolate, v8::Local<v8::Context> context, uv_loop_t *loop) {
  v8::Context::Scope context_scope(context);
  v8::Local<v8::Object> target = v8::Object::New(isolate);
  InitMiniaudio(target);

  // Cleanup the async handle if it was initialized already by InitMiniaudio()
  if (processQueueAsyncHandleInitialized) {
    uv_close(reinterpret_cast<uv_handle_t *>(&processQueueAsyncHandle), nullptr);
    processQueueAsyncHandleInitialized = false;
  }
  // Initialize the async handle for libuv using the event loop from the main app
  uv_async_init(loop, &processQueueAsyncHandle, ProcessCallbackQueue);
  processQueueAsyncHandleInitialized = true;

  return target;
}

NODE_MODULE(miniaudio_addon, InitMiniaudio)
