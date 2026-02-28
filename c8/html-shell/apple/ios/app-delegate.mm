// Copyright (c) 2025 Niantic, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#import "c8/html-shell/apple/ios/app-delegate.h"
#import <Foundation/Foundation.h>
#include <QuartzCore/CADisplayLink.h>
#include <QuartzCore/CoreAnimation.h>
#include <filesystem>
#include <thread>
#include "c8/c8-log.h"
#include "c8/html-shell/apple/apple-helpers.h"
#import "c8/html-shell/apple/ios/shell-app-state.h"
#import "c8/html-shell/apple/ios/view-controller.h"
#include "c8/html-shell/html-shell-helpers.h"
#include "c8/html-shell/node-binding-state.h"
#include "c8/html-shell/node-binding.h"
#include "c8/io/file-io.h"

namespace {

void setWindowDimensions() {
  c8::ShellAppState *appState = c8::getShellAppState();

  ViewController *viewController =
    static_cast<ViewController *>(appState->nativeWindow.rootViewController);
  UIView *rootView = viewController.view;

  CGSize viewSize = rootView.bounds.size;
  CGFloat scale = [UIScreen mainScreen].scale;
  appState->devicePixelRatio = static_cast<float>(scale);
  appState->windowWidth = viewSize.width * appState->devicePixelRatio;
  appState->windowHeight = viewSize.height * appState->devicePixelRatio;

  // TODO(lreyna): Could potentially use the full screen size and provide node with inset values.
  // For now, we're only hiding the status bar in portrait mode. We need to add better handling for
  // the viewport to support other insets.
#if RENDER_IN_SAFE_AREA
  UIEdgeInsets insets = UIEdgeInsetsZero;
  if (@available(iOS 11.0, *)) {
    insets = rootView.safeAreaInsets;
  }

  UIInterfaceOrientation orientation = viewController.view.window.windowScene.interfaceOrientation;
  if (orientation == UIInterfaceOrientationPortrait) {
    appState->windowHeight = (viewSize.height - insets.top) * appState->devicePixelRatio;
  }
#endif
}

}  // namespace

