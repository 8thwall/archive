// @sublibrary(:dom-core-lib)
import vm from 'vm'

import {
  nodeDocument,
} from './node-internal'
import {
  BeforeUnloadEvent,
  ErrorEvent,
} from './dom-events'
import type {
  CompletionRecord,
} from './completion-record'
import type {Node} from './node'
import type {Document} from './document'
import {environmentSettingsSym} from './document-symbols'
import type {Element} from './element'
import type {Window} from './window'
import {reportException} from './window-methods'
import {addAttributeChangeSteps} from './attribute-change-steps'
import {
  windowEventHandlerNames,
  windowReflectingBodyElementEventHandlerNames,
} from './window-event-handler-names'

const eventTargetSym = Symbol.for('nodejs.event_target')

interface EventListenerOptions {
  capture?: boolean
}

interface AddEventListenerOptions extends EventListenerOptions {
  passive?: boolean
  once?: boolean
  signal?: AbortSignal
}

interface ScriptLocation {
  filename: string
  lineOffset: number
  columnOffset: number
}

// See: https://html.spec.whatwg.org/#internal-raw-uncompiled-handler
class InternalRawEventHandler {
  constructor(body: string, location: ScriptLocation) {
    this.body = body
    this.location = location
  }

  readonly body: string

  readonly location: ScriptLocation
}

interface EventHandler {
  (evt: Event): any;
}

interface EventListener {
  handleEvent(object: Event): any;
}

// An event listener can be used to observe a specific event and consists of:
// Note: Although callback is an EventListener object, an event listener is a broader concept as can
// be seen.
// See: https://dom.spec.whatwg.org/#concept-event-listener
interface EventListenerConcept {
  // type (a string)
  type: string,

  // callback (null or an EventListener object)
  callback: null | EventHandler | EventListener,

  // capture (a boolean, initially false)
  capture: boolean,

  // passive (null or a boolean, initially null)
  passive: null | boolean,

  // once (a boolean, initially false)
  once: boolean,

  // signal (null or an AbortSignal object)
  signal: null | AbortSignal,

  // removed (a boolean for bookkeeping purposes, initially false)
  removed: boolean,
}
const createEventListenerConcept = (): EventListenerConcept => ({
  type: '',
  callback: null,
  capture: false,
  passive: null,
  once: false,
  signal: null,
  removed: false,
})

// An event handler is a struct with two items:
// See: https://html.spec.whatwg.org/#event-handlers
interface EventHandlerConcept {
  // A value, which is either null, a callback object, or an internal raw uncompiled handler. The
  // EventHandler callback function type describes how this is exposed to scripts. Initially, an
  // event handler's value must be set to null.
  value: null | EventHandler | InternalRawEventHandler

  // A listener, which is either null or an event listener responsible for running the event handler
  // processing algorithm. Initially, an event handler's listener must be set to null.
  listener: null | EventListenerConcept
}
const createEventHandlerConcept = (): EventHandlerConcept => ({
  value: null,
  listener: null,
})

// Each EventTarget object has an associated event listener list (a list of zero or more event
// listeners). It is initially the empty list.
const eventListenerList = new WeakMap<EventTarget, Set<EventListenerConcept>>()
const getEventListenerList = (eventTarget: EventTarget): Set<EventListenerConcept> => {
  let list = eventListenerList.get(eventTarget)
  if (!list) {
    list = new Set()
    eventListenerList.set(eventTarget, list)
  }
  return list
}

// Each EventTarget object that has one or more event handlers specified has an associated event
// handler map, which is a map of strings representing names of event handlers to event handlers.
// See: https://html.spec.whatwg.org/#event-handler-map
const eventHandlerMap = new WeakMap<EventTarget, Map<string, EventHandlerConcept>>()
const getEventHandlerMap = (eventTarget: EventTarget): Map<string, EventHandlerConcept> => {
  let map = eventHandlerMap.get(eventTarget)
  if (!map) {
    map = new Map()
    eventHandlerMap.set(eventTarget, map)
  }
  return map
}

