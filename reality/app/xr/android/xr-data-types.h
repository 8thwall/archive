// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <array>
#include <string>
#include <vector>

namespace c8 {

namespace xr {

struct Vector2 {
  float x;
  float y;
  constexpr Vector2() : x(0.0f), y(0.0f) {};
  Vector2(Vector2 &&) = default;
  Vector2 &operator=(Vector2 &&) = default;
  Vector2(const Vector2 &) = default;
  Vector2 &operator=(const Vector2 &) = default;
  constexpr Vector2(float x_, float y_) : x(x_), y(y_) {}
};

struct Vector3 {
  float x;
  float y;
  float z;
  constexpr Vector3() : x(0.0f), y(0.0f), z(0.0f) {};
  Vector3(Vector3 &&) = default;
  Vector3 &operator=(Vector3 &&) = default;
  Vector3(const Vector3 &) = default;
  Vector3 &operator=(const Vector3 &) = default;
  constexpr Vector3(float x_, float y_, float z_) : x(x_), y(y_), z(z_) {}
};

struct Quaternion {
  float w;
  float x;
  float y;
  float z;
  constexpr Quaternion(float x_, float y_, float z_, float w_) : w(w_), x(x_), y(y_), z(z_) {}
  Quaternion(Quaternion &&) = default;
  Quaternion &operator=(Quaternion &&) = default;
  Quaternion(const Quaternion &) = default;
  Quaternion &operator=(const Quaternion &) = default;

  constexpr bool equals(Quaternion q) const { return w == q.w && x == q.x && y == q.y && z == q.z; }

  constexpr bool operator==(const Quaternion &b) const { return equals(b); }

  constexpr bool operator!=(const Quaternion &b) const { return !equals(b); }
};

struct Matrix4x4 {
  std::array<float, 16> data;
  // clang-format off
  constexpr Matrix4x4()
      : data{{0.0f, 0.0f, 0.0f, 0.0f,
              0.0f, 0.0f, 0.0f, 0.0f,
              0.0f, 0.0f, 0.0f, 0.0f,
              0.0f, 0.0f, 0.0f, 0.0f}} {};
  // clang-format on
  Matrix4x4(Matrix4x4 &&) = default;
  Matrix4x4 &operator=(Matrix4x4 &&) = default;
  Matrix4x4(const Matrix4x4 &) = delete;
  Matrix4x4 &operator=(const Matrix4x4 &) = delete;

  float &operator()(int r, int c) { return data[c * 4 + r]; }
  const float operator()(int r, int c) const { return data[c * r + r]; }
};

struct Mesh {
  std::vector<Vector3> vertices;
  std::vector<Vector3> normals;
  std::vector<Vector2> uvs;
  std::vector<int> triangles;

  Mesh() {}
  Mesh(Mesh &&) = default;
  Mesh &operator=(Mesh &&) = default;
  Mesh(const Mesh &) = default;
  Mesh &operator=(const Mesh &) = default;
  constexpr bool equals(const Mesh &m) const { return false; }

  constexpr bool operator==(const Mesh &b) const { return equals(b); }

  constexpr bool operator!=(const Mesh &b) const { return !equals(b); }
};

struct Camera {
  float pixelRectWidth;
  float pixelRectHeight;
  float nearClipPlane;
  float farClipPlane;

  constexpr Camera()
      : pixelRectWidth(0.0f), pixelRectHeight(0.0f), nearClipPlane(0.0f), farClipPlane(0.0f) {};

  Camera(Camera &&) = default;
  Camera &operator=(Camera &&) = default;
  Camera(const Camera &) = default;
  Camera &operator=(const Camera &) = default;

  constexpr Camera(
    float pixelRectWidth_, float pixelRectHeight_, float nearClipPlane_, float farClipPlane_)
      : pixelRectWidth(pixelRectWidth_),
        pixelRectHeight(pixelRectHeight_),
        nearClipPlane(nearClipPlane_),
        farClipPlane(farClipPlane_) {}

  constexpr bool equals(Camera m) const {
    return pixelRectWidth == m.pixelRectWidth && pixelRectHeight == m.pixelRectHeight
      && nearClipPlane == m.nearClipPlane && farClipPlane == m.farClipPlane;
  }

