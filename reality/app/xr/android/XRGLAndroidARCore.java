package com.the8thwall.reality.app.xr.android;

import android.content.Context;
import android.media.Image;
import android.os.Handler;
import android.util.Log;
import android.view.Surface;
import com.google.ar.core.AugmentedImage;
import com.google.ar.core.Camera;
import com.google.ar.core.CameraIntrinsics;
import com.google.ar.core.Frame;
import com.google.ar.core.LightEstimate;
import com.google.ar.core.Plane;
import com.google.ar.core.Point;
import com.google.ar.core.PointCloud;
import com.google.ar.core.Pose;
import com.google.ar.core.Trackable;
import com.google.ar.core.TrackingState;
import com.google.ar.core.exceptions.CameraNotAvailableException;
import com.google.ar.core.exceptions.NotYetAvailableException;
import com.google.ar.core.exceptions.SessionPausedException;
import com.google.ar.core.exceptions.UnavailableException;
import com.the8thwall.c8.annotations.Nullable;
import com.the8thwall.c8.io.C8CapnpSerialize;
import com.the8thwall.c8.protolog.api.LogRequest.RealityEngineLogRecordHeader;
import com.the8thwall.reality.app.app.AndroidApp;
import com.the8thwall.reality.app.device.AndroidDeviceInfo;
import com.the8thwall.reality.app.sensors.arcore.ARCoreSensorData;
import com.the8thwall.reality.app.sensors.arcore.GLARCoreSensor;
import com.the8thwall.reality.app.xr.common.ApiLimits;
import com.the8thwall.reality.app.xr.common.XRRequests;
import com.the8thwall.reality.engine.api.Reality.RealityRequest;
import com.the8thwall.reality.engine.api.Reality.XRAppEnvironment;
import com.the8thwall.reality.engine.api.Reality.XRCapabilities;
import com.the8thwall.reality.engine.api.Reality.XRConfiguration;
import com.the8thwall.reality.engine.api.Reality.XREnvironment;
import com.the8thwall.reality.engine.api.base.GeoTypes.Position32f;
import com.the8thwall.reality.engine.api.request.Sensor.ARCoreDetectedImage;
import com.the8thwall.reality.engine.api.request.Sensor.ARCorePlane;
import com.the8thwall.reality.engine.api.request.Sensor.ARCorePoint;
import com.the8thwall.reality.engine.api.request.Sensor.RequestARCore;
import com.the8thwall.reality.engine.api.request.Sensor.RequestARCore.ARCoreTrackingState;
import java.nio.ByteBuffer;
import java.nio.FloatBuffer;
import java.nio.IntBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import org.capnproto.MessageBuilder;
import org.capnproto.PrimitiveList;
import org.capnproto.ReaderOptions;
import org.capnproto.StructList;

/**
 * An {@link XRGLAndroidInterface} implementation using ARCore.
 */
public class XRGLAndroidARCore extends XRGLAndroidDriver implements GLARCoreSensor.FrameProcessor {

  private static final String TAG = "8thWallJava";

  private final Context context_;

  private long lastFrameTimestampNs_;
  private XRConfiguration.Reader xRConfig_;
  boolean hasLoggedIMUOffset_ = false;

  /**
   * We provide a Unity API, XRController#requestAndroidCameraPermissions, which will allow
   * our Unity SDK to automatically request camera permissions when necessary. This is currently
   * done on Unity's #Awake() lifecycle event. In order to ensure that camera permissions have been
   * granted before creating an ARCore Session, we need to ensure that the {@link GLARCoreSensor}
   * is not created until the #resume() lifecycle event.
   */
  private @Nullable GLARCoreSensor aRCoreSensor_;
  private ArrayList<XRConfiguration.Reader> pendingConfigs_ = new ArrayList<>();

