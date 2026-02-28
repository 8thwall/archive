package com.the8thwall.reality.app.remote;

import com.the8thwall.c8.annotations.UsedByReflection;
import com.the8thwall.c8.io.C8CapnpSerialize;
import com.the8thwall.c8.protolog.api.RemoteRequest.XrRemoteApp;
import com.the8thwall.c8.protolog.api.RemoteRequest.XrAppDeviceInfo.XrDeviceOrientation;
import com.the8thwall.c8.protolog.api.RemoteRequest.XrTouch.XrTouchPhase;
import com.the8thwall.reality.app.xr.common.XRExtern;
import android.app.Activity;
import android.content.Context;
import android.net.nsd.NsdManager;
import android.util.Log;

import java.nio.ByteBuffer;

import org.capnproto.MessageBuilder;

@UsedByReflection("RemoteBridge.cs")
public class XRRemote {
  private static final String TAG = "8thWallJava";
  private static NsdManager nsdManager_;  // Needed for frame logging.

  /**
   * Creates an {@link XRRemote} singleton with the provided activity.
   */
  public static void createRemote(Activity activity) {
    if (nsdManager_ == null) {
      nsdManager_ = (NsdManager)activity.getSystemService(Context.NSD_SERVICE);  // For log stream.
    }
    XRRemoteJni.createRemote();
  }

  public static void destroyRemote() {
    XRRemoteJni.destroyRemote();
  }

  public static void enableRemote() {
    XRRemoteJni.enableRemote();
  }

  public static void sendRemoteApp(byte[] remote) {
    ByteBuffer b = ByteBuffer.allocateDirect(remote.length);
    b.put(remote);
    b.rewind();
    XRRemoteJni.sendRemoteApp(b);
  }

  public static void resumeBrowsingForServers() {
    XRRemoteJni.resumeBrowsingForServers();
  }

  public static void pauseBrowsingForServers() {
    XRRemoteJni.pauseBrowsingForServers();
  }

  /**
   * Select server to log to.
   */
  public static void resumeConnectionToServer(byte[] server) {
    ByteBuffer b = ByteBuffer.allocateDirect(server.length);
    b.put(server);
    b.rewind();
    XRRemoteJni.resumeConnectionToServer(b);
  }

  public static void pauseConnectionToServer() {
    XRRemoteJni.pauseConnectionToServer();
  }

  public static byte[] getRemoteResponse() {
    ByteBuffer buf = XRRemoteJni.getRemoteResponse();
    byte[] arr = new byte[buf.remaining()];
    buf.get(arr);
    return arr;
  }

  /**
   * Get list of available servers.
   */
  public static byte[] getRemoteConnection() {
    ByteBuffer buf = XRRemoteJni.getRemoteConnection();
    byte[] arr = new byte[buf.remaining()];
    buf.get(arr);
    return arr;
  }
}
