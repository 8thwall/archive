export const setShaderFrogComponent = {
  init() {
    const fire = document.getElementById('fire')

    const shaderURL = require('./Fireball.json')

    // box.setAttribute('shader-frog', {src: shaderURL})

    const textureLoader = new THREE.TextureLoader()
    // const randomTexture = textureLoader.load(require('./assets/textures/static.jpg'))

    // Import the shader.
    AFRAME.utils.importShaderFrog(
      'fire',  // shader name
      shaderURL,  // shader JSON string,
      {
        // resolution: {x: 10, y: 10},
        // zbackgroundColor: {x: 0, y: 10, z: 0},
      }
    )

    fire.setAttribute('material', {shader: 'fire'})
  },
}
