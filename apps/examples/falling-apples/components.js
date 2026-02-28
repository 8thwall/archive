const selfDestructComponent = {
  init() {
    setTimeout(() => {
      this.el.parentNode.removeChild(this.el)
    }, 2000)
  },
}

const dropObjectComponent = {
  init() {
    const head = document.querySelector('xrextras-faceanchor')

    setInterval(() => {
      const headPos = head.object3D.position

      this.el.insertAdjacentHTML('beforeend',
        `
          <a-entity 
          position="${headPos.x} ${headPos.y + 1} ${headPos.z}"
          self-destruct
          scale="0.1 0.1 0.1"
          
          gltf-model="#apple"
          ammo-body="type: dynamic" 
          ammo-shape="type: sphere; fit: manual; sphereRadius: 0.07;"></a-entity>
        `)
    }, 2000)
  },
}

export {selfDestructComponent, dropObjectComponent}
