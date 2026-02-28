// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#include "c8/html-shell/apple/ios/input-event-data-converter.h"

#include "c8/c8-log.h"

namespace c8 {

namespace {

void convertCommonEventData(UITouch *touch, InputEventData *data) noexcept {
  // Always treat touch event as a MOTION event.
  data->type = InputEventData::EventType::MOTION;

  switch (touch.phase) {
    case UITouchPhaseBegan:
      data->action = InputEventData::ActionType::DOWN;
      break;
    case UITouchPhaseEnded:
      data->action = InputEventData::ActionType::UP;
      break;
    case UITouchPhaseMoved:
      data->action = InputEventData::ActionType::MOVE;
      break;
    default:
      data->action = InputEventData::ActionType::UNSUPPORTED;
      C8Log("[input-event-data-converter] Unsupported action type: %d", touch.phase);
      break;
  }

  data->source = InputEventData::SourceType::TOUCHSCREEN;
}

template <typename T>
concept ValidPointerType =
  std::is_same_v<T, InputEventData> || std::is_same_v<T, InputEventData::PointerData>;

template <ValidPointerType PointerData>
void convertMotionEventData(
  UITouch *touch, int32_t touchId, UIView *view, PointerData *data, int pointerIndex = 0) noexcept {
  data->pointerIndex = pointerIndex;
  data->pointerId = touchId;

  CGPoint locationInView = [touch locationInView:view];
  data->x = locationInView.x;
  data->y = locationInView.y;
  data->pressure = touch.force;

  if (@available(iOS 8.0, *)) {
    data->width = touch.majorRadius * 2.0;  // diameter in client pixels
    data->height = touch.majorRadius * 2.0;
  } else {
    data->width = 0;
    data->height = 0;
  }

  switch (touch.type) {
    case UITouchTypeDirect:
      data->pointerType = InputEventData::PointerType::TOUCH;
      break;
    case UITouchTypeStylus:
      data->pointerType = InputEventData::PointerType::PEN;
      break;
    default:
      data->pointerType = InputEventData::PointerType::UNSUPPORTED;
      C8Log("[input-event-data-converter] Unsupported pointer type: %d", touch.type);
      break;
  }

  data->timestamp = static_cast<int64_t>(touch.timestamp * 1e9);  // second -> nanosecond
  data->button = InputEventData::ButtonType::PRIMARY;  // UIKit does not provide button info
}

}  // namespace

InputEventData convertFromPlatformTouchEvent(
  UITouch *mainTouch, const TreeMap<UITouch *, int32_t> &touchMap, UIView *view) noexcept {
  InputEventData data{};

  data.pointerCount = static_cast<int>(touchMap.size());

  if (data.pointerCount == 0) {
    return data;
  }

  convertCommonEventData(mainTouch, &data);
  convertMotionEventData(mainTouch, touchMap.at(mainTouch), view, &data);

  // TODO(lreyna): Handle Touch API by creating MotionEventData for each touch in one event.
  // It may be better to rewrite our Input system to track the active event listeners, similarly to
  // the sensor event system.

  return data;
}

}  // namespace c8
