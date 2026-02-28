package com.the8thwall.reality.app.sensors.camera;

import com.the8thwall.reality.app.xr.common.ApiLimits;

/**
 * Data class representing lightweight image header, where the native code has the actual bytes.
 */
public class AndroidNativeCameraData {

  public static final AndroidNativeCameraData EMPTY = new AndroidNativeCameraData(0L, 0);

  public final long timestampNanos;
  public final int sensorOrientation;
  public final int minCaptureDimension;
  public final int maxCaptureDimension;

  public AndroidNativeCameraData(long timestampNanos, int sensorOrientation) {
    this(
      timestampNanos,
      sensorOrientation,
      ApiLimits.IMAGE_PROCESSING_WIDTH,
      ApiLimits.IMAGE_PROCESSING_HEIGHT);
  }

  public AndroidNativeCameraData(
    long timestampNanos, int sensorOrientation, int captureWidth, int captureHeight) {
    this.timestampNanos = timestampNanos;
    this.sensorOrientation = sensorOrientation;
    this.minCaptureDimension = captureWidth < captureHeight ? captureWidth : captureHeight;
    this.maxCaptureDimension = captureWidth < captureHeight ? captureHeight : captureWidth;
  }
}
