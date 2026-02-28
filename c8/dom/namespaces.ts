// @sublibrary(:dom-core-lib)
import {DOMException} from './dom-exception'
import {isXmlQName} from './xml-names'

// To validate a qualifiedName, throw an "InvalidCharacterError" DOMException if qualifiedName does
// not match the QName production.
// See: https://dom.spec.whatwg.org/#validate
const validateQualifiedName = (qualifiedName: string): void => {
  if (!isXmlQName(qualifiedName)) {
    throw new DOMException('Invalid character in qualifiedName', 'InvalidCharacterError')
  }
}

// To validate and extract a namespace and qualifiedName, run these steps:
// See: https://dom.spec.whatwg.org/#validate-and-extract
type NamespaceAndQualifiedName = {
  namespace: string | null,
  prefix: string | null,
  localName: string,
}
const validateAndExtractNamespaceAndQualifiedName = (
  namespaceIn: string | null, qualifiedName: string
): NamespaceAndQualifiedName => {
  // 1. If namespace is the empty string, then set it to null.
  let namespace = namespaceIn
  if (namespace === '') {
    namespace = null
  }

  // 2. Validate qualifiedName.
  validateQualifiedName(qualifiedName)

  // 3. Let prefix be null.
  let prefix: string | null = null

  // 4. Let localName be qualifiedName.
  let localName: string | null = qualifiedName

  // 5. If qualifiedName contains a U+003A (:), then:
  if (qualifiedName.includes(':')) {
    // 1. Let splitResult be the result of running strictly split given qualifiedName and U+003A
    // (:).
    const splitResult = qualifiedName.split(':')

    // 2. Set prefix to splitResult[0].
    ;[prefix] = splitResult

    // 3. Set localName to splitResult[1].
    localName = splitResult[1] ?? null
  }

  // 6. If prefix is non-null and namespace is null, then throw a "NamespaceError" DOMException.
  if (prefix !== null && namespace === null) {
    throw new DOMException('Namespace is null', 'NamespaceError')
  }

  // 7. If prefix is "xml" and namespace is not the XML namespace, then throw a "NamespaceError"
  // DOMException.
  if (prefix === 'xml' && namespace !== 'http://www.w3.org/XML/1998/namespace') {
    throw new DOMException('Namespace is not the XML namespace', 'NamespaceError')
  }

  // 8. If either qualifiedName or prefix is "xmlns" and namespace is not the XMLNS namespace, then
  // throw a "NamespaceError" DOMException.
  if ((qualifiedName === 'xmlns' || prefix === 'xmlns') &&
    namespace !== 'http://www.w3.org/2000/xmlns/') {
    throw new DOMException('Namespace is not the XMLNS namespace', 'NamespaceError')
  }

  // 9. If namespace is the XMLNS namespace and neither qualifiedName nor prefix is "xmlns", then
  // throw a "NamespaceError" DOMException.
  if (namespace === 'http://www.w3.org/2000/xmlns/' &&
    qualifiedName !== 'xmlns' && prefix !== 'xmlns') {
    throw new DOMException('Invalid qualifiedName or prefix for xmlns', 'NamespaceError')
  }

  // 10. Return namespace, prefix, and localName.
  return {namespace, prefix, localName}
}

export {
  validateQualifiedName,
  validateAndExtractNamespaceAndQualifiedName,
}
