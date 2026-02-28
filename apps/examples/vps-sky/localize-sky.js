import * as skyScene from './sky-scene.html'

const localizeSkyComponent = {
  schema: {
    name: {type: 'string'},
  },
  init() {
    console.log('init')
    const showSkyScene = () => {
      this.el.sceneEl.removeEventListener('xrprojectwayspotfound', showSkyScene)
      console.log('localized, setting up sky scene')

      // remove vps coaching overlay
      this.el.removeAttribute('vps-coaching-overlay')
      // add the sky coaching overlay and xrlayers
      this.el.setAttribute('sky-coaching-overlay', '')

      // append a unitcube sky scene
      this.el.insertAdjacentHTML('beforeend', skyScene)
    }

    this.el.addEventListener('xrprojectwayspotfound', showSkyScene)
  },
}

export {localizeSkyComponent}
