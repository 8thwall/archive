// eslint-disable-next-line max-len
// https://gitlab.<REMOVED_BEFORE_OPEN_SOURCING>.com/campfire/identity-portal/-/blob/trunk/portal/src/utils/strings.ts#L37
const getMonogram = (name: string | null): string | null => {
  try {
    const match = name.match(/\p{L}/u)
    return (match && match[0])?.toUpperCase() || null
  } catch {
    return name?.[0]?.toUpperCase() || null
  }
}

export {
  getMonogram,
}
