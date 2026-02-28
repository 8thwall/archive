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
import com.the8thwall.reality.app.sensors.gps.AndroidGpsSensor;
import com.the8thwall.reality.app.sensors.pose.AndroidPoseSensor;
import com.the8thwall.reality.app.sensors.pose.AndroidPoseSensor.XRPoseSensorEvent;
import com.the8thwall.reality.app.validation.android.XRAppValidator;
import com.the8thwall.reality.app.xr.common.XRRequests;
import com.the8thwall.reality.engine.api.Reality.RealityRequest;
import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.Reality.XRAppEnvironment;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREngineConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREnvironment;
import com.the8thwall.reality.engine.api.Reality.XrQueryRequest;
import com.the8thwall.reality.engine.api.Reality.XrQueryResponse;
import com.the8thwall.reality.engine.api.request.Sensor.RawPositionalSensorValue;
import com.the8thwall.reality.engine.api.request.Sensor.RawPositionalSensorValue.PositionalSensorKind;
import com.the8thwall.reality.engine.api.request.Sensor.RequestGPS;
import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.location.Location;
import android.net.nsd.NsdManager;
import android.opengl.EGL14;
import android.opengl.EGLContext;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;
import android.view.Surface;

import com.google.ar.core.ArCoreApk;

import java.nio.ByteBuffer;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.Semaphore;

import org.capnproto.MessageBuilder;
import org.capnproto.StructList;

@UsedByReflection("NativeBridge.cs")

public class XRGLAndroid extends XREngine {
  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[XRGLAndroid] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  /**
   * Data passed from the {@link XRGLAndroidDriver} that is sent through to the native layer.
   * Byte buffers may be included for data that cannot be referenced through Java primitives or
   * objects.
   */
  static class RealityData {
    public final MessageBuilder requestMessage;
    public final ByteBuffer frameYBuffer;
    public final ByteBuffer frameUBuffer;
    public final ByteBuffer frameVBuffer;
    public final ByteBuffer frameRBGABuffer;

    private RealityData(
      MessageBuilder message,
      ByteBuffer frameYBuffer,
      ByteBuffer frameUBuffer,
      ByteBuffer frameVBuffer,
      ByteBuffer frameRBGABuffer) {
      this.requestMessage = message;
      this.frameYBuffer = frameYBuffer;
      this.frameUBuffer = frameUBuffer;
      this.frameVBuffer = frameVBuffer;
      this.frameRBGABuffer = frameRBGABuffer;
    }

    static class Builder {
      private MessageBuilder requestMessage_;
      private ByteBuffer frameYBuffer_;
      private ByteBuffer frameUBuffer_;
      private ByteBuffer frameVBuffer_;
      private ByteBuffer frameRBGABuffer_;

      public Builder setRequestMessage(MessageBuilder message) {
        requestMessage_ = message;
        return this;
      }

      public Builder setFrameYBuffer(ByteBuffer buffer) {
        frameYBuffer_ = buffer;
        return this;
      }

      public Builder setFrameUBuffer(ByteBuffer buffer) {
        frameUBuffer_ = buffer;
        return this;
      }

      public Builder setFrameVBuffer(ByteBuffer buffer) {
        frameVBuffer_ = buffer;
        return this;
      }

      public Builder setFrameRGBABuffer(ByteBuffer buffer) {
        frameRBGABuffer_ = buffer;
        return this;
      }

      public Builder setTangoSensorDataBuffer(ByteBuffer buffer) {
        /* TODO(nb): remove */
        return this;
      }

      public RealityData build() {
        assertValidData();
        return new RealityData(
          requestMessage_,
          frameYBuffer_,
          frameUBuffer_,
          frameVBuffer_,
          frameRBGABuffer_);
      }

      private void assertValidData() {
        boolean isInvalid = requestMessage_ == null;  // Drive should provide a valid request.
        if (isInvalid) {
          throw new RuntimeException("Attempting to build invlid RealityData.");
        }
      }
    }
  }

  private static final String TAG = "8thWallJava";
  private static XRGLAndroid instance_;

  private Semaphore cameraOpenCloseLock_ = new Semaphore(1);

