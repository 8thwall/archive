package com.the8thwall.reality.app.sensors.camera;

import android.app.Activity;
import android.content.Context;
import android.graphics.ImageFormat;
import android.graphics.SurfaceTexture;
import android.hardware.Camera;
import android.opengl.GLES20;
import android.os.SystemClock;
import android.util.Log;
import android.util.Size;

import java.io.IOException;
import java.lang.RuntimeException;
import java.nio.ByteBuffer;
import java.util.List;
import java.util.concurrent.Semaphore;
import java.util.concurrent.atomic.AtomicReference;
import java.util.concurrent.atomic.AtomicBoolean;

import com.the8thwall.reality.app.xr.common.ApiLimits;

/**
 * A {@link GlAndroidCameraSensor} implementation targetting devices running API 19.
 */
public class GlAndroidCameraSensorApi19 implements GlAndroidCameraSensor {

  private static final String TAG = "8thWallJava";

  private final Context context_;
  // private final OnPreviewFrameListener onPreviewFrameListener_ = new OnPreviewFrameListener();

  private AtomicReference<byte[]> nextFrame_ = new AtomicReference<byte[]>();
  private ByteBuffer[] previewImagePlaneBuffers_;
  private Camera camera_;
  private FrameProcessor frameProcessor_;

  private SurfaceTexture captureSurfaceTexture_;

  // A {@link Semaphore} to prevent the app from exiting before closing the camera.
  private Semaphore cameraOpenCloseLock_ = new Semaphore(1);

  private int cameraSensorOrientation_;
  private boolean enableCameraAutofocus_ = false;
  private Camera.Parameters cameraParams_;
  private AtomicBoolean running_ = new AtomicBoolean(false);

  public static GlAndroidCameraSensorApi19 create(Context context, FrameProcessor frameProcessor) {
    Log.d(TAG, "[GlAndroidCameraSensorApi19] create");
    return new GlAndroidCameraSensorApi19(context, frameProcessor);
  }

  private GlAndroidCameraSensorApi19(Context context, FrameProcessor frameProcessor) {
    context_ = context;
    frameProcessor_ = frameProcessor;
  }

  @Override
  public void resume() {
    Log.d(TAG, "[GlAndroidCameraSensorApi19] resume");
    running_.set(true);
    Log.d(TAG, "[GlAndroidCameraSensorApi19] Opening camera asynchronously.");
    frameProcessor_.captureHandler().post(new Runnable() {
      @Override
      public void run() {
        openAndSetupCamera();
      }
    });
  }

  @Override
  public void configure(boolean enableCameraAutofocus) {
    enableCameraAutofocus_ = enableCameraAutofocus;
    Log.d(
      TAG,
      "[GlAndroidCameraSensorApi19] configure-autofocus "
        + Boolean.toString(enableCameraAutofocus));
    setCameraAutofocusIfPossible();
    updateCameraParameters();
  }

  private void setCameraAutofocusIfPossible() {
    if (cameraParams_ == null) {
      return;
    }

    List<String> supportedFocusModes = cameraParams_.getSupportedFocusModes();
    if (
      supportedFocusModes.contains(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE)
      && enableCameraAutofocus_) {
      cameraParams_.setFocusMode(Camera.Parameters.FOCUS_MODE_CONTINUOUS_PICTURE);
    } else if (supportedFocusModes.contains(Camera.Parameters.FOCUS_MODE_FIXED)) {
      cameraParams_.setFocusMode(Camera.Parameters.FOCUS_MODE_FIXED);
    }
  }

