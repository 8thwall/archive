package com.the8thwall.DataRecorder;

import android.content.Context;
import android.opengl.GLES30;
import android.renderscript.Matrix4f;
import android.util.Log;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.nio.FloatBuffer;
import java.nio.ShortBuffer;

import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.Reality.XRAppEnvironment;
import com.the8thwall.reality.engine.api.Reality.XRCapabilities;
import com.the8thwall.reality.engine.api.Reality.XREnvironment;
import com.the8thwall.reality.engine.api.request.App.AppContext;

/**
 * Draws the xr camera feed to a mesh using appropriate shaders.
 */
class XrCameraFeedRenderer {

  private static final String TAG = "8thWallJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[XrCameraFeedRenderer] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private final Context context_;

  private FloatBuffer positionBuffer_;
  private FloatBuffer texturePositionBuffer_;
  private ShortBuffer drawOrderBuffer_;

  private int program_ = 0;
  private int positionHandle_;
  private int texturePositionHandle_;
  private int camTexHandle_;
  private int camTex2Handle_;
  private int textureWarpMatrixHandle_;

  private Matrix4f textureWarpMatrix_ = new Matrix4f();

  private int displayTextureWidth_;
  private int displayTextureHeight_;

  public static XrCameraFeedRenderer create(
    Context context,
    XREnvironment.Reader xrEnv,
    int displayTextureWidth,
    int displayTextureHeight) {
    return new XrCameraFeedRenderer(context, xrEnv, displayTextureWidth, displayTextureHeight);
  }

  public void onXrViewSizeChanged(int width, int height) {
    displayTextureWidth_ = width;
    displayTextureHeight_ = height;
  }

  public void drawFrame(final RealityResponse.Reader reality, AppContext.Reader appContext) {
    if (reality.hasRgbaTexture()) {
      drawFrame(
        (int)reality.getRgbaTexture().getPtr(),
        -1 /* no UV frame */,
        (float)reality.getRgbaTexture().getWidth() / (float)reality.getRgbaTexture().getHeight(),
        appContext.getDeviceOrientation());
    }
    // TODO(nb): draw frame in case of yuv texture.
  }

  public void drawFrame(XRAppEnvironment.Reader appEnv, AppContext.Reader appContext) {
    if (appEnv.getManagedCameraTextures().hasRgbaTexture()) {
      drawFrame(
        (int)appEnv.getManagedCameraTextures().getRgbaTexture().getPtr(),
        -1,
        (float)appEnv.getManagedCameraTextures().getRgbaTexture().getWidth()
          / (float)appEnv.getManagedCameraTextures().getRgbaTexture().getHeight(),
        appContext.getDeviceOrientation());
    } else if (
      appEnv.getManagedCameraTextures().hasYTexture()
      && appEnv.getManagedCameraTextures().hasUvTexture()) {
      drawFrame(
        (int)appEnv.getManagedCameraTextures().getYTexture().getPtr(),
        (int)appEnv.getManagedCameraTextures().getUvTexture().getPtr(),
        (float)appEnv.getManagedCameraTextures().getYTexture().getWidth()
          / (float)appEnv.getManagedCameraTextures().getYTexture().getHeight(),
        appContext.getDeviceOrientation());
    }
  }

