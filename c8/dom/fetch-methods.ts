// @sublibrary(:dom-core-lib)
/* eslint-disable no-continue, no-constant-condition */

import {type PositionVariable, collectCodePointSequence} from './infra'
import type {MimeType} from './mime-type'
import type {Encoding} from './encoding'

// Several of the below algorithms can be customized with a perform the fetch
// hook algorithm, which takes a request, a boolean isTopLevel, and a
// processCustomFetchResponse algorithm. It runs processCustomFetchResponse with
// a response and either null (on failure) or a byte sequence containing the
// response body. isTopLevel will be true for all classic script fetches, and
// for the initial fetch when fetching an external module script graph or
// fetching a module worker script graph, but false for the fetches resulting
// from import statements encountered throughout the graph or from import()
// expressions.
//
// https://html.spec.whatwg.org/multipage/webappapis.html#fetching-scripts-perform-fetch
type PerformFetchHook = (
  request: Request,
  isTopLevel: boolean,
  processCustomFetchResponse: (
    response: Response,
    bodyBytes: ArrayBuffer | null
  ) => void
) => void

// To collect an HTTP quoted string from a string input, given a position variable position and an
// optional boolean extract-value (default false):
// See: https://fetch.spec.whatwg.org/#collect-an-http-quoted-string
const collectHttpQuotedString = (
  input: string,
  position: PositionVariable,
  extractValue: boolean = false
): string => {
  // 1. Let positionStart be position.
  const positionStart = position.idx

  // 2. Let value be the empty string.
  let value = ''

  // 3. Assert: the code point at position within input is U+0022 (").
  if (input[position.idx] !== '"') {
    throw new Error('Expected U+0022 (")')
  }

  // 4. Advance position by 1.
  position.idx++

  // 5. While true:
  while (true) {
    // 1. Append the result of collecting a sequence of code points that are not U+0022 (") or
    // U+005C (\) from input, given position, to value.
    value += collectCodePointSequence(
      input, position, codePoint => codePoint !== '"' && codePoint !== '\\'
    )

    // 2. If position is past the end of input, then break.
    if (position.idx >= input.length) {
      break
    }

    // 3. Let quoteOrBackslash be the code point at position within input.
    const quoteOrBackslash = input[position.idx]

    // 4. Advance position by 1.
    position.idx++

    // 5. If quoteOrBackslash is U+005C (\), then:
    if (quoteOrBackslash === '\\') {
      // 1. If position is past the end of input, then append U+005C (\) to value and break.
      if (position.idx >= input.length) {
        value += '\\'
        break
      }

      // 2. Append the code point at position within input to value.
      value += input[position.idx]

      // 3. Advance position by 1.
      position.idx++
    } else {  // 6. Otherwise:
      // 1. Assert: quoteOrBackslash is U+0022 (").
      if (quoteOrBackslash !== '"') {
        throw new Error('Expected U+0022 (")')
      }

      // 2. Break.
      break
    }
  }

  // 6. If extract-value is true, then return value.
  if (extractValue) {
    return value
  }

  // 7. Return the code points from positionStart to position, inclusive, within input.
  return input.slice(positionStart, position.idx + 1)
}

