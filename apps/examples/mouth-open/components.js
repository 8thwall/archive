const faceEventsComponent = {
  init() {
    this.value = document.getElementById('openValue')
    this.cookie = document.getElementById('cookie')

    this.lower = document.createElement('xrextras-face-attachment')
    this.lower.setAttribute('alignToSurface', 'true')
    this.lower.setAttribute('point', 'lowerLip')
    this.el.appendChild(this.lower)
  },
  tick() {
    // normalize lower lip distance
    const blendAmt = function (value, min, max) {
      return (value - min) / (max - min)
    }

    // display mouth open value
    this.mouthOpen = blendAmt(this.lower.object3D.position.y, -0.5, -0.7)
    const openText = this.mouthOpen.toString()
    this.value.innerText = openText.slice(0, 3)

    this.cookie.object3D.scale.set(this.mouthOpen * 2, this.mouthOpen * 2, this.mouthOpen * 2)
    this.cookie.object3D.position.set(0, 0, this.mouthOpen * -1.5)

    // hide the cookie if the lower lip distance falls below the mouth open threshold
    this.cookie.object3D.visible = !(this.mouthOpen < 0.3)
  },
}

export {faceEventsComponent}
