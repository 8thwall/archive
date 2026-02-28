// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "c8/color.h"
#include "c8/geometry/pixel-pinhole-camera-model.h"
#include "c8/hmatrix.h"
#include "c8/hpoint.h"
#include "c8/io/capnp-messages.h"
#include "c8/pixels/pixels.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/api/reality.capnp.h"
#include "reality/quality/visualization/xrom/api/xrom-components.capnp.h"
#include "reality/quality/visualization/xrom/framework/xrom-client-interface.h"

#pragma once

namespace c8 {

constexpr char XROM_COMPONENT_PACKED_LAYOUT[] = "PACKED_LAYOUT";
constexpr char XROM_COMPONENT_RGBA_COLOR_TEXTURE[] = "RGBA_COLOR_TEXTURE";
constexpr char XROM_COMPONENT_CAMERA[] = "CAMERA";
constexpr char XROM_COMPONENT_ORIGIN[] = "ORIGIN";
constexpr char XROM_COMPONENT_POINT_SET[] = "POINT_SET";

template <class T>
String componentName;
template <class T>
void setComponent(XromComponent::Builder component, const ConstRootMessage<T> &m) {
  component.setType(componentName<T>);
  component.setData(m.bytes());
}

MutableRootMessage<XromUpdateNode> setAppLayout(
  const String &userKey,
  const String &appName,
  const Vector<float> &preferredSize,
  const Vector<float> &rowWeights,
  const Vector<Vector<float>> &colWeights);

MutableRootMessage<XromUpdateNode> setSingleViewApp(const String &userKey, const String &appName);

MutableRootMessage<XromUpdateNode> setView3d(
  const String &userKey, const String &viewName, const String &appUserKey);

MutableRootMessage<XromUpdateNode> setView3d(
  const String &userKey, const String &viewName, const String &appUserKey, const HMatrix &place);

MutableRootMessage<XromUpdateNode> setView3d(
  const String &userKey,
  const String &viewName,
  const String &appUserKey,
  Transform32f::Reader place);

MutableRootMessage<XromUpdateNode> setView2d(
  const String &userKey,
  const String &viewName,
  const String &appUserKey,
  const ConstRootMessage<XromRgbaColorTexture> &texture);

MutableRootMessage<XromUpdateNode> setOrigin(const String &userKey, const String &parentUserKey);

MutableRootMessage<XromUpdateNode> setPointSet(
  const String &userKey, const String &parentUserKey, const Vector<HPoint3> &points, Color color);
MutableRootMessage<XromUpdateNode> setPointSet(
  const String &userKey,
  const String &parentUserKey,
  const Vector<HPoint3> &points,
  Color color,
  float radius);

MutableRootMessage<XromUpdateNode> setCamera(
  const String &userKey,
  const String &parentUserKey,
  Color color,
  c8_PixelPinholeCameraModel model,
  float nearClip,
  float farClip);

MutableRootMessage<XromUpdateNode> setView3dViewToCopy(
  MutableRootMessage<XromUpdateNode> &&node, const String &viewToCopy);

MutableRootMessage<XromUpdateNode> setComponent3dPlace(
  MutableRootMessage<XromUpdateNode> &&node, const HMatrix &place);
MutableRootMessage<XromUpdateNode> setComponent3dPlace(
  MutableRootMessage<XromUpdateNode> &&node, const HMatrix &place, float scale);
MutableRootMessage<XromUpdateNode> setComponent3dPlace(
  MutableRootMessage<XromUpdateNode> &&node, Transform32f::Reader place);
MutableRootMessage<XromUpdateNode> setComponent3dPlace(
  MutableRootMessage<XromUpdateNode> &&node, Transform32f::Reader place, float scale);

XromApp::Builder appData(
  XromUpdateNode::Builder node, const String &userKey, const String &appName);

ConstRootMessage<XromPackedLayout> packedLayout(
  const Vector<float> &preferredSize,
  const Vector<float> &rowWeights,
  const Vector<Vector<float>> &colWeights);

ConstRootMessage<XromPointSet3d> pointSet(const Vector<HPoint3> &points, Color color);
ConstRootMessage<XromPointSet3d> pointSet(const Vector<HPoint3> &points, Color color, float radius);

void setColor(XromColor::Builder b, Color c);

ConstRootMessage<XromRgbaColorTexture> testTexture(int w, int h);
ConstRootMessage<XromRgbaColorTexture> rgbaTexture(ConstRGBA8888PlanePixels pix);
ConstRootMessage<XromRgbaColorTexture> rgbaTexture(
  ConstYPlanePixels ypix, ConstUVPlanePixels uvpix);
ConstRootMessage<XromRgbaColorTexture> rgbaTexture(RealityRequest::Reader request);

}  // namespace c8
