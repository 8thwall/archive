package com.the8thwall.reality.app.analytics.android;

import android.content.Context;
import android.content.Intent;
import android.util.Log;

import java.nio.ByteBuffer;

import com.the8thwall.c8.network.NetworkUtil;

/**
 * Utility class responsible for logging XR events to the server.
 */
public class XRAnalyticsLogger {

  private static final String TAG = "8thWallJava";

  public static void logRecordToServer(byte[] logRecordBytes, Context context) {
    // Check if we have internet access. If we don't, do not start analytics service.
    if (!NetworkUtil.hasNetworkPermissionsAndConnectivity(context)) {
      Log.d(TAG, "No valid network connection. Upload service will not be started.");
      return;
    }

    Intent intent = new Intent(context, XRAnalyticsIntentService.class);
    intent.putExtra(XRAnalyticsIntentService.LOG_DATA_KEY, logRecordBytes);
    context.startService(intent);
  }
}
