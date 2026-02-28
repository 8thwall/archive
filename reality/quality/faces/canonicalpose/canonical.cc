// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nathan Waters (nathan@8thwall.com)

/*
 * Loads the face selfies from S3 and averages them to construct a canonical pose
 */
#include "bzl/inliner/rules2.h"

cc_binary {
  data = {
    "//third_party/mediapipe/models:face-detection-front",
    "//third_party/mediapipe/models:face-landmark-attention",
    "//reality/quality/faces/canonicalpose:selfies",
  };
  deps = {
    "//c8:c8-log",
    "//c8:string",
    "//c8/camera:device-infos",
    "//c8/geometry:egomotion",
    "//c8/geometry:facemesh-data",
    "//c8/geometry:intrinsics",
    "//c8/geometry:mesh",
    "//c8/geometry:mesh-types",
    "//c8/io:file-io",
    "//c8/io:image-io",
    "//c8/pixels:draw2",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:gl-pixels",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/pixels/opengl:offscreen-gl-context",
    "//c8/stats:scope-timer",
    "//c8/string:format",
    "//reality/engine/faces:face-detector-local",
    "//reality/engine/faces:face-detector-global",
    "//reality/engine/faces:face-geometry",
    "//reality/engine/faces:face-tracker",
    "//reality/engine/faces:face-roi-renderer",
    "//reality/engine/faces:face-roi-shader",
    "//reality/engine/geometry:bundle",
    "//reality/quality/visualization/render:ui2",
    "@ceres//:ceres",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
  };
}
cc_end(0x4ff948dc);

#include <array>
#include <cstdio>
#include <cstdlib>

#include "c8/c8-log.h"
#include "c8/camera/device-infos.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/geometry/intrinsics.h"
#include "c8/geometry/mesh-types.h"
#include "c8/geometry/mesh.h"
#include "c8/io/file-io.h"
#include "c8/io/image-io.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/gl-pixels.h"
#include "c8/pixels/opengl/offscreen-gl-context.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/pixels/pixels.h"
#include "c8/stats/scope-timer.h"
#include "c8/string.h"
#include "c8/string/format.h"
#include "ceres/ceres.h"
#include "ceres/rotation.h"
#include "reality/engine/faces/face-detector-global.h"
#include "reality/engine/faces/face-detector-local.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/faces/face-roi-renderer.h"
#include "reality/engine/faces/face-roi-shader.h"
#include "reality/engine/faces/face-tracker.h"
#include "reality/engine/geometry/bundle.h"
#include "reality/quality/visualization/render/ui2.h"

using namespace c8;

void visualizeMesh7x7(const Vector<HPoint3> &pts, const Vector<MeshIndices> &indices) {
  RGBA8888PlanePixelBuffer buf(1050, 1050);

  auto intrinsic = Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6);
  auto k200 = HMatrixGen::intrinsic(Intrinsics::cropAndScaleIntrinsics(intrinsic, 200, 200));
  for (int r = 0; r <= 6; r++) {
    for (int c = 0; c <= 6; c++) {
      auto img = crop(buf.pixels(), 150, 150, r * 150, c * 150);
      const auto ydeg = -(c - 3) * 25;
      const auto xdeg = -(r - 3) * 25;
      auto cam = HMatrixGen::i();
      cam = updateWorldPosition(cam, HMatrixGen::yDegrees(180));
      cam = updateWorldPosition(cam, HMatrixGen::yDegrees(ydeg));
      cam = updateWorldPosition(cam, HMatrixGen::xDegrees(xdeg));
      cam = updateWorldPosition(cam, HMatrixGen::translation(0.0f, 0.0f, -2.5f));
      const auto projectedPoints = flatten<2>((k200 * cam.inv() * pts));
      c8::drawMeshAndNormals(pts, indices, 0.1f, k200, cam, 1, img);
    }
  }

  c8::show("Visualizing meshes", buf.pixels());
  c8::waitKey(0);
}

void visualizeMesh(const Vector<HPoint3> &pts, const Vector<MeshIndices> &indices) {
  auto intrinsic = Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6);
  auto K = HMatrixGen::intrinsic(intrinsic);

  auto camera = cameraMotion(HPoint3{0.0f, 0.0f, 2.5f}, {0, 0, 1, 0});

  RGBA8888PlanePixelBuffer buf(intrinsic.pixelsHeight, intrinsic.pixelsWidth);
  auto img = buf.pixels();

  fill(0, 0, 0, 1, &img);

  c8::drawMeshAndNormals(pts, indices, 0.1f, K, camera, 1, img);

  c8::show("Visualizing meshes", img);
  c8::waitKey(0);
}

