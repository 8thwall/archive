const localStorageGetItem = (key, defaultValue = null) => {
  try {
    return localStorage.getItem(key) || defaultValue
  } catch (e) {
    return defaultValue
  }
}

const localStorageSetItem = (key, value) => {
  try {
    localStorage.setItem(key, value)
  } catch (e) {
    // Ignore
  }
}

const localStorageRemoveItem = (key) => {
  try {
    localStorage.removeItem(key)
  } catch (e) {
    // No-op.
  }
}

module.exports = {
  localStorageSetItem,
  localStorageGetItem,
  localStorageRemoveItem,
}
