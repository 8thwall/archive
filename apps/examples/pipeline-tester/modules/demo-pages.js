/* eslint-disable no-console */
const words = [
  'Masters\nof the\nSun',
  'I want money',
  'I want it, want it, want it',
  'Fast internet',
  'Stay connected in a jet',
  'Wifi, podcasts, blasting out an SMS',
  'Text me, I\'ll text you back',
  'Check me on that iChat',
  'I\'m all about that HTTP',
  'You\'re a PC, I\'m a Mac',
  'I, want it,',
  'Myspace in your space',
  'Facebook is that new place',
  'Dip, divin\' socializin\',',
  'I\'ll be out in cyberspace',
]

const MastersModule = {
  init() {
    const controller = XR8.XrController
    const loadImage = (index) => {
      const indices = index === 0 ? [index] : [0, index]
      const names = indices.map(i => `page-${i}`)
      console.log(`[demo-pages] controller.configure([${names.join(', ')}]`)
      controller.configure({imageTargets: names})
    }

    const indexElement = document.getElementById('indexElement')
    loadImage(0)

    this.el.sceneEl.addEventListener('xrimagelost', ({detail: {name}}) => {
      // // Comment this in, and the other lines out, in order to test timing of dynamic targets
      // console.log('[demo-pages] Loading images: ["page-0","page-1", "page-3"] ==========)')
      // controller.configure({imageTargets: ['page-0', 'page-1', 'page-3']})

      // console.log('[demo-pages] Loading images: ["page-0","page-2", "page-3"] ==========')
      // controller.configure({imageTargets: ['page-0', 'page-2', 'page-3']})
      // // If you add several more, the order is not guaranteed b/c setActiveImageTargets() is called after fetchImageTargetsByName(), which is async. But whichever is called last will override the others.
      // // controller.configure({imageTargets: ['page-0', 'page-2', 'page-4']})
      // // controller.configure({imageTargets: ['page-0', 'page-2', 'page-5']})

      const nextIndex = parseInt(name.replace('page-', ''), 10) + 1
      loadImage(nextIndex)
      indexElement.textContent = `Looking for page ${nextIndex}`
    })
  },
}

const ImageTargetsModule = {
  init() {
    const indexElement = document.getElementById('indexElement')

    const {object3D} = this.el
    object3D.visible = false

    const textChild = document.createElement('a-entity')
    textChild.setAttribute('geometry', 'primitive: plane; width: 0.5; height: 0.5')
    textChild.setAttribute('material', 'color: black; transparent: true; opacity: 0.5')
    textChild.setAttribute('text', 'value: Cover; align: center; wrapCount: 10; color: white')
    textChild.setAttribute('position', '0 0 0.05')

    this.el.appendChild(textChild)

    this.el.sceneEl.addEventListener('xrimageloading', ({detail: {imageTargets}}) => {
      const n = imageTargets.map(a => a.name)
      console.log('[demo-pages@xrimageloading]', JSON.stringify(n))
    })

    this.el.sceneEl.addEventListener('xrimagescanning', ({detail: {imageTargets}}) => {
      const n = imageTargets.map(a => a.name)
      console.log('[demo-pages@xrimagescanning]', JSON.stringify(n))
    })

    this.el.sceneEl.addEventListener('xrimagefound', ({detail: {name}}) => {
      console.log(`[demo-pages@xrimagefound] ${name}`)
      const index = parseInt(name.replace('page-', ''), 10)

      indexElement.textContent = index === 0 ? 'Cover' : `On page ${index}`

      const textToSet = words[index]
      textChild.setAttribute('text', {value: textToSet})
    })

    this.el.sceneEl.addEventListener('xrimageupdated', ({detail: {name, position, rotation, scale}}) => {
      // console.log(`Updated: ${name}`)
      object3D.visible = true
      object3D.position.copy(position)
      object3D.scale.set(scale, scale, scale)
      object3D.quaternion.copy(rotation)
    })

    this.el.sceneEl.addEventListener('xrimagelost', ({detail: {name}}) => {
      console.log(`[demo-pages@xrimagelost] ${name}`)
      object3D.visible = false
    })
  },
}

const PAGES = {
  components: [
    {name: 'masters', val: MastersModule},
    {name: 'image-target', val: ImageTargetsModule},
  ],
  primitives: [],
}

