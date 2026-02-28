package com.the8thwall.reality.app.device;

import android.content.Context;

/**
 * Interface used to provide information of the device currently running.
 * Intented to allow for easier unit testing around static method/fields that cannot
 * be mocked easily.
 */
public interface AndroidDevice {

  /**
   * Returns the id uniquely identifying the device.
   * TODO(alvin): The Secure.ANDROID_ID no longer provides unique ids on Android O. Figure out
   * an alternative for that.
   */
  String getDeviceId(Context context);

  /**
   * Returns the locale currently set on the device in a "{language code}_{country code}" format.
   */
  String getLocale();

  /**
   * Returns the manufacturer of the device.
   */
  String getManufacturer();

  /**
   * Returns the model of the device.
   */
  String getModel();

  /**
   * Returns the operating system of the device. For non-test implementations, this should always return "Android".
   */
  String getOs();

  /**
   * Returns the API level version of the device.
   * e.g. Android N - "24"
   *      Android N_MR - "25"
   *      Android O - "26"
   */
  String getOsVersion();
}
