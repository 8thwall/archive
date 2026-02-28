// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "components.h",
  };
  deps = {
    "//c8:exceptions",
    "//c8:hmatrix",
    "//c8:color",
    "//c8:hpoint",
    "//c8:quaternion",
    "//c8:string",
    "//c8:vector",
    "//c8/geometry:egomotion",
    "//c8/geometry:pixel-pinhole-camera-model",
    "//c8/io:capnp-messages",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/protolog:xr-requests",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/quality/visualization/xrom/api:xrom-components.capnp-cc",
    "//reality/quality/visualization/xrom/framework:xrom-client-interface",
  };
}
cc_end(0x951feb7c);

#include "reality/quality/visualization/xrom/drawing/components.h"

#include <utility>
#include "c8/exceptions.h"
#include "c8/color.h"
#include "c8/quaternion.h"
#include "c8/pixels/pixel-buffer.h"
#include "c8/pixels/pixel-transforms.h"
#include "c8/protolog/xr-requests.h"
#include "c8/stats/scope-timer.h"
#include "c8/geometry/egomotion.h"

namespace c8 {

template <>
String componentName<XromPackedLayout> = XROM_COMPONENT_PACKED_LAYOUT;
template <>
String componentName<XromRgbaColorTexture> = XROM_COMPONENT_RGBA_COLOR_TEXTURE;
template <>
String componentName<XromCamera3d> = XROM_COMPONENT_CAMERA;
template <>
String componentName<XromOrigin3d> = XROM_COMPONENT_ORIGIN;
template <>
String componentName<XromPointSet3d> = XROM_COMPONENT_POINT_SET;

MutableRootMessage<XromUpdateNode> setAppLayout(
  const String &userKey,
  const String &appName,
  const Vector<float> &preferredSize,
  const Vector<float> &rowWeights,
  const Vector<Vector<float>> &colWeights) {
  MutableRootMessage<XromUpdateNode> node;
  auto app = appData(node.builder(), userKey, appName);
  setComponent(app.getLayout(), packedLayout(preferredSize, rowWeights, colWeights));
  return node;
}

MutableRootMessage<XromUpdateNode> setSingleViewApp(const String &userKey, const String &appName) {
  MutableRootMessage<XromUpdateNode> node;
  node.builder().getNode().setUserKey(userKey);
  node.builder().getData().getKind().initApp().setName(appName);
  return node;
}

MutableRootMessage<XromUpdateNode> setView3d(
  const String &userKey, const String &viewName, const String &appUserKey) {
  MutableRootMessage<XromUpdateNode> node;
  node.builder().getNode().setUserKey(userKey);
  node.builder().getParent().setUserKey(appUserKey);
  node.builder().getData().getKind().initView3d().setName(viewName);
  return node;
}

MutableRootMessage<XromUpdateNode> setView3d(
  const String &userKey, const String &viewName, const String &appUserKey, const HMatrix &place) {
  auto r = rotation(place);
  auto t = translation(place);
  auto node = setView3d(userKey, viewName, appUserKey);
  auto t1 = node.builder().getData().getKind().getView3d().getCamera().getPlace().getPoint();
  auto r1 = node.builder().getData().getKind().getView3d().getCamera().getPlace().getFacing();
  t1.setX(t.x());
  t1.setY(t.y());
  t1.setZ(t.z());
  r1.setW(r.w());
  r1.setX(r.x());
  r1.setY(r.y());
  r1.setZ(r.z());
  return node;
}

MutableRootMessage<XromUpdateNode> setView3d(
  const String &userKey,
  const String &viewName,
  const String &appUserKey,
  Transform32f::Reader place) {
  auto node = setView3d(userKey, viewName, appUserKey);
  auto t = node.builder().getData().getKind().getView3d().getCamera().getPlace().getPoint();
  auto r = node.builder().getData().getKind().getView3d().getCamera().getPlace().getFacing();
  t.setX(place.getPosition().getX());
  t.setY(place.getPosition().getY());
  t.setZ(place.getPosition().getZ());
  r.setW(place.getRotation().getW());
  r.setX(place.getRotation().getX());
  r.setY(place.getRotation().getY());
  r.setZ(place.getRotation().getZ());
  return node;
}

MutableRootMessage<XromUpdateNode> setView2d(
  const String &userKey,
  const String &viewName,
  const String &appUserKey,
  const ConstRootMessage<XromRgbaColorTexture> &texture) {
  MutableRootMessage<XromUpdateNode> node;
  node.builder().getNode().setUserKey(userKey);
  node.builder().getParent().setUserKey(appUserKey);
  auto view2d = node.builder().getData().getKind().initView2d();
  view2d.setName(viewName);
  setComponent(view2d.getImage(), texture);
  return node;
}

MutableRootMessage<XromUpdateNode> setOrigin(const String &userKey, const String &parentUserKey) {
  MutableRootMessage<XromUpdateNode> node;
  node.builder().getNode().setUserKey(userKey);
  node.builder().getParent().setUserKey(parentUserKey);
  auto thing = node.builder().getData().getKind().initComponent3d();
  ConstRootMessage<XromOrigin3d> cm;
  setComponent(thing.getComponent(), cm);
  return node;
}

MutableRootMessage<XromUpdateNode> setPointSet(
  const String &userKey, const String &parentUserKey, const Vector<HPoint3> &points, Color color) {
  return setPointSet(userKey, parentUserKey, points, color, 1.0f);
}

MutableRootMessage<XromUpdateNode> setPointSet(
  const String &userKey,
  const String &parentUserKey,
  const Vector<HPoint3> &points,
  Color color,
  float radius) {
  MutableRootMessage<XromUpdateNode> node;
  node.builder().getNode().setUserKey(userKey);
  node.builder().getParent().setUserKey(parentUserKey);
  auto thing = node.builder().getData().getKind().initComponent3d();
  setComponent(thing.getComponent(), pointSet(points, color, radius));
  return node;
}

MutableRootMessage<XromUpdateNode> setCamera(
  const String &userKey,
  const String &parentUserKey,
  Color color,
  c8_PixelPinholeCameraModel model,
  float nearClip,
  float farClip) {

  MutableRootMessage<XromUpdateNode> node;
  node.builder().getNode().setUserKey(userKey);
  node.builder().getParent().setUserKey(parentUserKey);
  auto thing = node.builder().getData().getKind().initComponent3d();

  MutableRootMessage<XromCamera3d> m;
  auto cam = m.builder();
  setColor(cam.getColor(), color);
  cam.setPixelsWidth(model.pixelsWidth);
  cam.setPixelsHeight(model.pixelsHeight);
  cam.setCenterPointX(model.centerPointX);
  cam.setCenterPointY(model.centerPointY);
  cam.setFocalLengthHorizontal(model.focalLengthHorizontal);
  cam.setFocalLengthVertical(model.focalLengthVertical);
  cam.setNearClip(nearClip);
  cam.setFarClip(farClip);

  ConstRootMessage<XromCamera3d> cm(m);
  setComponent(thing.getComponent(), cm);
  return node;
}

XromApp::Builder appData(
  XromUpdateNode::Builder node, const String &userKey, const String &appName) {
  node.getNode().setUserKey(userKey);
  auto app = node.getData().getKind().initApp();
  app.setName(appName);
  return app;
}

ConstRootMessage<XromPackedLayout> packedLayout(
  const Vector<float> &preferredSize,
  const Vector<float> &rowWeights,
  const Vector<Vector<float>> &colWeights) {
  if (!preferredSize.empty() && preferredSize.size() != 2) {
    C8_THROW("[xrom-components] preferredSize must be empty or have size 2");
  }

  int numRowWeights = rowWeights.empty() ? 1 : rowWeights.size();
  if (!colWeights.empty() && colWeights.size() != numRowWeights) {
    C8_THROW("[xrom-components] colWeights.size() must match rowWeights.size()");
  }

  MutableRootMessage<XromPackedLayout> layout;

  // If there's no preferred size, assume we just want to fill the whole window. Otherwise, assume
  // we want the content to fill the specified area without distortion.
  if (preferredSize.empty()) {
    layout.builder().setOnAspectMismatch(XromPackedLayout::AspectMismatchOptions::FILL);
  } else {
    layout.builder().setOnAspectMismatch(XromPackedLayout::AspectMismatchOptions::LETTERBOX);
    layout.builder().getPreferredWindowSize().setW(preferredSize[0]);
    layout.builder().getPreferredWindowSize().setH(preferredSize[1]);
  }

  layout.builder().initViewRows(numRowWeights);
  // If no row weights are specified, assume that there is just one row. Otherwise, populate the row
  // weights as specified.
  if (rowWeights.empty()) {
    layout.builder().getViewRows()[0].setWeight(1);
  }
  for (int i = 0; i < rowWeights.size(); ++i) {
    auto row = layout.builder().getViewRows()[i];
    row.setWeight(rowWeights[i]);
  }

  // If there are no col weights, assume every row has one column.
  if (colWeights.empty()) {
    for (auto row : layout.builder().getViewRows()) {
      row.initViews(1);
      row.getViews()[0].setWeight(1);
    }
  }

  for (int i = 0; i < colWeights.size(); ++i) {
    int numColWeights = colWeights[i].empty() ? 1 : colWeights[i].size();
    auto row = layout.builder().getViewRows()[i];
    row.initViews(numColWeights);

    // If no col weights are specified, assume that there is just one col. Otherwise, populate the
    // row col weights as specified.
    if (colWeights[i].empty()) {
      row.getViews()[0].setWeight(1);
    }
    for (int j = 0; j < colWeights[i].size(); ++j) {
      auto col = row.getViews()[j];
      col.setWeight(colWeights[i][j]);
    }
  }

  return ConstRootMessage<XromPackedLayout>(layout);
}

ConstRootMessage<XromRgbaColorTexture> testTexture(int w, int h) {
  MutableRootMessage<XromRgbaColorTexture> tex;
  tex.builder().setWidth(w);
  tex.builder().setHeight(h);
  tex.builder().initPixels(4 * w * h);
  int p = 0;
  for (int i = 0; i < h; ++i) {
    auto lc = Color::blend(Color::CHERRY, h - 1 - i, Color::PURPLE, i);
    auto rc = Color::blend(Color::MINT, h - 1 - i, Color::CANARY, i);
    for (int j = 0; j < w; ++j) {
      auto c = Color::blend(lc, w - 1 - j, rc, j);
      tex.builder().getPixels()[p] = c.r();
      tex.builder().getPixels()[p + 1] = c.g();
      tex.builder().getPixels()[p + 2] = c.b();
      tex.builder().getPixels()[p + 3] = c.a();
      p += 4;
    }
  }

  return ConstRootMessage<XromRgbaColorTexture>(tex);
}

void setColor(XromColor::Builder b, Color c) {
  b.setR(c.r());
  b.setG(c.g());
  b.setB(c.b());
  b.setA(c.a());
}

MutableRootMessage<XromUpdateNode> setView3dViewToCopy(
  MutableRootMessage<XromUpdateNode> &&node, const String &viewToCopy) {
  auto view3d = node.builder().getData().getKind().getView3d();
  view3d.getCopyView().setUserKey(viewToCopy);
  return std::move(node);
}

MutableRootMessage<XromUpdateNode> setComponent3dPlace(
  MutableRootMessage<XromUpdateNode> &&node, const HMatrix &place) {
  return setComponent3dPlace(std::forward<MutableRootMessage<XromUpdateNode>>(node), place, 1.0f);
}

MutableRootMessage<XromUpdateNode> setComponent3dPlace(
  MutableRootMessage<XromUpdateNode> &&node, const HMatrix &place, float scale) {
  auto r = rotation(place);
  auto t = translation(place);

  auto thing = node.builder().getData().getKind().getComponent3d();
  thing.getPlace().getPoint().setX(t.x());
  thing.getPlace().getPoint().setY(t.y());
  thing.getPlace().getPoint().setZ(t.z());
  thing.getPlace().getFacing().setW(r.w());
  thing.getPlace().getFacing().setX(r.x());
  thing.getPlace().getFacing().setY(r.y());
  thing.getPlace().getFacing().setZ(r.z());
  thing.setScale(scale);
  return std::move(node);
}

MutableRootMessage<XromUpdateNode> setComponent3dPlace(
  MutableRootMessage<XromUpdateNode> &&node, Transform32f::Reader place) {
  return setComponent3dPlace(std::forward<MutableRootMessage<XromUpdateNode>>(node), place, 1.0f);
}

MutableRootMessage<XromUpdateNode> setComponent3dPlace(
  MutableRootMessage<XromUpdateNode> &&node, Transform32f::Reader place, float scale) {
  auto t = place.getPosition();
  auto r = place.getRotation();
  auto camPos = cameraMotion(
    HPoint3(t.getX(), t.getY(), t.getZ()), Quaternion(r.getW(), r.getX(), r.getY(), r.getZ()));
  return setComponent3dPlace(std::forward<MutableRootMessage<XromUpdateNode>>(node), camPos, scale);
}

ConstRootMessage<XromPointSet3d> pointSet(const Vector<HPoint3> &points, Color color) {
  return pointSet(points, color, 1.0f);
}

ConstRootMessage<XromPointSet3d> pointSet(
  const Vector<HPoint3> &points, Color color, float radius) {
  MutableRootMessage<XromPointSet3d> m;
  auto ps = m.builder();
  ps.initPoints(points.size());
  setColor(ps.getColor(), color);
  ps.setRadius(radius);
  for (int i = 0; i < points.size(); ++i) {
    ps.getPoints()[i].setX(points[i].x());
    ps.getPoints()[i].setY(points[i].y());
    ps.getPoints()[i].setZ(points[i].z());
  }

  return ConstRootMessage<XromPointSet3d>(m);
}

ConstRootMessage<XromRgbaColorTexture> rgbaTexture(ConstRGBA8888PlanePixels pix) {
  MutableRootMessage<XromRgbaColorTexture> tex;
  tex.builder().setWidth(pix.cols());
  tex.builder().setHeight(pix.rows());
  tex.builder().initPixels(pix.rowBytes() * pix.rows());
  std::memcpy(tex.builder().getPixels().begin(), pix.pixels(), pix.rows() * pix.rowBytes());
  return ConstRootMessage<XromRgbaColorTexture>(tex);
}

ConstRootMessage<XromRgbaColorTexture> rgbaTexture(
  ConstYPlanePixels ypix, ConstUVPlanePixels uvpix) {
  RGBA8888PlanePixelBuffer rgbapixbuf(ypix.rows(), ypix.cols());
  auto rgbapix = rgbapixbuf.pixels();
  ScopeTimer t("rgba-texture");
  yuvToRgb(ypix, uvpix, &rgbapix);
  return rgbaTexture(rgbapix);
}

ConstRootMessage<XromRgbaColorTexture> rgbaTexture(RealityRequest::Reader request) {
  auto frame = request.getSensors().getCamera().getCurrentFrame();
  auto ypix = constFrameYPixels(frame);
  auto uvpix = constFrameUVPixels(frame);
  return rgbaTexture(ypix, uvpix);
}

}  // namespace c8
