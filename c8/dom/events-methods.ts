// @sublibrary(:dom-core-lib)
import {
  addEventListener,
  removeEventListener,
  getEventListenerList,
  type EventHandler,
  type EventListener,
  type AddEventListenerOptions,
  type EventListenerOptions,
} from './events-internal'

// To flatten options, run these steps:
// https://dom.spec.whatwg.org/#concept-flatten-options
const flatten = (options: AddEventListenerOptions | boolean): boolean => {
  // If options is a boolean, then return options.
  if (typeof options === 'boolean') {
    return options
  }

  // Return options["capture"].
  return options.capture ?? false
}

// To flatten more options, run these steps:
// See: https://dom.spec.whatwg.org/#event-flatten-more
const flattenMoreOptions = (
  options: AddEventListenerOptions | boolean
): [boolean, boolean, boolean, AbortSignal | null] => {
  // 1. Let capture be the result of flattening options.
  const capture = flatten(options)

  // 2. Let once be false.
  let once = false

  // 3. Let passive and signal be null.
  let passive = false
  let signal = null

  // 4. If options is a dictionary, then:
  if (typeof options === 'object') {
    // 1. Set once to options["once"].
    once = options.once ?? false

    // 2. If options["passive"] exists, then set passive to options["passive"].
    passive = options.passive ?? false

    // 3. If options["signal"] exists, then set signal to options["signal"].
    if (options.signal !== undefined) {
      signal = options.signal
    }
  }

  return [capture, passive, once, signal]
}

// The addEventListener(type, callback, options) method steps are:
// See: https://dom.spec.whatwg.org/#dom-eventtarget-addeventlistener
const addEventListenerWrapped = (
  target: EventTarget,
  type: string,
  callback?: EventHandler | EventListener,
  options?: AddEventListenerOptions | boolean
) => {
  // Let capture, passive, once, and signal be the result of flattening more options.
  const [capture, passive, once, signal] = flattenMoreOptions(options ?? false)

  // Add an event listener with this and an event listener whose type is type, callback is callback,
  // capture is capture, passive is passive, once is once, and signal is signal.
  addEventListener(target, {
    type,
    callback: callback ?? null,
    capture,
    passive,
    once,
    signal,
    removed: false,
  })
}

// The removeEventListener(type, callback, options) method steps are:
// See: https://dom.spec.whatwg.org/#dom-eventtarget-removeeventlistener
const removeEventListenerWrapped = (
  target: EventTarget,
  type: string,
  callback?: EventHandler | EventListener,
  options?: EventListenerOptions | boolean
) => {
  // Let capture be the result of flattening options.
  const capture = flatten(options ?? false)

  // If this’s event listener list contains an event listener whose type is type, callback is
  // callback, and capture is capture, then remove an event listener with this and that event
  // listener.
  const listeners = getEventListenerList(target)
  const listener = Array.from(listeners).find(l => (
    l.type === type &&
    l.callback === callback &&
    l.capture === capture
  ))
  if (listener) {
    removeEventListener(target, listener)
  }
}

export {
  addEventListenerWrapped,
  removeEventListenerWrapped,
}
