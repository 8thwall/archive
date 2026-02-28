#include "c8/html-shell/android/quest/node-binding.h"

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
#include "c8/html-shell/android/quest/webtask/quest-webtask.h"
#include "c8/html-shell/event-dispatcher.h"
#include "c8/html-shell/input-event-data.h"
#include "c8/html-shell/node-binding-state.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "c8/xrapi/xrapi-addon.h"
#include "external/miniaudio-addon/miniaudio-addon.h"
#include "third_party/headless-gl/src/native/bindings.h"

using c8::AnimationFrameCallback;
using c8::C8Log;
using c8::initXrapiAddon;
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
}

// NOTE(christoph): On Quest if we enqueue animation frames for the non-xr render loop,
// there are graphical glitches.
bool SHOULD_ENQUEUE_ANIMATION_FRAME = false;

// Define a callback function for requestAnimationFrame.
void requestAnimationFrame(const v8::FunctionCallbackInfo<v8::Value> &args) {
  v8::Isolate *isolate = args.GetIsolate();
  v8::Local<v8::Function> callback = args[0].As<v8::Function>();

  std::unique_ptr<v8::Persistent<v8::Function>> persistentCallback(
    new v8::Persistent<v8::Function>(isolate, callback));

  NodeBindingState *state = GetNodeBindingState();
  const uint32_t id = state->nextAnimationFrameId++;

  if (SHOULD_ENQUEUE_ANIMATION_FRAME) {
    state->animationFrameCallbackQueue.emplace_back(
      AnimationFrameCallback{.id = id, .callback = std::move(persistentCallback)});
  }

  args.GetReturnValue().Set(v8::Number::New(isolate, id));
}

void cancelAnimationFrame(const v8::FunctionCallbackInfo<v8::Value> &args) {
  v8::Isolate *isolate = args.GetIsolate();
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

void startNewQuestWebTask(const v8::FunctionCallbackInfo<v8::Value> &args) {
  v8::Isolate *isolate = args.GetIsolate();
  v8::Local<v8::Value> appPointerValue = args.Data();

  v8::Local<v8::External> appPointerExternal = appPointerValue.As<v8::External>();
  auto appPointer = static_cast<struct android_app *>(appPointerExternal->Value());

  v8::HandleScope handle_scope(isolate);

  c8::String url = *v8::String::Utf8Value(isolate, args[0].As<v8::String>());

  JNIEnv *env = nullptr;
  auto envResult =
    appPointer->activity->vm->GetEnv(reinterpret_cast<void **>(&env), JNI_VERSION_1_6);

  if (envResult != JNI_OK) {
    C8Log("[node-binding] Failed to get JNI environment for web task");
    return;
  }

  c8::startQuestWebTask(env, appPointer->activity->clazz, url);
}

// Redirect stdout and stderr to android log.
int stdoutPipe[2];
int stderrPipe[2];
pthread_t stdoutThread;
pthread_t stderrThread;

void redirect(int pipe) {
  ssize_t redirect_size;
  // Big enough buffer to not get logcat linebreaks in the middle of message tests output.
  char buf[10240];
  while ((redirect_size = read(pipe, buf, sizeof buf - 1)) > 0) {
    // __android_log_write will add a new line anyway.
    if (buf[redirect_size - 1] == '\n')
      --redirect_size;
    buf[redirect_size] = 0;
    C8Log("%s", buf);
  }
}

int redirectStderrStdout() {
  // Set stdout as line buffered.
  // Avoids additional line breaks caused by adb logcat splitting the output.
  setvbuf(stdout, 0, _IOLBF, 0);
  pipe(stdoutPipe);
  dup2(stdoutPipe[1], STDOUT_FILENO);

  // Set stderr as line buffered.
  // Avoids additional line breaks caused by adb logcat splitting the output.
  setvbuf(stderr, 0, _IOLBF, 0);
  pipe(stderrPipe);
  dup2(stderrPipe[1], STDERR_FILENO);

  if (
    pthread_create(
      &stdoutThread,
      0,
      [](void *) -> void * {
        redirect(stdoutPipe[0]);
        return nullptr;
      },
      0)
    == -1) {
    return -1;
  }
  pthread_detach(stdoutThread);

  if (
    pthread_create(
      &stderrThread,
      0,
      [](void *) -> void * {
        redirect(stderrPipe[0]);
        return nullptr;
      },
      0)
    == -1) {
    return -1;
  }
  pthread_detach(stderrThread);

  return 0;
}

}  // namespace