void visualizeBeforeAndAfter(const Vector<HPoint3> &before, const Vector<HPoint3> &after) {
  RGBA8888PlanePixelBuffer buf(500, 1000);

  auto intrinsic = Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6);
  auto k500 = HMatrixGen::intrinsic(Intrinsics::cropAndScaleIntrinsics(intrinsic, 500, 500));
  auto cam = cameraMotion(HPoint3{0.0f, 0.0f, 2.5f}, {0, 0, 1, 0});

  auto leftSide = crop(buf.pixels(), 500, 500, 0, 0);
  c8::drawMeshAndNormals(before, FACEMESH_INDICES, 0.1f, k500, cam, 1, leftSide);

  auto rightSide = crop(buf.pixels(), 500, 500, 0, 500);
  c8::drawMeshAndNormals(after, FACEMESH_INDICES, 0.1f, k500, cam, 1, rightSide);

  c8::show("Visualizing before and after meshes", buf.pixels());
  c8::waitKey(0);
}

Vector<String> getFilesInDirectory(int argc, char *argv[]) {
  Vector<String> files;

  for (int i = 1; i < argc; i++) {
    files.push_back(argv[i]);
  }

  return files;
}

Vector<uint8_t> loadFaceDetector() {
  const String modelFile = "third_party/mediapipe/models/face_detection_front.tflite";
  return readFile(modelFile);
}

Vector<uint8_t> loadFaceMesher() {
  const String modelFile = "third_party/mediapipe/models/face_landmark_with_attention.tflite";
  return readFile(modelFile);
}

Face3d runFaceDetection(const String &filename) {
  auto im = readImageToRGBA(filename);
  auto pix = im.pixels();

  auto k = Intrinsics::cropAndScaleIntrinsics(
    Intrinsics::getCameraIntrinsics(DeviceInfos::APPLE_IPHONE_6), pix.cols(), pix.rows());

  FaceRoiShader shader;
  shader.initialize();

  FaceRoiRenderer renderer;
  renderer.initialize(&shader, pix.cols(), pix.rows());

  auto srcTexture = readImageToLinearTexture(pix);

  renderer.draw(srcTexture.id(), GpuReadPixelsOptions::DEFER_READ);
  renderer.readPixels();
  auto r = renderer.result();

  FaceTracker::setMaxTrackedFaces(3);
  FaceTracker tracker;
  tracker.setFaceDetectModel(loadFaceDetector());
  tracker.setFaceMeshModel(loadFaceMesher());

  // Run tracking on the first render, which only has a global roi.
  auto result = tracker.track(r, k);

  // Set the detected faces on the renderer and render again to draw the ROIs.
  // We want to use the output of the face mesh to refine the aspect ratio of the face. Run a few
  // times to allow the mesh to settle.
  for (int i = 0; i < 5; ++i) {
    renderer.setDetectedFaces(
      result.localFaces->empty() ? *result.globalFaces : *result.localFaces);
    renderer.draw(srcTexture.id(), GpuReadPixelsOptions::DEFER_READ);
    renderer.readPixels();
    r = renderer.result();
    // Run tracking on the second render, which has local regions of interest.
    result = tracker.track(r, k);
  }

  return result.faceData->at(0);
}

class MinimizeHeadYaw {
public:
  MinimizeHeadYaw(double x, double y, double z) : x_(x), y_(y), z_(z) {}
  virtual ~MinimizeHeadYaw() {}

  template <typename T>
  bool operator()(const T *const rotationD, T *residual) const;

private:
  double x_, y_, z_;
};

template <typename T>
bool MinimizeHeadYaw::operator()(const T *const rotationD, T *residual) const {
  T rotation[9];
  ceres::AngleAxisToRotationMatrix(rotationD, ceres::RowMajorAdapter3x3(rotation));

  auto rotatedX = rotation[0] * x_ + rotation[1] * y_ + rotation[2] * z_;

  residual[0] = rotatedX;

  return true;
}

