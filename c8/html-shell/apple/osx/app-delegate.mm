// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#import "c8/html-shell/apple/osx/app-delegate.h"

#include <thread>

#include "c8/c8-log.h"
#include "c8/html-shell/apple/osx/shell-app-state.h"
#include "c8/html-shell/node-binding.h"
#include "c8/io/file-io.h"
#include "c8/string.h"
#include "c8/vector.h"

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification {
  auto *appState = c8::getShellAppState();

  appState->nodeThread = std::thread([appState]() {
    // Create a pipes for sending events from the UI thread to the Node thread.
    if (pipe(appState->inputEventPipeFd)) {
      c8::C8Log("[osx-shell-main@applicationDidFinishLaunching] Failed to create input event pipe");
      return;
    }
    if (pipe(appState->sensorEventPipeFd)) {
      c8::C8Log(
        "[osx-shell-main@applicationDidFinishLaunching] Failed to create sensor event pipe");
      return;
    }

    auto appScript = appState->filesDir + "/runfiles/_main/c8/html-shell/app.js";
    if (!c8::fileExists(appScript)) {
      c8::C8Log(
        "[osx-shell-main@applicationDidFinishLaunching] App script not found: %s",
        appScript.c_str());
      return;
    }

    c8::Vector<c8::String> args = {
      "node",
      "--experimental-vm-modules",
#ifdef NAE_INSPECTOR_ENABLED
      // Turn on inspector which gives good places to improve perfs.
      "--inspect=0.0.0.0:9229",
#endif
      // The app's main script, expected to be the last arg:
      appScript,
    };

    // Convert args to a format suitable for Node.js.
    c8::Vector<char *> flags;
    for (c8::String &flag : args) {
      flags.push_back(flag.data());
    }
    int argc = flags.size();
    char **argv = flags.data();

    c8::NodeBindingData nodeBindingData{
      .nativeWindow = (__bridge void *)appState->nativeLayer,
      .width = appState->windowWidth,
      .height = appState->windowHeight,
      .inputEventFd = appState->inputEventPipeFd[0],  // Read end of the pipe.
      .sensorEventFd = appState->sensorEventPipeFd[0],
      .eventListenerUpdateCallback =
        [](c8::String, int) {},  // TODO(lreyna): Implement real sensor event callback
      .url = appState->appUrl.c_str(),
      .internalStoragePath = appState->filesDir.c_str(),
      .environmentAccessCode = appState->niaEnvironmentAccessCode.c_str(),
      .encryptedDevCookie = appState->encryptedDevCookie.c_str(),
      .systemLocale = appState->systemLocale.c_str(),
      .naeBuildMode = appState->naeBuildMode.c_str(),
      .userAgent = appState->userAgent.c_str(),
      .devicePixelRatio = 1,                 // TODO(lreyna): Use actual device pixel ratio.
      .screenWidth = appState->windowWidth,  // TODO(lreyna): Use actual screen dimensions.
      .screenHeight = appState->windowHeight,
      .environmentVariables =
        {{"APPLE_FRAMEWORK_PATH", [NSBundle mainBundle].privateFrameworksPath.UTF8String}},
    };

    c8::NodeBinding::onCreate(argc, argv, nodeBindingData);
  });

  if (@available(macOS 14.0, *)) {
    self.displayLink = [appState->nativeWindow displayLinkWithTarget:self
                                                            selector:@selector(onFrame:)];
    [self.displayLink addToRunLoop:[NSRunLoop mainRunLoop] forMode:NSRunLoopCommonModes];
  } else {
    c8::C8Log("[app-delegate] CADisplayLink is not available before macOS 14.0");
  }
}

- (void)applicationDidBecomeActive:(NSNotification *)notification {
  c8::NodeBinding::onResume();
}

- (void)applicationWillResignActive:(NSNotification *)notification {
  const auto *appState = c8::getShellAppState();
  if (appState->nodeThread.joinable()) {
    c8::NodeBinding::onPause();
  }
}

- (void)applicationWillTerminate:(NSNotification *)notification {
  // TODO(paris): We hang when this is called, fix. Currently can only exit app via ctrl+c.
  c8::NodeBinding::onDestroy();

  auto *appState = c8::getShellAppState();
  appState->nodeThread.join();
  appState->nativeLayer = nullptr;
  appState->nativeWindow = nullptr;
  appState->windowWidth = 0;
  appState->windowHeight = 0;

  if (@available(macOS 14.0, *)) {
    [self.displayLink invalidate];
    self.displayLink = nil;
  }
}

- (void)windowWillClose:(NSNotification *)notification {
  c8::NodeBinding::onTermWindow();
  [NSApp terminate:nil];
}

- (void)onFrame:(CADisplayLink *)displayLink API_AVAILABLE(macos(14.0)) {
  // displayLink.timestamp is in seconds.
  int64_t frametimeNanos = displayLink.timestamp * 1e9;
  c8::NodeBinding::notifyAnimationFrame(frametimeNanos);
}

- (void)createMenu {
  NSMenu *mainMenu = [[NSMenu alloc] initWithTitle:@"MainMenu"];

  // Create the application menu.
  NSMenuItem *appMenuItem = [[NSMenuItem alloc] initWithTitle:@"App" action:nil keyEquivalent:@""];
  [mainMenu addItem:appMenuItem];

  // Create the app submenu (File menu).
  NSMenu *appMenu = [[NSMenu alloc] initWithTitle:@"App"];
  [appMenu addItemWithTitle:@"Quit" action:@selector(terminate:) keyEquivalent:@"q"];
  [mainMenu setSubmenu:appMenu forItem:appMenuItem];

  // Set the main menu for the application.
  [NSApp setMainMenu:mainMenu];
}

@end
