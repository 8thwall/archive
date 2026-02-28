package com.nianticlabs.apps.client.exploratory.androidthreejs;

import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.system.ErrnoException;
import android.system.Os;
import android.util.Log;
import android.view.Choreographer;
import android.view.Surface;
import android.view.SurfaceHolder;
import android.view.SurfaceView;
import com.nianticlabs.apps.client.exploratory.androidthreejs.NativeWindowJni;
import com.nianticlabs.apps.client.exploratory.androidthreejs.NodeBindingJni;
import java.io.*;
import java.lang.System;
import java.nio.file.Paths;

public class MainActivity extends AppCompatActivity {
  private static String TAG = "AndroidThreejs";

  private AssetManager assetManager_ = null;

  private long nativeWindow_ = 0;

  private long baseTimeNanos_ = System.nanoTime() - (System.currentTimeMillis() * 1000000L);

  static {
    System.loadLibrary("android-threejs");
    System.loadLibrary("node");
  }

  @Override
  public void onConfigurationChanged(Configuration newConfig) {
    super.onConfigurationChanged(newConfig);
    // Handle orientation change here manually.
  }

  // Called when the activity is first created.
  // Initialization of essential components should be done here.
  @Override
  protected void onCreate(Bundle savedInstanceState) {
    super.onCreate(savedInstanceState);
    Log.d(TAG, "onCreate");

    setContentView(R.layout.activity_main);

    assetManager_ = getAssets();

    final String filesDir = getBaseContext().getFilesDir().getAbsolutePath();

    try {
      Os.setenv("RUNFILES_DIR", Paths.get(filesDir, "runfiles").toString(), false);
    } catch (ErrnoException e) {
      Log.e(TAG, "Failed to set env variable");
    }

    assetManager_ = getAssets();

    try {
      copyAssetDirectory("", filesDir);
    } catch (IOException e) {
      e.printStackTrace();
      Log.e(TAG, "Copying assets failed");
      return;
    }

    SurfaceView surfaceView = (SurfaceView)findViewById(R.id.mainSurface);
    SurfaceHolder surfaceHolder = surfaceView.getHolder();

    surfaceHolder.addCallback(new SurfaceHolder.Callback() {
      private boolean isActive_ = false;

      @Override
      public void surfaceCreated(SurfaceHolder h) {
        Log.i(TAG, "surfaceCreated");
      }
      @Override
      public void surfaceChanged(SurfaceHolder h, int format, int width, int height) {
        Log.i(TAG, "surfaceChanged");
        Surface surface = h.getSurface();

        Log.v(TAG, surface.toString());

        nativeWindow_ = NativeWindowJni.acquireSurface(surface);

        Thread mainNodeThread = new Thread(new Runnable() {
          @Override
          public void run() {
            NodeBindingJni.onCreate(
              new String[] {"node", filesDir + "/app.js"}, filesDir, nativeWindow_, width, height);
          }
        });

        mainNodeThread.setUncaughtExceptionHandler(new Thread.UncaughtExceptionHandler() {
          public void uncaughtException(Thread t, Throwable e) {
            Log.e(TAG, "Node threw exception");
          }
        });
        mainNodeThread.start();

        isActive_ = true;

        // Register a FrameCallback with the Choreographer instance.
        Choreographer.getInstance().postFrameCallback(new Choreographer.FrameCallback() {
          @Override
          public void doFrame(long frameTimeNanos) {
            // Call your function here.
            NodeBindingJni.processAnimationFrames(frameTimeNanos - baseTimeNanos_);

            // Register the next FrameCallback.
            if (isActive_) {
              Choreographer.getInstance().postFrameCallback(this);
            }
          }
        });
      }
      @Override
      public void surfaceDestroyed(SurfaceHolder h) {
        isActive_ = false;

        Log.i(TAG, "surfaceDestroyed");
        NodeBindingJni.onDestroy();
        NativeWindowJni.releaseSurface(nativeWindow_);
        nativeWindow_ = 0;
      }
    });
  }

  // Called when the activity becomes visible to the user.
  @Override
  protected void onStart() {
    super.onStart();
    Log.d(TAG, "onStart");
    // The activity is about to become visible
  }

  // Called when the activity starts interacting with the user.
  // This is the best place to register listeners or to perform operations that need to happen every
  // time the activity is in the foreground.
  @Override
  protected void onResume() {
    super.onResume();
    Log.d(TAG, "onResume");
    // The activity has become visible (it is now "resumed")
  }

  // Called when the system is about to start resuming another activity.
  // This is a good place to save data that should persist if the user leaves the activity.
  @Override
  protected void onPause() {
    super.onPause();
    Log.d(TAG, "onPause");
    // Another activity is taking focus, and this activity is about to be "paused"
  }

  // Called when the activity is no longer visible to the user.
  @Override
  protected void onStop() {
    super.onStop();
    Log.d(TAG, "onStop");
    // The activity is no longer visible (it is now "stopped")
  }

  // Called before the activity is destroyed.
  // Cleanup and releasing resources should be done here.
  @Override
  protected void onDestroy() {
    super.onDestroy();
    Log.d(TAG, "onDestroy");
    // The activity is about to be destroyed
  }

  private void copyAssetDirectory(String srcFolder, String destPath) throws IOException {
    String[] files = assetManager_.list(srcFolder);

    if (files.length == 0) {
      copyAssetFile(srcFolder, destPath);
    } else {
      new File(destPath).mkdirs();
      for (String file : files) {
        if (srcFolder.equals("")) {
          copyAssetDirectory(file, destPath + "/" + file);
        } else {
          copyAssetDirectory(srcFolder + "/" + file, destPath + "/" + file);
        }
      }
    }
  }

  private void copyAssetFile(String srcFolder, String destPath) throws IOException {
    InputStream in = assetManager_.open(srcFolder);
    new File(destPath).createNewFile();
    OutputStream out = new FileOutputStream(destPath);
    copyFile(in, out);
    in.close();
    in = null;
    out.flush();
    out.close();
    out = null;
  }

  private void copyFile(InputStream in, OutputStream out) throws IOException {
    byte[] buffer = new byte[1024];
    int read;
    while ((read = in.read(buffer)) != -1) {
      out.write(buffer, 0, read);
    }
  }
}
