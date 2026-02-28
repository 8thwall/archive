/**
 * Originally forked from ARCore sample applications.
 *
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.the8thwall.reality.app.sensors.arcore;

import com.the8thwall.c8.opengl.ShaderUtil;

import android.opengl.EGL14;
import android.opengl.GLES11Ext;
import android.opengl.GLES20;
import android.opengl.GLES30;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.IntBuffer;

/**
 * Helper class for ARCore apps to read camera image from an OpenGL OES texture.
 *
 * <p>This class provides two methods for reading pixels from a texture:
 *
 * <p>(A) All-in-one method: this method utilizes two frame buffers. It does not block the caller
 * thread. Instead it submits a reading request to read pixel to back buffer from the current
 * texture, and returns pixels from the front buffer bund to texture supplied to the previous call
 * to this function. This can be done by calling submitAndAcquire() function.
 *
 * <p>(B) Asychronous method: this method utilizes multiple frame buffers and it does not block the
 * caller thread. This method allows you to read a texture in a lower frequency than rendering
 * frequency(Calling submitAndAcquire() in a lower frequency will result in an "old" image buffer
 * that was submitted a few frames ago). This method contains three routines: submitFrame(),
 * acquireFrame() and releaseFrame().
 *
 * <p>First, you call submitFrame() to submit a frame reading request. GPU will start the reading
 * process in background:
 *
 * <p>bufferIndex = submitFrame(textureId, textureWidth, textureHeight);
 *
 * <p>Second, you call acquireFrame() to get the actual image frame:
 *
 * <p>imageBuffer = acquireFrame(bufferIndex);
 *
 * <p>Last, when you finish using of the imageBuffer retured from acquireFrame(), you need to
 * release the associated frame buffer so that you can reuse it in later frame:
 *
 * <p>releaseFrame(bufferIndex);
 *
 * <p>Note: To use any of the above two methods, you need to call create() routine to initialize the
 * reader before calling any of the reading routine. You will also need to call destroy() method to
 * release the internal resource when you are done with the reader.
 */
public class ARCoreTextureReader {

  public static final class CameraImage {
    public final ByteBuffer bytes;
    public final int width;
    public final int height;

    CameraImage(ByteBuffer bytes, int width, int height) {
      this.bytes = bytes;
      this.width = width;
      this.height = height;
    }
  }

  private static final int BUFFER_COUNT = 2;
  private static final int COORDS_PER_VERTEX = 3;
  private static final int TEXCOORDS_PER_VERTEX = 2;
  private static final int FLOAT_SIZE = 4;
  private static final float[] QUAD_COORDS = new float[] {
    -1.0f, -1.0f, 0.0f, -1.0f, +1.0f, 0.0f, +1.0f, -1.0f, 0.0f, +1.0f, +1.0f, 0.0f,
  };

  private static final float[] QUAD_TEXCOORDS = new float[] {
    0.0f, 0.0f, 0.0f, 1.0f, 1.0f, 0.0f, 1.0f, 1.0f,
  };

  private static final String QUAD_RENDERING_VERTEX_SHADER = "// Vertex shader.\n"
    + "attribute vec4 a_Position;\n"
    + "attribute vec2 a_TexCoord;\n"
    + "varying vec2 v_TexCoord;\n"
    + "void main() {\n"
    + "   gl_Position = a_Position;\n"
    + "   v_TexCoord = vec2(a_TexCoord.y, 1.0 - a_TexCoord.x);\n"
    + "}";

  private static final String QUAD_RENDERING_FRAGMENT_SHADER_RGBA =
    "// Fragment shader that renders to a RGBA texture.\n"
    + "#extension GL_OES_EGL_image_external : require\n"
    + "precision mediump float;\n"
    + "varying vec2 v_TexCoord;\n"
    + "uniform samplerExternalOES sTexture;\n"
    + "void main() {\n"
    + "    gl_FragColor = texture2D(sTexture, v_TexCoord);\n"
    + "}";

  private int[] frameBuffer_;
  private int[] texture_;
  private int[] pBO_;
  private Boolean[] bufferUsed_;
  private int frontIndex_ = -1;
  private int backIndex_ = -1;

