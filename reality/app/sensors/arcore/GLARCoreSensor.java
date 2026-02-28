package com.the8thwall.reality.app.sensors.arcore;

import android.content.Context;
import android.os.Handler;
import android.util.Log;
import android.util.Size;
import android.view.Surface;
import com.google.ar.core.Anchor;
import com.google.ar.core.ArCoreApk;
import com.google.ar.core.AugmentedImage;
import com.google.ar.core.AugmentedImageDatabase;
import com.google.ar.core.Camera;
import com.google.ar.core.CameraIntrinsics;
import com.google.ar.core.Config;
import com.google.ar.core.Frame;
import com.google.ar.core.Plane;
import com.google.ar.core.PointCloud;
import com.google.ar.core.Pose;
import com.google.ar.core.Session;
import com.google.ar.core.exceptions.CameraNotAvailableException;
import com.google.ar.core.exceptions.FatalException;
import com.google.ar.core.exceptions.SessionPausedException;
import com.google.ar.core.exceptions.UnavailableException;
import com.the8thwall.c8.annotations.Nullable;
import com.the8thwall.reality.app.xr.common.ApiLimits;
import com.the8thwall.reality.engine.api.Reality.ImageDetectionConfiguration;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import java.nio.FloatBuffer;
import java.util.ArrayList;
import java.util.Collection;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Sensor which provides data from ARCore-enabled devices.
 */
public class GLARCoreSensor implements ImageDetectionConfigAsyncTask.Callback {
  public static interface FrameProcessor {
    public void initializeCameraPipeline(int captureWidth, int captureHeight);
    public int getCaptureTexture();
    public void doCaptureProcessing(ARCoreSensorData frame);
    public void doFrameProcessing();
    public Handler captureHandler();
    public Handler processingHandler();
  }

  public static final int DEFAULT_IMAGE_HEIGHT = 1920;
  public static final int DEFAULT_IMAGE_WIDTH = 1080;

  private static final String TAG = "8thWallJava";

  private Semaphore cameraOpenCloseLock_ = new Semaphore(1);

  private final Config config_;
  private final Session session_;

  private FrameProcessor frameProcessor_;
  private float farPlane_;
  private float nearPlane_;
  private int textureName_ = 0;
  private ImageDetectionConfigAsyncTask imageDetectionAsyncTask_;
  private AtomicBoolean running_ = new AtomicBoolean();
  private int imageHeight_ = DEFAULT_IMAGE_HEIGHT;
  private int imageWidth_ = DEFAULT_IMAGE_WIDTH;

  /**
   * Creates an {@link GLARCoreSensor} with the given {@link Config} and
   * {@link Session}.
   */
  public static GLARCoreSensor create(Context context) {
    Log.d(
      TAG,
      "[GLARCoreSensor] create. Availability: "
        + ArCoreApk.getInstance().checkAvailability(context));

    try {
      Session session = new Session(context);
      Config config = createDefaultConfig(session);
      return new GLARCoreSensor(config, session);
    } catch (UnavailableException e) {
      throw new RuntimeException("Attempting to use ARCore when it is not installed.", e);
    } catch (FatalException e) {
      throw new RuntimeException("Fatal exception when attempting to use ARCore.", e);
    } catch (Exception e) {
      throw new RuntimeException("General exception when attempting to use ARCore.", e);
    }
  }

  /**
   * Creates an ARCore Config without specifying an XRConfiguration. This will use
   * the default to HORIZONTAL_AND_VERTICAL surface tracking and camera autofocus
   * off.
   */
  private static Config createDefaultConfig(Session session) {
    Log.d(TAG, "[GLARCoreSensor] createDefaultConfig");
    Config config = new Config(session);
    config.setCloudAnchorMode(Config.CloudAnchorMode.DISABLED);
    config.setLightEstimationMode(Config.LightEstimationMode.AMBIENT_INTENSITY);
    config.setPlaneFindingMode(Config.PlaneFindingMode.HORIZONTAL_AND_VERTICAL);
    config.setUpdateMode(Config.UpdateMode.BLOCKING);
    config.setFocusMode(Config.FocusMode.FIXED);
    return config;
  }

  private static Config.PlaneFindingMode getPlaneFindingMode(XRConfiguration.Reader xrConfig) {
    boolean horizontalSurfaces = xrConfig.getMask().getSurfaces();
    boolean verticalSurfaces = xrConfig.getMask().getVerticalSurfaces();

    if (horizontalSurfaces && verticalSurfaces) {
      return Config.PlaneFindingMode.HORIZONTAL_AND_VERTICAL;
    } else if (horizontalSurfaces) {
      return Config.PlaneFindingMode.HORIZONTAL;
    } else if (verticalSurfaces) {
      return Config.PlaneFindingMode.VERTICAL;
    } else {
      return Config.PlaneFindingMode.DISABLED;
    }
  }

