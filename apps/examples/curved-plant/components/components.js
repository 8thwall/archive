const spinComponent = {
  schema: {
    speed: {default: 2000},
    direction: {default: 'normal'},
  },
  init() {
    const {el} = this
    el.setAttribute('animation__spin', {
      property: 'object3D.rotation.y',
      from: 0,
      to: 360,
      dur: this.data.speed,
      dir: this.data.direction,
      loop: true,
      easing: 'linear',
    })
  },
}

export {spinComponent}
