package com.the8thwall.reality.app.sensors.camera;

import android.os.Handler;

/**
 * Interface defining common attributes an OpenGL Android camera sensor should provide.
 */
public interface GlAndroidCameraSensor {

  public static interface FrameProcessor {
    public void initializeCameraPipeline(int captureWidth, int captureHeight);
    public int getCaptureTexture();
    public void doCaptureProcessing(float[] mtx, AndroidNativeCameraData frame);
    public void doFrameProcessing();
    public Handler captureHandler();
    public Handler processingHandler();
  }

  /**
   * Resumes the processing of image data through the {@link FrameProcessor} interface.
   */
  public void resume();

  /**
   * Pauses the processing of image data through the {@link FrameProcessor} interface.
   */
  public void pause();

  /**
   * Destroys the camera sensor by removing all references to camera instances.
   */
  public void destroy();

  /**
   * Sets the {@link FrameProcessor} that will handle processing callbacks for
   * the {@link GlAndroidCameraSensor}.
   */
  public void setFrameProcessor(FrameProcessor frameProcessor);

  /**
   * Configure the sensor on your Android device.
   *
   * @param enableCameraAutofocus Set the camera managed by your implementation to use (continuous)
   * autofocus (or not) The implementation should queue the update to the sensor state asap. The
   * caller will not call another method to queue this update.
   */
  public void configure(boolean enableCameraAutofocus);
}