  // An additional thread for running tasks that shouldn't block the UI.
  private HandlerThread captureThread_;
  private Handler captureHandler_;

  // An additional thread for running tasks that shouldn't block the UI.
  private HandlerThread processingThread_;
  private Handler processingHandler_;

  private final Context context_;
  private final NsdManager nsdManager_;  // Needed for frame logging.
  private final String realityLock_ = "realityLock";

  private XRGLAndroidDriver xRDriver_;
  private AndroidGpsSensor gpsSensor_;
  private AndroidPoseSensor poseSensor_;
  private byte[] currentXRResponseBytes_;

  private XRConfiguration.Reader xRConfig_;
  private boolean recordGps_ = false;

  private MessageBuilder environmentMessage_;
  private XREnvironment.Builder environmentBuilder_;

  private MessageBuilder appEnvironmentMessage_;
  private XRAppEnvironment.Builder appEnvironmentBuilder_;

  private AtomicBoolean resumed_ = new AtomicBoolean();

  private EGLContext sharedContext_ = null;

  private XREngineConfiguration.SpecialExecutionMode engineMode_ =
    XREngineConfiguration.SpecialExecutionMode.NORMAL;

  XRGLAndroid(Context context) {
    context_ = context;
    XRGLAndroidJni.newXRAndroid();
    nsdManager_ = (NsdManager)context.getSystemService(Context.NSD_SERVICE);  // For log stream.

    environmentMessage_ = new MessageBuilder();
    environmentBuilder_ = environmentMessage_.initRoot(XREnvironment.factory);

    appEnvironmentMessage_ = new MessageBuilder();
    appEnvironmentBuilder_ = appEnvironmentMessage_.initRoot(XRAppEnvironment.factory);

    MessageBuilder realityBuilder = new MessageBuilder();
    realityBuilder.initRoot(RealityResponse.factory);
    currentXRResponseBytes_ = C8CapnpSerialize.serializeToBytes(realityBuilder);
  }

  @Override
  protected void initializeDriver() {
    synchronized (realityLock_) {
      MessageBuilder realityBuilder = new MessageBuilder();
      realityBuilder.initRoot(RealityResponse.factory);
      currentXRResponseBytes_ = C8CapnpSerialize.serializeToBytes(realityBuilder);
    }

    gpsSensor_ = AndroidGpsSensor.create(context_);
    poseSensor_ = AndroidPoseSensor.create(context_);

    if (engineMode_ == XREngineConfiguration.SpecialExecutionMode.REMOTE_ONLY) {
      xRDriver_ = XRGLAndroidRemoteOnly.create(context_, this);
      return;
    }

    if (engineMode_ == XREngineConfiguration.SpecialExecutionMode.DISABLE_NATIVE_AR_ENGINE) {
      xRDriver_ = XRGLAndroidC8.create(context_, this);
      return;
    }

    RealityEngineLogRecordHeader.EngineType type = getEngineType(context_);
    switch (type) {
      case C8:
        xRDriver_ = XRGLAndroidC8.create(context_, this);
        return;
      case ARCORE:
        xRDriver_ = XRGLAndroidARCore.create(context_, this);
        return;
      default:
        throw new RuntimeException("Unexpected engine type: " + type);
    }
  }

  public static boolean isArCoreSupported(Context context) {
    return ArCoreApk.getInstance().checkAvailability(context)
      == ArCoreApk.Availability.SUPPORTED_INSTALLED;
  }

  private static RealityEngineLogRecordHeader.EngineType getEngineType(Context context) {
    if (
      ArCoreApk.getInstance().checkAvailability(context)
      == ArCoreApk.Availability.SUPPORTED_INSTALLED) {
      return RealityEngineLogRecordHeader.EngineType.ARCORE;
    } else {
      return RealityEngineLogRecordHeader.EngineType.C8;
    }
  }

