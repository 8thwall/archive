// Copyright (c) 2025 Niantic, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)

#include "c8/html-shell/node-binding.h"

#include <node.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <uv.h>
#include <v8.h>

#include <filesystem>
#include <fstream>
#include <vector>

#include "c8/c8-log.h"
#include "c8/html-shell/dom-events.h"
#include "c8/html-shell/event-dispatcher.h"
#include "c8/html-shell/node-binding-state.h"
#include "c8/html-shell/sensor-event-data.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "external/miniaudio-addon/miniaudio-addon.h"
#include "third_party/headless-gl/src/native/bindings.h"

using c8::AnimationFrameCallback;
using c8::C8Log;
using c8::NodeBindingData;
using c8::NodeBindingState;
using c8::String;
using c8::Vector;

using node::CommonEnvironmentSetup;
using v8::V8;

namespace node {
extern int Start(int argc, char *argv[]);
}  // namespace node

namespace {

static NodeBindingState *GetNodeBindingState() {
  static NodeBindingState *state = new NodeBindingState();
  return state;
}

static void ResetNodeBindingState() {
  NodeBindingState *state = GetNodeBindingState();
  state->args.clear();
  state->env = nullptr;
  state->nativeWindow = nullptr;
}

void doRender(NodeBindingState *state, int64_t frameTimeNanos) {
  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  v8::HandleScope handleScope(isolate);

  const double millis = (frameTimeNanos - state->globalStartTime) * 1e-6;

  // NOTE(christoph): If additional callbacks are requested, we shouldn't call them yet.
  size_t currentCallbackCount = state->animationFrameCallbackQueue.size();

  for (size_t i = 0; i < currentCallbackCount; ++i) {
    AnimationFrameCallback &callback = state->animationFrameCallbackQueue[i];
    if (callback.cancelled) {
      continue;
    }
    v8::Local<v8::Function> function = v8::Local<v8::Function>::New(isolate, *callback.callback);
    v8::Local<v8::Value> timestamp = v8::Number::New(isolate, millis);
    v8::Local<v8::Value> argv[] = {timestamp};

    v8::TryCatch try_catch(isolate);
    v8::MaybeLocal<v8::Value> result =
      function->Call(isolate->GetCurrentContext(), v8::Undefined(isolate), 1, argv);

    // TODO(akashmahesh): Errors should be displayed for dev visibility in non-prod environments.
    if (result.IsEmpty()) {
      if (try_catch.HasCaught()) {
        v8::String::Utf8Value error(isolate, try_catch.Exception());
        v8::String::Utf8Value stack_trace(
          isolate,
          try_catch.StackTrace(isolate->GetCurrentContext()).FromMaybe(v8::Local<v8::Value>()));
        C8Log("[node-binding] Animation frame callback error: %s", *error);
        if (stack_trace.length() > 0) {
          C8Log("[node-binding] Stack trace: %s", *stack_trace);
        }
      } else {
        C8Log("[node-binding] Animation frame callback returned empty result without exception");
      }
      continue;
    }
  }

  // TODO(lynn) Swap buffers.

  state->animationFrameCallbackQueue.erase(
    state->animationFrameCallbackQueue.begin(),
    state->animationFrameCallbackQueue.begin() + currentCallbackCount);
}

// Define a callback function for requestAnimationFrame.
void requestAnimationFrame(const v8::FunctionCallbackInfo<v8::Value> &args) {
  v8::Isolate *isolate = args.GetIsolate();
  v8::Local<v8::Function> callback = args[0].As<v8::Function>();

  std::unique_ptr<v8::Persistent<v8::Function>> persistentCallback(
    new v8::Persistent<v8::Function>(isolate, callback));

  NodeBindingState *state = GetNodeBindingState();
  const uint32_t id = state->nextAnimationFrameId++;

  state->animationFrameCallbackQueue.emplace_back(
    AnimationFrameCallback{.id = id, .callback = std::move(persistentCallback)});

  args.GetReturnValue().Set(v8::Number::New(isolate, id));
}

void cancelAnimationFrame(const v8::FunctionCallbackInfo<v8::Value> &args) {
  v8::Local<v8::Number> callbackId = args[0].As<v8::Number>();

  NodeBindingState *state = GetNodeBindingState();
  uint32_t id = callbackId->Value();

  for (auto &callback : state->animationFrameCallbackQueue) {
    if (callback.id == id) {
      callback.cancelled = true;
      return;
    }
  }
}

void eventListenerUpdate(const v8::FunctionCallbackInfo<v8::Value> &args) {
  v8::Isolate *isolate = args.GetIsolate();

  const c8::String eventString = *v8::String::Utf8Value(isolate, args[0].As<v8::String>());
  const bool eventOccurrences = args[1].As<v8::Boolean>()->Value();

  NodeBindingState *state = GetNodeBindingState();

  state->eventListenerUpdateCallback(eventString, eventOccurrences);
}

void vibration(const v8::FunctionCallbackInfo<v8::Value> &args) {
  v8::Isolate *isolate = args.GetIsolate();

  if (args.Length() < 1 || !args[0]->IsInt32Array()) {
    args.GetReturnValue().Set(v8::Boolean::New(isolate, false));
    return;
  }

  v8::Local<v8::Int32Array> int32Array = args[0].As<v8::Int32Array>();
  size_t length = int32Array->Length();

  v8::Local<v8::ArrayBuffer> buffer = int32Array->Buffer();
  if (buffer.IsEmpty()) {
    args.GetReturnValue().Set(v8::Boolean::New(isolate, false));
    return;
  }

  std::shared_ptr<v8::BackingStore> backing = buffer->GetBackingStore();
  if (!backing) {
    args.GetReturnValue().Set(v8::Boolean::New(isolate, false));
    return;
  }

  int32_t *data =
    reinterpret_cast<int32_t *>(static_cast<uint8_t *>(backing->Data()) + int32Array->ByteOffset());

  const c8::Vector<int> vibrationPattern(data, data + length);

  NodeBindingState *state = GetNodeBindingState();
  args.GetReturnValue().Set(v8::Boolean::New(isolate, state->vibrationCallback(vibrationPattern)));
}

void propertyGetter(const v8::FunctionCallbackInfo<v8::Value> &args) {
  int value = args.Data()->Int32Value(args.GetIsolate()->GetCurrentContext()).FromMaybe(0);
  args.GetReturnValue().Set(value);
}

void pauseAsyncCallback(uv_async_t *handle) {
  NodeBindingState *state = reinterpret_cast<NodeBindingState *>(handle->data);
  c8::dispatchWindowEvent(state, c8::FocusEvent::NAME, c8::FocusEvent::TYPE_BLUR);
  pauseAllAudio();
  state->isPaused = true;
}

void resumeAsyncCallback(uv_async_t *handle) {
  NodeBindingState *state = reinterpret_cast<NodeBindingState *>(handle->data);
  c8::dispatchWindowEvent(state, c8::FocusEvent::NAME, c8::FocusEvent::TYPE_FOCUS);
  resumeAllAudio();
  state->isPaused = false;
}

void termAsyncCallback(uv_async_t *handle) {
  NodeBindingState *state = reinterpret_cast<NodeBindingState *>(handle->data);
  if (!state->active) {
    return;
  }
  destroySurface();
}

void initWindowAsyncCallback(uv_async_t *handle) {
  NodeBindingState *state = reinterpret_cast<NodeBindingState *>(handle->data);
  if (!state->active) {
    return;
  }
  setNewNativeWindow(state->nativeWindow);
}

void windowResizeAsyncCallback(uv_async_t *handle) {
  NodeBindingState *state = reinterpret_cast<NodeBindingState *>(handle->data);
  if (!state->active) {
    return;
  }

  // Update the native window size on the global object, so that the value in JS is updated.
  {
    v8::Isolate *isolate = v8::Isolate::GetCurrent();
    if (!isolate) {
      C8Log("[node-binding] Error: No current V8 isolate.");
      return;
    }

    v8::Locker locker(isolate);
    v8::Isolate::Scope isolate_scope(isolate);
    v8::HandleScope handle_scope(isolate);
    v8::Local<v8::Context> context = isolate->GetCurrentContext();

    v8::Local<v8::Object> global = context->Global();

    global
      ->Set(
        context,
        v8::String::NewFromUtf8(isolate, "nativeWindowWidth").ToLocalChecked(),
        v8::Number::New(isolate, state->nativeWindowWidth))
      .ToChecked();

    global
      ->Set(
        context,
        v8::String::NewFromUtf8(isolate, "nativeWindowHeight").ToLocalChecked(),
        v8::Number::New(isolate, state->nativeWindowHeight))
      .ToChecked();

    // Get the current window from the global object, if it exists.
    v8::Local<v8::Symbol> currentWindowSymbol = state->currentWindowSymbol.Get(isolate);
    v8::Local<v8::Value> currentWindowValue =
      global->Get(context, currentWindowSymbol).ToLocalChecked();

    if (!currentWindowValue->IsObject()) {
      // No current window set, return.
      return;
    }

    v8::Local<v8::Object> currentWindow = currentWindowValue.As<v8::Object>();

    double devicePixelRatio =
      currentWindow
        ->Get(context, v8::String::NewFromUtf8(isolate, "devicePixelRatio").ToLocalChecked())
        .ToLocalChecked()
        ->NumberValue(context)
        .ToChecked();

    int nativeWidth = state->nativeWindowWidth;
    int nativeHeight = state->nativeWindowHeight;

    int newWidth = static_cast<int>(nativeWidth / devicePixelRatio);
    int newHeight = static_cast<int>(nativeHeight / devicePixelRatio);

    // Since these properties are not writable, we need to define them as accessors.
    // Delete the existing properties if they exist, so that we can redefine them.
    auto defineProperty = [&](const char *name, int value) {
      v8::Local<v8::String> propName = v8::String::NewFromUtf8(isolate, name).ToLocalChecked();
      currentWindow->Delete(context, propName).ToChecked();
      v8::Local<v8::FunctionTemplate> getterTemplate =
        v8::FunctionTemplate::New(isolate, propertyGetter, v8::Integer::New(isolate, value));
      currentWindow->SetAccessorProperty(
        propName, getterTemplate->GetFunction(context).ToLocalChecked());
    };

    // See: c8/dom/window.ts for the analogous code.
    defineProperty("innerWidth", newWidth);
    defineProperty("innerHeight", newHeight);
    defineProperty("outerWidth", newWidth);
    defineProperty("outerHeight", newHeight);
  }

  // Need to update the window values before dispatching the resize event,
  // so that event listeners can access the updated values.
  c8::dispatchWindowEvent(state, c8::Event::NAME, c8::Event::TYPE_RESIZE);
}

void inputEventCallback(uv_poll_t *handle, int status, int events) {
  if (status < 0) {
    C8Log("[node-binding] Error polling input event fd: %d", status);
    return;
  }

  const NodeBindingState *state = reinterpret_cast<const NodeBindingState *>(handle->data);

  if (events & UV_READABLE) {
    // Read the input event.
    c8::InputEventData inputEventData;
    // Drain the input event fd.
    while (read(state->inputEventFd, &inputEventData, sizeof(inputEventData)) > 0) {
      c8::dispatchInputEvent(state, inputEventData);
    }
  }
}

void sensorEventCallback(uv_poll_t *handle, int status, int events) {
  if (status < 0) {
    C8Log("[node-binding] Error polling sensor event fd: %d", status);
    return;
  }

  const NodeBindingState *state = reinterpret_cast<const NodeBindingState *>(handle->data);

  if (events & UV_READABLE) {
    // Read the sensor event.
    c8::SensorEventData sensorEventData;
    // Drain the sensor event fd.
    while (read(state->sensorEventFd, &sensorEventData, sizeof(sensorEventData)) > 0) {
      c8::dispatchSensorEvent(state, sensorEventData);
    }
  }
}

void renderAsyncCallback(uv_async_t *handle) {
  NodeBindingState *state = reinterpret_cast<NodeBindingState *>(handle->data);
  if (state->isPaused) {
    // Deferring the render request until the app is resumed.
    return;
  }
  int64_t frameTimeNanos = state->atomicNextFrameTimeNanos.load(std::memory_order_acquire);
  doRender(state, frameTimeNanos);
}

}  // namespace