  static constexpr Camera NO_CAMERA() { return Camera(); }

  constexpr bool operator==(const Camera &b) const { return equals(b); }

  constexpr bool operator!=(const Camera &b) const { return !equals(b); }
};

struct Texture2D {
  enum TextureFormat {
    UNSPECIFIED_TEXTURE_FORMAT,
    RGBA32,
    R8,
    RG16,
  };
  // TODO(nb): add data.
  int width = 0;
  int height = 0;
  TextureFormat format = TextureFormat::UNSPECIFIED_TEXTURE_FORMAT;
  int64_t texPtr = -1;

  constexpr Texture2D(int width_, int height_, TextureFormat format_, int64_t texPtr_)
      : width(width_), height(height_), format(format_), texPtr(texPtr_) {}

  Texture2D() = default;
  Texture2D(Texture2D &&) = default;
  Texture2D &operator=(Texture2D &&) = default;
  Texture2D(const Texture2D &) = default;
  Texture2D &operator=(const Texture2D &) = default;
};

/**
 * AR capabilities available to a given device based on its native AR engine (e.g. is it using ARKit
 * vs ARCore vs. 8th Wall's Computer Vision technology).
 */
struct Capabilities {
  /**
   * The type of AR position tracking used by the device.
   */
  enum PositionTracking {
    /**
     * Unable to determine the tracking engine used by the device.
     */
    UNSPECIFIED_POSITION_TRACKING,

    /**
     * The device has 6DoF positional and rotational camera tracking, where position is based
     * physically accurate distances (such as the position tracking offered by ARKit and ARCore).
     */
    ROTATION_AND_POSITION,

    /**
     * The device has full 6DoF positional and rotational camera tracking, where position
     * is scaled based on the distance to a horizontal surface in the visual scene.
     */
    ROTATION_AND_POSITION_NO_SCALE
  };

  /**
   * The type of AR surface estimation used by the device.
   */
  enum SurfaceEstimation {
    /**
     *  Unable to determine the surface estimataion engine used by the device.
     */
    UNSPECIFIED_SURFACE_ESTIMATION,

    /**
     * The device is using 8th Wall instant surface placement (Non-ARKit/ARCore).
     */
    FIXED_SURFACES,

    /**
     * The device is using an early version of ARKit/ARCore that only supports detection of
     * horizontal surfaces.
     */
    HORIZONTAL_ONLY,

    /**
     * The device is using a newwer version of ARKit/ARCore that supports detection of both
     * horizontal and vertical surfaces.
     */
    HORIZONTAL_AND_VERTICAL
  };

  /**
   * The type of AR image-target detection used by the device.
   */
  enum TargetImageDetection {
    /**
     *  Unable to determine the image-target detection engine used by the device.
     */
    UNSPECIFIED_TARGET_IMAGE_DETECTION,

    /**
     * The device is running an AR engine that does not support detection of image-targets.
     */
    UNSUPPORTED,

    /**
     * The device is running an AR engine that supports detection of image-targets of a
     * developer-specified, predfined phyisical size in meters.
     */
    FIXED_SIZE_IMAGE_TARGET,
  };

  /**
   * The level of position tracking available to the device.
   */
  const PositionTracking positionTracking;

  /**
   * The level of surface estimation available to the device.
   */
  const SurfaceEstimation surfaceEstimation;

  /**
   * The level of image-target detection available to the device.
   */
  const TargetImageDetection targetImageDetection;

  /**
   * Initializes a new Capabilities struct with a specified positionTracking, surfaceEstimation
   * and targetImageDetection.
   */
  constexpr Capabilities(
    PositionTracking positionTracking_,
    SurfaceEstimation surfaceEstimation_,
    TargetImageDetection targetImageDetection_)
      : positionTracking(positionTracking_),
        surfaceEstimation(surfaceEstimation_),
        targetImageDetection(targetImageDetection_) {}

  /**
   * This is a convience method. Equivalent to calling:
   *
   *   Capabilities.positionTracking == Capabilities.PositionTracking.ROTATION_AND_POSITION;
   *
   * If true, the device has 6DoF positional and rotational camera tracking, where position is
   * based on physically accurate distances (such as the position tracking offered by ARKit and
   * ARCore).
   */
  constexpr bool IsPositionTrackingRotationAndPosition() const {
    return positionTracking == PositionTracking::ROTATION_AND_POSITION;
  }