HMatrix toHMatrix(double *rot) {
  // By default, ceres uses column major for rotation matrices.
  auto r = HMatrix{
    {(float)rot[0], (float)rot[3], (float)rot[6], 0.0f},
    {(float)rot[1], (float)rot[4], (float)rot[7], 0.0f},
    {(float)rot[2], (float)rot[5], (float)rot[8], 0.0f},
    {0.0f, 0.0f, 0.0f, 1.0f},
    {(float)rot[0], (float)rot[1], (float)rot[2], 0.0f},
    {(float)rot[3], (float)rot[4], (float)rot[5], 0.0f},
    {(float)rot[6], (float)rot[7], (float)rot[8], 0.0f},
    {0.0f, 0.0f, 0.0f, 1.0f}};
  return r;
}

bool normalizeMesh(const Vector<HPoint3> &facePoints, HMatrix *transformation) {
  // Create problem
  ceres::Problem problem;

  double rotationD[3];
  rotationD[0] = 0.0;
  rotationD[1] = 0.0;
  rotationD[2] = 0.0;

  const auto middlePoints = getSubset(facePoints, FACE_CENTER_INDICES);

  // This puts the middle points of the face on the y axis.  This fixes any tilting as well as
  // makes the face point directly forward.  This does not mean the head isn't tilted up or down.
  for (const auto &point : middlePoints) {
    ceres::CostFunction *minimize_yaw_cost_function =
      new ceres::AutoDiffCostFunction<MinimizeHeadYaw, 1, 3>(
        new MinimizeHeadYaw(point.x(), point.y(), point.z()));

    problem.AddResidualBlock(minimize_yaw_cost_function, nullptr, rotationD);
  }

  ceres::Solver::Options options;
  options.linear_solver_type = ceres::DENSE_NORMAL_CHOLESKY;
  options.max_num_iterations = 100;
  options.function_tolerance = 1e-10;
  options.gradient_tolerance = 1e-10;
  options.parameter_tolerance = 1e-6;
  options.max_solver_time_in_seconds = 0.2;
  options.logging_type = ceres::PER_MINIMIZER_ITERATION;
  options.minimizer_progress_to_stdout = false;

  ceres::Solver::Summary summary;
  ceres::Solve(options, &problem, &summary);

  double rotationMatrix[9];
  ceres::AngleAxisToRotationMatrix(rotationD, rotationMatrix);

  if (summary.IsSolutionUsable()) {
    *transformation = toHMatrix(rotationMatrix);
  }

  return summary.IsSolutionUsable();
}

// Round to the nearest 0.05.
float rnd(float f) {
  float x20 = std::round(f * 20);
  return x20 / 20;
}

void outputStats(Vector<HPoint3> &vertices) {
  HPoint3 minVal;
  HPoint3 maxVal;
  calculateBoundingCube(vertices, &minVal, &maxVal);

  Vector<HPoint3> leftEyePts{
    vertices[359],
    vertices[446],
    vertices[261],
    vertices[265],
  };

  HPoint3 recCenter{0.5f * (maxVal.x() + minVal.x()), vertices[362].y(), minVal.z()};

  auto radX = std::max(recCenter.x() - minVal.x(), maxVal.x() - recCenter.x());
  auto radY = std::max(recCenter.y() - minVal.y(), maxVal.y() - recCenter.y());
  auto radZ = std::max(recCenter.z() - minVal.z(), maxVal.z() - recCenter.z());

  C8Log(
    "Recommend anchor center: (x: %f, y: %f, z: %f)", recCenter.x(), recCenter.y(), recCenter.z());

  C8Log(
    "Recommend anchor scale: (x: %f, y: %f, z: %f)",
    rnd(radX / radX),
    rnd(radY / radX),
    rnd(radZ / radX));
}

// We rotate each facemesh to best match the reference mesh.  Then we average the rotated points.
// We iteratively repeat this process
Vector<HPoint3> iterativelyAverageMesh(
  const Vector<HPoint3> &referenceMesh, const Vector<Vector<HPoint3>> &faceData) {

  Vector<HPoint3> averagedVertices;
  averagedVertices.resize(faceData[0].size());

  for (const auto &faceVertices : faceData) {

    auto localPose = HMatrixGen::i();

    // by only using a subset of the points, we're able to get ~37x performance boost
    poseEstimationFull3d(
      getPosePointsSubset(faceVertices), getPosePointsSubset(referenceMesh), &localPose);

    const auto rotatedPoints = localPose * faceVertices;

    for (int i = 0; i < faceVertices.size(); i++) {
      averagedVertices[i] = {
        averagedVertices[i].x() + rotatedPoints[i].x(),
        averagedVertices[i].y() + rotatedPoints[i].y(),
        averagedVertices[i].z() + rotatedPoints[i].z(),
      };
    }
  }

  for (int i = 0; i < averagedVertices.size(); i++) {
    averagedVertices[i] = {
      averagedVertices[i].x() / (float)faceData.size(),
      averagedVertices[i].y() / (float)faceData.size(),
      averagedVertices[i].z() / (float)faceData.size(),
    };
  }

  return averagedVertices;
}

