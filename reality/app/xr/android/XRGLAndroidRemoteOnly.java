package com.the8thwall.reality.app.xr.android;

import android.content.Context;
import android.util.Log;

import com.the8thwall.c8.protolog.api.LogRequest.RealityEngineLogRecordHeader;
import com.the8thwall.reality.engine.api.Reality.XRAppEnvironment;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREnvironment;

/**
 * Disables execution of XRAndroid when RemoteOnly configuration is specified.
 */
public class XRGLAndroidRemoteOnly extends XRGLAndroidDriver {
  private static final String TAG = "8thWallJava";

  /**
   * Create a new XRGLAndroidRemoteOnly instance.
   */
  public static XRGLAndroidRemoteOnly create(Context context, XRGLAndroid xr) {
    Log.d(TAG, "[XRGLAndroidRemoteOnly] create");
    return new XRGLAndroidRemoteOnly(xr);
  }

  // Create throught the "Create" interface.
  private XRGLAndroidRemoteOnly(XRGLAndroid xr) { super(xr); }

  /**
   * Resume the current instance.
   */
  @Override
  public void resume() {
    Log.d(TAG, "[XRGLAndroidRemoteOnly] resume");
  }

  /**
   * Pause the current instance.
   */
  @Override
  public void pause() {
    Log.d(TAG, "[XRGLAndroidRemoteOnly] pause");
  }

  /**
   * Destroy the current instance.
   */
  @Override
  public void destroy() {
    Log.d(TAG, "[XRGLAndroidRemoteOnly] destroy");
  }

  /**
   * Configures with the given {@link XRConfiguration}.
   *
   * @param config the configuration to configure the current {@link XRAndroid}
   */
  @Override
  public void configure(XRConfiguration.Reader config) {}

  /**
   * Returns the {@link RealityEngineLogRecordHeader.EngineType} represented by this driver.
   */
  @Override
  public RealityEngineLogRecordHeader.EngineType getType() {
    return RealityEngineLogRecordHeader.EngineType.REMOTE_ONLY;
  }
}