extern "C" int startNode(
  node::MultiIsolatePlatform *platform,
  const Vector<String> &args,
  const Vector<String> &exec_args,
  NodeBindingData &data) {
  // Start the Node.js event loop.
  // Consider snapshotting here later.
  NodeBindingState *state = GetNodeBindingState();

  Vector<String> errors;
  std::unique_ptr<CommonEnvironmentSetup> setup =
    CommonEnvironmentSetup::Create(platform, &errors, args, exec_args);

  if (!setup.get()) {
    for (const String &err : errors) {
      C8Log("%s", err.c_str());
    }
    return 1;
  }

  int exitCode = 0;

  v8::Isolate *isolate = setup->isolate();
  node::Environment *env = setup->env();
  state->env = env;

  std::ifstream file(args.back(), std::ios::ate | std::ios::binary);
  if (!file.is_open()) {
    C8Log("[node-binding] Failed to open file: %s", args.back().c_str());
    return 1;
  }

  std::size_t size = file.tellg();

  String buffer(size, ' ');

  file.seekg(0);
  file.read(buffer.data(), size);
  file.close();

  state->eventListenerUpdateCallback = data.eventListenerUpdateCallback;
  state->vibrationCallback = data.vibrationCallback;
  state->nativeWindowWidth = data.width;
  state->nativeWindowHeight = data.height;

  {
    v8::Locker locker(isolate);
    v8::Isolate::Scope isolate_scope(isolate);
    v8::HandleScope handle_scope(isolate);
    v8::Context::Scope context_scope(setup->context());

    v8::Local<v8::External> external = v8::External::New(isolate, data.nativeWindow);
    v8::Local<v8::Object> global = setup->context()->Global();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "internalStoragePath").ToLocalChecked(),
        v8::String::NewFromUtf8(isolate, data.internalStoragePath).ToLocalChecked())
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeWindow").ToLocalChecked(),
        external)
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeWindowWidth").ToLocalChecked(),
        v8::Number::New(isolate, state->nativeWindowWidth))
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeWindowHeight").ToLocalChecked(),
        v8::Number::New(isolate, state->nativeWindowHeight))
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeDevicePixelRatio").ToLocalChecked(),
        v8::Number::New(isolate, data.devicePixelRatio))
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeScreenWidth").ToLocalChecked(),
        v8::Number::New(isolate, data.screenWidth))
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeScreenHeight").ToLocalChecked(),
        v8::Number::New(isolate, data.screenHeight))
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "urlToFetch").ToLocalChecked(),
        v8::String::NewFromUtf8(isolate, data.url).ToLocalChecked())
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "environmentAccessCode").ToLocalChecked(),
        v8::String::NewFromUtf8(isolate, data.environmentAccessCode).ToLocalChecked())
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "encryptedDevCookie").ToLocalChecked(),
        v8::String::NewFromUtf8(isolate, data.encryptedDevCookie).ToLocalChecked())
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "naeBuildMode").ToLocalChecked(),
        v8::String::NewFromUtf8(isolate, data.naeBuildMode).ToLocalChecked())
      .ToChecked();

    // Expose the requestAnimationFrame function to the isolate.
    v8::Local<v8::Function> requestAnimationFrameFunc =
      v8::Function::New(setup->context(), requestAnimationFrame).ToLocalChecked();
    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "requestAnimationFrame").ToLocalChecked(),
        requestAnimationFrameFunc)
      .ToChecked();

    // Expose the cancelAnimationFrame function to the isolate.
    v8::Local<v8::Function> cancelAnimationFrameFunc =
      v8::Function::New(setup->context(), cancelAnimationFrame).ToLocalChecked();
    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "cancelAnimationFrame").ToLocalChecked(),
        cancelAnimationFrameFunc)
      .ToChecked();

    // Expose function to invoke signal about change in eventListeners.
    v8::Local<v8::Function> eventListenerUpdateFunc =
      v8::Function::New(setup->context(), eventListenerUpdate).ToLocalChecked();
    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "eventListenerUpdate").ToLocalChecked(),
        eventListenerUpdateFunc)
      .ToChecked();

    if (data.vibrationCallback) {
      // Expose function to invoke native vibration.
      v8::Local<v8::Function> vibrationFunc =
        v8::Function::New(setup->context(), vibration).ToLocalChecked();
      global
        ->Set(
          setup->context(),
          v8::String::NewFromUtf8(isolate, "nativeVibrate").ToLocalChecked(),
          vibrationFunc)
        .ToChecked();
    }

    // The NIA dom-polyfill will use this global-registry symbol to indicate the current window.
    state->currentWindowSymbol.Reset(
      isolate,
      v8::Symbol::For(
        isolate, v8::String::NewFromUtf8(isolate, "niaCurrentWindow").ToLocalChecked()));

    // The client code should set this global-registry symbol to the desired input event target.
    state->inputEventTargetSymbol.Reset(
      isolate,
      v8::Symbol::For(
        isolate, v8::String::NewFromUtf8(isolate, "niaInputEventTarget").ToLocalChecked()));

    // The language / country information.
    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeSystemLocale").ToLocalChecked(),
        v8::String::NewFromUtf8(isolate, data.systemLocale).ToLocalChecked())
      .ToChecked();

    if (data.userAgent) {
      global
        ->Set(
          setup->context(),
          v8::String::NewFromUtf8(isolate, "nativeUserAgent").ToLocalChecked(),
          v8::String::NewFromUtf8(isolate, data.userAgent).ToLocalChecked())
        .ToChecked();
    }

    state->sensorEventTargetSymbol.Reset(
      isolate,
      v8::Symbol::For(
        isolate, v8::String::NewFromUtf8(isolate, "niaSensorEventTarget").ToLocalChecked()));

    v8::Local<v8::Object> headlessGlAddon = initHeadlessGlAddon(isolate, setup->context());
    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "NativeWebGL").ToLocalChecked(),
        headlessGlAddon)
      .ToChecked();

    v8::Local<v8::Object> miniaudioAddon =
      initMiniaudioAddon(isolate, setup->context(), setup->event_loop());
    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "NativeMiniaudio").ToLocalChecked(),
        miniaudioAddon)
      .ToChecked();

    // Expose NAE_OPT to window for js.
    bool naeOpt = false;
