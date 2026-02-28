// @sublibrary(:dom-core-lib)
import * as htmlparser2 from 'htmlparser2'

import {Node} from './node'
import type {Element} from './element'
import type {Text} from './text'
import type {Comment} from './comment'
import type {Document} from './document'
import type {DocumentType} from './document-type'
import {nodeDocument} from './node-internal'

const LITERAL_TEXT_ELEMENTS = [
  'style', 'script', 'xmp', 'iframe', 'noembed', 'noframes', 'noscript', 'plaintext']
const VOID_ELEMENTS = [
  'area', 'base', 'basefont', 'bgsound', 'br', 'col', 'embed', 'frame', 'hr',
  'img', 'input', 'keygen', 'link', 'meta', 'param', 'source', 'spacer', 'track', 'wbr']

const serializeNode = (node: Node): string => {
  let result = ''
  switch (node.nodeType) {
    case Node.ELEMENT_NODE:
      result += `<${(node as Element).nodeName}`
      for (const attr of (node as Element).attributes) {
        result += ` ${attr.name}="${attr.value
          .replace(/&/g, '&amp;')
          .replace(/\u00A0/g, '&nbsp;')
          .replace(/"/g, '&quot;')}"`
      }
      result += '>'
      if (!VOID_ELEMENTS.includes((node as Element).localName)) {
        node.childNodes.forEach((childNode: Node) => {
          result += serializeNode(childNode)
        })
        result += `</${(node as Element).nodeName}>`
      }
      break
    case Node.TEXT_NODE:
      if (node.parentNode?.nodeType === Node.ELEMENT_NODE &&
            LITERAL_TEXT_ELEMENTS.includes(node.parentNode.nodeName)) {
        result += (node as Text).data
      } else {
        result += (node as Text).data
          .replace(/&/g, '&amp;')
          .replace(/\u00A0/g, '&nbsp;')
          .replace(/</g, '&lt;').replace(/>/g, '&gt;')
      }
      break
    case Node.COMMENT_NODE:
      result += `<!--${(node as Comment).data}-->`
      break
    case Node.PROCESSING_INSTRUCTION_NODE:
      // ProcessingInstruction not yet implemented.
      result += `<?${(node as any).target} ${(node as any).data}?>`
      break
    case Node.DOCUMENT_TYPE_NODE:
      result += `<!DOCTYPE ${(node as DocumentType).name}>`
      break
    default:
      break
  }
  return result
}

const insertHtmlBefore = (input: string, el: Element, refChild: Node | null) => {
  const doc: Document = nodeDocument(el)
  let node: Node = el

  const parser = new htmlparser2.Parser({
    onopentagname: (name) => {
      const next = doc.createElement(name)
      const ref = node === el ? refChild : null
      node.insertBefore(next, ref)
      node = next
    },
    onattribute: (name, value) => {
      (node as Element).setAttribute(name, value)
    },
    oncomment: (value) => {
      const next = doc.createComment(value)
      const ref = node === el ? refChild : null
      node.insertBefore(next, ref)
    },
    ontext: (value) => {
      const next = doc.createTextNode(value)
      const ref = node === el ? refChild : null
      node.insertBefore(next, ref)
    },
    onclosetag: (name) => {  // eslint-disable-line @typescript-eslint/no-unused-vars
      node = node.parentNode!
    },
    onerror: (error) => {
      throw error
    },
  })

  parser.parseComplete(input)
}

export {serializeNode, insertHtmlBefore}
