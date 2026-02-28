package com.the8thwall.reality.app.validation.android;

import com.the8thwall.c8.protolog.api.LogRequest.AppLogRecordHeader.MobileAppKeyStatus;

/**
 * Interface for managing the status of mobile app keys.
 */
public interface AppKeyStatusStorage {

  /**
   * Retrieves the status of the given app key. If a status does not already exist,
   * {@link AppKeyStatus.UNKNOWN} will be returned.
   */
  MobileAppKeyStatus getStatus(String appKey);

  /**
   * Sets the status for the given app key.
   */
  void setStatus(String appKey, MobileAppKeyStatus status);
}
