const ballChainComponent = { // Create a connected chain of dynamic physics objects.
  schema: {
    count: {type: 'number', default: 5},
    scale: {type: 'number', default: 0.35},
    mass: {type: 'number', default: 5},
    distance: {type: 'number', default: 0.05},
  },
  init() {
    const scaleDist = this.data.scale * this.data.distance

    for (let i = 0; i < this.data.count; i++) {
      const ball = document.createElement('a-entity')
      this.el.appendChild(ball)
      ball.id = `ball-${i}`
      ball.setAttribute('scale', `${this.data.scale} ${this.data.scale} ${this.data.scale}`)
      ball.object3D.position.set(0, -0.1 * i, 0)

      ball.setAttribute('gltf-model', require('./assets/Models/skull.glb'))

      if (i === 0) {
        ball.setAttribute('ammo-body', {type: 'static'}) // The first object serves as the anchor.
      } else {
        ball.setAttribute('ammo-body', {
          type: 'dynamic',
          mass: this.data.mass,
          angularDamping: 0.8,
          activationState: 'disableDeactivation',
        })
        ball.setAttribute('ammo-constraint', {
          target: `#ball-${i - 1}`,
          type: 'pointToPoint',
          pivot: `0 ${scaleDist} 0`,
          targetPivot: `0 ${-scaleDist} 0`,
        })
      }

      ball.setAttribute('ammo-shape', {type: 'sphere', fit: 'manual', sphereRadius: scaleDist})
    }
  },
}

export {ballChainComponent}
