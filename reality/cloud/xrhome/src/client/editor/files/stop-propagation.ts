const stopPropagation = handler => (e) => {
  e.stopPropagation()
  handler(e)
}

export {stopPropagation}
