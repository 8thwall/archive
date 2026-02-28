// @sublibrary(:dom-core-lib)
import type {DOMString} from './strings'
import {DOMTokenList, createDOMTokenList} from './dom-token-list'
import {Node} from './node'
import {Attr, createAttr} from './attr'
import {DOMException} from './dom-exception'
import {throwIllegalConstructor} from './exception'
import {NamedNodeMap, createNamedNodeMap} from './named-node-map'
import {HTMLCollection, createHTMLCollection} from './html-collection'
import {mixinChildNode, ChildNode} from './child-node'
import {CssomElement, mixinCssomElement} from './cssom-element'
import {mixinParentNode, ParentNode} from './parent-node'
import {nodeDocument, insertNode, appendNode} from './node-internal'
import {
  mixinNonDocumentTypeChildNode,
  NonDocumentTypeChildNode,
} from './non-document-type-child-node'
import type {Document} from './document'
import {implicitlyPotentiallyRenderBlockingSym} from './element-symbols'
import {serializeNode, insertHtmlBefore} from './element-parsing'
import {
  type AttrWithElement,
  attributeListMap,
  getAttributeList,
  changeAttribute,
  appendAttribute,
  removeAttribute,
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
} from './element-internal'
import {
  isXmlName,
} from './xml-names'
import {
  validateAndExtractNamespaceAndQualifiedName,
} from './namespaces'

class Element extends Node implements ParentNode, ChildNode, NonDocumentTypeChildNode {
  readonly _namespaceURI: DOMString | null

  readonly prefix: DOMString | null

  readonly localName: DOMString

  readonly tagName: DOMString

  private readonly _classList: DOMTokenList

  readonly _attributes: NamedNodeMap

  private capturedPointerIds: Set<number> = new Set();

  // Prop textContent has type string in an Element object.
  declare textContent: string

  // This and other specifications may define attribute change steps for elements. The algorithm is
  // passed element, localName, oldValue, value, and namespace.
  constructor(
    ownerDocument: Document,
    localName: DOMString,
    tagName: DOMString,
    namespaceURI?: DOMString | null,
    prefix?: DOMString | null
  ) {
    if (new.target === Element) {
      throwIllegalConstructor()
    }
    const name = prefix ? `${prefix}:${localName}` : localName
    super(ownerDocument, name, Node.ELEMENT_NODE)

    attributeListMap.set(this, [])

    Object.defineProperty(this, '_namespaceURI', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: namespaceURI || null,
    })
    this.prefix = prefix || null
    this.localName = localName
    this.tagName = tagName

