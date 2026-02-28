// Copyright (c) 2025 Niantic, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)
//
// POD class for platform-agnostic input event data and serialization.

#pragma once

#include <array>
#include <cstdint>
#include <type_traits>

namespace c8 {

struct InputEventData {
  enum class EventType {
    KEY,
    MOTION,
    FOCUS,
    UNSUPPORTED,
  };

  enum class ActionType {
    DOWN,
    UP,
    MOVE,
    CANCEL,
    ENTER,
    OUT,
    UNSUPPORTED,
  };

  enum class ButtonType {
    PRIMARY,
    TERTIARY,
    SECONDARY,
    BACK,
    FORWARD,
    UNKNOWN,
  };

  enum class SourceType {
    KEYBOARD,
    MOUSE,
    TOUCHSCREEN,
    UNSUPPORTED,
  };

  enum class PointerType {
    MOUSE,
    PEN,
    TOUCH,
    UNSUPPORTED,
  };

  struct PointerData {
    int32_t pointerId;
    float x;
    float y;
    float pressure;
    float width;
    float height;
    int64_t timestamp;
    ButtonType button;
  };

  static constexpr int32_t MAX_CONCURRENT_POINTERS = 10;

  // Common event fields
  EventType type;        // Type of the event
  ActionType action;     // Action type for motion and key events
  SourceType source;     // Source of the event
  int64_t timestamp;     // Timestamp of the event, in nanoseconds
  int32_t pointerIndex;  // Pointer index for motion and key events

  // Reusing pointerId and pointerCount for different purposes based on type
  union {
    struct {
      int32_t keyCode;    // Key code for key events (only valid for KEY type)
      int32_t metaState;  // State of any modifier keys (only valid for KEY type)
    };
    struct {
      int32_t pointerId;     // Pointer ID for multi-touch (only valid for MOTION type)
      int32_t pointerCount;  // Number of pointers (only valid for MOTION type)
    };
  };
  int32_t changedTouchCount;                                        // Number of changed pointers
  std::array<PointerData, MAX_CONCURRENT_POINTERS> pointers;        // All pointers
  std::array<PointerData, MAX_CONCURRENT_POINTERS> changedTouches;  // Changed pointers

  // Motion event fields
  float x;                  // X coordinate of the touch (only valid for MOTION type)
  float y;                  // Y coordinate of the touch (only valid for MOTION type)
  float pressure;           // Pressure of the touch (only valid for MOTION type)
  float width;              // Width of the touch contact (only valid for MOTION type)
  float height;             // Height of the touch contact (only valid for MOTION type)
  PointerType pointerType;  // Tool type of the pointer
  ButtonType button;        // Which button was pressed (on a mouse, stylus, etc.)

  // Focus event field
  bool focus;  // Focus state (only relevant for FOCUS type)
};

// Ensure that InputEventData is a plain-old-data (POD) type, as we'll be relying on memcpy-able
// data.
static_assert(std::is_pod<InputEventData>::value, "InputEventData must be a POD type");

}  // namespace c8