  private int imageWidth_ = 0;
  private int imageHeight_ = 0;
  private int pixelBufferSize_ = 0;
  private Boolean keepAspectRatio_ = false;

  private FloatBuffer quadVertices_;
  private FloatBuffer quadTextCoord_;
  private int quadProgram_;
  private int quadPositionAttrib_;
  private int quadTexCoordAttrib_;

  private CameraGLContextHelper glContextHelper_;

  /**
   * Creates the texture reader.
   * This function needs to be called from the OpenGL rendering thread.
   *
   * @param width the width of the output image.
   * @param height the height of the output image.
   * @param keepAspectRatio whether or not to keep aspect ratio. If true, the output image may be
   *     cropped if the image aspect ratio is different from the texture aspect ratio. If false,
   *     the output image covers the entire texture scope and no cropping is applied.
   */
  public void create(int width, int height, Boolean keepAspectRatio) {
    keepAspectRatio_ = keepAspectRatio;
    imageWidth_ = width;
    imageHeight_ = height;
    frontIndex_ = -1;
    backIndex_ = -1;
    pixelBufferSize_ = imageWidth_ * imageHeight_ * 4;
    glContextHelper_ = new CameraGLContextHelper(width, height);

    if (EGL14.eglGetCurrentContext() == EGL14.EGL_NO_CONTEXT) {
      glContextHelper_.resume(EGL14.EGL_NO_CONTEXT);
      glContextHelper_.setAsCurrentContext();
    }

    // Create framebuffers and PBOs.
    pBO_ = new int[BUFFER_COUNT];
    frameBuffer_ = new int[BUFFER_COUNT];
    texture_ = new int[BUFFER_COUNT];
    bufferUsed_ = new Boolean[BUFFER_COUNT];
    GLES30.glGenBuffers(BUFFER_COUNT, pBO_, 0);
    GLES20.glGenFramebuffers(BUFFER_COUNT, frameBuffer_, 0);
    GLES20.glGenTextures(BUFFER_COUNT, texture_, 0);

    for (int i = 0; i < BUFFER_COUNT; i++) {
      bufferUsed_[i] = false;
      GLES20.glBindFramebuffer(GLES20.GL_FRAMEBUFFER, frameBuffer_[i]);

      GLES20.glBindTexture(GLES20.GL_TEXTURE_2D, texture_[i]);
      GLES30.glTexImage2D(
        GLES30.GL_TEXTURE_2D,
        0,
        GLES30.GL_RGBA,
        imageWidth_,
        imageHeight_,
        0,
        GLES30.GL_RGBA,
        GLES30.GL_UNSIGNED_BYTE,
        null);
      GLES20.glTexParameteri(
        GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_S, GLES20.GL_CLAMP_TO_EDGE);
      GLES20.glTexParameteri(
        GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_WRAP_T, GLES20.GL_CLAMP_TO_EDGE);
      GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR);
      GLES20.glTexParameteri(GLES20.GL_TEXTURE_2D, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR);
      GLES20.glFramebufferTexture2D(
        GLES20.GL_FRAMEBUFFER, GLES20.GL_COLOR_ATTACHMENT0, GLES20.GL_TEXTURE_2D, texture_[i], 0);

      int status = GLES20.glCheckFramebufferStatus(GLES20.GL_FRAMEBUFFER);
      if (status != GLES20.GL_FRAMEBUFFER_COMPLETE) {
        throw new RuntimeException(
          this + ": Failed to set up render buffer with status " + status + " and error "
          + GLES20.glGetError());
      }

      // Setup PBOs
      GLES30.glBindBuffer(GLES30.GL_PIXEL_PACK_BUFFER, pBO_[i]);
      GLES30.glBufferData(
        GLES30.GL_PIXEL_PACK_BUFFER, pixelBufferSize_, null, GLES30.GL_DYNAMIC_READ);
      GLES30.glBindBuffer(GLES30.GL_PIXEL_PACK_BUFFER, 0);
    }