// See: https://fetch.spec.whatwg.org/#header-value-get-decode-and-split
const getDecodeAndSplitHeaderValue = (value: string): string[] => {
  // 1. Let input be the result of isomorphic decoding value.
  const input = value

  // 2. Let position be a position variable for input, initially pointing at the start of input.
  const position: PositionVariable = {idx: 0}

  // 3. Let values be a list of strings, initially empty.
  const values = []

  // 4. Let temporaryValue be the empty string.
  let temporaryValue = ''

  // 5. While position is not past the end of input:
  while (position.idx < input.length) {
    // 1. Append the result of collecting a sequence of code points that are not U+0022 (") or
    // U+002C (,) from input, given position, to temporaryValue.
    // Note: The result might be the empty string.
    temporaryValue += collectCodePointSequence(
      input, position, codePoint => codePoint !== '"' && codePoint !== ','
    )

    // 2. If position is not past the end of input, then:
    if (position.idx < input.length) {
      // 1. If the code point at position within input is U+0022 ("), then:
      if (input[position.idx] === '"') {
        // 1. Append the result of collecting an HTTP quoted string from input, given position, to
        // temporaryValue.
        temporaryValue += collectHttpQuotedString(input, position)

        // 2. If position is not past the end of input, then continue.
        if (position.idx < input.length) {
          continue
        }
      } else {  // 2. Otherwise:
        // 1. Assert: the code point at position within input is U+002C (,).
        if (input[position.idx] !== ',') {
          throw new Error('Expected U+002C (,)')
        }

        // 2. Advance position by 1.
        position.idx++
      }
    }

    // 3. Remove all HTTP tab or space from the start and end of temporaryValue.
    temporaryValue.replace(/^[\t ]+|[\t ]+$/g, '')

    // 4. Append temporaryValue to values.
    values.push(temporaryValue)

    // 5. Set temporaryValue to the empty string.
    temporaryValue = ''
  }

  // 6. Return values.
  return values
}

// To get, decode, and split a header name name from header list list, run these steps. They return
// null or a list of strings.
// See: https://fetch.spec.whatwg.org/#concept-header-list-get-decode-split
const getDecodeAndSplitHeaderName = (list: Headers, name: string): string[] | null => {
  // 1. Let value be the result of getting name from list.
  const value = list.get(name)

  // 2. If value is null, then return null.
  if (value === null) {
    return null
  }

  // 3. Return the result of getting, decoding, and splitting value.
  return getDecodeAndSplitHeaderValue(value)
}

// See: https://fetch.spec.whatwg.org/#legacy-extract-an-encoding
const legacyExtractEncoding = (mimeType: MimeType | null, fallbackEncoding: Encoding): Encoding => {
  // 1. If mimeType is failure, then return fallbackEncoding.
  if (mimeType === null) {
    return fallbackEncoding
  }

  // 2. If mimeType["charset"] does not exist, then return fallbackEncoding.
  if (!mimeType.parameters.has('charset')) {
    return fallbackEncoding
  }

  // 3. Let tentativeEncoding be the result of getting an encoding from mimeType["charset"].
  const tentativeEncoding = mimeType.parameters.get('charset')!

  // 4. If tentativeEncoding is failure, then return fallbackEncoding.
  if (tentativeEncoding === null) {
    return fallbackEncoding
  }

  // 5. Return tentativeEncoding.
  return tentativeEncoding as Encoding
}

// To extract header values given a header header, run these steps:
// 1. If parsing header’s value, per the ABNF for header’s name, fails, then
// return failure.
// [NOT IMPLEMENTED]
// 2. Return one or more values resulting from parsing header’s value, per the
// ABNF for header’s name.
const extractHeaderValues = (
  name: string,
  value: string
): string[] | null => getDecodeAndSplitHeaderValue(value)

// To extract header list values given a header name name and a header list
// list, run these steps:
// See: https://fetch.spec.whatwg.org/#extract-header-list-values
const extractHeaderListValues = (name: string, list: Headers): string[] | null => {
  // 1. If list does not contain name, then return null.
  if (!list.has(name)) {
    return null
  }

  // 2. If the ABNF for name allows a single header and list contains more than
  // one, then return failure.
  // Note: If different error handling is needed, extract the desired header first.
  // [NOT IMPLEMENTED]

  // 3. Let values be an empty list.
  const values: string[] = []

  // 4. For each header header list contains whose name is name:
  for (const [key, value] of list.entries()) {
    if (key === name) {
      // 1. Let extract be the result of extracting header values from header.
      const extract = extractHeaderValues(name, value)

      // 2. If extract is failure, then return failure.
      if (extract === null) {
        return null
      }

      // 3. Append each value in extract, in order, to values.
      values.push(...extract)
    }
  }

  // 5. Return values.
  return values
}

export {
  PerformFetchHook,
  collectHttpQuotedString,
  getDecodeAndSplitHeaderName,
  legacyExtractEncoding,
  extractHeaderListValues,
}