  /**
   * Follows the logic of device-pose xrRotationFromARCoreRotationWhileTracking and
   * xrPositionFromARCorePositionWhileTracking to convert ARCore pose data into 8thWall poses.
   * In other words, it's converting the pose from right-handed to left-handed coordinate systems.
   * @param pose the ARCore pose that will be converted into 8thWall coordinate system.
   */
  Pose arcoreTo8thWall(Pose pose) {
    float[] t = new float[] {pose.tx(), pose.ty(), -pose.tz()};
    // Note that 8thWall's quaternion order is {w, x, y, z} but ARCore is {x, y, z, w}.
    float[] r = new float[] {-pose.qx(), -pose.qy(), pose.qz(), pose.qw()};
    return new Pose(t, r);
  }

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[XRGLAndroidARCore] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  /**
   * Creates an {@link XRGLAndroidARCore} if the current device supports ARCore.
   */
  public static XRGLAndroidARCore create(Context context, XRGLAndroid xr) {
    logD("create");
    return new XRGLAndroidARCore(context, xr);
  }

  private XRGLAndroidARCore(Context context, XRGLAndroid xr) {
    super(xr);
    context_ = context;
    xRConfig_ = new MessageBuilder().initRoot(XRConfiguration.factory).asReader();
  }

  private void initARCoreSensor() {
    if (aRCoreSensor_ == null) {
      aRCoreSensor_ = GLARCoreSensor.create(context_);
      aRCoreSensor_.setFrameProcessor(this);
      for (XRConfiguration.Reader config : pendingConfigs_) {
        aRCoreSensor_.configure(config);
      }
      pendingConfigs_.clear();
    }
  }

  @Override
  public void resume() {
    logD("resume");
    initARCoreSensor();
    aRCoreSensor_.resume();
  }

  @Override
  public void pause() {
    logD("pause");
    if (aRCoreSensor_ != null) {
      aRCoreSensor_.pause();
    }
  }

  @Override
  public void destroy() {
    logD("destroy");
    if (aRCoreSensor_ != null) {
      aRCoreSensor_.destroy();
    }
  }

  @Override
  public void configure(XRConfiguration.Reader config) {
    if (config.hasMask()) {
      xRConfig_ = config;
    }
    if (aRCoreSensor_ != null) {
      aRCoreSensor_.configure(config);
    } else {
      pendingConfigs_.add(config);
    }
  }

  public static void exportXREnvironment(XREnvironment.Builder builder) {
    builder.setRealityImageWidth(GLARCoreSensor.DEFAULT_IMAGE_WIDTH);
    builder.setRealityImageHeight(GLARCoreSensor.DEFAULT_IMAGE_HEIGHT);
    builder.setRealityImageShader(XREnvironment.ImageShaderKind.STANDARD_RGBA);

    builder.getCapabilities().setPositionTracking(
      XRCapabilities.PositionalTrackingKind.ROTATION_AND_POSITION);
    builder.getCapabilities().setSurfaceEstimation(
      XRCapabilities.SurfaceEstimationKind.HORIZONTAL_AND_VERTICAL);
    builder.getCapabilities().setTargetImageDetection(
      XRCapabilities.TargetImageDetectionKind.FIXED_SIZE_IMAGE_TARGET);

    builder.setARCoreAvailability(XREnvironment.ARCoreAvailability.SUPPORTED_INSTALLED);
  }

  @Override
  public void getXRAppEnvironment(XRAppEnvironment.Builder builder) {}

  @Override
  public void initializeCameraPipeline(int captureWidth, int captureHeight) {
    getXR().initializeCameraPipeline(captureWidth, captureHeight);
  }

  @Override
  public int getCaptureTexture() {
    return getXR().getSourceTexture();
  }

  @Override
  public Handler captureHandler() {
    return getXR().captureHandler();
  }

  @Override
  public Handler processingHandler() {
    return getXR().processingHandler();
  }

