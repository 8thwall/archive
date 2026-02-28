// @sublibrary(:dom-core-lib)
import type {HTMLScriptElement} from './html-script-element'
import type {Document} from './document'
import {
  parserDocumentSym,
  preparationDocumentSym,
  forceAsyncSym,
  fromExternalFileSym,
  readyToBeParserExecutedSym,
  alreadyStartedSym,
  delayingTheLoadEventSym,
  typeSym,
  resultSym,
  stepsToRunWhenReadySym,
} from './html-script-element-symbols'
import type {
  Script,
  ModuleScript,
} from './script'
import {AbortRunSteps} from './error'
import type {ImportMapParseResult} from './import-map'
import type {EnvironmentSettings} from './environment'
import {
  importMapSym,
  importMapsAllowedSym,
} from './window-symbols'
import {jsMimeTypeEssenceMatchRegex} from './mime-type'
import type {Encoding} from './encoding'
import {
  CorsSettingAttributeState,
  getCorsSettingAttributeState,
} from './cors'
import type {ScriptFetchOptions} from './script'
import {
  environmentSettingsSym,
  pendingParsingBlockingScriptSym,
  scriptsToExecuteAfterParsingSym,
  scriptsToExecuteAsapSym,
  scriptsToExecuteInOrderAsapSym,
} from './document-symbols'
import {
  elementPotentiallyRenderBlocking,
} from './element-methods'
import {
  blockRendering,
  isRenderBlocking,
  documentBaseUrl,
} from './document-methods'
import {fetchClassicScript} from './fetch-classic-script'
import {
  fetchExternalModuleScriptGraph,
  fetchInlineModuleScriptGraph,
} from './fetch-module-script'
import {executeScript} from './execute-script'
import {createClassicScript} from './create-classic-script'
import {createImportMapParseResult} from './import-map'
import {
  postConnectionStepsMap,
  childrenChangedStepsMap,
  nodeDocument,
  isConnected,
} from './node-internal'

const moduleMatchRegex = /^module$/i
const importmapMatchRegex = /^importmap$/i

// See: https://html.spec.whatwg.org/multipage/scripting.html#mark-as-ready
// A script element has steps to run when the result is ready, which are a
// series of steps or null, initially null. To mark as ready a script element el
// given a script, import map parse result, or null result:
const markAsReady = (el: HTMLScriptElement, result: Script | ImportMapParseResult | null): void => {
  // 1. Set el's result to result.
  el[resultSym] = result

  // 2. If el's steps to run when the result is ready are not null, then run them.
  if (el[stepsToRunWhenReadySym] !== null) {
    try {
      el[stepsToRunWhenReadySym].forEach(step => step())
    } catch (e) {
      // Catch any explicit abort errors and ignore them.
      if (!(e instanceof AbortRunSteps)) {
        throw e
      }
    }
  }

  // 3. Set el's steps to run when the result is ready to null.
  el[stepsToRunWhenReadySym] = null

  // 4. Set el's delaying the load event to false.
  el[delayingTheLoadEventSym] = false
}

// See https://html.spec.whatwg.org/multipage/webappapis.html#resolving-a-module-integrity-metadata
// To resolve a module integrity metadata, given a URL url and an environment
// settings object settingsObject:
const resolveModuleIntegrityMetadata = (url: URL, settingsObject: EnvironmentSettings): string => {
  // Assert: settingsObject's global object is a Window object.
  if (settingsObject.globalObject.constructor.name !== 'Window') {
    throw new Error('settingsObject must have a global object that is a Window object')
  }

  // Let map be settingsObject's global object's import map.
  const map = settingsObject.globalObject[importMapSym]

  // If map's integrity[url] does not exist, then return the empty string.
  // Otherwise, return map's integrity[url].
  return map.integrity[url.href] || ''
}