const getHandler = (
  handlerMap: Map<string, EventHandlerConcept>, name: string
): EventHandlerConcept => {
  if (!handlerMap.has(name)) {
    handlerMap.set(name, createEventHandlerConcept())
  }
  return handlerMap.get(name)!
}

// When an EventTarget object that has one or more event handlers specified is created, its event
// handler map must be initialized such that it contains an entry for each event handler that has
// that object as target, with items in those event handlers set to their initial values.
const initializeEventHandlerMap = (
  eventTarget: EventTarget,
  eventHandlerNames: ReadonlyArray<string>
): void => {
  const handlerMap = getEventHandlerMap(eventTarget)
  eventHandlerNames.forEach((name) => {
    handlerMap.set(name, createEventHandlerConcept())
  })
}

// To determine the target of an event handler, given an EventTarget object eventTarget on which the
// event handler is exposed, and an event handler name name, the following steps are taken:
// See: https://html.spec.whatwg.org/#determining-the-target-of-an-event-handler
const determineEventHandlerTarget = (
  eventTarget: EventTarget, name: string
): EventTarget | null => {
  // 1. If eventTarget is not a body element or a frameset element, then return eventTarget.
  if (eventTarget.constructor.name !== 'HTMLBodyElement' &&
    eventTarget.constructor.name !== 'HTMLFrameSetElement') {
    return eventTarget
  }

  // 2. If name is not the name of an attribute member of the WindowEventHandlers interface mixin
  // and the Window-reflecting body element event handler set does not contain name, then return
  // eventTarget.
  if (!(windowEventHandlerNames as ReadonlyArray<string>).includes(name) &&
      !(windowReflectingBodyElementEventHandlerNames as ReadonlyArray<string>).includes(name)) {
    return eventTarget
  }

  // 3. If eventTarget's node document is not an active document, then return null.
  // Note: This could happen if this object is a body element without a corresponding Window object,
  // for example.
  // Note: This check does not necessarily prevent body and frameset elements that are not the body
  // element of their node document from reaching the next step. In particular, a body element
  // created in an active document (perhaps with document.createElement()) but not connected will
  // also have its corresponding Window object as the target of several event handlers exposed
  // through it.
  // [NOT IMPLEMENTED]
  const doc = nodeDocument(eventTarget as Node)
  if (!doc) {
    return null
  }

  // 4. Return eventTarget's node document's relevant global object.
  return globalThis as unknown as EventTarget
}

