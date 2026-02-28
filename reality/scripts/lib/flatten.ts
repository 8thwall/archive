type FlattenedEntry = {key: string, value: string | number | boolean | null}

const combineKey = (prefix: string, key: string) => (prefix ? `${prefix}.${key}` : key)

const flattenValue = (value: any, key = '', flattened: FlattenedEntry[]) => {
  if (value === undefined) {
    // Ignore
  } else if (value === null || ['string', 'number', 'boolean'].includes(typeof value)) {
    flattened.push({key, value})
  } else if (Array.isArray(value)) {
    flattened.push({key: combineKey(key, 'length'), value: value.length})
    value.forEach((v) => {
      flattenValue(v, combineKey(key, '#'), flattened)
    })
  } else {
    Object.keys(value).sort().forEach((subKey) => {
      flattenValue(value[subKey], combineKey(key, subKey), flattened)
    })
  }
}

const flattenObject = (value: {}) => {
  const flattened: FlattenedEntry[] = []
  flattenValue(value, '', flattened)
  return flattened
}

export {
  flattenObject,
}