    // Load shader program.
    int numVertices = 4;
    if (numVertices != QUAD_COORDS.length / COORDS_PER_VERTEX) {
      throw new RuntimeException("Unexpected number of vertices in BackgroundRenderer.");
    }

    ByteBuffer bbVertices = ByteBuffer.allocateDirect(QUAD_COORDS.length * FLOAT_SIZE);
    bbVertices.order(ByteOrder.nativeOrder());
    quadVertices_ = bbVertices.asFloatBuffer();
    quadVertices_.put(QUAD_COORDS);
    quadVertices_.position(0);

    ByteBuffer bbTexCoords =
      ByteBuffer.allocateDirect(numVertices * TEXCOORDS_PER_VERTEX * FLOAT_SIZE);
    bbTexCoords.order(ByteOrder.nativeOrder());
    quadTextCoord_ = bbTexCoords.asFloatBuffer();
    quadTextCoord_.put(QUAD_TEXCOORDS);
    quadTextCoord_.position(0);

    int vertexShader =
      ShaderUtil.loadGLShader(GLES20.GL_VERTEX_SHADER, QUAD_RENDERING_VERTEX_SHADER);
    int fragmentShader =
      ShaderUtil.loadGLShader(GLES20.GL_FRAGMENT_SHADER, QUAD_RENDERING_FRAGMENT_SHADER_RGBA);

    quadProgram_ = GLES20.glCreateProgram();
    GLES20.glAttachShader(quadProgram_, vertexShader);
    GLES20.glAttachShader(quadProgram_, fragmentShader);
    GLES20.glLinkProgram(quadProgram_);
    GLES20.glUseProgram(quadProgram_);

