// Copyright (c) 2024 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@nianticlabs.com)

#include <android/api-level.h>
#include <android/asset_manager.h>
#include <android/asset_manager_jni.h>
#include <android/choreographer.h>
#include <android_native_app_glue.h>
#include <sys/stat.h>
#include <unistd.h>

#include <atomic>
#include <filesystem>
#include <fstream>
#include <functional>
#include <thread>
#include <vector>

#include "c8/c8-log.h"
#include "c8/html-shell/android/android-helpers.h"
#include "c8/html-shell/android/android/redirect.h"
#include "c8/html-shell/android/android/shell-app-state.h"
#include "c8/html-shell/android/display-info.h"
#include "c8/html-shell/android/input-event-data-converter.h"
#include "c8/html-shell/android/sensor-manager.h"
#include "c8/html-shell/android/shell-activity-intent.h"
#include "c8/html-shell/android/shell-app-manifest.h"
#include "c8/html-shell/html-shell-helpers.h"
#include "c8/html-shell/node-binding.h"
#include "c8/io/file-io.h"
#include "c8/string.h"
#include "c8/string/join.h"
#include "c8/vector.h"

using namespace c8;
namespace fs = std::filesystem;

namespace {

#if __ANDROID_API__ >= 29
#define ACHOREOGRAPHER_POST_FRAME_CALLBACK AChoreographer_postFrameCallback64
#define ACHOREOGRAPHER_FRAME_TIME_TYPE int64_t
#else
#define ACHOREOGRAPHER_POST_FRAME_CALLBACK AChoreographer_postFrameCallback
#define ACHOREOGRAPHER_FRAME_TIME_TYPE long
#if !defined(__LP64__) && !defined(_LP64)
#define FRAME_TIME_FIX_NEEDED 1
#include <ctime>
#endif
#endif

void onFrame(ACHOREOGRAPHER_FRAME_TIME_TYPE frameTimeNanos, void *data) {
  auto appState = static_cast<ShellAppState *>(data);
  if (appState->nativeWindow) {
    int64_t frametime = static_cast<int64_t>(frameTimeNanos);

#ifdef FRAME_TIME_FIX_NEEDED
    // On 32-bit platforms, there is a documented bug that the frame time is a
    // 32-bit value that wraps around every 2 seconds. The fix is to combine it
    // with the higher order bits from clock_gettime to get a full 64-bit value.
    struct timespec ts;
    clock_gettime(CLOCK_MONOTONIC, &ts);
    frametime |= (static_cast<int64_t>(ts.tv_sec) * 1000000000 + ts.tv_nsec) & 0xFFFFFFFF00000000;
#endif

    NodeBinding::notifyAnimationFrame(frametime);

    ACHOREOGRAPHER_POST_FRAME_CALLBACK(AChoreographer_getInstance(), onFrame, appState);
  } else {
    C8Log("[android-shell-main] No native window available for rendering.");
  }
}

/**
 * Process the next main command.
 */
void appCmd(struct android_app *app, int32_t cmd) {
  auto appState = static_cast<ShellAppState *>(app->userData);
  auto &sensorManager = appState->sensorManager;

  switch (cmd) {
    // There is no APP_CMD_CREATE. The ANativeActivity creates the
    // application thread from onCreate(). The application thread
    // then calls android_main().
    case APP_CMD_START: {
      sensorManager.initializeSensorManager(app);
      appState->hapticsManager.initializeHapticsManager(app);
      break;
    }
    case APP_CMD_RESUME: {
      appState->resumed = true;
      sensorManager.enableSensors();
      NodeBinding::onResume();
      break;
    }
    case APP_CMD_PAUSE: {
      appState->resumed = false;
      sensorManager.disableSensors();
      if (appState->nodeThread.joinable()) {
        NodeBinding::onPause();
      }
      break;
    }
    case APP_CMD_STOP: {
      break;
    }
    case APP_CMD_DESTROY: {
      sensorManager.disableSensors();
      NodeBinding::onDestroy();
      appState->nodeThread.join();
      appState->nativeWindow = nullptr;
      appState->windowWidth = 0;
      appState->windowHeight = 0;
      break;
    }
    case APP_CMD_INIT_WINDOW: {
      appState->nativeWindow = app->window;
      appState->windowWidth = ANativeWindow_getWidth(app->window);
      appState->windowHeight = ANativeWindow_getHeight(app->window);

      // Don't make an new thread if one is already running. Instead, update the context with a new
      // window.
      if (appState->nodeThread.joinable()) {
        NodeBinding::onInitWindow(appState->nativeWindow);
        break;
      }

      // Create a pipes for sending events from the UI thread to the Node thread.
      if (pipe(appState->inputEventPipeFd)) {
        C8Log("[android-shell-main] Failed to create input event pipe");
        return;
      }

      if (pipe(appState->sensorEventPipeFd)) {
        C8Log("[android-shell-main] Failed to create sensor event pipe");
        return;
      }

      // Create a new thread here.
      appState->nodeThread = std::thread([appState]() {
#ifdef JIT_DISABLED
        C8Log(
          "[android-shell-main] JIT is disabled. "
          "Using WebAssembly override.");
        auto webAssemblyOverridePath =
          appState->filesDir + "/runfiles/_main/c8/dom/web-assembly-override.js";
        if (!fileExists(webAssemblyOverridePath)) {
          C8Log(
            "[android-shell-main] web-assembly-override.js not found. "
            "Ending "
            "app.");
          return;
        }
#endif

        Vector<String> args = {
          "node",
          "--experimental-vm-modules",
#ifdef NAE_INSPECTOR_ENABLED
          // Turn on inspector which gives good places to improve perfs.
          "--inspect=0.0.0.0:9229",
#endif
#ifdef JIT_DISABLED
          "--jitless",
          // In jitless mode, WebAssembly is undefined. So we override it with our own version.
          "--require",
          webAssemblyOverridePath,
#endif
          // Potentially useful flags for debugging.
          // "--expose-gc",
          // "--trace-gc",
          // "--trace-gc-verbose",
          // "--verify-heap",
          // "--trace-gc-object-stats"
          // The app's main script, expected to be the last arg.
          appState->filesDir + "/runfiles/_main/c8/html-shell/app.js",
        };

        std::vector<char *> flags;

        for (String &flag : args) {
          flags.push_back(flag.data());
        }
        int argc = flags.size();
        char **argv = flags.data();

        auto &sensorManager = appState->sensorManager;
        std::function<void(String, int)> eventListenerUpdateCallback =
          [&](String event, int numOccurrences) {
            sensorManager.updateRegisteredSensors(event, numOccurrences);
          };

        std::function<bool(const Vector<int> &)> vibrationCallback =
          [&](const Vector<int> &pattern) {
            appState->hapticsManager.playHapticPattern(pattern);
            return true;
          };

        NodeBindingData NodeBindingData{
          .nativeWindow = appState->nativeWindow,
          .width = appState->windowWidth,
          .height = appState->windowHeight,
          .inputEventFd = appState->inputEventPipeFd[0],  // Read end of the pipe.
          .sensorEventFd = appState->sensorEventPipeFd[0],
          .eventListenerUpdateCallback = eventListenerUpdateCallback,
          .vibrationCallback = vibrationCallback,
          .url = appState->appUrl.c_str(),
          .internalStoragePath = appState->filesDir.c_str(),
          .environmentAccessCode = appState->niaEnvironmentAccessCode.c_str(),
          .encryptedDevCookie = appState->encryptedDevCookie.c_str(),
          .systemLocale = appState->systemLocale.c_str(),
          .naeBuildMode = appState->naeBuildMode.c_str(),
          .userAgent = appState->userAgent.c_str(),
          .devicePixelRatio = appState->devicePixelRatio,
          .screenWidth = appState->screenWidth,
          .screenHeight = appState->screenHeight,
        };

        // Redirect stdout and stderr in logcat.
        if (redirectStderrStdout() == -1) {
          C8Log("[android-shell-main] Couldn't start redirecting stdout and stderr to logcat");
        }

        // Start Node.
        NodeBinding::onCreate(argc, argv, NodeBindingData);
      });

      // Start the render loop.
      ACHOREOGRAPHER_POST_FRAME_CALLBACK(AChoreographer_getInstance(), onFrame, appState);
      break;
    }
    case APP_CMD_TERM_WINDOW: {
      NodeBinding::onTermWindow();
      break;
    }
    case APP_CMD_WINDOW_RESIZED: {
      if (appState->nativeWindow) {
        appState->windowWidth = ANativeWindow_getWidth(app->window);
        appState->windowHeight = ANativeWindow_getHeight(app->window);
        NodeBinding::onWindowResized(appState->windowWidth, appState->windowHeight);
      }
      break;
    }
  }
}

void copyAssetDirectory(
  AAssetManager *assetManager, const String &srcFolder, const String &destPath) {
  AAssetDir *assetDir = AAssetManager_openDir(assetManager, srcFolder.c_str());
  const char *filename = nullptr;
  while ((filename = AAssetDir_getNextFileName(assetDir)) != nullptr) {
    String srcFilePath = srcFolder != "" ? srcFolder + "/" + filename : filename;
    String destFilePath = destPath + "/" + filename;
    AAsset *asset = AAssetManager_open(assetManager, srcFilePath.c_str(), AASSET_MODE_STREAMING);
    if (asset != nullptr) {
      std::ofstream outFile(destFilePath, std::ios::binary);
      const void *buffer = AAsset_getBuffer(asset);
      off_t bufferSize = AAsset_getLength(asset);
      outFile.write(static_cast<const char *>(buffer), bufferSize);
      outFile.close();
      AAsset_close(asset);
    }
  }
  AAssetDir_close(assetDir);
}

bool fileExists(const String &path) {
  struct stat buffer;
  return (stat(path.c_str(), &buffer) == 0);
}

void copyAssetFile(AAssetManager *assetManager, const String &srcFile, const String &destPath) {
  AAsset *asset = AAssetManager_open(assetManager, srcFile.c_str(), AASSET_MODE_STREAMING);
  if (asset != nullptr) {
    std::ofstream outFile(destPath, std::ios::binary);
    const void *buffer = AAsset_getBuffer(asset);
    off_t bufferSize = AAsset_getLength(asset);
    outFile.write(static_cast<const char *>(buffer), bufferSize);
    outFile.close();
    AAsset_close(asset);
  } else {
    fs::create_directories(destPath.c_str());
  }
}

struct SavedState {
  // TODO.
};

// Only the Java API for AssetManager can recursively list assets.
Vector<fs::path> getAssetFileList(JNIEnv *env, jobject activity, const fs::path dir) {
  Vector<fs::path> assetFiles;
  auto getAssets = env->GetMethodID(
    env->GetObjectClass(activity), "getAssets", "()Landroid/content/res/AssetManager;");
  auto assetManager = env->CallObjectMethod(activity, getAssets);
  auto list = env->GetMethodID(
    env->GetObjectClass(assetManager), "list", "(Ljava/lang/String;)[Ljava/lang/String;");

  jstring path = env->NewStringUTF(dir.c_str());
  auto entries = (jobjectArray)env->CallObjectMethod(assetManager, list, path);
  env->DeleteLocalRef(path);
  auto len = env->GetArrayLength(entries);

  for (int i = 0; i < len; i++) {
    const auto entry = (jstring)env->GetObjectArrayElement(entries, i);
    const char *utf = env->GetStringUTFChars(entry, 0);
    if (utf) {
      fs::path entryPath = dir / utf;
      jstring fullPath = env->NewStringUTF(entryPath.c_str());
      auto contents = (jobjectArray)env->CallObjectMethod(assetManager, list, fullPath);
      env->DeleteLocalRef(fullPath);
      auto contentsLen = env->GetArrayLength(contents);
      if (contentsLen > 0) {
        assetFiles.push_back(entryPath);
        const Vector<fs::path> subAssetFileList =
          getAssetFileList(env, activity, entryPath.c_str());
        assetFiles.insert(assetFiles.end(), subAssetFileList.cbegin(), subAssetFileList.cend());
      } else {
        assetFiles.push_back(entryPath);
      }
      env->ReleaseStringUTFChars(entry, utf);
    }
  }
  return assetFiles;
}

String getLocale(AAssetManager *assetManager) {
  AConfiguration *config = AConfiguration_new();
  AConfiguration_fromAssetManager(config, assetManager);

  char language[3];
  AConfiguration_getLanguage(config, language);

  char country[3];
  AConfiguration_getCountry(config, country);

  return String(language, 2) + "-" + String(country, 2);
}

}  // namespace

