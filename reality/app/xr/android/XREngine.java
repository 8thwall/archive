package com.the8thwall.reality.app.xr.android;

import com.the8thwall.c8.annotations.UsedByReflection;
import com.the8thwall.c8.io.C8CapnpSerialize;
import com.the8thwall.c8.protolog.api.LogRequest.LogRecordHeader;
import com.the8thwall.c8.protolog.api.LogRequest.RealityEngineLogRecordHeader;
import com.the8thwall.c8.protolog.api.RemoteRequest.XrRemoteApp;
import com.the8thwall.c8.protolog.api.RemoteRequest.XrAppDeviceInfo.XrDeviceOrientation;
import com.the8thwall.c8.protolog.api.RemoteRequest.XrTouch.XrTouchPhase;
import com.the8thwall.reality.app.analytics.android.XRAnalyticsLogger;
import com.the8thwall.reality.app.analytics.android.XRAnalyticsLogHeaderFactory;
import com.the8thwall.reality.app.validation.android.XRAppValidator;
import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.Reality.XRAppEnvironment;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREngineConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREnvironment;
import com.the8thwall.reality.engine.api.Reality.XrQueryRequest;
import com.the8thwall.reality.engine.api.Reality.XrQueryResponse;

import android.app.Activity;
import android.content.Context;
import android.net.nsd.NsdManager;
import android.opengl.EGL14;
import android.opengl.EGLContext;
import android.os.Build;
import android.util.Log;
import android.view.Surface;

import com.google.ar.core.ArCoreApk;

import java.nio.ByteBuffer;

import org.capnproto.MessageBuilder;

/**
 * Top level class used by external code (i.e C#, application code, etc.) Primarily used to delegate between
 * existing Android implementations of xr-engine, such as {@link XRAndroid} and {@XRGLAndroid}.
 */
@UsedByReflection("NativeBridge.cs")
public abstract class XREngine {
  private static String TAG = "8thWallJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[XREngine] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }


  private static XREngine instance_;

  public static void loadNativeLibrary(String library) {
    logD(String.format("loadNativeLibrary(%s)", library));
    System.loadLibrary(library);
  }

  public static boolean isArCoreSupported(Context context) {
    return ArCoreApk.getInstance().checkAvailability(context)
      == ArCoreApk.Availability.SUPPORTED_INSTALLED;
  }

  /**
   * Creates an instance of the {@link XREngine}.
   */
  public static void create(Context context, int renderingSystem) {
    if (instance_ != null) {
      return;
    }

    logD("create XRGLAndroid");
    instance_ = new XRGLAndroid(context);
    instance_.initializeDriver();
    logD("create complete");
  }

  /**
   * Retreives the existing instance of {@link XREngine}. If an instance does not already exist,
   * a {@link RuntimeException} is thrown.
   */
  public static XREngine getInstance() {
    if (null == instance_) {
      throw new RuntimeException("XREngine has not been created with a context");
    }
    return instance_;
  }

  /**
   * Tearsdown the existing {@link XREngine} instance previously created by {@link XREngine#create}.geReader
   * If an instance does not exist, this does nothing.
   */
  public static synchronized void destroy() {
    if (instance_ != null) {
      logD("destroy");
      instance_.instanceDestroy();
      logD("destroy complete");
      instance_ = null;
    }
  }

  /**
   * @return the serialized {@link XREnvironment} for the given context
   */
  public static byte[] getXREnvironment(Context context) {
    XREngineConfiguration.SpecialExecutionMode mode =
      XREngineConfiguration.SpecialExecutionMode.NORMAL;

    if (instance_ != null) {
      mode = instance_.getEngineMode();
    }

    return XRGLAndroid.getXREnvironment(context, mode);
  }

  /**
   * @return a reader of the {@link XREnvironment} for the given context
   */
  public static XREnvironment.Reader getXREnvironmentReader(Context context) {
    XREngineConfiguration.SpecialExecutionMode mode =
      XREngineConfiguration.SpecialExecutionMode.NORMAL;

    if (instance_ != null) {
      mode = instance_.getEngineMode();
    }

    return XRGLAndroid.getXREnvironmentReader(context, mode);
  }

  /**
   * Resumes the engine.
   */
  public abstract void resume();
  /**
   * Recenters the tracking to the origin current set on the engine.
   */
  public abstract void recenter();
  /**
   * Pauses, but does not destroy, the engine. This does, however, close the camera and pause all sensors.
   */
  public abstract void pause();
  /**
   * Configure an {@link XRAndroid} with the given {@link XRConfiguration}.
   *
   * @param config the configuration to configure the current {@link XRAndroid}
   */
  public abstract void configure(byte[] config);
    /**
   * Configure an {@link XRAndroid} with the given {@link XRConfiguration}.
   *
   * @param config the configuration to configure the current {@link XRAndroid}
   */
  public abstract void configure(XRConfiguration.Reader config);
  /**
   * @return the serialized current {@link XRResponse}.
   */
  public abstract byte[] getCurrentRealityXR();
  /**
   * @return a reader of the current {@link XRResponse}.
   */
  public abstract RealityResponse.Reader getCurrentRealityXRReader();
  /**
   * Queries the engine with the given request. This is run outside of the engine's general camera loop.
   *
   * @param the serialized {@link XrQueryRequest}
   * @return the serialized {@link XrQueryResponse}
   */
  public abstract byte[] query(byte[] request);
  /**
   * Queries the engine with the given request. This is run outside of the engine's general camera loop.
   *
   * @param a {@link XrQueryRequest} reader
   * @return a {@link XrQueryResponse} reader
   */
  public abstract XrQueryResponse.Reader query(XrQueryRequest.Reader request);
  /**
   * @return the current {@link XRAppEnvironment}.
   */
  public abstract byte[] getXRAppEnvironment();
  /**
   * @return the current {@link XRAppEnvironment}.
   */
  public abstract XRAppEnvironment.Reader getXRAppEnvironmentReader();
  /**
   * Sets the app environment.
   */
  public abstract void setXRAppEnvironment(byte[] bytes);
  /**
   * Sets the {@link Surface} on the current {@link XRAndroid}.
   *
   * TODO(nbutko): make this part of configure?
   */
  public abstract void setSurface(Surface surface);
  /**
   * Sets the Unity managed camera RGBA texture on the current {@link XRAndroid}.
   */
  public abstract void setUnityManagedCameraRGBATexture(
    long texHandle, int width, int height, int renderingSystem);
  /**
   * Sets the Unity managed camera Y texture on the current {@link XRAndroid}.
   */
  public abstract void setUnityManagedCameraYTexture(
      long texHandle, int width, int height, int renderingSystem);
  /**
   * Sets the Unity managed camera UV texture on the current {@link XRAndroid}.
   */
  public abstract void setUnityManagedCameraUVTexture(
        long texHandle, int width, int height, int renderingSystem);
  /**
   * Renders the frame for display.
   */
  public abstract void renderFrameForDisplay();

  /**
   * Initializes the driver used by the {@link XREngine}.
   */
  protected abstract void initializeDriver();
  /**
   * Destroys the given instance.
   */
  protected abstract void instanceDestroy();

  /**
   * @return the execution mode set for the engine
   */
  protected abstract XREngineConfiguration.SpecialExecutionMode getEngineMode();
}
