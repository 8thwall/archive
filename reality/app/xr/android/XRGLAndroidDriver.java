package com.the8thwall.reality.app.xr.android;

import com.the8thwall.c8.protolog.api.LogRequest.RealityEngineLogRecordHeader;
import com.the8thwall.reality.engine.api.Reality.XRAppEnvironment;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREnvironment;

/**
 * Base class for different XR implementations. See {@link XRGLAndroidC8},
 * {@link XRGLAndroidARCore}, and {@link XRGLAndroidTango} for examples.
 */
public abstract class XRGLAndroidDriver {

  private XRGLAndroid xR_;

  protected XRGLAndroidDriver(XRGLAndroid xr) { xR_ = xr; }

  protected XRGLAndroid getXR() { return xR_; }

  /**
   * Resume the current instance.
   */
  public abstract void resume();

  /**
   * Force to re-query and update the current reality.
   */
  public void update() {
    // No-op by default. Subclasses can override if they would like to act upon.
  }

  /**
   * Pause the current instance.
   */
  public abstract void pause();

  /**
   * Destroy the current instance.
   */
  public abstract void destroy();

  /**
   * Configures with the given {@link XRConfiguration}.
   *
   * @param config the configuration to configure the current {@link XRGLAndroid}
   */
  public abstract void configure(XRConfiguration.Reader config);

  /**
   * Exports app environment data to the given builder.
   */
  public void getXRAppEnvironment(XRAppEnvironment.Builder builder) {
    // No-op by default. Subclasses can override if they would like to provide environment
  }

  /**
   * Returns the {@link RealityEngineLogRecordHeader.EngineType} represented by this driver.
   */
  public abstract RealityEngineLogRecordHeader.EngineType getType();
}
