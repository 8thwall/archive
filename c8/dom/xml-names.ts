// @sublibrary(:dom-core-lib)
// Check if a string is a valid XML name.
// See: https://www.w3.org/TR/xml/#NT-Name
// [4]     NameStartChar     ::=     ":" | [A-Z] | "_" | [a-z] | [#xC0-#xD6] | [#xD8-#xF6] |
// [#xF8-#x2FF] | [#x370-#x37D] | [#x37F-#x1FFF] | [#x200C-#x200D] | [#x2070-#x218F] |
// [#x2C00-#x2FEF] | [#x3001-#xD7FF] | [#xF900-#xFDCF] | [#xFDF0-#xFFFD] | [#x10000-#xEFFFF]
const NAME_START_CHAR = ':A-Z_a-z\xc0-\xd6\xd8-\xf6' +
  '\xf8-\u02ff\u0370-\u037d\u037f-\u1fff\u200c-\u200d\u2070-\u218f' +
  '\u2c00-\u2fef\u3001-\ud7ff\uf900-\ufdcf\ufdf0-\ufffd\\u{10000}-\\u{effff}'

// [4a]     NameChar     ::=     NameStartChar | "-" | "." | [0-9] | #xB7 | [#x0300-#x036F] |
// [#x203F-#x2040]
const NAME_CHAR = `${NAME_START_CHAR}\\-\\.0-9\xb7\u0300-\u036f\u203f-\u2040`

// [5]     Name     ::=     NameStartChar (NameChar)*
const NAME = `[${NAME_START_CHAR}][${NAME_CHAR}]*`

// [4]     NCName     ::=     Name - (Char* ':' Char*)  /* An XML Name, minus the ":" */
const NCNAME_START_CHAR = NAME_START_CHAR.slice(1)
const NCNAME_CHAR = NAME_CHAR.slice(1)
const NCNAME = `[${NCNAME_START_CHAR}][${NCNAME_CHAR}]*`

// [7]     QName     ::=     PrefixedName | UnprefixedName
// [8]     PrefixedName     ::=     Prefix ':' LocalPart
// [9]     UnprefixedName     ::=     LocalPart
// [10]     Prefix     ::=     NCName
// [11]     LocalPart     ::=     NCName
const QNAME = `${NCNAME}(:${NCNAME})?`

// Disable the eslint rule because the regex is initionally matching only one code point in a
// grapheme pair.
// eslint-disable-next-line no-misleading-character-class
const NAME_REGEX = new RegExp(`^${NAME}$`, 'u')
const NCNAME_REGEX = new RegExp(`^${NCNAME}$`, 'u')
const QNAME_REGEX = new RegExp(`^${QNAME}$`, 'u')

const isXmlName = (name: string): boolean => NAME_REGEX.test(name)

const isXmlNcName = (name: string): boolean => NCNAME_REGEX.test(name)

const isXmlQName = (name: string): boolean => QNAME_REGEX.test(name)

export {
  isXmlName,
  isXmlNcName,
  isXmlQName,
}