  @Override
  public void doCaptureProcessing(ARCoreSensorData data) {
    MessageBuilder requestMessage = new MessageBuilder();
    RealityRequest.Builder requestBuilder = requestMessage.initRoot(RealityRequest.factory);
    requestBuilder.getSensors().initARCore();

    AndroidDeviceInfo.getDefault().exportInfo(requestBuilder.getDeviceInfo());
    if (xRConfig_ != null) {
      requestBuilder.setXRConfiguration(xRConfig_);
    }

    AndroidApp.exportAppContext(requestBuilder.getAppContext(), context_);

    Frame frame = data.frame;
    Camera camera = frame.getCamera();
    requestBuilder.getSensors().getCamera().getCurrentFrame().setTimestampNanos(
      frame.getTimestamp());

    setCameraIntrinsics(camera, requestBuilder);
    setPoseData(camera, requestBuilder);
    setSensorPoseData(camera, frame, requestBuilder);

    RequestARCore.Builder arCoreRequest = requestBuilder.getSensors().getARCore();
    LightEstimate lightEstimate = frame.getLightEstimate();
    if (lightEstimate.getState() == LightEstimate.State.VALID) {
      arCoreRequest.getLightEstimate().setPixelIntensity(lightEstimate.getPixelIntensity());
    }

    setDetectedImages(data, arCoreRequest);
    setPlanes(data, arCoreRequest);
    setPointCloud(frame, arCoreRequest);
    if (xRConfig_ != null && xRConfig_.getCameraConfiguration().getDepthMapping()) {
      setDepthData(frame, arCoreRequest);
    }

    PrimitiveList.Float.Builder projectionMatrixBuilder =
      arCoreRequest.initProjectionMatrix(data.projectionMatrix.length);
    for (int i = 0; i < data.projectionMatrix.length; ++i) {
      projectionMatrixBuilder.set(i, data.projectionMatrix[i]);
    }

    XRGLAndroid.RealityData realityData =
      new XRGLAndroid.RealityData.Builder().setRequestMessage(requestMessage).build();

    // TODO(nb): see if there is something in arcore about sensor orientation that would affect
    // this.
    // TO PORTRAIT:
    // [ 0  1  0  0
    //  -1  0  0  1
    //   0  0  1  0
    //   0  0  0  1]
    float[] mtx = new float[16];
    mtx[1] = -1;
    mtx[4] = 1;
    mtx[10] = 1;
    mtx[13] = 1;
    mtx[15] = 1;

    getXR().processGlAndStageRequest(mtx, realityData);
  }

  @Override
  public void doFrameProcessing() {
    getXR().executeStagedRequest();
  }

  private void setCameraIntrinsics(Camera camera, RealityRequest.Builder requestBuilder) {
    CameraIntrinsics intrinsics = camera.getTextureIntrinsics();

    // We swap the x & y return values for these intrinsics as we expect a portrait image,
    // but these values are given assuming landscape (i.e. unrotated).
    int[] dimensions = intrinsics.getImageDimensions();
    requestBuilder.getSensors().getCamera().getPixelIntrinsics().setPixelsWidth(dimensions[1]);
    requestBuilder.getSensors().getCamera().getPixelIntrinsics().setPixelsHeight(dimensions[0]);

    float[] centerPoint = intrinsics.getPrincipalPoint();
    requestBuilder.getSensors().getCamera().getPixelIntrinsics().setCenterPointX(centerPoint[1]);
    requestBuilder.getSensors().getCamera().getPixelIntrinsics().setCenterPointY(centerPoint[0]);

    float[] focalLength = intrinsics.getFocalLength();
    requestBuilder.getSensors().getCamera().getPixelIntrinsics().setFocalLengthHorizontal(
      focalLength[1]);
    requestBuilder.getSensors().getCamera().getPixelIntrinsics().setFocalLengthVertical(
      focalLength[0]);

    requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setWidth(
      dimensions[1]);
    requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setHeight(
      dimensions[0]);

    requestBuilder.getSensors().getCamera().setSensorOrientation(90);
  }

