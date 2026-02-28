package com.the8thwall.reality.app.xr.common;

import com.the8thwall.c8.annotations.UsedByReflection;
import com.the8thwall.reality.engine.api.Reality.RealityRequest;
import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.base.GeoTypes.ActiveSurface;
import com.the8thwall.reality.engine.api.base.GeoTypes.SurfaceFace;
import com.the8thwall.reality.engine.api.base.GeoTypes.SurfaceVertex;

/**
 * External API for passing data from Java to Unity through JNI. The public final field names and
 * public method names are not obfuscated by proguard.
 */
public class XRExtern {

  public static final int RENDERING_SYSTEM_UNSPECIFIED = 0;
  public static final int RENDERING_SYSTEM_OPENGL = 1;
  public static final int RENDERING_SYSTEM_METAL = 2;

  // Disable instantiation for XRExtern.
  private XRExtern() {}
}
