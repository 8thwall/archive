package com.the8thwall.reality.app.disk;

import java.nio.ByteBuffer;

/**
 * Wrapper class around the native functions called by {@link XRDisk}.
 */
class XRDiskJni {
  static native void create();
  static native void destroy();
  static native boolean isLogging();
  static native int framesLogged();
  static native void logToDisk(int numFrames);
}
