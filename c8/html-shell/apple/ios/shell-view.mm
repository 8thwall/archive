// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#import "c8/html-shell/apple/ios/shell-view.h"

#include <limits>

#include "c8/c8-log.h"
#include "c8/map.h"

#include "c8/html-shell/apple/ios/input-event-data-converter.h"
#include "c8/html-shell/apple/ios/shell-app-state.h"
#include "c8/html-shell/input-event-data.h"

@interface ShellView () {
  c8::TreeMap<UITouch *, int32_t> touchMap;
  int32_t nextTouchId;
}
@end

@implementation ShellView

- (instancetype)initWithFrame:(CGRect)frame {
  self = [super initWithFrame:frame];
  if (self) {
    touchMap.clear();

    // NOTE(lreyna): Following what Safari does. They use a touch ID starting from INT32_MIN
    // and increment it for each new touch.
    // See: https://www.w3.org/TR/pointerevents/?utm_source=chatgpt.com#dom-pointerevent-pointerid
    nextTouchId = std::numeric_limits<int32_t>::min();
    self.multipleTouchEnabled = YES;
  }
  return self;
}

- (void)handleTouches:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event {
  if (touches.count == 0) {
    return;
  }

  const auto *appState = c8::getShellAppState();

  // It's possible that the touches set contains multiple touches, and this will count as a
  // separate pointer event for each touch.
  for (UITouch *touch in touches) {
    auto inputEventData = c8::convertFromPlatformTouchEvent(touch, touchMap, self);
    write(appState->inputEventPipeFd[1], &inputEventData, sizeof(c8::InputEventData));
  }
}

- (void)touchesBegan:(NSSet *)touches withEvent:(UIEvent *)event {
  for (UITouch *touch in touches) {
    touchMap[touch] = nextTouchId++;
  }
  [self handleTouches:touches withEvent:event];
}

- (void)touchesMoved:(NSSet *)touches withEvent:(UIEvent *)event {
  [self handleTouches:touches withEvent:event];
}

- (void)touchesEnded:(NSSet *)touches withEvent:(UIEvent *)event {
  [self handleTouches:touches withEvent:event];

  for (UITouch *touch in touches) {
    touchMap.erase(touch);
  }
}

@end
