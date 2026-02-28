package com.the8thwall.reality.app.validation.android;

import android.util.Log;

import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;

/**
 * Utility class to construct the network request used to validate an app key.
 */
class ValidateAppKeyRequest {

  public static final int RESPONSE_UNKNOWN = 0;
  public static final int RESPONSE_VALID = 1;
  public static final int RESPONSE_INVALID = 2;

  private static final int CONNECTION_TIMEOUT_MS = 15000;
  private static final String TAG = "8thWallJava";
  private static final String VALIDATE_APP_KEY_URL_FORMAT =
    "https://console.8thwall.com/public/verify/%s";

  /**
   * Sends an HTTPS request to validate the provided app key.
   *
   * @param appKey the app key provided by the developer
   * @return an int representing whether the app key was invalid, valid, or
   *   if an error in validation occured which prevented a real response
   *   from being received
   */
  static int postValidateAppKeyRequest(String appKey) {
    HttpsURLConnection urlConnection = null;

    try {
      String encodedAppKey = URLEncoder.encode(appKey, "UTF-8");
      URL url = new URL(String.format(VALIDATE_APP_KEY_URL_FORMAT, encodedAppKey));
      urlConnection = (HttpsURLConnection)url.openConnection();
      urlConnection.setRequestMethod("GET");
      urlConnection.setConnectTimeout(CONNECTION_TIMEOUT_MS);

      SSLContext ssl = SSLContext.getInstance("TLS");
      ssl.init(null, null, new SecureRandom());
      urlConnection.setSSLSocketFactory(ssl.getSocketFactory());

      int responseCode = urlConnection.getResponseCode();
      Log.d(TAG, String.format("Response Code %d", responseCode));

      if (responseCode == HttpURLConnection.HTTP_OK) {
        return RESPONSE_VALID;
      } else if (responseCode == HttpURLConnection.HTTP_FORBIDDEN) {
        return RESPONSE_INVALID;
      } else {
        return RESPONSE_UNKNOWN;
      }
    } catch (IOException | KeyManagementException | NoSuchAlgorithmException e) {
      Log.w(TAG, e);
      return RESPONSE_UNKNOWN;
    } finally {
      if (urlConnection != null) {
        urlConnection.disconnect();
      }
    }
  }
}
