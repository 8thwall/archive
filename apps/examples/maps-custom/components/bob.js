const bobComponent = {
  schema: {
    distance: {default: 0.0005},
    duration: {default: 1850},
  },
  update() {
    const {el} = this
    const {data} = this
    data.initialPosition = this.el.object3D.position.clone()
    data.downPosition = data.initialPosition.clone().setY(data.initialPosition.y - data.distance)
    data.upPosition = data.initialPosition.clone().setY(data.initialPosition.y + data.distance)

    const vectorToString = v => `${v.x} ${v.y} ${v.z}`
    data.initialPosition = vectorToString(data.initialPosition)
    data.downPosition = vectorToString(data.downPosition)
    data.upPosition = vectorToString(data.upPosition)
    data.timeout = null

    const animatePosition = position => el.setAttribute('animation__bob', {
      property: 'position',
      to: position,
      dur: data.duration,
      easing: 'easeInOutQuad',
      loop: false,
    })

    const bobDown = () => {
      if (data.shouldStop) {
        animatePosition(data.initialPosition)
        data.stopped = true
        return
      }
      animatePosition(data.downPosition)
      data.timeout = setTimeout(bobUp, data.duration)
    }

    const bobUp = () => {
      if (data.shouldStop) {
        animatePosition(data.initialPosition)
        data.stopped = true
        return
      }

      animatePosition(data.upPosition)
      data.timeout = setTimeout(bobDown, data.duration)
    }

    this.bobStop = () => {
      data.shouldStop = true
    }

    this.bobStart = () => {
      if (data.stopped) {
        data.shouldStop = false
        data.stopped = false
        bobUp()
      }
    }

    this.el.addEventListener('bobStart', this.bobStart)
    this.el.addEventListener('bobStop', this.bobStop)

    bobUp()
  },
}

export {bobComponent}
