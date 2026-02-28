class ImageTypeError extends Error {
  type: string

  constructor(message, type) {
    super(message)
    this.name = 'ImageTypeError'
    this.type = type
  }
}

export {ImageTypeError}
