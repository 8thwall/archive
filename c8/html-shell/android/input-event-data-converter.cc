// Copyright (c) 2025 Niantic, Inc.
// Original Author: Xiaokai Li (xiaokaili@nianticlabs.com)

#include "c8/html-shell/android/input-event-data-converter.h"

#include <algorithm>
#include <cmath>

namespace c8 {

InputEventData::ButtonType mapAndroidButton(int androidButton) {
  switch (androidButton) {
    case AMOTION_EVENT_BUTTON_PRIMARY:
    case AMOTION_EVENT_BUTTON_STYLUS_PRIMARY:
      return InputEventData::ButtonType::PRIMARY;
    case AMOTION_EVENT_BUTTON_TERTIARY:
      return InputEventData::ButtonType::TERTIARY;
    case AMOTION_EVENT_BUTTON_SECONDARY:
    case AMOTION_EVENT_BUTTON_STYLUS_SECONDARY:
      return InputEventData::ButtonType::SECONDARY;
    case AMOTION_EVENT_BUTTON_BACK:
      return InputEventData::ButtonType::BACK;
    case AMOTION_EVENT_BUTTON_FORWARD:
      return InputEventData::ButtonType::FORWARD;
    default:
      return InputEventData::ButtonType::UNKNOWN;
  }
}

InputEventData convertFromPlatformEvent(const AInputEvent *ev, float devicePixelRatio) noexcept {
  InputEventData data{};

  switch (AInputEvent_getSource(ev)) {
    case AINPUT_SOURCE_KEYBOARD:
      data.source = InputEventData::SourceType::KEYBOARD;
      break;
    case AINPUT_SOURCE_MOUSE:
      data.source = InputEventData::SourceType::MOUSE;
      break;
    case AINPUT_SOURCE_TOUCHSCREEN:
      data.source = InputEventData::SourceType::TOUCHSCREEN;
      break;
    default:
      data.source = InputEventData::SourceType::UNSUPPORTED;
      break;
  }
  switch (AInputEvent_getType(ev)) {
    case AINPUT_EVENT_TYPE_KEY: {
      data.type = InputEventData::EventType::KEY;
      int32_t actionAndPointerIndex = AMotionEvent_getAction(ev);
      int32_t action = actionAndPointerIndex & AMOTION_EVENT_ACTION_MASK;
      switch (action) {
        case AKEY_EVENT_ACTION_DOWN:
          data.action = InputEventData::ActionType::DOWN;
          break;
        case AKEY_EVENT_ACTION_UP:
          data.action = InputEventData::ActionType::UP;
          break;
        default:
          data.action = InputEventData::ActionType::UNSUPPORTED;
          break;
      }
      data.keyCode = AKeyEvent_getKeyCode(ev);
      data.metaState = AKeyEvent_getMetaState(ev);
      data.timestamp = AKeyEvent_getEventTime(ev);
      break;
    }
    case AINPUT_EVENT_TYPE_MOTION: {
      data.type = InputEventData::EventType::MOTION;
      int32_t actionAndPointerIndex = AMotionEvent_getAction(ev);
      int32_t action = actionAndPointerIndex & AMOTION_EVENT_ACTION_MASK;
      switch (action) {
        case AMOTION_EVENT_ACTION_DOWN:
        case AMOTION_EVENT_ACTION_POINTER_DOWN:
        case AMOTION_EVENT_ACTION_BUTTON_PRESS:
          data.action = InputEventData::ActionType::DOWN;
          break;
        case AMOTION_EVENT_ACTION_UP:
        case AMOTION_EVENT_ACTION_POINTER_UP:
        case AMOTION_EVENT_ACTION_BUTTON_RELEASE:
          data.action = InputEventData::ActionType::UP;
          break;
        case AMOTION_EVENT_ACTION_MOVE:
        case AMOTION_EVENT_ACTION_HOVER_MOVE:
          data.action = InputEventData::ActionType::MOVE;
          break;
        case AMOTION_EVENT_ACTION_CANCEL:
          data.action = InputEventData::ActionType::CANCEL;
          break;
        case AMOTION_EVENT_ACTION_HOVER_ENTER:
          data.action = InputEventData::ActionType::ENTER;
          break;
        case AMOTION_EVENT_ACTION_OUTSIDE:
        case AMOTION_EVENT_ACTION_HOVER_EXIT:
          data.action = InputEventData::ActionType::OUT;
          break;
        default:
          data.action = InputEventData::ActionType::UNSUPPORTED;
          break;
      }
      size_t pointerIndex = (actionAndPointerIndex & AMOTION_EVENT_ACTION_POINTER_INDEX_MASK)
        >> AMOTION_EVENT_ACTION_POINTER_INDEX_SHIFT;
      data.pointerId = AMotionEvent_getPointerId(ev, pointerIndex);
      data.pointerCount = AMotionEvent_getPointerCount(ev);

      // NOTE(lreyna): AMotionEvent_getX retrieves the unscaled pixel coordinates, we need to scale
      // them to the device pixel ratio to fit the web standard.
      data.x = AMotionEvent_getX(ev, pointerIndex) / devicePixelRatio;
      data.y = AMotionEvent_getY(ev, pointerIndex) / devicePixelRatio;
      data.pressure = AMotionEvent_getPressure(ev, pointerIndex);
      switch (AMotionEvent_getToolType(ev, pointerIndex)) {
        case AMOTION_EVENT_TOOL_TYPE_FINGER:
        case AMOTION_EVENT_TOOL_TYPE_PALM:
          data.pointerType = InputEventData::PointerType::TOUCH;
          break;
        case AMOTION_EVENT_TOOL_TYPE_STYLUS:
        case AMOTION_EVENT_TOOL_TYPE_ERASER:
          data.pointerType = InputEventData::PointerType::PEN;
          break;
        case AMOTION_EVENT_TOOL_TYPE_MOUSE:
          data.pointerType = InputEventData::PointerType::MOUSE;
          break;
        case AMOTION_EVENT_TOOL_TYPE_UNKNOWN:
          data.pointerType = InputEventData::PointerType::UNSUPPORTED;
          break;
      }
      int maxPointers = std::min(data.pointerCount, InputEventData::MAX_CONCURRENT_POINTERS);

      int64_t timestamp = AMotionEvent_getEventTime(ev);
      int32_t buttonState = AMotionEvent_getButtonState(ev);

      for (size_t i = 0; i < maxPointers; ++i) {
        InputEventData::PointerData &pointerData = data.pointers[i];

        pointerData.pointerId = AMotionEvent_getPointerId(ev, i);
        pointerData.x = AMotionEvent_getX(ev, i) / devicePixelRatio;
        pointerData.y = AMotionEvent_getY(ev, i) / devicePixelRatio;
        pointerData.pressure = AMotionEvent_getPressure(ev, i);

        float major = AMotionEvent_getTouchMajor(ev, i);
        float minor = AMotionEvent_getTouchMinor(ev, i);
        float angleRadians = AMotionEvent_getOrientation(ev, i);

        float cosAngle = std::cosf(angleRadians);
        float sinAngle = std::sinf(angleRadians);

        pointerData.width = major * cosAngle + minor * sinAngle;
        pointerData.height = major * sinAngle + minor * cosAngle;

        pointerData.timestamp = timestamp;
        pointerData.button = mapAndroidButton(buttonState);

        if (i == pointerIndex) {
          data.changedTouches[i] = pointerData;
          ++data.changedTouchCount;
        }
      }

      break;
    }
    case AINPUT_EVENT_TYPE_FOCUS: {
      data.type = InputEventData::EventType::FOCUS;
      data.focus = AInputEvent_getType(ev) == AINPUT_EVENT_TYPE_FOCUS;
      break;
    }
    default: {
      data.type = InputEventData::EventType::UNSUPPORTED;
      break;
    }
  };

  return data;
}

}  // namespace c8