// When the user agent is to get the current value of the event handler given an EventTarget object
// eventTarget and a string name that is the name of an event handler, it must run these steps:
// See: /multipage/webappapis.html#getting-the-current-value-of-the-event-handler
const getCurrentValueOfEventHandler = (
  eventTarget: EventTarget,
  name: string
): EventHandler | null => {
  // 1. Let handlerMap be eventTarget's event handler map.
  const handlerMap = getEventHandlerMap(eventTarget)

  // 2. Let eventHandler be handlerMap[name].
  const eventHandler = getHandler(handlerMap, name)

  // 3. If eventHandler's value is an internal raw uncompiled handler, then:
  if (eventHandler?.value instanceof InternalRawEventHandler) {
    // 1. If eventTarget is an element, then let element be eventTarget, and document be element's
    // node document. Otherwise, eventTarget is a Window object, let element be null, and document
    // be eventTarget's associated Document.
    let element: Element | null
    let doc: Document
    if (eventTarget.constructor.name.endsWith('Element')) {
      element = eventTarget as Element
      doc = nodeDocument(element)
    } else {
      element = null
      doc = (eventTarget as Window).document
    }

    // 2. If scripting is disabled for document, then return null.
    // [NOT IMPLEMENTED]

    // 3. Let body be the uncompiled script body in eventHandler's value.
    const {body} = eventHandler.value

    // 4. Let location be the location where the script body originated, as given by eventHandler's
    // value.
    const {location} = eventHandler.value

    // 5. If element is not null and element has a form owner, let form owner be that form owner.
    // Otherwise, let form owner be null.
    // [NOT IMPLEMENTED]

    // 6. Let settings object be the relevant settings object of document.
    const settingsObject = doc[environmentSettingsSym]

    // 7. If body is not parsable as FunctionBody or if parsing detects an early error, then follow
    // these substeps:
    let compiledFunction: EventHandler

    // 9. Let function be the result of calling OrdinaryFunctionCreate, with arguments:
    let parameterList
    if (name === 'onerror' && eventTarget.constructor.name === 'Window') {
      //  Let the function have five arguments, named event, source, lineno, colno, and error.
      parameterList = ['event', 'source', 'lineno', 'colno', 'error']
    } else {  //  Otherwise
      //  Let the function have a single argument called event.
      parameterList = ['event']
    }

    try {
      compiledFunction = vm.compileFunction(
        body,
        parameterList,
        {
          filename: location.filename,
          columnOffset: location.columnOffset,
          lineOffset: location.lineOffset,
          // 8. Push settings object's realm execution context onto the JavaScript execution context
          // stack; it is now the running JavaScript execution context.
          // Note: This is necessary so the subsequent invocation of OrdinaryFunctionCreate takes
          // place in the correct realm.
          parsingContext: settingsObject.realmExecutionContext,
        }
      ) as EventHandler
    } catch (e) {
      // 1. Set eventHandler's value to null.
      // Note: This does not deactivate the event handler, which additionally removes the event
      // handler's listener (if present).
      eventHandler.value = null

      // 2. Let syntaxError be a new SyntaxError exception associated with settings object's realm
      // which describes the error while parsing. It should be based on location, where the script
      // body originated.
      const syntaxError = new SyntaxError(`Error while parsing script body: ${e.message}`)

      // 3. Report an exception with syntaxError for settings object's global object.
      reportException(syntaxError, settingsObject.globalObject)

      // 4. Return null.
      return null
    }

    // 10. Remove settings object's realm execution context from the JavaScript execution context
    // stack.
    // [IMPLIED BY VM Context]

    // 11. Set function.[[ScriptOrModule]] to null.
    // Note: This is done because the default behavior, of associating the created function with the
    // nearest script on the stack, can lead to path-dependent results. For example, an event
    // handler which is first invoked by user interaction would end up with null [[ScriptOrModule]]
    // (since then this algorithm would be first invoked when the active script is null), whereas
    // one that is first invoked by dispatching an event from script would have its
    // [[ScriptOrModule]] set to that script.
    //
    // Instead, we just always set [[ScriptOrModule]] to null. This is more intuitive anyway; the
    // idea that the first script which dispatches an event is somehow responsible for the event
    // handler code is dubious.
    //
    // In practice, this only affects the resolution of relative URLs via import(), which consult
    // the base URL of the associated script. Nulling out [[ScriptOrModule]] means that
    // HostLoadImportedModule will fall back to the current settings object's API base URL.
    // [NOT IMPLEMENTED]

    // 12. Set eventHandler's value to the result of creating a Web IDL EventHandler callback
    // function object whose object reference is function and whose callback context is settings
    // object.
    eventHandler.value = compiledFunction
  }

  // 4. Return eventHandler's value.
  return eventHandler.value as EventHandler
}

// To remove an event listener, given an EventTarget object eventTarget and an event listener
// listener, run these steps:
// See: https://dom.spec.whatwg.org/#remove-an-event-listener
const removeEventListener = (eventTarget: EventTarget, listener: EventListenerConcept): void => {
  // 1. If eventTarget is a ServiceWorkerGlobalScope object and its service worker’s set of event
  // types to handle contains listener’s type, then report a warning to the console that this might
  // not give the expected results. [SERVICE-WORKERS]
  if (eventTarget.constructor.name === 'ServiceWorkerGlobalScope') {
    console.warn('This might not give the expected results')  // eslint-disable-line no-console
  }

  // 2. Set listener’s removed to true and remove listener from eventTarget’s event listener list.
  listener.removed = true
  getEventListenerList(eventTarget).delete(listener)
  EventTarget.prototype.removeEventListener.call(
    eventTarget, listener.type, listener.callback!, {capture: listener.capture}
  )
}

