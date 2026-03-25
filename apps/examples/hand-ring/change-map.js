const changeMapComponent = {
  schema: {
    'color': {type: 'string', default: 'gold'},
  },
  init() {
    const loader = new THREE.TextureLoader()
    const goldTexture = require('./assets/bandGold.png')
    const bangleGoldTexture = require('./assets/femaleBangleGold.png')
    const silverTexture = require('./assets/diamondSilver.png')
    const roseGoldTexture = require('./assets/diamondRoseGold.png')
    const signetGoldTexture = require('./assets/signetGold.png')
    const loadedGold = loader.load(signetGoldTexture)
    const signetDarkTexture = require('./assets/signetDark.png')
    const loadedDark = loader.load(signetDarkTexture)
    const signetSilverTexture = require('./assets/signetSilver.png')
    const loadedSilver = loader.load(signetSilverTexture)
    const slenderWatchBlackTexture = require('./assets/slenderWatchBlack.png')
    this.el.addEventListener('model-loaded', () => {
      const selectedMesh = this.el.getObject3D('mesh')
      let selectedNode
      selectedMesh.traverse((node) => {
        if (node.material && node.material.name.includes('GOLD1')) {
          selectedNode = node
          if (this.data.color === 'gold') {
            selectedNode.material.map = loader.load(goldTexture)
          } else if (this.data.color === 'silver') {
            selectedNode.material.map = loader.load(silverTexture)
          } else if (this.data.color === 'roseGold') {
            selectedNode.material.map = loader.load(roseGoldTexture)
          } else if (this.data.color === 'bangleGold') {
            selectedNode.material.map = loader.load(bangleGoldTexture)
          } else if (this.data.color === 'signetGold') {
            selectedNode.material.map = loadedSilver
          } else if (this.data.color === 'slenderBlack') {
            selectedNode.material.map = loader.load(slenderWatchBlackTexture)
          }
          selectedNode.material.map.flipY = false
          selectedNode.material.map.encoding = 3001  // color corrects map
        }
      })
      // let counter = 2

      // setInterval(() => {
      //   if (counter === 0) {
      //     selectedNode.material.map = loadedDark
      //     counter += 1
      //   } else if (counter === 1) {
      //     selectedNode.material.map = loadedSilver
      //     counter += 1
      //   } else if (counter === 2) {
      //     selectedNode.material.map = loadedGold
      //     counter = 0
      //   }
      // }, 2500)
    })
  },
}

export {changeMapComponent}