  /**
   * This is a convience method. Equivalent to calling:
   *
   *   return positionTracking == PositionTracking.ROTATION_AND_POSITION_NO_SCALE;
   *
   * If true, the device has full 6DoF positional and rotational camera tracking, where position
   * is scaled based on the distance to a horizontal surface in the visual scene.
   */
  constexpr bool IsPositionTrackingRotationAndPositionNoScale() const {
    return positionTracking == PositionTracking::ROTATION_AND_POSITION_NO_SCALE;
  }

  /**
   * This is a convience method. Equivalent to calling:
   *
   *   return surfaceEstimation == SurfaceEstimation.FIXED_SURFACES;
   *
   * If true, the device is using 8th Wall instant surface placement (Non-ARKit/ARCore).
   */
  constexpr bool IsSurfaceEstimationFixedSurfaces() const {
    return surfaceEstimation == SurfaceEstimation::FIXED_SURFACES;
  }

  /**
   * This is a convience method. Equivalent to calling:
   *
   *   return surfaceEstimation == SurfaceEstimation.HORIZONTAL_ONLY;
   *
   * If true, the device is using an early version of ARKit/ARCore that only supports detection of
   * horizontal surfaces.
   */
  constexpr bool IsSurfaceEstimationHorizontalOnly() const {
    return surfaceEstimation == SurfaceEstimation::HORIZONTAL_ONLY;
  }

  /**
   * This is a convience method. Equivalent to calling:
   *
   *   return surfaceEstimation == SurfaceEstimation.HORIZONTAL_AND_VERTICAL;
   *
   * If true, the device is using a newwer version of ARKit/ARCore that supports detection of
   * both horizontal and vertical surfaces.
   */
  constexpr bool IsSurfaceEstimationHorizontalAndVertical() const {
    return surfaceEstimation == SurfaceEstimation::HORIZONTAL_AND_VERTICAL;
  }

  /**
   * This is a convience method. Equivalent to calling:
   *
   *   return targetImageDetection == TargetImageDetection.UNSUPPORTED;
   *
   * If true, the device is running an AR engine that does not support detection of image-targets.
   */
  constexpr bool IsTargetImageDetectionUnsupported() const {
    return targetImageDetection == TargetImageDetection::UNSUPPORTED;
  }

  /**
   * This is a convience method. Equivalent to calling:
   *
   *   return targetImageDetection == TargetImageDetection.FIXED_SIZE_IMAGE_TARGET;
   *
   * If true, the device is running an AR engine that supports detection of image-targets of a
   * developer-specified, predfined phyisical size in meters.
   */
  constexpr bool IsTargetImageDetectionFixedSizeImageTarget() const {
    return targetImageDetection == TargetImageDetection::FIXED_SIZE_IMAGE_TARGET;
  }
};

/**
 * Defines the amount that a camera feed texture should be rotated to appear upright in a given
 * app's UI based on the app's orientation (e.g. portrait or landscape right) on the current device.
 */
enum TextureRotation {
  /**
   * Unable to determine the camera feed texture rotation.
   */
  UNSPECIFIED_TEXTURE_ROTATION,

  /**
   * The camera feed texture does not need to be rotated.
   */
  R0,

  /**
   * The camera feed texture should be rotated by 90 degrees.
   */
  R90,

  /**
   * The camera feed texture should be rotated by 180 degrees.
   */
  R180,

  /**
   * The camera feed texture should be rotated by 270 degrees.
   */
  R270
};

/**
 * Indicates the current quality of a device's tracking in the user's current environment.
 */
struct TrackingState {
  /**
   * Indicates the current quality level of tracking.
   */
  enum Status {
    /**
     * Unable to determine tracking quality.
     */
    UNSPECIFIED_STATUS,

    /**
     * Tracking is not currently enabled.
     */
    NOT_AVAILABLE,

    /**
     * Tracking is enabled but its quality is currently low.
     */
    LIMITED,

    /**
     * Tracking is enabled and operating as expected.
     */
    NORMAL
  };

