// @attr(target = "node")
// @attr(esnext = 1)
// @package(npm-rendering)

// @dep(//bzl/js:vm-modules)
// @dep(//bzl/js:fetch)

/* eslint-disable no-await-in-loop */

import type {fetch} from 'undici-types'

import * as htmlparser2 from 'htmlparser2'

import type {
  Document,
  USVString,
  Node,
  Element,
  Window,
  HTMLBodyElement,
  HTMLScriptElement,
} from '@nia/c8/dom/dom-core'

const global = globalThis as any

const appendChildIfValid = (parent: Node, node: Node) => {
  try {
    parent.appendChild(node)
  } catch (e) {
    if (e.name === 'HierarchyRequestError') {
      // Silently ignore HierarchyRequestError when parsing.
    } else {
      // Log other errors.
      console.error(e)  // eslint-disable-line no-console
    }
  }
}

const fetchHtmlDocument = async (
  url: USVString,
  window: Window,
  fetchFunc: typeof fetch
): Promise<Document> => {
  const doc = window.document
  Object.defineProperty(doc, 'URL', {value: new URL(url)})

  const settings = doc[window.__nia.environmentSettingsSym]
  settings.topLevelCreationUrl = new URL(url)
  settings.creationUrl = new URL(url)
  settings.apiBaseUrl = new URL(url)

  const fetchResult = await fetchFunc(url, {headers: {cookie: doc.cookie}})
  const html = await fetchResult.text()

  doc.documentElement = null
  Object.defineProperty(doc, 'head', {value: null})
  doc.body = null

  while (doc.firstChild) {
    doc.removeChild(doc.firstChild)
  }

  const docType = doc.implementation.createDocumentType('html', '', '')
  doc.title = ''

  appendChildIfValid(doc, docType)

  let node: Node = doc

  let resolveParse: () => void
  let rejectParse: (reason?: any) => void

  const parseCompletion = new Promise<void>((resolve, reject) => {
    resolveParse = resolve
    rejectParse = reject
  })

  let foundFirstElement = false
  let foundFirstTitle = false
  let foundFirstHead = false
  let foundFirstBody = false
  let foundFirstComment = false

  const parser = new htmlparser2.Parser({
    onopentagname: (name) => {
      if (!foundFirstElement) {
        foundFirstElement = true
        if (name !== 'html') {
          // creates an html element under the hood
          const htmlElement = doc.createElement('html')
          appendChildIfValid(doc, htmlElement)
          node = htmlElement
        }
      }

      const next = doc.createElement(name)
      if (name === 'head' && !foundFirstHead) {
        foundFirstHead = true
        Object.defineProperty(doc, 'head', {value: next})
      } else if (name === 'body' && !foundFirstBody) {
        foundFirstBody = true
        doc.body = next as HTMLBodyElement
      } else if (name === 'script') {
        // See: https://html.spec.whatwg.org/multipage/parsing.html
        // 3. Set the element's parser document to the Document, and set the element's force async
        // to false.
        const script = next as HTMLScriptElement
        script[window.__nia.parserDocumentSym] = doc
        script[window.__nia.forceAsyncSym] = false
      }
      appendChildIfValid(node, next)

      node = next
    },
    onattribute: (name, value) => {
      const cleanedName = name.replace(',', '').trim()
      if (cleanedName.length > 0) {
        (node as Element).setAttribute(cleanedName, value)
      }
    },
    oncomment: (value) => {
      // Extract commitId from the first comment in head
      if (node.nodeName.toLowerCase() === 'head' && !foundFirstComment) {
        foundFirstComment = true
        const match = value.trim().match(/^(\S+)\s/)
        if (match && match[1]) {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const [_, commitId] = match
          global.commitId = commitId
        }
      }

      const next = doc.createComment(value)
      appendChildIfValid(node, next)
    },
    ontext: (value) => {
      const next = doc.createTextNode(value)
      appendChildIfValid(node, next)
    },
    onclosetag: async (name) => {
      // NOTE(christoph): We make sure to update the parent "node" first here because later when we
      // call pause/resume asynchronously, we need to node to be correct when it starts again.
      const currentNode = node
      node = node.parentNode!
      if (name === 'title') {
        if (!foundFirstTitle) {
          foundFirstTitle = true
          doc.title = currentNode.textContent || ''
        }
      } else if (name === 'script') {
        // Follow some of the steps from the parsing spec.
        // See: https://html.spec.whatwg.org/multipage/parsing.html
        const script = currentNode as HTMLScriptElement
        window.__nia.prepareScript(script)

        // At this stage, if the pending parsing-blocking script is not null, then:
        if (doc[window.__nia.pendingParsingBlockingScriptSym] !== null) {
          parser.pause()
          // 1. Let the script be the pending parsing-blocking script.
          const theScript = doc[window.__nia.pendingParsingBlockingScriptSym]!

          // 2. Set the pending parsing-blocking script to null.
          doc[window.__nia.pendingParsingBlockingScriptSym] = null

          // 5. If the parser's Document has a style sheet that is blocking scripts or the script's
          // ready to be parser-executed is false: spin the event loop until the parser's Document
          // has no style sheet that is blocking scripts and the script's ready to be
          // parser-executed becomes true.
          // [NOT IMPLEMENTED] style sheets that are blocking scripts.
          while (
            /* doc[styleSheetBlockingScriptsSym] || */
            theScript[window.__nia.readyToBeParserExecutedSym] === false
          ) {
            await new Promise(resolve => setTimeout(resolve))
          }

          // 11. Execute the script element the script.
          try {
            window.__nia.executeScript(theScript)
          } finally {
            parser.resume()
          }
        }
      }
    },
    onerror: (error) => {
      rejectParse(error)
      throw error
    },
    onend: () => {
      // Resolve parse complete.
      resolveParse()
    },
  })

  parser.write(html)
  parser.end()

  // Await parse complete.
  await parseCompletion

  // Once the user agent stops parsing the document, the user agent must run the following steps:
  // See: https://html.spec.whatwg.org/multipage/parsing.html#the-end

  // 3. Update the current document readiness to "interactive".
  Object.defineProperty(doc, 'readyState', {value: 'interactive'})

  // 5. While the list of scripts that will execute when the document has finished parsing is not
  // empty:
  const scriptsToExecuteAfterParsing =
    doc[window.__nia.scriptsToExecuteAfterParsingSym]
  while (scriptsToExecuteAfterParsing.length > 0) {
    // 1. Spin the event loop until the first script in the list of scripts that will execute when
    // the document has finished parsing has its ready to be parser-executed set to true and the
    // parser's Document has no style sheet that is blocking scripts.
    while (
      scriptsToExecuteAfterParsing[0][window.__nia.readyToBeParserExecutedSym] !== true) {
      await new Promise(resolve => setTimeout(resolve))
    }

    // 2. Execute the script element given by the first script in the list of scripts that will
    // execute when the document has finished parsing.
    window.__nia.executeScript(scriptsToExecuteAfterParsing[0])

    // 3. Remove the first script element from the list of scripts that will execute when the
    // document has finished parsing (i.e. shift out the first entry in the list).
    scriptsToExecuteAfterParsing.shift()
  }
  // 6. Queue a global task on the DOM manipulation task source given the Document's relevant global
  // object to run the following substeps:
  setTimeout(() => {
    // 2. Fire an event named DOMContentLoaded at the Document object, with its bubbles attribute
    // initialized to true.
    doc.dispatchEvent(new Event('DOMContentLoaded', {bubbles: true}))
  })

  const scriptsToExecuteAsap =
    doc[window.__nia.scriptsToExecuteAsapSym]
  const scriptsToExecuteInOrderAsap =
    doc[window.__nia.scriptsToExecuteInOrderAsapSym]

  // 7. Spin the event loop until the set of scripts that will execute as soon as possible and the
  // list of scripts that will execute in order as soon as possible are empty.
  while (scriptsToExecuteAsap.size > 0 || scriptsToExecuteInOrderAsap.length > 0) {
    await new Promise(resolve => setTimeout(resolve))
  }

  // 8. Spin the event loop until there is nothing that delays the load event in the Document.
  const scriptIsDelayingLoad = () => {
    const scriptEls = Array.from(doc.getElementsByTagName('script')) as HTMLScriptElement[]
    return scriptEls.some(script => script[window.__nia.delayingTheLoadEventSym])
  }
  while (scriptIsDelayingLoad()) {
    await new Promise(resolve => setTimeout(resolve))
  }

  // 9. Queue a global task on the DOM manipulation task source given the Document's relevant global
  // object to run the following steps:
  setTimeout(() => {
    // 1. Update the current document readiness to "complete".
    Object.defineProperty(doc, 'readyState', {value: 'complete'})
    // 5. Fire an event named load at window, with legacy target override flag set.
    window.dispatchEvent(new Event('load'))
  })

  return doc
}

export {fetchHtmlDocument}
