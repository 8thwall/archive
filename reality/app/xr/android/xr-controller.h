// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#ifdef ANDROID

#include <jni.h>

#include <map>

#include "reality/app/xr/android/xr-data-types.h"

namespace c8 {

struct XrControllerPrivateData;

class XrController {
public:
  // Default constructor.
  XrController();
  ~XrController();

  // Default move constructors.
  XrController(XrController &&) = default;
  XrController &operator=(XrController &&) = default;

  // Disallow copying.
  XrController(const XrController &) = delete;
  XrController &operator=(const XrController &) = delete;

  /**
   * Allow the 8thWall Remote app to stream AR data to the Unity editor. This value can only be
   * changed prior to pressing 'play' in the Unity Editor.
   */
  bool enableRemote = true;

  /**
   * Only use the XR controller in this scene to enable development with the 8thWall Remote app;
   * Don't enable any AR featuress.
   */
  bool remoteOnly = false;

  /**
   * Enable lighting estimation in the AR engine. Changes to this value will take place after the
   * next call to ConfigureXR.
   */
  bool enableLighting = true;

  /**
   * Enable camera motion estimation in the AR engine. Changes to this value will take place after
   * the next call to ConfigureXR.
   */
  bool enableCamera = true;

  /**
   * Enable horizontal surface finding in the AR engine. Changes to this value will take place after
   * the next call to ConfigureXR.
   */
  bool enableSurfaces = true;

  /**
   * Enable vertical surface finding in the AR engine. Changes to this value will take place after
   * the next call to ConfigureXR.
   */
  bool enableVerticalSurfaces = false;

  /**
   * Allow the camera to autofocus if it's able. This may improve the quality of the camera feed
   * but might decrease tracking performance. Not all AR engines support auto focus.
   */
  bool enableCameraAutofocus = false;

  /**
   * Indicates that AR related features are currently disabled when playing a scene in the Editor.
   * AR features can be disabled because "enableRemote" is set to false, or because there is no
   * connected 8th Wall Remote. When running on device, this always returns false (i.e. AR features
   * are always enabled).
   */
  /*
  public bool DisabledInEditor();
  */

  /**
   * Get the instrinsic matrix of the Camera. This specifies how to set the field of view of the
   * unity camera so that digital objects are properly overlayed on top of the AR camera feed. The
   * returned intrinsic matrix is suitable for the Unity Camera that was previously configured using
   * UpdateCameraProjectionMatrix.
   */
  xr::Matrix4x4 cameraIntrinsics();

  /**
   * Get the position of the Camera in Unity's world coordinate system.
   */
  xr::Vector3 cameraPosition();

  /**
   * Returns tracking state (and reason, if applicable) of underlying AR engine as an
   * XRTrackingState struct.
   */
  xr::TrackingState trackingState();

  /**
   * Get the rotation of the Camera in Unity's world coordinate system.
   */
  xr::Quaternion cameraRotation();

  /**
   * Configure the XRController for the unity scene.
   *
   * The Camera provides information about how AR overlay data will be presented, so that subsequent
   * calls to GetCameraIntrinsics return appropriate values. Origin specifies an initial camera
   * position in the virtual scene so that the virtual scene can be properly aligned to the real
   * world.
   *
   * When the engine is started, the camera will start in the scene at the provided origin, facing
   * along the x/z direction as specified by facing. Tilts and in-plane rotations in the facing
   * rotation are ignored. Scale provides information about how units in Unity's coordinate system
   * relate to distances in the real world.
   *
   * For example, if scale is set to 10, moving the device 1 physical meter will cause the unity
   * Camera to move by 10 unity units, while moving the device by 10cm will cause the unity Camera
   * to move by 1 unity unit. Note that scale only applies when GetCapabilities().positionTracking
   * is PositionTracking.ROTATION_AND_POSITION. When a device uses
   * PositionTracking.ROTATION_AND_POSITION_NO_SCALE, the scene is scaled by the height of the
   * origin value.
   */
  void updateCameraProjectionMatrix(
    xr::Camera cam, xr::Vector3 origin, xr::Quaternion facing, float scale);

  /**
   * Get the amount that a camera feed texture should be rotated to appear upright in a given app's
   * UI based on the app's orientation (e.g. portrait or landscape right) on the current device.
   */
  xr::TextureRotation textureRotation();