  /**
   * Indicates why tracking is currently limited. Only specified when tracking status is LIMITED.
   */
  enum Reason {
    /**
     * Tracking status is not currently LIMITED, or unable to determine why tracking is LIMITED.
     */
    UNSPECIFIED_REASON,

    /**
     * Tracking is limited because the tracking engine is still starting up.
     */
    INITIALIZING,

    /**
     * Tracking is limited because the tracking engine is unable to determine the device's current
     * location.
     */
    RELOCALIZING,

    /**
     * Tracking is limited because the device is moving too much.
     */
    TOO_MUCH_MOTION,

    /**
     * Tracking is limited because the current camera feed does not contain enough visual
     * information to determine how the device is moving.
     */
    NOT_ENOUGH_TEXTURE
  };

  /**
   * The current quality level of tracking.
   */
  const Status status;

  /**
   * Indicates why tracking is currently limited, if it is currently limited.
   */
  const Reason reason;

  /**
   * Initializes a new TrackingState struct with a specified status and reason.
   */
  constexpr TrackingState(Status status_, Reason reason_) : status(status_), reason(reason_) {}
};

/**
 * A surface detected by an AR surface detection engine.
 */
struct Surface {
  /**
   * Indicates the type of surfaces that was detected.
   */
  enum Type {
    /**
     * Unable to determine the type of surface that was detected.
     */
    UNSPECIFIED,

    /**
     * A flat surface parallel to the ground, e.g. a table or the ground.
     */
    HORIZONTAL_PLANE,

    /**
     * A flat surface perpendicular to the ground, e.g. a wall.
     */
    VERTICAL_PLANE
  };

  /**
   * A unique identifier for this surface that persists across updates.
   */
  int64_t id;

  /**
   * The type of the surface, e.g. horizontal or vertical.
   */
  Type type;

  /**
   * The orientation of this surface. Applying this rotation to GameObjects will rotate them to lie
   * flat on the surface.
   */
  Quaternion rotation;

  /**
   * A mesh that covers the surface.
   */
  Mesh mesh;

  Surface() : id(0), type(Type::UNSPECIFIED), rotation(0.0f, 0.0f, 0.0f, 1.0f), mesh() {}

  /**
   * Initializes a new Surface struct with a specified id, type, rotation and mesh.
   */
  Surface(int64_t id_, Type type_, Quaternion rotation_, Mesh mesh_)
      : id(id_), type(type_), rotation(rotation_), mesh(mesh_) {}

  Surface(Surface &&) = default;
  Surface &operator=(Surface &&) = default;
  Surface(const Surface &) = default;
  Surface &operator=(const Surface &) = default;

  /**
   * A special surface that is returned by surface query APIs when no surface matches the query.
   * Surfaces returend by these APIs can be checked against NO_SURFACE using the == and !=
   * operators.
   */
  inline static Surface NO_SURFACE() { return Surface(); }

  constexpr bool equals(const Surface &s) const {
    return id == s.id && type == s.type && rotation == s.rotation && mesh == s.mesh;
  }
  constexpr bool operator==(const Surface &b) const { return equals(b); }
  constexpr bool operator!=(const Surface &b) const { return !equals(b); }
};

/**
 * The result of a hit test query to estimate the 3D position of a point shown on the device's
 * camera feed.
 */
struct HitTestResult {
  /**
   * The type of data that was used to generate a hit test result.
   */
  enum Type {
    /**
     * Unable to determine how a hit test result was generated.
     */
    UNSPECIFIED,

    /**
     * The location of a hit test result was estimated from nearby feature points.
     */
    FEATURE_POINT,

    /**
     * The location of a hit test result was inferred from the location of a known surfaces, but
     * the AR engine has not yet confirmed that that location is actually a part of a surface.
     */
    ESTIMATED_SURFACE,

    /**
     * The location of a hit test result is within the bounds of a confirmed detected surface.
     */
    DETECTED_SURFACE
  };

  /**
   * The type of data that was used to generate the hit test result.
   */
  const Type type;

  /**
   * The estimated 3d position in the unity scene of the queried point in the unity scene based on
   * the camera feed.
   */
  const Vector3 position;

  /**
   * The estimated 3d rotation of the queried point on the camera feed.
   */
  const Quaternion rotation;

  /**
   * The estimated distance from the device of the queried point on the camera feed.
   */
  const float distance;

