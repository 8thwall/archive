// @sublibrary(:dom-core-lib)
import type {Attr} from './attr'
import type {Element} from './element'
import {inHtmlNamespace, isHtmlDocument} from './element-internal'
import {nodeDocument} from './node-internal'
import type {DOMString} from './strings'
import {DOMException} from './dom-exception'
import {
  getAttributeByName,
  getAttributeByNamespaceAndLocalName,
  getAttributeList,
  removeAttributeByName,
  removeAttributeByNamespaceAndLocalName,
  setAttribute,
} from './element-internal'
import {throwIllegalConstructor} from './exception'

let inFactory = false

const namedNodeMapElementMap = new WeakMap<NamedNodeMap, Element>()
const getNamedNodeMapElement = (
  namedNodeMap: NamedNodeMap
): Element => namedNodeMapElementMap.get(namedNodeMap)!

// A NamedNodeMap object’s supported property indices are the numbers in the range zero to its
// attribute list’s size minus one, unless the attribute list is empty, in which case there are no
// supported property indices.
const getSupportedPropertyIndices = (
  length: number
): string[] => Array.from(Array(length).keys(), i => i.toString())

// A NamedNodeMap object’s supported property names are the return value of running these steps:
const getSupportedPropertyNames = (element: Element): string[] => {
  // 1. Let names be the qualified names of the attributes in this NamedNodeMap object’s attribute
  // list, with duplicates omitted, in order.
  let names = [...new Set(getAttributeList(element).map(attr => attr.name))]

  // 2. If this NamedNodeMap object’s element is in the HTML namespace and its node document is an
  // HTML document, then for each name in names:
  if (inHtmlNamespace(element) && isHtmlDocument(nodeDocument(element))) {
    // 1. Let lowercaseName be name, in ASCII lowercase.
    // 2. If lowercaseName is not equal to name, remove name from names.
    names = names.filter(name => name.toLowerCase() === name)
  }

  // 5. Return names.
  return names
}

const propIsSupportedIndex = (
  prop: string | symbol,
  length: number
): prop is string => getSupportedPropertyIndices(length).some(index => index === prop)

const propIsSupportedName = (
  prop: string | symbol,
  element: Element
): prop is string => getSupportedPropertyNames(element).some(name => name === prop)

const propIsSupported = (
  prop: string | symbol, length: number, element: Element
): prop is string => propIsSupportedIndex(prop, length) || propIsSupportedName(prop, element)

class NamedNodeMap implements Iterable<Attr> {
  /* eslint-disable no-undef */
  [key: string]: any

  [index: number]: Attr
  /* eslint-enable no-undef */

  #element: Element

  constructor(el: Element) {
    if (!inFactory) {
      throwIllegalConstructor()
    }

    namedNodeMapElementMap.set(this, el)

    const proxy = new Proxy(this, {
      ownKeys: (target) => {
        const {length} = target
        return [
          ...getSupportedPropertyIndices(length),
          ...Object.getOwnPropertyNames(target),
          ...Object.getOwnPropertySymbols(target),
          ...getSupportedPropertyNames(el),
        ]
      },
      getPrototypeOf: target => Reflect.getPrototypeOf(target),
      getOwnPropertyDescriptor: (target, prop) => {
        const descriptor = Reflect.getOwnPropertyDescriptor(target, prop)
        if (descriptor !== undefined) {
          return descriptor
        }
        if (propIsSupportedIndex(prop, target.length)) {
          return {
            value: target.item(Number(prop)),
            writable: false,
            enumerable: true,
            configurable: true,
          }
        }
        if (propIsSupportedName(prop, el)) {
          return {
            value: target.getNamedItem(prop),
            writable: false,
            enumerable: false,
            configurable: true,
          }
        }
        return undefined
      },
      get: (target, prop, receiver) => {
        const result = Reflect.get(target, prop, receiver)
        if (result !== undefined) {
          return result
        }
        if (propIsSupportedIndex(prop, target.length)) {
          return target.item.call(receiver, Number(prop))
        }
        if (propIsSupportedName(prop, el)) {
          return target.getNamedItem.call(receiver, prop)
        }
        return undefined
      },
      set: (target, prop, value, receiver) => {
        if (propIsSupported(prop, target.length, el)) {
          return true
        }
        return Reflect.set(target, prop, value, receiver)
      },
      has: (target, prop) => {
        const result = Reflect.has(target, prop)
        return result || propIsSupported(prop, target.length, el)
      },
    })

    namedNodeMapElementMap.set(proxy, el)
    return proxy
  }