static int32_t handleInput(struct android_app *app, AInputEvent *event) {
  // Let Android handle certain events.
  if (AInputEvent_getType(event) == AINPUT_EVENT_TYPE_KEY) {
    int32_t keyCode = AKeyEvent_getKeyCode(event);
    switch (keyCode) {
      case AKEYCODE_BACK:
      case AKEYCODE_CAMERA:
      case AKEYCODE_HEADSETHOOK:
      case AKEYCODE_HOME:
      case AKEYCODE_MEDIA_AUDIO_TRACK:
      case AKEYCODE_MEDIA_CLOSE:
      case AKEYCODE_MEDIA_EJECT:
      case AKEYCODE_MEDIA_FAST_FORWARD:
      case AKEYCODE_MEDIA_NEXT:
      case AKEYCODE_MEDIA_PAUSE:
      case AKEYCODE_MEDIA_PLAY:
      case AKEYCODE_MEDIA_PLAY_PAUSE:
      case AKEYCODE_MEDIA_PREVIOUS:
      case AKEYCODE_MEDIA_RECORD:
      case AKEYCODE_MEDIA_REWIND:
      case AKEYCODE_MEDIA_SKIP_BACKWARD:
      case AKEYCODE_MEDIA_SKIP_FORWARD:
      case AKEYCODE_MEDIA_STEP_BACKWARD:
      case AKEYCODE_MEDIA_STEP_FORWARD:
      case AKEYCODE_MEDIA_STOP:
      case AKEYCODE_MEDIA_TOP_MENU:
      case AKEYCODE_MENU:
      case AKEYCODE_MUTE:
      case AKEYCODE_NOTIFICATION:
      case AKEYCODE_POWER:
      case AKEYCODE_VOLUME_DOWN:
      case AKEYCODE_VOLUME_MUTE:
      case AKEYCODE_VOLUME_UP:
        return 0;
      default:
        // We'll handle other key events.
        break;
    }
  }

  // Initialize the input event data from the AInputEvent.
  const ShellAppState *appState = static_cast<const ShellAppState *>(app->userData);
  InputEventData inputEventData = convertFromPlatformEvent(event, appState->devicePixelRatio);

  // Get the input event pipe write file descriptor from the app state.
  int writeFd = appState->inputEventPipeFd[1];

  // Write the input event data to the pipe.
  write(writeFd, &inputEventData, sizeof(InputEventData));

  // Return 1 to indicate that we have handled the event.
  return 1;
}

