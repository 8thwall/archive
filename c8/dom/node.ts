// @sublibrary(:dom-core-lib)
import {createNodeList, type NodeList} from './node-list'
import type {Document} from './document'
import {throwIllegalConstructor} from './exception'
import type {Text} from './text'
import type {Element} from './element'
import {
  appendNode,
  preInsertNode,
  preRemoveNode,
  replaceNode,
  nodeLength,
  removeNode,
  contiguousExclusiveTextNodes,
  replaceData,
  kids,
  kidsMap,
  parentMap,
  getParent,
  nodeDocument,
  nodeDocumentMap,
} from './node-internal'
import type {
  EventHandler,
  EventListener,
  EventListenerOptions,
  AddEventListenerOptions,
} from './events-internal'
import {
  addEventListenerWrapped,
  removeEventListenerWrapped,
} from './events-methods'

class Node extends EventTarget {
  public static readonly ELEMENT_NODE = 1;

  public static readonly ATTRIBUTE_NODE = 2;

  public static readonly TEXT_NODE = 3;

  public static readonly CDATA_SECTION_NODE = 4;

  public static readonly ENTITY_REFERENCE_NODE = 5;  // legacy

  public static readonly ENTITY_NODE = 6;  // legacy

  public static readonly PROCESSING_INSTRUCTION_NODE = 7;

  public static readonly COMMENT_NODE = 8;

  public static readonly DOCUMENT_NODE = 9;

  public static readonly DOCUMENT_TYPE_NODE = 10;

  public static readonly DOCUMENT_FRAGMENT_NODE = 11;

  public static readonly NOTATION_NODE = 12;  // legacy

  readonly nodeName: string

  readonly nodeType: number

  readonly childNodes: NodeList

  nodeValue: string | null

  textContent: string | null

  // See: https://dom.spec.whatwg.org/#dom-eventtarget-addeventlistener
  addEventListener(
    type: string,
    callback?: EventHandler | EventListener,
    options?: AddEventListenerOptions | boolean
  ) {
    return addEventListenerWrapped(this, type, callback, options)
  }

  // See: https://dom.spec.whatwg.org/#dom-eventtarget-removeeventlistener
  removeEventListener(
    type: string,
    callback?: EventHandler | EventListener,
    options?: EventListenerOptions | boolean
  ) {
    return removeEventListenerWrapped(this, type, callback, options)
  }

  dispatchEvent(event: Event): boolean {
    const defaultPermitted = super.dispatchEvent(event)
    const parent = this.parentNode
    if (!event.bubbles || !parent) {
      return defaultPermitted
    }
    const defaultPermittedByParent = parent.dispatchEvent(event)
    return defaultPermitted && defaultPermittedByParent
  }

  get ownerDocument(): Document | null {
    return nodeDocumentMap.get(this)!
  }

  get parentNode(): Node | null {
    return getParent(this)
  }

  get parentElement(): Element | null {
    const parent = getParent(this)
    return parent?.nodeType === Node.ELEMENT_NODE ? parent as Element : null
  }

  get firstChild(): Node | null {
    return kids(this)[0] || null
  }

  get lastChild(): Node | null {
    const myKids = kids(this)
    return myKids[myKids.length - 1] || null
  }

  get previousSibling(): Node | null {
    if (!this.parentNode) {
      return null
    }
    const siblings = kids(this.parentNode)
    const index = siblings.indexOf(this)
    if (index === 0) {
      return null
    }
    return siblings[index - 1] || null
  }

  get nextSibling(): Node | null {
    if (!this.parentNode) {
      return null
    }
    const siblings = kids(this.parentNode)
    const index = siblings.indexOf(this)
    return siblings[index + 1] || null
  }