export {PAGES}

// ======================================================

// // DEMO #2 - Also comment back in some of the changes in scenes/demo-pages.html
// const logEvent = ({name, detail}) => {
//   console.log(`Handling event ${name}, got detail, ${JSON.stringify(detail)}`)
// }

// const setAsNext = (el, n) => {
//   el.setAttribute('visible', 'false')
//   el.setAttribute('image-target', {'targetname': n})
// }

// const MastersModule = {
//   init() {
//     let i = 0
//     let nextTarget = 'page-0'
//     const a = document.getElementById('a')
//     const b = document.getElementById('b')
//     const c = document.getElementById('c')
//     a.setAttribute('image-target', {'targetname': nextTarget})

//     const controller = XR8.XrController
//     const indexElement = document.getElementById('indexElement')
//     controller.configure({imageTargets: [nextTarget]})

//     this.el.sceneEl.addEventListener('xrimagefound', ({detail: {name}}) => {
//       if (nextTarget !== name) {
//         return
//       }
//       const index = parseInt(name.replace('page-', ''))
//       const prevTarget = `page-${index - 1}`
//       nextTarget = `page-${index + 1}`
//       const targets = [prevTarget, name, nextTarget]
//       controller.configure({imageTargets: targets})
//       console.log(`[demo-pages.js] Found the next one: ${name}. Now looking for ${targets}`)
//       indexElement.textContent = `On ${prevTarget} & ${name}, starting to look for page-${index + 1}`

//       i += 1
//       if (i === 0) {
//         setAsNext(a, nextTarget)
//       } else if (i === 1) {
//         setAsNext(b, nextTarget)
//       } else {
//         setAsNext(c, nextTarget)
//         i = -1
//       }
//     })
//   },
// }

// const words = [
//   'Masters\nof the\nSun',
//   'I want money',
//   'I want it, want it, want it',
//   'Fast internet',
//   'Stay connected in a jet',
//   'Wifi, podcasts, blasting out an SMS',
//   'Text me, I\'ll text you back',
//   'Check me on that iChat',
//   'I\'m all about that HTTP',
//   'You\'re a PC, I\'m a Mac',
//   'I, want it,',
//   'Myspace in your space',
//   'Facebook is that new place',
//   'Dip, divin\' socializin\',',
//   'I\'ll be out in cyberspace',
// ]

// const ImageTargetsModule = {
//   schema: {
//     targetname: {type: 'string', default: 'TEST'},
//   },
//   init() {
//     const indexElement = document.getElementById('indexElement')

//     const {object3D} = this.el
//     object3D.visible = false

//     const textChild = document.createElement('a-entity')
//     textChild.setAttribute('geometry', 'primitive: plane; width: 0.5; height: 0.5')
//     textChild.setAttribute('material', 'color: black; transparent: true; opacity: 0.5')
//     textChild.setAttribute('text', 'value: Cover; align: center; wrapCount: 10; color: white')
//     textChild.setAttribute('position', '0 0 0.05')
//     this.el.appendChild(textChild)

//     this.el.sceneEl.addEventListener('xrimagefound', ({detail: {name}}) => {
//       if (name !== this.data.targetname) {
//         return
//       }
//       const index = parseInt(name.replace('page-', ''))
//       indexElement.textContent = `On page ${index}`
//       const textToSet = words[index]
//       textChild.setAttribute('text', {value: textToSet})
//     })

//     this.el.sceneEl.addEventListener('xrimageupdated', ({detail: {name, position, rotation, scale}}) => {
//       if (name !== this.data.targetname) {
//         return
//       }
//       object3D.visible = true
//       object3D.position.copy(position)
//       object3D.scale.set(scale, scale, scale)
//       object3D.quaternion.copy(rotation)
//     })

//     this.el.sceneEl.addEventListener('xrimagelost', ({detail: {name}}) => {
//       if (name !== this.data.targetname) {
//         return
//       }
//       object3D.visible = false
//     })
//   },
// }

// const PAGES = {
//   components: [
//     {name: 'masters', val: MastersModule},
//     {name: 'image-target', val: ImageTargetsModule},
//   ],
//   primitives: [],
// }

// export {PAGES}