  private void openAndSetupCamera() {
    try {
      // Attempt to open the first back-facing camera.
      int numCameras = Camera.getNumberOfCameras();
      for (int i = 0; i < numCameras; ++i) {
        Camera.CameraInfo info = new Camera.CameraInfo();
        Camera.getCameraInfo(i, info);
        if (info.facing == Camera.CameraInfo.CAMERA_FACING_BACK) {
          camera_ = Camera.open(i);
          cameraSensorOrientation_ = info.orientation;
        }
      }
    } catch (RuntimeException e) {
      Log.e(TAG, "Error: Could not open camera.");
    }

    if (camera_ == null) {
      throw new IllegalStateException("Error: Device does not have a camera to open");
    }

    // NOTE(nb): If this is updated, the surface attributes in offscreen-gl-conext-egl-impl also
    // need to be update.
    // int surfaceAttributes[] = {EGL_WIDTH, 480, EGL_HEIGHT, 640, EGL_NONE};
    int captureWidth = ApiLimits.IMAGE_PROCESSING_WIDTH;
    int captureHeight = ApiLimits.IMAGE_PROCESSING_HEIGHT;

    cameraParams_ = camera_.getParameters();
    cameraParams_.setPreviewSize(captureHeight, captureWidth);

    setCameraAutofocusIfPossible();

    // Set preview fps to the highest supported range.
    List<int[]> supportedFpsRanges = cameraParams_.getSupportedPreviewFpsRange();
    int[] fpsRange = supportedFpsRanges.get(supportedFpsRanges.size() - 1);
    cameraParams_.setPreviewFpsRange(fpsRange[0], fpsRange[1]);

    updateCameraParameters();

    frameProcessor_.initializeCameraPipeline(captureWidth, captureHeight);

    Log.d(TAG, "[GlAndroidCameraSensorApi19] new SurfaceTexture");
    captureSurfaceTexture_ = new SurfaceTexture(frameProcessor_.getCaptureTexture());
    captureSurfaceTexture_.setDefaultBufferSize(captureWidth, captureHeight);

    // On frame catpure, call the captureFrameListener_.
    captureSurfaceTexture_.setOnFrameAvailableListener(captureFrameListener_);

    try {
      camera_.setPreviewTexture(captureSurfaceTexture_);
    } catch (IOException exception) {
      Log.w(TAG, "Error setting camera preview texture", exception);
    }
    camera_.startPreview();
  }

  void captureFrame(SurfaceTexture captureTexture) {

    // TODO(nb): Figure out how caputureSurfaceTexture_ can be null here; this listener is on
    // the caputreSurfaceTexture_ and release is already called on the texture before it's set
    // to null.
    if (captureSurfaceTexture_ == null) {
      return;
    }
    if (!running_.get()) {
      return;
    }
    captureSurfaceTexture_.updateTexImage();

    float[] mtx = new float[16];
    captureSurfaceTexture_.getTransformMatrix(mtx);

    // Rotate mtx 90 degrees.
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

    /*
    // clang-format off
    Log.d(TAG, String.format(
      "[GlAndroidCameraSensorApi19] Set capture surface transform matrix:\n"
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
      new AndroidNativeCameraData(captureSurfaceTexture_.getTimestamp(), cameraSensorOrientation_));

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

  // This a callback object for the {@link SurfaceTexture}.
  SurfaceTexture.OnFrameAvailableListener captureFrameListener_ =
    new SurfaceTexture.OnFrameAvailableListener() {
      @Override
      public void onFrameAvailable(final SurfaceTexture captureTexture) {
        frameProcessor_.captureHandler().post(new Runnable() {
          @Override
          public void run() {
            captureFrame(captureTexture);
          }
        });
      }
    };

  private void updateCameraParameters() {
    if (camera_ != null) {
      camera_.setParameters(cameraParams_);
    }
  }

  @Override
  public void pause() {
    Log.d(TAG, "[GlAndroidCameraSensorApi19] pause");
    running_.set(false);

    try {
      cameraOpenCloseLock_.acquire();
      frameProcessor_.captureHandler().post(new Runnable() {
        @Override
        public void run() {
          closeCamera();
          cameraOpenCloseLock_.release();
        }
      });
      Log.d(TAG, "[GlAndroidCameraSensorApi19] start waiting for camera close.");
      cameraOpenCloseLock_.acquire();
    } catch (InterruptedException e) {
      e.printStackTrace();
    } finally {
      cameraOpenCloseLock_.release();
    }
    Log.d(TAG, "[GlAndroidCameraSensorApi19] done waiting for camera close.");
  }

  private void closeCamera() {
    if (camera_ != null) {
      camera_.stopPreview();
      camera_.release();
      camera_ = null;
    }

    // Now that we are on the capture thread, delete the surface texture.
    if (null != captureSurfaceTexture_) {
      // Release the surface texture.
      captureSurfaceTexture_.release();
      captureSurfaceTexture_ = null;
    }
    cameraSensorOrientation_ = 0;
  }

  @Override
  public void destroy() {
    Log.d(TAG, "[GlAndroidCameraSensorApi19] destroy");
    if (running_.get()) {
      pause();
    }
  }

  @Override
  public void setFrameProcessor(FrameProcessor frameProcessor) {
    frameProcessor_ = frameProcessor;
  }
}
