/* globals mat4 */
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

export {
  drawScene,
}