  private void setPoseData(Camera camera, RealityRequest.Builder requestBuilder) {
    if (camera.getTrackingState() == TrackingState.TRACKING) {
      // This is where we get the measured extrinsic pose from ARCore.
      Pose pose = camera.getDisplayOrientedPose();
      XRRequests.setPosition32f(
        pose.tx(),
        pose.ty(),
        pose.tz(),
        requestBuilder.getSensors().getARCore().getPose().getTranslation());
      XRRequests.setQuaternion32f(
        pose.qw(),
        pose.qx(),
        pose.qy(),
        pose.qz(),
        requestBuilder.getSensors().getARCore().getPose().getRotation());
    }

    switch (camera.getTrackingState()) {
      case TRACKING:
        requestBuilder.getSensors().getARCore().setPoseTrackingState(ARCoreTrackingState.TRACKING);
        break;
      case PAUSED:
        requestBuilder.getSensors().getARCore().setPoseTrackingState(ARCoreTrackingState.PAUSED);
        break;
      case STOPPED:
        requestBuilder.getSensors().getARCore().setPoseTrackingState(ARCoreTrackingState.STOPPED);
        break;
      default:
        // Don't specify tracking state.
        break;
    }
  }

  private void setSensorPoseData(
    Camera camera, Frame frame, RealityRequest.Builder requestBuilder) {
    if (camera.getTrackingState() == TrackingState.TRACKING) {
      Pose imuInWorld = frame.getAndroidSensorPose();

      // Store the imuInWorld in world space.
      XRRequests.setPosition32f(
        imuInWorld.tx(),
        imuInWorld.ty(),
        imuInWorld.tz(),
        requestBuilder.getSensors().getARCore().getImuInWorld().getTranslation());
      XRRequests.setQuaternion32f(
        imuInWorld.qw(),
        imuInWorld.qx(),
        imuInWorld.qy(),
        imuInWorld.qz(),
        requestBuilder.getSensors().getARCore().getImuInWorld().getRotation());

      if (!hasLoggedIMUOffset_) {
        // From the virtual camera position, get the offset of the imu.
        Pose cameraInWorld = camera.getDisplayOrientedPose();
        Pose imuInCam = cameraInWorld.inverse().compose(imuInWorld);
        // Put the offset into 8thWall's coordinate system for quick copy-pasting into
        // imu-offset.cc.
        Pose imuInCam8th = arcoreTo8thWall(imuInCam);

        logD(String.format(
          "cameraInWorld: [%.8fx, %.8fy, %.8fz] | [%.8fw, %.8fx, %.8fy, %.8fz]",
          cameraInWorld.tx(),
          cameraInWorld.ty(),
          cameraInWorld.tz(),
          cameraInWorld.qw(),
          cameraInWorld.qx(),
          cameraInWorld.qy(),
          cameraInWorld.qz()));

        logD(String.format(
          "imuInWorld: [%.8fx, %.8fy, %.8fz] | [%.8fw, %.8fx, %.8fy, %.8fz]",
          imuInWorld.tx(),
          imuInWorld.ty(),
          imuInWorld.tz(),
          imuInWorld.qw(),
          imuInWorld.qx(),
          imuInWorld.qy(),
          imuInWorld.qz()));

        logD(String.format(
          "imuInCam: [%.8fx, %.8fy, %.8fz] | [%.8fw, %.8fx, %.8fy, %.8fz]",
          imuInCam.tx(),
          imuInCam.ty(),
          imuInCam.tz(),
          imuInCam.qw(),
          imuInCam.qx(),
          imuInCam.qy(),
          imuInCam.qz()));

        logD(String.format(
          "imuInCam 8thWall: [%.8fx, %.8fy, %.8fz] | [%.8fw, %.8fx, %.8fy, %.8fz]",
          imuInCam8th.tx(),
          imuInCam8th.ty(),
          imuInCam8th.tz(),
          imuInCam8th.qw(),
          imuInCam8th.qx(),
          imuInCam8th.qy(),
          imuInCam8th.qz()));

        logD(String.format(
          "Offset log of %s %s for copy-pasting:\n"
            + "{%.8ff, %.8ff, %.8ff},\n"
            + "{%.8ff, %.8ff, %.8ff, %.8ff}};",
          requestBuilder.getDeviceInfo().getManufacturer(),
          requestBuilder.getDeviceInfo().getModel(),
          imuInCam8th.tx(),
          imuInCam8th.ty(),
          imuInCam8th.tz(),
          imuInCam8th.qw(),
          imuInCam8th.qx(),
          imuInCam8th.qy(),
          imuInCam8th.qz()));

        hasLoggedIMUOffset_ = true;
      }
    }
  }

