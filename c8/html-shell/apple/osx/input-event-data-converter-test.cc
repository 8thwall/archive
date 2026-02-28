// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#include "c8/html-shell/apple/osx/input-event-data-converter.h"

#import <AppKit/AppKit.h>
#include <gtest/gtest.h>

#include "c8/html-shell/input-event-data.h"

namespace c8 {

class InputEventDataConverterTest : public ::testing::Test {};

// TODO(yuhsianghuang): Set up NSWindow so that we can test inputEventData.width and height.

TEST_F(InputEventDataConverterTest, KeyEvent) {
  constexpr double keyEventX = 1234.5;
  constexpr double keyEventY = 678.9;
  constexpr double keyEventTimestampSec = 9.87654321;
  const auto *keyEvent = [NSEvent keyEventWithType:NSEventTypeKeyDown
                                          location:NSPoint{keyEventX, keyEventY}
                                     modifierFlags:NSEventModifierFlagCommand
                                         timestamp:keyEventTimestampSec
                                      windowNumber:0
                                           context:nil
                                        characters:@"a"
                       charactersIgnoringModifiers:@"a"
                                         isARepeat:NO
                                           keyCode:0];

  auto inputEventData = convertFromPlatformEvent(keyEvent);

  EXPECT_EQ(inputEventData.type, InputEventData::EventType::KEY);
  EXPECT_EQ(inputEventData.action, InputEventData::ActionType::DOWN);
  EXPECT_EQ(inputEventData.timestamp, static_cast<int64_t>(keyEventTimestampSec * 1e9));
  // TODO(yuhsianghuang): Complete this test after we implement convertKeyEventData().
}

TEST_F(InputEventDataConverterTest, MouseEvent) {
  constexpr double mouseEventX = 246.8;
  constexpr double mouseEventY = 1357.9;
  constexpr double mouseEventTimestampSec = 1.23456789;
  constexpr double mouseEventPressure = 0.5;
  const auto *mouseEvent = [NSEvent mouseEventWithType:NSEventTypeLeftMouseUp
                                              location:NSPoint{mouseEventX, mouseEventY}
                                         modifierFlags:NSEventModifierFlagCommand
                                             timestamp:mouseEventTimestampSec
                                          windowNumber:0
                                               context:nil
                                           eventNumber:0
                                            clickCount:1
                                              pressure:0.5];

  auto inputEventData = convertFromPlatformEvent(mouseEvent);

  EXPECT_EQ(inputEventData.type, InputEventData::EventType::MOTION);
  EXPECT_EQ(inputEventData.action, InputEventData::ActionType::UP);
  EXPECT_EQ(inputEventData.source, InputEventData::SourceType::MOUSE);
  EXPECT_EQ(inputEventData.timestamp, static_cast<int64_t>(mouseEventTimestampSec * 1e9));

  EXPECT_EQ(inputEventData.pointerIndex, 0);
  EXPECT_EQ(inputEventData.pointerId, 0);
  EXPECT_EQ(inputEventData.pointerCount, 1);

  EXPECT_FLOAT_EQ(inputEventData.x, mouseEventX);
  EXPECT_FLOAT_EQ(inputEventData.y, mouseEventY);
  EXPECT_FLOAT_EQ(inputEventData.pressure, mouseEventPressure);
  // TODO(yuhsianghuang): Test inputEventData.width and height.
  EXPECT_EQ(inputEventData.pointerType, InputEventData::PointerType::MOUSE);
  EXPECT_EQ(inputEventData.button, InputEventData::ButtonType::PRIMARY);
}

}  // namespace c8
