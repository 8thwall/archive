package com.the8thwall.reality.app.sensors.camera;

import android.app.Activity;
import android.content.Context;
import android.graphics.SurfaceTexture;
import android.hardware.camera2.CameraAccessException;
import android.hardware.camera2.CameraCaptureSession;
import android.hardware.camera2.CameraCharacteristics;
import android.hardware.camera2.CameraDevice;
import android.hardware.camera2.CameraManager;
import android.hardware.camera2.CameraMetadata;
import android.hardware.camera2.CaptureRequest;
import android.hardware.camera2.CaptureResult;
import android.hardware.camera2.TotalCaptureResult;
import android.hardware.camera2.params.StreamConfigurationMap;
import android.os.Build;
import android.util.Log;
import android.util.Range;
import android.util.Size;
import android.view.Surface;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicBoolean;

import com.the8thwall.reality.app.xr.common.ApiLimits;

/**
 * An OpenGL {@link AndroidCameraSensor} implementation targetting devices running API 22 and above.
 *
 */
public class GlAndroidCameraSensorApi22 implements GlAndroidCameraSensor {
  private static final String TAG = "8thWallJava";

  // TODO(alvin): These should probably be defined within ApiLimits.
  private static int MAXIMUM_CAPTURE_WIDTH = 1920;
  private static int MAXIMUM_CAPTURE_HEIGHT = 1440;

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(
      TAG, String.format("[GlAndroidCameraSensorApi22] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private Context context_;

  // A {@link CameraCaptureSession } for camera preview.
  private CameraCaptureSession captureSession_;

  // A reference to the opened {@link CameraDevice}.
  private CameraDevice cameraDevice_;

  // A {@link SurfaceTexture} for storing the camera output.
  private SurfaceTexture captureSurfaceTexture_;

  // A {@link Semaphore} to prevent the app from exiting before closing the camera.
  private Semaphore cameraOpenCloseLock_ = new Semaphore(1);

  private FrameProcessor frameProcessor_;

  private String cameraId_;

  private int cameraSensorOrientation_;
  private boolean enableCameraAutofocus_ = false;
  private boolean resetRepeatingRequestNeeded_ = true;
  private float lensFixedDistance_ = 0.5f;
  // Built in createCameraCaptureSession()
  private CaptureRequest.Builder captureRequestBuilder_;

  private AtomicBoolean running_ = new AtomicBoolean(false);

  private Size captureSize_ = new Size(0, 0);

  private GlAndroidCameraSensorApi22(Context context, FrameProcessor frameProcessor) {
    context_ = context;
    frameProcessor_ = frameProcessor;
  }

  public static GlAndroidCameraSensorApi22 create(Context context, FrameProcessor frameProcessor) {
    logD("create");
    return new GlAndroidCameraSensorApi22(context, frameProcessor);
  }

  @Override
  public void resume() {
    logD("resume");
    running_.set(true);
    openCamera();
  }

  @Override
  public void pause() {
    logD("pause");
    running_.set(false);
    closeCamera();
  }

  @Override
  public void destroy() {
    logD("destroy");
    if (running_.get()) {
      pause();
    }
  }

  @Override
  public void setFrameProcessor(FrameProcessor frameProcessor) {
    frameProcessor_ = frameProcessor;
  }

  @Override
  public void configure(boolean enableCameraAutofocus) {
    enableCameraAutofocus_ = enableCameraAutofocus;

    if (captureSession_ == null) {
      // If we're configuring before there's a session, we don't need to reconfigure a running
      // session.
      return;
    }

    try {
      captureSession_.stopRepeating();
    } catch (CameraAccessException e) {
      Log.w(TAG, "Unable to stop all repeating captures");
    }

    setCameraAutofocusRequest(captureRequestBuilder_);
    resetRepeatingRequestNeeded_ = true;
  }

  /**
   * Set camera repeating request based on enableCameraAutofocus_
   */
  private void setCameraAutofocusRequest(CaptureRequest.Builder captureRequestBuilder) {
    if (captureRequestBuilder != null) {
      // When the session is ready, we start displaying the preview.
      if (enableCameraAutofocus_) {
        // Auto focus should be continuous for camera preview.
        captureRequestBuilder.set(
          CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_VIDEO);
        captureRequestBuilder.set(CaptureRequest.LENS_FOCUS_DISTANCE, null);
      } else {
        captureRequestBuilder.set(
          CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_OFF);
        captureRequestBuilder.set(CaptureRequest.LENS_FOCUS_DISTANCE, lensFixedDistance_);
      }
    } else {
      Log.w(TAG, "setCameraAutofocusRequest should only be called on a non-NULL request builder");
    }
  }

  // Opens the camera
  // We ASSUME that you have already asked for the camera permission
  private void openCamera() {
    logD("openCamera");
    cameraId_ = setUpCameraOutputsAndGetCameraId();
    cameraSensorOrientation_ = getCameraSensorOrientation();
    CameraManager manager = (CameraManager)context_.getSystemService(Context.CAMERA_SERVICE);
    try {
      manager.openCamera(cameraId_, mStateCallback, frameProcessor_.captureHandler());
    } catch (CameraAccessException e) {
      e.printStackTrace();
    }
  }

  private int getCameraSensorOrientation() {
    try {
      CameraManager manager = (CameraManager)context_.getSystemService(Context.CAMERA_SERVICE);
      CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId_);
      return characteristics.get(CameraCharacteristics.SENSOR_ORIENTATION);
    } catch (CameraAccessException e) {
      throw new RuntimeException("Error querying camera sensor orientation", e);
    }
  }

  /**
   * Closes the current {@link CameraDevice}.
   */
  private void closeCamera() {
    logD("closeCamera");
    cameraId_ = null;
    if (captureSession_ != null) {
      captureSession_.close();
      captureSession_ = null;
    }

    cameraSensorOrientation_ = 0;

    try {
      cameraOpenCloseLock_.acquire();
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      cameraOpenCloseLock_.release();
    }
  }

  /** Update captureSession_ with a new repeating request */
  private void rebuildRepeatingRequest() {
    try {
      // Resetting the repeating request clear the previous repeating request but might have
      // a few capture still on-going
      // https://developer.android.com/reference/android/hardware/camera2/CameraCaptureSession.html
      CaptureRequest capRequest = captureRequestBuilder_.build();
      captureSession_.setRepeatingRequest(
        capRequest, mCaptureCallback, frameProcessor_.captureHandler());
      resetRepeatingRequestNeeded_ = false;
    } catch (CameraAccessException e) {
      e.printStackTrace();
    }
  }

  private void printCaptureRequestState(CaptureRequest capRequest) {
    logD("Repeating request was rebuilt");
    for (CaptureRequest.Key<?> k : capRequest.getKeys()) {
      logD("" + k.toString() + " = " + capRequest.get(k));
    }
  }

  /**
   * Creates a new {@link CameraCaptureSession} for camera preview.
   */
  private void createCameraCaptureSession(CameraDevice cameraDevice) {
    logD("createCameraCaptureSession");
    try {
      logD("setOptimalResolutionSize");
      setOptimalResolutionSize();

      // On frame catpure, call the captureFrameListener_.
      captureSurfaceTexture_.setOnFrameAvailableListener(
        captureFrameListener_, frameProcessor_.captureHandler());

      // This is the GL Surface for writing camera frames.
      Surface glSurface = new Surface(captureSurfaceTexture_);

      // We set up a CaptureRequest.Builder with the output Surface.
      // Save captureRequestBuilder so we can change it when autofocus changes
      captureRequestBuilder_ = cameraDevice.createCaptureRequest(CameraDevice.TEMPLATE_PREVIEW);
      captureRequestBuilder_.addTarget(glSurface);
      setHighestSupportedRequestFrameRate(captureRequestBuilder_);
      setDeviceSpecificCaptureRequestParams(captureRequestBuilder_);

      // Here, we create a CameraCaptureSession for camera preview.
      cameraDevice.createCaptureSession(
        Arrays.asList(glSurface), new CameraCaptureSession.StateCallback() {
          @Override
          public void onConfigured(CameraCaptureSession cameraCaptureSession) {
            logD("CameraCaptureSession.StateCallback.onConfigured");
            captureSession_ = cameraCaptureSession;

            // Figure out a good fixed focal length so when we don't autofocus
            // we know how far to focus on
            Integer lensFocusDistanceCalibration;
            Float lensMinFocusDistance;
            try {
              CameraManager manager =
                (CameraManager)context_.getSystemService(Context.CAMERA_SERVICE);
              CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId_);
              lensFocusDistanceCalibration =
                characteristics.get(CameraCharacteristics.LENS_INFO_FOCUS_DISTANCE_CALIBRATION);
              lensMinFocusDistance =
                characteristics.get(CameraCharacteristics.LENS_INFO_MINIMUM_FOCUS_DISTANCE);

              if (
                lensFocusDistanceCalibration != null
                && lensFocusDistanceCalibration.equals(
                     CameraMetadata.LENS_INFO_FOCUS_DISTANCE_CALIBRATION_UNCALIBRATED)
                && lensMinFocusDistance != null) {
                // When the lens is uncalibrated, this unit isn't directly comparable to any
                // physical measurement
                lensFixedDistance_ = lensMinFocusDistance * 0.5f;
                // TODO(dat): Collect metrics on lensMinFocusDistance of phones using 8th wall.
              }
            } catch (CameraAccessException e) {
              e.printStackTrace();
            }

            setCameraAutofocusRequest(captureRequestBuilder_);

            // Finally, we start displaying the camera preview.
            resetRepeatingRequestNeeded_ = true;
          }

          @Override
          public void onConfigureFailed(CameraCaptureSession cameraCaptureSession) {
            logD("CameraCaptureSession.StateCallback.onConfigureFailed");
          }

          @Override
          public void onReady(CameraCaptureSession cameraCaptureSession) {
            logD("CameraCaptureSession.StateCallback.onReady");
            if (resetRepeatingRequestNeeded_) {
              rebuildRepeatingRequest();
            }
          }

          @Override
          public void onClosed(CameraCaptureSession session) {
            logD("CameraCaptureSession.StateCallback.onClosed");

            // Now that we are on the capture thread, delete the surface texture.
            if (null != captureSurfaceTexture_) {
              // Release the surface texture.
              captureSurfaceTexture_.release();
              captureSurfaceTexture_ = null;
            }

            // Close the camera here.
            if (null != cameraDevice_) {
              logD("Waiting for cameraDevice_ to close.");
              cameraDevice_.close();
            } else {
              logD("CameraCaptureSession.onClosed: cameraOpenCloseLock_.release()");
              cameraOpenCloseLock_.release();
            }
          }
        }, null);
    } catch (CameraAccessException e) {
      Log.e(TAG, e.getMessage());
      e.printStackTrace();
    }
  }

