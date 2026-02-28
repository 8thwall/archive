const getDistance = (pt1, pt2) => {
  const a = pt1.x - pt2.x
  const b = pt1.y - pt2.y
  return (Math.sqrt((a * a) + (b * b)))
}

const getTouchCount = evt => (evt.changedTouches ? evt.changedTouches.length : 1)

export default class Controls {
  constructor(domElement, object) {
    this.moved = false
    this.domElement = domElement
    this.object = object
    this.touches = {}
    domElement.addEventListener('touchstart', this._onTouchDown.bind(this))
    domElement.addEventListener('touchmove', this._onTouchMove.bind(this))
    domElement.addEventListener('touchend', this._onTouchUp.bind(this))
    domElement.addEventListener('touchcancel', this._onTouchUp.bind(this))
    domElement.addEventListener('touchleave', this._onTouchUp.bind(this))
  }

  _getPointer(touch) {
    const rect = this.domElement.getBoundingClientRect()
    return {
      x: ((touch.clientX - rect.left) / rect.width) * 2 - 1,
      y: -((touch.clientY - rect.top) / rect.height) * 2 + 1,
    }
  }

  _getTouches(evt) {
    const touches = {}
    const nTouches = getTouchCount(evt)
    for (let i = 0; i < nTouches; i++) {
      const touch = evt.changedTouches ? evt.changedTouches[i] : evt
      touches[i] = this._getPointer(touch)
    }
    return touches
  }

  _onTouchDown(evt) {
    this.touches = this._getTouches(evt)
  }

  _onTouchMove(evt) {
    const nTouches = getTouchCount(evt)
    const touches = this._getTouches(evt)
    if (nTouches === 1 && touches[0] !== undefined && this.touches[0] !== undefined) {
      // 1 finger rotate
      this.moved = true
      const delta = touches[0].x - this.touches[0].x
      this.object.rotateY(delta * 2)
    } else if (nTouches === 2) {
      // touchstart won't fire with multiple fingers.
      if (Object.keys(this.touches).length < 2) this.touches = touches
      // 2 finger scale
      this.moved = true
      const prevDistance = getDistance(this.touches[0], this.touches[1])
      const currDistance = getDistance(touches[0], touches[1])
      const scale = currDistance / prevDistance
      const currentScale = this.object.scale.x
      const newScale = scale * currentScale
      this.object.scale.set(newScale, newScale, newScale)
    }
    this.touches = touches
  }

  _onTouchUp(evt) {
    if (this.moved === false) {
      const selectEvent = new Event('select')
      selectEvent.position = this.touches[0]
      this.domElement.dispatchEvent(selectEvent)
    }
    this.touches = {}
    this.moved = false
  }
}
