package com.the8thwall.reality.app.xr.common;

/**
 * Compile time constants for the amount of data exported by the XR API.
 */
public class ApiLimits {
  public static final int MAX_FEATURES = 500;

  public static final int MATRIX44 = 16;

  public static final int MAX_SURFACES = 15;
  public static final int MAX_SURFACE_FACES = 1425;
  public static final int MAX_SURFACE_VERTICES = 750;

  public static final int IMAGE_PROCESSING_WIDTH = 480;
  public static final int IMAGE_PROCESSING_HEIGHT = 640;

  public static final int MAX_TOUCHES = 50;

  // Static utility class. Do not instantiate.
  private ApiLimits() {}
}