  // The length getter steps are to return the attribute list’s size.
  // See: https://dom.spec.whatwg.org/#dom-namednodemap-length
  get length(): number {
    return getAttributeList(getNamedNodeMapElement(this)).length
  }

  // The item(index) method steps are:
  item(index: number): Attr | null {
    const attribs = getAttributeList(getNamedNodeMapElement(this))
    // 1. If index is equal to or greater than this’s attribute list’s size, then return null.
    if (index >= attribs.length) {
      return null
    }

    // 2. Otherwise, return the indexth attribute in this’s attribute list.
    return attribs[index] || null
  }

  // The getNamedItem(qualifiedName) method steps are to return the result of getting an attribute
  // given qualifiedName and element.
  // See: https://dom.spec.whatwg.org/#dom-namednodemap-getnameditem
  getNamedItem(qualifiedName: DOMString): Attr | null {
    return getAttributeByName(qualifiedName, getNamedNodeMapElement(this))
  }

  // The getNamedItemNS(namespace, localName) method steps are to return the result of getting an
  // attribute given namespace, localName, and element.
  // See: https://dom.spec.whatwg.org/#dom-namednodemap-getnameditemns
  getNamedItemNS(namespace: DOMString | null, localName: DOMString): Attr | null {
    return getAttributeByNamespaceAndLocalName(namespace, localName, getNamedNodeMapElement(this))
  }

  // The setNamedItem(attr) and setNamedItemNS(attr) method steps are to return the result of
  // setting an attribute given attr and element.
  // See: https://dom.spec.whatwg.org/#dom-namednodemap-setnameditem
  setNamedItem(attr: Attr): Attr | null {
    return setAttribute(attr, getNamedNodeMapElement(this))
  }

  setNamedItemNS(attr: Attr): Attr | null {
    return setAttribute(attr, getNamedNodeMapElement(this))
  }

  // The removeNamedItem(qualifiedName) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-namednodemap-removenameditem
  removeNamedItem(qualifiedName: DOMString): Attr {
    // 1. Let attr be the result of removing an attribute given qualifiedName and element.
    const attr = removeAttributeByName(qualifiedName, getNamedNodeMapElement(this))

    // 2. If attr is null, then throw a "NotFoundError" DOMException.
    if (!attr) {
      throw new DOMException(`No item with name "${qualifiedName}" was found`, 'NotFoundError')
    }

    // 3. Return attr.
    return attr
  }

  // The removeNamedItemNS(namespace, localName) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-namednodemap-removenameditemns
  removeNamedItemNS(namespace: DOMString | null, localName: DOMString): Attr {
    // 1. Let attr be the result of removing an attribute given namespace, localName, and element.
    const attr = removeAttributeByNamespaceAndLocalName(
      namespace, localName, getNamedNodeMapElement(this)
    )

    // 2. If attr is null, then throw a "NotFoundError" DOMException.
    if (!attr) {
      throw new DOMException(
        `No item with name "${namespace}::${localName}" was found`, 'NotFoundError'
      )
    }

    // 3. Return attr.
    return attr
  }

  [Symbol.iterator](): IterableIterator<Attr> {
    return getAttributeList(getNamedNodeMapElement(this))[Symbol.iterator]()
  }
}

const createNamedNodeMap = (el: Element): NamedNodeMap => {
  inFactory = true
  try {
    return new NamedNodeMap(el)
  } finally {
    inFactory = false
  }
}

export {NamedNodeMap, createNamedNodeMap}
