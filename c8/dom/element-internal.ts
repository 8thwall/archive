// @sublibrary(:dom-core-lib)
import type {Element} from './element'
import {type Attr, createAttr} from './attr'
import {DOMException} from './dom-exception'
import type {Document} from './document'
import type {Node} from './node'
import {
  nodeDocument,
  preInsertNode,
  replaceNonOrdered,
} from './node-internal'
import {
  handleAttributeChanges,
} from './attribute-change-steps'

type AttrWithElement = Attr & {ownerElement: Element}

// Elements also have an attribute list, which is a list exposed through a NamedNodeMap. Unless
// explicitly given when an element is created, its attribute list is empty.
// See: https://dom.spec.whatwg.org/#concept-element
const attributeListMap: WeakMap<Element, AttrWithElement[]> = new WeakMap()
const getAttributeList = (element: Element): AttrWithElement[] => attributeListMap.get(element)!

// To change an attribute attribute to value, run these steps:
// See: https://dom.spec.whatwg.org/#concept-element-attributes-change
const changeAttribute = (attribute: AttrWithElement, value: string): void => {
  // 1. Let oldValue be attribute’s value.
  const oldValue = attribute.value

  // 2. Set attribute’s value to value.
  attribute.value = value

  // 3. Handle attribute changes for attribute with attribute’s element, oldValue, and value.
  handleAttributeChanges(attribute, attribute.ownerElement, oldValue, value)
}

// To append an attribute attribute to an element element, run these steps:
// See: https://dom.spec.whatwg.org/#concept-element-attributes-append
const appendAttribute = (attribute: AttrWithElement, element: Element): void => {
  // 1. Append attribute to element’s attribute list.
  getAttributeList(element).push(attribute)

  // 2. Set attribute’s element to element.
  Object.assign(attribute, {ownerElement: element})

  // 3. Handle attribute changes for attribute with element, null, and attribute’s value.
  handleAttributeChanges(attribute, element, null, attribute.value)
}

// To remove an attribute attribute, run these steps:
// See: https://dom.spec.whatwg.org/#concept-element-attributes-remove
const removeAttribute = (attribute: AttrWithElement): void => {
  // 1. Let element be attribute’s element.
  const element = attribute.ownerElement

  // 2. Remove attribute from element’s attribute list.
  const attribs = getAttributeList(element)
  attribs.splice(attribs.indexOf(attribute), 1)

  // 3. Set attribute’s element to null.
  Object.assign(attribute, {ownerElement: null})

  // 4. Handle attribute changes for attribute with element, attribute’s value, and null.
  handleAttributeChanges(attribute as Attr, element, attribute.value, null)
}

// To replace an attribute oldAttr with an attribute newAttr, run these steps:
// See: https://dom.spec.whatwg.org/#concept-element-attributes-replace
const replaceAttribute = (oldAttr: AttrWithElement, newAttr: Attr): void => {
  // 1. Replace oldAttr by newAttr in oldAttr’s element’s attribute list.
  const attribs = getAttributeList(oldAttr.ownerElement)
  replaceNonOrdered(newAttr, attribs, item => item === oldAttr)

  // 2. Set newAttr’s element to oldAttr’s element.
  Object.assign(newAttr, {ownerElement: oldAttr.ownerElement})

  // 3. Set oldAttr’s element to null.
  Object.assign(oldAttr, {ownerElement: null})

  // 4. Handle attribute changes for oldAttr with newAttr’s element, oldAttr’s value, and newAttr’s
  // value.
  handleAttributeChanges(oldAttr as Attr, newAttr.ownerElement!, oldAttr.value, newAttr.value)
}

const inHtmlNamespace = (
  element: Element
): boolean => element.namespaceURI === 'http://www.w3.org/1999/xhtml'

// https://dom.spec.whatwg.org/#insert-adjacent
const insertAdjacent = (
  element: Element,
  where: string,
  node: Node
) => {
  switch (where) {
    case 'beforebegin':
      if (!element.parentNode) {
        return null
      }
      return preInsertNode(node, element.parentNode, element) as Element
    case 'afterbegin':
      return preInsertNode(node, element, element.firstChild) as Element
    case 'beforeend':
      return preInsertNode(node, element, null) as Element
    case 'afterend':
      if (!element.parentNode) {
        return null
      }
      return preInsertNode(node, element.parentNode, element.nextSibling) as Element
    default:
      throw new DOMException(
        'position parameter must be: beforebegin, afterbegin, beforeend, or afterend',
        'SyntaxError'
      )
  }
}

// A document is said to be an XML document if its type is "xml"; otherwise an HTML document.
// Whether a document is an HTML document or an XML document affects the behavior of certain APIs.
// See: https://dom.spec.whatwg.org/#html-document
// [NOT IMPLEMENTED]
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const isHtmlDocument = (doc: Document): boolean => true

// To get an attribute by name given a string qualifiedName and an element element:
// See: https://dom.spec.whatwg.org/#concept-element-attributes-get-by-name
const getAttributeByName = (qualifiedNameIn: string, element: Element): AttrWithElement | null => {
  // 1. If element is in the HTML namespace and its node document is an HTML document, then set
  // qualifiedName to qualifiedName in ASCII lowercase.
  let qualifiedName = qualifiedNameIn
  if (inHtmlNamespace(element) && isHtmlDocument(nodeDocument(element))) {
    qualifiedName = qualifiedName.toLowerCase()
  }

  // 2. Return the first attribute in element’s attribute list whose qualified name is
  // qualifiedName; otherwise null.
  for (const attr of getAttributeList(element)) {
    if (attr.name === qualifiedName) {
      return attr
    }
  }
  return null
}