  @Override
  public void resume() {
    logD("resume");
    XRAppValidator.validateApplication(context_, xRConfig_.getMobileAppKey().toString());

    startBackgroundThread();
    createCaptureContext();
    // Ordering matters here. Resume the engine before the driver to ensure the driver doesn't push
    // frames to an engine that hasn't started yet.
    XRGLAndroidJni.resume();
    if (recordGps_)  {
      gpsSensor_.resume();
    }
    poseSensor_.resume();
    xRDriver_.resume();

    // Note: We can't set resumed_.set(true); until initializeCameraPipeline is called again,
    // otherwise we will try to render prior to the camera actually being opened. We can, however,
    // do this in the REMOTE_ONLY case because the camera is not opened then.
    if (engineMode_ == XREngineConfiguration.SpecialExecutionMode.REMOTE_ONLY) {
      resumed_.set(true);
    }
  }

  @Override
  public void recenter() {
    XRGLAndroidJni.recenter();
  }

  @Override
  public void pause() {
    logD("pause");
    if (!resumed_.get()) {
      // Act as a no-op when engine is already paused.
      return;
    }

    // Ordering matters here. Pause the engine before the driver to allow threads to wake up and
    // be able to perform shutdown.
    resumed_.set(false);
    XRGLAndroidJni.pause();
    gpsSensor_.pause();
    poseSensor_.pause();
    xRDriver_.pause();
    sendAnalyticsRecordToServer();
    destroyCaptureContext();
    stopBackgroundThread();
  }

  private void sendAnalyticsRecordToServer() {
    byte[] bytes = getSerializedAnalyticsRecord();
    XRAnalyticsLogger.logRecordToServer(bytes, context_);
  }

  private byte[] getSerializedAnalyticsRecord() {
    MessageBuilder recordHeaderMessage = new MessageBuilder();
    LogRecordHeader.Builder headerBuilder = recordHeaderMessage.initRoot(LogRecordHeader.factory);
    XRAnalyticsLogHeaderFactory.getDefault().exportLogHeaderInfo(
      context_, xRDriver_.getType(), xRConfig_.getMobileAppKey().toString(), headerBuilder);
    ByteBuffer headerBytes = C8CapnpSerialize.serialize(recordHeaderMessage);
    return XRGLAndroidJni.getAndResetAnalyticsRecord(headerBytes);
  }

  @Override
  protected void instanceDestroy() {
    if (resumed_.get()) {
      pause();
    }

    // Ordering matters here. Destroy the driver before the engine to ensure the driver doesn't push
    // frames to an engine that is already destroyed.
    xRDriver_.destroy();
    gpsSensor_.destroy();
    poseSensor_.destroy();
    XRGLAndroidJni.deleteXRAndroid();
  }

  @Override
  public void configure(byte[] config) {
    configure(C8CapnpSerialize.<XRConfiguration.Reader>deserialize(
      ByteBuffer.wrap(config), XRConfiguration.factory));
  }

  @Override
  public void configure(XRConfiguration.Reader config) {
    logD("configure");
    if (config.hasEngineConfiguration()) {
      applyEngineConfig(config.getEngineConfiguration());
      return;
    }

    // Call configure on the engine.
    MessageBuilder cfg = new MessageBuilder();
    cfg.setRoot(XRConfiguration.factory, config);
    ByteBuffer directRequestBuffer = C8CapnpSerialize.serialize(cfg);
    XRGLAndroidJni.configure(directRequestBuffer);

    // Configure the driver.
    xRDriver_.configure(config);

    if (config.hasCameraConfiguration()) {
      recordGps_ = config.getCameraConfiguration().getGps();
    }

    if (config.hasMask()) {
      // XRGLAndroid only needs to mobile app key from the XRConfig. When we make mobile app keys
      // required, we should change config.hasMask() above to config.hasMobileAppKey().
      xRConfig_ = config;
    }
  }

  private void applyEngineConfig(XREngineConfiguration.Reader config) {
    if (engineMode_ == config.getMode()) {
      return;
    }

    engineMode_ = config.getMode();
    boolean needsResume = resumed_.get();

    // Instance Destroy calls pause() first if needed.
    instanceDestroy();

    XRGLAndroidJni.newXRAndroid();
    initializeDriver();

    if (needsResume) {
      resume();
    }
  }

