// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yu-Hsiang Huang (yuhsianghuang@nianticlabs.com)

#include "c8/html-shell/apple/osx/input-event-data-converter.h"

#include "c8/c8-log.h"

namespace c8 {

namespace {

void convertCommonEventData(const NSEvent *ev, InputEventData *data) noexcept {
  switch (ev.type) {
    case NSEventTypeKeyDown:
    case NSEventTypeKeyUp:
      data->type = InputEventData::EventType::KEY;
      break;
    case NSEventTypeLeftMouseDown:
    case NSEventTypeLeftMouseUp:
    case NSEventTypeRightMouseDown:
    case NSEventTypeRightMouseUp:
    case NSEventTypeOtherMouseDown:
    case NSEventTypeOtherMouseUp:
    case NSEventTypeMouseMoved:
    case NSEventTypeLeftMouseDragged:
    case NSEventTypeRightMouseDragged:
    case NSEventTypeOtherMouseDragged:
      data->type = InputEventData::EventType::MOTION;
      break;
    default:
      data->type = InputEventData::EventType::UNSUPPORTED;
      C8Log("[input-event-data-converter] Unsupported event type: %d", ev.type);
      break;
  }

  switch (ev.type) {
    case NSEventTypeKeyDown:
    case NSEventTypeLeftMouseDown:
    case NSEventTypeRightMouseDown:
    case NSEventTypeOtherMouseDown:
      data->action = InputEventData::ActionType::DOWN;
      break;
    case NSEventTypeKeyUp:
    case NSEventTypeLeftMouseUp:
    case NSEventTypeRightMouseUp:
    case NSEventTypeOtherMouseUp:
      data->action = InputEventData::ActionType::UP;
      break;
    case NSEventTypeMouseMoved:
    case NSEventTypeLeftMouseDragged:
    case NSEventTypeRightMouseDragged:
    case NSEventTypeOtherMouseDragged:
      data->action = InputEventData::ActionType::MOVE;
      break;
    default:
      data->action = InputEventData::ActionType::UNSUPPORTED;
      C8Log("[input-event-data-converter] Unsupported action type: %d", ev.type);
      break;
  }

  switch (ev.type) {
    case NSEventTypeKeyDown:
    case NSEventTypeKeyUp:
      data->source = InputEventData::SourceType::KEYBOARD;
      break;
    case NSEventTypeLeftMouseDown:
    case NSEventTypeLeftMouseUp:
    case NSEventTypeRightMouseDown:
    case NSEventTypeRightMouseUp:
    case NSEventTypeOtherMouseDown:
    case NSEventTypeOtherMouseUp:
    case NSEventTypeMouseMoved:
    case NSEventTypeLeftMouseDragged:
    case NSEventTypeRightMouseDragged:
    case NSEventTypeOtherMouseDragged:
      data->source = InputEventData::SourceType::MOUSE;
      break;
    default:
      data->source = InputEventData::SourceType::UNSUPPORTED;
      C8Log("[input-event-data-converter] Unsupported source type: %d", ev.type);
      break;
  }

  data->timestamp = static_cast<int64_t>(ev.timestamp * 1e9);  // second -> nanosecond
}

void convertMotionEventData(const NSEvent *ev, InputEventData *data) noexcept {
  data->pointerIndex = 0;
  data->pointerId = 0;
  data->pointerCount = 1;

  data->x = ev.locationInWindow.x;
  data->y = ev.locationInWindow.y;
  data->pressure = ev.pressure;
  data->width = ev.window.frame.size.width;
  data->height = ev.window.frame.size.height;
  data->pointerType = InputEventData::PointerType::MOUSE;
  data->button = InputEventData::ButtonType::PRIMARY;
}

}  // namespace

InputEventData convertFromPlatformEvent(const NSEvent *ev) noexcept {
  InputEventData data{};

  convertCommonEventData(ev, &data);

  switch (data.type) {
    case InputEventData::EventType::KEY:
      // TODO(yuhsianghuang): Add support for KEY events.
      // convertKeyEventData(ev, &data);
      break;
    case InputEventData::EventType::MOTION:
      convertMotionEventData(ev, &data);
      break;
    default:
      break;
  }

  return data;
}

}  // namespace c8
