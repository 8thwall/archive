package com.the8thwall.reality.app.remote;

import java.nio.ByteBuffer;

/**
 * Wrapper class around the native functions called by {@link XRAndroid}.
 */
class XRRemoteJni {
  static native void createRemote();
  static native void destroyRemote();
  static native void enableRemote();
  static native void sendRemoteApp(ByteBuffer remoteMessage);
  static native void resumeBrowsingForServers();
  static native void pauseBrowsingForServers();
  static native void resumeConnectionToServer(ByteBuffer remoteMessage);
  static native void pauseConnectionToServer();
  static native ByteBuffer getRemoteResponse();
  static native ByteBuffer getRemoteConnection();
}
