// @sublibrary(:dom-core-lib)
import {CharacterData} from './character-data'
import type {HTMLSlotElement} from './html-elements'
import type {Document} from './document'
import {Node} from './node'
import {nodeDocumentMap} from './node-internal'

class Text extends CharacterData {
  assignedSlot: HTMLSlotElement | null

  wholeText: string

  constructor(data: string) {
    const global = globalThis as any
    const doc = global.document || null
    super(doc, '#text', Node.TEXT_NODE, data)

    Object.defineProperty(this, 'assignedSlot', {
      enumerable: true,
      configurable: false,
      get() {
        throw new Error('Not implemented')
      },
    })

    Object.defineProperty(this, 'wholeText', {
      enumerable: true,
      configurable: false,
      get() {
        if (!this.parentNode) {
          return this.data
        }
        // Find the first logically-adjacent text node in document order.
        // Logically-adjacent text nodes are Text or CDATASection nodes that can
        // be visited sequentially in document order or in reversed document
        // order without entering, exiting, or passing over Element, Comment, or
        // ProcessingInstruction nodes.
        let node: Node = this
        const stopNodes = [Node.ELEMENT_NODE, Node.COMMENT_NODE, Node.PROCESSING_INSTRUCTION_NODE]
        while (node.previousSibling &&
               !stopNodes.includes(node.previousSibling.nodeType)) {
          node = node.previousSibling
        }
        let result = node.nodeType === Node.TEXT_NODE ? (node as Text).data : ''
        // Now iterate until the last logically-adjacent node, appending Text as we go.
        while (node.nextSibling && !stopNodes.includes(node.nextSibling.nodeType)) {
          node = node.nextSibling
          if (node.nodeType === Node.TEXT_NODE) {
            result += (node as Text).data
          }
        }
        return result
      },
    })
  }

  splitText(offset: number): Text {
    const {length} = this.data
    if (offset < 0 || offset > length) {
      throw new Error(
        `Failed to execute 'splitText' on 'Text': The offset ${offset} is ` +
      'larger than the Text node\'s length.'
      )
    }
    const text = new Text(this.data.slice(offset, length))
    this.data = this.data.slice(0, offset)
    if (this.parentNode) {
      this.parentNode.insertBefore(text, this.nextSibling)
    }
    return text
  }
}

const createText = (ownerDocument: Document, data: string) => {
  const txt = new Text(data)
  nodeDocumentMap.set(txt, ownerDocument)
  return txt
}

export {Text, createText}
