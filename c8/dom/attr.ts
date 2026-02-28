// @sublibrary(:dom-core-lib)
import type {DOMString} from './strings'
import {Node} from './node'
import type {Element} from './element'
import type {Document} from './document'
import {throwIllegalConstructor} from './exception'
import type {AttrWithElement} from './element-internal'

let inFactory = false

class Attr extends Node {
  readonly namespaceURI: DOMString | null

  readonly prefix: DOMString | null

  readonly localName: DOMString

  readonly name: DOMString

  value: DOMString

  readonly ownerElement: Element | null

  // eslint-disable-next-line class-methods-use-this
  get specified(): boolean {
    return true
  }

  constructor(
    ownerDocument: Document,
    ownerElement: Element | null,
    localName: DOMString,
    value: DOMString,
    namespaceURI?: DOMString | null,
    prefix?: DOMString | null
  ) {
    if (!inFactory) {
      throwIllegalConstructor()
    }

    const name = prefix ? `${prefix}:${localName}` : localName
    super(ownerDocument, name, Node.ATTRIBUTE_NODE)

    this.ownerElement = ownerElement
    this.name = name
    this.localName = localName
    this.value = value
    this.namespaceURI = namespaceURI || null
    this.prefix = prefix || null
  }

  // Type narrowing for the ownerDocument property for any non-Document node.
  get ownerDocument(): Document {
    return super.ownerDocument!
  }
}

const createAttr = <T extends Element | null = Element | null>(
  ownerDocument: Document,
  ownerElement: T,
  localName: DOMString,
  value: DOMString,
  namespaceURI?: DOMString | null,
  prefix?: DOMString | null
): T extends Element ? AttrWithElement : Attr => {
  inFactory = true
  try {
    return new Attr(
      ownerDocument,
      ownerElement,
      localName,
      value,
      namespaceURI,
      prefix
    ) as T extends Element ? AttrWithElement : Attr
  } finally {
    inFactory = false
  }
}

export {Attr, createAttr}
