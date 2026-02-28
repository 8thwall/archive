// @sublibrary(:dom-core-lib)
import {type PositionVariable, collectCodePointSequence} from './infra'
import {
  collectHttpQuotedString,
  getDecodeAndSplitHeaderName,
} from './fetch-methods'

// An HTTP token code point is U+0021 (!), U+0023 (#), U+0024 ($), U+0025 (%), U+0026 (&), U+0027
// ('), U+002A (*), U+002B (+), U+002D (-), U+002E (.), U+005E (^), U+005F (_), U+0060 (`), U+007C
// (|), U+007E (~), or an ASCII alphanumeric.  See:
// https://mimesniff.spec.whatwg.org/#http-token-code-point
const HTTP_TOKEN_CODE_POINTS = '[!#$%&\'*+-.^_`|~0-9A-Za-z]'

// An HTTP quoted-string token code point is U+0009 TAB, a code point in the range U+0020 SPACE to
// U+007E (~), inclusive, or a code point in the range
// U+0080 through U+00FF (ÿ), inclusive.
const HTTP_QUOTED_STRING_TOKEN_CODE_POINTS = '[\t\u0020-\u007E\u0080-\u00FF]'

// HTTP whitespace is U+000A LF, U+000D CR, or an HTTP tab or space.
const HTTP_WHITESPACE = '[\t\n\r ]'

const removeTrailingHttpWhitespace = (input: string): string => {
  const regex = new RegExp(`${HTTP_WHITESPACE}+$`, 'g')
  return input.replace(regex, '')
}

const removeLeadingAndTrailingHttpWhitespace = (input: string): string => {
  const regex = new RegExp(`^${HTTP_WHITESPACE}+|${HTTP_WHITESPACE}+$`, 'g')
  return input.replace(regex, '')
}

const solelyContainsHttpTokenCodePoints = (
  input: string
): boolean => new RegExp(`^${HTTP_TOKEN_CODE_POINTS}+$`).test(input)

const solelyContainsHttpQuotedStringTokenCodePoints = (
  input: string
): boolean => new RegExp(`^${HTTP_QUOTED_STRING_TOKEN_CODE_POINTS}+$`).test(input)

const isHttpWhitespace = (
  codePoint: string
): boolean => new RegExp(`^${HTTP_WHITESPACE}$`).test(codePoint)

// See: https://mimesniff.spec.whatwg.org/#mime-type
interface MimeType {
  type: Exclude<string, ''>
  subtype: Exclude<string, ''>
  parameters: Map<string, string>
}

// The essence of a MIME type mimeType is mimeType’s type, followed by U+002F (/), followed by
// mimeType’s subtype.
const mimeTypeEssence = (mimeType: MimeType): string => `${mimeType.type}/${mimeType.subtype}`

// To parse a MIME type, given a string input, run these steps:
// See: https://mimesniff.spec.whatwg.org/#parse-a-mime-type
const parseMimeType = (inputStr: string): MimeType | null => {
  // 1. Remove any leading and trailing HTTP whitespace from input.
  const input = removeLeadingAndTrailingHttpWhitespace(inputStr)

  // 2. Let position be a position variable for input, initially pointing at the start of input.
  const position: PositionVariable = {idx: 0}

  // 3. Let type be the result of collecting a sequence of code points that are not U+002F (/) from
  // input, given position.
  const type = collectCodePointSequence(
    input, position, codePoint => codePoint !== '/'
  )

  // 4. If type is the empty string or does not solely contain HTTP token code points, then return
  // failure.
  if (type === '' || !solelyContainsHttpTokenCodePoints(type)) {
    return null
  }

  // 5. If position is past the end of input, then return failure.
  if (position.idx >= input.length) {
    return null
  }

  // 6. Advance position by 1. (This skips past U+002F (/).)
  position.idx++

  // 7. Let subtype be the result of collecting a sequence of code points that are not U+003B (;)
  // from input, given position.
  let subtype = collectCodePointSequence(
    input, position, codePoint => codePoint !== ';'
  )

  // 8. Remove any trailing HTTP whitespace from subtype.
  subtype = removeTrailingHttpWhitespace(subtype)

  // 9. If subtype is the empty string or does not solely contain HTTP token code points, then
  // return failure.
  if (subtype === '' || !solelyContainsHttpTokenCodePoints(subtype)) {
    return null
  }

  // 10. Let mimeType be a new MIME type record whose type is type, in ASCII lowercase, and subtype
  // is subtype, in ASCII lowercase.
  const mimeType = {
    type: type.toLowerCase(),
    subtype: subtype.toLowerCase(),
    parameters: new Map<string, string>(),
  }

  // 11. While position is not past the end of input:
  while (position.idx < input.length) {
    // 1. Advance position by 1. (This skips past U+003B (;).)
    position.idx++

    // 2. Collect a sequence of code points that are HTTP whitespace from input given position.
    // Note: This is roughly equivalent to skip ASCII whitespace, except that HTTP whitespace is
    // used rather than ASCII whitespace.
    collectCodePointSequence(
      input, position, codePoint => isHttpWhitespace(codePoint)
    )

    // 3. Let parameterName be the result of collecting a sequence of code points that are not
    // U+003B (;) or U+003D (=) from input, given position.
    let parameterName = collectCodePointSequence(
      input, position, codePoint => codePoint !== ';' && codePoint !== '='
    )

    // 4. Set parameterName to parameterName, in ASCII lowercase.
    parameterName = parameterName.toLowerCase()

    // 5. If position is not past the end of input, then:
    if (position.idx < input.length) {
      // 1. If the code point at position within input is U+003B (;), then continue.
      if (input[position.idx] === ';') {
        continue  // eslint-disable-line no-continue
      }

      // 2. Advance position by 1. (This skips past U+003D (=).)
      position.idx++
    }

    // 6. If position is past the end of input, then break.
    if (position.idx >= input.length) {
      break
    }

    // 7. Let parameterValue be null.
    let parameterValue = null

    // 8. If the code point at position within input is U+0022 ("), then:
    if (input[position.idx] === '"') {
      // 1. Set parameterValue to the result of collecting an HTTP quoted string from input, given
      // position and true.
      parameterValue = collectHttpQuotedString(input, position, true)

      // 2. Collect a sequence of code points that are not U+003B (;) from input, given position.
      // Example: Given text/html;charset="shift_jis"iso-2022-jp you end up with
      // text/html;charset=shift_jis.
      collectCodePointSequence(input, position, codePoint => codePoint !== ';')
    } else {  // 9. Otherwise:
      // 1. Set parameterValue to the result of collecting a sequence of code points that are not
      // U+003B (;) from input, given position.
      parameterValue = collectCodePointSequence(
        input, position, codePoint => codePoint !== ';'
      )

      // 2. Remove any trailing HTTP whitespace from parameterValue.
      parameterValue = removeTrailingHttpWhitespace(parameterValue)

      // 3. If parameterValue is the empty string, then continue.
      if (parameterValue === '') {
        continue  // eslint-disable-line no-continue
      }
    }
    // 10. If all of the following are true
    if (
      //   * parameterName is not the empty string
      parameterName !== '' &&
      //   * parameterName solely contains HTTP token code points
      solelyContainsHttpTokenCodePoints(parameterName) &&
      //   * parameterValue solely contains HTTP quoted-string token code points
      solelyContainsHttpQuotedStringTokenCodePoints(parameterValue) &&
      //   * mimeType’s parameters[parameterName] does not exist
      !mimeType.parameters.has(parameterName)
    ) {
      // then set mimeType’s parameters[parameterName] to parameterValue.
      mimeType.parameters.set(parameterName, parameterValue)
    }
  }
  // 12. Return mimeType.
  return mimeType
}