// To get an attribute by namespace and local name given null or a string namespace, a string
// localName, and an element element:
// See: https://dom.spec.whatwg.org/#concept-element-attributes-get-by-namespace
const getAttributeByNamespaceAndLocalName = (
  namespaceIn: string | null, localName: string, element: Element
): AttrWithElement | null => {
  // 1. If namespace is the empty string, then set it to null.
  const namespace = namespaceIn || null

  // 2. Return the attribute in element’s attribute list whose namespace is namespace and local name
  // is localName, if any; otherwise null.
  for (const attr of getAttributeList(element)) {
    if (attr.namespaceURI === namespace && attr.localName === localName) {
      return attr
    }
  }
  return null
}

// To get an attribute value given an element element, a string localName, and an optional null or
// string namespace (default null):
// See: https://dom.spec.whatwg.org/#concept-element-attributes-get-value
const getAttributeValue = (
  element: Element, localName: string, namespace: string | null = null
): string => {
  // 1. Let attr be the result of getting an attribute given namespace, localName, and element.
  const attr = getAttributeByNamespaceAndLocalName(namespace, localName, element)

  // 2. If attr is null, then return the empty string.
  if (attr === null) {
    return ''
  }

  // 3. Return attr’s value.
  return attr.value
}

// To set an attribute given an attribute attr and an element element:
const setAttribute = (attrIn: Attr, element: Element): AttrWithElement | null => {
  // 1. If attr’s element is neither null nor element, throw an "InUseAttributeError" DOMException.
  if (attrIn.ownerElement && attrIn.ownerElement !== element) {
    throw new DOMException('Attribute is already in use', 'InUseAttributeError')
  }
  const attr = attrIn as AttrWithElement

  // 2. Let oldAttr be the result of getting an attribute given attr’s namespace, attr’s local name,
  // and element.
  const oldAttr = getAttributeByNamespaceAndLocalName(attr.namespaceURI, attr.localName, element)

  // 3. If oldAttr is attr, return attr.
  if (oldAttr === attr) {
    return attr
  }

  // 4. If oldAttr is non-null, then replace oldAttr with attr.
  if (oldAttr !== null) {
    replaceAttribute(oldAttr, attr)
  } else {  // 5. Otherwise, append attr to element.
    appendAttribute(attr, element)
  }

  // Return oldAttr.
  return oldAttr
}

// To set an attribute value given an element element, a string localName, a string value, an
// optional null or string prefix (default null), and an optional null or string namespace (default
// null):
// See: https://dom.spec.whatwg.org/#concept-element-attributes-set-value
const setAttributeValue = (
  element: Element,
  localName: string,
  value: string,
  prefix: string | null = null,
  namespace: string | null = null
): void => {
  // 1. Let attribute be the result of getting an attribute given namespace, localName, and element.
  const attribute = getAttributeByNamespaceAndLocalName(namespace, localName, element)

  // 2. If attribute is null, create an attribute whose namespace is namespace, namespace prefix is
  // prefix, local name is localName, value is value, and node document is element’s node document,
  // then append this attribute to element, and then return.
  if (attribute === null) {
    const attr = createAttr(nodeDocument(element), element, localName, value, namespace, prefix)
    appendAttribute(attr, element)
    return
  }

  // 3. Change attribute to value.
  changeAttribute(attribute, value)
}

// To remove an attribute by name given a string qualifiedName and an element element:
// See: https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-name
const removeAttributeByName = (qualifiedName: string, element: Element): AttrWithElement | null => {
  // 1. Let attr be the result of getting an attribute given qualifiedName and element.
  const attr = getAttributeByName(qualifiedName, element)

  // 2. If attr is non-null, then remove attr.
  if (attr !== null) {
    removeAttribute(attr)
  }

  // 3. Return attr.
  return attr
}

// To remove an attribute by namespace and local name given null or a string namespace, a string
// localName, and an element element:
// See: https://dom.spec.whatwg.org/#concept-element-attributes-remove-by-namespace
const removeAttributeByNamespaceAndLocalName = (
  namespace: string | null, localName: string, element: Element
): AttrWithElement | null => {
  // 1. Let attr be the result of getting an attribute given namespace, localName, and element.
  const attr = getAttributeByNamespaceAndLocalName(namespace, localName, element)

  // 2. If attr is non-null, then remove attr.
  if (attr !== null) {
    removeAttribute(attr)
  }

  // 3.Return attr.
  return attr
}

export {
  AttrWithElement,
  attributeListMap,
  getAttributeList,
  changeAttribute,
  appendAttribute,
  removeAttribute,
  replaceAttribute,
  inHtmlNamespace,
  insertAdjacent,
  isHtmlDocument,
  getAttributeByName,
  getAttributeByNamespaceAndLocalName,
  getAttributeValue,
  setAttribute,
  setAttributeValue,
  removeAttributeByName,
  removeAttributeByNamespaceAndLocalName,
}
