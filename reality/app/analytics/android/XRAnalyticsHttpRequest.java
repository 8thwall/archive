package com.the8thwall.reality.app.analytics.android;

import android.util.Log;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.security.KeyManagementException;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;

/**
 * Utility class used to construct the HTTP requests for various analytics events.
 */
public class XRAnalyticsHttpRequest {

  private static final int CONNECTION_TIMEOUT_MS = 30000;
  private static final String TAG = "8thWallJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[XRAnalyticsHttpRequest] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  /**
   * Sends an HTTP which posts the serialized LogServiceRequest bytes to the server.
   * This assumes that the bytes have been compressed using the deflate algorithm.
   *
   * @param requestBytes the serialized & compressed bytes representing a LogServiceRequest struct
   */
  public static void postLogServiceRequestBytes(byte[] requestBytes) {
    HttpsURLConnection urlConnection = null;
    OutputStream out = null;

    try {
      URL url = new URL("https://<REMOVED_BEFORE_OPEN_SOURCING>.8thwall.com/log");
      urlConnection = (HttpsURLConnection)url.openConnection();
      urlConnection.setDoOutput(true);
      urlConnection.setRequestMethod("POST");
      urlConnection.setConnectTimeout(CONNECTION_TIMEOUT_MS);
      urlConnection.setRequestProperty("Content-Type", "application/octet-stream");
      urlConnection.setRequestProperty("Content-Encoding", "deflate");
      urlConnection.setRequestProperty("Content-Length", Integer.toString(requestBytes.length));

      SSLContext ssl = SSLContext.getInstance("TLS");
      ssl.init(null, null, new SecureRandom());
      urlConnection.setSSLSocketFactory(ssl.getSocketFactory());

      out = new BufferedOutputStream(urlConnection.getOutputStream());
      out.write(requestBytes);
      out.flush();

      logD(String.format("Response Code %d", urlConnection.getResponseCode()));
    } catch (IOException | KeyManagementException | NoSuchAlgorithmException e) {
      Log.w(TAG, e);
    } finally {
      if (urlConnection != null) {
        urlConnection.disconnect();
      }

      if (out != null) {
        try {
          out.close();
        } catch (IOException e) {
          Log.w(TAG, e);
        }
      }
    }
  }
}
