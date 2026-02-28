package com.the8thwall.reality.app.device;

import android.content.Context;
import android.os.Build;
import android.provider.Settings.Secure;

import java.util.Locale;

/**
 * {@link AndroidDevice} implementation used for production builds. Will provide real data of the
 * Android device executing this code.
 */
public class AndroidDeviceImpl implements AndroidDevice {

  private static final String OPERATING_SYSTEM = "Android";

  @Override
  public String getDeviceId(Context context) {
    return Secure.getString(context.getContentResolver(), Secure.ANDROID_ID);
  }

  @Override
  public String getLocale() {
    return Locale.getDefault().toString();
  }

  @Override
  public String getManufacturer() {
    return Build.MANUFACTURER;
  }

  @Override
  public String getModel() {
    return Build.MODEL;
  }

  @Override
  public String getOs() {
    return OPERATING_SYSTEM;
  }

  @Override
  public String getOsVersion() {
    return Build.VERSION.RELEASE;
  }
}
