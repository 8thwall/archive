type Options = {
  max?: number
  min?: number
  regex?: RegExp
}

const validateString = (value: any, options: Options): value is string => {
  if (typeof value !== 'string') {
    return false
  }

  if (options.max !== undefined && value.length > options.max) {
    return false
  }
  if (options.min !== undefined && value.length < options.min) {
    return false
  }

  if (options.regex && !options.regex.test(value)) {
    return false
  }

  return true
}

export {
  validateString,
}
