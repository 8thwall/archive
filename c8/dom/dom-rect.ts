// @sublibrary(:dom-core-lib)
class DOMRect {
  constructor(x: number, y: number, width: number, height: number) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.left = x
    this.right = x + width
    this.top = y
    this.bottom = y + height
  }

  x: number

  y: number

  width: number

  height: number

  left: number

  right: number

  top: number

  bottom: number
}

export {DOMRect}
