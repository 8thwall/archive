package com.the8thwall.reality.app.sensors.arcore;

import com.the8thwall.c8.pixels.PixelTransforms;
import com.the8thwall.reality.engine.api.Reality.ImageDetectionConfiguration;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import com.the8thwall.reality.engine.api.Reality.XRDetectionImage;
import com.the8thwall.reality.engine.api.base.ImageTypes.CompressedImageData;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.util.Log;

import com.google.ar.core.AugmentedImage;
import com.google.ar.core.AugmentedImageDatabase;
import com.google.ar.core.Session;
import com.google.ar.core.exceptions.ImageInsufficientQualityException;

import org.capnproto.StructList;

/**
 * An {@link AsyncTask} which is responsible for decoding the provided XR Image
 * Detection Configuration into a format expected by ARCore. The result is the
 * newly constructed {@link AugmentedImageDatabase}, which can then be used to
 * set to an external {@link com.google.ar.core.Configuration}.
 */
class ImageDetectionConfigAsyncTask
    extends AsyncTask<ImageDetectionConfiguration.Reader, Integer, AugmentedImageDatabase> {

  private static final String TAG = "8thWallJava";

  interface Callback {
    /**
     * Notifies the callback that the task has completed. This will be called on the
     * main thread.
     */
    void onComplete(AugmentedImageDatabase result);
  }

  private final Session session_;
  private final Callback callback_;

  ImageDetectionConfigAsyncTask(Session session, Callback callback) {
    session_ = session;
    callback_ = callback;
  }

  @Override
  protected AugmentedImageDatabase doInBackground(ImageDetectionConfiguration.Reader... detectionConfig) {
    AugmentedImageDatabase imageDb = new AugmentedImageDatabase(session_);
    StructList.Reader<XRDetectionImage.Reader> imageDetectionSet = detectionConfig[0].getImageDetectionSet();
    for (int i = 0; i < imageDetectionSet.size(); ++i) {
      if (isCancelled()) {
        // This task may be cancelled before completion. Don't bother executing more if
        // cancelled.
        break;
      }
      XRDetectionImage.Reader detectionImage = imageDetectionSet.get(i);
      CompressedImageData.Reader imageData = detectionImage.getImage();

      byte[] bytes = imageData.getData().toArray();
      if (imageData.getEncoding() == CompressedImageData.Encoding.RGB24_INVERTED_Y) {
        PixelTransforms.flipVertical(bytes, imageData.getWidth(), imageData.getHeight(), 3);
      }
      int[] pixels = PixelTransforms.rgbToArgb(bytes);
      Bitmap bitmap = Bitmap.createBitmap(pixels, imageData.getWidth(), imageData.getHeight(), Bitmap.Config.ARGB_8888);
      if (bitmap != null) {
        addImageToDB(imageDb, bitmap, detectionImage.getName().toString(), detectionImage.getRealWidthInMeter());
      }
    }
    return imageDb;
  }

  private static void addImageToDB(AugmentedImageDatabase db, Bitmap bitmap, String name, float widthInMeters) {
    try {
      db.addImage(name, bitmap, widthInMeters);
    } catch (ImageInsufficientQualityException e) {
      Log.w(TAG, String.format("Error: %s was of insufficient image quality.", name), e);
    }
  }

  @Override
  protected void onPostExecute(AugmentedImageDatabase result) {
    if (!isCancelled()) {
      callback_.onComplete(result);
    }
  }
}