  private XrCameraFeedRenderer(
    Context context,
    XREnvironment.Reader xrEnv,
    int displayTextureWidth,
    int displayTextureHeight) {
    context_ = context;
    displayTextureWidth_ = displayTextureWidth;
    displayTextureHeight_ = displayTextureHeight;

    // We are drawing two triangles for the texture
    // clang-format-off
    short vertexOrder[] = {
      0, 1, 2,
      1, 3, 2
    };

    float vertexCoordinates[] = {
      -1, +1,
      +1, +1,
      -1, -1,
      +1, -1
    };

    // Tex coordinates are flipped vertically
    float vertexTextureCoordinates[] = {
      0.0f, 1.0f,
      1.0f, 1.0f,
      0.0f, 0.0f,
      1.0f, 0.0f
    };
    // clang-format on

    ByteBuffer bb;

    // Draw list buffer
    bb = ByteBuffer.allocateDirect(vertexOrder.length * 2);  // 2 bytes short
    bb.order(ByteOrder.nativeOrder());
    drawOrderBuffer_ = bb.asShortBuffer();
    drawOrderBuffer_.put(vertexOrder);
    drawOrderBuffer_.position(0);

    // Initialize the texture holder
    bb = ByteBuffer.allocateDirect(vertexCoordinates.length * 4);  // 4 bytes/float
    bb.order(ByteOrder.nativeOrder());
    positionBuffer_ = bb.asFloatBuffer();
    positionBuffer_.put(vertexCoordinates);
    positionBuffer_.position(0);

    bb = ByteBuffer.allocateDirect(vertexTextureCoordinates.length * 4);  // 4 bytes/float
    bb.order(ByteOrder.nativeOrder());
    texturePositionBuffer_ = bb.asFloatBuffer();
    texturePositionBuffer_.put(vertexTextureCoordinates);
    texturePositionBuffer_.position(0);

    // TODO(nb): if camera1, compile yuv shaders.
    program_ = createProgram(context_, "rgbaVertexShader.glsl", "rgbaFragmentShader.glsl");

    if (program_ == 0) {
      throw new IllegalStateException("Failed to create program");
    }

    GLES30.glUseProgram(program_);
    checkGLError("useProgram");
    camTexHandle_ = GLES30.glGetUniformLocation(program_, "camTex");
    // TODO(nb): if camera 1, set tex2.
    // if (isYuvTex) {
    // camTex2Handle_ = GLES30.glGetUniformLocation(program_, "camTex2");
    //}
    textureWarpMatrixHandle_ = GLES30.glGetUniformLocation(program_, "_TextureWarp");
    positionHandle_ = GLES30.glGetAttribLocation(program_, "position");
    texturePositionHandle_ = GLES30.glGetAttribLocation(program_, "texturePosition");
    checkGLError("getLocations");
  }

  private void drawFrame(
    int camTexName,
    int camTex2Name,
    float captureAspect,
    AppContext.DeviceOrientation orientation) {
    checkGLError("renderFrame");

    // Update camera parameters
    GLES30.glUseProgram(program_);

    // Make the texture available to the shader
    GLES30.glViewport(0, 0, displayTextureWidth_, displayTextureHeight_);
    GLES30.glClearColor(0.0f, 0.0f, 0.0f, 0.0f);
    GLES30.glClear(GLES30.GL_COLOR_BUFFER_BIT);
    checkGLError("clearViewport");

    // Update texture
    GLES30.glActiveTexture(GLES30.GL_TEXTURE0);
    GLES30.glBindTexture(GLES30.GL_TEXTURE_2D, camTexName);
    GLES30.glUniform1i(camTexHandle_, 0);
    checkGLError("bind camTex");

    if (camTex2Name > 0) {
      GLES30.glActiveTexture(GLES30.GL_TEXTURE1);
      GLES30.glBindTexture(GLES30.GL_TEXTURE_2D, camTex2Name);
      GLES30.glUniform1i(camTex2Handle_, 1);
      checkGLError("bind camTex2");
    }

    float displayAspect = displayTextureHeight_ > 0.0f
      ? (float)displayTextureWidth_ / (float)displayTextureHeight_
      : 1.0f;

    float scaleFactor = displayAspect / captureAspect;

    float rotation = 0.0f;  // should this be lastRotation?
    switch (orientation) {
      case LANDSCAPE_RIGHT:
        rotation = -90.0f;
        scaleFactor = displayAspect * captureAspect;
        break;
      case PORTRAIT:
        rotation = 0.0f;
        break;
      case LANDSCAPE_LEFT:
        rotation = 90.0f;
        scaleFactor = displayAspect * captureAspect;
        break;
      case PORTRAIT_UPSIDE_DOWN:
        rotation = 180.0f;
        break;
      default:
        break;
    }

    textureWarpMatrix_.loadIdentity();
    if (scaleFactor > 1 + 1e-2) {
      float invScaleFactor = 1.0f / scaleFactor;
      textureWarpMatrix_.set(1, 1, invScaleFactor);
      textureWarpMatrix_.set(1, 3, (1 - invScaleFactor) * .5f);
    } else if (scaleFactor < 1 - 1e-2) {
      textureWarpMatrix_.set(0, 0, scaleFactor);
      textureWarpMatrix_.set(0, 3, (1 - scaleFactor) * .5f);
    }

    Matrix4f rmat = new Matrix4f();
    rmat.loadRotate(rotation, 0.0f, 0.0f, 1.0f);
    rmat.multiply(textureWarpMatrix_);
    textureWarpMatrix_.load(rmat);

    // Transpose so that getArray returns column-major.
    textureWarpMatrix_.transpose();

    // Update warp matrix
    GLES30.glUniformMatrix4fv(textureWarpMatrixHandle_, 1, false, textureWarpMatrix_.getArray(), 0);

    // Send position
    GLES30.glEnableVertexAttribArray(positionHandle_);
    GLES30.glVertexAttribPointer(
      positionHandle_, 2, GLES30.GL_FLOAT, false, 4 * 2, positionBuffer_);

    // Send texture positions
    GLES30.glEnableVertexAttribArray(texturePositionHandle_);
    GLES30.glVertexAttribPointer(
      texturePositionHandle_, 2, GLES30.GL_FLOAT, false, 4 * 2, texturePositionBuffer_);

    checkGLError("set shader variables");

    // And draw
    GLES30.glDrawElements(
      GLES30.GL_TRIANGLES,
      drawOrderBuffer_.remaining(),
      GLES30.GL_UNSIGNED_SHORT,
      drawOrderBuffer_);
    checkGLError("drawElements");
  }

