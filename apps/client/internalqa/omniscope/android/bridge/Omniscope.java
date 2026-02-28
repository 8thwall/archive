package com.the8thwall.apps.client.internalqa.omniscope.android.bridge;

import com.nianticlabs.c8.RenderLoopViewController;
import com.the8thwall.c8.io.C8CapnpSerialize;
import com.the8thwall.c8.protolog.api.LogRequest.LogRecordHeader;
import com.the8thwall.c8.protolog.api.LogRequest.RealityEngineLogRecordHeader;
import com.the8thwall.reality.app.app.AndroidApp;
import com.the8thwall.reality.app.analytics.android.XRAnalyticsLogger;
import com.the8thwall.reality.app.analytics.android.XRAnalyticsLogHeaderFactory;
import com.the8thwall.reality.app.device.AndroidDeviceInfo;
import com.the8thwall.reality.app.sensors.camera.AndroidNativeCameraData;
import com.the8thwall.reality.app.sensors.camera.GlAndroidCameraSensor;
import com.the8thwall.reality.app.sensors.camera.GlAndroidCameraSensorFactory;
import com.the8thwall.reality.app.sensors.gps.AndroidGpsSensor;
import com.the8thwall.reality.app.sensors.pose.AndroidPoseSensor;
import com.the8thwall.reality.app.sensors.pose.AndroidPoseSensor.XRPoseSensorEvent;
import com.the8thwall.reality.app.validation.android.XRAppValidator;
import com.the8thwall.reality.app.xr.common.ApiLimits;
import com.the8thwall.reality.app.xr.common.XRRequests;
import com.the8thwall.reality.engine.api.Reality.RealityRequest;
import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.Reality.XRAppEnvironment;
import com.the8thwall.reality.engine.api.Reality.XRCapabilities;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREngineConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREnvironment;
import com.the8thwall.reality.engine.api.request.App.AppContext.DeviceNaturalOrientation;
import com.the8thwall.reality.engine.api.request.Sensor.RawPositionalSensorValue;
import com.the8thwall.reality.engine.api.request.Sensor.RawPositionalSensorValue.PositionalSensorKind;
import com.the8thwall.reality.engine.api.request.Sensor.RequestGPS;

import android.content.Context;
import android.hardware.Sensor;
import android.location.Location;
import android.net.nsd.NsdManager;
import android.opengl.EGL14;
import android.opengl.EGLContext;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.util.Log;
import android.view.MotionEvent;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.widget.Button;

import java.nio.ByteBuffer;
import java.util.List;
import java.util.concurrent.atomic.AtomicBoolean;
import java.util.concurrent.Semaphore;

import org.capnproto.MessageBuilder;
import org.capnproto.StructList;

/**
 * Top level class used by external code (i.e C#, application code, etc.) Primarily used to delegate
 * between existing Android implementations of xr-engine, such as {@link XRAndroid} and
 * {@Omniscope}.
 */
