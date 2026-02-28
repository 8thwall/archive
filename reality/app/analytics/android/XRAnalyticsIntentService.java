package com.the8thwall.reality.app.analytics.android;

import java.net.URL;
import java.nio.charset.StandardCharsets;

import com.the8thwall.c8.annotations.DoNotStrip;
import com.the8thwall.c8.network.NetworkUtil;

import android.app.IntentService;
import android.content.Intent;
import android.util.Log;

import java.io.DataOutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

/**
 * An {@link IntentService} which is responsible for uploading XR analytics logs to the server.
 */
@DoNotStrip
public class XRAnalyticsIntentService extends IntentService {

  public static final String LOG_DATA_KEY = "com.the8thwall.reality.app.analytics.android.LogData";

  private static final String SERVICE_NAME = "XRAnalyticsIntentService";
  private static final String TAG = "8thWallJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[XRAnalyticsIntentService] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  public XRAnalyticsIntentService() { super(SERVICE_NAME); }

  @Override
  public void onCreate() {
    super.onCreate();
    logD("onCreate");
  }

  @Override
  public void onHandleIntent(Intent intent) {
    logD("onHandleIntent");

    // Network connectivity may have been lost from the time we started the service to the time
    // we actually want to upload (now). Let's check one more time for valid network connectivity.
    if (!NetworkUtil.hasNetworkPermissionsAndConnectivity(this)) {
      logD("No valid network connection. Skipping upload.");
      return;
    }

    if (intent == null || !intent.hasExtra(LOG_DATA_KEY)) {
      logD("No valid log data provided. Skipping upload");
      return;
    }

    byte[] logData = intent.getExtras().getByteArray(LOG_DATA_KEY);

    logD(String.format("Attempting to upload %d bytes", logData.length));

    XRAnalyticsHttpRequest.postLogServiceRequestBytes(logData);
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    logD("onDestroy");
  }
}