  @Override
  public byte[] getCurrentRealityXR() {
    synchronized (realityLock_) {
      xRDriver_.update();
      return currentXRResponseBytes_;
    }
  }

  @Override
  public byte[] query(byte[] request) {
    logD("query");
    ByteBuffer directMessageBuffer = ByteBuffer.allocateDirect(request.length);
    directMessageBuffer.put(request);
    directMessageBuffer.rewind();
    ByteBuffer responseBytes = XRGLAndroidJni.query(directMessageBuffer);
    byte[] returnBytes = new byte[responseBytes.remaining()];
    responseBytes.get(returnBytes);
    return returnBytes;
  }

  @Override
  public XrQueryResponse.Reader query(XrQueryRequest.Reader request) {
    MessageBuilder req = new MessageBuilder();
    req.setRoot(XrQueryRequest.factory, request);
    ByteBuffer directRequestBuffer = C8CapnpSerialize.serialize(req);
    ByteBuffer responseBytes = XRGLAndroidJni.query(directRequestBuffer);
    return C8CapnpSerialize.deserialize(responseBytes, XrQueryResponse.factory);
  }

  @Override
  public RealityResponse.Reader getCurrentRealityXRReader() {
    return C8CapnpSerialize.deserializeFromBytes(getCurrentRealityXR(), RealityResponse.factory);
  }

  /**
   * Returns the current {@link XREnvironment}.
   */
  public static byte[] getXREnvironment(
    Context context, XREngineConfiguration.SpecialExecutionMode mode) {
    // logD("getXREnvironment");
    MessageBuilder message = new MessageBuilder();
    XREnvironment.Builder builder = message.initRoot(XREnvironment.factory);
    exportXREnvironment(context, mode, builder);
    return C8CapnpSerialize.serializeToBytes(message);
  }

  public static XREnvironment.Reader getXREnvironmentReader(
    Context context, XREngineConfiguration.SpecialExecutionMode mode) {
    MessageBuilder message = new MessageBuilder();
    XREnvironment.Builder builder = message.initRoot(XREnvironment.factory);
    exportXREnvironment(context, mode, builder);
    return builder.asReader();
  }

  private static void exportXREnvironment(
    Context context,
    XREngineConfiguration.SpecialExecutionMode mode,
    XREnvironment.Builder builder) {
    if (mode == XREngineConfiguration.SpecialExecutionMode.DISABLE_NATIVE_AR_ENGINE) {
      logD("(forced) XRAndroidC8.exportXREnvironment");
      XRGLAndroidC8.exportXREnvironment(context, builder);
      return;
    }

    RealityEngineLogRecordHeader.EngineType type = getEngineType(context);
    switch (type) {
      case ARCORE:
        logD("XRAndroidC8.exportXREnvironment");
        XRGLAndroidARCore.exportXREnvironment(builder);
        break;
      case C8:
        logD("XRAndroidC8.exportXREnvironment");
        XRGLAndroidC8.exportXREnvironment(context, builder);
        break;
      default:
        throw new RuntimeException("Unexpected engine type: " + type);
    }
  }

  @Override
  public byte[] getXRAppEnvironment() {
    // logD("getXRAppEnvironment");
    getXRAppEnvironmentReader();
    return C8CapnpSerialize.serializeToBytes(appEnvironmentMessage_);
  }

  // TODO(nb): clean up this flow.
  private boolean setY = false;
  private boolean setUV = false;

  @Override
  public XRAppEnvironment.Reader getXRAppEnvironmentReader() {
    xRDriver_.getXRAppEnvironment(appEnvironmentBuilder_);
    XRAppEnvironment.Reader reader = appEnvironmentBuilder_.asReader();
    return appEnvironmentBuilder_.asReader();
  }

  @Override
  public void setXRAppEnvironment(byte[] bytes) {
    XRAppEnvironment.Reader reader =
      C8CapnpSerialize.deserializeFromBytes(bytes, XRAppEnvironment.factory);
    appEnvironmentMessage_.setRoot(XRAppEnvironment.factory, reader);
    appEnvironmentBuilder_ = appEnvironmentMessage_.initRoot(XRAppEnvironment.factory);

    // TODO(alvin): Pass data along to the native layer.
  }