// To deactivate an event handler given an EventTarget object eventTarget and a string name that is
// the name of an event handler, run these steps:
// See: https://html.spec.whatwg.org/#deactivate-an-event-handler
const deactivateEventHandler = (eventTarget: EventTarget, name: string): void => {
  // 1. Let handlerMap be eventTarget's event handler map.
  const handlerMap = getEventHandlerMap(eventTarget)

  // 2. Let eventHandler be handlerMap[name].
  const eventHandler = getHandler(handlerMap, name)

  // 3. Set eventHandler's value to null.
  eventHandler.value = null

  // 4. Let listener be eventHandler's listener.
  const {listener} = eventHandler

  // 5. If listener is not null, then remove an event listener with eventTarget and listener.
  if (listener) {
    removeEventListener(eventTarget, listener)
  }

  // 6. Set eventHandler's listener to null.
  eventHandler.listener = null
}

// To remove all event listeners, given an EventTarget object eventTarget, for each listener of
// eventTarget’s event listener list, remove an event listener with eventTarget and listener.
// See: https://dom.spec.whatwg.org/#remove-all-event-listeners
const removeAllEventListeners = (eventTarget: EventTarget): void => {
  const listeners = Array.from(getEventListenerList(eventTarget))
  listeners.forEach((listener) => {
    removeEventListener(eventTarget, listener)
  })
}

// To erase all event listeners and handlers given an EventTarget object eventTarget, run these
// steps:
// See: https://html.spec.whatwg.org/#erase-all-event-listeners-and-handlers
const eraseAllEventListenersAndHandlers = (eventTarget: EventTarget): void => {
  // 1. If eventTarget has an associated event handler map, then for each name → eventHandler of
  // eventTarget's associated event handler map, deactivate an event handler given eventTarget and
  // name.
  const handlerMap = getEventHandlerMap(eventTarget)
  if (handlerMap) {
    for (const [name] of handlerMap) {
      deactivateEventHandler(eventTarget, name)
    }
  }

  // 2. Remove all event listeners given eventTarget.
  removeAllEventListeners(eventTarget)
}

// The default passive value, given an event type type and an EventTarget eventTarget, is determined
// as follows:
// See: https://dom.spec.whatwg.org/#default-passive-value
const defaultPassiveValue = (type: string, eventTarget: EventTarget): boolean => {
  // 1. Return true if all of the following are true:
  if (
    // * type is one of "touchstart", "touchmove", "wheel", or "mousewheel". [TOUCH-EVENTS]
    // [UIEVENTS]
    (type === 'touchstart' || type === 'touchmove' || type === 'wheel' || type === 'mousewheel') &&
    (
      // * eventTarget is a Window object, or
      eventTarget.constructor.name === 'Window' ||
      // is a node whose node document is eventTarget, or
      (nodeDocument(eventTarget as Node) === eventTarget) ||
      // is a node whose node document’s document element is eventTarget, or
      (nodeDocument(eventTarget as Node)?.documentElement === eventTarget) ||
      // is a node whose node document’s body element is eventTarget. [HTML]
      (nodeDocument(eventTarget as Node)?.body === eventTarget)
    )
  ) {
    return true
  }

  // 2. Return false.
  return false
}

