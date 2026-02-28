package com.nianticlabs.apps.client.exploratory.androidthreejs;

public class NodeBindingJni {
  // Called from the Node thread.
  public static native Integer
  onCreate(String[] arguments, String nodePath, long nativeWindow, int width, int height);

  // Called from the application main thread.
  public static native Integer onDestroy();

  // Called from the application main thread.
  public static native void processAnimationFrames(long frameTimeNanos);
}
