package com.the8thwall.reality.app.validation.android;

import com.the8thwall.c8.network.NetworkUtil;
import com.the8thwall.reality.app.validation.android.LocalAppKeyValidator;
import com.the8thwall.reality.app.validation.android.XRAppValidationIntentService;
import com.the8thwall.reality.app.validation.android.XRAppValidationService;

import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.util.Log;

/**
 * Class used for validating the app key provided by the developer.
 */
public class XRAppValidator {

  private static final String TAG = "8thWallJava";

  /**
   * Validates the app key provided by the developer. This will use information already on the
   * client before attempting to query the server for the key's validity. If the app key is found
   * to be invalid, an exception will be thrown, and the application will crash. Any keys that are
   * valid, or keys where we cannot determine validity (i.e. can't reach server), will allow the
   * application to resume.
   */
  public static void validateApplication(Context context, String appKey) {
    LocalAppKeyValidator localValidator = LocalAppKeyValidator.createInstance(context);
    if (localValidator.validateAppKey(appKey)) {
      // We can locally guarantee the app key is valid.
      return;
    }

    if (!NetworkUtil.hasNetworkPermissionsAndConnectivity(context)) {
      Log.d(TAG, "No network connection. Skipping app key validation");
      return;
    }

    // Can't guarantee that the app key is valid. Query server for validity.
    Log.d("8thWallJ", "Enqueuing work to the job scheduler");

    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
      Intent intent = new Intent(context, XRAppValidationService.class);
      intent.putExtra(XRAppValidationService.APPKEY_KEY, appKey);
      XRAppValidationService.enqueueWork(context, intent);
    } else {
      Intent intent = new Intent(context, XRAppValidationIntentService.class);
      intent.putExtra(XRAppValidationIntentService.APPKEY_KEY, appKey);
      context.startService(intent);
    }
  }
}
