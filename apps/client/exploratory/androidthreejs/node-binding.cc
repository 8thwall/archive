#include "apps/client/exploratory/androidthreejs/node-binding.h"

#include <node.h>
#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <uv.h>
#include <v8.h>

#include <filesystem>
#include <fstream>

#include "c8/c8-log.h"
#include "c8/string.h"
#include "c8/vector.h"

using c8::C8Log;
using c8::String;
using c8::Vector;
using node::CommonEnvironmentSetup;
using v8::V8;

namespace node {
extern int Start(int argc, char *argv[]);
}  // namespace node

namespace {

struct AnimationFrameCallback {
  uint32_t id;
  std::unique_ptr<v8::Persistent<v8::Function>> callback;
};

struct NodeBindingState {
  std::atomic<bool> active = false;
  Vector<String> args;
  std::unique_ptr<node::InitializationResult> initResult;
  std::unique_ptr<node::MultiIsolatePlatform> platform;
  std::unique_ptr<node::CommonEnvironmentSetup> setup;
  int nextAnimationFrameId = 1;
  Vector<AnimationFrameCallback> animationFrameCallbackQueue;
  Vector<AnimationFrameCallback> nextAnimationFrameCallbackQueue;
};

static NodeBindingState *GetNodeBindingState() {
  static NodeBindingState *state = new NodeBindingState();
  return state;
}

static void ResetNodeBindingState() {
  NodeBindingState *state = GetNodeBindingState();
  state->setup.reset();
  state->initResult.reset();
  state->platform.reset();
  state->args.clear();
}

// Process all animation frames that have been queued up.
void processAnimationFramesImpl(int64_t frameTimeNanos) {
  NodeBindingState *state = GetNodeBindingState();
  v8::Isolate *isolate = v8::Isolate::GetCurrent();
  v8::HandleScope handleScope(isolate);

  const double millis = frameTimeNanos * 1e-6;

  // Swap the animation queue for the next queue.
  swap(state->animationFrameCallbackQueue, state->nextAnimationFrameCallbackQueue);

  for (AnimationFrameCallback &callback : state->animationFrameCallbackQueue) {
    v8::Local<v8::Function> function = v8::Local<v8::Function>::New(isolate, *callback.callback);
    v8::Local<v8::Value> timestamp = v8::Number::New(isolate, millis);
    v8::Local<v8::Value> argv[] = {timestamp};
    function->Call(isolate->GetCurrentContext(), v8::Undefined(isolate), 1, argv).ToLocalChecked();
  }

  state->animationFrameCallbackQueue.clear();
}

// Define a callback function for requestAnimationFrame.
void requestAnimationFrame(const v8::FunctionCallbackInfo<v8::Value> &args) {
  v8::Isolate *isolate = args.GetIsolate();
  v8::Local<v8::Function> callback = args[0].As<v8::Function>();

  std::unique_ptr<v8::Persistent<v8::Function>> persistentCallback(
    new v8::Persistent<v8::Function>(isolate, callback));

  NodeBindingState *state = GetNodeBindingState();
  const uint32_t id = state->nextAnimationFrameId++;

  state->nextAnimationFrameCallbackQueue.emplace_back(
    AnimationFrameCallback{.id = id, .callback = std::move(persistentCallback)});

  args.GetReturnValue().Set(v8::Number::New(isolate, id));
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

extern "C" int startNode(int argc, char *argv[], void *nativeWindow, int width, int height) {
  NodeBindingState *state = GetNodeBindingState();

  argv = uv_setup_args(argc, argv);

  state->args = std::move(Vector<String>(argv, argv + argc));

  state->initResult = std::move(node::InitializeOncePerProcess(
    state->args,
    {node::ProcessInitializationFlags::kNoInitializeV8,
     node::ProcessInitializationFlags::kNoInitializeNodeV8Platform}));

  for (const String &error : state->initResult->errors()) {
    C8Log("%s: %s", state->args[0].c_str(), error.c_str());
    fprintf(stderr, "%s: %s\n", state->args[0].c_str(), error.c_str());
  }
  if (state->initResult->early_return() != 0) {
    return state->initResult->exit_code();
  }

  // Create the Isolate platform here.
  state->platform = std::move(node::MultiIsolatePlatform::Create(4));
  V8::InitializePlatform(state->platform.get());
  V8::Initialize();

  // Start the Node.js event loop.
  // Consider snapshotting here later.

  Vector<String> errors;
  state->setup = std::move(CommonEnvironmentSetup::Create(
    state->platform.get(), &errors, state->initResult->args(), state->initResult->exec_args()));

  if (!state->setup.get()) {
    for (const String &err : errors) {
      C8Log("%s", err.c_str());
    }
    return 1;
  }

  int exitCode = 0;

  v8::Isolate *isolate = state->setup->isolate();
  node::Environment *env = state->setup->env();

  std::ifstream file(argv[1], std::ios::ate | std::ios::binary);
  if (!file.is_open()) {
    C8Log("Failed to open file: %s", argv[1]);
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
    v8::Context::Scope context_scope(state->setup->context());

    v8::Local<v8::External> external = v8::External::New(isolate, nativeWindow);
    v8::Local<v8::Object> global = state->setup->context()->Global();

    global
      ->Set(
        state->setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeWindow").ToLocalChecked(),
        external)
      .ToChecked();

    global
      ->Set(
        state->setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeWindowWidth").ToLocalChecked(),
        v8::Number::New(isolate, width))
      .ToChecked();

    global
      ->Set(
        state->setup->context(),
        v8::String::NewFromUtf8(isolate, "nativeWindowHeight").ToLocalChecked(),
        v8::Number::New(isolate, height))
      .ToChecked();

    // Expose the requestAnimationFrame function to the isolate.
    v8::Local<v8::Function> requestAnimationFrameFunc =
      v8::Function::New(state->setup->context(), requestAnimationFrame).ToLocalChecked();
    global
      ->Set(
        state->setup->context(),
        v8::String::NewFromUtf8(isolate, "requestAnimationFrame").ToLocalChecked(),
        requestAnimationFrameFunc)
      .ToChecked();

    v8::Local<v8::String> source =
      v8::String::NewFromUtf8(isolate, buffer.c_str()).ToLocalChecked();

    v8::MaybeLocal<v8::Value> loadenv_ret;
    loadenv_ret = node::LoadEnvironment(
      env,
      "const publicRequire = "  // require('module').createRequire(process.cwd() "
      "  require('module').createRequire(process.env.NODE_PATH + '/');"

      "globalThis.require = publicRequire;");

    if (loadenv_ret.IsEmpty()) {
      // There has been a JS exception.
      return 1;
    }

    exitCode = node::SpinEventLoop(env).FromMaybe(1);

    v8::Local<v8::Script> entrypoint =
      v8::Script::Compile(state->setup->context(), source).ToLocalChecked();

    state->active = true;

    entrypoint->Run(state->setup->context()).ToLocalChecked();

    // Continue to run user-space code.
    node::SpinEventLoop(state->setup->env()).FromMaybe(1);
  }

  return exitCode;
}

namespace c8 {

int NodeBinding::onCreate(
  int argc, char *argv[], const char *nodePath, void *nativeWindow, int width, int height) {
  // Set the NODE_PATH
  setenv("NODE_PATH", nodePath, 1);

  // Redirect stdout and stderr in logcat.
  if (redirectStderrStdout() == -1) {
    C8Log("Couldn't start redirecting stdout and stderr to logcat");
  }

  int result = startNode(argc, argv, nativeWindow, width, height);

  if (result != 0) {
    C8Log("Node returned an error");
  }

  return result;
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

void NodeBinding::onDestroy() {
  NodeBindingState *state = GetNodeBindingState();
  state->active = false;

  node::Stop(state->setup->env());

  V8::Dispose();
  V8::DisposePlatform();

  node::TearDownOncePerProcess();

  ResetNodeBindingState();
}

void NodeBinding::processAnimationFrames(int64_t frameTimeNanos) {
  NodeBindingState *state = GetNodeBindingState();
  if (!state->active) {
    return;
  }

  uv_async_t *asyncHandle = new uv_async_t;
  asyncHandle->data = reinterpret_cast<void *>(frameTimeNanos);

  // Run processAnimationFrames in the uv event loop.
  uv_async_init(state->setup->event_loop(), asyncHandle, [](uv_async_t *handle) {
    processAnimationFramesImpl(reinterpret_cast<int64_t>(handle->data));
    uv_close(reinterpret_cast<uv_handle_t *>(handle), [](uv_handle_t *handle) { delete handle; });
  });
  uv_async_send(asyncHandle);
}

}  // namespace c8
