// @sublibrary(:dom-core-lib)
// See: https://infra.spec.whatwg.org/#string-position-variable
interface PositionVariable {
  idx: number
}

// To collect a sequence of code points meeting a condition condition from a
// string input, given a position variable position tracking the position of the
// calling algorithm within input:
// See: https://infra.spec.whatwg.org/#collect-a-sequence-of-code-points
const collectCodePointSequence = (
  input: string, position: PositionVariable, condition: (codePoint: string) => boolean
): string => {
  // 1. Let result be the empty string.
  let result = ''

  // 2. While position doesn’t point past the end of input and the code point at
  // position within input meets the condition condition:
  while (position.idx < input.length && condition(input[position.idx])) {
    // 1. Append that code point to the end of result.
    result += input[position.idx]

    // 2. Advance position by 1.
    position.idx++
  }

  // 3. Return result.
  // Note: In addition to returning the collected code points, this algorithm
  // updates the position variable in the calling algorithm.
  return result
}

export {PositionVariable, collectCodePointSequence}
