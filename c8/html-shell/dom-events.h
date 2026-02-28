#pragma once

#include "c8/c8-log.h"

namespace c8 {

// NOTE(lreyna): These strings should match what is defined for the Web API.
namespace DeviceOrientationEvent {

// DeviceOrientationEvent Consts
constexpr const char *NAME = "DeviceOrientationEvent";

constexpr const char *TYPE_DEVICEORIENTATION = "deviceorientation";

constexpr const char *OPTION_ALPHA = "alpha";
constexpr const char *OPTION_BETA = "beta";
constexpr const char *OPTION_GAMMA = "gamma";
constexpr const char *OPTION_ABSOLUTE = "absolute";

}  // namespace DeviceOrientationEvent

namespace DeviceMotionEvent {

// DeviceMotionEvent Consts
constexpr const char *NAME = "DeviceMotionEvent";

constexpr const char *TYPE_DEVICEMOTION = "devicemotion";

constexpr const char *OPTION_ACCELERATION = "acceleration";
constexpr const char *OPTION_ACCELERATION_INCLUDING_GRAVITY = "accelerationIncludingGravity";
constexpr const char *OPTION_ROTATION_RATE = "rotationRate";
constexpr const char *OPTION_INTERVAL = "interval";

constexpr const char *OPTION_ACCELERATION_X = "x";
constexpr const char *OPTION_ACCELERATION_Y = "y";
constexpr const char *OPTION_ACCELERATION_Z = "z";

constexpr const char *OPTION_ROTATION_RATE_ALPHA = "alpha";
constexpr const char *OPTION_ROTATION_RATE_BETA = "beta";
constexpr const char *OPTION_ROTATION_RATE_GAMMA = "gamma";

}  // namespace DeviceMotionEvent

namespace PointerEvent {

// PointerEvent Consts
constexpr const char *NAME = "PointerEvent";

constexpr const char *TYPE_POINTERDOWN = "pointerdown";
constexpr const char *TYPE_POINTERUP = "pointerup";
constexpr const char *TYPE_POINTERMOVE = "pointermove";
constexpr const char *TYPE_POINTERCANCEL = "pointercancel";
constexpr const char *TYPE_POINTEROUT = "pointerout";
constexpr const char *TYPE_POINTERENTER = "pointerenter";
}  // namespace PointerEvent

namespace TouchEvent {

// TouchEvent Consts
constexpr const char *NAME = "TouchEvent";

constexpr const char *TYPE_TOUCHSTART = "touchstart";
constexpr const char *TYPE_TOUCHEND = "touchend";
constexpr const char *TYPE_TOUCHMOVE = "touchmove";
constexpr const char *TYPE_TOUCHCANCEL = "touchcancel";

}  // namespace TouchEvent

namespace FocusEvent {

// FocusEvent Consts
constexpr const char *NAME = "FocusEvent";

constexpr const char *TYPE_FOCUS = "focus";
constexpr const char *TYPE_BLUR = "blur";

}  // namespace FocusEvent

namespace Event {

// Event Consts
constexpr const char *NAME = "Event";

constexpr const char *TYPE_RESIZE = "resize";

}  // namespace Event

}  // namespace c8
