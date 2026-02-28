package com.the8thwall.reality.app.analytics.android;

import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.robolectric.RobolectricTestRunner;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;
import static org.junit.Assert.fail;
import static org.mockito.Matchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;

/**
 * Unit tests for {@link XRAnalyticsLogger}.
 */
@RunWith(RobolectricTestRunner.class)
public class XRAnalyticsLoggerTest {

  private static final int LOG_DATA_BYTES_SIZE = 100;

  private byte[] logData_;

  @Before
  public void setup() {
    logData_ = new byte[LOG_DATA_BYTES_SIZE];
  }

  @Test
  public void testSkipUploadOnInvalidNetwork() {
    Context context = createMockContext(false);
    XRAnalyticsLogger.logRecordToServer(logData_, context);
    verify(context, never()).startService(any(Intent.class));
  }

  @Test
  public void testUploadOnValidNetwork() {
    Context context = createMockContext(true);
    fillLogData();

    XRAnalyticsLogger.logRecordToServer(logData_, context);
    ArgumentCaptor<Intent> intentCaptor = ArgumentCaptor.forClass(Intent.class);
    verify(context).startService(intentCaptor.capture());

    // Check that the intent was constructed correctly.
    Intent serviceIntent = intentCaptor.getValue();
    assertEquals(serviceIntent.getComponent().getClassName(), XRAnalyticsIntentService.class.getName());
    assertTrue(serviceIntent.hasExtra(XRAnalyticsIntentService.LOG_DATA_KEY));
    byte[] intentByteArrayExtra = serviceIntent.getByteArrayExtra(XRAnalyticsIntentService.LOG_DATA_KEY);
    assertArrayEquals(logData_, intentByteArrayExtra);
  }

  private static Context createMockContext(boolean isValidNetworkAvailable) {
    Context context = mock(Context.class);
    ConnectivityManager connectivityManager = mock(ConnectivityManager.class);

    if (isValidNetworkAvailable) {
      NetworkInfo networkInfo = mock(NetworkInfo.class);
      when(networkInfo.isAvailable()).thenReturn(true);
      when(networkInfo.isConnected()).thenReturn(true);
      when(networkInfo.isRoaming()).thenReturn(false);
      when(connectivityManager.getActiveNetworkInfo()).thenReturn(networkInfo);
    }

    when(context.getSystemService(Context.CONNECTIVITY_SERVICE)).thenReturn(connectivityManager);

    return context;
  }

  private void fillLogData() {
    for (byte i = 0; i < logData_.length; ++i) {
      logData_[i] = i;
    }
  }
}