extern "C" int startNode(
  node::MultiIsolatePlatform *platform,
  const Vector<String> &args,
  const Vector<String> &exec_args,
  void *nativeWindow,
  int width,
  int height,
  int inputEventFd,
  const char *url,
  const char *environmentAccessCode,
  const char *systemLocale,
  struct android_app *appPointer,
  const char *internalStoragePath) {
  // Start the Node.js event loop.
  // Consider snapshotting here later.
  NodeBindingState *state = GetNodeBindingState();
  Vector<String> errors;
  std::unique_ptr<CommonEnvironmentSetup> setup =
    std::move(CommonEnvironmentSetup::Create(platform, &errors, args, exec_args));
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

  {
    v8::Locker locker(isolate);
    v8::Isolate::Scope isolate_scope(isolate);
    v8::HandleScope handle_scope(isolate);
    v8::Context::Scope context_scope(setup->context());

    v8::Local<v8::External> external = v8::External::New(isolate, nativeWindow);
    v8::Local<v8::Object> global = setup->context()->Global();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "internalStoragePath").ToLocalChecked(),
        v8::String::NewFromUtf8(isolate, internalStoragePath).ToLocalChecked())
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
        v8::Number::New(isolate, width))
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeWindowHeight").ToLocalChecked(),
        v8::Number::New(isolate, height))
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "urlToFetch").ToLocalChecked(),
        v8::String::NewFromUtf8(isolate, url).ToLocalChecked())
      .ToChecked();

    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "environmentAccessCode").ToLocalChecked(),
        v8::String::NewFromUtf8(isolate, environmentAccessCode).ToLocalChecked())
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

    // Expose the startNewQuestWebTask function to the isolate.
    v8::Local<v8::Function> startNewQuestWebTaskFunc =
      v8::Function::New(
        setup->context(), startNewQuestWebTask, v8::External::New(isolate, appPointer))
        .ToLocalChecked();
    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "niaStartWebTask").ToLocalChecked(),
        startNewQuestWebTaskFunc)
      .ToChecked();

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

    // The language / country information from Android Native Activity
    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeSystemLocale").ToLocalChecked(),
        v8::String::NewFromUtf8(isolate, systemLocale).ToLocalChecked())
      .ToChecked();

    v8::Local<v8::Object> xrApiAddon =
      initXrapiAddon(appPointer, isolate, setup->context(), setup->event_loop());
    global
      ->Set(
        setup->context(),
        v8::String::NewFromUtf8(isolate, "xrApiAddon").ToLocalChecked(),
        xrApiAddon)
      .ToChecked();

    v8::Local<v8::Object> headlessGlAddon = initHeadlessGlAddon(isolate, setup->context());
    setAndroidApp(appPointer);
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

    // Init the pause request handle have blur effect.
    uv_async_t &pauseRequestHandle = state->pauseRequestHandle;
    pauseRequestHandle.data = reinterpret_cast<void *>(state);
    uv_async_init(setup->event_loop(), &pauseRequestHandle, [](uv_async_t *handle) {
      NodeBindingState *state = reinterpret_cast<NodeBindingState *>(handle->data);
      if (!state->active) {
        return;
      }
      c8::dispatchWindowEvent(state, c8::FocusEvent::NAME, c8::FocusEvent::TYPE_BLUR);
    });

    // Init the resume request handle to remove blur effect.
    uv_async_t &resumeRequestHandle = state->resumeRequestHandle;
    resumeRequestHandle.data = reinterpret_cast<void *>(state);
    uv_async_init(setup->event_loop(), &resumeRequestHandle, [](uv_async_t *handle) {
      NodeBindingState *state = reinterpret_cast<NodeBindingState *>(handle->data);
      if (!state->active) {
        return;
      }
      c8::dispatchWindowEvent(state, c8::FocusEvent::NAME, c8::FocusEvent::TYPE_FOCUS);
    });

    // Init the input event handle.
    uv_poll_t inputEventHandle;
    state->inputEventFd = inputEventFd;
    inputEventHandle.data = reinterpret_cast<void *>(state);
    uv_poll_init(setup->event_loop(), &inputEventHandle, inputEventFd);
    uv_poll_start(&inputEventHandle, UV_READABLE, [](uv_poll_t *handle, int status, int events) {
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
          dispatchInputEvent(state, inputEventData);
        }
      }
    });

    state->active = true;

    v8::MaybeLocal<v8::Value> loadenv_ret;
    loadenv_ret = node::LoadEnvironment(env, buffer.c_str());

    if (loadenv_ret.IsEmpty()) {
      // There has been a JS exception.
      return 1;
    }

    exitCode = node::SpinEventLoop(env).FromMaybe(1);

    uv_close(reinterpret_cast<uv_handle_t *>(&pauseRequestHandle), nullptr);
    uv_close(reinterpret_cast<uv_handle_t *>(&resumeRequestHandle), nullptr);
    uv_poll_stop(&inputEventHandle);
    uv_close(reinterpret_cast<uv_handle_t *>(&inputEventHandle), nullptr);
    state->currentWindowSymbol.Reset();
    state->inputEventTargetSymbol.Reset();
    state->inputEventFd = -1;
  }

  return exitCode;
}

