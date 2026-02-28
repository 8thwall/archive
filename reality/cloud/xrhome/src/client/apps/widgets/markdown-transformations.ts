type TextArea = HTMLTextAreaElement

// Returns true if the text immediately before the position matches the input
const hasMatchBeforePosition = (str: string, position: number, match: string) => {
  const before = str.substring(position - match.length, position)
  return before === match
}

// Returns true if the text immediately after the position matches the input
const hasMatchAfterPosition = (str: string, position: number, match: string) => {
  const after = str.substring(position, position + match.length)
  return after === match
}

// After a setRangeText, the position of the cursor can move if the replaced text changes the length
// of the text or if it overlaps the current selection.
const getNewStartPosition = (
  prevStart: number, rangeStart: number, rangeEnd: number, lengthChange: number
) => {
// Entire range is after, no change
  if (rangeStart > prevStart) {
    return prevStart
  }

  // Entire range before, just adjust by length change
  if (prevStart > rangeEnd) {
    return prevStart + lengthChange
  }

  // Range overlaps, exclude new part
  return rangeEnd + lengthChange
}

const getNewEndPosition = (
  prevEnd: number, rangeStart: number, rangeEnd: number, lengthChange: number
) => {
  // Entire range is after, no change
  if (rangeStart > prevEnd) {
    return prevEnd
  }

  // Entire range before, just adjust by length change
  if (prevEnd > rangeEnd) {
    return prevEnd + lengthChange
  }

  // Range overlaps, exclude new part
  return rangeStart
}

// The default setRangeText is not good to use as it resets the undo stack.
const setRangeText = (el: TextArea, text: string, start: number, end: number) => {
  const prevStart = el.selectionStart
  const prevEnd = el.selectionEnd

  el.selectionStart = start
  el.selectionEnd = end

  const didSucceed = document.execCommand('insertText', false, text)

  // This is a Firefox-specific fix, looks like a future Firefox release will support insertText,
  // but this was required to get it working for Firefox 88.0.1.
  if (!didSucceed) {
    el.value = el.value.substring(0, start) + text + el.value.substring(end)
  }

  // If we replace 5 characters with 15 characters, the length change is 10.
  // If we replace 7 characters with 0, the length change is negative 7.
  const lengthChange = text.length - (end - start)

  el.selectionStart = getNewStartPosition(prevStart, start, end, lengthChange)
  el.selectionEnd = getNewEndPosition(prevEnd, start, end, lengthChange)
}

const toggleDelimiter = (el: TextArea, delimiter: string) => {
  const {value: currentValue, selectionStart, selectionEnd} = el

  const isBoundedByDelimiter = hasMatchBeforePosition(currentValue, selectionStart, delimiter) &&
                               hasMatchAfterPosition(currentValue, selectionEnd, delimiter)

  if (isBoundedByDelimiter) {
    // Remove delimiter
    setRangeText(el, '', selectionStart - delimiter.length, selectionStart)
    setRangeText(el, '', selectionEnd - delimiter.length, selectionEnd)
  } else {
    // Add delimiter
    setRangeText(el, delimiter, selectionStart, selectionStart)
    setRangeText(el, delimiter, selectionEnd + delimiter.length, selectionEnd + delimiter.length)
    el.setSelectionRange(selectionStart + delimiter.length, selectionEnd + delimiter.length)
  }
}

const findIndexBefore = (str: string, position: number, char: string) => {
  const start = Math.min(str.length - 1, position - 1)
  for (let i = start; i >= 0; i--) {
    if (str[i] === char) {
      return i
    }
  }
  return -1
}

const findIndexAfter = (str: string, position: number, char: string) => {
  const start = Math.max(0, position)
  for (let i = start; i < str.length; i++) {
    if (str[i] === char) {
      return i
    }
  }
  return str.length
}