    Object.defineProperty(this, '_attributes', {
      value: createNamedNodeMap(this),
    })
    this._classList = createDOMTokenList(this, 'class')
  }

  // Type narrowing for the ownerDocument property for any non-Document node.
  get ownerDocument(): Document {
    return super.ownerDocument!
  }

  // Defined at the individual elements. By default, an element is not
  // implicitly potentially render-blocking.
  // eslint-disable-next-line class-methods-use-this
  [implicitlyPotentiallyRenderBlockingSym](): boolean {
    return false
  }

  get namespaceURI(): DOMString | null {
    return this._namespaceURI
  }

  get outerHTML(): DOMString {
    return serializeNode(this)
  }

  set outerHTML(html: DOMString) {
    const parent = this.parentNode
    if (!parent) {
      throw Error(
        'Failed to set the \'outerHTML\' property on \'Element\': This element has no parent node.'
      )
    }

    if (parent.nodeType !== Node.ELEMENT_NODE) {
      throw Error(
        'Failed to set the \'outerHTML\' property on \'Element\'' +
        ': This element\'s parent is not an element node.'
      )
    }

    // Insert HTML before this.
    this.insertAdjacentHTML('beforebegin', html)

    // Remove this element.
    parent.removeChild(this)
  }

  // eslint-disable-next-line class-methods-use-this
  get clientHeight(): number {
    return 0
  }

  get innerHTML(): DOMString {
    let result = ''
    this.childNodes.forEach((child) => {
      result += serializeNode(child)
    })
    return result
  }

  set innerHTML(html: DOMString) {
    // Remove all children.
    while (this.firstChild) {
      this.removeChild(this.firstChild)
    }
    this.insertAdjacentHTML('afterbegin', html)
  }

  // The id attribute must reflect "id".
  get id(): DOMString {
    return getAttributeValue(this, 'id')
  }

  set id(value: DOMString) {
    setAttributeValue(this, 'id', value)
  }

  // The className attribute must reflect "class".
  get className(): DOMString {
    return getAttributeValue(this, 'class')
  }

  set className(value: DOMString) {
    setAttributeValue(this, 'class', value)
  }

  get classList(): DOMTokenList {
    return this._classList
  }

  set classList(value: any) {
    const valueAsString = String(value)
    this.setAttribute('class', valueAsString)
    this._classList.value = valueAsString
  }

  // The slot attribute must reflect "slot".
  get slot(): DOMString {
    return getAttributeValue(this, 'slot')
  }

  set slot(value: DOMString) {
    setAttributeValue(this, 'slot', value)
  }

  // The hasAttributes() method steps are to return false if this’s attribute list is empty;
  // otherwise true.
  // See: https://dom.spec.whatwg.org/#dom-element-hasattributes
  hasAttributes(): boolean {
    return getAttributeList(this).length > 0
  }

  // The attributes getter steps are to return the associated NamedNodeMap.
  // See: https://dom.spec.whatwg.org/#dom-element-attributes
  get attributes(): NamedNodeMap {
    return this._attributes
  }

  // The getAttributeNames() method steps are to return the qualified names of the attributes in
  // this’s attribute list, in order; otherwise a new list.
  // See: https://dom.spec.whatwg.org/#dom-element-getattributenames
  getAttributeNames(): DOMString[] {
    return Array.from(this._attributes).map(attr => attr.name)
  }

  // The getAttribute(qualifiedName) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-element-getattribute
  getAttribute(qualifiedName: DOMString): DOMString | null {
    // 1. Let attr be the result of getting an attribute given qualifiedName and this.
    const attr = getAttributeByName(qualifiedName, this)

    // 2. If attr is null, return null.
    if (attr === null) {
      return null
    }

    // 3. Return attr’s value.
    return attr.value
  }

  // The getAttributeNS(namespace, localName) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-element-getattributens
  getAttributeNS(namespace: DOMString | null, localName: DOMString): DOMString | null {
    // 1. Let attr be the result of getting an attribute given namespace, localName, and this.
    const attr = getAttributeByNamespaceAndLocalName(namespace, localName, this)

    // 2. If attr is null, return null.
    if (attr === null) {
      return null
    }

    // 3. Return attr’s value.
    return attr.value
  }

  // The setAttribute(qualifiedName, value) method steps are:
  setAttribute(qualifiedNameIn: DOMString, value: DOMString): void {
    let qualifiedName = qualifiedNameIn

    // 1. If qualifiedName does not match the Name production in XML, then throw an
    // "InvalidCharacterError" DOMException.
    if (!isXmlName(qualifiedName)) {
      throw new DOMException('Invalid character in attribute name.', 'InvalidCharacterError')
    }

    // 2. If this is in the HTML namespace and its node document is an HTML document, then set
    // qualifiedName to qualifiedName in ASCII lowercase.
    if (inHtmlNamespace(this) && isHtmlDocument(nodeDocument(this))) {
      qualifiedName = qualifiedName.toLowerCase()
    }

    // 3. Let attribute be the first attribute in this’s attribute list whose qualified name is
    // qualifiedName, and null otherwise.
    let attribute: AttrWithElement | null = null
    const attribs = getAttributeList(this)
    for (const attr of attribs) {
      if (attr.name === qualifiedName) {
        attribute = attr
      }
    }

    // 4. If attribute is null, create an attribute whose local name is qualifiedName, value is
    // value, and node document is this’s node document, then append this attribute to this, and
    // then return.
    if (attribute === null) {
      attribute = createAttr(nodeDocument(this), this, qualifiedName, value)
      appendAttribute(attribute as AttrWithElement, this)
      return
    }

    // 5. Change attribute to value.
    changeAttribute(attribute, value)
  }

  // The setAttributeNS(namespace, qualifiedName, value) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-element-setattributens
  setAttributeNS(namespace: DOMString | null, qualifiedName: DOMString, value: DOMString): void {
    // 1. Let namespace, prefix, and localName be the result of passing namespace and qualifiedName
    // to validate and extract.
    const {namespace: ns, prefix, localName} =
      validateAndExtractNamespaceAndQualifiedName(namespace, qualifiedName)

    // 2. Set an attribute value for this using localName, value, and also prefix and namespace.
    setAttributeValue(this, localName, value, prefix, ns)
  }

  // The removeAttribute(qualifiedName) method steps are to remove an attribute given qualifiedName
  // and this, and then return undefined.
  // See: https://dom.spec.whatwg.org/#dom-element-removeattribute
  removeAttribute(qualifiedName: DOMString): void {
    removeAttributeByName(qualifiedName, this)
    return undefined
  }

  // The removeAttributeNS(namespace, localName) method steps are to remove an attribute given
  // namespace, localName, and this, and then return undefined.
  // See: https://dom.spec.whatwg.org/#dom-element-removeattributens
  removeAttributeNS(namespace: DOMString | null, localName: DOMString): void {
    removeAttributeByNamespaceAndLocalName(namespace, localName, this)
    return undefined
  }

  // The hasAttribute(qualifiedName) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-element-hasattribute
  hasAttribute(qualifiedNameIn: DOMString): boolean {
    let qualifiedName = qualifiedNameIn
    // 1. If this is in the HTML namespace and its node document is an HTML document, then set
    // qualifiedName to qualifiedName in ASCII lowercase.
    if (inHtmlNamespace(this) && isHtmlDocument(nodeDocument(this))) {
      qualifiedName = qualifiedName.toLowerCase()
    }

    // 2. Return true if this has an attribute whose qualified name is qualifiedName; otherwise
    // false.
    return getAttributeList(this).some(attr => attr.name === qualifiedName)
  }

  // The toggleAttribute(qualifiedName, force) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-element-toggleattribute
  toggleAttribute(qualifiedNameIn: DOMString, force?: boolean): boolean {
    let qualifiedName = qualifiedNameIn
    // 1. If qualifiedName does not match the Name production in XML, then throw an
    // "InvalidCharacterError" DOMException.
    if (!isXmlName(qualifiedName)) {
      throw new DOMException('Invalid character in attribute name.', 'InvalidCharacterError')
    }

    // 2. If this is in the HTML namespace and its node document is an HTML document, then set
    // qualifiedName to qualifiedName in ASCII lowercase.
    if (inHtmlNamespace(this) && isHtmlDocument(nodeDocument(this))) {
      qualifiedName = qualifiedName.toLowerCase()
    }

    // 3. Let attribute be the first attribute in this’s attribute list whose qualified name is
    // qualifiedName, and null otherwise.
    const attribute = getAttributeList(this).find(attr => attr.name === qualifiedName) ?? null

    // 4. If attribute is null, then:
    if (attribute === null) {
      // 1. If force is not given or is true, create an attribute whose local name is qualifiedName,
      // value is the empty string, and node document is this’s node document, then append this
      // attribute to this, and then return true.
      if (force === undefined || force) {
        const newAttribute = createAttr(nodeDocument(this), this, qualifiedName, '')
        appendAttribute(newAttribute, this)
        return true
      }

      // 2. Return false.
      return false
    }

    // 5. Otherwise, if force is not given or is false, remove an attribute given qualifiedName and
    // this, and then return false.
    if (force === undefined || !force) {
      removeAttributeByName(qualifiedName, this)
      return false
    }

    // 6. Return true.
    return true
  }

  // The hasAttributeNS(namespace, localName) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-element-hasattributens
  hasAttributeNS(namespaceIn: DOMString | null, localName: DOMString): boolean {
    let namespace = namespaceIn
    // 1. If namespace is the empty string, then set it to null.
    if (namespace === '') {
      namespace = null
    }

    // 2. Return true if this has an attribute whose namespace is namespace and local name is
    // localName; otherwise false.
    return getAttributeList(this).some(
      attr => attr.namespaceURI === namespace && attr.localName === localName
    )
  }

  // The getAttributeNode(qualifiedName) method steps are to return the result of getting an
  // attribute given qualifiedName and this.
  // See: https://dom.spec.whatwg.org/#dom-element-getattributenode
  getAttributeNode(qualifiedName: DOMString): Attr | null {
    return getAttributeByName(qualifiedName, this)
  }

  // The getAttributeNodeNS(namespace, localName) method steps are to return the result of getting
  // an attribute given namespace, localName, and this.
  // See: https://dom.spec.whatwg.org/#dom-element-getattributenodens
  getAttributeNodeNS(namespace: DOMString | null, localName: DOMString): Attr | null {
    return getAttributeByNamespaceAndLocalName(namespace, localName, this)
  }

  // The setAttributeNode(attr) and setAttributeNodeNS(attr) methods steps are to return the result
  // of setting an attribute given attr and this.
  // See: https://dom.spec.whatwg.org/#dom-element-setattributenode
  setAttributeNode(attr: Attr): Attr | null {
    return setAttribute(attr, this)
  }

  // The removeAttributeNode(attr) method steps are:
  // See: https://dom.spec.whatwg.org/#dom-element-removeattributenode
  removeAttributeNode(attr: Attr): Attr {
    // 1. If this’s attribute list does not contain attr, then throw a "NotFoundError" DOMException.
    if (!getAttributeList(this).includes(attr as AttrWithElement)) {
      throw new DOMException('Attribute not found', 'NotFoundError')
    }

    // 2. Remove attr.
    removeAttribute(attr as AttrWithElement)

    // 3. Return attr.
    return attr
  }

  getElementsByTagName(tagName: string): HTMLCollection {
    const {childNodes} = this
    const lowerTagName = tagName.toLowerCase()
    return createHTMLCollection({
      * [Symbol.iterator]() {
        const iter = childNodes[Symbol.iterator]()
        let result = iter.next()
        while (!result.done) {
          const child = result.value
          if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as Element
            if (tagName === '*') {
              // Yield all tag names.
              yield element
            } else {
              const qualifiedName =
                element.prefix ? `${element.prefix}:${element.localName}` : element.localName
              if (element.namespaceURI === null) {
                // If no namespace match is case-insensitive.
                if (qualifiedName === lowerTagName) {
                  yield element
                }
              } else if (qualifiedName === tagName) {
                // If namespace match is case-sensitive.
                yield element
              }
            }
            yield* element.getElementsByTagName(tagName)
          }
          result = iter.next()
        }
      },
    })
  }

  getElementsByTagNameNS(namespaceURI: DOMString | null, localName: DOMString): HTMLCollection {
    const {childNodes} = this
    return createHTMLCollection({
      * [Symbol.iterator]() {
        const iter = childNodes[Symbol.iterator]()
        let result = iter.next()
        while (!result.done) {
          const child = result.value
          if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as Element
            if ((element.namespaceURI === namespaceURI || namespaceURI === '*') &&
              (element.localName === localName || localName === '*')) {
              yield element
            }
            yield* element.getElementsByTagNameNS(namespaceURI, localName)
          }
          result = iter.next()
        }
      },
    })
  }

  getElementsByClassName(names: string): HTMLCollection {
    const {childNodes} = this
    const classNames = names.trim().split(/\s+/)
    return createHTMLCollection({
      * [Symbol.iterator]() {
        const iter = childNodes[Symbol.iterator]()
        let result = iter.next()
        while (!result.done) {
          const child = result.value
          if (child.nodeType === Node.ELEMENT_NODE) {
            const element = child as Element
            if (classNames.every(name => element.classList.contains(name))) {
              yield element
            }
            yield* element.getElementsByClassName(names)
          }
          result = iter.next()
        }
      },
    })
  }

  // See: https://dom.spec.whatwg.org/#dom-element-insertadjacentelement
  insertAdjacentElement(where: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
    element: Element): Element | null {
    return insertAdjacent(this, where, element)
  }

  insertAdjacentHTML(position: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
    text: string): void {
    const DOCUMENT_NODE = 9
    const HTML_NAMESPACE = 'http://www.w3.org/1999/xhtml'
    const lowerPosition = position.toLowerCase()

    // 1. Let compliantString be the result of invoking the
    //   Get Trusted Type compliant string algorithm with TrustedHTML,
    //   this's relevant global object, string, "Element insertAdjacentHTML", and "script".
    //   TODO(akashmahesh): Implement compliant string algorithm
    const compliantString = text

    // 2. Let context be null
    let context: Element | null = null

    // 3. Use the first matching item
    switch (lowerPosition) {
      // If position is an ASCII case-insensitive match for the string "beforebegin"
      // If position is an ASCII case-insensitive match for the string "afterend"
      //    1. Set context to this's parent.
      //    2. If context is null or a Document, throw a "NoModificationAllowedError" DOMException.
      case 'beforebegin':
      case 'afterend':
        context = this.parentNode as Element
        if (!context || context.nodeType === DOCUMENT_NODE) {
          throw new DOMException(
            'The element has no parent or the parent is the document', 'NoModificationAllowedError'
          )
        }
        break
      // If position is an ASCII case-insensitive match for the string "afterbegin"
      // If position is an ASCII case-insensitive match for the string "beforeend"
      //    Set context to this.
      case 'afterbegin':
      case 'beforeend':
        context = this
        break
      // Otherwise, throw a "SyntaxError" DOMException.
      default:
        throw new DOMException(
          'position parameter must be: beforebegin, afterbegin, beforeend, or afterend',
          'SyntaxError'
        )
    }

    const doc = nodeDocument(this)
    const isHTMLDocument = true
    const isHTMLContext = context.localName === 'html' && context.namespaceURI === HTML_NAMESPACE

    // 4. If context is not an Element or all of the following are true:
    //      context's node document is an HTML document
    //      context's local name is "html"; and
    //      context's namespace is the HTML namespace
    // set context to the result of creating an element given
    // this's node document, body, and the HTML namespace.
    if (!(context instanceof Element) || (isHTMLDocument && isHTMLContext)) {
      context = doc.createElement('body')
    }

    // 5. Parse compliantString into Document Fragment
    // NOTE(akashmahesh): Spec calls for fragment parsing algorithm,
    //                    expected behavior is matched
    const temp = doc.createElement('template')
    const fragment = doc.createDocumentFragment()
    insertHtmlBefore(compliantString, temp, null)
    while (temp.firstChild) {
      fragment.appendChild(temp.firstChild)
    }

    // 6. Use the first matching item from this list:
    switch (lowerPosition) {
      // If position is an ASCII case-insensitive match for the string "beforebegin"
      // Insert fragment into this's parent before this.
      case 'beforebegin':
        insertNode(fragment, this.parentNode!, this)
        break
      // If position is an ASCII case-insensitive match for the string "afterend"
      // Insert fragment into this's parent before this's next sibling.
      case 'afterend':
        insertNode(fragment, this.parentNode!, this.nextSibling)
        break
      // If position is an ASCII case-insensitive match for the string "afterbegin"
      // Insert fragment into this before its first child.
      case 'afterbegin':
        insertNode(fragment, this, this.firstChild)
        break
      // If position is an ASCII case-insensitive match for the string "beforeend"
      // Append fragment to this.
      case 'beforeend':
        appendNode(fragment, this)
        break
      default:
        throw new DOMException(
          'position parameter must be: beforebegin, afterbegin, beforeend, or afterend',
          'SyntaxError'
        )
    }
  }

  // See: https://dom.spec.whatwg.org/#dom-element-insertadjacenttext
  insertAdjacentText(where: 'beforebegin' | 'afterbegin' | 'beforeend' | 'afterend',
    data: DOMString) {
    // Let text be a new Text node whose data is data and node document is this’s node document.
    const text = nodeDocument(this).createTextNode(data)

    // Run insert adjacent, given this, where, and text.
    insertAdjacent(this, where, text)
  }

  setPointerCapture(pointerId: number): void {
    this.capturedPointerIds.add(pointerId)
  }

  releasePointerCapture(pointerId: number): void {
    this.capturedPointerIds.delete(pointerId)
  }

  hasPointerCapture(pointerId: number): boolean {
    return this.capturedPointerIds.has(pointerId)
  }
}

// Add mixin properties and methods via declaration merging.
interface Element extends ParentNode {}  // eslint-disable-line no-redeclare
interface Element extends ChildNode {}  // eslint-disable-line no-redeclare
interface Element extends NonDocumentTypeChildNode {}  // eslint-disable-line no-redeclare
interface Element extends CssomElement {}  // eslint-disable-line no-redeclare

// Add the mixin additions to Element's prototype.
mixinParentNode(Element.prototype)
mixinChildNode(Element.prototype)
mixinNonDocumentTypeChildNode(Element.prototype)
mixinCssomElement(Element.prototype)

export {Element}
