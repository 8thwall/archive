package com.the8thwall.reality.app.sensors.camera;

import android.os.Build;
import android.app.Activity;
import android.content.Context;

/**
 * Factory class to create an instance of {@link AndroidCameraSensor}.
 */
public class GlAndroidCameraSensorFactory {

  /**
   * @return a {@link GlAndroidCameraSensor} suitable for the current device API level.
   */
  public static GlAndroidCameraSensor create(
    Context context, GlAndroidCameraSensor.FrameProcessor frameProcessor) {
    if (Build.VERSION.SDK_INT < Build.VERSION_CODES.LOLLIPOP_MR1) {
      return GlAndroidCameraSensorApi19.create(context, frameProcessor);
    }
    return GlAndroidCameraSensorApi22.create(context, frameProcessor);
  }
}
