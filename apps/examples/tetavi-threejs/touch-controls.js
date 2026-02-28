/* globals Tetavi */

export class TouchControl {
  constructor() {
    this.didPinch = false
    this.localScale = 1
    this.currentScale = 1
    this.startClientX = 0
    this.startClientY = 0
    this.startClientX2 = 0
    this.startClientY2 = 0
    this.startDiameter = 1
    this.lastClientX = 0
    this.charAngle = 0
    this.charPivot = null
    this.rotatePivot = null
    this.startTouchTime = 0
  }

  hasChar() {
    return this.charPivot != null
  }

  createChar(charModel) {
    const pivot = new Tetavi.THREE.Object3D()
    this.charPivot = new Tetavi.THREE.Object3D()
    this.rotatePivot = new Tetavi.THREE.Object3D()
    this.charPivot.add(pivot)
    pivot.add(this.rotatePivot)
    this.rotatePivot.add(charModel)
  }

  getChar() {
    return this.charPivot
  }

  onTouchStart(e) {
    if (e.touches.length === 1) {
      this.startTouchTime = performance.now()
      this.startClientX = e.touches[0].clientX
      this.startClientY = e.touches[0].clientY
      this.lastClientX = e.touches[0].clientX
    }
    if (e.touches.length === 2) {
      const X1 = e.touches[0].clientX
      const Y1 = e.touches[0].clientY
      const X2 = e.touches[1].clientX
      const Y2 = e.touches[1].clientY
      this.startDiameter = Math.sqrt((X1 - X2) * (X1 - X2) + (Y1 - Y2) * (Y1 - Y2))
      this.localScale = 1
      this.didPinch = true
    }
  }

  onTouchMove(e) {
    if (e.touches.length === 2) {
      const X1 = e.touches[0].clientX
      const Y1 = e.touches[0].clientY
      const X2 = e.touches[1].clientX
      const Y2 = e.touches[1].clientY
      const diameter = Math.sqrt((X1 - X2) * (X1 - X2) + (Y1 - Y2) * (Y1 - Y2))
      this.didPinch = true
      if (diameter > 0 && this.startDiameter > 0) {
        this.localScale = diameter / this.startDiameter
      }
    }
    if (e.touches.length !== 1) return
    if (this.didPinch) return
    this.charAngle += ((e.touches[0].clientX - this.lastClientX)) / 60.0
    this.lastClientX = e.touches[0].clientX
  }

  onTouchEnd(e) {
    this.currentScale *= this.localScale
    this.localScale = 1
    if (this.didPinch) {
      if (e.touches.length === 0) this.didPinch = false
      return false
    }
    const delta = performance.now() - this.startTouchTime
    if (delta > 400) return false

    return true
  }

  onAnimate() {
    if (this.rotatePivot != null) {
      this.rotatePivot.rotation.set(0, this.charAngle, 0)
      const s = this.localScale * this.currentScale
      this.rotatePivot.scale.set(s, s, s)
    }
  }

  getStartClientX() {
    return this.startClientX
  }

  getStartClientY() {
    return this.startClientY
  }
}
