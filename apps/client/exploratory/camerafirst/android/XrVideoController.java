package com.the8thwall;

import android.content.Context;
import android.graphics.SurfaceTexture;
import android.opengl.EGLContext;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.Looper;
import android.util.Log;
import android.view.TextureView;

import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.Reality.XRAppEnvironment;
import com.the8thwall.reality.engine.api.Reality.XREnvironment;
import com.the8thwall.reality.engine.api.request.App.AppContext;

/**
 * A controller that manages the interactions between a SurfaceTexture (UI element), EGL Display
 * texture, and Camera Feed Renderer.
 */
public class XrVideoController implements TextureView.SurfaceTextureListener {

  private static final String TAG = "8thWallJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[XrVideoController] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private EglDisplayTexture eglDisplayTexture_;
  private SurfaceTexture displayTexture_;
  private RenderThreadListener renderThreadListener_;
  private XrCameraFeedRenderer cameraFeedRenderer_;
  private XREnvironment.Reader env_;
  private Context context_;

  private HandlerThread renderThread_;
  private Handler renderHandler_;

  public interface RenderThreadListener {
    /**
     * Display is initialized and ready to start rendering.
     */
    public void onRenderThreadReady(Handler renderThreadHandler, int width, int height);

    /**
     * The display size changed.
     */
    public void onXrViewSizeChanged(int width, int height);
  }

  public XrVideoController(
    Context context,
    XREnvironment.Reader env,
    TextureView textureView,
    RenderThreadListener renderThreadListener) {
    renderThreadListener_ = renderThreadListener;
    context_ = context;
    env_ = env;
    textureView.setSurfaceTextureListener(this);
  }

  public EGLContext getEglContext() { return eglDisplayTexture_.getContext(); }

  public void renderFrame(final RealityResponse.Reader reality, AppContext.Reader appContext) {
    cameraFeedRenderer_.drawFrame(reality, appContext);
    eglDisplayTexture_.flush();
  }

  public void renderFrame(XRAppEnvironment.Reader appEnv, AppContext.Reader appContext) {
    cameraFeedRenderer_.drawFrame(appEnv, appContext);
    eglDisplayTexture_.flush();
  }

  public void destroy() { eglDisplayTexture_.destroy(); }

  @Override
  public void onSurfaceTextureAvailable(SurfaceTexture surface, final int width, final int height) {
    if (renderThread_ != null) {
      throw new IllegalStateException("Already have a context");
    }
    logD(String.format("onSurfaceTextureAvailable(..., %d, %d)", width, height));
    displayTexture_ = surface;

    renderThread_ = new HandlerThread("RenderThread");
    renderThread_.start();
    renderHandler_ = new Handler(renderThread_.getLooper());

    renderHandler_.post(new Runnable() {
      @Override
      public void run() {
        // Create the caputre texture.
        eglDisplayTexture_ = EglDisplayTexture.create(displayTexture_);
        cameraFeedRenderer_ = XrCameraFeedRenderer.create(context_, env_, width, height);
        renderThreadListener_.onRenderThreadReady(renderHandler_, width, height);
      }
    });
  }

  @Override
  public void onSurfaceTextureSizeChanged(
    SurfaceTexture surface, final int width, final int height) {
    if (renderThread_ == null) {
      throw new IllegalStateException("Context not ready");
    }
    logD(String.format("onSurfaceTextureSizeChanged(..., %d, %d)", width, height));
    renderHandler_.post(new Runnable() {
      @Override
      public void run() {
        cameraFeedRenderer_.onXrViewSizeChanged(width, height);
        renderThreadListener_.onXrViewSizeChanged(width, height);
      }
    });
  }

  @Override
  public boolean onSurfaceTextureDestroyed(SurfaceTexture surface) {
    logD("displayTextureListener_#onSurfaceTextureDestroyed(...)");
    if (renderThread_ == null) {
      return true;
    }

    // Schedule render thread for self-shutdown.
    renderHandler_.post(new Runnable() {
      @Override
      public void run() {
        Looper looper = Looper.myLooper();
        if (looper != null) {
          looper.quit();
        }
      }
    });
    renderThread_ = null;
    return true;
  }

  @Override
  public void onSurfaceTextureUpdated(SurfaceTexture surface) {
    // Nothing to do
  }
}
