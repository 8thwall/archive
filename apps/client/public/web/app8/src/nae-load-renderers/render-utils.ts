const createShader =
  (gl: WebGL2RenderingContext, type: number, source: string): WebGLShader | null => {
    const shader = gl.createShader(type)
    if (!shader) {
      throw new Error('Failed to create shader.')
    }
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      gl.deleteShader(shader)
      throw new Error(`Failed to compile shader: ${gl.getShaderInfoLog(shader)}`)
    }
    return shader
  }

const createProgram =
  (gl: WebGL2RenderingContext, vertexShader: WebGLShader, fragmentShader: WebGLShader):
  WebGLProgram | null => {
    const program = gl.createProgram()
    if (!program) {
      throw new Error('Failed to create program.')
    }
    gl.attachShader(program, vertexShader)
    gl.attachShader(program, fragmentShader)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program)
      throw new Error(`Failed to link program: ${gl.getProgramInfoLog(program)}`)
    }
    return program
  }

// TODO(akashmahesh): Add unit tests for this function.
const getEffectAlpha = (isFadingOut: boolean, startTime: number,
  timestamp: number, duration: number): number => {
  const deltaTime = isFadingOut ? Math.min(timestamp - startTime, duration) : timestamp - startTime
  return Math.min(1.0, deltaTime / duration)
}

export {
  createShader,
  createProgram,
  getEffectAlpha,
}
