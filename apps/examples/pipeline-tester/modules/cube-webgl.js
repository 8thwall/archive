/* globals mat4 */

// creates a shader of the given type, uploads the source and compiles it.
const loadShader = (gl, type, source) => {
  const shader = gl.createShader(type)

  // Send the source to the shader object
  gl.shaderSource(shader, source)

  // Compile the shader program
  gl.compileShader(shader)

  // See if it compiled successfully
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(`An error occurred compiling the shaders: ${gl.getShaderInfoLog(shader)}`)
  }

  return shader
}

// Initialize a shader program, so WebGL knows how to draw our data
const initShaderProgram = (gl, vsSource, fsSource) => {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vsSource)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fsSource)

  // Create the shader program
  const shaderProgram = gl.createProgram()
  gl.attachShader(shaderProgram, vertexShader)
  gl.attachShader(shaderProgram, fragmentShader)
  gl.linkProgram(shaderProgram)

  // If creating the shader program failed, error
  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    throw new Error(`Unable to initialize the shader program: ${gl.getProgramInfoLog(shaderProgram)}`)
  }

  return shaderProgram
}

// Initialize the buffers we'll need. For this demo, we just have one object -- a simple
// three-dimensional cube.
const initScene = (gl) => {
  // Create a buffer for the cube's vertex positions.
  const positionBuffer = gl.createBuffer()

  // Select the positionBuffer as the one to apply buffer operations to from here out.
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)

  // Now create an array of positions for the cube.
  const positions = [
    // Front face
    -1.0, -1.0, 1.0,
    1.0, -1.0, 1.0,
    1.0, 1.0, 1.0,
    -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0, 1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0,
    -1.0, 1.0, 1.0,
    1.0, 1.0, 1.0,
    1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0, 1.0,
    -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0, 1.0, -1.0,
    1.0, 1.0, 1.0,
    1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0, 1.0,
    -1.0, 1.0, 1.0,
    -1.0, 1.0, -1.0,
  ]

  // Now pass the list of positions into WebGL to build the shape. We do this by creating a
  // Float32Array from the JavaScript array, then use it to fill the current buffer.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  // Now set up the colors for the faces. We'll use solid colors for each face.
  const faceColors = [
    [1.0, 1.0, 1.0, 1.0],  // Front face: white
    [1.0, 0.0, 0.0, 1.0],  // Back face: red
    [0.0, 1.0, 0.0, 1.0],  // Top face: green
    [0.0, 0.0, 1.0, 1.0],  // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0],  // Right face: yellow
    [1.0, 0.0, 1.0, 1.0],  // Left face: purple
  ]

  // Convert the array of colors into a table for all the vertices. Each color is repeated 4 times
  // for the face vertices.
  const colors = faceColors.reduce((o, c) => o.concat(c, c, c, c), [])

  const colorBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW)

  // Build the element array buffer; this specifies the indices into the vertex arrays for each
  // face's vertices.
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

  // This array defines each face as two triangles, using the indices into the vertex array to
  // specify each triangle's position.
  const indices = [
    0, 1, 2, 0, 2, 3,        // front
    4, 5, 6, 4, 6, 7,        // back
    8, 9, 10, 8, 10, 11,     // top
    12, 13, 14, 12, 14, 15,  // bottom
    16, 17, 18, 16, 18, 19,  // right
    20, 21, 22, 20, 22, 23,  // left
  ]

  // Now send the element array to GL
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW)

  // If we don't have a GL context, give up now
  if (!gl) {
    throw new Error('Unable to initialize WebGL. Your browser or machine may not support it.')
  }

  // Vertex shader program
  const vsSource = `
    attribute vec4 aVertexPosition;
    attribute vec4 aVertexColor;
    uniform mat4 uMvp;
    varying lowp vec4 vColor;
    void main(void) {
      gl_Position = uMvp * aVertexPosition;
      vColor = aVertexColor;
    }
  `

  // Fragment shader program
  const fsSource = `
    varying lowp vec4 vColor;
    void main(void) {
      gl_FragColor = vColor;
    }
  `

  // Initialize a shader program; this is where all the lighting for the vertices and so forth is
  // established.
  const shaderProgram = initShaderProgram(gl, vsSource, fsSource)

  // Create a perspective matrix, a special matrix that is used to simulate the distortion of
  // perspective in a camera. Our field of view is 45 degrees, with a width/height ratio that
  // matches the display size of the canvas and we only want to see objects between 0.1 units and
  // 100 units away from the camera.
  const fieldOfView = (45 * Math.PI) / 180  // in radians
  const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight
  const zNear = 0.1
  const zFar = 100.0
  const projectionMatrix = mat4.create()

  // note: glmatrix.js always has the first argument as the destination to receive the result.
  mat4.perspective(projectionMatrix, fieldOfView, aspect, zNear, zFar)

  // Set the drawing position to the "identity" point, which is the center of the scene.
  const modelMatrix = mat4.create()

  // Set the drawing position to the "identity" point, which is the center of the scene.
  const viewMatrix = mat4.create()

  // Now move the drawing position a bit to where we want to start drawing the square.
  const s = 1 / 6
  mat4.fromRotationTranslationScale(modelMatrix, [0, 0, 0, 1], [0, s, -1], [s, s, s])

  return {
    buffers: {
      position: positionBuffer,
      color: colorBuffer,
      indices: indexBuffer,
    },
    programInfo: {
      program: shaderProgram,
      attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexColor: gl.getAttribLocation(shaderProgram, 'aVertexColor'),
      },
      uniformLocations: {
        mvp: gl.getUniformLocation(shaderProgram, 'uMvp'),
      },
    },
    mvp: {
      model: modelMatrix,
      view: viewMatrix,
      projection: projectionMatrix,
    },
  }
}
const shaderMvp = mat4.create()

