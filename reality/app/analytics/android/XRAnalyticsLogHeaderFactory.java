package com.the8thwall.reality.app.analytics.android;

import android.content.Context;
import android.os.Build;
import android.provider.Settings.Secure;
import android.util.Log;

import com.the8thwall.c8.annotations.VisibleForTesting;
import com.the8thwall.c8.protolog.api.LogRequest.AppLogRecordHeader;
import com.the8thwall.c8.protolog.api.LogRequest.AppLogRecordHeader.MobileAppKeyStatus;
import com.the8thwall.c8.protolog.api.LogRequest.DeviceLogRecordHeader;
import com.the8thwall.c8.protolog.api.LogRequest.LogRecordHeader;
import com.the8thwall.c8.protolog.api.LogRequest.RealityEngineLogRecordHeader;
import com.the8thwall.c8.string.StringUtils;
import com.the8thwall.reality.app.device.AndroidDevice;
import com.the8thwall.reality.app.device.AndroidDeviceImpl;
import com.the8thwall.reality.app.device.AndroidDeviceInfo;
import com.the8thwall.reality.app.validation.android.AppKeyStatusSharedPrefs;
import com.the8thwall.reality.app.validation.android.AppKeyStatusStorage;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Locale;

import org.capnproto.MessageBuilder;

/**
 * Factory class for creating the header struct attached to each analytics event that is logged
 * to the server. This struct will contain information such as: device info, engine type,
 * application info, etc.
 */
public class XRAnalyticsLogHeaderFactory {

  private static String TAG = "8thWallJava";

  private static XRAnalyticsLogHeaderFactory defaultFactory_ = null;

  private AndroidDevice device_;
  private AndroidDeviceInfo deviceInfo_;

  /**
   * Returns an {@link XRAnalyticsLogHeaderFactory} backed by the {@link AndroidDeviceInfo}
   * instance returned by {@link AndroidDeviceInfo#getDefault()}.
   */
  public static XRAnalyticsLogHeaderFactory getDefault() {
    if (defaultFactory_ == null) {
      defaultFactory_ =
        new XRAnalyticsLogHeaderFactory(new AndroidDeviceImpl(), AndroidDeviceInfo.getDefault());
    }
    return defaultFactory_;
  }

  public XRAnalyticsLogHeaderFactory(AndroidDevice device, AndroidDeviceInfo deviceInfo) {
    device_ = device;
    deviceInfo_ = deviceInfo;
  }

  /**
   * Exports information to the header struct that will be attached to analytics events
   * that are logged to the server.
   *
   * @param context the current running context
   * @param engineType the type of engine used. For Android, this is the implementation of
   * {@link XRAndroidDriver}.
   * @param builder the struct builder to add information to
   */
  public void exportLogHeaderInfo(
    Context context,
    RealityEngineLogRecordHeader.EngineType engineType,
    String appKey,
    LogRecordHeader.Builder builder) {
    AppLogRecordHeader.Builder appHeader = builder.getApp();
    exportAppHeader(context, appKey, appHeader);

    DeviceLogRecordHeader.Builder deviceHeader = builder.getDevice();
    exportDeviceHeader(context, deviceHeader);

    RealityEngineLogRecordHeader.Builder engineHeader = builder.getReality();
    exportEngineHeader(engineType, engineHeader);
  }

  private static void exportAppHeader(
    Context context, String appKey, AppLogRecordHeader.Builder builder) {
    builder.setAppId(context.getPackageName());
    if (!StringUtils.isNullOrEmpty(appKey)) {
      AppKeyStatusStorage storage = AppKeyStatusSharedPrefs.getInstance(context);
      builder.setMobileAppKeyStatus(storage.getStatus(appKey));
      builder.setMobileAppKey(appKey);
    } else {
      builder.setMobileAppKeyStatus(MobileAppKeyStatus.MISSING);
    }
  }

  private void exportDeviceHeader(Context context, DeviceLogRecordHeader.Builder builder) {
    String deviceId = device_.getDeviceId(context);
    if (deviceId != null && Build.VERSION.SDK_INT < Build.VERSION_CODES.O) {
      builder.setDeviceId(deviceId);

      String idForVendor = createIdForVendor(context.getPackageName(), deviceId);
      builder.setIdForVendor(idForVendor);
    }

    deviceInfo_.exportInfo(builder.getDeviceInfo());

    String idForApp = createIdForApp(context.getPackageName(), deviceId);
    builder.setIdForApp(idForApp);

    String locale = device_.getLocale();
    builder.setLocale(locale);
  }

  @VisibleForTesting
  static String createIdForVendor(String packageName, String deviceId) {
    if (StringUtils.isNullOrEmpty(packageName)) {
      return "";
    }

    return hashNameAndDeviceId(getVendorNameFromPackageName(packageName), deviceId);
  }

  @VisibleForTesting
  static String getVendorNameFromPackageName(String packageName) {
    if (StringUtils.isNullOrEmpty(packageName)) {
      return "";
    }

    int lastSeparatorIndex = packageName.lastIndexOf('.');

    return lastSeparatorIndex == -1 ? packageName : packageName.substring(0, lastSeparatorIndex);
  }

  @VisibleForTesting
  static String hashNameAndDeviceId(String name, String deviceId) {
    String plainTextId = name + deviceId;
    try {
      MessageDigest messageDigest = MessageDigest.getInstance("MD5");
      messageDigest.update(plainTextId.getBytes());
      BigInteger bigInt = new BigInteger(1, messageDigest.digest());
      return bigInt.toString(16);
    } catch (NoSuchAlgorithmException e) {
      Log.d(TAG, "Falling back to String#hashCode for idForVendor", e);
      return Integer.toHexString(plainTextId.hashCode());
    }
  }

  private String createIdForApp(String packageName, String deviceId) {
    return Build.VERSION.SDK_INT < Build.VERSION_CODES.O
      ? hashNameAndDeviceId(packageName, deviceId)
      : deviceId;
  }

  private static void exportEngineHeader(
    RealityEngineLogRecordHeader.EngineType engineType,
    RealityEngineLogRecordHeader.Builder builder) {
    builder.setEngineId(engineType);
  }

  /**
   * Creates a new {@link LogRecordHeader} struct filled with the information exported
   * by {@link #exportLogHeaderInfo(LogRecordHeader.Builder)}.
   *
   * @param context the current running context
   * @param engineType the type of engine used. For Android, this is the implementation of
   * {@link XRAndroidDriver}.
   */
  public LogRecordHeader.Reader createLogRecordInfo(
    Context context, RealityEngineLogRecordHeader.EngineType engineType, String appKey) {
    MessageBuilder recordMessage = new MessageBuilder();
    LogRecordHeader.Builder recordBuilder = recordMessage.initRoot(LogRecordHeader.factory);
    exportLogHeaderInfo(context, engineType, appKey, recordBuilder);
    return recordBuilder.asReader();
  }
}