  private void setDetectedImages(ARCoreSensorData data, RequestARCore.Builder arCoreRequest) {
    if (data.images.isEmpty()) {
      return;
    }

    // Not every provided image could be in a tracking state. Filter out the ones that aren't.
    ArrayList<AugmentedImage> trackedImages = new ArrayList(data.images.size());
    for (AugmentedImage image : data.images) {
      if (image.getTrackingState() == TrackingState.TRACKING) {
        trackedImages.add(image);
      }
    }

    if (trackedImages.isEmpty()) {
      return;
    }

    StructList.Builder<ARCoreDetectedImage.Builder> images =
      arCoreRequest.initDetectedImages(trackedImages.size());
    int i = 0;
    for (AugmentedImage image : trackedImages) {
      ARCoreDetectedImage.Builder imageBuilder = images.get(i);
      Pose centerPose = image.getCenterPose();
      XRRequests.setPosition32f(
        centerPose.tx(),
        centerPose.ty(),
        centerPose.tz(),
        imageBuilder.getCenterPose().getTranslation());
      XRRequests.setQuaternion32f(
        centerPose.qw(),
        centerPose.qx(),
        centerPose.qy(),
        centerPose.qz(),
        imageBuilder.getCenterPose().getRotation());
      XRRequests.setPosition32f(
        image.getExtentX(), 0.0f, image.getExtentZ(), imageBuilder.getExtent());
      imageBuilder.setHash(image.hashCode());
      imageBuilder.setName(image.getName());
      switch (image.getTrackingMethod()) {
        case FULL_TRACKING:
          imageBuilder.setTrackingStatus(ARCoreDetectedImage.TrackingStatus.FULL_TRACKING);
          break;
        case LAST_KNOWN_POSE:
          imageBuilder.setTrackingStatus(ARCoreDetectedImage.TrackingStatus.LAST_KNOWN_POSE);
          break;
        case NOT_TRACKING:
          imageBuilder.setTrackingStatus(ARCoreDetectedImage.TrackingStatus.NOT_TRACKING);
          break;
      }
      ++i;
    }
  }

  private void setPlanes(ARCoreSensorData data, RequestARCore.Builder arCoreRequest) {
    if (!data.planes.isEmpty()) {
      int planesSize = Math.min(data.planes.size(), ApiLimits.MAX_SURFACES);
      StructList.Builder<ARCorePlane.Builder> planes = arCoreRequest.initPlanes(planesSize);

      int i = 0;
      for (Plane plane : data.planes) {
        ARCorePlane.Builder planeBuilder = planes.get(i);
        Pose centerPose = plane.getCenterPose();
        XRRequests.setPosition32f(
          centerPose.tx(),
          centerPose.ty(),
          centerPose.tz(),
          planeBuilder.getCenterPose().getTranslation());
        XRRequests.setQuaternion32f(
          centerPose.qw(),
          centerPose.qx(),
          centerPose.qy(),
          centerPose.qz(),
          planeBuilder.getCenterPose().getRotation());
        XRRequests.setPosition32f(
          plane.getExtentX(), 0, plane.getExtentZ(), planeBuilder.getExtent());
        setPlanePolygon(planeBuilder, plane.getPolygon());
        planeBuilder.setHash(plane.hashCode());

        switch (plane.getType()) {
          case HORIZONTAL_DOWNWARD_FACING:
          case HORIZONTAL_UPWARD_FACING:
            planeBuilder.setAlignment(ARCorePlane.ARCorePlaneAlignment.HORIZONTAL);
            break;
          case VERTICAL:
            planeBuilder.setAlignment(ARCorePlane.ARCorePlaneAlignment.VERTICAL);
            break;
          default:
            planeBuilder.setAlignment(ARCorePlane.ARCorePlaneAlignment.UNSPECIFIED);
            break;
        }

        if (++i == ApiLimits.MAX_SURFACES) {
          break;
        }
      }
    }
  }

