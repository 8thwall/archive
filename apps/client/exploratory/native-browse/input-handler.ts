// eslint-disable-next-line local-rules/type-only-imports
import {Window, Document, type HTMLCanvasElement, type NodeList} from '@nia/c8/dom/dom'
import type {Document as GlfwWindow} from '@nia/third_party/glfw-raub/glfw-raub'
import type {
  GlfwFocusEvent, GlfwMouseButtonEvent, GlfwMouseMoveEvent,
  GlfwMouseWheelEvent, GlfwKeyEvent,
} from './glfw-event-types'

const createInputHandler = () => {
  let glfwWindow_: GlfwWindow
  let window_: Window
  let document_: Document
  let attached_ = false
  let mouseDown_ = false

  const dispatchInputEvent = (event: Event) => {
    let currentCanvas: HTMLCanvasElement | null = null
    const canvases = document_.querySelectorAll('canvas') as NodeList<HTMLCanvasElement>
    for (const canvas of canvases) {
      const gl = canvas?.getContext('webgl2')
      if (gl) {
        currentCanvas = canvas
        break
      }
    }
    if (currentCanvas) {
      currentCanvas.dispatchEvent(event)
    } else {
      window_.dispatchEvent(event)
    }
  }

  const publishKeyEvent = (glfwKeyEvent: GlfwKeyEvent) => {
    dispatchInputEvent(
      new window_.KeyboardEvent(glfwKeyEvent.type, {
        altKey: glfwKeyEvent.altKey,
        charCode: glfwKeyEvent.charCode,
        code: glfwKeyEvent.code,
        ctrlKey: glfwKeyEvent.ctrlKey,
        key: glfwKeyEvent.key,
        keyCode: glfwKeyEvent.keyCode,
        metaKey: glfwKeyEvent.metaKey,
        repeat: glfwKeyEvent.repeat,
        shiftKey: glfwKeyEvent.shiftKey,
        which: glfwKeyEvent.which,
        bubbles: true,
      })
    )
  }

  const publishPointerDownEvent = (glfwPtrEvent: GlfwMouseButtonEvent) => {
    dispatchInputEvent(
      new window_.PointerEvent('pointerdown', {
        clientX: glfwPtrEvent.clientX,
        clientY: glfwPtrEvent.clientY,
        pointerId: glfwPtrEvent.which,
        button: glfwPtrEvent.button,
        buttons: glfwPtrEvent.buttons,
        screenX: glfwPtrEvent.x,
        screenY: glfwPtrEvent.y,
        ctrlKey: glfwPtrEvent.ctrlKey,
        altKey: glfwPtrEvent.altKey,
        shiftKey: glfwPtrEvent.shiftKey,
        metaKey: glfwPtrEvent.metaKey,
        bubbles: true,
      })
    )

    dispatchInputEvent(
      new window_.MouseEvent('mousedown', {
        clientX: glfwPtrEvent.clientX,
        clientY: glfwPtrEvent.clientY,
        button: glfwPtrEvent.button,
        buttons: glfwPtrEvent.buttons,
        screenX: glfwPtrEvent.x,
        screenY: glfwPtrEvent.y,
        ctrlKey: glfwPtrEvent.ctrlKey,
        altKey: glfwPtrEvent.altKey,
        shiftKey: glfwPtrEvent.shiftKey,
        metaKey: glfwPtrEvent.metaKey,
        bubbles: true,
      })
    )
    mouseDown_ = true
  }

  const publishPointerUpEvent = (glfwPtrEvent: GlfwMouseButtonEvent) => {
    dispatchInputEvent(
      new window_.PointerEvent('pointerup', {
        clientX: glfwPtrEvent.clientX,
        clientY: glfwPtrEvent.clientY,
        pointerId: glfwPtrEvent.which,
        button: glfwPtrEvent.button,
        buttons: glfwPtrEvent.buttons,
        screenX: glfwPtrEvent.x,
        screenY: glfwPtrEvent.y,
        ctrlKey: glfwPtrEvent.ctrlKey,
        altKey: glfwPtrEvent.altKey,
        shiftKey: glfwPtrEvent.shiftKey,
        metaKey: glfwPtrEvent.metaKey,
        bubbles: true,
      })
    )

    dispatchInputEvent(
      new window_.MouseEvent('mouseup', {
        clientX: glfwPtrEvent.clientX,
        clientY: glfwPtrEvent.clientY,
        button: glfwPtrEvent.button,
        buttons: glfwPtrEvent.buttons,
        screenX: glfwPtrEvent.x,
        screenY: glfwPtrEvent.y,
        ctrlKey: glfwPtrEvent.ctrlKey,
        altKey: glfwPtrEvent.altKey,
        shiftKey: glfwPtrEvent.shiftKey,
        metaKey: glfwPtrEvent.metaKey,
        bubbles: true,
      })
    )

    if (mouseDown_) {
      dispatchInputEvent(
        new window_.PointerEvent('click', {
          clientX: glfwPtrEvent.clientX,
          clientY: glfwPtrEvent.clientY,
          pointerId: glfwPtrEvent.which,
          button: glfwPtrEvent.button,
          buttons: glfwPtrEvent.buttons,
          screenX: glfwPtrEvent.x,
          screenY: glfwPtrEvent.y,
          ctrlKey: glfwPtrEvent.ctrlKey,
          altKey: glfwPtrEvent.altKey,
          shiftKey: glfwPtrEvent.shiftKey,
          metaKey: glfwPtrEvent.metaKey,
          bubbles: true,
        })
      )
      mouseDown_ = false
    }
  }

  const publishPointerMoveEvent = (glfwPtrEvent: GlfwMouseMoveEvent) => {
    const pointerEvent = new window_.PointerEvent('pointermove', {
      clientX: glfwPtrEvent.clientX,
      clientY: glfwPtrEvent.clientY,
      buttons: glfwPtrEvent.buttons,
      screenX: glfwPtrEvent.x,
      screenY: glfwPtrEvent.y,
      ctrlKey: glfwPtrEvent.ctrlKey,
      altKey: glfwPtrEvent.altKey,
      shiftKey: glfwPtrEvent.shiftKey,
      metaKey: glfwPtrEvent.metaKey,
      bubbles: true,
    })

    // @ts-ignore
    pointerEvent.movementX = glfwPtrEvent.movementX
    // @ts-ignore
    pointerEvent.movementY = glfwPtrEvent.movementY

    const mouseEvent = new window_.MouseEvent('mousemove', {
      clientX: glfwPtrEvent.clientX,
      clientY: glfwPtrEvent.clientY,
      buttons: glfwPtrEvent.buttons,
      screenX: glfwPtrEvent.x,
      screenY: glfwPtrEvent.y,
      ctrlKey: glfwPtrEvent.ctrlKey,
      altKey: glfwPtrEvent.altKey,
      shiftKey: glfwPtrEvent.shiftKey,
      metaKey: glfwPtrEvent.metaKey,
      bubbles: true,
    })

    // @ts-ignore
    mouseEvent.movementX = glfwPtrEvent.movementX
    // @ts-ignore
    mouseEvent.movementY = glfwPtrEvent.movementY

    dispatchInputEvent(pointerEvent)

    dispatchInputEvent(mouseEvent)
  }

  const publishMouseWheelEvent = (glfwMouseWheelEvent: GlfwMouseWheelEvent) => {
    dispatchInputEvent(
      new window_.WheelEvent('wheel', {
        deltaX: glfwMouseWheelEvent.deltaX,
        deltaY: glfwMouseWheelEvent.deltaY,
        deltaZ: glfwMouseWheelEvent.deltaZ,
        screenX: glfwMouseWheelEvent.x,
        screenY: glfwMouseWheelEvent.y,
        clientX: glfwMouseWheelEvent.clientX,
        clientY: glfwMouseWheelEvent.clientY,
        buttons: glfwMouseWheelEvent.buttons,
        ctrlKey: glfwMouseWheelEvent.ctrlKey,
        shiftKey: glfwMouseWheelEvent.shiftKey,
        altKey: glfwMouseWheelEvent.altKey,
        metaKey: glfwMouseWheelEvent.metaKey,
        bubbles: true,
      })
    )
  }

  const resizeEvent = (glfwWinEvent: any) => {
    Object.defineProperty(window_, 'innerWidth', {
      get: () => glfwWinEvent.width,
    })

    Object.defineProperty(window_, 'innerHeight', {
      get: () => glfwWinEvent.height,
    })

    window_.dispatchEvent(new window_.Event('resize'))
  }

  const publishFocusEvent = (glfwFocusEvent: GlfwFocusEvent) => {
    window_.dispatchEvent(new window_.FocusEvent(glfwFocusEvent.type, {
      relatedTarget: glfwFocusEvent.target,
      bubbles: true,
    }))
  }

  // You might have to re-create the event object so that the right one is dispatched for c8/ecs
  // reference to the ones we can pass through:
  // https://github.com/node-3d/glfw-raub/blob/master/examples/events.js
  const attach = (glfwWindow: GlfwWindow, window: Window) => {
    if (attached_) {
      throw new Error('InputHandler is already attached')
    }

    attached_ = true
    glfwWindow_ = glfwWindow
    window_ = window
    document_ = window.document

    glfwWindow_.on('keydown', publishKeyEvent)
    glfwWindow_.on('keyup', publishKeyEvent)
    glfwWindow_.on('mousewheel', publishMouseWheelEvent)
    glfwWindow_.on('mouseup', publishPointerUpEvent)
    glfwWindow_.on('mousemove', publishPointerMoveEvent)
    glfwWindow_.on('mousedown', publishPointerDownEvent)
    glfwWindow_.on('wresize', resizeEvent)
    glfwWindow_.on('focus', publishFocusEvent)
    glfwWindow_.on('focusin', publishFocusEvent)
    glfwWindow_.on('focusout', publishFocusEvent)
    glfwWindow_.on('blur', publishFocusEvent)
  }

  const updateWindow = (newWindow: Window) => {
    window_ = newWindow
    document_ = newWindow.document
  }

  return {
    attach,
    updateWindow,
  }
}

export {createInputHandler}
