// @sublibrary(:dom-core-lib)
// Each Document has a render-blocking element set, a set of elements, initially the empty set.
// See: https://html.spec.whatwg.org/multipage/dom.html#render-blocking-element-set
const renderBlockingElementsSym = Symbol('renderBlockingElements')

// Then, the relevant settings object for a platform object o is the environment settings object
// of the relevant realm for o.
// See: https://html.spec.whatwg.org/multipage/webappapis.html#relevant-settings-object
const environmentSettingsSym = Symbol('environmentSettings')

// Document objects have an ignore-destructive-writes counter, which is used in conjunction with
// the processing of script elements to prevent external scripts from being able to use
// document.write() to blow away the document by implicitly calling document.open(). Initially,
// the counter must be set to zero.
// See: /multipage/dynamic-markup-insertion.html#ignore-destructive-writes-counter
const ignoreDestructiveWritesCounterSym = Symbol('ignoreDestructiveWritesCounter')

// Each Document has an about base URL, which is a URL or null, initially null.  This is only
// populated for "about:"-schemed Documents.
// https://html.spec.whatwg.org/multipage/dom.html#concept-document-about-base-url
const aboutBaseUrlSym = Symbol('aboutBaseUrl')

// Each Document has a pending parsing-blocking script, which is a script element or null,
// initially null.
// https://html.spec.whatwg.org/multipage/scripting.html#pending-parsing-blocking-script
const pendingParsingBlockingScriptSym = Symbol('pendingParsingBlockingScript')

// Each Document has a set of scripts that will execute as soon as possible, which is a set of
// script elements, initially empty.
const scriptsToExecuteAsapSym = Symbol('scriptsToExecuteAsap')

// Each Document has a list of scripts that will execute in order as soon as possible, which is a
// list of script elements, initially empty.
const scriptsToExecuteInOrderAsapSym = Symbol('scriptsToExecuteInOrderAsap')

// Each Document has a list of scripts that will execute when the document has finished parsing,
// which is a list of script elements, initially empty.
const scriptsToExecuteAfterParsingSym = Symbol('scriptsToExecuteAfterParsing')

export {
  renderBlockingElementsSym,
  environmentSettingsSym,
  ignoreDestructiveWritesCounterSym,
  aboutBaseUrlSym,
  pendingParsingBlockingScriptSym,
  scriptsToExecuteAsapSym,
  scriptsToExecuteInOrderAsapSym,
  scriptsToExecuteAfterParsingSym,
}