  /**
   * Returns the exposure of the environment as a value in the range -1 to 1.
   */
  float lightExposure();

  /**
   * Returns the light temperature of the environment. Temperature measures the color of light
   * on a red to blue spectrum where low values (around 1000) are very red, high values (around
   * 15000) are very blue, and values around 6500 are close to white.
   */
  float lightTemperature();

  /**
   * Returns the id of the currently active surface, or 0 if there is no active surface. The active
   * surface is the detected surface that is currently in the center of the device's camera feed.
   */
  int64_t activeSurfaceId();

  /**
   * Returns the XRSurface of the surface with the requested ID, or XRSurface.NO_SURFACE if no
   * surface with that id exists.
   */
  xr::Surface surface(int64_t id);

  /**
   * Returns all surfaces known to the AR engine.
   */
  std::vector<xr::Surface> surfaces();

  /**
   * Returns aspect ratio (width/height) of captured image.
   */
  float realityTextureAspectRatio();

  /**
   * Returns if capture feed is encoded as a single RGBA texture (e.g. ARCore). If false, the
   * capture feed is stored in two separate textures containing the Y and UV color components. These
   * two textures should be combined using an appropriate shader prior to display.
   */
  bool shouldUseRealityRGBATexture();

  /**
   * Returns what the device's camera is capturing as an RGBA texture.
   */
  xr::Texture2D realityRGBATexture();

  /**
   * Set App Key. Needs to be set prior to Start() in the Unity lifecycle (i.e. in Awake or
   * OnEnable). You will need to create a unique license key on 8thWall.com for each 8th Wall app
   * that you develop.
   */
  void setAppKey(const std::string &key);

  /**
   * Returns what the device's camera is capturing as a Y texture stored in the R channel.
   */
  xr::Texture2D realityYTexture();

  /**
   * Returns what the device's camera is capturing as a UV texture stored in the RG channels.
   */
  xr::Texture2D realityUVTexture();

  /**
   * Returns the appropriate Video shader for drawing the AR scene background.
   */
  /*
public Shader GetVideoShader() {
 if (xrEnvironment == null) {
   return Shader.Find("Unlit/XRCameraYUVShader");
 }
 switch(xrEnvironment.getRealityImageShader()) {
   case XREnvironment.ImageShaderKind.ARCORE:
     return Shader.Find("Unlit/ARCoreCameraShader");
   default:
     return (ShouldUseRealityRGBATexture()
         ? Shader.Find("Unlit/XRCameraRGBAShader")
         : Shader.Find("Unlit/XRCameraYUVShader"));
 }
}*/

  /**
   * Returns the appropriate Video texture shader for drawing AR video textures on objects.
   */
  /*
public Shader GetVideoTextureShader() {
 switch(xrEnvironment.getRealityImageShader()) {
   case XREnvironment.ImageShaderKind.ARCORE:
     return Shader.Find("Unlit/ARCoreTextureShader");
   default:
     return (ShouldUseRealityRGBATexture()
         ? Shader.Find("Unlit/XRTextureRGBAShader")
         : Shader.Find("Unlit/XRTextureYUVShader"));;
 }
}
*/

  /**
   * For Non-ARKit/ARCore phones, reset surface to original position relative to camera.
   */
  void recenter();

  /**
   * Returns the AR capabilities available to the device, e.g. position tracking and surface
   * estimation.
   *
   * TODO(nb): Make this static.
   */
  xr::Capabilities capabilities();

  /**
   * Estimate the 3D position (in unity units) of a point on the camera feed. X and Y are specified
   * as numbers between 0 and 1, where (0, 0) is the upper left corner and (1, 1) is the lower right
   * corner of the camera feed as rendered in the camera that was specified with
   * UpdateCameraProjectionMatrix.
   *
   * Mutltiple 3d position esitmates may be returned for a single hit test based on the source
   * of data being used to estimate the position. The data source that was used to estimate the
   * position is indicated by the XRHitTestResult.Type.
   *
   * Example usage:
   *
   * List<XRHitTestResult> hits = new List<XRHitTestResult>();
   * if (Input.touchCount != 0) {
   *   var t = Input.GetTouch(0);
   *   if (t.phase == TouchPhase.Began) {
   *     float x = t.position.x / Screen.width;
   *     float y = (Screen.height - t.position.y) / Screen.height;
   *     hits.AddRange(xr.HitTest(x, y));
   *   }
   * }
   */
  std::vector<xr::HitTestResult> hitTest(float x, float y);