  private static int createProgram(
    Context context, String vertexAssetFile, String fragmentAssetFile) {
    String vertexSource = getStringFromFileInAssets(context, vertexAssetFile);
    String fragmentSource = getStringFromFileInAssets(context, fragmentAssetFile);
    int vertexShader = compileShader(GLES30.GL_VERTEX_SHADER, vertexSource);
    if (vertexShader == 0) {
      return 0;
    }
    logD("vertexShader log: " + GLES30.glGetShaderInfoLog(vertexShader));

    int fragmentShader = compileShader(GLES30.GL_FRAGMENT_SHADER, fragmentSource);
    if (fragmentShader == 0) {
      return 0;
    }
    logD("fragmentShader log: " + GLES30.glGetShaderInfoLog(fragmentShader));

    int program = GLES30.glCreateProgram();
    checkGLError("[XrCameraFeedRenderer] glCreateProgram");
    if (program == 0) {
      Log.e(
        TAG,
        "[XrCameraFeedRenderer] Could not create program from " + fragmentAssetFile + ", "
          + vertexAssetFile);
    } else {
      GLES30.glAttachShader(program, vertexShader);
      checkGLError("glAttachShader");
      GLES30.glAttachShader(program, fragmentShader);
      checkGLError("glAttachShader");
      GLES30.glLinkProgram(program);
      int[] linkStatus = new int[1];
      GLES30.glGetProgramiv(program, GLES30.GL_LINK_STATUS, linkStatus, 0);
      if (linkStatus[0] != GLES30.GL_TRUE) {
        Log.e(
          TAG,
          "[XrCameraFeedRenderer] Could not link program: " + GLES30.glGetProgramInfoLog(program));
        GLES30.glDeleteProgram(program);
        program = 0;
      }
    }
    return program;
  }

  private static int compileShader(int shaderType, String source) {
    int shader = GLES30.glCreateShader(shaderType);
    checkGLError("glCreateShader type=" + shaderType);
    GLES30.glShaderSource(shader, source);
    GLES30.glCompileShader(shader);
    int[] compiled = new int[1];
    GLES30.glGetShaderiv(shader, GLES30.GL_COMPILE_STATUS, compiled, 0);
    if (compiled[0] == 0) {
      Log.e(TAG, "[XrCameraFeedRenderer] Could not compile shader " + shaderType);
      Log.e(TAG, GLES30.glGetShaderInfoLog(shader));
      GLES30.glDeleteShader(shader);
      shader = 0;
    }
    return shader;
  }

  private static String getStringFromFileInAssets(Context ctx, String filename) {
    try {
      InputStream is = ctx.getAssets().open(filename);
      BufferedReader reader = new BufferedReader(new InputStreamReader(is));
      StringBuilder builder = new StringBuilder();
      String line;
      while ((line = reader.readLine()) != null) {
        builder.append(line).append("\n");
      }
      is.close();
      return builder.toString();
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

  private static void checkGLError(String op) {
    int error = GLES30.glGetError();
    if (error != GLES30.GL_NO_ERROR) {
      String msg = op + ": glError 0x" + Integer.toHexString(error);
      Log.e(TAG, "[XrCameraFeedRenderer] " + msg);
      // throw new RuntimeException(msg);
    }
  }
}
