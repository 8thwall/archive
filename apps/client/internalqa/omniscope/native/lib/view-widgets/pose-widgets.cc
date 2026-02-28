// Copyright (c) 2022 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "pose-widgets.h",
  };
  deps = {
    "//c8:hmatrix",
    "//c8/geometry:face-types",
    "//c8/geometry:facemesh-data",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
    "//c8/pixels/render:object8",
    "//c8/pixels:draw2",
    "//c8/pixels:draw3-widgets",
    "//c8/pixels:pixel-buffer",
    "//c8/string:containers",
    "//reality/engine/ears:ear-types",
    "//reality/engine/faces:face-geometry",
    "//reality/engine/hands:hand-types",
    "//reality/engine/hands:handmesh-data",
  };
  visibility = {
    "//apps/client/internalqa/omniscope:__subpackages__",
  };
}
cc_end(0xab6f4f91);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/pose-widgets.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/facemesh-data.h"
#include "c8/geometry/intrinsics.h"
#include "c8/hmatrix.h"
#include "c8/pixels/draw2.h"
#include "c8/pixels/draw3-widgets.h"
#include "c8/string/containers.h"
#include "reality/engine/faces/face-geometry.h"
#include "reality/engine/hands/handmesh-data.h"

namespace c8 {

namespace {

HMatrix handAnchorMatrix(const HandAnchorTransform &t) {
  return HMatrixGen::translation(t.position.x(), t.position.y(), t.position.z())
    * t.rotation.toRotationMat() * HMatrixGen::scale(t.scale, t.scale, t.scale);
}

void addDetection(Object8 *root, Vector<Group *> *detections) {
  auto &g = root->add(ObGen::named(ObGen::group(), format("detection-%d", detections->size())));
  g.add(ObGen::named(ObGen::pixelLines(), "bounding-box"));
  g.add(ObGen::named(ObGen::pixelLines(), "extended-bounding-box"));
  g.add(ObGen::named(ObGen::pixelPoints(), "feature-points"));
  detections->push_back(&g);
}

void addFaceMesh(Object8 *root, Vector<Group *> *faces, const FaceMeshGeometryConfig &config) {
  faces->push_back(&root->add(ObGen::named(ObGen::group(), format("face-%d", faces->size()))));

  auto geo = GeoGen::empty();
  geo->setVertices(FACEMESH_SAMPLE_VERTICES);
  geo->setNormals(CANONICAL_VERTEX_NORMALS);
  geo->setTriangles(meshIndicesFromMeshGeometry(config));
  geo->setUvs(map<UV, HVector2>(FACEMESH_UVS, [](const UV &uv) { return HVector2{uv.u, uv.v}; }));
  geo->setColor(Color::LIGHT_PURPLE);

  faces->back()
    ->add(ObGen::named(ObGen::renderable(), "facemesh"))
    .setKind(Renderable::MESH)
    .setGeometry(std::move(geo))
    .setMaterial(MatGen::physical());

  ObGen::setTransparent(faces->back()->find<Renderable>("facemesh"), 0.67f);
  faces->back()->find<Renderable>("facemesh").material().setRenderSide(RenderSide::FRONT);
}

void addEarMesh(Object8 *root, Vector<Group *> *ears, const EarGeometryConfig &config) {
  ears->push_back(&root->add(ObGen::named(ObGen::group(), format("ears-%d", ears->size()))));

  // draw key points and lines
  ears->back()->add(ObGen::named(ObGen::pointCloud({}, config.earPointSize), "ear-pts"));
}

void addHandMesh(const Hand3d &hand, Object8 *root, Vector<Group *> *hands) {
  hands->push_back(&root->add(ObGen::named(ObGen::group(), format("hand-%d", hands->size()))));

  const bool isHandInMeshMode = (hand.vertices.size() >= HANDMESH_R_VERTEX_COUNT);

  auto geo = GeoGen::empty();
  auto wristGeo = GeoGen::empty();
  if (isHandInMeshMode) {
    geo->setVertices(HANDMESH_R_SAMPLE_VERTICES);
    geo->setNormals(HANDMESH_R_SAMPLE_NORMALS);
    geo->setTriangles(HANDMESH_R_INDICES);

    wristGeo->setVertices(ARMMESH_VERTICES);
    wristGeo->setNormals(ARMMESH_NORMALS);
    wristGeo->setTriangles(ARMMESH_INDICES);

    hands->back()->add(
      ObGen::named(orientedPoint({}, {}, 0.05f, {}, .02f), "attachment-ringLower"));

    hands->back()->add(
      ObGen::named(orientedPoint({}, {}, 0.05f, {}, .02f), "attachment-wrist-top"));
    hands->back()->add(ObGen::named(
      orientedPoint({}, {}, 0.05f, {Color::CHERRY, Color::DARK_BLUE, Color::MINT}, .02f),
      "attachment-wrist-bottom"));
    hands->back()->add(ObGen::named(
      orientedPoint({}, {}, 0.05f, {Color::CHERRY, Color::DARK_GREEN, Color::MINT}, .02f),
      "attachment-wrist-inner"));
    hands->back()->add(ObGen::named(
      orientedPoint({}, {}, 0.05f, {Color::CHERRY, Color::ORANGE, Color::MINT}, .02f),
      "attachment-wrist-outer"));

  } else {
    // placeholder for hand landmark vertices
    geo->setVertices(HANDMESH_SAMPLE_VERTICES);
    wristGeo->setVertices(ARMMESH_VERTICES);
    // add bar cloud for hand joints detection
    hands->back()->add(ObGen::barCloud({}, Color::BLUE, .02));  // named: "bar-cloud"
  }
  geo->setColor(Color::LIGHT_PURPLE);
  wristGeo->setColor(Color::BLUEBERRY);

  hands->back()
    ->add(ObGen::named(ObGen::renderable(), "handmesh"))
    .setKind(Renderable::MESH)
    .setGeometry(std::move(geo))
    .setMaterial(MatGen::physical());
  ObGen::setTransparent(hands->back()->find<Renderable>("handmesh"), 0.27f);
  hands->back()->find<Renderable>("handmesh").material().setRenderSide(RenderSide::BOTH);

  hands->back()
    ->add(ObGen::named(ObGen::renderable(), "wristmesh"))
    .setKind(Renderable::MESH)
    .setGeometry(std::move(wristGeo))
    .setMaterial(MatGen::physical());
  ObGen::setTransparent(hands->back()->find<Renderable>("wristmesh"), 0.5f);
  hands->back()->find<Renderable>("wristmesh").material().setRenderSide(RenderSide::BOTH);

  // draw key points and lines
  const float pointSize = isHandInMeshMode ? 0.002f : 0.01f;
  hands->back()
    ->add(ObGen::named(ObGen::pointCloud({}, pointSize), "finger-joints"))
    .setEnabled(false);
  hands->back()
    ->add(ObGen::named(ObGen::pointCloud({}, pointSize * 2), "wrist-mesh-vertices"))
    .setEnabled(false);
  hands->back()->add(ObGen::named(ObGen::pointCloud({}, pointSize * 2), "wrist-mesh-landmarks"));

  // if there are 2D landmark data and 3D joints data
  if (hand.vertices.size() > HANDMESH_R_VERTEX_COUNT) {
    const float localPtSize = 0.01f;
    hands->back()
      ->add(ObGen::named(ObGen::pointCloud({}, localPtSize), "hand-landmarks"))
      .setEnabled(false);
    hands->back()
      ->add(ObGen::named(ObGen::pointCloud({}, localPtSize), "hand-ref-joints"))
      .setEnabled(false);
    hands->back()->add(ObGen::named(ObGen::pointCloud({}, localPtSize), "wrist-landmarks"));
  }

  hands->back()
    ->add(ObGen::named(orientedPoint({}, {}, 0.05f, {}, .2f), "attachment-wrist"))
    .setEnabled(false);
}

}  // namespace

void initRoiAndCameraScene(Scene *scene, c8_PixelPinholeCameraModel deviceK, int viewHeight) {
  float scale = static_cast<float>(viewHeight) / deviceK.pixelsHeight;

  int capWidth = deviceK.pixelsWidth * scale;
  int capHeight = viewHeight;  // This is captureHeight * scale, but more numerically stable.
  int viewWidth = capHeight + capWidth;

  ///////////// Roi View Setup: Shows the GPU-produced ROI texture //////////////
  auto &roiScene = scene->add(ObGen::subScene("roi-view", {{capHeight, capHeight}}));

  roiScene.add(ObGen::positioned(ObGen::named(ObGen::backQuad(), "roi"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  roiScene.add(ObGen::pixelCamera(capHeight, capHeight));

  ///////////// Camera View Setup: Shows the camera feed and a 1st person view //////////////

  auto &cameraScene = scene->add(ObGen::subScene("camera-view", {{capWidth, capHeight}}));

  // Create a scene camera with field of view matched to the device. This will be updated on every
  // frame to match the camera's real position.
  cameraScene.add(ObGen::perspectiveCamera(deviceK, capWidth, capHeight));

  // Add the background camera feed. This needs to have y inverted because the input texture was
  // inverted.
  cameraScene
    .add(
      ObGen::positioned(ObGen::named(ObGen::backQuad(), "camerafeed"), HMatrixGen::scaleY(-1.0f)))
    .setMaterial(MatGen::image());

  cameraScene.add(ObGen::ambientLight(Color::WHITE, 0.7f));
  cameraScene.add(ObGen::pointLight(Color::WHITE, 0.7f));

  ///////////// Composite View Setup: Set up the layout for both subscenes //////////////

  // Set the default renderSpec on the root scene
  scene->setRenderSpecs({{viewWidth, capHeight}});

  // Add a pixel camera which works with vertices in pixel space. For omniscope, this must have
  // flipY() applied.
  scene->add(ObGen::pixelCamera(viewWidth, capHeight)).flipY();

  // Render the roi view to a quad on the left.
  scene->add(ObGen::named(ObGen::pixelQuad(0, 0, capHeight, capHeight), "roi-view-render"))
    .setMaterial(MatGen::subsceneMaterial("roi-view"));

  // Render the camera view to a quad on the right third.
  scene
    ->add(ObGen::named(ObGen::pixelQuad(capHeight, 0, capWidth, capHeight), "camera-view-render"))
    .setMaterial(MatGen::subsceneMaterial("camera-view"));
}

void updateDetections(
  const Vector<DetectedRayPoints> &detections,
  Object8 *root,
  Vector<Group *> *detectionGroups,
  float pixelsSize,
  bool skipPoints,
  Color pointColor) {
  while (detectionGroups->size() < detections.size()) {
    addDetection(root, detectionGroups);
  }
  for (int i = 0; i < detectionGroups->size(); ++i) {
    auto &g = *(*detectionGroups)[i];
    if (i >= detections.size()) {
      g.setEnabled(false);
      continue;
    }
    g.setEnabled(true);
    const auto &d = detections[i];
    auto k = HMatrixGen::intrinsic(d.intrinsics);
    auto &box = g.find<Renderable>("bounding-box");
    auto ul = (k * d.boundingBox.upperLeft.extrude()).flatten();
    auto ur = (k * d.boundingBox.upperRight.extrude()).flatten();
    auto lr = (k * d.boundingBox.lowerRight.extrude()).flatten();
    auto ll = (k * d.boundingBox.lowerLeft.extrude()).flatten();

    Vector<std::pair<HPoint2, HPoint2>> lines = {{ul, ur}, {ur, lr}, {lr, ll}, {ll, ul}};
    ObGen::updatePixelLines(
      &box, lines, Color::CHERRY, d.intrinsics.pixelsWidth, d.intrinsics.pixelsHeight);

    // update the extendedBoundingBox
    if (d.extendedBoundingBox.height() > 0.0f && d.extendedBoundingBox.width() > 0.0f) {
      auto &extBbox = g.find<Renderable>("extended-bounding-box");
      auto &eBox = d.extendedBoundingBox;
      auto exul = (k * eBox.upperLeft.extrude()).flatten();
      auto exur = (k * eBox.upperRight.extrude()).flatten();
      auto exlr = (k * eBox.lowerRight.extrude()).flatten();
      auto exll = (k * eBox.lowerLeft.extrude()).flatten();

      Vector<std::pair<HPoint2, HPoint2>> exLines = {
        {exul, exur}, {exur, exlr}, {exlr, exll}, {exll, exul}};
      ObGen::updatePixelLines(
        &extBbox, exLines, Color::BLUE, d.intrinsics.pixelsWidth, d.intrinsics.pixelsHeight);
    }

    if (skipPoints) {
      continue;
    }

    Vector<HPoint2> featurePts;
    for (const auto &pt : d.points) {
      featurePts.push_back((k * HPoint3{pt.x(), pt.y(), 1.0f}).flatten());
    }

    auto &points = g.find<Renderable>("feature-points");

    Vector<Color> colors{featurePts.size(), pointColor};

    ObGen::updatePixelPoints(
      &points, featurePts, colors, d.intrinsics.pixelsWidth, d.intrinsics.pixelsHeight, pixelsSize);
  }
}

void updateFaceMeshes(
  const Vector<Face3d> &faces,
  Object8 *root,
  Vector<Group *> *faceGroups,
  const FaceMeshGeometryConfig &config) {
  while (faceGroups->size() < faces.size()) {
    addFaceMesh(root, faceGroups, config);
  }
  for (int i = 0; i < faceGroups->size(); ++i) {
    auto &g = *(*faceGroups)[i];
    if (i >= faces.size()) {
      g.setEnabled(false);
      continue;
    }
    g.setEnabled(true);
    const auto &faceTransform = faces[i].transform;
    g.setLocal(trsMat(faceTransform.position, faceTransform.rotation, faceTransform.scale));

    g.find<Renderable>("facemesh")
      .geometry()
      .setVertices(faces[i].vertices)
      .setNormals(faces[i].normals)
      .setTriangles(meshIndicesFromMeshGeometry(config));
  }
}

void updateEars(
  const Vector<Ear3d> &ears,
  Object8 *root,
  Vector<Group *> *meshGroups,
  const EarGeometryConfig &config) {
  while (meshGroups->size() < ears.size()) {
    addEarMesh(root, meshGroups, config);
  }

  for (size_t i = 0; i < meshGroups->size(); ++i) {
    auto &g = *(*meshGroups)[i];
    if (i >= ears.size()) {
      g.setEnabled(false);
      continue;
    }
    if (ears[i].leftVertices.empty() && ears[i].rightVertices.empty()) {
      continue;
    }

    g.setEnabled(config.showVertices);
    const auto &ear = ears[i];
    const auto &earTransform = ear.transform;
    g.setLocal(trsMat(earTransform.position, earTransform.rotation, earTransform.scale));

    // mesh point clouds
    auto &pc = g.find<Renderable>("ear-pts");
    Vector<HPoint3> earVerts;
    if (config.showVerticesVisibleOnly) {
      // show only visible vertices
      for (size_t i = 0; i < ear.leftVertices.size(); ++i) {
        if (isEarVertexVisible(ear.leftVisibilities[i])) {
          earVerts.push_back(ear.leftVertices[i]);
        }
      }
      for (size_t i = 0; i < ear.rightVertices.size(); ++i) {
        if (isEarVertexVisible(ear.rightVisibilities[i])) {
          earVerts.push_back(ear.rightVertices[i]);
        }
      }
    } else {
      // show all points
      earVerts = ear.leftVertices;
      earVerts.insert(earVerts.end(), ear.rightVertices.begin(), ear.rightVertices.end());
    }

    ObGen::updatePointCloud(&pc, earVerts, Color::LIGHT_PURPLE);
  }
}

void updateHandMeshes(
  const Vector<Hand3d> &hands,
  Object8 *root,
  Vector<Group *> *handGroups,
  c8_PixelPinholeCameraModel intrinsics,
  RGBA8888PlanePixelBuffer &wristLandmarkMatchesPixBuf) {
  int handId = 0;
  while (handGroups->size() < hands.size()) {
    addHandMesh(hands[handId], root, handGroups);
    ++handId;
  }

  for (int i = 0; i < handGroups->size(); ++i) {
    auto &g = *(*handGroups)[i];
    if (i >= hands.size()) {
      g.setEnabled(false);
      continue;
    }
    if (hands[i].vertices.empty()) {
      continue;
    }

    g.setEnabled(true);
    const auto &handTransform = hands[i].transform;
    g.setLocal(trsMat(handTransform.position, handTransform.rotation, handTransform.scale));

    const bool isHandMesh = (hands[i].vertices.size() >= HANDMESH_R_VERTEX_COUNT);
    const int numKeyPoints = getHandMeshModelKeyPointCount();
    const int numWristKeyPoints = getWristMeshModelKeyPointCount();

    Vector<HPoint3> meshVerts;
    Vector<HVector3> meshNormals;
    Vector<HPoint3> landmarkVerts;
    Vector<HPoint3> jointVerts;
    Vector<HPoint3> wristLandmarkVerts;
    HMatrix wristPose = HMatrixGen::i();
    HMatrix anchorTransform = HMatrixGen::i();
    int handKind;
    if (isHandMesh) {
      // Obtain hand mesh tracking for visualization.
      meshVerts.reserve(HANDMESH_R_VERTEX_COUNT);
      meshNormals.reserve(HANDMESH_R_VERTEX_COUNT);
      for (int k = 0; k < HANDMESH_R_VERTEX_COUNT; ++k) {
        meshVerts.push_back(hands[i].vertices[k]);
        meshNormals.push_back(hands[i].normals[k]);
      }

      landmarkVerts.reserve(numKeyPoints);
      jointVerts.reserve(numKeyPoints);
      for (int k = 0; k < numKeyPoints; ++k) {
        landmarkVerts.push_back(hands[i].vertices[HANDMESH_R_UV_VERTEX_COUNT + k]);
      }
      for (int k = 0; k < numKeyPoints; ++k) {
        jointVerts.push_back(hands[i].vertices[HANDMESH_R_UV_VERTEX_COUNT + numKeyPoints + k]);
      }

      // Obtain wrist mesh tracking for visualization.
      wristLandmarkVerts.reserve(numWristKeyPoints);
      for (int k = 0; k < numWristKeyPoints; ++k) {
        wristLandmarkVerts.push_back(hands[i].wristVertices[k]);
      }

      // Render attachment points orientations.
      const HandAttachmentPoint &apWrist = hands[i].attachmentPoints[HANDLANDMARK_WRIST];
      HMatrix wristTransM = trsMat(apWrist.position, apWrist.rotation, 0.03f);
      auto &wristPt = g.find<Group>("attachment-wrist");
      wristPt.setLocal(wristTransM);

      const HandAttachmentPoint &apRingLower =
        hands[i].attachmentPoints[HAND_LANDMARK_EXTRA_BONE_RING_LOWER];
      HMatrix ringLowerTransM = trsMat(apRingLower.position, apRingLower.rotation, 0.03f);
      auto &ringLowerPt = g.find<Group>("attachment-ringLower");
      ringLowerPt.setLocal(ringLowerTransM);

      if (!hands[i].wristAttachmentPoints.empty()) {
        const HandAttachmentPoint &apWristTop = hands[i].wristAttachmentPoints[0];
        HMatrix wristTopTransM = trsMat(apWristTop.position, apWristTop.rotation, 0.03f);
        auto &wristTopPt = g.find<Group>("attachment-wrist-top");
        wristTopPt.setLocal(wristTopTransM);

        const HandAttachmentPoint &apWristBottom = hands[i].wristAttachmentPoints[1];
        HMatrix wristBottomTransM = trsMat(apWristBottom.position, apWristBottom.rotation, 0.03f);
        auto &wristBottomPt = g.find<Group>("attachment-wrist-bottom");
        wristBottomPt.setLocal(wristBottomTransM);

        const HandAttachmentPoint &apWristInner = hands[i].wristAttachmentPoints[2];
        HMatrix wristInnerTransM = trsMat(apWristInner.position, apWristInner.rotation, 0.03f);
        auto &wristInnerPt = g.find<Group>("attachment-wrist-inner");
        wristInnerPt.setLocal(wristInnerTransM);

        const HandAttachmentPoint &apWristOuter = hands[i].wristAttachmentPoints[3];
        HMatrix wristOuterTransM = trsMat(apWristOuter.position, apWristOuter.rotation, 0.03f);
        auto &wristOuterPt = g.find<Group>("attachment-wrist-outer");
        wristOuterPt.setLocal(wristOuterTransM);
      }

      anchorTransform = handAnchorMatrix(hands[i].transform);
      wristPose = hands[i].wristTransform;
      handKind = hands[i].handKind;
    } else {
      meshVerts = hands[i].vertices;
      meshNormals = hands[i].normals;
    }

    // hand mesh rendering
    auto &meshObj = g.find<Renderable>("handmesh");
    meshObj.geometry().setVertices(meshVerts).setNormals(meshNormals);

    // wrist mesh rendering
    auto &wristMeshObj = g.find<Renderable>("wristmesh");
    wristMeshObj.setLocal(wristPose);

    // mesh point clouds
    auto &pc = g.find<Renderable>("finger-joints");
    ObGen::updatePointCloud(&pc, meshVerts, Color::BLUEBERRY);

    // wrist point clouds
    auto &wristPc = g.find<Renderable>("wrist-mesh-vertices");
    ObGen::updatePointCloud(
      &wristPc, wristPose * wristMeshObj.geometry().vertices(), Color::DARK_MATCHA);

    // landmark point cloud
    if (!landmarkVerts.empty()) {
      auto &lmkPC = g.find<Renderable>("hand-landmarks");
      ObGen::updatePointCloud(&lmkPC, landmarkVerts, Color::RED);
    }

    // joint point cloud
    if (!jointVerts.empty()) {
      auto &refPC = g.find<Renderable>("hand-ref-joints");
      ObGen::updatePointCloud(&refPC, jointVerts, Color::YELLOW);
    }

    // wrist mesh landmark
    Vector<HPoint3> wristMeshLandmarks;
    wristMeshLandmarks.reserve(numWristKeyPoints);
    for (auto i : ARM_KEYPOINT_INDICES) {
      wristMeshLandmarks.push_back(wristPose * wristMeshObj.geometry().vertices()[i]);
    }
    auto &wristMeshLandPC = g.find<Renderable>("wrist-mesh-landmarks");
    ObGen::updatePointCloud(&wristMeshLandPC, wristMeshLandmarks, Color::PURPLE);

    // wrist point cloud
    if (!wristLandmarkVerts.empty()) {
      auto &refPC = g.find<Renderable>("wrist-landmarks");
      ObGen::updatePointCloud(&refPC, wristLandmarkVerts, Color::VIBRANT_BLUE);

      // To visualize the matches between landmark and transformed mesh landmarks.
      if (
        (wristLandmarkMatchesPixBuf.pixels().rows() > 0)
        && (wristLandmarkMatchesPixBuf.pixels().cols() > 0)) {
        drawWristLandmarkMatches(
          anchorTransform * wristLandmarkVerts,
          anchorTransform * wristMeshLandmarks,
          HMatrixGen::intrinsic(intrinsics),
          wristLandmarkMatchesPixBuf);
      }
    } else {
      fill(Color::DUSTY_VIOLET.alpha(0), wristLandmarkMatchesPixBuf.pixels());
    }

    // Render bars connecting the landmarks
    if (!isHandMesh) {
      // bar clouds
      auto &bc = g.find<Renderable>("bar-cloud");
      Vector<std::pair<HPoint3, HPoint3>> bars(HANDMESH_FINGER_INDICES.size() + 12);
      for (size_t k = 0; k < HANDMESH_FINGER_INDICES.size(); ++k) {
        bars.push_back(
          {hands[i].vertices[HANDMESH_FINGER_INDICES[k].first],
           hands[i].vertices[HANDMESH_FINGER_INDICES[k].second]});
      }

      ObGen::updateBarCloud(&bc, bars, Color::CHERRY, 0.02);
    }
  }
}

void updateHandMeshes(
  const Vector<Hand3d> &hands,
  Object8 *root,
  Vector<Group *> *handGroups,
  c8_PixelPinholeCameraModel intrinsics) {
  // Empty buffer if we're not drawing wrist landmark matches.
  RGBA8888PlanePixelBuffer wristLandmarkMatchesPixBuf;
  updateHandMeshes(hands, root, handGroups, intrinsics, wristLandmarkMatchesPixBuf);
}

void drawWristLandmarkMatches(
  Vector<HPoint3> wristLandmarkVerts,
  Vector<HPoint3> wristMeshLandmarkVerts,
  HMatrix intrinsicsMat,
  RGBA8888PlanePixelBuffer &wristLandmarkMatchesPixBuf) {

  fill(Color::DUSTY_VIOLET.alpha(0), wristLandmarkMatchesPixBuf.pixels());

  const int numWristKeyPoints = getWristMeshModelKeyPointCount();
  auto scaleFactor = 256.f / static_cast<float>(numWristKeyPoints);

  for (auto i = 0; i < numWristKeyPoints; i++) {
    // Convert the points from camera ray space.
    HPoint2 wristLandmarkPoint = (intrinsicsMat * wristLandmarkVerts[i]).flatten();
    HPoint2 wristMeshLandmarkPoint = (intrinsicsMat * wristMeshLandmarkVerts[i]).flatten();

    auto color = Color::turbo((static_cast<float>(i % 256) * scaleFactor) / 256.f);

    putText(
      format("%d", i),
      {wristLandmarkPoint.x() + 1, wristLandmarkPoint.y() + 1},
      color,
      wristLandmarkMatchesPixBuf.pixels());

    drawPoint(
      {wristLandmarkPoint.x(), wristLandmarkPoint.y()},
      2,
      3,
      color,
      wristLandmarkMatchesPixBuf.pixels());
    drawPoint(
      {wristMeshLandmarkPoint.x(), wristMeshLandmarkPoint.y()},
      2,
      3,
      color,
      wristLandmarkMatchesPixBuf.pixels());

    drawLine(
      {wristLandmarkPoint.x(), wristLandmarkPoint.y()},
      {wristMeshLandmarkPoint.x(), wristMeshLandmarkPoint.y()},
      2,
      color,
      wristLandmarkMatchesPixBuf.pixels());
  }
}
}  // namespace c8
