package com.nianticlabs.c8;

import android.graphics.SurfaceTexture;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;
import android.view.Choreographer;
import android.view.MotionEvent;
import android.view.TextureView;
import android.view.View;

/**
 * A controller that establishes a native-refresh-rate renderloop for an Android texture view and
 * invokes callbacks on a handler.
 */
public class RenderLoopViewController
  implements TextureView.SurfaceTextureListener, View.OnTouchListener, Choreographer.FrameCallback {

  private static final String TAG = "NianticJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.w(
      TAG, String.format("[RenderLoopViewController] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private volatile EglDisplayTexture eglDisplayTexture_;
  private RenderThreadListener renderThreadListener_;

  private HandlerThread renderThread_;
  private Handler renderHandler_;

  private volatile boolean isPlaying_ = false;
  private Choreographer choreographer_;

  private double renderMillis_ = 0.0;

  private volatile boolean wasDestroyed_ = false;

  public interface RenderThreadListener {
    /**
     * Display is initialized and ready to start rendering.
     */
    public void onRenderThreadReady(Handler renderThreadHandler, int width, int height);

    /**
     * The display size changed.
     */
    public void onDisplaySizeChanged(int width, int height);

    /**
     * The user touched the view.
     */
    public void gotTouches(View v, MotionEvent e);

    /**
     * Optionally render the next frame, and return true if the frame was rendered.
     */
    boolean renderNextFrame(double frameTimeMillis);

    /**
     * When the render thread is ended.
     */
    public void onRenderThreadEnded();
  }

  public RenderLoopViewController(
    TextureView textureView, RenderThreadListener renderThreadListener) {
    logD("{ RenderLoopViewController::RenderLoopViewController");
    renderThreadListener_ = renderThreadListener;
    textureView.setSurfaceTextureListener(this);
    textureView.setOnTouchListener(this);
    logD("} RenderLoopViewController::RenderLoopViewController");
  }

  public void destroy() {
    logD("{ RenderLoopViewController::destroy");
    synchronized (this) {
      if (wasDestroyed_) {
        logD("{ RenderLoopViewController::destroy (already destroyed)");
        return;
      }
      this.wasDestroyed_ = true;
      this.isPlaying_ = false;
      if (eglDisplayTexture_ != null) {
        eglDisplayTexture_.destroy();
        eglDisplayTexture_ = null;
      }
    }
    logD("} RenderLoopViewController::destroy");
  }

  public void resume() {
    logD("{ RenderLoopViewController::resume");
    synchronized (this) {
      if (isPlaying_) {
        logD("RenderLoopViewController::resume (already playing)");
        return;
      }
      isPlaying_ = true;
      if (choreographer_ != null) {
        choreographer_.postFrameCallback(this);
      }
    }
    logD("} RenderLoopViewController::resume");
  }

  public void pause() {
    logD("{ RenderLoopViewController::pause");
    isPlaying_ = false;
    logD("} RenderLoopViewController::pause");
  }

  @Override
  public boolean onTouch(View v, MotionEvent e) {
    renderThreadListener_.gotTouches(v, e);
    return true;
  }

  @Override
  public void onSurfaceTextureAvailable(SurfaceTexture surface, final int width, final int height) {
    logD("{ RenderLoopViewController::onSurfaceTextureAvailable");
    if (renderThread_ != null) {
      throw new IllegalStateException("Already have a context");
    }
    logD(String.format("onSurfaceTextureAvailable(..., %d, %d)", width, height));

    renderThread_ = new HandlerThread("RenderThread");
    renderThread_.start();
    renderHandler_ = new Handler(renderThread_.getLooper());

    RenderLoopViewController rlvc = this;

    renderHandler_.post(new Runnable() {
      @Override
      public void run() {
        synchronized (RenderLoopViewController.this) {
          logD("{ RenderLoopViewController::onSurfaceTextureAvailable::run");
          if (wasDestroyed_) {
            logD("} RenderLoopViewController::onSurfaceTextureAvailable::run (already destroyed)");
            return;
          }
          choreographer_ = Choreographer.getInstance();
          // Create the capture texture.
          eglDisplayTexture_ = EglDisplayTexture.create(surface);
          renderThreadListener_.onRenderThreadReady(renderHandler_, width, height);
          if (isPlaying_) {
            choreographer_.postFrameCallback(rlvc);
          }
          logD("} RenderLoopViewController::onSurfaceTextureAvailable::run");
        }
      }
    });
    logD("} RenderLoopViewController::onSurfaceTextureAvailable");
  }

  @Override
  public void onSurfaceTextureSizeChanged(
    SurfaceTexture surface, final int width, final int height) {
    logD("{ RenderLoopViewController::onSurfaceTextureSizeChanged");
    if (renderThread_ == null) {
      throw new IllegalStateException("Context not ready");
    }
    logD(String.format("onSurfaceTextureSizeChanged(..., %d, %d)", width, height));
    renderHandler_.post(new Runnable() {
      @Override
      public void run() {
        logD("{ RenderLoopViewController::onSurfaceTextureSizeChanged::run");
        renderThreadListener_.onDisplaySizeChanged(width, height);
        logD("} RenderLoopViewController::onSurfaceTextureSizeChanged::run");
      }
    });
    logD("} RenderLoopViewController::onSurfaceTextureSizeChanged");
  }

  @Override
  public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
    logD("{ RenderLoopViewController::onSurfaceTextureDestroyed");
    synchronized (this) {  // Wait for any pending render to complete.
      isPlaying_ = false;
      if (renderThread_ == null) {
        logD("} RenderLoopViewController::onSurfaceTextureDestroyed (no render thread)");
        return true;
      }

      // Schedule render thread for self-shutdown.
      renderHandler_.post(new Runnable() {
        @Override
        public void run() {
          logD("{ RenderLoopViewController::onSurfaceTextureDestroyed::run");
          Looper looper = Looper.myLooper();
          if (looper != null) {
            looper.quit();
            renderThreadListener_.onRenderThreadEnded();
          }
          logD("} RenderLoopViewController::onSurfaceTextureDestroyed::run");
        }
      });
      renderThread_ = null;
      logD("} RenderLoopViewController::onSurfaceTextureDestroyed");
      return true;
    }
  }

  @Override
  public void onSurfaceTextureUpdated(SurfaceTexture surface) {
    // Nothing to do
  }

  @Override
  public void doFrame(long frameTimeNanos) {
    runNextUpdate(frameTimeNanos);
  }

  private void runNextUpdate(long frameTimeNanos) {
    synchronized (this) {
      if (!isPlaying_) {
        return;
      }

      if (renderThreadListener_.renderNextFrame(frameTimeNanos / 1.0e6)) {
        eglDisplayTexture_.flush();
      }

      choreographer_.postFrameCallback(this);
    }
  }
}
