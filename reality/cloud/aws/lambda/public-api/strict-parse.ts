// parseFloat('234.5 some text') -> 234.5, which we don't accept
const strictParseFloat = (str) => {
  if (typeof str !== 'string' || str.length === 0) {
    throw new Error('Input is not a nonzero-length string')
  }
  const n = Number(str)
  if (Number.isNaN(n)) {
    throw new Error('Parsed to non-number')
  }
  return n
}

// parseInt('234.5 some text', 10) -> 234, which we don't accept
const strictParseInt = (str) => {
  const n = strictParseFloat(str)
  if (n % 1 !== 0) {
    throw new Error('Parsed to number with decimal')
  }
  return n
}

export {
  strictParseFloat,
  strictParseInt,
}
