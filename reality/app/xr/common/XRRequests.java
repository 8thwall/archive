package com.the8thwall.reality.app.xr.common;

import com.the8thwall.reality.engine.api.base.GeoTypes.Position32f;
import com.the8thwall.reality.engine.api.base.GeoTypes.Quaternion32f;

/**
 * Utility class for operations perfromed on {@link RealityRequest}s.
 */
public final class XRRequests {

  public static void setPosition32f(float x, float y, float z, Position32f.Builder position) {
    position.setX(x);
    position.setY(y);
    position.setZ(z);
  }

  public static void setQuaternion32f(float w, float x, float y, float z, Quaternion32f.Builder rotation) {
    rotation.setW(w);
    rotation.setX(x);
    rotation.setY(y);
    rotation.setZ(z);
  }
}
