// @sublibrary(:dom-core-lib)
// ASCII whitespace is U+0009 TAB, U+000A LF, U+000C FF, U+000D CR, or U+0020 SPACE.
const ASCII_WHITESPACE_CHARS = '\t\n\f\r '
const ASCII_WHITESPACE = new RegExp(`[${ASCII_WHITESPACE_CHARS}]+`)

// The ordered set parser takes a string input and then runs these steps:
// See: https://dom.spec.whatwg.org/#ordered-sets
const orderedSetParser = (input: string): Set<string> => {
  // 1. Let inputTokens be the result of splitting input on ASCII whitespace.
  const inputTokens = input.split(ASCII_WHITESPACE).filter(token => token !== '')

  // 2. Let tokens be a new ordered set.
  const tokens = new Set<string>()

  // 3. For each token in inputTokens, append token to tokens.
  inputTokens.forEach(token => tokens.add(token))

  // 4. Return tokens.
  return tokens
}

// The ordered set serializer takes a set and returns the concatenation of set using U+0020 SPACE.
const orderedSetSerializer = (set: Set<string>): string => [...set].join(' ')

// To append to an ordered set: if the set contains the given item, then do nothing; otherwise,
// perform the normal list append operation.
// See: https://infra.spec.whatwg.org/#set-append
const appendToOrderedSet = (set: Set<string>, item: string): void => {
  set.add(item)
}

// To prepend to an ordered set: if the set contains the given item, then do nothing; otherwise,
// perform the normal list prepend operation.
// See: https://infra.spec.whatwg.org/#set-prepend
const prependToOrderedSet = (set: Set<string>, item: string): void => {
  if (set.has(item)) {
    return
  }
  const list = [item, ...set]
  set.clear()
  list.forEach(token => set.add(token))
}

// To replace within an ordered set set, given item and replacement: if set contains item or
// replacement, then replace the first instance of either with replacement and remove all other
// instances.
// See: https://infra.spec.whatwg.org/#set-replace
const replaceWithinOrderedSet = (set: Set<string>, item: string, replacement: string): void => {
  if (set.has(item) || set.has(replacement)) {
    let list = [...set]
    const insertPoint = Math.min(list.indexOf(item), list.indexOf(replacement))
    list = list.filter(token => token !== item && token !== replacement)
    list.splice(insertPoint, 0, replacement)
    set.clear()
    list.forEach(token => set.add(token))
  }
}

export {
  ASCII_WHITESPACE,
  orderedSetParser,
  orderedSetSerializer,
  appendToOrderedSet,
  prependToOrderedSet,
  replaceWithinOrderedSet,
}