#if defined(NAE_OPT)
    naeOpt = true;
#endif
    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "naeOpt").ToLocalChecked(),
        v8::Boolean::New(isolate, naeOpt))
      .ToChecked();

    // Init the render request handle.
    uv_async_t &renderRequestHandle = state->renderRequestHandle;
    renderRequestHandle.data = reinterpret_cast<void *>(state);
    uv_async_init(setup->event_loop(), &renderRequestHandle, renderAsyncCallback);

    // Init the pause request handle to block the render request until the app is resumed.
    uv_async_t &pauseRequestHandle = state->pauseRequestHandle;
    pauseRequestHandle.data = reinterpret_cast<void *>(state);
    uv_async_init(setup->event_loop(), &pauseRequestHandle, pauseAsyncCallback);

    // Init the resume request handle to unblock the loop.
    uv_async_t &resumeRequestHandle = state->resumeRequestHandle;
    resumeRequestHandle.data = reinterpret_cast<void *>(state);
    uv_async_init(setup->event_loop(), &resumeRequestHandle, resumeAsyncCallback);

    // Init the termination request handle to terminate the window.
    uv_async_t &termRequestHandle = state->termRequestHandle;
    termRequestHandle.data = reinterpret_cast<void *>(state);
    uv_async_init(setup->event_loop(), &termRequestHandle, termAsyncCallback);

    // Init the initWindow request handle to set the new native window.
    uv_async_t &initWindowRequestHandle = state->initWindowRequestHandle;
    initWindowRequestHandle.data = reinterpret_cast<void *>(state);
    uv_async_init(setup->event_loop(), &initWindowRequestHandle, initWindowAsyncCallback);

    // Init the windowResized request handle to set the new native window.
    uv_async_t &windowResizedRequestHandle = state->windowResizedRequestHandle;
    windowResizedRequestHandle.data = reinterpret_cast<void *>(state);
    uv_async_init(setup->event_loop(), &windowResizedRequestHandle, windowResizeAsyncCallback);

    // Init the input event handle.
    uv_poll_t inputEventHandle;
    state->inputEventFd = data.inputEventFd;
    inputEventHandle.data = reinterpret_cast<void *>(state);
    uv_poll_init(setup->event_loop(), &inputEventHandle, data.inputEventFd);
    uv_poll_start(&inputEventHandle, UV_READABLE, inputEventCallback);

    // Init the sensor event handle.
    uv_poll_t sensorEventHandle;
    state->sensorEventFd = data.sensorEventFd;
    sensorEventHandle.data = reinterpret_cast<void *>(state);
    uv_poll_init(setup->event_loop(), &sensorEventHandle, data.sensorEventFd);
    uv_poll_start(&sensorEventHandle, UV_READABLE, sensorEventCallback);

    state->active = true;

    v8::MaybeLocal<v8::Value> loadenv_ret;
    loadenv_ret = node::LoadEnvironment(env, buffer.c_str());

    if (loadenv_ret.IsEmpty()) {
      // There has been a JS exception.
      return 1;
    }

    exitCode = node::SpinEventLoop(env).FromMaybe(1);

    uv_close(reinterpret_cast<uv_handle_t *>(&renderRequestHandle), nullptr);
    uv_close(reinterpret_cast<uv_handle_t *>(&pauseRequestHandle), nullptr);
    uv_close(reinterpret_cast<uv_handle_t *>(&resumeRequestHandle), nullptr);
    uv_close(reinterpret_cast<uv_handle_t *>(&termRequestHandle), nullptr);
    uv_close(reinterpret_cast<uv_handle_t *>(&initWindowRequestHandle), nullptr);
    uv_close(reinterpret_cast<uv_handle_t *>(&windowResizedRequestHandle), nullptr);
    uv_poll_stop(&inputEventHandle);
    uv_close(reinterpret_cast<uv_handle_t *>(&inputEventHandle), nullptr);
    uv_poll_stop(&sensorEventHandle);
    uv_close(reinterpret_cast<uv_handle_t *>(&sensorEventHandle), nullptr);
    state->currentWindowSymbol.Reset();
    state->inputEventTargetSymbol.Reset();
    state->sensorEventTargetSymbol.Reset();
    state->inputEventFd = -1;
    state->sensorEventFd = -1;
  }

  return exitCode;
}

