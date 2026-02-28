// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#import "c8/html-shell/apple/osx/shell-view.h"

#include "c8/html-shell/apple/osx/input-event-data-converter.h"
#include "c8/html-shell/apple/osx/shell-app-state.h"
#include "c8/html-shell/input-event-data.h"

@implementation ShellView

- (void)mouseDown:(NSEvent *)event {
  [super mouseDown:event];

  const auto *appState = c8::getShellAppState();
  auto inputEventData = c8::convertFromPlatformEvent(event);
  write(appState->inputEventPipeFd[1], &inputEventData, sizeof(c8::InputEventData));
}

- (void)mouseDragged:(NSEvent *)event {
  [super mouseDragged:event];

  const auto *appState = c8::getShellAppState();
  auto inputEventData = c8::convertFromPlatformEvent(event);
  write(appState->inputEventPipeFd[1], &inputEventData, sizeof(c8::InputEventData));
}

- (void)mouseUp:(NSEvent *)event {
  [super mouseUp:event];

  const auto *appState = c8::getShellAppState();
  auto inputEventData = c8::convertFromPlatformEvent(event);
  write(appState->inputEventPipeFd[1], &inputEventData, sizeof(c8::InputEventData));
}

// TODO(yuhsianghuanng): Handle other input events.

@end