  private void setPlanePolygon(ARCorePlane.Builder builder, FloatBuffer buffer) {
    // Buffer contains individual floats, where every 2 floats represents an XZ pair.
    // The number of vertices is half the number of floats (i.e. the number of pairs).
    int numVertices = buffer.remaining() / 2;
    StructList.Builder<Position32f.Builder> vertices = builder.initPolygonVertices(numVertices);

    // ARCore will re-use the same FloatBuffer if the the plane polygon has not changed, and it
    // will not reset the position each time. We must make sure to reset the position after
    // reading the values of this buffer so we know where to start reading on the following frame.
    int initialPosition = buffer.position();

    int i = 0;
    while (buffer.hasRemaining()) {
      Position32f.Builder vertexBuilder = vertices.get(i);
      vertexBuilder.setX(buffer.get());
      vertexBuilder.setZ(buffer.get());
      ++i;
    }

    buffer.position(initialPosition);
  }

  private void setPointCloud(Frame frame, RequestARCore.Builder arCoreRequest) {
    PointCloud pc = frame.acquirePointCloud();
    FloatBuffer pcBuf = pc.getPoints();
    IntBuffer idBuf = pc.getIds();
    int numPcPts = pcBuf.remaining() / 4;
    StructList.Builder<ARCorePoint.Builder> pcBldr = arCoreRequest.initPointCloud(numPcPts);
    int ptn = 0;
    while (pcBuf.hasRemaining()) {
      Position32f.Builder ptBuilder = pcBldr.get(ptn).getPosition();
      ptBuilder.setX(pcBuf.get());
      ptBuilder.setY(pcBuf.get());
      ptBuilder.setZ(pcBuf.get());
      pcBldr.get(ptn).setConfidence(pcBuf.get());
      pcBldr.get(ptn).setId(idBuf.get());
      ++ptn;
    }
    pc.release();
  }

  private void setDepthData(Frame frame, RequestARCore.Builder arCoreRequest) {
    // Retrieve the depth image for the current frame, if available.
    Image depthImage = null;
    try {
      // See https://developers.google.com/ar/reference/java/com/google/ar/core/Frame#acquireDepthImage16Bits-
      depthImage = frame.acquireDepthImage16Bits();
      arCoreRequest.getDepthMap().setCols(depthImage.getWidth());
      arCoreRequest.getDepthMap().setRows(depthImage.getHeight());
      arCoreRequest.getDepthMap().setBytesPerRow(depthImage.getWidth() * 2);
      arCoreRequest.getDepthMap().initUInt16PixelData(
        depthImage.getWidth() * depthImage.getHeight() * 2);
      Image.Plane plane = depthImage.getPlanes()[0];
      int pixSkip = plane.getPixelStride();
      int rowSkip = plane.getRowStride();
      ByteBuffer srcBuf = plane.getBuffer();
      ByteBuffer dstBuf = arCoreRequest.getDepthMap().getUInt16PixelData().asByteBuffer();
      int rowStart = 0;
      for (int i = 0; i < depthImage.getHeight(); ++i) {
        int curr = rowStart;
        for (int j = 0; j < depthImage.getWidth(); ++j) {
          dstBuf.putShort(srcBuf.getShort(curr));
          curr += pixSkip;
        }
        rowStart += rowSkip;
      }
    } catch (Exception e) {
      // NotYetAvailableException	if the number of observed frames is not yet sufficient for
      //   depth estimation; or depth estimation was not possible due to poor lighting, camera
      //   occlusion, or insufficient motion observed.
      // NotTrackingException	if the Session is not in the TrackingState.TRACKING state, which is
      //   required to acquire depth images.
      // IllegalStateException	if a supported depth mode was not enabled in Session configuration.
      // ResourceExhaustedException	if the caller app has exceeded maximum number of depth
      //   images that it can hold without releasing. DeadlineExceededException	if the method is
      //   called on not the current frame.
    } finally {
      if (depthImage != null) {
        depthImage.close();
      }
    }
  }

  @Override
  public RealityEngineLogRecordHeader.EngineType getType() {
    return RealityEngineLogRecordHeader.EngineType.ARCORE;
  }
}
