// Copyright (c) 2025 8th Wall, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)
//
// The OSX shell entrypoint. Run with:
// bazel build //c8/html-shell/apple/osx:html-shell-osx --//bzl/node:source-built=True
// --config=angle && \
//   bazel-out/darwin_arm64-fastbuild/bin/c8/html-shell/apple/osx/HTMLShellOSX.app/Contents/MacOS/HTMLShellOSX

#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#include <filesystem>

#include "c8/c8-log.h"
#include "c8/html-shell/apple/apple-helpers.h"
#include "c8/html-shell/apple/osx/app-delegate.h"
#include "c8/html-shell/apple/osx/shell-app-state.h"
#include "c8/html-shell/apple/osx/shell-view.h"
#include "c8/html-shell/html-shell-helpers.h"
#include "c8/string.h"

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    // Initialize the application instance
    [NSApplication sharedApplication];

    // Set up the window dimensions and style
    NSRect frame = NSMakeRect(100, 100, 400, 300);
    NSUInteger style =
      NSWindowStyleMaskTitled | NSWindowStyleMaskClosable | NSWindowStyleMaskResizable;

    // Create the window with a title and frame
    NSWindow *window = [[NSWindow alloc] initWithContentRect:frame
                                                   styleMask:style
                                                     backing:NSBackingStoreBuffered
                                                       defer:NO];
    NSString *bundleName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CFBundleName"];
    if (bundleName) {
      [window setTitle:[NSString stringWithFormat:@"%@", bundleName]];
    }

    // Set up the app state.
    auto *appState = c8::getShellAppState();
    appState->nativeWindow = window;
    appState->windowWidth = window.frame.size.width;
    appState->windowHeight = window.frame.size.height;
    appState->systemLocale = c8::getLocale();
    appState->userAgent = c8::getUserAgent();
    appState->filesDir = c8::getApplicationSupportDirectory();
    if (appState->filesDir.empty()) {
      c8::C8Log("[osx-shell-main@main] No filesDir found. Ending app.");
      std::terminate();
    }

    ShellView *shellView = [[ShellView alloc] initWithFrame:frame];
    window.contentView = shellView;

    NSView *contentView = [window contentView];
    [contentView setWantsLayer:YES];
    appState->nativeLayer = [CAMetalLayer layer];
    [contentView setLayer:appState->nativeLayer];

    // Set the RUNFILES_DIR environment variable
    try {
      const auto runfilesDir = appState->filesDir + "/runfiles";
      setenv("RUNFILES_DIR", runfilesDir.c_str(), 0);
    } catch (const std::exception &ex) {
      c8::C8Log("%s", ex.what());
    }

    // Set the app URL.
    NSString *appUrl = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"AppUrl"];
    if (!appUrl) {
      c8::C8Log("[osx-shell-main@main] No AppUrl found in Info.plist. Ending app.");
      std::terminate();
    }
    appState->appUrl = c8::String([appUrl UTF8String]);

    NSString *naeBuildMode = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"NaeBuildMode"];
    if (!naeBuildMode) {
      c8::C8Log(
        "[app-delegate@didFinishLaunchingWithOptions] No NAE build mode found in Info.plist. "
        "Defaulting to 'static'.");
      naeBuildMode = @"static";
    }
    appState->naeBuildMode = std::string([naeBuildMode UTF8String]);

    NSString *encryptedDevCookie =
      [[NSBundle mainBundle] objectForInfoDictionaryKey:@"EncryptedDevCookie"];
    appState->encryptedDevCookie =
      encryptedDevCookie ? std::string([encryptedDevCookie UTF8String]) : "";

    NSString *niaEnvironmentAccessCode =
      [[NSBundle mainBundle] objectForInfoDictionaryKey:@"NiaEnvAccessCode"];
    appState->niaEnvironmentAccessCode =
      niaEnvironmentAccessCode ? std::string([niaEnvironmentAccessCode UTF8String]) : "";

    NSString *commitId = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"CommitId"];
    if (!commitId) {
      c8::C8Log(
        "[app-delegate@didFinishLaunchingWithOptions] No CommitId found in Info.plist. Ending "
        "app.");
      std::terminate();
    }

    const auto metadataPath = std::filesystem::path(appState->filesDir) / "metadata.json";
    bool isNewBuild =
      c8::isNewWebBuild(metadataPath.string(), [commitId UTF8String], [naeBuildMode UTF8String]);

    if (isNewBuild) {
      c8::C8Log(
        "[app-delegate@didFinishLaunchingWithOptions] New build detected, copying all resources.");
      c8::deleteDirectoryContents(appState->filesDir, metadataPath);
      c8::copyResourcesDirectory(appState->filesDir);
    } else {
      c8::C8Log(
        "[app-delegate@didFinishLaunchingWithOptions] Existing build, skipping resource copy.");
    }

    // Create and set up the app delegate.
    AppDelegate *delegate = [[AppDelegate alloc] init];
    [NSApp setDelegate:delegate];
    [window setDelegate:delegate];  // Set the delegate for the window as well

    // Create the menu.
    [delegate createMenu];

    // Show the window.
    [window makeKeyAndOrderFront:nil];

    // Run the application event loop.
    [NSApp run];
  }

  return 0;
}