  /**
   * Estimate the 3D position (in unity units) of a point on the camera feed, optionally filtering
   * the results by the source of information that is used to estimate the 3d position. If no
   * types are specified, all hit test results are returned.
   *
   * X and Y are specified as numbers between 0 and 1, where (0, 0) is the upper left corner and
   * (1, 1) is the lower right corner of the camera feed as rendered in the camera that was
   * specified with UpdateCameraProjectionMatrix.
   *
   * Mutltiple 3d position esitmates may be returned for a single hit test based on the source
   * of data being used to estimate the position. The data source that was used to estimate the
   * position is indicated by the XRHitTestResult.Type.
   *
   * Example usage:
   *
   * List<XRHitTestResult> hits = new List<XRHitTestResult>();
   * List<XRHitTestResult.Type> types = new List<XRHitTestResult.Type>();
   * types.Add(XRHitTestResult.Type.DETECTED_SURFACE);
   * if (Input.touchCount != 0) {
   *   var t = Input.GetTouch(0);
   *   if (t.phase == TouchPhase.Began) {
   *     float x = t.position.x / Screen.width;
   *     float y = (Screen.height - t.position.y) / Screen.height;
   *     hits.AddRange(xr.HitTest(x, y, types));
   *   }
   * }
   */
  std::vector<xr::HitTestResult> hitTest(
    float x, float y, std::vector<xr::HitTestResult::Type> includedTypes);

  /**
   * Returns the estimated 3d location of some points in the world, as estimated by the AR engine.
   */
  std::vector<xr::WorldPoint> worldPoints();

  /**
   * Returns the image-targets that have been detected after calling SetDetectionImages.
   */
  std::vector<xr::DetectedImageTarget> detectedImageTargets();

  /**
   * Static method that returns the AR capabilities available to the device, e.g. position tracking
   * and surface estimation.
   */
  xr::Capabilities deviceCapabilities();

  /**
   *  Reconfigure XR based on the currently selected options (lighting, camera, surfaces, etc.).
   *  All configuration changes are best-effort based on the setting and device. This means that
   *  changes might take effect immediately (next frame), soon (in a few frames), on camera session
   *  restart (the next call to pause and resume), or never (if a setting is not supported on a
   * given device).
   */
  void configureXR();

  /**
   * Get the target-images that were last sent for detection to the AR engine via
   * SetDetectionImages, or an empty map if none were set.
   *
   * For example, to add an image to the image-targets being detected, call
   *
   * var images = xr.GetDetectionImages();
   * images.Add(
   *   "new-image-name",
   *   XRDetectionImage.FromDetectionTexture(
   *     new XRDetectionTexture(newImageTexture, newImageWidthInMeters)));
   * xr.SetDetectionImages(images);
   */
  std::map<std::string, xr::DetectionImage> detectionImages();

  /**
   * Sets the target-images that will be detected.
   */
  void setDetectionImages(const std::map<std::string, xr::DetectionImage> &images);

  /**
   * Disable the native AR engine (e.g. ARKit / ARCore) and force the use of 8th Wall's instant
   * surface tracker. This can be useful if you want to test compatibility with legacy devices,
   * or if you want to use 8th Wall's instant surface tracking.
   *
   * This should only be called during scene setup, e.g. in Awake or OnEnable.
   */
  void disableNativeArEngine(bool isDisabled);

  // Awake is called first at app startup.
  void awake(JNIEnv *env, jobject context);

  void onEnable();

  // Start is called after OnEnable, but it is only called once for a given script, while OnEnable
  // is called after every call to OnDisable.
  void start();

  void update();

  /*
  void OnGUI();
  */

  void onApplicationPause(bool isPaused);

  void onDisable();

  void onDestroy();

  void onApplicationQuit();

  void renderFrameForDisplay();

  /*
  private bool ShouldIssuePluginEvent();

  private IEnumerator CallPluginAtEndOfFrames();

  private bool EnableRemote();
  */

private:
  XrControllerPrivateData *this_;

  int renderingSystem();
  void setEngineMode();
};

}  // namespace c8

#endif  // ANDROID
