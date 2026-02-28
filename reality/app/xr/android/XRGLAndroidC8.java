package com.the8thwall.reality.app.xr.android;

import com.the8thwall.c8.protolog.api.LogRequest.RealityEngineLogRecordHeader;
import com.the8thwall.reality.app.app.AndroidApp;
import com.the8thwall.reality.app.device.AndroidDeviceInfo;
import com.the8thwall.reality.app.sensors.camera.AndroidNativeCameraData;
import com.the8thwall.reality.app.sensors.camera.GlAndroidCameraSensor;
import com.the8thwall.reality.app.sensors.camera.GlAndroidCameraSensorFactory;
import com.the8thwall.reality.app.xr.common.ApiLimits;
import com.the8thwall.reality.engine.api.Reality.RealityRequest;
import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.Reality.XRAppEnvironment;
import com.the8thwall.reality.engine.api.Reality.XRCapabilities;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREnvironment;
import com.the8thwall.reality.engine.api.request.App.AppContext.DeviceNaturalOrientation;

import org.capnproto.MessageBuilder;

import android.content.Context;
import android.os.Handler;
import android.util.Log;
import android.view.Surface;

import java.nio.ByteBuffer;
import java.nio.IntBuffer;

import com.google.ar.core.ArCoreApk;

public class XRGLAndroidC8
  extends XRGLAndroidDriver implements GlAndroidCameraSensor.FrameProcessor {
  private static final String TAG = "8thWallJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[XRGLAndroidC8] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private final Context context_;
  private XRConfiguration.Reader xRConfig_;
  private GlAndroidCameraSensor cameraSensor_;
  // Tested on Samsung Galaxy S5 running Android 6.0.1. Camera settings will not take effect
  // without closing and opening the camera again
  private boolean isRunning_ = false;

  private XRGLAndroidC8(Context context, XRGLAndroid xr) {
    super(xr);
    context_ = context;
    cameraSensor_ = GlAndroidCameraSensorFactory.create(context, this);
    xRConfig_ = new MessageBuilder().initRoot(XRConfiguration.factory).asReader();
  }

  public static XRGLAndroidC8 create(Context context, XRGLAndroid xr) {
    logD("create");
    return new XRGLAndroidC8(context, xr);
  }

  @Override
  public void destroy() {
    logD("destroy");
    if (isRunning_) {
      pause();
    }

    if (cameraSensor_ != null) {
      cameraSensor_.destroy();
      cameraSensor_ = null;
    }
  }

  @Override
  public void configure(XRConfiguration.Reader config) {
    logD("configure");
    if (config.hasMask()) {
      this.xRConfig_ = config;
    }
    if (config.hasCameraConfiguration()) {
      cameraSensor_.configure(config.getCameraConfiguration().getAutofocus());
    }
  }

  @Override
  public void resume() {
    logD("resume");
    cameraSensor_.resume();
    isRunning_ = true;
  }

  // Stop an XRGLAndroidC8.
  @Override
  public void pause() {
    logD("pause");
    cameraSensor_.pause();
    isRunning_ = false;
  }

  public static void exportXREnvironment(Context context, XREnvironment.Builder builder) {
    builder.setRealityImageWidth(ApiLimits.IMAGE_PROCESSING_WIDTH);
    builder.setRealityImageHeight(ApiLimits.IMAGE_PROCESSING_HEIGHT);
    builder.setRealityImageShader(XREnvironment.ImageShaderKind.STANDARD_RGBA);
    builder.getCapabilities().setPositionTracking(
      XRCapabilities.PositionalTrackingKind.ROTATION_AND_POSITION_NO_SCALE);
    builder.getCapabilities().setSurfaceEstimation(
      XRCapabilities.SurfaceEstimationKind.FIXED_SURFACES);
    builder.getCapabilities().setTargetImageDetection(
      XRCapabilities.TargetImageDetectionKind.UNSUPPORTED);

    builder.setARCoreAvailability(getARCoreAvailability(context));
  }

  private static XREnvironment.ARCoreAvailability getARCoreAvailability(Context context) {
    switch (ArCoreApk.getInstance().checkAvailability(context)) {
      case SUPPORTED_APK_TOO_OLD:
        return XREnvironment.ARCoreAvailability.SUPPORTED_APK_TOO_OLD;
      case SUPPORTED_NOT_INSTALLED:
        return XREnvironment.ARCoreAvailability.SUPPORTED_NOT_INSTALLED;
      case UNKNOWN_CHECKING:
      case UNKNOWN_ERROR:
      case UNKNOWN_TIMED_OUT:
        return XREnvironment.ARCoreAvailability.UNKNOWN;
      case UNSUPPORTED_DEVICE_NOT_CAPABLE:
        return XREnvironment.ARCoreAvailability.UNSUPPORTED_DEVICE_NOT_CAPABLE;
      case SUPPORTED_INSTALLED:
        // This generally won't happen. However, if the user opens the app without ARCore
        // installed, then goes and installs ARCore, then resumes this app, it is possible
        // that the ARCore check would start returning supported. Since the XREnvironment is
        // grabbed on every frame, let's not crash or throw errors here.
        return XREnvironment.ARCoreAvailability.SUPPORTED_INSTALLED;
      default:
      return XREnvironment.ARCoreAvailability.UNSPECIFIED;
    }
  }

  @Override
  public void getXRAppEnvironment(XRAppEnvironment.Builder builder) {}

  @Override
  public void initializeCameraPipeline(int captureWidth, int captureHeight) {
    getXR().initializeCameraPipeline(captureWidth, captureHeight);
  }

  @Override
  public int getCaptureTexture() {
    return getXR().getSourceTexture();
  }

  @Override
  public Handler captureHandler() {
    return getXR().captureHandler();
  }

  @Override
  public Handler processingHandler() {
    return getXR().processingHandler();
  }

  @Override
  public void doCaptureProcessing(float[] mtx, AndroidNativeCameraData cameraData) {
    MessageBuilder requestMessage = new MessageBuilder();
    RealityRequest.Builder requestBuilder = requestMessage.initRoot(RealityRequest.factory);

    AndroidDeviceInfo.getDefault().exportInfo(requestBuilder.getDeviceInfo());
    if (xRConfig_ != null) {
      requestBuilder.setXRConfiguration(xRConfig_);
    }

    requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setWidth(
      cameraData.minCaptureDimension);
    requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setHeight(
      cameraData.maxCaptureDimension);

    AndroidApp.exportAppContext(requestBuilder.getAppContext(), context_);

    // Set the timestamp of the frame.
    requestBuilder.getSensors().getCamera().getCurrentFrame().setTimestampNanos(
      cameraData.timestampNanos);

    requestBuilder.getSensors().getCamera().setSensorOrientation(cameraData.sensorOrientation);

    XRGLAndroid.RealityData realityData =
      new XRGLAndroid.RealityData.Builder().setRequestMessage(requestMessage).build();

    // TODO(nb): update mtx based off the device orientation from
    // AndroidApp.exportAppContext(requestBuilder.getAppContext(), context_);
    if (
      requestBuilder.getAppContext().getNaturalOrientation()
      == DeviceNaturalOrientation.LANDSCAPE_UP) {
      // Rotate 90
      mtx[12] += mtx[0];
      mtx[13] += mtx[1];
      mtx[14] += mtx[2];
      mtx[15] += mtx[3];
      float m0 = mtx[0];
      float m1 = mtx[1];
      float m2 = mtx[2];
      float m3 = mtx[3];
      mtx[0] = mtx[4];
      mtx[1] = mtx[5];
      mtx[2] = mtx[6];
      mtx[3] = mtx[7];
      mtx[4] = -m0;
      mtx[5] = -m1;
      mtx[6] = -m2;
      mtx[7] = -m3;
    }

    // Flip:
    mtx[12] += mtx[4];
    mtx[13] += mtx[5];
    mtx[14] += mtx[6];
    mtx[15] += mtx[7];
    mtx[4] *= -1;
    mtx[5] *= -1;
    mtx[6] *= -1;
    mtx[7] *= -1;
    getXR().processGlAndStageRequest(mtx, realityData);
  }

  @Override
  public void doFrameProcessing() {
    getXR().executeStagedRequest();
  }

  @Override
  public RealityEngineLogRecordHeader.EngineType getType() {
    return RealityEngineLogRecordHeader.EngineType.C8;
  }
}
