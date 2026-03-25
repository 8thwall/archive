const accessoryPickerComponent = {
  schema: {
    accessory: {type: 'string'},
  },
  init() {
    const container = document.getElementById('palette')
    this.currentAccessory = document.getElementById(this.data.accessory)
    // custom texture variables
    const noneIcon = require('../assets/UI/noneIcon.png')

    let map

    const watch = document.getElementById('model')

    // const loader = new THREE.ImageBitmapLoader()
    const loader = new THREE.TextureLoader()

    // // set options if needed
    // loader.setOptions({imageOrientation: 'flipY'})

    const silverImg = require('../assets/silver.png')
    const silverMap = loader.load(silverImg)
    const goldImg = require('../assets/gold.png')
    const goldMap = loader.load(goldImg)
    const blueImg = require('../assets/blue.png')
    const blueMap = loader.load(blueImg)
    const redImg = require('../assets/red.png')
    const redMap = loader.load(redImg)

    watch.addEventListener('model-loaded', () => {
      const watchMesh = watch.getObject3D('mesh')
      let first = true
      watchMesh.traverse((node) => {
        if (node.material && node.material.name.includes('LUXWATCH') && first) {
          this.node = node
          console.log(node.material.map)
          first = false
        }
      })
    })

    this.offset = 0
    this.textureSelected = false
    this.once = false

    const setColorList = () => {
      // These hex colors are used by the UI buttons for each makeup piece
      const {accessory} = this.data
      if (accessory === 'watches') {
        this.colorList = ['none', '#c0c0c0', '#daa520', '#da70d6', '#191970']
      } else if (accessory === 'bracelets') {
        this.colorList = ['none', '#a84856', '#f2b4ae', '#9e492f', '#ca8082', '#f25f69']
      } else if (accessory === 'rings') {
        this.colorList = ['none', '#000000', '#36454F', '#964B00']
      }
    }

    const setColor = ({newColor, button}) => {
      if (newColor === '#c0c0c0') {
        if (this.node) {
          this.node.material.map = silverMap
          console.log(this.node.material.map)
        }
      } else if (newColor === '#daa520') {
        this.node.material.map = goldMap
      } else if (newColor === '#da70d6') {
        this.node.material.map = redMap
      } else if (newColor === '#191970') {
        this.node.material.map = blueMap
      }
      if (this.node) {
        this.node.material.map.flipY = false
        this.node.material.map.encoding = 3001  // color corrects map
        this.node.material.map.wrapS = 1000  // not sure if we need these wrap values
        this.node.material.map.wrapT = 1000
      }
      button.focus()
    }
    this.createButtons = () => {
      setColorList()
      // create a UI button for each color in the list
      for (let i = 0; i < this.colorList.length; i++) {
        const colorButton = document.createElement('button')
        colorButton.classList.add('carousel')
        if (this.colorList[i] === 'none') {
        // sets button background to none icon
          colorButton.style.background = `rgba(255, 255, 255, 0.1) url(${noneIcon}) no-repeat center center`
          colorButton.style.backdropFilter = 'blur(30px)'
          colorButton.style.webkitBackdropFilter = 'blur(30px)'
        } else {
        // sets button background to hex color
          colorButton.style.backgroundColor = this.colorList[i]
        }
        container.appendChild(colorButton)
        colorButton.addEventListener('click', () => setColor({
          newColor: this.colorList[i],
          button: colorButton,
        }))
      }
    }

    this.createButtons()

    this.removeButtons = () => {
      while (container.firstChild) {
        container.removeChild(container.firstChild)
      }
    }
    this.el.sceneEl.addEventListener('realityready', () => {
      // Select first button in list
      const secondButton = container.getElementsByTagName('button')[1]
      // set accessory to first button's color
      setColor({newColor: this.colorList[1], button: secondButton})
    })
    // support horizontal scroll for more than 5 colors
    if (this.colorList.length > 5) {
      container.style.pointerEvents = 'auto'
    }
  },
  update() {
    this.currentAccessory = document.getElementById(this.data.accessory)

    // Execute code after the first update() is run after init()
    if (this.once) {
      this.removeButtons()
      this.createButtons()
    } else {
      this.once = true
    }
  },
}

export {accessoryPickerComponent}