/**
 * This function runs facemesh on each image and then averages the output of each.
 */
void computeCanonicalFace(Vector<String> &files) {
  OffscreenGlContext ctx = OffscreenGlContext::createRGBA8888Context();

  ScopeTimer t("face-detect");

  Vector<Vector<HPoint3>> faces;
  faces.reserve(files.size());

  // For each file, run the face detection and get the points in local space.
  for (const auto &file : files) {
    C8Log("Working on %s", file.c_str());
    const Face3d face3d = runFaceDetection(file);

    auto facePoints = face3d.vertices;
    // center the points at the origin
    centerCentroid(&facePoints);

    faces.push_back(facePoints);
  }

  // We rotate each facemesh to best match the reference mesh.  Then we average the rotated points.
  // We iteratively repeat this process.
  Vector<HPoint3> averagedVertices = FACEMESH_SAMPLE_VERTICES;
  for (int i = 0; i < 10; i++) {
    centerCentroid(&averagedVertices);
    averagedVertices = iterativelyAverageMesh(averagedVertices, faces);
  }

  // normalizes the Y and Z rotations of the face
  HMatrix yzRotation = HMatrixGen::i();
  normalizeMesh(averagedVertices, &yzRotation);
  averagedVertices = yzRotation * averagedVertices;

  outputStats(averagedVertices);

  // We apply an offset so that the canonical mesh's position causes the head anchor to be
  // centered at the center of head.  Otherwise, the head transform will be at the centroid of
  // the face which is located closer to the front of the face.
  averagedVertices = HMatrixGen::translation(0.0f, -0.25f, 0.5f) * averagedVertices;

  // visualizeBeforeAndAfter(averagedVertices, FACEMESH_SAMPLE_VERTICES);
  // Take the output and save it in facemesh-data.h as FACEMESH_SAMPLE_VERTICES
  C8Log("\nconst c8::Vector<c8::HPoint3> FACEMESH_SAMPLE_VERTICES = {");
  for (const auto &point : averagedVertices) {
    C8Log("  {%ff, %ff, %ff},", point.x(), point.y(), point.z());
  }
  C8Log("};\n\n");

  Vector<HVector3> canonicalNormals;
  computeVertexNormals(averagedVertices, FACEMESH_INDICES, &canonicalNormals);

  visualizeBeforeAndAfter(averagedVertices, FACEMESH_SAMPLE_VERTICES);

  // Take the output and save it in facemesh-data.h as CANONICAL_VERTEX_NORMALS
  C8Log("\nconst c8::Vector<c8::HVector3> CANONICAL_VERTEX_NORMALS = {");
  for (const auto &norm : canonicalNormals) {
    C8Log("  {%ff, %ff, %ff},", norm.x(), norm.y(), norm.z());
  }
  C8Log("};\n\n");
}

int main(int argc, char *argv[]) {
  if (argc < 3) {
    C8Log(
      "%s",
      "ERROR: Invalid path to selfies dataset.\n"
      "\n"
      "It's unfortunate we have to get the images this way, but <filesystem> is not available "
      "on the Jenkins server.  Therefore, to specify the file paths in the selfies dataset, "
      "you must run the command like this:\n"
      "    bazel run //reality/quality/faces/canonicalpose:canonical -- "
      "${HOME}/repo/code8/reality/quality/faces/canonicalpose/selfies/**\n\n"
      "If you do not have the dataset downloaded, you can run 'bazel run "
      "//reality/quality/datasets:dataset-sync -- --direction=down --dataset=selfies "
      "--local=${HOME}/datasets'"
      "will downlaod the dataset from S3");
    return -1;
  }

  Vector<String> imageFiles = getFilesInDirectory(argc, argv);

  computeCanonicalFace(imageFiles);
}