const toggleList = (
  el: TextArea, prefixMatcher: RegExp, prefixGenerator: (index: number) => string
) => {
  const {value, selectionStart, selectionEnd} = el

  const firstLineDivider = findIndexBefore(value, selectionStart, '\n')
  const lastLineDivider = findIndexAfter(value, selectionEnd, '\n')

  type LineInfo = {
    start: number
    hasPrefix: boolean
    prefixStart?: number
    prefixEnd?: number
  }

  let currentLineDivider = firstLineDivider

  const lines: LineInfo[] = []

  let reps = 0
  do {
    const divider = currentLineDivider
    const nextDivider = findIndexAfter(value, currentLineDivider + 1, '\n')

    const line = value.substring(divider + 1, nextDivider)

    const prefixMatch = line.match(prefixMatcher)

    const info: LineInfo = {
      start: divider + 1,
      hasPrefix: !!prefixMatch,
    }

    if (prefixMatch) {
      info.prefixStart = divider + 1
      info.prefixEnd = info.prefixStart + prefixMatch[0].length
    }

    lines.push(info)

    currentLineDivider = nextDivider
    reps++
  } while (currentLineDivider < lastLineDivider && reps < 50)

  // Apply mutations in reverse order so the indices are stable
  const reversedLines = lines.slice(0).reverse()
  if (lines.every(l => l.hasPrefix)) {
    reversedLines.forEach((line) => {
      setRangeText(el, '', line.prefixStart, line.prefixEnd)
    })
  } else {
    reversedLines.forEach((line, i) => {
      setRangeText(el, prefixGenerator(lines.length - i), line.start, line.start)
    })
  }
}

const toggleHeading = (el: TextArea) => {
  const {value, selectionStart} = el

  const lineStart = findIndexBefore(value, selectionStart, '\n') + 1
  const lineEnd = findIndexAfter(value, selectionStart, '\n')

  const line = value.substring(lineStart, lineEnd)

  const headerMatch = line.match(/^#+ /)

  if (headerMatch) {
    setRangeText(el, '', lineStart, lineStart + headerMatch[0].length)
  } else {
    setRangeText(el, '# ', lineStart, lineStart)
  }
}

const toggleBold = (el: TextArea) => toggleDelimiter(el, '**')
const toggleItalic = (el: TextArea) => toggleDelimiter(el, '*')

const toggleNumberedList = (el: TextArea) => (
  toggleList(el, /^\d+\. /, (index: number) => `${index}. `)
)

const toggleBulletedList = (el: TextArea) => (
  toggleList(el, /^[*-] /, () => '- ')
)

const addLink = (el: TextArea) => {
  const {selectionStart, selectionEnd} = el
  const selectedText = el.value.substring(selectionStart, selectionEnd)

  const linkMarkdown = `[${selectedText}](url)`
  setRangeText(el, linkMarkdown, selectionStart, selectionEnd)
  // Select/highlight the URL portion
  const urlStart = selectionStart + selectedText.length + 3  // Offset to skip '[selectedText]('
  const urlEnd = urlStart + 3  // Assuming a placeholder URL length of 3 characters
  el.setSelectionRange(urlStart, urlEnd)
}

// When you are on a line of a list, pressing enter should continue the list.
// Returns true it it applied a transformation.
const applyNewlineContinuation = (el: TextArea) => {
  const {value, selectionStart, selectionEnd} = el

  if (selectionStart !== selectionEnd) {
    return false
  }

  const currentLineStart = findIndexBefore(value, selectionStart, '\n') + 1
  const currentLine = value.substring(currentLineStart, selectionEnd)

  const bulletMatch = currentLine.match(/^(\s*(?:\*|-) )/)

  if (bulletMatch) {
    const matchedPortion = bulletMatch[1]
    if (matchedPortion.length === currentLine.length) {
      setRangeText(el, '\n', currentLineStart, selectionStart)
      return true
    }

    const replacementText = `\n${matchedPortion}`
    setRangeText(el, replacementText, selectionStart, selectionStart)
    el.selectionStart += replacementText.length
    return true
  }

  const numberedMatch = currentLine.match(/^((\s*)(\d+)(\. ))/)

  if (numberedMatch) {
    const [, matchedPortion, whitespace, digit, dot] = numberedMatch
    if (matchedPortion.length === currentLine.length) {
      setRangeText(el, '\n', currentLineStart, selectionStart)
      return true
    }
    const nextNumber = Number(digit) + 1
    const replacementText = `\n${whitespace}${nextNumber}${dot}`
    setRangeText(el, replacementText, selectionStart, selectionStart)
    el.selectionStart += replacementText.length
    return true
  }

  return false
}

export {
  toggleHeading,
  toggleBold,
  toggleItalic,
  toggleNumberedList,
  toggleBulletedList,
  applyNewlineContinuation,
  addLink,
}
