package com.the8thwall.apps.client.internalqa.omniscope.android.bridge;

import java.nio.ByteBuffer;

/**
 * Wrapper class around the native functions called by {@link Omniscope}.
 */
class OmniscopeJni {
  static native void newXRAndroid();
  static native void deleteXRAndroid();
  static native ByteBuffer executeStagedRealityRequest();
  static native void createCaptureContext(long sharedContext);
  static native void initializeCameraPipeline(int captureWidth, int captureHeight);
  static native int getSourceTexture();
  static native int currentView();
  static native void gotTouches(int count);
  static native void setView(int num);
  static native void goNext();
  static native void goPrev();
  static native void destroyCaptureContext();
  static native void processGlFrameAndStageRequest(float[] mtx, ByteBuffer request);
  static native void renderFrameForDisplay();
  static native void pause();
  static native void resume();
  static native void configure(ByteBuffer config);
  static native byte[] getAndResetAnalyticsRecord(ByteBuffer recordHeader);
}
