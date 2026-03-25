const vertexShader = 'varying vec3 vWorldPosition;\n\nvoid main() {\n\tvec4 worldPosition = modelMatrix * vec4( position, 1.0 );\n\tvWorldPosition = worldPosition.xyz;\n\tgl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );\n}'
const fragmentShader = 'uniform vec3 bottomColor;\nuniform vec3 topColor;\nuniform float offset;\nuniform float exponent;\nvarying vec3 vWorldPosition;\n\nvoid main() {\n    float h = normalize( vWorldPosition + offset ).y;\n    float rB = bottomColor.x/255.0;\n    float gB = bottomColor.y/255.0;\n    float bB = bottomColor.z/255.0;\n    vec3 bColor = vec3(rB,gB,bB);\n    float rT = topColor.x/255.0;\n    float gT = topColor.y/255.0;\n    float bT = topColor.z/255.0;\n    vec3 tColor = vec3(rT,gT,bT);\n    gl_FragColor = vec4( mix( bColor, tColor, max( pow( max( h, 0.0 ), exponent ), 0.0 ) ), 1.0 );\n}'

const gradientSkyShader = {
  schema: {
    topColor: {type: 'vec3', default: '255 0 0', is: 'uniform'},
    bottomColor: {type: 'vec3', default: '0 0 255', is: 'uniform'},
    offset: {type: 'number', default: '400', is: 'uniform'},
    exponent: {type: 'number', default: '0.6', is: 'uniform'},
  },
  vertexShader,
  fragmentShader,
}

const gradientSkyPrimitive = {
  defaultComponents: {
    geometry: {
      primitive: 'sphere',
      radius: 5000,
      segmentsWidth: 64,
      segmentsHeight: 20,
    },
    material: {
      shader: 'gradient',
    },
    scale: '-1 1 1',
  },

  mappings: {
    topColor: 'material.topColor',
    bottomColor: 'material.bottomColor',
    offset: 'material.offset',
    exponent: 'material.exponent',
  },
}

export {gradientSkyShader, gradientSkyPrimitive}
