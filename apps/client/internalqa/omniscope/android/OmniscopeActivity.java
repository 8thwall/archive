package com.the8thwall;

import android.Manifest;
import android.app.Activity;
import android.content.pm.PackageManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.util.Log;
import android.view.TextureView;
import android.widget.Button;

import com.the8thwall.apps.client.internalqa.omniscope.android.bridge.Omniscope;

public class OmniscopeActivity
  extends Activity {
  static { System.loadLibrary("omniscope"); }

  private static final String TAG = "NianticJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[OmniscopeActivity] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private Omniscope omni8_;

  @Override
  public void onCreate(Bundle icicle) {
    super.onCreate(icicle);
    setContentView(R.layout.main);

    Omniscope.create(this, 1 /* OPENGL */);
    omni8_ = Omniscope.getInstance();
    omni8_.setViews(
      (TextureView)findViewById(R.id.textureview), (Button)findViewById(R.id.next_button));

    if (
      ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
      != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(this, new String[] {Manifest.permission.CAMERA}, 1);
    }

    if (
      ContextCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION)
      != PackageManager.PERMISSION_GRANTED) {
      ActivityCompat.requestPermissions(
        this, new String[] {Manifest.permission.ACCESS_FINE_LOCATION}, 2);
    }
  }

  @Override
  protected void onResume() {
    resume();
    super.onResume();
  }

  private void resume() {
    logD("resume");

    if (
      ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
      != PackageManager.PERMISSION_GRANTED) {
      logD("no camera permission");
      return;
    }

    omni8_.resume();
  }

  @Override
  protected void onPause() {
    omni8_.pause();
    super.onPause();
  }

  @Override
  protected void onDestroy() {
    omni8_.destroy();
    super.onDestroy();
  }
}
