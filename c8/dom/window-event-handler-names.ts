// @sublibrary(:dom-core-lib)
const windowEventHandlerNames = [
  'onafterprint',
  'onbeforeprint',
  'onbeforeunload',
  'onhashchange',
  'onlanguagechange',
  'onmessage',
  'onmessageerror',
  'onoffline',
  'ononline',
  // [NOT IMPLEMENTED] 'onpageswap',
  'onpagehide',
  // [NOT IMPLEMENTED] 'onpagereveal',
  'onpageshow',
  'onpopstate',
  'onrejectionhandled',
  'onstorage',
  'onunhandledrejection',
  'onunload',
] as const

// See: https://html.spec.whatwg.org/#window-reflecting-body-element-event-handler-set
const windowReflectingBodyElementEventHandlerNames = [
  'onblur',
  'onerror',
  'onfocus',
  'onload',
  'onresize',
  'onscroll',
] as const

export {
  windowEventHandlerNames,
  windowReflectingBodyElementEventHandlerNames,
}
