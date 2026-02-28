// Copyright (c) 2025 Niantic, Inc.
// Original Author: Lucas Reyna (lucas@nianticspatial.com)

// A Manager to wrap around the CoreHaptic APIs on iOS, mainly to fit Web Vibration API.

#include "c8/html-shell/apple/ios/haptics-manager.h"

#import <Foundation/Foundation.h>

#include "c8/c8-log.h"

static constexpr float MILLISECONDS_PER_SECOND = 1000.0;

static constexpr float DEFAULT_HAPTIC_INTENSITY = 1.0;
static constexpr float DEFAULT_HAPTIC_SHARPNESS = 0.5;

namespace c8 {

HapticsManager::HapticsManager() noexcept {
  if ([CHHapticEngine class]) {
    NSError *error = nil;
    hapticEngine_ = [[CHHapticEngine alloc] initAndReturnError:&error];
    currentPlayer_ = nil;
    if (error) {
      C8Log("[haptics-manager] Failed to start haptic engine: %s", error.localizedDescription);
    }

    hapticEngine_.playsHapticsOnly = YES;
  } else {
    C8Log("[haptics-manager] CHHapticEngine is not available on this device.");
  }
}

HapticsManager::~HapticsManager() noexcept {
  currentPlayer_ = nil;
  hapticEngine_ = nil;
}

void HapticsManager::playHapticPattern(const Vector<int> &pattern) {
  if (@available(iOS 13.0, *)) {
    if (!hapticEngine_) {
      C8Log("[haptics-manager] Haptic engine is not initialized.");
      return;
    }

    // Stop any currently playing pattern to match the Web Vibration API behavior
    if (currentPlayer_) {
      NSError *stopError = nil;
      [currentPlayer_ stopAtTime:0 error:&stopError];
      if (stopError) {
        C8Log(
          "[haptics-manager] Failed to stop current pattern: %s",
          stopError.localizedDescription.UTF8String);
      }
      currentPlayer_ = nil;
    }

    Vector<int> patternCopy = pattern;

    [hapticEngine_ startWithCompletionHandler:^(NSError *_Nullable startError) {
      if (startError) {
        C8Log(
          "[haptics-manager] Failed to start haptic engine: %s",
          startError.localizedDescription.UTF8String);
        return;
      }

      this->playPatternHelper(patternCopy);
    }];
  }
}

void HapticsManager::playPatternHelper(const Vector<int> &pattern) {
  NSMutableArray *events = [NSMutableArray array];
  double currentTime = 0;

  // Skip odd segments (no vibration) like the Web Vibration API
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Vibration_API#vibration_patterns
  for (int i = 0; i < pattern.size(); ++i) {
    double duration = pattern[i] / MILLISECONDS_PER_SECOND;

    if (i % 2 == 0) {
      CHHapticEvent *event = [[CHHapticEvent alloc]
        initWithEventType:CHHapticEventTypeHapticContinuous
               parameters:@[
                 [[CHHapticEventParameter alloc]
                   initWithParameterID:CHHapticEventParameterIDHapticIntensity
                                 value:DEFAULT_HAPTIC_INTENSITY],
                 [[CHHapticEventParameter alloc]
                   initWithParameterID:CHHapticEventParameterIDHapticSharpness
                                 value:DEFAULT_HAPTIC_SHARPNESS]
               ]
             relativeTime:currentTime
                 duration:duration];
      [events addObject:event];
    }
    currentTime += duration;
  }

  NSError *error = nil;
  CHHapticPattern *hapticPattern = [[CHHapticPattern alloc] initWithEvents:events
                                                                parameters:@[]
                                                                     error:&error];
  if (error) {
    C8Log(
      "[haptics-manager] Failed to create haptic pattern: %s",
      error.localizedDescription.UTF8String);
    return;
  }

  currentPlayer_ = [hapticEngine_ createPlayerWithPattern:hapticPattern error:&error];
  if (error) {
    C8Log(
      "[haptics-manager] Failed to create haptic player: %s",
      error.localizedDescription.UTF8String);
    return;
  }

  [currentPlayer_ startAtTime:0 error:&error];
  if (error) {
    C8Log(
      "[haptics-manager] Failed to play haptic pattern: %s", error.localizedDescription.UTF8String);
  }

  [hapticEngine_ notifyWhenPlayersFinished:^(NSError *_Nullable finishedError) {
    if (finishedError) {
      C8Log(
        "[haptics-manager] Error after players finished: %s",
        finishedError.localizedDescription.UTF8String);
    }
    currentPlayer_ = nil;
    [hapticEngine_ stopWithCompletionHandler:nil];
    return CHHapticEngineFinishedActionStopEngine;
  }];
}

}  // namespace c8