  private void setHighestSupportedRequestFrameRate(CaptureRequest.Builder captureRequestBuilder) {
    try {
      CameraManager manager = (CameraManager)context_.getSystemService(Context.CAMERA_SERVICE);
      CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId_);
      Range<Integer>[] fpsRanges =
        characteristics.get(CameraCharacteristics.CONTROL_AE_AVAILABLE_TARGET_FPS_RANGES);

      Range<Integer> highestFps = null;
      for (Range<Integer> range : fpsRanges) {
        if (
          highestFps == null || range.getUpper() > highestFps.getUpper()
          || (range.getUpper().equals(highestFps.getUpper())
              && range.getLower() > highestFps.getLower())) {
          highestFps = range;
        }
      }

      if (highestFps != null) {
        captureRequestBuilder.set(CaptureRequest.CONTROL_AE_TARGET_FPS_RANGE, highestFps);
      }
    } catch (CameraAccessException e) {
      Log.e(TAG, e.getMessage());
      e.printStackTrace();
    }
  }

  /**
   * Sets up member variables related to camera.
   */
  private String setUpCameraOutputsAndGetCameraId() {
    String backCameraId = null;
    CameraManager manager = (CameraManager)context_.getSystemService(Context.CAMERA_SERVICE);
    try {
      for (String cameraId : manager.getCameraIdList()) {
        CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId);

        // We don't use a front facing camera in this sample.
        Integer facing = characteristics.get(CameraCharacteristics.LENS_FACING);
        if (facing != null && facing != CameraCharacteristics.LENS_FACING_FRONT) {
          backCameraId = cameraId;
          break;  // Exit the for-loop.
        }
      }

    } catch (CameraAccessException e) {
      e.printStackTrace();
    }
    return backCameraId;
  }

  // {@link CameraDevice.StateCallback} is called when {@link CameraDevice}
  // changes its state.
  private final CameraDevice.StateCallback mStateCallback = new CameraDevice.StateCallback() {
    @Override
    public void onOpened(CameraDevice cameraDevice) {
      logD("mStateCallback.onOpened");
      cameraDevice_ = cameraDevice;
      // This method is called when the camera is opened.  We start camera
      // preview here.
      try {
        logD("Acquiring camera lock");
        cameraOpenCloseLock_.acquire();
      } catch (InterruptedException e) {
        logD("Error aquiring camera lock! " + e.getMessage());
        e.printStackTrace();
      }
      logD("Creating capture session");
      createCameraCaptureSession(cameraDevice);
    }

    @Override
    public void onClosed(CameraDevice cameraDevice) {
      logD("mStateCallback.onClosed");
      if (cameraDevice_ != null) {
        logD("cameraOpenCloseLock_.release()");
        cameraOpenCloseLock_.release();
      }
      cameraDevice_ = null;
    }

    @Override
    public void onDisconnected(CameraDevice cameraDevice) {
      logD("mStateCallback.onDisconnected");
      cameraDevice_.close();
      cameraDevice_ = null;
      cameraOpenCloseLock_.release();
    }

    @Override
    public void onError(CameraDevice cameraDevice, int err) {
      String error = null;
      switch (err) {
        case CameraDevice.StateCallback.ERROR_CAMERA_DEVICE:
          error = "ERROR_CAMERA_DEVICE";
          break;
        case CameraDevice.StateCallback.ERROR_CAMERA_DISABLED:
          error = "ERROR_CAMERA_DISABLED";
          break;
        case CameraDevice.StateCallback.ERROR_CAMERA_IN_USE:
          error = "ERROR_CAMERA_IN_USE";
          break;
        case CameraDevice.StateCallback.ERROR_CAMERA_SERVICE:
          error = "ERROR_CAMERA_SERVICE";
          break;
        case CameraDevice.StateCallback.ERROR_MAX_CAMERAS_IN_USE:
          error = "ERROR_MAX_CAMERAS_IN_USE";
          break;
        default:
          error = String.format("UNKNOWN ERROR CODE (%d)", err);
          break;
      }
      logD("mStateCallback.onError: " + error);
      cameraDevice_.close();
      cameraDevice_ = null;
      cameraOpenCloseLock_.release();
    }
  };

  // This a callback object for the {@link SurfaceTexture}.
  SurfaceTexture.OnFrameAvailableListener captureFrameListener_ =
    new SurfaceTexture.OnFrameAvailableListener() {
      @Override
      public void onFrameAvailable(SurfaceTexture captureTexture) {
        if (!running_.get()) {
          return;
        }
        // TODO(nb): Figure out how caputureSurfaceTexture_ can be null here; this listener is on
        // the caputreSurfaceTexture_ and release is already called on the texture before it's set
        // to null.
        if (captureSurfaceTexture_ == null) {
          return;
        }

        captureSurfaceTexture_.updateTexImage();

        float[] mtx = new float[16];
        captureSurfaceTexture_.getTransformMatrix(mtx);

        /*
        // clang-format off
        logD(
          "Set capture surface transform matrix:\n"
          + "[ %04.2f, %04.2f, %04.2f, %04.2f,\n"
          + "  %04.2f, %04.2f, %04.2f, %04.2f,\n"
          + "  %04.2f, %04.2f, %04.2f, %04.2f,\n"
          + "  %04.2f, %04.2f, %04.2f, %04.2f ]",
          mtx[0], mtx[4], mtx[8], mtx[12],
          mtx[1], mtx[5], mtx[9], mtx[13],
          mtx[2], mtx[6], mtx[10], mtx[14],
          mtx[3], mtx[7], mtx[11], mtx[15]));
        // clang-format on
        */

        // First do the capture processing.
        frameProcessor_.doCaptureProcessing(
          mtx,
          new AndroidNativeCameraData(
            captureSurfaceTexture_.getTimestamp(),
            cameraSensorOrientation_,
            captureSize_.getWidth(),
            captureSize_.getHeight()));

        if (!running_.get()) {
          return;
        }
        frameProcessor_.processingHandler().post(new Runnable() {
          @Override
          public void run() {
            // Now do the post-capture processing.
            frameProcessor_.doFrameProcessing();
          }
        });
      }
    };

  private void setOptimalResolutionSize() {
    try {
      CameraManager manager = (CameraManager)context_.getSystemService(Context.CAMERA_SERVICE);
      CameraCharacteristics characteristics = manager.getCameraCharacteristics(cameraId_);
      StreamConfigurationMap map =
        characteristics.get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP);
      captureSize_ = chooseOptimalSize(
        map.getOutputSizes(SurfaceTexture.class),
        MAXIMUM_CAPTURE_WIDTH,
        MAXIMUM_CAPTURE_HEIGHT,
        new Size(ApiLimits.IMAGE_PROCESSING_HEIGHT, ApiLimits.IMAGE_PROCESSING_WIDTH));
      logD(String.format(
        "Requesting camera feed with size %dx%d",
        captureSize_.getWidth(),
        captureSize_.getHeight()));

      // TODO(nb): set rotation.
      frameProcessor_.initializeCameraPipeline(captureSize_.getWidth(), captureSize_.getHeight());

      // Create the capture surface texture.
      logD("new SurfaceTexture");
      captureSurfaceTexture_ = new SurfaceTexture(frameProcessor_.getCaptureTexture());

      captureSurfaceTexture_.setDefaultBufferSize(
        captureSize_.getWidth(), captureSize_.getHeight());
    } catch (CameraAccessException e) {
      Log.w(TAG, "[GlAndroidCameraSensorApi22] Unable to set resolution size.");
    }
  }

  private static Size chooseOptimalSize(
    Size[] choices, int maxWidth, int maxHeight, Size aspectRatio) {
    // Collect the supported resolutions that are less than the maximum and the correct aspect
    // ratio.
    List<Size> options = new ArrayList<>();
    int w = aspectRatio.getWidth();
    int h = aspectRatio.getHeight();
    for (Size option : choices) {
      if (
        option.getWidth() <= maxWidth && option.getHeight() <= maxHeight
        && option.getHeight() == option.getWidth() * h / w) {
        options.add(option);
      }
    }

    // Choose the largest option with the correct aspect ratio.
    if (options.size() > 0) {
      return Collections.max(options, new CompareSizesByArea());
    } else {
      Log.e(TAG, "Couldn't find any suitable preview size");
      return choices[0];
    }
  }

  /**
   * Compares two {@code Size}s based on their areas.
   */
  static class CompareSizesByArea implements Comparator<Size> {
    @Override
    public int compare(Size lhs, Size rhs) {
      return Long.signum(
        (long)lhs.getWidth() * lhs.getHeight() - (long)rhs.getWidth() * rhs.getHeight());
    }
  }

  private static void setDeviceSpecificCaptureRequestParams(
    CaptureRequest.Builder captureRequestBuilder) {

    // ODG R-7 Headset doesn't handle auto-exposure too well. We'll lock the auto-exposure
    // on this device as this gets handled.
    if ("Osterhout_Design_Group".equals(Build.MANUFACTURER) && "R7-W".equals(Build.MODEL)) {
      captureRequestBuilder.set(CaptureRequest.CONTROL_AE_LOCK, true);
    }
  }

  // A {@link CameraCaptureSession.CaptureCallback} that handles events related
  // to frame capture.
  private CameraCaptureSession.CaptureCallback mCaptureCallback =
    new CameraCaptureSession.CaptureCallback() {
      @Override
      public void onCaptureProgressed(
        CameraCaptureSession session, CaptureRequest request, CaptureResult partialResult) {
        // NOP
      }

      @Override
      public void onCaptureCompleted(
        CameraCaptureSession session, CaptureRequest request, TotalCaptureResult result) {
        // NOP
      }
    };
}
