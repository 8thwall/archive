const getAllMatches = (text: string, pattern: RegExp): RegExpExecArray[] => {
  const res = [] as RegExpExecArray[]

  let match: RegExpExecArray | null
  do {
    match = pattern.exec(text)
    if (match) {
      res.push(match)
    }
  } while (match)

  return res
}

export {
  getAllMatches,
}