  constructor(
    ownerDocument: Document,
    nodeName: string,
    nodeType: number,
    nodeValue: string | null = null
  ) {
    if (new.target === Node) {
      throwIllegalConstructor()
    }
    super()

    kidsMap.set(this, [])
    nodeDocumentMap.set(this, ownerDocument)

    Object.defineProperty(this, 'childNodes', {
      enumerable: true,
      writable: false,
      configurable: false,
      value: createNodeList(kids(this)),
    })

    Object.defineProperty(this, 'textContent', {
      enumerable: true,
      configurable: false,
      get(): string | null {
        if ([Node.DOCUMENT_TYPE_NODE, Node.DOCUMENT_NODE].includes(this.nodeType)) {
          // Return null for these node types.
          return null
        }
        if ([
          Node.CDATA_SECTION_NODE,
          Node.COMMENT_NODE,
          Node.ATTRIBUTE_NODE,
          Node.PROCESSING_INSTRUCTION_NODE,
          Node.TEXT_NODE].includes(this.nodeType)) {
          // Return the node value for these node types.
          return this.nodeValue
        }
        const allText = []
        const myKids = kids(this)
        for (let i = 0; i < myKids.length; i++) {
          const child = myKids[i]
          if (![Node.COMMENT_NODE, Node.PROCESSING_INSTRUCTION_NODE].includes(child.nodeType)) {
            const txt = child.textContent || ''
            allText.push(txt)
          }
        }
        return allText.join('')
      },
      set(value: string) {
        if ([Node.DOCUMENT_TYPE_NODE, Node.DOCUMENT_NODE].includes(this.nodeType)) {
          // Do nothing for these node types.
          return
        }
        if ([
          Node.CDATA_SECTION_NODE,
          Node.COMMENT_NODE,
          Node.PROCESSING_INSTRUCTION_NODE,
          Node.TEXT_NODE].includes(this.nodeType)) {
          // Set the node value for these node types.
          this.nodeValue = value
        }
        const myKids = kids(this)
        const originalChildNodes: Node[] = Array.from(myKids)

        // Clear the array.
        myKids.length = 0

        originalChildNodes.forEach((child) => {
          parentMap.set(child, null)
        })

        // Add a new text node with the value.
        if (value !== '' && nodeDocument(this)) {
          const text = nodeDocument(this).createTextNode(value)
          parentMap.set(text, this)
          myKids.push(text)
        }
      },
    })

    this.nodeName = nodeName
    this.nodeType = nodeType
    this.nodeValue = nodeValue

    parentMap.set(this, null)
  }

  item(index: number): Node | null {
    return kids(this)[index] || null
  }

  cloneNode(deep?: boolean): Node {
    const clone = new Node(nodeDocument(this), this.nodeName, this.nodeType)

    clone.nodeValue = this.nodeValue

    const myKids = kids(this)
    if (deep) {
      for (let i = 0; i < myKids.length; i++) {
        const child = myKids[i]
        if (child) {
          clone.appendChild(child.cloneNode(true))
        }
      }
    }

    return clone
  }

  hasChildNodes(): boolean {
    return kids(this).length > 0
  }

  normalize(): void {
    // The normalize() method steps are to run these steps for each descendant exclusive Text node
    // See: https://dom.spec.whatwg.org/#dom-node-normalize
    if (this.nodeType === Node.TEXT_NODE) {
      const text = this as unknown as Text
      // 1. Let length be node’s length.
      let length = nodeLength(this)

      // 2. If length is zero, then remove node and continue with the next exclusive Text node,
      // if any.
      if (length === 0) {
        removeNode(text)
      } else {
        // 3. Let data be the concatenation of the data of node’s contiguous exclusive Text nodes
        // (excluding itself), in tree order.
        const data = contiguousExclusiveTextNodes(text as Text).filter(
          n => n !== text
        ).map(n => n.data).join('')

        // 4. Replace data with node node, offset length, count 0, and data data.
        replaceData(text, length, 0, data)

        // 5. Let currentNode be node’s next sibling.
        let currentNode = text.nextSibling

        // 6. While currentNode is an exclusive Text node:
        while (currentNode && currentNode.nodeType === Node.TEXT_NODE) {
          // 1. For each live range whose start node is currentNode, add length to its start
          // offset and set its start node to node.
          // [NOT IMPLEMENTED]

          // 2. For each live range whose end node is currentNode, add length to its end offset
          // and set its end node to node.
          // [NOT IMPLEMENTED]

          // 3. For each live range whose start node is currentNode’s parent and start offset is
          // currentNode’s index, set its start node to node and its start offset to length.
          // [NOT IMPLEMENTED]

          // 4. For each live range whose end node is currentNode’s parent and end offset is
          // currentNode’s index, set its end node to node and its end offset to length.
          // [NOT IMPLEMENTED]

          // 5. Add currentNode’s length to length.
          length += nodeLength(currentNode)

          // 6. Set currentNode to its next sibling.
          currentNode = currentNode.nextSibling
        }

        // 7. Remove node’s contiguous exclusive Text nodes (excluding itself), in tree order.
        contiguousExclusiveTextNodes(text).filter(n => n !== text).forEach((n) => {
          removeNode(n)
        })
      }
    }
    this.childNodes.forEach((child) => {
      child.normalize()
    })
  }

  appendChild(child: Node): Node {
    return appendNode(child, this)
  }

  insertBefore(node: Node, child: Node | null): Node {
    return preInsertNode(node, this, child)
  }

  removeChild(child: Node): Node {
    return preRemoveNode(child, this)
  }

  replaceChild(node: Node, child: Node): Node {
    return replaceNode(child, node, this)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getRootNode(options?: {composed?: boolean}): Node {
    let currentNode: Node | null = this
    while (currentNode.parentNode) {
      currentNode = currentNode.parentNode
    }
    return currentNode
  }

  /* eslint-disable-next-line class-methods-use-this */
  toJSON(): string {
    return '{}'
  }
}

export {Node}