namespace c8 {

int NodeBinding::onCreate(
  int argc,
  char *argv[],
  const char *internalStoragePath,
  void *nativeWindow,
  int width,
  int height,
  int inputEventFd,
  const char *url,
  const char *environmentAccessCode,
  const char *systemLocale,
  struct android_app *appPointer) {
  // Set the NODE_PATH
  setenv("NODE_PATH", internalStoragePath, 1);

  // Redirect stdout and stderr in logcat.
  if (redirectStderrStdout() == -1) {
    C8Log("[node-binding] Couldn't start redirecting stdout and stderr to logcat");
  }

  NodeBindingState *state = GetNodeBindingState();

  argv = uv_setup_args(argc, argv);

  state->args = std::move(Vector<String>(argv, argv + argc));
  std::unique_ptr<node::InitializationResult> result = std::move(
    node::InitializeOncePerProcess(
      state->args,
      {node::ProcessInitializationFlags::kNoInitializeV8,
       node::ProcessInitializationFlags::kNoInitializeNodeV8Platform}));
  for (const String &error : result->errors()) {
    C8Log("%s: %s", state->args[0].c_str(), error.c_str());
    fprintf(stderr, "%s: %s\n", state->args[0].c_str(), error.c_str());
  }
  if (result->early_return() != 0) {
    return result->exit_code();
  }

  // Create the Isolate platform here.
  std::unique_ptr<node::MultiIsolatePlatform> platform =
    std::move(node::MultiIsolatePlatform::Create(4));
  V8::InitializePlatform(platform.get());
  V8::Initialize();

  int exitCode = startNode(
    platform.get(),
    result->args(),
    result->exec_args(),
    nativeWindow,
    width,
    height,
    inputEventFd,
    url,
    environmentAccessCode,
    systemLocale,
    appPointer,
    internalStoragePath);

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
  uv_async_send(&state->pauseRequestHandle);
}

void NodeBinding::onResume() {
  NodeBindingState *state = GetNodeBindingState();
  if (!state->active) {
    return;
  }
  uv_async_send(&state->resumeRequestHandle);
}

void NodeBinding::onDestroy() {
  // NOTE(divya): Probably should be called through node::AddEnvironmentCleanupHook.
  cleanupAudio();

  NodeBindingState *state = GetNodeBindingState();
  state->active = false;

  node::Stop(state->env);
}

}  // namespace c8