  @Override
  public void setSurface(Surface surface) {
    throw new RuntimeException("setSurface unsupported");
  }

  @Override
  public void setUnityManagedCameraRGBATexture(
    long texHandle, int width, int height, int renderingSystem) {
    throw new RuntimeException("setUnityManagedCameraRGBATexture unsupported");
  }

  /**
   * Creates and initialized the OpenGL context used for camera capture and processing.
   */
  public void createCaptureContext() {
    logD("createCaptureContext");
    try {
      sharedContext_ = EGL14.eglGetCurrentContext();
      cameraOpenCloseLock_.acquire();
      captureHandler().post(new Runnable() {
        @Override
        public void run() {
          logD("setup external context");
          // Destroy the OpenGL context in the capture thread.
          try {
            logD("Calling native createCaptureContext(" + sharedContext_.getNativeHandle() + ")");
            XRGLAndroidJni.createCaptureContext(sharedContext_.getNativeHandle());
          } catch (NoSuchMethodError e) {
            // getNativeHandle was added in API 21; getHandle is used prior to that.
            logD("Calling native createCaptureContext(" + sharedContext_.getHandle() + ")");
            XRGLAndroidJni.createCaptureContext(sharedContext_.getHandle());
          }
          cameraOpenCloseLock_.release();
        }
      });
      logD("pause waiting for capture thread to setup");
      cameraOpenCloseLock_.acquire();
      logD("pause capture setup done");
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      cameraOpenCloseLock_.release();
    }
  }

  public void initializeCameraPipeline(int captureWidth, int captureHeight) {
    XRGLAndroidJni.initializeCameraPipeline(captureWidth, captureHeight);
    resumed_.set(true);
  }

  /**
   * Get the source texture id for camera capture.
   */
  public int getSourceTexture() { return XRGLAndroidJni.getSourceTexture(); }

  /**
   * Destroys the OpenGL context used for camera capture and processing.
   */
  public void destroyCaptureContext() {
    logD("destroyCaptureContext");
    try {
      cameraOpenCloseLock_.acquire();
      captureHandler().post(new Runnable() {
        @Override
        public void run() {
          logD("cleanup external context");
          // Destroy the OpenGL context in the capture thread.
          XRGLAndroidJni.destroyCaptureContext();
          cameraOpenCloseLock_.release();
        }
      });
      logD("pause waiting for capture thread to cleanup");
      cameraOpenCloseLock_.acquire();
      logD("pause capture cleanup done");
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      cameraOpenCloseLock_.release();
    }
  }

  @Override
  public void setUnityManagedCameraYTexture(
    long texHandle, int width, int height, int renderingSystem) {
    throw new RuntimeException("setUnityManagedCameraYTexture unsupported");
  }

  @Override
  public void setUnityManagedCameraUVTexture(
    long texHandle, int width, int height, int renderingSystem) {
    throw new RuntimeException("setUnityManagedCameraUVTexture unsupported");
  }

  @Override
  public void renderFrameForDisplay() {
    if (!resumed_.get()) {
      return;
    }

    synchronized (realityLock_) {
      ByteBuffer responseBytes = XRGLAndroidJni.renderFrameForDisplay();
      // Validate the response and set up a reader.
      if (responseBytes == null) {
        Log.w(TAG, "Failed to get output for xr request.");
        return;
      }

      currentXRResponseBytes_ = new byte[responseBytes.remaining()];
      responseBytes.get(currentXRResponseBytes_);
    }
  }

  @Override
  public XREngineConfiguration.SpecialExecutionMode getEngineMode() {
    return engineMode_;
  }

