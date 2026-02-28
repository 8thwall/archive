const scriptify = (src: string) => `<script crossorigin="anonymous" src="${src}"></script>`

const escapeHtml = (text: string) => {
  const regExp = /["'&<>]/
  if (!regExp.test(text)) {
    return text
  }

  let html = ''
  let prevIndex = 0
  Array.from(text).forEach((char, i) => {
    let escapedChar
    switch (char) {
      case '"':
        escapedChar = '&quot;'
        break
      case '&':
        escapedChar = '&amp;'
        break
      case '\'':
        escapedChar = '&#39;'
        break
      case '<':
        escapedChar = '&lt;'
        break
      case '>':
        escapedChar = '&gt;'
        break
      default:
        return  // Continue to the next iteration of the forEach.
    }

    html = html + text.slice(prevIndex, i) + escapedChar
    prevIndex = i + 1
  })

  return prevIndex < text.length ? html + text.slice(prevIndex) : html
}

export {
  escapeHtml,
  scriptify,
}
