const middleware = () => next => (action) => {
  if (action.type === 'ERROR' && action.msg === 'jwt expired') {
    // Need to refresh the JWT
    window.location.reload()
    return
  }
  next(action)
}

export default middleware
