const FIRST_TARGET_NAME = 'first'
const SECOND_TARGET_NAME = 'second'

AFRAME.registerComponent('paradox', {
  init: function() {
    const target = document.createElement('a-entity')
    target.setAttribute('portal-hider', '')

    getSkyElement(target, null, { name: FIRST_TARGET_NAME })

    const text = document.createElement('a-entity')

    text.object3D.position.z = -0.2
    text.object3D.scale.set(0.6, 0.6, 0.6)

    const topLine = document.createElement('a-entity')
    topLine.setAttribute('gltf-model', '#riddleTopModel')
    text.appendChild(topLine)

    const bottomLine = document.createElement('a-entity')
    bottomLine.setAttribute('gltf-model', '#riddleBottomModel')
    text.appendChild(bottomLine)

    target.appendChild(text)

    this.el.appendChild(target)

    const relicTarget = document.createElement('a-entity')
    relicTarget.setAttribute('unnamed-image-target', { name: SECOND_TARGET_NAME })

    const relicBase = document.createElement('a-entity')
    relicBase.object3D.rotation.x = Math.PI / 2

    const relic = document.createElement('a-entity')
    relic.setAttribute('gltf-model', '#relicModel')
    relic.object3D.position.y = 0.3
    relic.object3D.scale.set(3, 3, 3)
    relic.object3D.visible = false
    spinRelic(relic)

    relicBase.appendChild(relic)
    relicTarget.appendChild(relicBase)
    this.el.appendChild(relicTarget)

    let sawFirst = false
    let sawSecond = false
    let hintTimeout
    let showPromptTimeout

    this.el.sceneEl.addEventListener('xrimagefound', ({ detail: { name } }) => {

      if (name === SECOND_TARGET_NAME && sawSecond) {
        clearTimeout(showPromptTimeout)
        document.body.classList.remove('paradox-show-prompt')
      }

      if (name === SECOND_TARGET_NAME && sawFirst && !sawSecond) {
        window.emit('clearalert')
        clearTimeout(hintTimeout)
        sawSecond = true
        relic.object3D.visible = true

        setTimeout(() => {
          window.emit('collected')
        }, 1000)

        setTimeout(() => {
          document.getElementById('prompt').textContent = 'Pass it along!'
        }, 1000)


        document.body.classList.remove('paradox-show-prompt')
        showPromptTimeout = setTimeout(() => {
          document.body.classList.add('paradox-show-prompt')
        }, 10000)
      }

      if (name === FIRST_TARGET_NAME && !sawFirst) {
        sawFirst = true
        window.emit('scanned')

        hintTimeout = setTimeout(() => {
          document.body.classList.add('paradox-show-prompt')

          hintTimeout = setTimeout(() => {
            window.emit('newalert', { text: 'I need to scan this now? How?' })

            hintTimeout = setTimeout(() => {
              window.emit('newalert', { text: 'This would be simple if I could bend spacetime!', duration: 2500 })

              hintTimeout = setTimeout(() => {
                window.emit('newalert', { text: 'I wonder if a friend could give me a hand...', duration: 3500 })

                hintTimeout = setTimeout(() => {
                  window.emit('newalert', { text: 'Maybe someone else can show me their target.', duration: 3500 })

                  hintTimeout = setTimeout(() => {
                    window.emit('newalert', { text: 'I can use someone else\'s device to scan from', duration: 3500 })
                  }, 5000)
                }, 5000)
              }, 7000)
            }, 2000)
          }, 2000)
        }, 2500)
      }
    })

    this.el.sceneEl.addEventListener('xrimagelost', ({ detail: { name } }) => {
      if (name === SECOND_TARGET_NAME && sawSecond) {
        clearTimeout(showPromptTimeout)
        showPromptTimeout = setTimeout(() => {
          document.body.classList.add('paradox-show-prompt')
        }, 1000)
      }
    })
  }
})