  void processGlAndStageRequest(float[] mtx, RealityData realityData) {
    if (!resumed_.get()) {
      return;
    }

    MessageBuilder requestMessage = new MessageBuilder();
    requestMessage.setRoot(
      RealityRequest.factory,
      realityData.requestMessage.getRoot(RealityRequest.factory).asReader());
    RealityRequest.Builder requestBuilder = requestMessage.getRoot(RealityRequest.factory);

    if (recordGps_) {
      Location l = gpsSensor_.currentLocation();
      RequestGPS.Builder gps = requestBuilder.getSensors().getGps();
      gps.setLatitude(l.getLatitude());
      gps.setLongitude(l.getLongitude());
      gps.setHorizontalAccuracy(l.getAccuracy());
      gps.setElevationMeters(l.getAltitude());
      gps.setElevationAccuracy(l.getVerticalAccuracyMeters());
      gps.setHeadingDegrees(l.getBearing());
      gps.setHeadingAccuracy(l.getBearingAccuracyDegrees());
    }

    List<XRPoseSensorEvent> eventQueue = poseSensor_.releaseEventQueue();
    StructList.Builder<RawPositionalSensorValue.Builder> rq =
      requestBuilder.getSensors().getPose().initEventQueue(eventQueue.size());
    for (int i = 0; i < eventQueue.size(); ++i) {
      XRPoseSensorEvent event = eventQueue.get(i);
      RawPositionalSensorValue.Builder b = rq.get(i);
      b.setTimestampNanos(event.timestamp);
      XRRequests.setPosition32f(event.x, event.y, event.z, b.getValue());
      switch (event.type) {
        case Sensor.TYPE_ACCELEROMETER:
          b.setKind(PositionalSensorKind.ACCELEROMETER);
          break;
        case Sensor.TYPE_GYROSCOPE:
          b.setKind(PositionalSensorKind.GYROSCOPE);
          break;
        case Sensor.TYPE_MAGNETIC_FIELD:
          b.setKind(PositionalSensorKind.MAGNETOMETER);
          break;
        case Sensor.TYPE_LINEAR_ACCELERATION:
          b.setKind(PositionalSensorKind.LINEAR_ACCELERATION);
          break;
      }
    }

    XRRequests.setPosition32f(
      poseSensor_.acceleration[0],
      poseSensor_.acceleration[1],
      poseSensor_.acceleration[2],
      requestBuilder.getSensors().getPose().getDeviceAcceleration());

    XRRequests.setQuaternion32f(
      poseSensor_.pose[0],
      poseSensor_.pose[1],
      poseSensor_.pose[2],
      poseSensor_.pose[3],
      requestBuilder.getSensors().getPose().getDevicePose());

    XRRequests.setQuaternion32f(
      poseSensor_.sensorRotationToPortrait[0],
      poseSensor_.sensorRotationToPortrait[1],
      poseSensor_.sensorRotationToPortrait[2],
      poseSensor_.sensorRotationToPortrait[3],
      requestBuilder.getSensors().getPose().getSensorRotationToPortrait());

    ByteBuffer directRequestBuffer = C8CapnpSerialize.serialize(requestMessage);
    XRGLAndroidJni.processGlFrameAndStageRequest(mtx, directRequestBuffer);
  }

  void executeStagedRequest() {
    if (!resumed_.get()) {
      return;
    }

    XRGLAndroidJni.executeStagedRealityRequest();
  }

  public Handler captureHandler() { return captureHandler_; }

  public Handler processingHandler() { return processingHandler_; }

  // Starts a background thread and its {@link Handler}.
  private void startBackgroundThread() {
    logD("Start Background Threads");
    captureThread_ = new HandlerThread("CameraCapture");
    captureThread_.start();
    captureHandler_ = new Handler(captureThread_.getLooper());
    processingThread_ = new HandlerThread("CameraProcessing");
    processingThread_.start();
    processingHandler_ = new Handler(processingThread_.getLooper());
  }

  // Stops the background thread and its {@link Handler}.
  private void stopBackgroundThread() {
    logD("Stop Background Threads");
    if (captureThread_ != null) {
      captureThread_.quitSafely();
      try {
        captureThread_.join();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }

    if (processingThread_ != null) {
      processingThread_.quitSafely();
      try {
        processingThread_.join();
      } catch (InterruptedException e) {
        e.printStackTrace();
      }
    }

    processingThread_ = null;
    processingHandler_ = null;
    captureThread_ = null;
    captureHandler_ = null;
  }
}
