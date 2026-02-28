package com.the8thwall.reality.app.validation.android;

import com.the8thwall.c8.annotations.DoNotStrip;
import com.the8thwall.c8.network.NetworkUtil;
import com.the8thwall.c8.protolog.api.LogRequest.AppLogRecordHeader.MobileAppKeyStatus;
import com.the8thwall.reality.app.validation.android.ValidateAppKeyRequest;
import com.the8thwall.c8.exceptions.IllegalMobileAppKeyException;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

/**
 * A {@link Intent} responsible for querying the server for the validity of a
 * particular app key. The server result will then be stored such that the
 * result can be re-used for future checks.
 *
 * This is used over {@link XRAppValidationService} for devices < Oreo so that
 * the WAKE_LOCK persmission does not need to be requested.
 */
@DoNotStrip
public class XRAppValidationIntentService extends IntentService {

  public static final String APPKEY_KEY = "com.the8thwall.reality.app.validation.APPKEY";

  private static final String SERVICE_NAME = "XRAppValidationIntentService";
  private static final String TAG = "8thWallJava";

  public XRAppValidationIntentService() {
    super(SERVICE_NAME);
  }

  @Override
  public void onCreate() {
    super.onCreate();
    Log.d(TAG, "XRAppValidationIntentService#onCreate");
  }

  @Override
  public void onHandleIntent(Intent intent) {
    Log.d(TAG, "XRAppValidationIntentService#onHandleIntent");
    if (!intent.hasExtra(APPKEY_KEY)) {
      Log.d(TAG, "No valid app key provided");
      return;
    }

    AppKeyStatusStorage storage = AppKeyStatusSharedPrefs.getInstance(this);
    final String appKey = intent.getExtras().getString(APPKEY_KEY);

    if (storage.getStatus(appKey) != MobileAppKeyStatus.UNKNOWN) {
      Log.d(TAG, "Attempting to query for a result we already have");
      stopSelf();
      return;
    }

    if (!NetworkUtil.hasNetworkPermissionsAndConnectivity(this)) {
      Log.d(TAG, "No network connection. Skipping app key validation");
      stopSelf();
      return;
    }

    int response = ValidateAppKeyRequest.postValidateAppKeyRequest(appKey);
    MobileAppKeyStatus status = getMobileAppKeyStatusFromResponse(response);
    storage.setStatus(appKey, status);

    if (status == MobileAppKeyStatus.SERVER_INVALID) {
      stopSelf();

      // Post an exception to the main thread to crash the app.
      Handler uiHandler = new Handler(Looper.getMainLooper());
      uiHandler.post(new Runnable() {
        @Override
        public void run() {
          throw new IllegalMobileAppKeyException(String.format("Error: \"%s\" is an invalid mobile app key.", appKey));
        }
      });
    }
  }

  @Override
  public void onDestroy() {
    super.onDestroy();
    Log.d(TAG, "XRAppValidationIntentService#onDestroy");
  }

  private MobileAppKeyStatus getMobileAppKeyStatusFromResponse(int response) {
    switch (response) {
    case ValidateAppKeyRequest.RESPONSE_INVALID:
      return MobileAppKeyStatus.SERVER_INVALID;
    case ValidateAppKeyRequest.RESPONSE_VALID:
      return MobileAppKeyStatus.SERVER_VALID;
    case ValidateAppKeyRequest.RESPONSE_UNKNOWN:
    default:
      return MobileAppKeyStatus.UNKNOWN;
    }
  }
}
