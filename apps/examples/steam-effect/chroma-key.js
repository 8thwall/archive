const chromaKeyShader = {
  schema: {
    src: {type: 'map'},
    color: {default: {x: 0.1, y: 0.9, z: 0.2}, type: 'vec3', is: 'uniform'},
    opacity: {default: 1.0},
    transparent: {default: true, is: 'uniform'},
  },

  init(data) {
    const video = data.src  // Assuming this is a video element
    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.minFilter = THREE.LinearFilter

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        color: {
          type: 'c',
          value: data.color,
        },
        myTexture: {
          type: 't',
          value: videoTexture,
        },
        opacity: {
          type: 'f',
          value: data.opacity,
        },
        resolution: {  // Add resolution uniform
          type: 'v2',
          value: new THREE.Vector2(video.videoWidth, video.videoHeight),
        },
      },
      vertexShader: this.vertexShader,
      fragmentShader: this.fragmentShader,
      transparent: true,  // Ensure material is transparent
    })

    this.material.opacity = data.opacity
  },

  update(data) {
    this.material.uniforms.color.value = data.color
    this.material.uniforms.opacity.value = data.opacity
    this.material.transparent = data.transparent

    // Update resolution if video size changes
    const video = data.src  // Assuming this is a video element
    this.material.uniforms.resolution.value.set(video.videoWidth, video.videoHeight)

    this.material.uniformsNeedUpdate = true
  },

  vertexShader: [
    'varying vec2 vUv;',
    'void main(void)',
    '{',
    'vUv = uv;',
    'vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );',
    'gl_Position = projectionMatrix * mvPosition;',
    '}',
  ].join('\n'),

  fragmentShader: [
    'uniform sampler2D myTexture;',
    'uniform vec3 color;',
    'uniform float opacity;',
    'varying vec2 vUv;',
    'uniform vec2 resolution;',  // Add resolution uniform
    'void main(void)',
    '{',
    'vec3 tColor = texture2D( myTexture, vUv ).rgb;',
    'float a = (length(tColor - color) - 0.5) * 7.0;',

    // Calculate fade effect
    'float fadeHeight = 125.0 / resolution.y;',
    'float alphaFade = mix(1.0, 0.0, max(0.0, (vUv.y - (1.0 - fadeHeight)) / fadeHeight));',

    // Apply fade effect to alpha
    'gl_FragColor = vec4(tColor, a * opacity * alphaFade);',
    '}',
  ].join('\n'),

}

export {chromaKeyShader}