  /**
   * Initializes a new HitTestResult struct with a specified type, position, rotation and
   * distance.
   */
  constexpr HitTestResult(Type type_, Vector3 position_, Quaternion rotation_, float distance_)
      : type(type_), position(position_), rotation(rotation_), distance(distance_) {}
};

/**
 * A point in the world detected by an AR engine.
 */
struct WorldPoint {
  /**
   * A unique identifier of this point that persists across frames.
   */
  const int64_t id;

  /**
   * The 3d position of the point in the unity scene.
   */
  const Vector3 position;

  /**
   * Indicates how confident the AR engine is in the location of this point.
   */
  const float confidence;

  /**
   * Initializes a new WorldPoint struct with a specified id, position, and confidence.
   */
  constexpr WorldPoint(int64_t id_, Vector3 position_, float confidence_)
      : id(id_), position(position_), confidence(confidence_) {}
};

/**
 * Source image data for a image-target to detect. This can either be constructed manually, or
 * from a Unity Texture2d.
 */
struct DetectionImage {
  /**
   * Indicates the binary encoding format of a image-target to detect.
   */
  enum Encoding {
    /**
     * Unable to determine the image-target binary encoding.
     */
    UNSPECIFIED_ENCODING,

    /**
     * Pixels are stored in 3-byte RGB values, values ranging from 0-255, ordered by row. The
     * length of imageData should be 3 * widthInPixels * heightInPixels.
     */
    RGB24,

    /**
     * Pixels are stored in 3-byte RGB values, values ranging from 0-255, ordered by row in reverse
     * order (from bottom to top). The length of imageData should be
     * 3 * widthInPixels * heightInPixels.
     */
    RGB24_INVERTED_Y
  };

  /**
   * The width of the source binary image-target, in pixels.
   */
  int widthInPixels = 0.0f;

  /**
   * The height of the source binary image-target, in pixels.
   */
  int heightInPixels = 0.0f;

  /**
   * The expected physical width of the image-target, in meters.
   */
  float targetWidthInMeters = 0.0f;

  /**
   * The encoding of the binary image data.
   */
  Encoding encoding = Encoding::UNSPECIFIED_ENCODING;

  /**
   * The binary data containing the image-target to detect.
   */
  const uint8_t *imageData = nullptr;

  /**
   * Initializes a new DetectionImage struct with a specified widthInPixels, heightInPixels,
   * targetWidthInMeters, encoding, and imageData.
   */
  constexpr DetectionImage(
    int widthInPixels_,
    int heightInPixels_,
    float targetWidthInMeters_,
    Encoding encoding_,
    const uint8_t *imageData_)
      : widthInPixels(widthInPixels_),
        heightInPixels(heightInPixels_),
        targetWidthInMeters(targetWidthInMeters_),
        encoding(encoding_),
        imageData(imageData_) {}

  DetectionImage() = default;
  DetectionImage(DetectionImage &&) = default;
  DetectionImage &operator=(DetectionImage &&) = default;
  DetectionImage(const DetectionImage &) = default;
  DetectionImage &operator=(const DetectionImage &) = default;
};

/**
 * An image-target that was detected by an AR Engine.
 */
struct DetectedImageTarget {
  /**
   * A unique identifier for this detected image-target that is consistent across updates.
   */
  const int64_t id;

  /**
   * The name of the image-target that was provided by the developer on a call to
   * Controller.SetDetectionImages.
   */
  const std::string name;

  /**
   * The position of the center of the image in unity coordinates.
   */
  const Vector3 position;

  /**
   * The orientation of the detected image. The detected image lies in the x/z plane of this
   * rotation.
   */
  const Quaternion rotation;

  /**
   * Width of the detected image-target, in unity units.
   */
  const float width;

  /**
   * Height of the detected image-target, in unity units.
   */
  const float height;

  /**
   * Initializes a DetectedImageTarget from a specified id, name, position, rotation, width, and
   * height.
   */
  DetectedImageTarget(
    int64_t id_,
    const std::string name_,
    Vector3 position_,
    Quaternion rotation_,
    float width_,
    float height_)
      : id(id_),
        name(name_),
        position(position_),
        rotation(rotation_),
        width(width_),
        height(height_) {}
};

}  // namespace xr

}  // namespace c8