// To add an event listener, given an EventTarget object eventTarget and an event listener listener,
// run these steps:
const addEventListener = (eventTarget: EventTarget, listener: EventListenerConcept): void => {
  // 1. If eventTarget is a ServiceWorkerGlobalScope object, its service worker’s script resource’s
  // has ever been evaluated flag is set, and listener’s type matches the type attribute value of
  // any of the service worker events, then report a warning to the console that this might not give
  // the expected results. [SERVICE-WORKERS]
  if (eventTarget.constructor.name === 'ServiceWorkerGlobalScope') {
    console.warn('This might not give the expected results')  // eslint-disable-line no-console
  }

  // 2. If listener’s signal is not null and is aborted, then return.
  if (listener.signal !== null && listener.signal.aborted) {
    return
  }

  // 3. If listener’s callback is null, then return.
  if (listener.callback === null) {
    return
  }

  // 4. If listener’s passive is null, then set it to the default passive value given listener’s
  // type and eventTarget.
  if (listener.passive === null) {
    listener.passive = defaultPassiveValue(listener.type, eventTarget)
  }

  // 5. If eventTarget’s event listener list does not contain an event listener whose type is
  // listener’s type, callback is listener’s callback, and capture is listener’s capture, then
  // append listener to eventTarget’s event listener list.
  const evListenerList = getEventListenerList(eventTarget)
  if (!Array.from(evListenerList).some(existingListener => (
    existingListener.type === listener.type &&
      existingListener.callback === listener.callback &&
      existingListener.capture === listener.capture
  ))) {
    EventTarget.prototype.addEventListener.call(eventTarget, listener.type, listener.callback, {
      once: listener.once,
      passive: listener.passive,
      capture: listener.capture,
      ...(listener.signal && {signal: listener.signal}),
    } as any)
    evListenerList.add(listener)
  }

  // 6. If listener’s signal is not null, then add the following abort steps to it:
  if (listener.signal !== null) {
    // 1. Remove an event listener with eventTarget and listener.
    listener.signal.addEventListener('abort', () => {
      removeEventListener(eventTarget, listener)
    })
  }
}

// The abstract operation Call takes arguments F (an ECMAScript language value) and V (an ECMAScript
// language value) and optional argument argumentsList (a List of ECMAScript language values) and
// returns either a normal completion containing an ECMAScript language value or a throw completion.
// It is used to call the [[Call]] internal method of a function object. F is the function object, V
// is an ECMAScript language value that is the this value of the [[Call]], and argumentsList is the
// value passed to the corresponding argument of the internal method. If argumentsList is not
// present, a new empty List is used as its value. It performs the following steps when called:
// https://tc39.es/ecma262/multipage/abstract-operations.html#sec-call
const CompletionCall = (F: Function, V: any, args?: any[]): CompletionRecord => {
  // 1. If argumentsList is not present, set argumentsList to a new empty List.
  if (!args) {
    args = []  // eslint-disable-line no-param-reassign
  }
  // 2. If IsCallable(F) is false, throw a TypeError exception.
  if (typeof F !== 'function') {
    throw new TypeError('F is not callable')
  }
  // 3. Return ? F.[[Call]](V, argumentsList).
  try {
    const result = F.apply(V, args)
    return {
      type: 'normal',
      value: result,
      target: null,
    }
  } catch (e) {
    return {
      type: 'throw',
      value: e,
      target: null,
    }
  }
}

