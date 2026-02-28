package com.the8thwall.reality.app.app;

import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.WindowManager;
import android.view.Surface;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import com.the8thwall.reality.engine.api.request.App.AppContext;
import com.the8thwall.reality.engine.api.request.App.AppContext.DeviceNaturalOrientation;
import com.the8thwall.reality.engine.api.request.App.AppContext.DeviceOrientation;
public class AndroidApp {
  private static final String TAG = "8thWallJava";

  public static void exportAppContext(AppContext.Builder appContext, Context context) {
    DisplayMetrics dm = new DisplayMetrics();
    WindowManager windowManager = (WindowManager)context.getSystemService(Context.WINDOW_SERVICE);
    windowManager.getDefaultDisplay().getMetrics(dm);
    int rotation = windowManager.getDefaultDisplay().getRotation();

    DeviceNaturalOrientation n = naturalOrientation(context, dm, rotation);
    appContext.setDeviceOrientation(deviceOrientation(n, rotation));
    appContext.setNaturalOrientation(n);
  }

  private static DeviceNaturalOrientation naturalOrientation(
    Context context, DisplayMetrics dm, int rotation) {
    int width = dm.widthPixels;
    int height = dm.heightPixels;
    boolean rotated = rotation == Surface.ROTATION_90 || rotation == Surface.ROTATION_270;
    return (height > width == rotated) ? DeviceNaturalOrientation.LANDSCAPE_UP
                                       : DeviceNaturalOrientation.PORTRAIT_UP;
  }

  private static DeviceOrientation deviceOrientation(DeviceNaturalOrientation o, int rotation) {
    boolean rotated = rotation == Surface.ROTATION_90 || rotation == Surface.ROTATION_270;
    return o == DeviceNaturalOrientation.LANDSCAPE_UP ? orientationForLandscapeUp(rotation)
                                                      : orientationForPortraitUp(rotation);
  }

  private static DeviceOrientation orientationForPortraitUp(int rotation) {
    switch (rotation) {
      case Surface.ROTATION_0:
        return DeviceOrientation.PORTRAIT;
      case Surface.ROTATION_90:
        return DeviceOrientation.LANDSCAPE_LEFT;
      case Surface.ROTATION_180:
        return DeviceOrientation.PORTRAIT_UPSIDE_DOWN;
      case Surface.ROTATION_270:
        return DeviceOrientation.LANDSCAPE_RIGHT;
      default:
        return DeviceOrientation.UNSPECIFIED;
    }
  }

  private static DeviceOrientation orientationForLandscapeUp(int rotation) {
    switch (rotation) {
      case Surface.ROTATION_270:
        return DeviceOrientation.PORTRAIT;
      case Surface.ROTATION_0:
        return DeviceOrientation.LANDSCAPE_LEFT;
      case Surface.ROTATION_90:
        return DeviceOrientation.PORTRAIT_UPSIDE_DOWN;
      case Surface.ROTATION_180:
        return DeviceOrientation.LANDSCAPE_RIGHT;
      default:
        return DeviceOrientation.UNSPECIFIED;
    }
  }

  private AndroidApp() {}  // Don't instantiate.
}