  private static Config.FocusMode getFocusMode(XRConfiguration.Reader xrConfig) {
    return xrConfig.getCameraConfiguration().getAutofocus() ? Config.FocusMode.AUTO
                                                            : Config.FocusMode.FIXED;
  }

  private GLARCoreSensor(Config config, Session session) {
    config_ = config;
    session_ = session;
    // Set default clip planes. These can be overridden later.
    setClipPlanes(0.3f, 1000.0f);
  }

  public void resume() {
    Log.d(TAG, "[GLARCoreSensor] resume");

    frameProcessor_.captureHandler().post(new Runnable() {
      @Override
      public void run() {
        Log.d(TAG, "[GLARCoreSensor] initialize egl in capture thread.");
        Size s = session_.getCameraConfig().getTextureSize();
        imageWidth_ = s.getWidth();
        imageHeight_ = s.getHeight();
        frameProcessor_.initializeCameraPipeline(imageWidth_, imageHeight_);
        textureName_ = frameProcessor_.getCaptureTexture();
        Log.d(TAG, "[GLARCoreSensor] Created OES texture with id " + textureName_);
        session_.setCameraTextureName(textureName_);
        try {
          // Resume/Pause/Resume fixes an issue where auto focus is not properly configured on some
          // devices. See: https://github.com/google-ar/arcore-android-sdk/issues/1312
          session_.resume();
          session_.pause();
          session_.resume();
        } catch (CameraNotAvailableException e) {
          Log.w(TAG, "[GLARCoreSensor] CameraNotAvailableException: " + e.getMessage());
          e.printStackTrace();
        }
        running_.set(true);
        postCaptureThread();
        postProcessThread();
      }
    });
  }

  private void runCaptureThread() {
    try {
      frameProcessor_.doCaptureProcessing(update());
    } catch (CameraNotAvailableException e) {
      Log.w(TAG, "[GLARCoreSensor] CameraNotAvailableException: " + e.getMessage());
      e.printStackTrace();
    }

    postCaptureThread();
  }

  private void runProcessThread() {
    frameProcessor_.doFrameProcessing();

    postProcessThread();
  }

  private void postCaptureThread() {
    if (!running_.get()) {
      return;
    }
    frameProcessor_.captureHandler().post(new Runnable() {
      @Override
      public void run() {
        runCaptureThread();
      }
    });
  }

  private void postProcessThread() {
    if (!running_.get()) {
      return;
    }
    frameProcessor_.processingHandler().post(new Runnable() {
      @Override
      public void run() {
        runProcessThread();
      }
    });
  }

  public void pause() {
    Log.d(TAG, "[GLARCoreSensor] pause");
    running_.set(false);

    try {
      cameraOpenCloseLock_.acquire();
      frameProcessor_.captureHandler().post(new Runnable() {
        @Override
        public void run() {
          Log.d(TAG, "[GLARCoreSensor] pause cleanup from capture thread");
          // Destroy the OpenGL context in the capture thread.
          session_.pause();
          cameraOpenCloseLock_.release();
        }
      });
      Log.d(TAG, "[GLARCoreSensor] pause waiting for capture thread to cleanup");
      cameraOpenCloseLock_.acquire();
      Log.d(TAG, "[GLARCoreSensor] pause capture cleanup done");
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      cameraOpenCloseLock_.release();
    }
    Log.d(TAG, "[GLARCoreSensor] pause done");
  }

  public void destroy() {
    Log.d(TAG, "[GLARCoreSensor] destroy");
    if (running_.get()) {
      pause();
    }

    if (imageDetectionAsyncTask_ != null) {
      imageDetectionAsyncTask_.cancel(true);
      imageDetectionAsyncTask_ = null;
    }
  }

  /**
   * Sets the clip planes that will be used when retrieving the projection matrix
   * from ARCore.
   */
  private void setClipPlanes(float farPlane, float nearPlane) {
    farPlane_ = farPlane;
    nearPlane_ = nearPlane;
  }

  /**
   * @return the id of the OpenGL texture managed by this sensor
   */
  public int getManagedCameraRGBATexture() { return textureName_; }

