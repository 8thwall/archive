const earringChainComponent = {
  schema: {
    scale: {type: 'number', default: 0.35},
    mass: {type: 'number', default: 10},
    linearDamping: {type: 'number', default: 0.2},
    angularDamping: {type: 'number', default: 0.85},
  },
  init() {
    const leftEarringTop = document.getElementById('leftEarringTop')
    const leftEarringMid = document.getElementById('hatLeft')
    // const leftEarringLow = document.getElementById('leftEarringLow')

    const rightEarringTop = document.getElementById('rightEarringTop')
    const rightEarringMid = document.getElementById('hatRight')
    // const rightEarringLow = document.getElementById('rightEarringLow')

    this.el.sceneEl.addEventListener('xrfacefound', () => {
      setTimeout(() => {
        leftEarringTop.setAttribute('ammo-body', {type: 'static'})  // The first object serves as the anchor.
        leftEarringTop.setAttribute('ammo-shape', {type: 'box', offset: '0 -.005 0'})

        leftEarringMid.setAttribute('ammo-body', {
          type: 'dynamic',
          mass: 20,
          gravity: '0 -9.8 0',
          linearDamping: 0.2,
          angularDamping: 0.85,
          activationState: 'disableDeactivation',
        })
        leftEarringMid.setAttribute('ammo-shape', {type: 'box', offset: '0 -.027 0', fit: 'manual', halfExtents: '.015 .023 .015'})
        leftEarringMid.setAttribute('ammo-constraint', {
          target: '#leftEarringTop',
          type: 'pointToPoint',
          pivot: '0 0.001 0',
          targetPivot: '0 -.02 0',
        })

        // leftEarringLow.setAttribute('ammo-body', {
        //   type: 'dynamic',
        //   mass: 20,
        //   gravity: '0 -9.8 0',
        //   linearDamping: 0.2,
        //   angularDamping: 0.85,
        //   activationState: 'disableDeactivation',
        // })
        // leftEarringLow.setAttribute('ammo-shape', {type: 'box', offset: '0 -.015 0'})
        // leftEarringLow.setAttribute('ammo-constraint', {
        //   target: '#leftEarringMid',
        //   type: 'pointToPoint',
        //   pivot: '0 0.01 0',
        //   targetPivot: '0 -.02 0',
        // })

        // right ear
        rightEarringTop.setAttribute('ammo-body', {type: 'static'})  // The first object serves as the anchor.
        rightEarringTop.setAttribute('ammo-shape', {type: 'box', offset: '0 -.005 0'})

        rightEarringMid.setAttribute('ammo-body', {
          type: 'dynamic',
          mass: 20,
          gravity: '0 -9.8 0',
          linearDamping: 0.2,
          angularDamping: 0.85,
          angularFactor: '1 1 1',
          activationState: 'disableDeactivation',
        })
        rightEarringMid.setAttribute('ammo-shape', {type: 'box', offset: '0 -.027 0', fit: 'manual', halfExtents: '.015 .023 .015'})
        rightEarringMid.setAttribute('ammo-constraint', {
          target: '#rightEarringTop',
          type: 'pointToPoint',
          pivot: '0 0.001 0',
          targetPivot: '0 -.02 0',
        })

        // rightEarringLow.setAttribute('ammo-body', {
        //   type: 'dynamic',
        //   mass: 20,
        //   gravity: '0 -9.8 0',
        //   linearDamping: 0.2,
        //   angularDamping: 0.85,
        //   angularFactor: '1 1 1',
        //   activationState: 'disableDeactivation',
        // })
        // rightEarringLow.setAttribute('ammo-shape', {type: 'box', offset: '0 -.015 0'})
        // rightEarringLow.setAttribute('ammo-constraint', {
        //   target: '#rightEarringMid',
        //   type: 'pointToPoint',
        //   pivot: '0 0.01 0',
        //   targetPivot: '0 -.02 0',
        // })
      }, 0)
    })
  },
}

export {earringChainComponent}
