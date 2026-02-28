package com.the8thwall.DataRecorder;

import android.app.Activity;
import android.opengl.EGLContext;
import android.os.Handler;
import android.util.Log;

import com.the8thwall.reality.app.xr.android.XREngine;
import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.Reality.XRAppEnvironment;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREnvironment;

public class XrLoop {
  static { System.loadLibrary("data-recorder"); }

  private static final String TAG = "8thWallJava";
  private static XREnvironment.Reader XR_ENV;

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[XrVideoController] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  public static interface XrCallback {
    public void onRealityUpdated(RealityResponse.Reader reality);
  }

  private boolean isPlaying_ = false;
  private Handler renderHandler_ = null;
  private XREngine xr_;
  private XRAppEnvironment.Reader xrAppEnv_;
  private XrCallback xrCallback_;

  public static XREnvironment.Reader environment(Activity activity) {
    if (XR_ENV == null) {
      XR_ENV = XREngine.getXREnvironmentReader(activity);
    }
    return XR_ENV;
  }

  public XRAppEnvironment.Reader appEnvironment() { return xrAppEnv_; }

  public boolean isPlaying() { return isPlaying_; }

  // Called when the activity is first created.
  public XrLoop(
    Activity activity, Handler renderHandler, XrCallback xrCallback) {
    logD("XREngine.create");
    XREngine.create(activity, 1 /* OPENGL */);
    xr_ = XREngine.getInstance();
    xrAppEnv_ = xr_.getXRAppEnvironmentReader();
    renderHandler_ = renderHandler;
    xrCallback_ = xrCallback;
  }

  public void configure(XRConfiguration.Reader config) { xr_.configure(config); }

  public void resume() {
    logD("resume");
    if (isPlaying_) {
      return;
    }

    renderHandler_.post(new Runnable() {
      @Override
      public void run() {
        logD("xr_.resume()");
        xr_.resume();
        isPlaying_ = true;
        logD("scheduleNextUpdate");
        scheduleNextUpdate();
      }
    });
  }

  public void pause() {
    boolean needsPause = isPlaying_;
    isPlaying_ = false;
    if (needsPause) {
      xr_.pause();
    }
  }

  // Called when the activity is about to be destroyed.
  public void destroy() { xr_.destroy(); }

  public void renderFrameForDisplay() { xr_.renderFrameForDisplay(); }

  private void scheduleNextUpdate() {
    renderHandler_.post(new Runnable() {
      @Override
      public void run() {
        runNextUpdate();
      }
    });
  }

  private void runNextUpdate() {
    if (!isPlaying_) {
      return;
    }

    xr_.renderFrameForDisplay();
    RealityResponse.Reader reality = xr_.getCurrentRealityXRReader();
    if (xrCallback_ != null) {
      xrCallback_.onRealityUpdated(reality);
    }
    scheduleNextUpdate();
  }
}
