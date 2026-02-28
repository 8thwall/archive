// This component waits for a tap to place a hologram, and then starts the hologram after dismissing
// prompt text. The hologram uses an invisible cylindar for a touch target.
const hcapComponent = () => ({
  schema: {
    'url': { default: '' },
    'scale': {default: 1},
    'touch-target': {default: '1 0.3'},
    'show-touch-target': {default: false}
  },
  init: function () {
    var placed = false
    
    const [tapVolumeHeight, tapVolumeRadius] = 
      this.data['touch-target'].split(' ').map(v => Number(v))
    const touchTargetAlpha = this.data['show-touch-target'] ? 0.2 : 0.0
    
    const hvo = new HoloVideoObjectThreeJS(
      this.el.sceneEl.renderer, 
      (mesh) => {
        mesh.position.set(0, 0, 0)
        mesh.rotation.set(0, -3.14, 0)
        mesh.castShadow = true
        this.el.object3D.add(mesh)
        this.hvo = hvo
      })

    hvo.open(this.data.url, {autoloop:true, audioEnabled:true})
   
    const newElement = this.el
    newElement.setAttribute('visible', 'false')

    const ground = document.getElementById('ground')
    const prompt = document.getElementById('promptText')
      
    // Add a cylinder primitive is used to receive raycasting for gestures. It is raised slightly
    // off the ground to support tapping on the ground.
    newElement.insertAdjacentHTML('beforeend', `
      <a-entity 
        geometry="primitive: cylinder; height: ${tapVolumeHeight - .15}; radius: ${tapVolumeRadius}" 
        material="transparent: true; opacity: ${touchTargetAlpha}; depthTest: false;" 
        position="0 ${(tapVolumeHeight - 0.15) * 0.5 + 0.15} 0" 
        class="cantap" 
        shadow="cast: false; receive: false">
      </a-entity>`)
    
    this.placeHologram = e => {
      // Dismiss the prompt text.
      prompt.style.display = "none"
      
      // Make the hologram visibile at the touch point and start playback.
      newElement.setAttribute('visible', 'true')
      const touchPoint = event.detail.intersection.point
      newElement.setAttribute('position', touchPoint)
      hvo.play()

      // Animate hologram in from a small scale to its end scale.      
      const minS = this.data.scale / 50
      const maxS = this.data.scale
      newElement.setAttribute('scale', `${minS} ${minS} ${minS}`)
      newElement.setAttribute('animation', {
        property: 'scale',
        to: `${maxS} ${maxS} ${maxS}`,
        easing: 'easeOutElastic',
        dur: 800,
      })
      
      placed = true
    }
    
    if (!placed) {
      ground.addEventListener('mousedown', this.placeHologram, {once: true})
    }
  },
  tick: function() {
     if (this.hvo) {
       this.hvo.update()
     }
  }
})

const hcapPrimitive = () => ({
  defaultComponents: {
    hcap: {},
  },
  mappings: {
    'src': 'hcap.url',
    'holo-scale': 'hcap.scale',
    'holo-touch-target': 'hcap.touch-target',
    'holo-show-touch-target': 'hcap.show-touch-target',
  }
})

AFRAME.registerComponent('hcap', hcapComponent())
AFRAME.registerPrimitive('holo-cap', hcapPrimitive())
