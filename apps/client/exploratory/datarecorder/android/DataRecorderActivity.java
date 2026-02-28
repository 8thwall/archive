// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Scott Pollack (scott@8thwall.com)

package com.the8thwall.DataRecorder;

import com.the8thwall.reality.app.xr.android.XREngine;
import com.the8thwall.reality.app.disk.XRDisk;
import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREngineConfiguration;

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
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Button;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;
import org.capnproto.MessageBuilder;

public class DataRecorderActivity
  extends Activity implements XrLoop.XrCallback, XrVideoController.RenderThreadListener {
  static { System.loadLibrary("data-recorder"); }

  static private final String TAG = "8thWallJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.i(TAG, String.format("[DataRecorderActivity] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private TextureView textureView_ = null;
  private XrVideoController xrVideoController_ = null;
  private XrLoop xr_ = null;

  private boolean isLogging_;
  private Button button_;
  private int frameCount_;
  private Handler mainThread_;

  // Turn this off to test C8 on Android even if the device has ARCore.  Turn this on if you want
  // to extract ARCore metadata in the sequence with DataRecorder.
  private static final boolean DISABLE_NATIVE_AR_ENGINE = false;
  private static final boolean ENABLE_AUTOFOCUS = true;

  private boolean hasPermission(String permission) {
    if (this.checkCallingOrSelfPermission(permission) != PackageManager.PERMISSION_GRANTED) {
      String msg = "Error: " + permission + " is not granted.";
      Log.e(TAG, msg);
      Toast.makeText(this, msg, Toast.LENGTH_LONG).show();
      return false;
    }
    return true;
  }

  private boolean hasRequiredPermissions() {
    return hasPermission(Manifest.permission.CAMERA)
      && hasPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE);
  }

  // Called when the activity is first created.
  @Override
  public void onCreate(Bundle icicle) {
    super.onCreate(icicle);
    setContentView(R.layout.main);

    textureView_ = (TextureView)findViewById(R.id.textureview);
    mainThread_ = new Handler(Looper.myLooper());

    if (
      ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
      != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, 1);
    }

    if (
      ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
      != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(
        this, new String[] {Manifest.permission.WRITE_EXTERNAL_STORAGE}, 1);
    }

    xrVideoController_ = new XrVideoController(this, XrLoop.environment(this), textureView_, this);

    button_ = (Button)findViewById(R.id.start_native);
    button_.setOnClickListener(new View.OnClickListener() {
      @Override
      public void onClick(View view) {
        if (XRDisk.isLogging()) {
          logD("Pause requested.");
          pauseLogging();
        } else {
          startLogging();
        }
      }
    });

    Spinner spinner = (Spinner)findViewById(R.id.frame_count);
    ArrayAdapter<CharSequence> adapter = ArrayAdapter.createFromResource(
      this, R.array.frame_count_list, android.R.layout.simple_spinner_item);
    adapter.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item);
    spinner.setAdapter(adapter);
    spinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
      public void onItemSelected(AdapterView<?> parent, View view, int pos, long id) {
        ((TextView)parent.getChildAt(0)).setTextColor(getResources().getColor(R.color.whitish));
        frameCount_ = new Integer((String)parent.getItemAtPosition(pos)).intValue();
      }
      public void onNothingSelected(AdapterView<?> parent) {}
    });

    spinner.setSelection(3);  // 600
  }

  @Override
  public void onRenderThreadReady(Handler renderThreadHandler, int width, int height) {
    xr_ = new XrLoop(this, renderThreadHandler, this);
    onXrViewSizeChanged(width, height);
    XRDisk.create();
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
    if (DISABLE_NATIVE_AR_ENGINE) {
      XRConfiguration.Builder config = new MessageBuilder().getRoot(XRConfiguration.factory);
      config.getEngineConfiguration().setMode(
        XREngineConfiguration.SpecialExecutionMode.DISABLE_NATIVE_AR_ENGINE);
      xr_.configure(config.asReader());
    }

    XRConfiguration.Builder config = new MessageBuilder().getRoot(XRConfiguration.factory);
    config.getMask();
    if (!DISABLE_NATIVE_AR_ENGINE) {
      config.getMask().setCamera(true);
      config.getMask().setFeatureSet(true);
      config.getMask().setLighting(true);
      config.getMask().setSurfaces(true);
      config.getMask().setVerticalSurfaces(true);
    }
    config.getGraphicsIntrinsics().setTextureWidth(width);
    config.getGraphicsIntrinsics().setTextureHeight(height);
    config.getGraphicsIntrinsics().setNearClip(0.01f);
    config.getGraphicsIntrinsics().setFarClip(1000.0f);
    config.getCameraConfiguration().setAutofocus(ENABLE_AUTOFOCUS);
    config.getCameraConfiguration().setDepthMapping(true);
    config.getCameraConfiguration().setGps(true);
    config.setMobileAppKey(
      "nCL0GJ3RdLelnLwNZIdYaygATqcWrcoOCVnPelZW3iZDXdwclrDYDZbcVlVVn94Ym0yOZm");
    xr_.configure(config.asReader());
  }

  @Override
  protected void onResume() {
    pauseLogging();
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

    if (
      ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
      != PackageManager.PERMISSION_GRANTED) {
      logD("no storage permission");
    }

    xr_.resume();
  }

  private void updateButtonText(final String newText) {
    mainThread_.post(new Runnable() {
      @Override
      public void run() {
        button_.setText(newText);
      }
    });
  }

  // Called when the activity is about to be paused.
  @Override
  protected void onPause() {
    pauseLogging();
    pause();
    super.onPause();
  }

  private void pause() { xr_.pause(); }

  private void startLogging() {
    if (xr_ == null) {
      logD("render thread not yet initialized");
      return;
    }
    if (!hasRequiredPermissions()) {
      Log.e(TAG, "Application does not have the required permissions!");
      return;
    }
    logD("Recording for " + frameCount_ + " frames.");
    updateButtonText("Logging");
    isLogging_ = true;
    xr_.pause();
    XRDisk.logToDisk(frameCount_);
    xr_.resume();
  }

  private void pauseLogging() {
    logD("Pausing.");
    updateButtonText("Start");
    isLogging_ = false;
  }

  // Called when the activity is about to be destroyed.
  @Override
  protected void onDestroy() {
    XRDisk.destroy();
    xr_.destroy();
    super.onDestroy();
  }

  @Override
  public void onRealityUpdated(final RealityResponse.Reader reality) {
    xrVideoController_.renderFrame(reality, reality.getAppContext());
    if (XRDisk.isLogging()) {
      isLogging_ = true;
      updateButtonText(String.format("%s %d", "Logging", XRDisk.framesLogged()));
    }
    if (!XRDisk.isLogging() && isLogging_) {
      logD("XRDisk finished logging.");
      pauseLogging();
    }
  }
}
