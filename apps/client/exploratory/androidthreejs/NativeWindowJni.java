package com.nianticlabs.apps.client.exploratory.androidthreejs;

import android.view.Surface;

public class NativeWindowJni {
  public static native long acquireSurface(Surface surface);
  public static native void releaseSurface(long nativeWindow);
}
