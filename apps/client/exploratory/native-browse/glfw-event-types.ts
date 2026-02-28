// See: https://github.com/node-3d/glfw-raub/blob/master/src/cpp/glfw-events.cpp

interface GlfwBaseEvent {
  type: string
  target: any  // glfw-raub EventEmitter
  preventDefault: () => undefined
  stopPropagation: () => undefined
}

// Holds properties common to all mouse events: see 'fillMouse' in glfw-events.cpp
interface GlfwBaseMouseEvent extends GlfwBaseEvent {
  clientX: number
  clientY: number
  buttons: number
  ctrlKey: boolean
  shiftKey: boolean
  altKey: boolean
  metaKey: boolean
  pageX: number
  pageY: number
  x: number
  y: number
}

// See: 'mouseButtonCB' in glfw-events.cpp
// This is emitted by 'mousedown', 'mouseup', and 'click' events.
interface GlfwMouseButtonEvent extends GlfwBaseMouseEvent {
  button: number
  which: number
}

// See: 'mouseMoveCB' in glfw-events.cpp
// This is emitted by 'mousemove' event.
interface GlfwMouseMoveEvent extends GlfwBaseMouseEvent {
  movementX: number
  movementY: number
}

// See: 'scrollCB' in glfw-events.cpp
// This is emitted by 'wheel' and 'mousewheel' events.
interface GlfwMouseWheelEvent extends GlfwBaseMouseEvent {
  deltaX: number
  deltaY: number
  deltaZ: number
  wheelDelta: number
  wheelDeltaX: number
  wheelDeltaY: number
}

interface GlfwKeyEvent extends GlfwBaseEvent {
  altKey: boolean
  charCode: number
  code: string
  ctrlKey: boolean
  key: string
  keyCode: number
  metaKey: boolean
  repeat: boolean
  shiftKey: boolean
  which: number
}

interface GlfwFocusEvent extends GlfwBaseEvent {}

export type {
  GlfwFocusEvent,
  GlfwKeyEvent,
  GlfwMouseButtonEvent,
  GlfwMouseMoveEvent,
  GlfwMouseWheelEvent,
}
