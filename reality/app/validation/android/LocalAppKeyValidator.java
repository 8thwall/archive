package com.the8thwall.reality.app.validation.android;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Arrays;

import com.the8thwall.c8.annotations.VisibleForTesting;
import com.the8thwall.c8.io.BaseXEncoding;
import com.the8thwall.c8.protolog.api.LogRequest.AppLogRecordHeader.MobileAppKeyStatus;
import com.the8thwall.c8.string.StringUtils;
import com.the8thwall.reality.app.validation.android.AppKeyStatusSharedPrefs;
import com.the8thwall.reality.app.validation.android.AppKeyStatusStorage;
import com.the8thwall.c8.exceptions.IllegalMobileAppKeyException;

import android.content.Context;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;

/**
 * Utility class used to do some quick validation of an app key on the client.
 */
class LocalAppKeyValidator {

  private static final String TAG = "8thWallJava";

  private static final int SHA1_BYTE_LENGTH = 20;
  private static final String BASE_62_ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  private AppKeyStatusStorage statusStorage_;
  private Context context_;

  /**
   * Creates a new instance of {@link LocalAppKeyValidator} backed by an
   * {@link AppKeyStatusSharedPrefs} instance.
   */
  static LocalAppKeyValidator createInstance(Context context) {
    return createInstance(context, AppKeyStatusSharedPrefs.getInstance(context));
  }

  @VisibleForTesting
  static LocalAppKeyValidator createInstance(Context context, AppKeyStatusStorage statusStorage) {
    return new LocalAppKeyValidator(context, statusStorage);
  }

  private LocalAppKeyValidator(Context context, AppKeyStatusStorage statusStorage) {
    context_ = context;
    statusStorage_ = statusStorage;
  }

  /**
   * Validates the app key with the bundle id of the running applcation. Uses cached server results,
   * if available. If the key is found to be invalid, an {@link IllegalMobileAppKeyException} will
   * be thrown.
   *
   * @return boolean whether we were able to successfully validate the app key.
   */
  public boolean validateAppKey(final String appKey) {
    MobileAppKeyStatus status = statusStorage_.getStatus(appKey);
    final String packageName = context_.getPackageName();
    if (status == MobileAppKeyStatus.SERVER_INVALID || !isValidChecksum(packageName, appKey)) {
      // Post an exception to the main thread to crash the app.
      Handler uiHandler = new Handler(Looper.getMainLooper());
      uiHandler.post(new Runnable() {
        @Override
        public void run() {
          Log.d(TAG, "validateAppKey failed for \"" + packageName + "\"");
          throw new IllegalMobileAppKeyException(
            String.format("Error: \"%s\" is an invalid mobile app key.", appKey));
        }
      });
      return true;
    }

    return statusStorage_.getStatus(appKey) == MobileAppKeyStatus.SERVER_VALID;
  }

  @VisibleForTesting
  static boolean isValidChecksum(String packageName, String encodedAppKey) {
    BaseXEncoding base62 = new BaseXEncoding(BASE_62_ALPHABET);
    byte[] decodedBytes = base62.decodeIntoBytes(encodedAppKey);

    if (decodedBytes.length <= SHA1_BYTE_LENGTH) {
      return false;
    }

    byte[] decodedKey = Arrays.copyOfRange(decodedBytes, 0, decodedBytes.length - SHA1_BYTE_LENGTH);
    byte[] decodedChecksum =
      Arrays.copyOfRange(decodedBytes, decodedBytes.length - SHA1_BYTE_LENGTH, decodedBytes.length);

    try {
      MessageDigest messageDigest = MessageDigest.getInstance("SHA-1");
      messageDigest.update(decodedKey);
      messageDigest.update(packageName.getBytes());
      byte[] calculatedChecksum = messageDigest.digest();
      return Arrays.equals(calculatedChecksum, decodedChecksum);
    } catch (NoSuchAlgorithmException e) {
      Log.w(TAG, e.toString());
      return false;
    }
  }
}
