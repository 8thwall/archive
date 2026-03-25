export class ValueEaseAndTween {
  static EaseInQuad(time, start, change, duration) {
    return change * (time /= duration) * time + start
  }

  static EaseLinear(time, start, change, duration) {
    return (change * time) / duration + start
  }

  static EaseOutQuad(time, start, change, duration) {
    return -change * (time /= duration) * (time - 2) + start
  }

  static EaseInOutQuad(time, start, change, duration) {
    return (time /= duration / 2) < 1
      ? (change / 2) * time * time + start
      : (-change / 2) * (--time * (time - 2) - 1) + start
  }

  static EaseInSine(time, start, change, duration) {
    return (
      -change * Math.cos((time / duration) * (Math.PI / 2)) + change + start
    )
  }

  static EaseOutSine(time, start, change, duration) {
    return change * Math.sin((time / duration) * (Math.PI / 2)) + start
  }

  static EaseInOutSine(time, start, change, duration) {
    return (-change / 2) * (Math.cos((Math.PI * time) / duration) - 1) + start
  }

  static EaseInExpo(time, start, change, duration) {
    return time == 0
      ? start
      : change * Math.pow(2, 10 * (time / duration - 1)) + start
  }

  static EaseOutExpo(time, start, change, duration) {
    return time == duration
      ? start + change
      : change * (-Math.pow(2, (-10 * time) / duration) + 1) + start
  }

  static EaseInOutExpo(time, start, change, duration) {
    if (time == 0) return start
    if (time == duration) return start + change
    if ((time /= duration / 2) < 1) return (change / 2) * Math.pow(2, 10 * (time - 1)) + start
    return (change / 2) * (-Math.pow(2, -10 * --time) + 2) + start
  }

  static EaseInCirc(time, start, change, duration) {
    return -change * (Math.sqrt(1 - (time /= duration) * time) - 1) + start
  }

  static EaseOutCirc(time, start, change, duration) {
    return change * Math.sqrt(1 - (time = time / duration - 1) * time) + start
  }

  static EaseInOutCirc(time, start, change, duration) {
    return (time /= duration / 2) < 1
      ? (-change / 2) * (Math.sqrt(1 - time * time) - 1) + start
      : (change / 2) * (Math.sqrt(1 - (time -= 2) * time) + 1) + start
  }

  static EaseInCubic(time, start, change, duration) {
    return change * (time /= duration) * time * time + start
  }

  static EaseOutCubic(time, start, change, duration) {
    return change * ((time = time / duration - 1) * time * time + 1) + start
  }

  static EaseInOutCubic(time, start, change, duration) {
    return (time /= duration / 2) < 1
      ? (change / 2) * time * time * time + start
      : (change / 2) * ((time -= 2) * time * time + 2) + start
  }

  static EaseInQuart(time, start, change, duration) {
    return change * (time /= duration) * time * time * time + start
  }

  static EaseOutQuart(time, start, change, duration) {
    return (
      -change * ((time = time / duration - 1) * time * time * time - 1) + start
    )
  }

  static EaseInOutQuart(time, start, change, duration) {
    return (time /= duration / 2) < 1
      ? (change / 2) * time * time * time * time + start
      : (-change / 2) * ((time -= 2) * time * time * time - 2) + start
  }

  static EaseInQuint(time, start, change, duration) {
    return change * (time /= duration) * time * time * time * time + start
  }

  static EaseOutQuint(time, start, change, duration) {
    return (
      change * ((time = time / duration - 1) * time * time * time * time + 1) +
      start
    )
  }

  static EaseInOutQuint(time, start, change, duration) {
    return (time /= duration / 2) < 1
      ? (change / 2) * time * time * time * time * time + start
      : (change / 2) * ((time -= 2) * time * time * time * time + 2) + start
  }

  static EaseInElastic(time, start, change, duration) {
    let s = 1.70158
    let p = 0
    let a = change
    if (time == 0) return start
    if ((time /= duration) == 1) return start + change
    if (!p) p = duration * 0.3
    if (a < Math.abs(change)) {
      a = change
      s = p / 4
    } else s = (p / (2 * Math.PI)) * Math.asin(change / a)
    return (
      -(
        a *
        Math.pow(2, 10 * (time -= 1)) *
        Math.sin(((time * duration - s) * (2 * Math.PI)) / p)
      ) + start
    )
  }

  static EaseOutElastic(time, start, change, duration) {
    let s = 1.70158
    let p = 0
    let a = change
    if (time == 0) return start
    if ((time /= duration) == 1) return start + change
    if (!p) p = duration * 0.3
    if (a < Math.abs(change)) {
      a = change
      s = p / 4
    } else s = (p / (2 * Math.PI)) * Math.asin(change / a)
    return (
      a *
        Math.pow(2, -10 * time) *
        Math.sin(((time * duration - s) * (2 * Math.PI)) / p) +
      change +
      start
    )
  }

  static EaseInOutElastic(time, start, change, duration) {
    let s = 1.70158
    let p = 0
    let a = change
    if (time == 0) return start
    if ((time /= duration / 2) == 2) return start + change
    if (!p) p = duration * (0.3 * 1.5)
    if (a < Math.abs(change)) {
      a = change
      s = p / 4
    } else s = (p / (2 * Math.PI)) * Math.asin(change / a)
    if (time < 1) {
      return (
        -0.5 *
          (a *
            Math.pow(2, 10 * (time -= 1)) *
            Math.sin(((time * duration - s) * (2 * Math.PI)) / p)) +
        start
      )
    }
    return (
      a *
        Math.pow(2, -10 * (time -= 1)) *
        Math.sin(((time * duration - s) * (2 * Math.PI)) / p) *
        0.5 +
      change +
      start
    )
  }

  static EaseInBack(time, start, change, duration) {
    return (
      change *
        (time /= duration) *
        time *
        ((ValueEaseAndTween.s + 1) * time - ValueEaseAndTween.s) +
      start
    )
  }

  static EaseOutBack(time, start, change, duration) {
    return (
      change *
        ((time = time / duration - 1) *
          time *
          ((ValueEaseAndTween.s + 1) * time + ValueEaseAndTween.s) +
          1) +
      start
    )
  }

  static EaseInOutBack(time, start, change, duration) {
    return (time /= duration / 2) < 1
      ? (change / 2) *
          (time *
            time *
            (((ValueEaseAndTween.s *= 1.525) + 1) * time -
              ValueEaseAndTween.s)) +
          start
      : (change / 2) *
          ((time -= 2) *
            time *
            (((ValueEaseAndTween.s *= 1.525) + 1) * time +
              ValueEaseAndTween.s) +
            2) +
          start
  }

  constructor(data) {
    this.data = data
    this._count = 0
    this._alive = true
    this._start = data.start
    this._change = data.end - data.start
    this._func = this.data.function
  }

  update() {
    if (!this._alive) return
    if (this._count >= this.data.max) {
      this._count = 0
      this.data.onDone()
      return
    }
    this._count++
    this.data.onUpdate(
      this._func(this._count, this._start, this._change, this.data.max)
    )
  }

  setAlive(value) {
    this._alive = value
    this._count = 0
  }

  isAlive() {
    return this._alive
  }

  getInterval(n) {
    return n / this.data.max
  }
}
ValueEaseAndTween.s = 1.70158
