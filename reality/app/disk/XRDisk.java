package com.the8thwall.reality.app.disk;

// import com.the8thwall.c8.annotations.UsedByReflection;

//@UsedByReflection("RemoteBridge.cs")
public class XRDisk {
  public static void create() { XRDiskJni.create(); }
  public static void destroy() { XRDiskJni.destroy(); }
  public static boolean isLogging() { return XRDiskJni.isLogging(); }
  public static int framesLogged() { return XRDiskJni.framesLogged(); }
  public static void logToDisk(int nFrames) { XRDiskJni.logToDisk(nFrames); }
}
