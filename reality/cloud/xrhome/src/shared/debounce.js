module.exports = {
  debounce: (callback, duration) => {
    let debounceTimer = null
    return (...args) => {
      clearTimeout(debounceTimer)
      debounceTimer = setTimeout(() => callback(...args), duration)
    }
  },
}