const drawScene = (gl, {programInfo, buffers, mvp}, clear, viewport) => {
  gl.clearColor(0.0, 0.0, 0.0, 1.0)  // Clear to black, fully opaque
  gl.clearDepth(1.0)                 // Clear everything
  gl.enable(gl.DEPTH_TEST)           // Enable depth testing
  gl.depthFunc(gl.LEQUAL)            // Near things obscure far things

  // Clear the canvas before we start drawing on it.
  if (clear) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
  } else {
    gl.clear(gl.DEPTH_BUFFER_BIT)
  }

  // Tell WebGL how to pull out the positions from the position buffer into the vertexPosition
  // attribute.
  {
    const numComponents = 3
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexPosition,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition)
  }

  // Tell WebGL how to pull out the colors from the color buffer into the vertexColor attribute.
  {
    const numComponents = 4
    const type = gl.FLOAT
    const normalize = false
    const stride = 0
    const offset = 0
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color)
    gl.vertexAttribPointer(
      programInfo.attribLocations.vertexColor,
      numComponents,
      type,
      normalize,
      stride,
      offset
    )
    gl.enableVertexAttribArray(programInfo.attribLocations.vertexColor)
  }

  // Tell WebGL which indices to use to index the vertices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices)

  // Tell WebGL to use our program when drawing
  gl.useProgram(programInfo.program)

  mat4.multiply(shaderMvp, mvp.projection, mvp.view)
  mat4.multiply(shaderMvp, shaderMvp, mvp.model)

  // Set the shader uniforms
  gl.uniformMatrix4fv(programInfo.uniformLocations.mvp, false, shaderMvp)

  {
    const vertexCount = 36
    const type = gl.UNSIGNED_SHORT
    const offset = 0
    if (viewport) {
      gl.viewport(viewport.x, viewport.y, viewport.width, viewport.height)
    } else {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
    }
    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset)
  }
}

const webGlSceneModule = () => {
  let scene_ = null
  let gl_ = null
  let then_ = 0

  return {
    name: 'webglscene',
    onAttach: ({GLctx}) => {
      gl_ = GLctx
      scene_ = initScene(gl_)
      XR8.XrController.updateCameraProjectionMatrix({
        origin: {x: 0, y: 1, z: 0},
        facing: {w: 1, x: 0, y: 0, z: 0},
      })
    },
    onUpdate: ({processCpuResult}) => {
      const {reality} = processCpuResult
      if (!reality || !reality.intrinsics) {
        return
      }
      const now = Date.now()
      const {model, view, projection} = scene_.mvp
      mat4.rotate(model, model, (now - then_) * 1e-3, [0, 1, 0])  // axis to rotate around (Y)
      then_ = now

      const {rotation: r, position: p, intrinsics} = reality
      mat4.copy(projection, intrinsics)
      mat4.fromRotationTranslation(view, [r.x, r.y, r.z, r.w], [p.x, p.y, p.z])
      mat4.invert(view, view)
    },
    onRender: () => {
      drawScene(gl_, scene_, false)
    },
  }
}

export {
  webGlSceneModule,
}
