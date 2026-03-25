// This function processes the ShaderFrog JSON export for Three.js.
function importShaderFrog(shaderName, importedShaderJSON, defaults) {
  // Parse the shader JSON.
//   importedShaderJSON = JSON.parse(importedShaderJSON)

  // Create the AFRAME shader template.
  const importedShader = {
    raw: true,
    schema: {},
    vertexShader: importedShaderJSON.vertex,
    fragmentShader: importedShaderJSON.fragment,
  }

  // This maps (name and) JSON glslType to AFRAME shader schema type.
  function remap(key, GLSLtype) {
    if (key === 'time') return 'time'
    if (key === 'color') return 'color'
    if (GLSLtype === 'sampler2D') return 'map'
    if (GLSLtype === 'float') return 'number'
    return GLSLtype
  }

  // This maps (name and) JSON glslType to AFRAME shader schema default.
  function remapDefault(key, type) {
    if (key === 'time') return 0
    if (type === 'vec2') return {x: 0, y: 0}
    if (type === 'vec3') return {x: 0, y: 0, z: 0}
    if (type === 'float') return 0
    return undefined
  }

  function replaceRGBWithXYZ(vec3) {
    if ('r' in vec3 && 'g' in vec3 && 'b' in vec3) {
      return {x: vec3.r, y: vec3.g, z: vec3.b}
    } else {
      return vec3
    }
  }

  // Build schema from uniforms, remapping type as appropriate.
  Object.keys(importedShaderJSON.uniforms).map((key) => {
    importedShader.schema[key] = {
      is: 'uniform',
      type: remap(key, importedShaderJSON.uniforms[key].glslType),
      default: (defaults && defaults[key]) || importedShaderJSON.uniforms[key].value || remapDefault(key, importedShaderJSON.uniforms[key].glslType),
    }
  })

  Object.keys(importedShader.schema).map((key) => {
    key = importedShader.schema[key]
    if (key.type === 'number') {
      key.default = parseFloat(key.default)
    }

    if (key.type === 'vec3') {
      if (typeof key.default.z === 'string') {
        key.default.z = parseFloat(key.default.z)
      }
      if (typeof key.default.y === 'string') {
        key.default.y = parseFloat(key.default.y)
      }
      if (typeof key.default.x === 'string') {
        key.default.x = parseFloat(key.default.x)
      }
      key.default = replaceRGBWithXYZ(key.default)
    }
  })

  // FIXME: in A-Frame, time uniforms are in msec, not seconds
  // if (importedShader.schema.time) {
  //   // replace the definition of uniform time with time1000
  //   const vertexShader = importedShader.vertexShader.replace('uniform float time;', 'uniform float time1000;\nfloat time;')
  //   importedShader.schema.time1000 = importedShader.schema.time
  //   delete importedShader.schema.time

  //   // find the right place to insert time1000 division, and do it
  //   const mainIndex = vertexShader.indexOf('main(')
  //   const insertCodeIndex = vertexShader.indexOf('{', mainIndex) + 1
  //   importedShader.fragmentShader = `${vertexShader.substring(0, insertCodeIndex)}time = time1000 / 1000.0;\n${vertexShader.substring(insertCodeIndex)}`
  // }

  // register the shader with A-Frame
  AFRAME.registerShader(shaderName, importedShader)
}

if (AFRAME && AFRAME.utils) {
  AFRAME.utils.importShaderFrog = importShaderFrog
}