// To invoke a callback function type value callable with a Web IDL arguments list args, exception
// behavior exceptionBehavior (either "report" or "rethrow"), and an optional callback this value
// thisArg, perform the following steps. These steps will either return an IDL value or throw an
// exception.
//
// The exceptionBehavior argument must be supplied if, and only if, callable’s return type is not a
// promise type. If callable’s return type is neither undefined nor any, it must be "rethrow".
//
// See: https://webidl.spec.whatwg.org/#invoke-a-callback-function
const invokeCallback = (
  callable: Function,
  args: any[],
  exceptionBehavior: 'report' | 'rethrow',
  thisArg?: any
): any => {
  // 1. Let completion be an uninitialized variable.
  let completion: any

  // 2. If thisArg was not given, let thisArg be undefined.
  // [IMPLIED BY JS]

  // 3. Let F be the JavaScript object corresponding to callable.
  const F = callable

  // 4. If IsCallable(F) is false:
  if (typeof F !== 'function') {
    // 1. Note: This is only possible when the callback function came from an attribute marked with
    // [LegacyTreatNonObjectAsNull].

    // 2. Return the result of converting undefined to the callback function’s return type.
    return undefined as any
  }

  // 5. Let realm be F’s associated realm.
  // 6. Let relevant settings be realm’s settings object.
  // 7. Let stored settings be callable’s callback context.
  // 8. Prepare to run script with relevant settings.
  // 9. Prepare to run a callback with stored settings.
  // [NOT RELEVANT]

  // 10. Let jsArgs be the result of converting args to a JavaScript arguments list. If this throws
  // an exception, set completion to the completion value representing the thrown exception and jump
  // to the step labeled return.
  const jsArgs = args

  // 11. Let callResult be Completion(Call(F, thisArg, jsArgs)).
  const callResult = CompletionCall(F, thisArg, jsArgs)

  // 12. If callResult is an abrupt completion, set completion to callResult and jump to the step
  // labeled return.
  if (callResult.type !== 'normal') {
    completion = callResult
  } else {
    // 13. Set completion to the result of converting callResult.[[Value]] to an IDL value of the
    // same type as callable’s return type. If this throws an exception, set completion to the
    // completion value representing the thrown exception.
    completion = callResult.value
  }

  // 14. Return: at this point completion will be set to an IDL value or an abrupt completion.
  {  // eslint-disable-line no-lone-blocks
    // 1. Clean up after running a callback with stored settings.
    // 2. Clean up after running script with relevant settings.
    // 3. If completion is an IDL value, return completion.
    if (callResult.type === 'normal') {
      return completion
    }

    // 4. Assert: completion is an abrupt completion.
    // [NOT IMPLEMENTED]

    // 5. If exceptionBehavior is "rethrow", throw completion.[[Value]].
    if (exceptionBehavior === 'rethrow') {
      throw completion.value
    } else {  // 6. Otherwise, if exceptionBehavior is "report":
      // 1. Assert: callable’s return type is undefined or any.
      // [NOT IMPLEMENTED]

      // 2. Report an exception completion.[[Value]] for realm’s global object.
      reportException(completion.value, globalThis as any)

      // 3. Return the unique undefined IDL value.
      return undefined
    }

    // 7. Assert: callable’s return type is a promise type.
    // [NOT IMPLEMENTED]

    // 8. Let rejectedPromise be ! Call(%Promise.reject%, %Promise%, «completion.[[Value]]»).
    // [NOT IMPLEMENTED]
    // 9. Return the result of converting rejectedPromise to the callback function’s return type.
    // [NOT IMPLEMENTED]
  }
}

