import {createProgram, createShader, getEffectAlpha} from './render-utils'

const FADE_IN_DURATION_MS = 2000

type GradientInit = {
  gl: WebGL2RenderingContext
  colorCenter: [number, number, number, number]
  colorMiddle: [number, number, number, number]
  colorEdge: [number, number, number, number]
}

type GradientRenderer = {
  draw: (overallAlpha: number, isFadingOut: boolean, startTime: number, timestamp: number) => void
  cleanup: () => void
}

const createGradientRenderer = ({gl, colorCenter, colorMiddle, colorEdge}: GradientInit) => {
  if (!gl) {
    throw new Error('[splash-gradient-renderer] WebGL context is not initialized')
  }

  const gradientVs = `
          attribute vec2 a_position;
          varying vec2 v_texCoord; // Will range from 0.0 to 1.0
          void main() {
              gl_Position = vec4(a_position, 0.0, 1.0);
              v_texCoord = a_position * 0.5 + 0.5; // Convert clip space -1..1 to 0..1
          }
      `
  const gradientFs = `
          precision mediump float;
          varying vec2 v_texCoord;
          uniform float u_alpha;

          uniform vec4 u_colorCenter;
          uniform vec4 u_colorMiddle;
          uniform vec4 u_colorEdge;

          uniform float u_globalAlpha;
          uniform float u_aspectRatio;

          void main() {
              vec2 centered_st = v_texCoord - vec2(0.5);
              centered_st.y /= u_aspectRatio;
              float dist_from_center_point = length(centered_st);
              float normalized_dist = clamp(dist_from_center_point / 0.5, 0.0, 1.0);

              vec4 final_color;
              float middle_stop_norm = 0.5; // Color changes at 50% of the normalized distance

              if (normalized_dist < middle_stop_norm) {
                  float t = normalized_dist / middle_stop_norm;
                  final_color = mix(u_colorCenter, u_colorMiddle, t);
              } else {
                  float t = (normalized_dist - middle_stop_norm) / (1.0 - middle_stop_norm);
                  final_color = mix(u_colorMiddle, u_colorEdge, t);
              }

              gl_FragColor = vec4(final_color.rgb, final_color.a * u_alpha * u_globalAlpha);
          }
      `

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, gradientVs)
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, gradientFs)
  if (!vertexShader || !fragmentShader) {
    throw new Error('[splash-gradient-renderer] Failed to create shaders')
  }
  const gradientProgram = createProgram(gl, vertexShader, fragmentShader)
  if (!gradientProgram) {
    throw new Error('[splash-gradient-renderer] Failed to create gradient program')
  }
  const gradientColorCenterLocation = gl.getUniformLocation(gradientProgram, 'u_colorCenter')
  const gradientColorMiddleLocation = gl.getUniformLocation(gradientProgram, 'u_colorMiddle')
  const gradientColorEdgeLocation = gl.getUniformLocation(gradientProgram, 'u_colorEdge')
  const globalAlphaLocationGradient = gl.getUniformLocation(gradientProgram, 'u_globalAlpha')
  const gradientAlphaLocation = gl.getUniformLocation(gradientProgram, 'u_alpha')
  const aspectRatioLocation = gl.getUniformLocation(gradientProgram, 'u_aspectRatio')
  const gradientPositionBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, gradientPositionBuffer)
  const positions = [-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

  const cleanup = () => {
    gl.deleteBuffer(gradientPositionBuffer)
    gl.deleteProgram(gradientProgram)
  }

  const draw = (overallAlpha: number, isFadingOut: boolean,
    startTime: number, timestamp: number) => {
    if (!gradientProgram || !gradientColorCenterLocation ||
      !gradientColorMiddleLocation || !gradientColorEdgeLocation ||
      !globalAlphaLocationGradient || !gradientPositionBuffer) {
      return
    }

    const specificAlpha = getEffectAlpha(isFadingOut, startTime, timestamp, FADE_IN_DURATION_MS)

    gl.useProgram(gradientProgram)

    const aspectRatio = gl.canvas.width / gl.canvas.height
    gl.uniform1f(aspectRatioLocation, aspectRatio)

    gl.uniform4fv(gradientColorCenterLocation, colorCenter)
    gl.uniform4fv(gradientColorMiddleLocation, colorMiddle)
    gl.uniform4fv(gradientColorEdgeLocation, colorEdge)
    gl.uniform1f(globalAlphaLocationGradient, overallAlpha)
    gl.uniform1f(gradientAlphaLocation, specificAlpha)

    const posAttrLoc = gl.getAttribLocation(gradientProgram, 'a_position')
    gl.enableVertexAttribArray(posAttrLoc)
    gl.bindBuffer(gl.ARRAY_BUFFER, gradientPositionBuffer)
    gl.vertexAttribPointer(posAttrLoc, 2, gl.FLOAT, false, 0, 0)

    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    gl.disable(gl.BLEND)
  }

  return {
    draw,
    cleanup,
  }
}

export {
  GradientRenderer,
  createGradientRenderer,
}