public class Omniscope implements GlAndroidCameraSensor.FrameProcessor, 
                                  RenderLoopViewController.RenderThreadListener {
  private static String TAG = "NianticJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[Omniscope] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private static Omniscope instance_;

  public static void loadNativeLibrary(String library) {
    logD(String.format("loadNativeLibrary(%s)", library));
    System.loadLibrary(library);
  }

  /**
   * Creates an instance of the {@link Omniscope}.
   */
  public static void create(Context context, int renderingSystem) {
    if (instance_ != null) {
      return;
    }

    logD("create Omniscope");
    instance_ = new Omniscope(context);
    instance_.initializeDriver();
    logD("create complete");
  }

  /**
   * Retreives the existing instance of {@link Omniscope}. If an instance does not already exist,
   * a {@link RuntimeException} is thrown.
   */
  public static Omniscope getInstance() {
    if (null == instance_) {
      throw new RuntimeException("Omniscope has not been created with a context");
    }
    return instance_;
  }

  /**
   * Tearsdown the existing {@link Omniscope} instance previously created by {@link
   * Omniscope#create}.geReader If an instance does not exist, this does nothing.
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

    return getXREnvironment(context, mode);
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

    return getXREnvironmentReader(context, mode);
  }

  /**
   * Data passed from the {@link OmniscopeDriver} that is sent through to the native layer.
   * Byte buffers may be included for data that cannot be referenced through Java primitives or
   * objects.
   */
  static class RealityData {
    public final MessageBuilder requestMessage;

    private RealityData(MessageBuilder message) { this.requestMessage = message; }

    static class Builder {
      private MessageBuilder requestMessage_;

      public Builder setRequestMessage(MessageBuilder message) {
        requestMessage_ = message;
        return this;
      }

      public RealityData build() {
        assertValidData();
        return new RealityData(requestMessage_);
      }

      private void assertValidData() {
        boolean isInvalid = requestMessage_ == null;  // Drive should provide a valid request.
        if (isInvalid) {
          throw new RuntimeException("Attempting to build invlid RealityData.");
        }
      }
    }
  }

  private Semaphore cameraOpenCloseLock_ = new Semaphore(1);

  private TextureView textureView_ = null;
  private RenderLoopViewController renderViewController_ = null;

  // An additional thread for running tasks that shouldn't block the UI.
  private HandlerThread captureThread_;
  private Handler captureHandler_;

  // An additional thread for running tasks that shouldn't block the UI.
  private HandlerThread processingThread_;
  private Handler processingHandler_;

  private Handler renderHandler_;

  private final Context context_;
  private final NsdManager nsdManager_;  // Needed for frame logging.
  private final String realityLock_ = "realityLock";

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

  private XRConfiguration.Reader cameraConfig_;
  private GlAndroidCameraSensor cameraSensor_;

  // Tested on Samsung Galaxy S5 running Android 6.0.1. Camera settings will not take effect
  // without closing and opening the camera again
  private boolean isCameraRunning_ = false;
  private boolean isPlaying_ = false;

  Omniscope(Context context) {
    context_ = context;
    OmniscopeJni.newXRAndroid();
    nsdManager_ = (NsdManager)context.getSystemService(Context.NSD_SERVICE);  // For log stream.

    environmentMessage_ = new MessageBuilder();
    environmentBuilder_ = environmentMessage_.initRoot(XREnvironment.factory);

    appEnvironmentMessage_ = new MessageBuilder();
    appEnvironmentBuilder_ = appEnvironmentMessage_.initRoot(XRAppEnvironment.factory);

    MessageBuilder realityBuilder = new MessageBuilder();
    realityBuilder.initRoot(RealityResponse.factory);
    currentXRResponseBytes_ = C8CapnpSerialize.serializeToBytes(realityBuilder);
  }

  protected void initializeDriver() {
    synchronized (realityLock_) {
      MessageBuilder realityBuilder = new MessageBuilder();
      realityBuilder.initRoot(RealityResponse.factory);
      currentXRResponseBytes_ = C8CapnpSerialize.serializeToBytes(realityBuilder);
    }

    gpsSensor_ = AndroidGpsSensor.create(context_);
    poseSensor_ = AndroidPoseSensor.create(context_);

    cameraSensor_ = GlAndroidCameraSensorFactory.create(context_, this);
    cameraConfig_ = new MessageBuilder().initRoot(XRConfiguration.factory).asReader();
  }

  private static RealityEngineLogRecordHeader.EngineType getEngineType(Context context) {
    return RealityEngineLogRecordHeader.EngineType.C8;
  }

  public void setViews(TextureView textureView, Button nextButton) {
    textureView_ = textureView;

    renderViewController_ = new RenderLoopViewController(textureView_, this);

    nextButton.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        renderHandler_.post(new Runnable() {
          @Override
          public void run() {
            OmniscopeJni.goNext();
          }
        });
      }
    });
  }

  @Override
  public void onRenderThreadReady(Handler renderThreadHandler, int width, int height) {
    renderHandler_ = renderThreadHandler;
    onDisplaySizeChanged(width, height);
    renderThreadHandler.post(new Runnable() {
      @Override
      public void run() {
        logD("resume on renderThread");
        resume();
      }
    });
  }

  @Override
  public void onDisplaySizeChanged(int width, int height) {
    XRConfiguration.Builder config = new MessageBuilder().getRoot(XRConfiguration.factory);
    config.getMask().setCamera(true);
    config.getMask().setFeatureSet(true);
    config.getGraphicsIntrinsics().setTextureWidth(width);
    config.getGraphicsIntrinsics().setTextureHeight(height);
    config.getGraphicsIntrinsics().setNearClip(0.03f);
    config.getGraphicsIntrinsics().setFarClip(1000.0f);
    config.getGraphicsIntrinsics().setDigitalZoomVertical(1.0f);
    config.getGraphicsIntrinsics().setDigitalZoomHorizontal(1.0f);
    config.getCameraConfiguration().setAutofocus(true);
    config.getCameraConfiguration().setGps(true);
    config.setMobileAppKey(
      "<REMOVED_BEFORE_OPEN_SOURCING>");
    configure(config.asReader());
  }

  public void resume() {
    logD("resume");

    logD("resume");
    if (renderHandler_ == null) {
      logD("render thread not yet initialized");
      return;
    }

    if (!isPlaying_) {    
      logD("resume");
      renderHandler_.post(new Runnable() {
        @Override
        public void run() {
          logD("render thread resume");
          XRAppValidator.validateApplication(context_, xRConfig_.getMobileAppKey().toString());

          startBackgroundThread();
          createCaptureContext();
          // Ordering matters here. Resume the engine before the driver to ensure the driver doesn't push
          // frames to an engine that hasn't started yet.
          OmniscopeJni.resume();
          if (recordGps_)  {
            gpsSensor_.resume();
          }
          poseSensor_.resume();
          cameraSensor_.resume();
          isCameraRunning_ = true;
          isPlaying_ = true;
        }
      });
    }
    renderViewController_.resume();
  }

  public void pause() {
    logD("pause");
    // Ordering matters here. Pause the engine before the driver to allow threads to wake up and
    // be able to perform shutdown.
    if (isPlaying_) {
      isPlaying_ = false;
      resumed_.set(false);
      OmniscopeJni.pause();
      gpsSensor_.pause();
      poseSensor_.pause();
      cameraSensor_.pause();
      isCameraRunning_ = false;
      sendAnalyticsRecordToServer();
      destroyCaptureContext();
      stopBackgroundThread();
    }
    renderViewController_.pause();
  }

  private void sendAnalyticsRecordToServer() {
    byte[] bytes = getSerializedAnalyticsRecord();
    XRAnalyticsLogger.logRecordToServer(bytes, context_);
  }

  public RealityEngineLogRecordHeader.EngineType getType() {
    return RealityEngineLogRecordHeader.EngineType.C8;
  }

  private byte[] getSerializedAnalyticsRecord() {
    MessageBuilder recordHeaderMessage = new MessageBuilder();
    LogRecordHeader.Builder headerBuilder = recordHeaderMessage.initRoot(LogRecordHeader.factory);
    XRAnalyticsLogHeaderFactory.getDefault().exportLogHeaderInfo(
      context_, getType(), xRConfig_.getMobileAppKey().toString(), headerBuilder);
    ByteBuffer headerBytes = C8CapnpSerialize.serialize(recordHeaderMessage);
    return OmniscopeJni.getAndResetAnalyticsRecord(headerBytes);
  }

  protected void instanceDestroy() {
    if (resumed_.get()) {
      pause();
    }

    // Ordering matters here. Destroy the driver before the engine to ensure the driver doesn't push
    // frames to an engine that is already destroyed.
    if (isCameraRunning_) {
      pause();
    }

    if (cameraSensor_ != null) {
      cameraSensor_.destroy();
      cameraSensor_ = null;
    }

    gpsSensor_.destroy();
    poseSensor_.destroy();
    OmniscopeJni.deleteXRAndroid();
    renderViewController_.destroy();
  }

  public void configure(XRConfiguration.Reader config) {
    logD("configure");
    if (config.hasEngineConfiguration()) {
      applyEngineConfig(config.getEngineConfiguration());
      return;
    }

    // Call configure on the engine.
    MessageBuilder cfg = new MessageBuilder();
    cfg.setRoot(XRConfiguration.factory, config);

    // Configure the driver.
    if (config.hasMask()) {
      this.cameraConfig_ = config;
    }
    if (config.hasCameraConfiguration()) {
      cameraSensor_.configure(config.getCameraConfiguration().getAutofocus());
    }

    if (config.hasCameraConfiguration()) {
      recordGps_ = config.getCameraConfiguration().getGps();
    }

    if (config.hasMask()) {
      // Omniscope only needs to mobile app key from the XRConfig. When we make mobile app keys
      // required, we should change config.hasMask() above to config.hasMobileAppKey().
      xRConfig_ = config;
    }

    ByteBuffer configBytes = C8CapnpSerialize.serialize(cfg);
    OmniscopeJni.configure(configBytes);
  }

  private void applyEngineConfig(XREngineConfiguration.Reader config) {
    if (engineMode_ == config.getMode()) {
      return;
    }

    engineMode_ = config.getMode();
    boolean needsResume = resumed_.get();

    // Instance Destroy calls pause() first if needed.
    instanceDestroy();

    OmniscopeJni.newXRAndroid();
    initializeDriver();

    if (needsResume) {
      resume();
    }
  }

  public byte[] getCurrentRealityXR() {
    synchronized (realityLock_) { return currentXRResponseBytes_; }
  }

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
    builder.setRealityImageWidth(ApiLimits.IMAGE_PROCESSING_WIDTH);
    builder.setRealityImageHeight(ApiLimits.IMAGE_PROCESSING_HEIGHT);
    builder.setRealityImageShader(XREnvironment.ImageShaderKind.STANDARD_RGBA);
    builder.getCapabilities().setPositionTracking(
      XRCapabilities.PositionalTrackingKind.ROTATION_AND_POSITION_NO_SCALE);
    builder.getCapabilities().setSurfaceEstimation(
      XRCapabilities.SurfaceEstimationKind.FIXED_SURFACES);
    builder.getCapabilities().setTargetImageDetection(
      XRCapabilities.TargetImageDetectionKind.UNSUPPORTED);
  }

  public byte[] getXRAppEnvironment() {
    // logD("getXRAppEnvironment");
    getXRAppEnvironmentReader();
    return C8CapnpSerialize.serializeToBytes(appEnvironmentMessage_);
  }

  // TODO(nb): clean up this flow.
  private boolean setY = false;
  private boolean setUV = false;

  public XRAppEnvironment.Reader getXRAppEnvironmentReader() {
    XRAppEnvironment.Reader reader = appEnvironmentBuilder_.asReader();
    return appEnvironmentBuilder_.asReader();
  }

  public void setXRAppEnvironment(byte[] bytes) {
    XRAppEnvironment.Reader reader =
      C8CapnpSerialize.deserializeFromBytes(bytes, XRAppEnvironment.factory);
    appEnvironmentMessage_.setRoot(XRAppEnvironment.factory, reader);
    appEnvironmentBuilder_ = appEnvironmentMessage_.initRoot(XRAppEnvironment.factory);

    // TODO(alvin): Pass data along to the native layer.
  }

  public void setSurface(Surface surface) { throw new RuntimeException("setSurface unsupported"); }

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
        public void run() {
          logD("setup external context");
          // Destroy the OpenGL context in the capture thread.
          try {
            logD("Calling native createCaptureContext(" + sharedContext_.getNativeHandle() + ")");
            OmniscopeJni.createCaptureContext(sharedContext_.getNativeHandle());
          } catch (NoSuchMethodError e) {
            // getNativeHandle was added in API 21; getHandle is used prior to that.
            logD("Calling native createCaptureContext(" + sharedContext_.getHandle() + ")");
            OmniscopeJni.createCaptureContext(sharedContext_.getHandle());
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

  @Override
  public void initializeCameraPipeline(int captureWidth, int captureHeight) {
    OmniscopeJni.initializeCameraPipeline(captureWidth, captureHeight);
    resumed_.set(true);
  }

  @Override
  public int getCaptureTexture() {
    return OmniscopeJni.getSourceTexture();
  }

  /**
   * Destroys the OpenGL context used for camera capture and processing.
   */
  public void destroyCaptureContext() {
    logD("destroyCaptureContext");
    try {
      cameraOpenCloseLock_.acquire();
      captureHandler().post(new Runnable() {
        public void run() {
          logD("cleanup external context");
          // Destroy the OpenGL context in the capture thread.
          OmniscopeJni.destroyCaptureContext();
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
  public void gotTouches(View v, MotionEvent e) {
    int numTouches = e.getPointerCount();
    OmniscopeJni.gotTouches(numTouches);
  }  
  
  @Override 
  public boolean renderNextFrame(double frameTimeMillis) {
    if (!resumed_.get()) {
      return false;
    }
    OmniscopeJni.renderFrameForDisplay();
    return true;
  }

  @Override 
  public void onRenderThreadEnded() {
    // No-op
  }

  public void goNext() { OmniscopeJni.goNext(); }

  public XREngineConfiguration.SpecialExecutionMode getEngineMode() { return engineMode_; }

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
    OmniscopeJni.processGlFrameAndStageRequest(mtx, directRequestBuffer);
  }

  @Override
  public void doFrameProcessing() {
    if (!resumed_.get()) {
      return;
    }

    // Execute the request.
    ByteBuffer responseBytes = OmniscopeJni.executeStagedRealityRequest();

    // Validate the response and set up a reader.
    if (responseBytes == null) {
      Log.w(TAG, "Failed to get output for xr request.");
      return;
    }

    synchronized (realityLock_) {
      currentXRResponseBytes_ = new byte[responseBytes.remaining()];
      responseBytes.get(currentXRResponseBytes_);
    }
  }

  @Override
  public void doCaptureProcessing(float[] mtx, AndroidNativeCameraData cameraData) {
    MessageBuilder requestMessage = new MessageBuilder();
    RealityRequest.Builder requestBuilder = requestMessage.initRoot(RealityRequest.factory);

    AndroidDeviceInfo.getDefault().exportInfo(requestBuilder.getDeviceInfo());
    if (cameraConfig_ != null) {
      requestBuilder.setXRConfiguration(cameraConfig_);
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

    RealityData realityData = new RealityData.Builder().setRequestMessage(requestMessage).build();

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
    processGlAndStageRequest(mtx, realityData);
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
