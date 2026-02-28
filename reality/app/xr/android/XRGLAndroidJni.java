package com.the8thwall.reality.app.xr.android;

import java.nio.ByteBuffer;

/**
 * Wrapper class around the native functions called by {@link XRAndroid}.
 */
class XRGLAndroidJni {
  static native void newXRAndroid();
  static native void deleteXRAndroid();
  static native ByteBuffer query(ByteBuffer request);
  static native void configure(ByteBuffer config);
  static native ByteBuffer executeStagedRealityRequest();
  static native void createCaptureContext(long sharedContext);
  static native void initializeCameraPipeline(int captureWidth, int captureHeight);
  static native int getSourceTexture();
  static native void destroyCaptureContext();
  static native void processGlFrameAndStageRequest(float[] mtx, ByteBuffer request);
  static native ByteBuffer renderFrameForDisplay();
  static native void pause();
  static native void resume();
  static native void recenter();
  static native byte[] getAndResetAnalyticsRecord(ByteBuffer recordHeader);
}