  /**
   * Configures the ARCore session with the given {@link XRConfiguration}.
   *
   * @param config the xr configuration
   */
  public void configure(XRConfiguration.Reader xrConfig) {
    if (xrConfig.getGraphicsIntrinsics().getFarClip() > 0.0f) {
      setClipPlanes(
        xrConfig.getGraphicsIntrinsics().getFarClip(),
        xrConfig.getGraphicsIntrinsics().getNearClip());
    }

    if (xrConfig.hasMask() && config_.getPlaneFindingMode() != getPlaneFindingMode(xrConfig)) {
      config_.setPlaneFindingMode(getPlaneFindingMode(xrConfig));
      session_.configure(config_);
    }

    if (xrConfig.hasImageDetection() && xrConfig.getImageDetection().hasImageDetectionSet()) {
      configureImageDetection(xrConfig.getImageDetection());
    }

    if (xrConfig.hasCameraConfiguration() && config_.getFocusMode() != getFocusMode(xrConfig)) {
      Log.d(TAG, "[GLARCoreSensor] Setting focus mode to " + getFocusMode(xrConfig));
      config_.setFocusMode(getFocusMode(xrConfig));
      session_.configure(config_);
    }

    if (xrConfig.hasCameraConfiguration() && xrConfig.getCameraConfiguration().getDepthMapping()) {
      if (session_.isDepthModeSupported(Config.DepthMode.AUTOMATIC)) {
        config_.setDepthMode(Config.DepthMode.AUTOMATIC);
        session_.configure(config_);
      }
    }
  }

  private void configureImageDetection(
    ImageDetectionConfiguration.Reader imageDetectionConfiguration) {
    if (imageDetectionAsyncTask_ != null) {
      imageDetectionAsyncTask_.cancel(true);
    }
    imageDetectionAsyncTask_ = new ImageDetectionConfigAsyncTask(session_, this);
    imageDetectionAsyncTask_.execute(imageDetectionConfiguration);
  }

  /**
   * Updates the camera frame and returns the latest ARCore frame data. If a new
   * camera frame exists, this will write to the OpenGL texture provided by
   * {@link #getManagedCameraTexture()}. This same texture is used by Unity to
   * render the camera feed, so this should only be called if there is a guarantee
   * that the current reality request will respect the values of the latest camera
   * frame.
   */
  public ARCoreSensorData update() throws CameraNotAvailableException {
    if (!running_.get()) {
      return null;
    }
    Frame frame = session_.update();
    Camera camera = frame.getCamera();
    float[] projectionMatrix = new float[16];
    if (farPlane_ > 0.0f) {
      /**
       * {@link Session#update} will provide empty frame data while the service is
       * binding. {@link Session#getProjectMatrix} will throw a
       * {@link SessionPausedException} during this state, even though it isn't
       * explicitly paused. We'll swallow this exeception and just skip the projection
       * matrix during this state.
       */
      try {
        camera.getProjectionMatrix(projectionMatrix, 0, nearPlane_, farPlane_);
      } catch (SessionPausedException e) {
        Log.d(TAG, "[GLARCoreSensor] Session still binding. Skipping projection data.", e);
      }
    }

    CameraIntrinsics intrinsics = camera.getTextureIntrinsics();
    int[] dimensions = intrinsics.getImageDimensions();

    if (imageWidth_ != dimensions[1] || imageHeight_ != dimensions[0]) {
      Log.d(
        TAG,
        String.format(
          "[GLARCoreSensor] update display geometry: (%d, %d)", dimensions[1], dimensions[0]));
      session_.setDisplayGeometry(Surface.ROTATION_0, dimensions[1], dimensions[0]);
    }

    imageHeight_ = dimensions[0];
    imageWidth_ = dimensions[1];

    return new ARCoreSensorData(
      session_.getAllAnchors(),
      session_.getAllTrackables(AugmentedImage.class),
      session_.getAllTrackables(Plane.class),
      projectionMatrix,
      frame);
  }

  @Override
  public void onComplete(AugmentedImageDatabase result) {
    // Always called on the main thread.
    config_.setAugmentedImageDatabase(result);
    session_.configure(config_);
  }

  /**
   * @return the last known image frame height provided by ARCore. If ARCore has not provided
   *     an image frame yet, this defaults to 1920.
   */
  public int getImageHeight() { return imageHeight_; }

  /**
   * @return the last known image frame width provided by ARCore. If ARCore has not provided
   *     an image frame yet, this defaults to 1080.
   */
  public int getImageWidth() { return imageWidth_; }

  public void setFrameProcessor(FrameProcessor frameProcessor) { frameProcessor_ = frameProcessor; }
}
