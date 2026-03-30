class ImageData {
  width: number

  height: number

  data: Uint8ClampedArray

  constructor(
    dataOrWidth: number | Iterable<number>,
    widthOrHeight: number,
    maybeHeight?: number
  ) {
    if (typeof dataOrWidth === 'number') {
      this.width = dataOrWidth
      this.height = widthOrHeight
      this.data = new Uint8ClampedArray(this.width * this.height * 4)
    } else {
      this.data = Uint8ClampedArray.from(dataOrWidth)
      this.width = widthOrHeight
      this.height = maybeHeight || (this.data.length / this.width / 4)
    }
  }
}

export {
  ImageData,
}
