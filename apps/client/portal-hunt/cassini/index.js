AFRAME.registerComponent('perspective', {
  init: function() {
    this.camera = document.getElementById('camera')
    this.base = document.createElement('a-entity')
    this.base.setAttribute('portal-hider', '')

    const skyElement = getSkyElement(this.base)

    const showPoints = true

    const solutionRadius = 0.1
    const solutionRadiusSquared = solutionRadius * solutionRadius

    const offset = 0.05

    this.sectionsConfig = [
      {
        modelSource: '#saucerModel',
        animation: '4567',
        color: 'blue',
        solvePosition: [ 0.110, -0.0423, 0.213 ],
        initialTransform: {
          position: [ 0, 0, offset ],
          rotation: [ -Math.PI / 6, Math.PI / 6, 0],
        },
        modelTransform: {
          position: [ 0.14, 0, -0.002 ],
          rotation: [ 0, -Math.PI / 2, 0],
        }
      },
      {
        modelSource: '#leftPanelModel',
        animation: '2367',
        color: 'green',
        solvePosition: [ 0.0316, 0.0454 , -0.0322 ],
        initialTransform: {
          position: [ offset, 0, 0 ],
          rotation: [ 0 , -Math.PI / 6, 0],
        },
        modelTransform: {
          position: [ 0.1, 0, 0.037 ],
          rotation: [ 0, -Math.PI / 2, 0],
        }
      },
      {
        modelSource: '#rightPanelModel',
        animation: 'Take 001',
        color: 'red',
        solvePosition: [ -0.0313, 0.0107, 0.0855 ],
        initialTransform: {
          position: [ -offset / 2, 0, offset ],
          rotation: [ -Math.PI / 6, 0, 0],
        },
        modelTransform: {
          position: [ -0.055, 0, 0],
        }
      },
    ]

    this.solved = new Array(this.sectionsConfig.length).fill(false)
    this.solvedCount = 0

    const satelliteScale = 2.5
    this.satelliteParent = document.createElement('a-entity')
    this.satelliteParent.object3D.rotation.z = Math.PI / 6
    this.satelliteParent.object3D.scale.set(0.01, 0.01, 0.01)

    const satelliteBody = document.createElement('a-entity')
    satelliteBody.setAttribute('gltf-model', '#bodyModel')
    satelliteBody.object3D.position.z = -offset/ 2 + 0.13
    satelliteBody.object3D.rotation.y = -Math.PI / 2
    this.satelliteParent.appendChild(satelliteBody)
    this.satelliteBody = satelliteBody

    for (let i = 0; i < this.sectionsConfig.length; i++) {

      const sectionConfig = this.sectionsConfig[i]
      sectionConfig.solvePositionVector3 = new THREE.Vector3().fromArray(sectionConfig.solvePosition)

      const modelParent = document.createElement('a-entity')
      const parentObject = modelParent.object3D

      const parentTransform = sectionConfig.initialTransform
      if (parentTransform) {
        parentTransform.position && parentObject.position.fromArray(parentTransform.position)
        parentTransform.rotation && parentObject.rotation.fromArray(parentTransform.rotation)
        parentTransform.scale && parentObject.scale.fromArray(parentTransform.scale)
      }

      const model = document.createElement('a-entity')
      model.setAttribute('gltf-model', sectionConfig.modelSource)
      model.config = sectionConfig

      const modelObject = model.object3D
      const modelTransform = sectionConfig.modelTransform
      if (modelTransform) {
        modelTransform.position && modelObject.position.fromArray(modelTransform.position)
        modelTransform.rotation && modelObject.rotation.fromArray(modelTransform.rotation)
        modelTransform.scale && modelObject.scale.fromArray(modelTransform.scale)
      }

      if (showPoints) {
        const point = document.createElement('a-sphere')
        point.id = 'point' + i
        point.classList.add('point')
        point.setAttribute('material', { color: 'white', opacity: 0 })
        point.object3D.position.fromArray(sectionConfig.solvePosition)
        point.object3D.scale.set(solutionRadius / 4, solutionRadius / 4, solutionRadius / 4)
        model.appendChild(point)
        sectionConfig.pointElement = point
      }

      modelParent.appendChild(model)
      sectionConfig.modelElement = model

      this.satelliteParent.appendChild(modelParent)
      sectionConfig.parentElement = modelParent
    }

    this.base.appendChild(this.satelliteParent)

    this.el.sceneEl.appendChild(this.base)

    const planet = document.createElement('a-entity')
    planet.setAttribute('gltf-model', '#planetModel')
    planet.setAttribute('animation-mixer', { clip: 'Take 001', timeScale: 0.5 })
    planet.object3D.rotation.y = -Math.PI / 1.5
    planet.object3D.position.x = 5
    planet.object3D.position.y = -8
    planet.object3D.position.z = -40
    planet.object3D.scale.set(220, 220, 220)
    skyElement.appendChild(planet)

    this.isSolve = (solution, position) => {
      const cameraPosition = this.tempVector3_2.copy(position)
      solution.modelElement.object3D.worldToLocal(cameraPosition)
      return cameraPosition.distanceToSquared(solution.solvePositionVector3) < solutionRadiusSquared
    }

    window.emit('changeobjective', { text: 'Repair the satellite' })
    window.emit('changeprogress', { text: `0/${this.sectionsConfig.length}` })

    const startPerspective = () => {
      this.el.sceneEl.removeEventListener('xrimagefound', startPerspective)
      setTimeout(() => {
        window.emit('scanned')
        setTimeout(() => {
          this.satelliteParent.setAttribute('animation__in', {
            property: 'object3D.position.z',
            from: -1,
            to: 0.2,
            dur: 1500,
            easing: 'easeOutQuad',
          })
          this.satelliteParent.setAttribute('animation__grow', {
            property: 'scale',
            to: `${satelliteScale} ${satelliteScale} ${satelliteScale}`,
            dur: 1500,
            easing: 'easeOutQuad',
          })

          const endLoop = e => {
            e.target.loopLeft --
            if (e.target.loopLeft > 0) {
              return
            }
            e.target.removeEventListener('animation-loop', endLoop)
            e.target.removeAttribute('animation-mixer')
            e.target.setAttribute('animation-mixer', { clip: e.target.config.animation, timeScale: 0, loop: 'once' })
          }

          setTimeout(()=>{
            this.sectionsConfig.forEach(section => {
              section.modelElement.setAttribute('animation-mixer', { clip: section.animation, timeScale: -1.5, loop: 'repeat' })
              section.modelElement.loopLeft = 2
              section.modelElement.addEventListener('animation-loop', endLoop)
            })

            window.emit('changeprompt', { text: 'Move around to align each part', icon: 'move' })
            this.canSolve = true

            setTimeout(()=>{
              Array.from(document.getElementsByClassName('point')).forEach(point => {
                point.setAttribute('animation', {
                  property: 'material.opacity',
                  to: 0.4,
                  dur: 300,
                })
              })
            }, 25000)
          }, 1500)

        }, 700)
      }, 10)
    }

    this.el.sceneEl.addEventListener('xrimagefound', startPerspective)

    this.tempVector3 = new THREE.Vector3()
    this.tempVector3_2 = new THREE.Vector3()
  },
  tick: function() {
    if (!this.canSolve) {
      return
    }
    if (this.base.object3D.visible && this.solvedCount < this.sectionsConfig.length) {
      this.camera.object3D.getWorldPosition(this.tempVector3)

      let solutionIndex = -1
      for(let i = 0; i < this.sectionsConfig.length; i++) {
        if (this.solved[i]) {
          continue
        }
        if (this.isSolve(this.sectionsConfig[i], this.tempVector3)) {
          solutionIndex = i
          break
        }
      }

      if (solutionIndex !== -1) {
        console.log('solved', solutionIndex)

        const solution = this.sectionsConfig[solutionIndex]

        this.solved[solutionIndex] = true

        setTimeout(() => {

          solution.modelElement.addEventListener('animation-finished', () => {
            solution.modelElement.removeAttribute('animation-mixer')
          })

          solution.modelElement.setAttribute('animation-mixer', { timeScale: 2 })

          if (solution.pointElement) {
            solution.pointElement.object3D.visible = false
          }

          setTimeout(()=> {
            const parent = solution.parentElement
            parent.setAttribute('animation__position', {
              property: 'position',
              to: '0 0 0',
              dur: 1000,
            })
            parent.setAttribute('animation__rotation', {
              property: 'rotation',
              to: '0 0 0',
              dur: 1000,
            })
            parent.setAttribute('animation__scale', {
              property: 'scale',
              to: '1 1 1',
              dur: 1000,
            })
          }, 2500)

          this.solvedCount ++

          window.emit('changeprogress', {text: `${this.solvedCount}/${this.sectionsConfig.length}`})
          window.emit('clearprompt')
          window.emit('newalert', { text: 'Part repaired!', duration: 1000 })

          if (this.solvedCount >= this.sectionsConfig.length) {

            setTimeout(() => {
              this.satelliteBody.setAttribute('animation', {
                property: 'object3D.position.z',
                to: 0.13,
                dur: 1000,
              })

              const currentRotation = this.satelliteParent.object3D.rotation.z
              this.satelliteParent.setAttribute('animation__spin', {
                property: 'object3D.rotation.z',
                from: currentRotation,
                to: currentRotation + Math.PI * 2,
                dur: 12000,
                loop: true,
                easing: 'linear',
              })

              setTimeout(() => {
                cameraZoomRelic(this.camera)
                setTimeout(() => {
                  window.emit('collected', { replay: true })
                }, 1500)
              }, 1000)
            }, 3000)
          }
        }, 500)
      }
    }
  }
})