using namespace c8;

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application
  didFinishLaunchingWithOptions:(NSDictionary *)launchOptions {
  ShellAppState *appState = getShellAppState();
  appState->nativeWindow = [[UIWindow alloc] initWithFrame:[[UIScreen mainScreen] bounds]];
  appState->nativeWindow.rootViewController = [[ViewController alloc] init];
  [appState->nativeWindow makeKeyAndVisible];

  ViewController *viewController =
    static_cast<ViewController *>(appState->nativeWindow.rootViewController);
  UIView *rootView = viewController.view;
  viewController.resizeDelegate = self;

  UIEdgeInsets insets = UIEdgeInsetsZero;
  if (@available(iOS 11.0, *)) {
    insets = rootView.safeAreaInsets;
  }

  setWindowDimensions();

  appState->systemLocale = getLocale();
  appState->userAgent = getUserAgent();
  appState->filesDir = getApplicationSupportDirectory();
  if (appState->filesDir.empty()) {
    C8Log("[app-delegate@didFinishLaunchingWithOptions] No filesDir found. Ending app.");
    return NO;
  }

  rootView.layer.masksToBounds = YES;
  appState->nativeLayer = [CAMetalLayer layer];
  appState->nativeLayer.frame = rootView.bounds;
  appState->nativeLayer.contentsScale = appState->devicePixelRatio;
  [rootView.layer addSublayer:appState->nativeLayer];

  // Set the RUNFILES_DIR environment variable
  try {
    std::string runfilesDir = appState->filesDir + "/runfiles";
    setenv("RUNFILES_DIR", runfilesDir.c_str(), 0);
  } catch (const std::exception &ex) {
    C8Log("%s", ex.what());
  }

  NSString *appUrl = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"AppUrl"];
  if (!appUrl) {
    C8Log(
      "[app-delegate@didFinishLaunchingWithOptions] No AppUrl found in Info.plist. Ending app.");
    std::terminate();
  }
  appState->appUrl = std::string([appUrl UTF8String]);

  NSString *encryptedDevCookie =
    [[NSBundle mainBundle] objectForInfoDictionaryKey:@"EncryptedDevCookie"];
  appState->encryptedDevCookie =
    encryptedDevCookie ? std::string([encryptedDevCookie UTF8String]) : "";

  NSString *niaEnvironmentAccessCode =
    [[NSBundle mainBundle] objectForInfoDictionaryKey:@"NiaEnvAccessCode"];
  appState->niaEnvironmentAccessCode =
    niaEnvironmentAccessCode ? std::string([niaEnvironmentAccessCode UTF8String]) : "";

  NSString *naeBuildMode = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"NaeBuildMode"];
  if (!naeBuildMode) {
    C8Log(
      "[app-delegate@didFinishLaunchingWithOptions] No NAE build mode found in Info.plist. "
      "Defaulting to 'static'.");
    naeBuildMode = @"static";
  }

  NSString *commitId = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CommitId"];
  if (!commitId) {
    C8Log(
      "[app-delegate@didFinishLaunchingWithOptions] No CommitId found in Info.plist. Ending app.");
    std::terminate();
  }

  appState->naeBuildMode = std::string([naeBuildMode UTF8String]);

  const auto metadataPath = std::filesystem::path(appState->filesDir) / "metadata.json";
  bool isNewBuild =
    isNewWebBuild(metadataPath.string(), [commitId UTF8String], [naeBuildMode UTF8String]);

  if (isNewBuild) {
    C8Log(
      "[app-delegate@didFinishLaunchingWithOptions] New build detected, copying all resources.");
    deleteDirectoryContents(appState->filesDir, metadataPath);
    copyResourcesDirectory(appState->filesDir);
  } else {
    C8Log("[app-delegate@didFinishLaunchingWithOptions] Existing build, skipping resource copy.");
  }

  appState->nodeThread = std::thread([]() {
    ShellAppState *appState = getShellAppState();
    // Create a pipes for sending events from the UI thread to the Node thread.
    if (pipe(appState->inputEventPipeFd)) {
      C8Log("[app-delegate@didFinishLaunchingWithOptions] Failed to create input event pipe");
      return;
    }
    if (pipe(appState->sensorEventPipeFd)) {
      C8Log("[app-delegate@didFinishLaunchingWithOptions] Failed to create sensor event pipe");
      return;
    }

    auto webAssemblyOverridePath =
      appState->filesDir + "/runfiles/_main/c8/dom/web-assembly-override.js";
    if (!fileExists(webAssemblyOverridePath)) {
      C8Log(
        "[app-delegate@didFinishLaunchingWithOptions] web-assembly-override.js not found. Ending "
        "app.");
      return;
    }

    auto appScript = appState->filesDir + "/runfiles/_main/c8/html-shell/app.js";
    if (!fileExists(appScript)) {
      C8Log(
        "[app-delegate@didFinishLaunchingWithOptions] App script not found: %s", appScript.c_str());
      return;
    }

    Vector<String> args = {
      "node",
      "--experimental-vm-modules",
      // Jitless mode is required on iOS.
      "--jitless",
#ifdef NAE_INSPECTOR_ENABLED
      // Turn on inspector which can be used to debug performance issues.
      // NOTE(lreyna): This doesn't seem to work on iOS, potentially due to firewall issues.
      "--inspect=0.0.0.0:9229",
#endif
      // In jitless mode, WebAssembly is undefined. So we override it with our own version.
      // Note that we do it here because during testing, anywhere else was not early enough in
      // the app lifecycle to fix all errors.
      "--require",
      webAssemblyOverridePath,
      appScript,
    };

    // Convert args to a format suitable for Node.js.
    std::vector<char *> flags;
    for (String &flag : args) {
      flags.push_back(flag.data());
    }
    int argc = flags.size();
    char **argv = flags.data();

    std::function<void(String, int)> eventListenerUpdateCallback =
      [&](String event, int numOccurrences) {
        appState->sensorManager.updateRegisteredSensors(event, numOccurrences);
      };

    std::function<bool(const Vector<int> &)> vibrationCallback = [&](const Vector<int> &pattern) {
      // TODO(lreyna): Follow the Web Vibration API spec for patterns.
      // See: https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API#vibration_patterns
      // Mostly, need to cancel the vibration if one is already playing.

      appState->hapticsManager.playHapticPattern(pattern);
      return true;
    };

    c8::NodeBindingData nodeBindingData{
      .nativeWindow = (__bridge void *)appState->nativeLayer,
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
      .screenWidth = appState->windowWidth,
      .screenHeight = appState->windowHeight,
      .environmentVariables =
        {{"APPLE_FRAMEWORK_PATH", [NSBundle mainBundle].privateFrameworksPath.UTF8String}},
    };

    c8::NodeBinding::onCreate(argc, argv, nodeBindingData);
  });

  self.displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(onFrame:)];
  [self.displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];

  return YES;
}

- (void)applicationDidBecomeActive:(UIApplication *)application {
  ShellAppState *appState = getShellAppState();
  appState->sensorManager.enableSensors();
  NodeBinding::onResume();
}

- (void)applicationWillResignActive:(UIApplication *)application {
  ShellAppState *appState = getShellAppState();
  appState->sensorManager.disableSensors();
  if (appState->nodeThread.joinable()) {
    NodeBinding::onPause();
  }
}

- (void)applicationWillTerminate:(UIApplication *)application {
  ShellAppState *appState = getShellAppState();
  appState->sensorManager.disableSensors();

  NodeBinding::onDestroy();
  appState->nodeThread.join();
  appState->nativeLayer = nullptr;
  appState->nativeWindow = nullptr;
  appState->windowWidth = 0;
  appState->windowHeight = 0;

  [self.displayLink invalidate];
  self.displayLink = nil;
}

- (void)viewWillDisappear:(BOOL)animated {
  NodeBinding::onTermWindow();
}

- (void)onFrame:(CADisplayLink *)displayLink {
  ShellAppState *appState = getShellAppState();
  appState->sensorManager.processSensorEvents(appState->sensorEventPipeFd[1]);

  // displayLink.timestamp is in seconds.
  int64_t frametimeNanos = displayLink.timestamp * 1e9;
  NodeBinding::notifyAnimationFrame(frametimeNanos);
}

- (void)viewControllerDidResizeToSize:(CGSize)size {
  c8::ShellAppState *appState = c8::getShellAppState();

  setWindowDimensions();

  ViewController *viewController =
    static_cast<ViewController *>(appState->nativeWindow.rootViewController);
  UIView *rootView = viewController.view;

  appState->nativeLayer.frame = rootView.bounds;
  appState->nativeLayer.contentsScale = appState->devicePixelRatio;

  NodeBinding::onWindowResized(appState->windowWidth, appState->windowHeight);
}

@end
