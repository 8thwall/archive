package com.the8thwall;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.TextureView;
import android.view.View;
import android.widget.Button;

import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import org.capnproto.MessageBuilder;

public class CameraFirstActivity
  extends Activity implements XrLoop.XrCallback, XrVideoController.RenderThreadListener {
  static { System.loadLibrary("camerafirst"); }

  static final String TAG = "8thWallJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[CameraFirstActivity] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private XrView xrView_ = null;
  private TextureView textureView_ = null;
  private XrVideoController xrVideoController_ = null;
  private XrLoop xr_ = null;
  private Handler mainThread_;

  @Override
  public void onCreate(Bundle icicle) {
    super.onCreate(icicle);
    setContentView(R.layout.main);

    xrView_ = (XrView)findViewById(R.id.xrview);
    textureView_ = (TextureView)findViewById(R.id.textureview);
    mainThread_ = new Handler(Looper.myLooper());

    if (
      ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
      != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, 1);
    }

    xrVideoController_ = new XrVideoController(this, XrLoop.environment(this), textureView_, this);

    ((Button)findViewById(R.id.start_native)).setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        if (xr_.isPlaying()) {
          pause();
        } else {
          resume();
        }
      }
    });
  }

  @Override
  public void onRenderThreadReady(Handler renderThreadHandler, int width, int height) {
    xr_ = new XrLoop(this, renderThreadHandler, this);
    onXrViewSizeChanged(width, height);
    renderThreadHandler.post(new Runnable() {
      @Override
      public void run() {
        logD("resume on renderThread");
        resume();
      }
    });
  }

  @Override
  public void onXrViewSizeChanged(int width, int height) {
    XRConfiguration.Builder config = new MessageBuilder().getRoot(XRConfiguration.factory);
    config.getMask().setCamera(true);
    config.getMask().setFeatureSet(true);
    config.getGraphicsIntrinsics().setTextureWidth(width);
    config.getGraphicsIntrinsics().setTextureHeight(height);
    config.getGraphicsIntrinsics().setNearClip(0.03f);
    config.getGraphicsIntrinsics().setFarClip(1000.0f);
    config.getGraphicsIntrinsics().setDigitalZoomVertical(1.0f);
    config.getGraphicsIntrinsics().setDigitalZoomHorizontal(1.0f);
    config.setMobileAppKey(
      "7jGehvwW7qRyTgaCPvf5KXKMFBy1cHJJYlrOdJbiuDSX0Ud2BUWwtBFVKhqUpWSmf1KflX");
    xr_.configure(config.asReader());
  }

  @Override
  protected void onResume() {
    resume();
    super.onResume();
  }

  private void resume() {
    logD("resume");
    if (xr_ == null) {
      logD("render thread not yet initialized");
      return;
    }

    if (
      ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
      != PackageManager.PERMISSION_GRANTED) {
      logD("no camera permission");
      return;
    }

    xr_.resume();
  }

  @Override
  protected void onPause() {
    pause();
    super.onPause();
  }

  private void pause() { xr_.pause(); }

  @Override
  protected void onDestroy() {
    xr_.destroy();
    super.onDestroy();
  }

  @Override
  public void onRealityUpdated(final RealityResponse.Reader reality) {
    mainThread_.post(new Runnable() {
      @Override
      public void run() {
        xrView_.update(reality);
      }
    });
    xrVideoController_.renderFrame(reality, reality.getAppContext());
  }
}