/**
 * This is the main entry point of a native application that is using
 * android_native_app_glue.  It runs in its own thread, with its own
 * event loop for receiving input events and doing other things.
 */
void android_main(struct android_app *app) {
  try {
    JNIEnv *env = nullptr;
    app->activity->vm->AttachCurrentThread(&env, nullptr);

    ShellAppState appState = {};
    appState.filesDir = app->activity->internalDataPath;

    app->userData = &appState;
    app->onAppCmd = appCmd;
    app->onInputEvent = handleInput;

    AAssetManager *assetManager = app->activity->assetManager;

    try {
      std::string runfilesDir = appState.filesDir + "/runfiles";
      setenv("RUNFILES_DIR", runfilesDir.c_str(), 0);
    } catch (const std::exception &ex) {
      C8Log("%s", ex.what());
    }

    appState.systemLocale = getLocale(assetManager);
    appState.userAgent = getUserAgent();

    auto displayInfo = getDisplayInfo(env, app->activity->clazz);
    appState.devicePixelRatio = displayInfo.devicePixelRatio;
    appState.screenWidth = displayInfo.screenWidth;
    appState.screenHeight = displayInfo.screenHeight;

    ShellAppManifestParams manifestParams;
    loadManifestParams(env, app->activity->clazz, &manifestParams);

    // Check if metadata.json exists and read commitId and naeBuildMode
    auto metadataPath = std::filesystem::path(appState.filesDir) / "metadata.json";

    bool isNewBuild = isNewWebBuild(
      metadataPath.string(), manifestParams.commitIdAtAppBuildTime, manifestParams.naeBuildMode);

    copyAssetDirectory(assetManager, "", appState.filesDir);

    appState.appUrl = manifestParams.appUrl;
    appState.niaEnvironmentAccessCode = manifestParams.niaEnvironmentAccessCode;
    appState.naeBuildMode = manifestParams.naeBuildMode;
    appState.encryptedDevCookie = manifestParams.encryptedDevCookie;

    if (appState.appUrl.empty()) {
      appState.appUrl = loadUrlFromActivityIntent(env, app->activity->clazz).value_or("");
    }

    if (appState.appUrl.empty()) {
      C8Log("[android-shell-main] No app URL found in manifest or intent. Ending app.");
      std::terminate();
    }

    toggleSystemInsets(env, app->activity->clazz, manifestParams.statusBarVisible);

    Vector<fs::path> assetRunfiles = getAssetFileList(env, app->activity->clazz, "runfiles");
    for (const auto &asset : assetRunfiles) {
      fs::path destPath = appState.filesDir / asset;
      copyAssetFile(assetManager, asset.c_str(), destPath.c_str());
    }

    Vector<fs::path> assetCacheFiles = getAssetFileList(env, app->activity->clazz, "_http-cache");
    for (const auto &asset : assetCacheFiles) {
      fs::path destPath = appState.filesDir / asset;

      // Refresh the http-cache on new builds
      if (!c8::fileExists(destPath.c_str()) || isNewBuild) {
        // Assets can be large, so only copy them over if they don't already exist.
        copyAssetFile(assetManager, asset.c_str(), destPath.c_str());
      }
    }

    while (!app->destroyRequested) {
      android_poll_source *source = nullptr;

      // This will release once per frame, timed with the Choreographer frame callback.
      auto result = ALooper_pollOnce(-1, nullptr, nullptr, reinterpret_cast<void **>(&source));
      if (result == ALOOPER_POLL_ERROR) {
        C8Log("[android-shell-main] ALooper_pollOnce returned an error");
        std::terminate();
      }

      if (source != nullptr) {
        source->process(app, source);
      }

      auto &sensorManager = appState.sensorManager;
      sensorManager.processSensorEvents(appState.sensorEventPipeFd[1]);
    }

    app->activity->vm->DetachCurrentThread();
  } catch (const std::exception &ex) {
    C8Log("%s", ex.what());
  } catch (...) {
    C8Log("[android-shell-main] Unknown Error");
  }
}