    quadPositionAttrib_ = GLES20.glGetAttribLocation(quadProgram_, "a_Position");
    quadTexCoordAttrib_ = GLES20.glGetAttribLocation(quadProgram_, "a_TexCoord");
    int texLoc = GLES20.glGetUniformLocation(quadProgram_, "sTexture");
    GLES20.glUniform1i(texLoc, 0);
  }

  /** Destroy the texture reader. */
  public void destroy() {
    if (frameBuffer_ != null) {
      GLES20.glDeleteFramebuffers(BUFFER_COUNT, frameBuffer_, 0);
      frameBuffer_ = null;
    }
    if (texture_ != null) {
      GLES20.glDeleteTextures(BUFFER_COUNT, texture_, 0);
      texture_ = null;
    }
    if (pBO_ != null) {
      GLES30.glDeleteBuffers(BUFFER_COUNT, pBO_, 0);
      pBO_ = null;
    }

    glContextHelper_.pause();
  }

  /**
   * Submits a frame reading request. This routine does not return the result frame buffer
   * immediately. Instead, it returns a frame buffer index, which can be used to acquire the frame
   * buffer later through acquireFrame().
   *
   * <p>If there is no enough frame buffer available, an exception will be thrown.
   *
   * @param textureId the id of the input OpenGL texture.
   * @param textureWidth width of the texture in pixels.
   * @param textureHeight height of the texture in pixels.
   * @return the index to the frame buffer this request is associated to. You should use this
   *     index to acquire the frame using acquireFrame(); and you should release the frame buffer
   *     using releaseBuffer() routine after using of the frame.
   */
  public int submitFrame(int textureId, int textureWidth, int textureHeight) {
    // Find next buffer.
    int bufferIndex = -1;
    for (int i = 0; i < BUFFER_COUNT; i++) {
      if (!bufferUsed_[i]) {
        bufferIndex = i;
        break;
      }
    }
    if (bufferIndex == -1) {
      throw new RuntimeException("No buffer available.");
    }

    // Bind both read and write to framebuffer.
    GLES20.glBindFramebuffer(GLES20.GL_FRAMEBUFFER, frameBuffer_[bufferIndex]);

    // Save and setup viewport
    IntBuffer viewport = IntBuffer.allocate(4);
    GLES20.glGetIntegerv(GLES20.GL_VIEWPORT, viewport);
    GLES20.glViewport(0, 0, imageWidth_, imageHeight_);

    // Draw texture to framebuffer.
    drawTexture(textureId, textureWidth, textureHeight);

    // Start reading into PBO
    GLES30.glBindBuffer(GLES30.GL_PIXEL_PACK_BUFFER, pBO_[bufferIndex]);
    GLES30.glReadBuffer(GLES30.GL_COLOR_ATTACHMENT0);

    GLES30.glReadPixels(
      0, 0, imageWidth_, imageHeight_, GLES20.GL_RGBA, GLES20.GL_UNSIGNED_BYTE, 0);

    // Restore viewport.
    GLES20.glViewport(viewport.get(0), viewport.get(1), viewport.get(2), viewport.get(3));

    GLES20.glBindFramebuffer(GLES20.GL_FRAMEBUFFER, 0);
    GLES30.glBindBuffer(GLES30.GL_PIXEL_PACK_BUFFER, 0);

    bufferUsed_[bufferIndex] = true;
    return bufferIndex;
  }

  /**
   * Acquires the frame requested earlier. This routine returns a CameraImage object that
   * contains the pixels mapped to the frame buffer requested previously through submitFrame().
   *
   * <p>If input buffer index is invalid, an exception will be thrown.
   *
   * @param bufferIndex the index to the frame buffer to be acquired. It has to be a frame index
   *     returned from submitFrame().
   * @return a CameraImage object if succeed. Null otherwise.
   */
  public CameraImage acquireFrame(int bufferIndex) {
    if (bufferIndex < 0 || bufferIndex >= BUFFER_COUNT || !bufferUsed_[bufferIndex]) {
      throw new RuntimeException("Invalid buffer index.");
    }

    // Bind the current PB and acquire the pixel buffer.
    GLES30.glBindBuffer(GLES30.GL_PIXEL_PACK_BUFFER, pBO_[bufferIndex]);
    ByteBuffer mapped = (ByteBuffer)GLES30.glMapBufferRange(
      GLES30.GL_PIXEL_PACK_BUFFER, 0, pixelBufferSize_, GLES30.GL_MAP_READ_BIT);

    // Wrap the mapped buffer into CameraImage object.
    CameraImage buffer = new CameraImage(mapped, imageWidth_, imageHeight_);

    return buffer;
  }

  /**
   * Releases a previously requested frame buffer. If input buffer index is invalid, an exception
   * will be thrown.
   *
   * @param bufferIndex the index to the frame buffer to be acquired. It has to be a frame index
   *     returned from submitFrame().
   */
  public void releaseFrame(int bufferIndex) {
    if (bufferIndex < 0 || bufferIndex >= BUFFER_COUNT || !bufferUsed_[bufferIndex]) {
      throw new RuntimeException("Invalid buffer index.");
    }
    GLES30.glBindBuffer(GLES30.GL_PIXEL_PACK_BUFFER, pBO_[bufferIndex]);
    GLES30.glUnmapBuffer(GLES30.GL_PIXEL_PACK_BUFFER);
    GLES30.glBindBuffer(GLES30.GL_PIXEL_PACK_BUFFER, 0);
    bufferUsed_[bufferIndex] = false;
  }

  /**
   * Reads pixels using dual buffers. This function sends the reading request to GPU and returns
   * the result from the previous call. Thus, the first call always returns null. The pixelBuffer
   * member in the returned object maps to the internal buffer. This buffer cannot be overrode,
   * and it becomes invalid after next call to submitAndAcquire().
   *
   * @param textureId the OpenGL texture Id.
   * @param textureWidth width of the texture in pixels.
   * @param textureHeight height of the texture in pixels.
   * @return a CameraImage object that contains the pixels read from the texture.
   */
  public CameraImage submitAndAcquire(int textureId, int textureWidth, int textureHeight) {
    // Release previously used front buffer.
    if (frontIndex_ != -1) {
      releaseFrame(frontIndex_);
    }

    // Move previous back buffer to front buffer.
    frontIndex_ = backIndex_;

    // Submit new request on back buffer.
    backIndex_ = submitFrame(textureId, textureWidth, textureHeight);

    // Acquire frame from the new front buffer.
    if (frontIndex_ != -1) {
      return acquireFrame(frontIndex_);
    }

    return null;
  }

  private void drawTexture(int textureId, int textureWidth, int textureHeight) {
    // Disable features that aren't used.
    GLES20.glDisable(GLES20.GL_DEPTH_TEST);
    GLES20.glDisable(GLES20.GL_CULL_FACE);
    GLES20.glDisable(GLES20.GL_SCISSOR_TEST);
    GLES20.glDisable(GLES20.GL_STENCIL_TEST);
    GLES20.glDisable(GLES20.GL_BLEND);
    GLES20.glDepthMask(false);
    GLES20.glBindBuffer(GLES20.GL_ARRAY_BUFFER, 0);
    GLES20.glBindBuffer(GLES20.GL_ELEMENT_ARRAY_BUFFER, 0);

    int[] prevVertexArray = new int[1];
    GLES20.glGetIntegerv(GLES30.GL_VERTEX_ARRAY_BINDING, prevVertexArray, 0);
    GLES30.glBindVertexArray(0);

    // Clear buffers.
    GLES20.glClearColor(0, 0, 0, 0);
    GLES20.glClear(GLES20.GL_COLOR_BUFFER_BIT | GLES20.GL_DEPTH_BUFFER_BIT);

    // Set the vertex positions.
    GLES20.glVertexAttribPointer(
      quadPositionAttrib_, COORDS_PER_VERTEX, GLES20.GL_FLOAT, false, 0, quadVertices_);

    // Calculate the texture coordinates.
    if (keepAspectRatio_) {
      int renderWidth = 0;
      int renderHeight = 0;
      float textureAspectRatio = (float)(textureWidth) / textureHeight;
      float imageAspectRatio = (float)(imageWidth_) / imageHeight_;
      if (textureAspectRatio < imageAspectRatio) {
        renderWidth = imageWidth_;
        renderHeight = textureHeight * imageWidth_ / textureWidth;
      } else {
        renderWidth = textureWidth * imageHeight_ / textureHeight;
        renderHeight = imageHeight_;
      }
      float offsetU = (float)(renderWidth - imageWidth_) / renderWidth / 2;
      float offsetV = (float)(renderHeight - imageHeight_) / renderHeight / 2;

      float[] texCoords = new float[] {
        offsetU, offsetV, offsetU, 1 - offsetV, 1 - offsetU, offsetV, 1 - offsetU, 1 - offsetV};

      quadTextCoord_.put(texCoords);
      quadTextCoord_.position(0);
    } else {
      quadTextCoord_.put(QUAD_TEXCOORDS);
      quadTextCoord_.position(0);
    }

    // Set the texture coordinates.
    GLES20.glVertexAttribPointer(
      quadTexCoordAttrib_, TEXCOORDS_PER_VERTEX, GLES20.GL_FLOAT, false, 0, quadTextCoord_);

    // Enable vertex arrays
    GLES20.glEnableVertexAttribArray(quadPositionAttrib_);
    GLES20.glEnableVertexAttribArray(quadTexCoordAttrib_);

    GLES20.glUseProgram(quadProgram_);

    // Select input texture.
    int[] prevActiveTexture = new int[1];
    GLES20.glGetIntegerv(GLES20.GL_ACTIVE_TEXTURE, prevActiveTexture, 0);
    int[] prevBoundTexture = new int[1];
    GLES20.glGetIntegerv(GLES11Ext.GL_TEXTURE_BINDING_EXTERNAL_OES, prevBoundTexture, 0);

    GLES20.glActiveTexture(GLES20.GL_TEXTURE0);
    GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, textureId);

    // Draw a quad with texture.
    GLES20.glDrawArrays(GLES20.GL_TRIANGLE_STRIP, 0, 4);

    // Disable vertex arrays
    GLES20.glDisableVertexAttribArray(quadPositionAttrib_);
    GLES20.glDisableVertexAttribArray(quadTexCoordAttrib_);

    // Reset the input texture.
    GLES20.glActiveTexture(prevActiveTexture[0]);
    GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, prevBoundTexture[0]);

    // Reset the vertex array.
    GLES30.glBindVertexArray(prevVertexArray[0]);
  }
}