// To extract a MIME type from a header list headers, run these steps. They return failure or a MIME
// type.
// See: https://fetch.spec.whatwg.org/#concept-header-extract-mime-type
const extractMimeType = (headers: Headers): MimeType | null => {
  // 1. Let charset be null.
  let charset: string | null = null

  // 2. Let essence be null.
  let essence: string | null = null

  // 3. Let mimeType be null.
  let mimeType: MimeType | null = null

  // 4. Let values be the result of getting, decoding, and splitting `Content-Type` from headers.
  const values = getDecodeAndSplitHeaderName(headers, 'Content-Type')

  // 5. If values is null, then return failure.
  if (values === null) {
    return null
  }

  // 6. For each value of values:
  values.forEach((value) => {
    // 1. Let temporaryMimeType be the result of parsing value.
    const temporaryMimeType = parseMimeType(value)

    // 2. If temporaryMimeType is failure or its essence is "*/*", then continue.
    if (temporaryMimeType === null || mimeTypeEssence(temporaryMimeType) === '*/*') {
      return
    }

    // 3. Set mimeType to temporaryMimeType.
    mimeType = temporaryMimeType as MimeType

    // 4. If mimeType’s essence is not essence, then:
    if (mimeTypeEssence(mimeType) !== essence) {
      // 1. Set charset to null.
      charset = null

      // 2. If mimeType’s parameters["charset"] exists, then set charset to mimeType’s
      // parameters["charset"].
      if (mimeType.parameters.has('charset')) {
        charset = mimeType.parameters.get('charset')!
      }

      // 3. Set essence to mimeType’s essence.
      essence = mimeTypeEssence(mimeType)
    } else if (!mimeType.parameters.has('charset') && charset !== null) {
    // 5. Otherwise, if mimeType’s parameters["charset"] does not exist, and charset is non-null,
    // set mimeType’s parameters["charset"] to charset.
      mimeType.parameters.set('charset', charset)
    }
  })

  // 7. If mimeType is null, then return failure.
  if (mimeType === null) {
    return null
  }

  // 8. Return mimeType.
  return mimeType
}

// See https://mimesniff.spec.whatwg.org/#javascript-mime-type
// Valid JavaScript MIME types are:
//   application/ecmascript
//   application/javascript
//   application/x-ecmascript
//   application/x-javascript
//   text/ecmascript
//   text/javascript
//   text/javascript1.0
//   text/javascript1.1
//   text/javascript1.2
//   text/javascript1.3
//   text/javascript1.4
//   text/javascript1.5
//   text/jscript
//   text/livescript
//   text/x-ecmascript
//   text/x-javascript
// So a regex to match these would be:
const jsMimeTypeEssenceMatchRegex =
  // eslint-disable-next-line max-len
  /^(application\/(x-(ecmascript|javascript)|ecmascript|javascript)|text\/(x-(ecmascript|javascript)|ecmascript|javascript(1\.[0-5])?|jscript|livescript))$/i

// A JSON MIME type is any MIME type whose subtype ends in "+json" or whose essence is
// "application/json" or "text/json".
const jsonMimeTypeEssenceMatchRegex = /^application\/json|text\/json|[^+]+json$/i

const isJavaScriptMimeType = (
  mimeType: MimeType
): boolean => !!mimeTypeEssence(mimeType).match(jsMimeTypeEssenceMatchRegex)

const isJsonMimeType = (
  mimeType: MimeType
): boolean => !!mimeTypeEssence(mimeType).match(jsonMimeTypeEssenceMatchRegex)

export {
  MimeType,
  mimeTypeEssence,
  jsMimeTypeEssenceMatchRegex,
  parseMimeType,
  extractMimeType,
  isJavaScriptMimeType,
  isJsonMimeType,
}
