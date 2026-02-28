package com.the8thwall.reality.app.validation.android;

import com.the8thwall.c8.annotations.VisibleForTesting;
import com.the8thwall.c8.protolog.api.LogRequest.AppLogRecordHeader.MobileAppKeyStatus;
import com.the8thwall.c8.string.StringUtils;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;

/**
 * Implementation of {@link AppStatusStorage} backed by {@link SharedPreferences}.
 * Each entry will have an expiration time of 15 minutes, after which the entry will be
 * removed.
 */
public class AppKeyStatusSharedPrefs implements AppKeyStatusStorage {

  @VisibleForTesting
  static final String SHARED_PREFS_NAME = "com.the8thwall.validation.appkey";

  private static final int TIME_TO_EXPIRE_MS = 1000 * 60 * 15; // 15min in milliseconds
  private static final String STATUS_PREF_KEY_SUFFIX = "_status";
  private static final String EXPIRATION_PREF_KEY_SUFFIX = "_expiration";
  private static final String TAG = "8thWallJava";

  private static AppKeyStatusSharedPrefs sAppKeyStatusSharedPrefs;

  private SharedPreferences sharedPrefs_;

  public static AppKeyStatusSharedPrefs getInstance(Context context) {
    if (sAppKeyStatusSharedPrefs == null) {
      sAppKeyStatusSharedPrefs = new AppKeyStatusSharedPrefs(context);
    }

    return sAppKeyStatusSharedPrefs;
  }

  private AppKeyStatusSharedPrefs(Context context) {
    sharedPrefs_ = context.getSharedPreferences(SHARED_PREFS_NAME, Context.MODE_PRIVATE);
  }

  @Override
  public MobileAppKeyStatus getStatus(String appKey) {
    return getStatusWithTime(appKey, System.currentTimeMillis());
  }

  @VisibleForTesting
  MobileAppKeyStatus getStatusWithTime(String appKey, long currentTimeMs) {
    if (StringUtils.isNullOrEmpty(appKey)) {
      return MobileAppKeyStatus.MISSING;
    }

    String prefKey = createPrefKeyForKeyStatus(appKey);
    if (!sharedPrefs_.contains(prefKey)) {
      return MobileAppKeyStatus.UNKNOWN;
    }

    if (hasExpiredStatus(appKey, currentTimeMs)) {
      removeStatusEntryForAppKey(appKey);
      return MobileAppKeyStatus.UNKNOWN;
    }

    String expirationPrefKey = createPrefKeyForKeyStatusExpiration(appKey);
    String statusName = sharedPrefs_.getString(prefKey, null);
    MobileAppKeyStatus status = MobileAppKeyStatus.UNKNOWN;

    try {
      status = Enum.valueOf(MobileAppKeyStatus.class, statusName);
    } catch(IllegalArgumentException e) {
      // Enum names have changed. Throw away previous value.
      removeStatusEntryForAppKey(appKey);
      status = MobileAppKeyStatus.UNKNOWN;
    }

    return status;
  }

  private boolean hasExpiredStatus(String appKey, long currentTimeMs) {
    String expirationPrefKey = createPrefKeyForKeyStatusExpiration(appKey);
    long expirationTime = sharedPrefs_.getLong(expirationPrefKey, 0);
    return currentTimeMs > expirationTime;
  }

  private void removeStatusEntryForAppKey(String appKey) {
    String statusPrefKey = createPrefKeyForKeyStatus(appKey);
    String expirationPrefKey = createPrefKeyForKeyStatusExpiration(appKey);

    sharedPrefs_.edit()
      .remove(statusPrefKey)
      .remove(expirationPrefKey)
      .commit();
  }

  @Override
  public void setStatus(String appKey, MobileAppKeyStatus status) {
    setStatusWithTime(appKey, status, System.currentTimeMillis() + TIME_TO_EXPIRE_MS);
  }

  @VisibleForTesting
  void setStatusWithTime(String appKey, MobileAppKeyStatus status, long expirationTimeMs) {
    String statusPrefKey = createPrefKeyForKeyStatus(appKey);
    String expirationPrefKey = createPrefKeyForKeyStatusExpiration(appKey);

    sharedPrefs_.edit()
      .putString(statusPrefKey, status.name())
      .putLong(expirationPrefKey, expirationTimeMs)
      .commit();
  }

  @VisibleForTesting
  static String createPrefKeyForKeyStatus(String appKey) {
    return appKey + STATUS_PREF_KEY_SUFFIX;
  }

  @VisibleForTesting
  static String createPrefKeyForKeyStatusExpiration(String appKey) {
    return appKey + EXPIRATION_PREF_KEY_SUFFIX;
  }
}
