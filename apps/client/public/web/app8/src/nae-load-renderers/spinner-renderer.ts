import {createShader, createProgram} from './render-utils'

type SpinnerInit = {
  gl: WebGL2RenderingContext
}

type SpinnerRenderer = {
  draw: () => void
  cleanup: () => void
}

const createSpinnerVertices = () => {
  const vertices: number[] = []
  const indices: number[] = []
  const segments = 64
  const startAngle = 0
  const endAngle = Math.PI * 1.5  // Mock loading, fills the spinner ring 75%
  const innerRadius = 0.08
  const outerRadius = 0.1

  // NOTE: constructing a ring of vertices by incrementing an angle for inner/outer Radius,
  // then stitching them together in an interleaved way to create triangle indices using base.
  for (let i = 0; i <= segments; i++) {
    const angle = startAngle + (endAngle - startAngle) * (i / segments)
    const cosVal = Math.cos(angle)
    const sinVal = Math.sin(angle)

    vertices.push(innerRadius * cosVal, innerRadius * sinVal)
    vertices.push(outerRadius * cosVal, outerRadius * sinVal)
  }

  for (let i = 0; i < segments; i++) {
    const base = i * 2

    indices.push(base, base + 1, base + 2)

    indices.push(base + 1, base + 3, base + 2)
  }

  return {vertices, indices}
}

const createSpinnerRenderer = ({gl}: SpinnerInit): SpinnerRenderer | undefined => {
  if (!gl) {
    // eslint-disable-next-line no-console
    console.error('[spinner-renderer] WebGL context is not initialized')
    return undefined
  }

  const spinnerVs = `#version 300 es
    in vec2 a_position;
    uniform mat3 u_rotationMatrix;
    uniform vec2 u_aspectScale;

    void main() {
      vec2 rotatedPosition = (u_rotationMatrix * vec3(a_position, 1.0)).xy;
      rotatedPosition *= u_aspectScale;
      gl_Position = vec4(rotatedPosition, 0.0, 1.0);
    }
  `

  const spinnerFs = `#version 300 es
    precision mediump float;
    uniform vec4 u_color;
    out vec4 fragColor;
    void main() {
      fragColor = u_color;
    }
  `

  let vertexShader = createShader(gl, gl.VERTEX_SHADER, spinnerVs)
  let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, spinnerFs)
  if (!vertexShader || !fragmentShader) {
    // eslint-disable-next-line no-console
    console.error('[spinner-renderer] Failed to create shaders')
    return undefined
  }

  let spinnerProgram = createProgram(gl, vertexShader, fragmentShader)
  if (!spinnerProgram) {
    // eslint-disable-next-line no-console
    console.error('[spinner-renderer] Failed to create program')
    return undefined
  }

  const {vertices: spinnerVertices, indices: spinnerIndices} = createSpinnerVertices()

  let positionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(spinnerVertices), gl.STATIC_DRAW)

  let indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(spinnerIndices), gl.STATIC_DRAW)

  const positionLocation = gl.getAttribLocation(spinnerProgram, 'a_position')
  const rotationMatrixLocation = gl.getUniformLocation(spinnerProgram, 'u_rotationMatrix')
  const colorLocation = gl.getUniformLocation(spinnerProgram, 'u_color')
  const aspectScaleLocation = gl.getUniformLocation(spinnerProgram, 'u_aspectScale')

  let rotationAngle = 0

  const draw = () => {
    rotationAngle += 0.05

    const cosVal = Math.cos(rotationAngle)
    const sinVal = Math.sin(rotationAngle)
    const rotationMatrix = new Float32Array([
      cosVal, -sinVal, 0,
      sinVal, cosVal, 0,
      0, 0, 1,
    ])

    gl.useProgram(spinnerProgram)

    const aspectRatio = gl.canvas.width / gl.canvas.height
    if (aspectRatio > 1.0) {
      gl.uniform2f(aspectScaleLocation, 1.0 / aspectRatio, 1.0)
    } else {
      gl.uniform2f(aspectScaleLocation, 1.0, aspectRatio)
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    gl.enableVertexAttribArray(positionLocation)
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0)

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)

    gl.uniformMatrix3fv(rotationMatrixLocation, false, rotationMatrix)
    gl.uniform4f(colorLocation, 1.0, 1.0, 1.0, 1.0)  // White color

    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    gl.drawElements(gl.TRIANGLES, spinnerIndices.length, gl.UNSIGNED_SHORT, 0)

    gl.disable(gl.BLEND)
  }

  const cleanup = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
    gl.useProgram(null)
    gl.deleteBuffer(positionBuffer)
    gl.deleteBuffer(indexBuffer)
    gl.deleteProgram(spinnerProgram)
    gl.deleteShader(vertexShader)
    gl.deleteShader(fragmentShader)
    positionBuffer = null
    indexBuffer = null
    spinnerProgram = null
    vertexShader = null
    fragmentShader = null
  }

  return {
    draw,
    cleanup,
  }
}

export {
  SpinnerRenderer,
  createSpinnerRenderer,
}
