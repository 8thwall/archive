package com.nianticlabs.c8;

import android.graphics.SurfaceTexture;
import android.opengl.EGL14;
import android.opengl.EGLConfig;
import android.opengl.EGLContext;
import android.opengl.EGLDisplay;
import android.opengl.EGLExt;
import android.opengl.EGLSurface;
import android.util.Log;

/**
 * Binds a SurfaceTexture to an EGL window surface and allow flushing to screen.
 */
public class EglDisplayTexture {

  private static final String TAG = "NianticJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.w(TAG, String.format("[EglDisplayTexture] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private EGLContext eglContext_;
  private EGLDisplay eglDisplay_;
  private EGLSurface eglSurface_;

  public static EglDisplayTexture create(SurfaceTexture displayTexture) {
    return new EglDisplayTexture(displayTexture);
  }

  public boolean flush() { return makeCurrent() & swapBuffers(); }

  public EGLContext getContext() { return eglContext_; }

  public void destroy() {
    logD("{ EglDisplayTexture::destroy");
    if (eglDisplay_ != EGL14.EGL_NO_DISPLAY) {
      logD("Disposing EGL resources");
      boolean released;
      released = EGL14.eglTerminate(eglDisplay_);
      logD("eglTerminate: " + released);
      released = EGL14.eglMakeCurrent(
        eglDisplay_, EGL14.EGL_NO_SURFACE, EGL14.EGL_NO_SURFACE, EGL14.EGL_NO_CONTEXT);
      logD("eglMakeCurrent NONE: " + released);
      released = EGL14.eglDestroyContext(eglDisplay_, eglContext_);
      logD("eglDestroyContext: " + released);
      released = EGL14.eglReleaseThread();
      logD("eglReleaseThread: " + released);
    }

    eglDisplay_ = EGL14.EGL_NO_DISPLAY;
    eglContext_ = EGL14.EGL_NO_CONTEXT;
    eglSurface_ = EGL14.EGL_NO_SURFACE;
    logD("} EglDisplayTexture::destroy");
  }

  private EglDisplayTexture(SurfaceTexture displayTexture) {
    logD("{ EglDisplayTexture::EglDisplayTexture");
    eglDisplay_ = EGL14.eglGetDisplay(EGL14.EGL_DEFAULT_DISPLAY);
    int[] unusedEglVersion = new int[2];
    if (!EGL14.eglInitialize(eglDisplay_, unusedEglVersion, 0, unusedEglVersion, 1)) {
      throw new RuntimeException("Unable to initialize EGL14");
    }

    // Prepare the context
    int[] eglContextAttributes = {
      EGL14.EGL_CONTEXT_CLIENT_VERSION,
      3,              // Version 3
      EGL14.EGL_NONE  // Null
    };

    EGLConfig eglConfig = createEGLConfig(3);
    if (eglConfig != null) {
      eglContext_ = EGL14.eglCreateContext(
        eglDisplay_, eglConfig, EGL14.EGL_NO_CONTEXT, eglContextAttributes, 0);
      logD("eglCreateContext: " + eglContext_);
      if (EGL14.eglGetError() != EGL14.EGL_SUCCESS) {
        Log.e(TAG, "[EglDisplayTexture] Failed to create EGL3 context");
        eglContext_ = EGL14.EGL_NO_CONTEXT;
      }
    }

    if (eglContext_ == EGL14.EGL_NO_CONTEXT) {
      eglContextAttributes[1] = 2;  // Fall back to version 2
      eglConfig = createEGLConfig(2);
      eglContext_ = EGL14.eglCreateContext(
        eglDisplay_, eglConfig, EGL14.EGL_NO_CONTEXT, eglContextAttributes, 0);
    }

    // Confirm with query.
    int[] values = new int[1];
    EGL14.eglQueryContext(eglDisplay_, eglContext_, EGL14.EGL_CONTEXT_CLIENT_VERSION, values, 0);
    logD("EGLContext created, client version " + values[0]);

    // Prepare the surface
    int[] surfaceAttributes = {
      EGL14.EGL_NONE  // Null
    };
    eglSurface_ =
      EGL14.eglCreateWindowSurface(eglDisplay_, eglConfig, displayTexture, surfaceAttributes, 0);
    checkEGLError("eglCreateWindowSurface");
    if (!EGL14.eglMakeCurrent(eglDisplay_, eglSurface_, eglSurface_, eglContext_)) {
      throw new RuntimeException("eglMakeCurrent failed");
    }
    logD("} EglDisplayTexture::EglDisplayTexture");
  }

  private EGLConfig createEGLConfig(int version) {
    // The actual surface is generally RGBA, so omitting alpha
    // doesn't really help.  It can also lead to a huge performance hit on glReadPixels()
    // when reading into a GL_RGBA buffer.
    int renderType = version == 3 ? EGLExt.EGL_OPENGL_ES3_BIT_KHR : EGL14.EGL_OPENGL_ES2_BIT;
    int[] attributeList = {
      EGL14.EGL_RED_SIZE,
      8,
      EGL14.EGL_GREEN_SIZE,
      8,
      EGL14.EGL_BLUE_SIZE,
      8,
      EGL14.EGL_ALPHA_SIZE,
      8,
      // EGL14.EGL_DEPTH_SIZE, 16, //We are not going to use depth buffers
      // EGL14.EGL_STENCIL_SIZE, 8,
      EGL14.EGL_RENDERABLE_TYPE,
      renderType,
      EGL14.EGL_NONE,
      0,              // placeholder for video, if set
      EGL14.EGL_NONE  // Null terminated
    };
    EGLConfig[] configs = new EGLConfig[1];
    int[] numConfigs = new int[1];
    if (!EGL14.eglChooseConfig(
          eglDisplay_, attributeList, 0, configs, 0, configs.length, numConfigs, 0)) {
      Log.e(TAG, "[EglDisplayTexture] unable to find RGB8888 " + version + " EGLConfig");
      return null;
    }
    return configs[0];
  }

  private boolean makeCurrent() {
    return logEGLError(
      EGL14.eglMakeCurrent(eglDisplay_, eglSurface_, eglSurface_, eglContext_),
      "eglMakeCurrent failed");
  }

  private boolean swapBuffers() {
    return logEGLError(EGL14.eglSwapBuffers(eglDisplay_, eglSurface_), "eglSwapBuffers failed");
  }

  private static boolean logEGLError(boolean success, String msgIfError) {
    if (!success) {
      Log.e(TAG, "[EglDisplayTexture] " + msgIfError);
    }
    return success;
  }

  /**
   * Checks for EGL errors.  Throws an exception if an error has been raised.
   */
  private static void checkEGLError(String msg) {
    int error;
    if ((error = EGL14.eglGetError()) != EGL14.EGL_SUCCESS) {
      throw new RuntimeException(msg + ": EGL error: 0x" + Integer.toHexString(error));
    }
  }
}
