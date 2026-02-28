package com.the8thwall.reality.app.sensors.arcore;

import android.opengl.EGL14;
import android.opengl.EGLConfig;
import android.opengl.EGLContext;
import android.opengl.EGLDisplay;
import android.opengl.EGLSurface;
import android.util.Log;

/**
 * Wraps the verbose logic required to create a new EGL context. In order for us to get ARCore
 * updates on a background thread, we need to set it an EGL context. In particular, one that
 * can share the texture that is created and passed back to Unity in
 * {@link #ARCoreSensor#getManagedCameraTexture}.
 */
public class CameraGLContextHelper {

  private static final String TAG = "8thWallJava";

  private final int height_;
  private final int width_;

  private EGLContext eGLContext_;
  private EGLDisplay eGLDisplay_;
  private EGLSurface eGLSurface_;

  public CameraGLContextHelper(int width, int height) {
    width_ = width;
    height_ = height;
  }

  public void resume(EGLContext unityEGLContext) {
    eGLDisplay_ = EGL14.eglGetDisplay(EGL14.EGL_DEFAULT_DISPLAY);
    int[] version = new int[2];
    EGL14.eglInitialize(eGLDisplay_, version, 0, version, 1);
    int[] configAttr = {EGL14.EGL_COLOR_BUFFER_TYPE,
                        EGL14.EGL_RGB_BUFFER,
                        EGL14.EGL_LEVEL,
                        0,
                        EGL14.EGL_RENDERABLE_TYPE,
                        EGL14.EGL_OPENGL_ES2_BIT,
                        EGL14.EGL_SURFACE_TYPE,
                        EGL14.EGL_PBUFFER_BIT,
                        EGL14.EGL_NONE};
    EGLConfig[] configs = new EGLConfig[1];
    int[] numConfig = new int[1];
    EGL14.eglChooseConfig(eGLDisplay_, configAttr, 0, configs, 0, 1, numConfig, 0);
    if (numConfig[0] == 0) {
      Log.d(TAG, "Could not find an EGL config");
    }
    EGLConfig config = configs[0];

    int[] surfaceAttributes = {EGL14.EGL_WIDTH, width_, EGL14.EGL_HEIGHT, height_, EGL14.EGL_NONE};
    eGLSurface_ = EGL14.eglCreatePbufferSurface(eGLDisplay_, config, surfaceAttributes, 0);
    int[] contextAttributes = {EGL14.EGL_CONTEXT_CLIENT_VERSION, 2, EGL14.EGL_NONE};
    eGLContext_ =
      EGL14.eglCreateContext(eGLDisplay_, config, unityEGLContext, contextAttributes, 0);
  }

  public void setAsCurrentContext() {
    EGL14.eglMakeCurrent(eGLDisplay_, eGLSurface_, eGLSurface_, eGLContext_);
  }

  public boolean isCurrentEGLContext() {
    EGLContext currentContext = EGL14.eglGetCurrentContext();
    return eGLContext_ != null && eGLContext_.equals(currentContext);
  }

  public void pause() {
    EGL14.eglDestroySurface(eGLDisplay_, eGLSurface_);
    EGL14.eglDestroyContext(eGLDisplay_, eGLContext_);

    eGLContext_ = null;
    eGLDisplay_ = null;
    eGLSurface_ = null;
  }
}