namespace c8 {

int NodeBinding::onCreate(int argc, char *argv[], NodeBindingData &data) {
  // Set the NODE_PATH
  setenv("NODE_PATH", data.internalStoragePath, 1);

  for (const auto &[key, value] : data.environmentVariables) {
    setenv(key.c_str(), value.c_str(), 1);
  }

  NodeBindingState *state = GetNodeBindingState();
  state->globalStartTime = uv_hrtime();

  argv = uv_setup_args(argc, argv);

  state->args = Vector<String>(argv, argv + argc);
  std::unique_ptr<node::InitializationResult> result = node::InitializeOncePerProcess(
    state->args,
    {node::ProcessInitializationFlags::kNoInitializeV8,
     node::ProcessInitializationFlags::kNoInitializeNodeV8Platform});
  for (const String &error : result->errors()) {
    C8Log("%s: %s", state->args[0].c_str(), error.c_str());
    fprintf(stderr, "%s: %s\n", state->args[0].c_str(), error.c_str());
  }
  if (result->early_return() != 0) {
    return result->exit_code();
  }

  std::unique_ptr<node::MultiIsolatePlatform> platform = node::MultiIsolatePlatform::Create(4);
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  int exitCode = startNode(platform.get(), result->args(), result->exec_args(), data);

  if (exitCode != 0) {
    C8Log("[node-binding] Node returned an error");
  }

  V8::Dispose();
  V8::DisposePlatform();
  node::TearDownOncePerProcess();
  ResetNodeBindingState();

  return exitCode;
}

int NodeBinding::setNativeWindow(void *nativeWindow) {
  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  v8::HandleScope handleScope(isolate);  // Required for Node 4.x

  v8::Local<v8::External> nativeWindowExternal =
    v8::External::New(isolate, reinterpret_cast<void *>(nativeWindow));

  // Get the global object from the current context
  v8::Local<v8::Object> global = isolate->GetCurrentContext()->Global();

  // Get the JavaScript function printExternal from the global object
  v8::Local<v8::Value> key = v8::String::NewFromUtf8(isolate, "printExternal").ToLocalChecked();
  v8::Local<v8::Value> printExternalFunction =
    global->Get(isolate->GetCurrentContext(), key).ToLocalChecked();

  if (printExternalFunction->IsFunction()) {
    v8::Local<v8::Function> printExternal = v8::Local<v8::Function>::Cast(printExternalFunction);

    // Call the printExternal function and pass the external object as an argument
    v8::Local<v8::Value> argv[] = {nativeWindowExternal};
    v8::MaybeLocal<v8::Value> result =
      printExternal->Call(isolate->GetCurrentContext(), global, 1, argv);

    if (!result.IsEmpty()) {
      // Process the result
    }
  }
  return 0;
}

void NodeBinding::onPause() {
  NodeBindingState *state = GetNodeBindingState();
  if (!state->active) {
    return;
  }
  uv_async_send(&state->pauseRequestHandle);
}

void NodeBinding::onTermWindow() {
  NodeBindingState *state = GetNodeBindingState();
  if (!state->active) {
    return;
  }
  uv_async_send(&state->termRequestHandle);
}

void NodeBinding::onResume() {
  NodeBindingState *state = GetNodeBindingState();
  if (!state->active) {
    return;
  }
  uv_async_send(&state->resumeRequestHandle);
}

void NodeBinding::onInitWindow(void *nativeWindow) {
  NodeBindingState *state = GetNodeBindingState();
  if (!state->active) {
    return;
  }

  state->nativeWindow = nativeWindow;
  uv_async_send(&state->initWindowRequestHandle);
}

void NodeBinding::onWindowResized(int width, int height) {
  NodeBindingState *state = GetNodeBindingState();
  if (!state->active) {
    return;
  }

  state->nativeWindowWidth = width;
  state->nativeWindowHeight = height;
  uv_async_send(&state->windowResizedRequestHandle);
}

void NodeBinding::onDestroy() {
  // NOTE(divya): Probably should be called through node::AddEnvironmentCleanupHook.
  cleanupAudio();

  NodeBindingState *state = GetNodeBindingState();
  state->active = false;

  node::Stop(state->env);
}

void NodeBinding::notifyAnimationFrame(int64_t frameTimeNanos) {
  NodeBindingState *state = GetNodeBindingState();
  if (!state->active) {
    return;
  }

  state->atomicNextFrameTimeNanos.store(frameTimeNanos, std::memory_order_release);

  // Notify the uv event loop of the new render request.
  uv_async_send(&state->renderRequestHandle);
}

}  // namespace c8