// The event handler processing algorithm for an EventTarget object eventTarget, a string name
// representing the name of an event handler, and an Event object event is as follows:
// See: https://html.spec.whatwg.org/#the-event-handler-processing-algorithm
const runEventHandlerProcessingAlgorithm = (
  eventTarget: EventTarget, name: string, event: Event
): void => {
  // 1. Let callback be the result of getting the current value of the event handler given
  // eventTarget and name.
  const callback = getCurrentValueOfEventHandler(eventTarget, name)

  // 2. If callback is null, then return.
  if (callback === null) {
    return
  }

  // 3. Let special error event handling be true if event is an ErrorEvent object, event's type is
  // "error", and event's currentTarget implements the WindowOrWorkerGlobalScope mixin. Otherwise,
  // let special error event handling be false.
  const specialErrorEventHandling = (event instanceof ErrorEvent) &&
    event.type === 'error' &&
    (event.currentTarget?.constructor.name === 'Window' ||
     event.currentTarget?.constructor.name === 'DedicatedWorkerGlobalScope' ||
     event.currentTarget?.constructor.name === 'SharedWorkerGlobalScope')

  // 4. Process the Event object event as follows:
  // Note: If an exception gets thrown by the callback, it will be rethrown, ending these steps. The
  // exception will propagate to the DOM event dispatch logic, which will then report it.
  let returnValue
  if (specialErrorEventHandling) {  // -> If special error event handling is true
    // Let return value be the result of invoking callback with « event's message, event's
    // filename, event's lineno, event's colno, event's error », "rethrow", and with callback this
    // value set to event's currentTarget.
    returnValue = invokeCallback(
      callback,
      [event.message, event.filename, event.lineno, event.colno, event.error],
      'rethrow',
      event.currentTarget
    )
  } else {  // -> Otherwise
    // Let return value be the result of invoking callback with « event », "rethrow", and with
    // callback this value set to event's currentTarget.
    returnValue = invokeCallback(callback, [event], 'rethrow', event.currentTarget)
  }

  // 5. Process return value as follows:
  // -> If event is a BeforeUnloadEvent object and event's type is "beforeunload"
  if (event instanceof BeforeUnloadEvent && event.type === 'beforeunload') {
    // Note: In this case, the event handler IDL attribute's type will be
    // OnBeforeUnloadEventHandler, so return value will have been coerced into either null or a
    // DOMString.
    // If return value is not null, then:
    if (returnValue !== null) {
      // 1. Set event's canceled flag.
      (event as any).canceled = true

      // 2. If event's returnValue attribute's value is the empty string, then set event's
      // returnValue attribute's value to return value.
      if ((event.returnValue as unknown as string) === '') {
        (event.returnValue as unknown as string) = returnValue
      }
    }
  } else if (specialErrorEventHandling) {
    // -> If special error event handling is true
    // If return value is true, then set event's canceled flag.
    if (returnValue === true) {
      (event as any).canceled = true
    }
  } else if (returnValue === false) {
    // -> Otherwise
    // If return value is false, then set event's canceled flag.
    (event as any).canceled = true
    // Note: If we've gotten to this "Otherwise" clause because event's type is "beforeunload" but
    // event is not a BeforeUnloadEvent object, then return value will never be false, since in
    // such cases return value will have been coerced into either null or a DOMString.
  }
}

// To activate an event handler given an EventTarget object eventTarget and a string name that is
// the name of an event handler, run these steps:
// See: https://html.spec.whatwg.org/#activate-an-event-handler
const activateEventHandler = (eventTarget: EventTarget, name: string): void => {
  // 1. Let handlerMap be eventTarget's event handler map.
  const handlerMap = getEventHandlerMap(eventTarget)

  // 2. Let eventHandler be handlerMap[name].
  const eventHandler = getHandler(handlerMap, name)

  // 3. If eventHandler's listener is not null, then return.
  if (eventHandler.listener !== null) {
    return
  }

  // 4. Let callback be the result of creating a Web IDL EventListener instance representing a
  // reference to a function of one argument that executes the steps of the event handler processing
  // algorithm, given eventTarget, name, and its argument.
  // The EventListener's callback context can be arbitrary; it does not impact the steps of the
  // event handler processing algorithm. [DOM]
  // Note: The callback is emphatically not the event handler itself. Every event handler ends up
  // registering the same callback, the algorithm defined below, which takes care of invoking the
  // right code, and processing the code's return value.
  const callback: EventListener = {
    handleEvent: (event: Event) => {
      runEventHandlerProcessingAlgorithm(eventTarget, name, event)
    },
  }

  // 5. Let listener be a new event listener whose type is the event handler event type
  // corresponding to eventHandler and callback is callback.
  // Note: To be clear, an event listener is different from an EventListener.
  const listener: EventListenerConcept = createEventListenerConcept()
  listener.type = name.slice(2)  // Remove the 'on' prefix
  listener.callback = callback

  // 6. Add an event listener with eventTarget and listener.
  addEventListener(eventTarget, listener)

  // 7. Set eventHandler's listener to listener.
  eventHandler.listener = listener
}