// See: https://html.spec.whatwg.org/multipage/scripting.html#prepare-the-script-element
const prepareScript = (el: HTMLScriptElement): void => {
  // 1. If el's already started is true, then return.
  if (el[alreadyStartedSym]) {
    return
  }
  // 2. Let parserDocument be el's parser document.
  const parserDocument = el[parserDocumentSym]

  // 3. Set el's parser document to null.  This is done so that if parser-inserted script elements
  // fail to run when the parser tries to run them, e.g. because they are empty or specify an
  // unsupported scripting language, another script can later mutate them and cause them to run
  // again.
  el[parserDocumentSym] = null

  // 4. If parser document is non-null, and el does not have an async attribute, then set el's
  // force async to true.
  if (parserDocument && el.getAttribute('async') === null) {
    // This is done so that if a parser-inserted script element fails to run when the parser tries
    // to run it, but it is later executed after a script dynamically updates it, it will execute
    // in an async fashion even if the async attribute isn't set.
    el[forceAsyncSym] = true
  }

  // 5. Let source text be el's child text content.
  const sourceText = el.textContent

  // 6. If el has no src attribute, and source text is the empty string, then return.
  if (el.getAttribute('src') === null && sourceText === '') {
    return
  }

  // 7. If el is not connected, then return.
  if (!isConnected(el)) {
    return
  }

  let scriptBlockTypeString: string

  // 8. If any of the following are true:
  if (
  // el has a type attribute whose value is the empty string;
    el.getAttribute('type') === '' ||
      // el has no type attribute, but it has a language attribute and that attribute's value is the
      // empty string; or
      (el.getAttribute('type') === null && el.getAttribute('language') === '') ||
      // el has neither a type attribute nor a language attribute,
      (el.getAttribute('type') === null && el.getAttribute('language') === null)
  ) {
    // then let the script block's type string for this script element be "text/javascript".
    scriptBlockTypeString = 'text/javascript'
  } else if (el.getAttribute('type') !== null) {
    // Otherwise, if el has a type attribute, then let the script block's type string be the value
    // of that attribute with leading and trailing ASCII whitespace stripped.
    scriptBlockTypeString = el.getAttribute('type')!.trim()
  } else {
    // Otherwise, el has a non-empty language attribute; let the script block's type string be the
    // concatenation of "text/" and the value of el's language attribute.
    scriptBlockTypeString = `text/${el.getAttribute('language')}`
  }

  if (scriptBlockTypeString.match(jsMimeTypeEssenceMatchRegex)) {
    // 9. If the script block's type string is a JavaScript MIME type essence match, then set el's
    // type to "classic".
    el[typeSym] = 'classic'
  } else if (scriptBlockTypeString.match(moduleMatchRegex)) {
    // 10. Otherwise, if the script block's type string is an ASCII case-insensitive match for the
    // string "module", then set el's type to "module".
    el[typeSym] = 'module'
  } else if (scriptBlockTypeString.match(importmapMatchRegex)) {
    // 11. Otherwise, if the script block's type string is an ASCII case-insensitive match for the
    // string "importmap", then set el's type to "importmap".
    el[typeSym] = 'importmap'
  } else {
    // 12. Otherwise, return. (No script is executed, and el's type is left as null.)
    return
  }

  // 13. If parser document is non-null, then set el's parser document back to parser document and
  // set el's force async to false.
  if (parserDocument) {
    el[parserDocumentSym] = parserDocument
    el[forceAsyncSym] = false
  }

  // 14. Set el's already started to true.
  el[alreadyStartedSym] = true

  if (!el.ownerDocument) {
    throw new Error('Script element must have an owner document')
  }

  // 15. Set el's preparation-time document to its node document.
  el[preparationDocumentSym] = nodeDocument(el)

  // 16. If parser document is non-null, and parser document is not equal to el's preparation-time
  // document, then return.
  if (parserDocument && parserDocument !== el[preparationDocumentSym]) {
    return
  }

  // 17. [NOT IMPLEMENTED] If scripting is disabled for el, then return.

  // 18. If el has a nomodule content attribute and its type is "classic", then return.
  if (el.getAttribute('nomodule') !== null && el[typeSym] === 'classic') {
    // This means specifying nomodule on a module script has no effect; the algorithm continues
    // onward.
    return
  }

  // 19. [NOT IMPLEMENTED] If el does not have a 'src' content attribute, and the Should element's
  // inline behavior be blocked by Content Security Policy?  algorithm returns "Blocked" when
  // given el, "script", and source text, then return. [CSP]

  // 20. If el has an event attribute and a for attribute, and el's type is "classic", then:
  if (el.getAttribute('event') !== null && el.getAttribute('for') !== null &&
        el[typeSym] === 'classic') {
    // Let for be the value of el's for attribute, with leading and trailing ASCII whitespace
    // stripped.
    const forValue = el.getAttribute('for')!.trim()

    // Let event be the value of el's event attribute, with leading and trailing ASCII whitespace
    // stripped.
    const eventValue = el.getAttribute('event')!.trim()

    // If for is not an ASCII case-insensitive match for the string "window", then return.
    if (!forValue.match(/^window$/i)) {
      return
    }

    // If event is not an ASCII case-insensitive match for either the string "onload" or the
    // string "onload()", then return.
    if (!eventValue.match(/^onload(\(\))?$/i)) {
      return
    }
  }

  // 21. [NOT IMPLEMENTED] If el has a charset attribute, then let encoding be the result of
  // 'getting an encoding' from the value of the charset attribute.
  const encoding = 'UTF-8' as Encoding

  // 22. Let classic script CORS setting be the current state of el's crossorigin content
  // attribute.
  const classicScriptCorsSetting: CorsSettingAttributeState =
      getCorsSettingAttributeState(el.crossOrigin)

  // 23. Let module script credentials mode be the CORS settings attribute credentials mode for
  // el's crossorigin content attribute.
  let moduleScriptCredentialsMode: 'omit' | 'same-origin' | 'include'
  switch (classicScriptCorsSetting) {
    case CorsSettingAttributeState.NO_CORS:
      moduleScriptCredentialsMode = 'omit'
      break
    case CorsSettingAttributeState.USE_CREDENTIALS:
      moduleScriptCredentialsMode = 'include'
      break
    case CorsSettingAttributeState.ANONYMOUS:
    default:
      moduleScriptCredentialsMode = 'same-origin'
      break
  }

  // 24. [NOT IMPLEMENTED] Let cryptographic nonce be el's [[CryptographicNonce]] internal slot's
  // value.
  const cryptographicNonce = ''

  // 25. If el has an integrity attribute, then let integrity metadata be that attribute's value.
  // Otherwise, let integrity metadata be the empty string.
  const integrityMetadata = el.integrity

  // 26. Let referrer policy be the current state of el's referrerpolicy content attribute.
  const {referrerPolicy} = el

  // 27. Let fetch priority be the current state of el's fetchpriority content.
  const {fetchPriority} = el

  // 28. Let parser metadata be "parser-inserted" if el is parser-inserted, and
  // "not-parser-inserted" otherwise.
  const parserMetadata = parserDocument ? 'parser-inserted' : 'not-parser-inserted'

  // 29. Let options be a script fetch options whose cryptographic nonce is cryptographic nonce,
  // integrity metadata is integrity metadata, parser metadata is parser metadata, credentials
  // mode is module script credentials mode, referrer policy is referrer policy, and fetch
  // priority is fetch priority.
  const options: ScriptFetchOptions = {
    cryptographicNonce,
    integrityMetadata,
    parserMetadata,
    credentialsMode: moduleScriptCredentialsMode,
    referrerPolicy,
    renderBlocking: false,  // default false.
    fetchPriority,
  }

  // 30. Let settings object be el's node document's relevant settings object.
  const settings = nodeDocument(el)[environmentSettingsSym]

  // 31. If el has a src content attribute, then:
  if (el.getAttribute('src') !== null) {
    // 1. If el's type is "importmap", then queue an element task on the DOM manipulation task
    // source given el to fire an event named error at el, and return.
    if (el[typeSym] === 'importmap') {
      // Note: External import map scripts are not currently supported. See WICG/import-maps issue
      // #235 for discussions on adding support.
      setTimeout(() => { el.dispatchEvent(new Event('error')) })
      return
    }

    // 2. Let src be the value of el's src attribute.
    const {src} = el

    // 3. If src is the empty string, then queue an element task on the DOM manipulation task
    // source given el to fire an event named error at el, and return.
    if (src === '') {
      setTimeout(() => { el.dispatchEvent(new Event('error')) })
      return
    }

    // 4. Set el's from an external file to true.
    el[fromExternalFileSym] = true

    // 5. Let url be the result of encoding-parsing a URL given src, relative to el's node
    // document.
    let url
    try {
      url = new URL(src, nodeDocument(el).URL)
    } catch (e) {
      // 6. If url is failure, then queue an element task on the DOM manipulation task source
      // given el to fire an event named error at el, and return.
      setTimeout(() => { el.dispatchEvent(new Event('error')) })
      return
    }

    // 7. If el is potentially render-blocking, then block rendering on el.
    if (elementPotentiallyRenderBlocking(el)) {
      blockRendering(el)
    }

    // 8. Set el's delaying the load event to true.
    el[delayingTheLoadEventSym] = true

    // 9. If el is currently render-blocking, then set options's render-blocking to true.
    if (isRenderBlocking(el)) {
      options.renderBlocking = true
    }

    // 10. Let onComplete given result be the following steps:
    const onComplete = (result: Script | ImportMapParseResult | null): void => {
      // 1. Mark as ready el given result.
      markAsReady(el, result)
    }

    // 11. Switch on el's type:
    switch (el[typeSym]) {
      case 'classic':
        // Fetch a classic script given url, settings object, options, classic script CORS
        // setting, encoding, and onComplete.
        fetchClassicScript(
          url,
          settings,
          options,
          classicScriptCorsSetting,
          encoding,
          onComplete
        )
        break
      case 'module':
        // If el does not have an integrity attribute, then set options's integrity metadata to
        // the result of resolving a module integrity metadata with url and settings object.
        if (el.integrity === '') {
          options.integrityMetadata = resolveModuleIntegrityMetadata(url, settings)
        }
        // Fetch an external module script graph given url, settings object, options, and
        // onComplete.
        fetchExternalModuleScriptGraph(
          url,
          settings,
          options,
          onComplete
        )
        break
      default:
        break
    }
  } else {  // 32. If el does not have a src content attribute:
    // 1. Let base URL be el's node document's document base URL.
    const baseUrl = documentBaseUrl(nodeDocument(el))

    // 2. Switch on el's type:
    switch (el[typeSym]) {
      case 'classic': {
        // 1. Let script be the result of creating a classic script using source text, settings
        // object, base URL, and options.
        const script = createClassicScript(sourceText, settings, baseUrl, options)

        // 2. Mark as ready el given script.
        markAsReady(el, script)
        break
      }
      case 'module': {
        // 1. Set el's delaying the load event to true.
        el[delayingTheLoadEventSym] = true

        // 2. If el is potentially render-blocking, then:
        if (elementPotentiallyRenderBlocking(el)) {
          // 1. Block rendering on el.
          blockRendering(el)

          // 2. Set options's render-blocking to true.
          options.renderBlocking = true
        }

        // 3. Fetch an inline module script graph, given source text, base URL, settings object,
        // options, and with the following steps given result:
        fetchInlineModuleScriptGraph(
          sourceText,
          baseUrl,
          settings,
          options,
          (result: ModuleScript | null) => {
            // 1. Queue an element task on the networking task source given el to perform the
            // following steps:
            setTimeout(() => {
              // 1. Mark as ready el given result.
              markAsReady(el, result)
            })
          }
        )
        break
      }
      case 'importmap': {
        // 1. If el's relevant global object's import maps allowed is false, then queue an element
        // task on the DOM manipulation task source given el to fire an event named error at el,
        // and return.
        if (settings.globalObject[importMapsAllowedSym] === false) {
          setTimeout(() => { el.dispatchEvent(new Event('error')) })
          return
        }

        // 2. Set el's relevant global object's import maps allowed to false.
        settings.globalObject[importMapsAllowedSym] = false

        // 3. Let result be the result of creating an import map parse result given source text
        // and base URL.
        const result = createImportMapParseResult(sourceText, baseUrl)

        // 4. Mark as ready el given result.
        markAsReady(el, result)
        break
      }
      default:
        break
    }
  }
  // 33. If el's type is "classic" and el has a src attribute, or el's type is "module":
  if ((el[typeSym] === 'classic' && el.getAttribute('src') !== null) || el[typeSym] === 'module') {
    // 1. Assert: el's result is "uninitialized".
    if (el[resultSym] !== 'uninitialized') {
      throw new Error('Script element result is not uninitialized')
    }

    // 2. If el has an async attribute or el's force async is true:
    if (el.getAttribute('async') !== null || el[forceAsyncSym]) {
      // 1. Let scripts be el's preparation-time document's set of scripts that will execute as
      // soon as possible.
      const scripts = el[preparationDocumentSym][scriptsToExecuteAsapSym]

      // 2. Append el to scripts.
      scripts.add(el)

      // 3. Set el's steps to run when the result is ready to the following:
      el[stepsToRunWhenReadySym] = [
        () => {
          // Execute the script element el.
          executeScript(el)
        },
        () => {
          // Remove el from scripts.
          scripts.delete(el)
        },
      ]
    } else if (!parserDocument) {  // 3. Otherwise, if el is not parser-inserted:
      // 1. Let scripts be el's preparation-time document's list of scripts that will execute in
      // order as soon as possible.
      const scripts = el[preparationDocumentSym][scriptsToExecuteInOrderAsapSym]

      // 2. Append el to scripts.
      scripts.push(el)

      // 3. Set el's steps to run when the result is ready to the following:
      el[stepsToRunWhenReadySym] = [
        () => {
          // 1. If scripts[0] is not el, then abort these steps.
          if (scripts[0] !== el) {
            throw new AbortRunSteps()
          }
        },
        () => {
          // 2. While scripts is not empty, and scripts[0]'s result is not "uninitialized":
          while (scripts.length > 0 && scripts[0][resultSym] !== 'uninitialized') {
            // 1. Execute the script element scripts[0].
            executeScript(scripts[0])

            // 2. Remove scripts[0].
            scripts.shift()
          }
        },
      ]
    } else if (el.getAttribute('defer') !== null || el[typeSym] === 'module') {
    // 4. Otherwise, if el has a defer attribute or el's type is "module":
      // 1. Append el to its parser document's list of scripts that will execute when the document
      // has finished parsing.
      parserDocument[scriptsToExecuteAfterParsingSym].push(el)

      // 2. Set el's steps to run when the result is ready to the following: set el's ready to be
      // parser-executed to true. (The parser will handle executing the script.)
      el[stepsToRunWhenReadySym] = [
        () => { el[readyToBeParserExecutedSym] = true },
      ]
    } else {  // 5. Otherwise:
      // 1. Set el's parser document's pending parsing-blocking script to el.
      parserDocument[pendingParsingBlockingScriptSym] = el

      // 2. Block rendering on el.
      blockRendering(el)

      // 3. Set el's steps to run when the result is ready to the following: set el's ready to be
      // parser-executed to true. (The parser will handle executing the script.)
      el[stepsToRunWhenReadySym] = [
        () => { el[readyToBeParserExecutedSym] = true },
      ]
    }
  } else {  // 34. Otherwise
    // Assert: el's result is not "uninitialized".
    if (el[resultSym] === 'uninitialized') {
      throw new Error('Script element result is uninitialized')
    }

    // If all of the following are true:
    if (
      // eslint-disable-next-line no-constant-condition
      el[typeSym] === 'classic' &&  // el's type is "classic"; and
      parserDocument &&  // el is parser-inserted;
      // el's parser document has a style sheet that is blocking scripts; and
      false &&  // [NOT IMPLEMENTED]
      // either the parser that created el is an XML parser, or it's an HTML parser whose script
      // nesting level is not greater than one,
      false  // [NOT IMPLEMENTED]
    ) {  // then:
      // 1. Set el's parser document's pending parsing-blocking script to el.
      parserDocument![pendingParsingBlockingScriptSym] = el
      // 2. Set el's ready to be parser-executed to true. (The parser will handle executing the
      // script.)
      el[readyToBeParserExecutedSym] = true
    } else {
      // Otherwise, immediately execute the script element el, even if other scripts are already
      // executing.
      executeScript(el)
    }
  }
}

// The script HTML element post-connection steps, given insertedNode, are:
postConnectionStepsMap.set('script', (insertedNode: HTMLScriptElement) => {
  // 1. If insertedNode is not connected, then return.
  if (!isConnected(insertedNode)) {
    return
  }
  // 2. If insertedNode is parser-inserted, then return.
  if (insertedNode[parserDocumentSym] !== null) {
    return
  }
  // 3. Prepare the script element given insertedNode.
  prepareScript(insertedNode)
})

// The script children changed steps are:
childrenChangedStepsMap.set('script', (insertedNode: HTMLScriptElement) => {
  // 1. Run the script HTML element post-connection steps, given the script element.
  postConnectionStepsMap.get('script')!(insertedNode)
})

// The following attribute change steps, given element, localName, oldValue, value, and namespace,
// are used for all script elements:
// [NOT IMPLEMENTED]
// 1. If namespace is not null, then return.
// 2. If localName is src, then run the script HTML element post-connection steps, given element.

const setScriptParserDocument = (el: HTMLScriptElement, doc: Document | null) => {
  el[parserDocumentSym] = doc
}

export {prepareScript, setScriptParserDocument}
