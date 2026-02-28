package com.the8thwall.reality.app.validation.android;

import com.the8thwall.c8.protolog.api.LogRequest.AppLogRecordHeader.MobileAppKeyStatus;
import com.the8thwall.reality.app.validation.android.AppKeyStatusSharedPrefs;

import android.content.Context;
import android.content.SharedPreferences;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;

import static org.junit.Assert.assertEquals;

/**
 * Unit tests for {@link AppKeyStatusSharedPrefs}.
 */
@RunWith(RobolectricTestRunner.class)
public class AppKeyStatusSharedPrefsTest {

  private AppKeyStatusSharedPrefs keyStatusSharedPrefs_;

  @Before
  public void setup() {
    Context context = RuntimeEnvironment.application;
    keyStatusSharedPrefs_ = AppKeyStatusSharedPrefs.getInstance(context);
  }

  @Test
  public void testGetStatusWithoutPriorEntry() {
    MobileAppKeyStatus status = keyStatusSharedPrefs_.getStatus("AppKey1");
    assertEquals(MobileAppKeyStatus.UNKNOWN, status);
  }

  @Test
  public void testGetStatusWithPreviousEntry() {
    keyStatusSharedPrefs_.setStatus("AppKey2", MobileAppKeyStatus.SERVER_VALID);
    MobileAppKeyStatus status = keyStatusSharedPrefs_.getStatus("AppKey2");
    assertEquals(MobileAppKeyStatus.SERVER_VALID, status);
  }

  @Test
  public void testGetStatusWithExpiredEntry() {
    keyStatusSharedPrefs_.setStatusWithTime("AppKey3", MobileAppKeyStatus.SERVER_VALID, 1234);
    MobileAppKeyStatus status = keyStatusSharedPrefs_.getStatusWithTime("AppKey3", 12345);
    assertEquals(MobileAppKeyStatus.UNKNOWN, status);
  }

  @Test
  public void testSetStatus() {
    keyStatusSharedPrefs_.setStatus("AppKey4", MobileAppKeyStatus.SERVER_INVALID);
    MobileAppKeyStatus status = keyStatusSharedPrefs_.getStatus("AppKey4");
    assertEquals(MobileAppKeyStatus.SERVER_INVALID, status);
  }

  @Test
  public void testGetStatusWithPriorInvalidEntry() {
    // Manually enter a bogus status into the shared prefs.
    SharedPreferences sharedPrefs = RuntimeEnvironment.application.getSharedPreferences(
      AppKeyStatusSharedPrefs.SHARED_PREFS_NAME, Context.MODE_PRIVATE);
    String statusPrefKey = AppKeyStatusSharedPrefs.createPrefKeyForKeyStatus("AppKey5");
    String expirationPrefKey =
      AppKeyStatusSharedPrefs.createPrefKeyForKeyStatusExpiration("AppKey5");
    sharedPrefs.edit()
      .putString(statusPrefKey, "bogusStatus")
      .putLong(expirationPrefKey, 12345)
      .commit();
    MobileAppKeyStatus status = keyStatusSharedPrefs_.getStatusWithTime("AppKey5", 12344);
    assertEquals(MobileAppKeyStatus.UNKNOWN, status);
  }

  @Test
  public void testGetStatusWithNullAppKey() {
    MobileAppKeyStatus status = keyStatusSharedPrefs_.getStatus(null);
    assertEquals(MobileAppKeyStatus.MISSING, status);
  }

  @Test
  public void testGetStatusWithEmptyAppKey() {
    MobileAppKeyStatus status = keyStatusSharedPrefs_.getStatus("");
    assertEquals(MobileAppKeyStatus.MISSING, status);
  }
}