// An event handler IDL attribute is an IDL attribute for a specific event handler. The name of the
// IDL attribute is the same as the name of the event handler.
// https://html.spec.whatwg.org/#event-handler-idl-attributes
const createEventHandlerIdlAttribute = (name: string) => ({
  // The getter of an event handler IDL attribute with name name, when called, must run these
  // steps:
  get(): EventHandler | null {
    // 1. Let eventTarget be the result of determining the target of an event handler given this
    // object and name.
    const eventTarget = determineEventHandlerTarget(this, name)

    // 2. If eventTarget is null, then return null.
    if (!eventTarget) {
      return null
    }

    // 3. Return the result of getting the current value of the event handler given eventTarget
    // and name.
    return getCurrentValueOfEventHandler(eventTarget, name)
  },
  set(value: EventHandler | null): void {
    // 1. Let eventTarget be the result of determining the target of an event handler given this
    // object and name.
    const eventTarget = determineEventHandlerTarget(this, name)

    // 2. If eventTarget is null, then return.
    if (!eventTarget) {
      return
    }

    // 3. If the given value is null, then deactivate an event handler given eventTarget and name.
    if (value === null) {
      deactivateEventHandler(eventTarget, name)
    } else {  // Otherwise:
      // 1. Let handlerMap be eventTarget's event handler map.
      const handlerMap = getEventHandlerMap(eventTarget)

      // 2. Let eventHandler be handlerMap[name].
      const eventHandler = getHandler(handlerMap, name)

      // 3. Set eventHandler's value to the given value.
      eventHandler.value = value

      // 4. Activate an event handler given eventTarget and name.
      activateEventHandler(eventTarget, name)
    }
  },
})

// An event handler content attribute is a content attribute for a specific event handler. The name
// of the content attribute is the same as the name of the event handler.
// Event handler content attributes, when specified, must contain valid JavaScript code which, when
// parsed, would match the FunctionBody production after automatic semicolon insertion.
// See: https://html.spec.whatwg.org/#event-handler-content-attributes
const addEventHandlerContentAttributeChangeSteps = (
  el: Element, eventHandlerNames: ReadonlyArray<string>
): void => {
  // The following attribute change steps are used to synchronize between event handler content
  // attributes and event handlers: [DOM]
  addAttributeChangeSteps(el, (
    element: Element,
    localName: string,
    _oldValue: string | null,
    value: string | null,
    namespace: string | null
  ) => {
    // 1. If namespace is not null, or localName is not the name of an event handler content
    // attribute on element, then return.
    if (namespace !== null || !eventHandlerNames.includes(localName)) {
      return
    }

    // 2. Let eventTarget be the result of determining the target of an event handler given element
    // and localName.
    const eventTarget = determineEventHandlerTarget(element, localName)

    // 3. If eventTarget is null, then return.
    if (!eventTarget) {
      return
    }

    // 4. If value is null, then deactivate an event handler given eventTarget and localName.
    if (value === null) {
      deactivateEventHandler(eventTarget, localName)
    } else {  // 5. Otherwise:
      // 1. If the Should element's inline behavior be blocked by Content Security Policy? algorithm
      // returns "Blocked" when executed upon element, "script attribute", and value, then return.
      // [CSP]
      // [NOT IMPLEMENTED]

      // 2. Let handlerMap be eventTarget's event handler map.
      const handlerMap = getEventHandlerMap(eventTarget)

      // 3. Let eventHandler be handlerMap[localName].
      const eventHandler = getHandler(handlerMap, localName)

      // 4. Let location be the script location that triggered the execution of these steps.
      const location = {
        filename: localName,  // For now, use the handler name.
        columnOffset: 0,
        lineOffset: 0,
      }

      // 5. Set eventHandler's value to the internal raw uncompiled handler value/location.
      eventHandler.value = new InternalRawEventHandler(value, location)

      // 6.Activate an event handler given eventTarget and localName.
      activateEventHandler(eventTarget, localName)
    }
  })
}

export {
  createEventHandlerIdlAttribute,
  addEventHandlerContentAttributeChangeSteps,
  initializeEventHandlerMap,
  eraseAllEventListenersAndHandlers,
  EventHandler,
  EventListener,
  EventListenerOptions,
  AddEventListenerOptions,
  addEventListener,
  removeEventListener,
  getEventListenerList,
  eventTargetSym,
}
