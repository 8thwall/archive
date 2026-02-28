// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_binary {
  deps = {
    "//c8:c8-log",
    "//c8:hpoint",
    "//c8:color",
    "//c8:vector",
    "//c8/geometry:device-pose",
    "//c8/geometry:egomotion",
    "//c8/geometry:intrinsics",
    "//c8/io:capnp-messages",
    "//reality/engine/api/request:hit-test.capnp-cc",
    "//reality/quality/visualization/xrom/api:xrom.capnp-cc",
    "//reality/quality/visualization/xrom/api:xrom-components.capnp-cc",
    "//reality/quality/visualization/xrom/drawing:components",
    "//reality/quality/visualization/xrom/framework:reality-stream-factory",
    "//reality/quality/visualization/xrom/framework:reality-stream-interface",
    "//reality/quality/visualization/xrom/framework:rpc-xrom-client",
    "//reality/quality/visualization/xrom/framework:stdin-reality-stream",
  };
  linkopts = {
    "-framework AVFoundation",
    "-framework Cocoa",
    "-framework Accelerate",
    "-framework CoreGraphics",
    "-framework CoreMedia",
    "-framework CoreVideo",
  };
}
cc_end(0xfb6d9d38);

#include <memory>

#include "c8/c8-log.h"
#include "c8/color.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/intrinsics.h"
#include "c8/io/capnp-messages.h"
#include "c8/vector.h"
#include "reality/engine/api/request/hit-test.capnp.h"
#include "reality/quality/visualization/xrom/api/xrom-components.capnp.h"
#include "reality/quality/visualization/xrom/api/xrom.capnp.h"
#include "reality/quality/visualization/xrom/drawing/components.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-factory.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"
#include "reality/quality/visualization/xrom/framework/rpc-xrom-client.h"
#include "reality/quality/visualization/xrom/framework/stdin-reality-stream.h"
#include "reality/quality/visualization/xrom/framework/xrom-client-interface.h"

using namespace c8;

static const Vector<Color> DEBUG_HIT_RESULT_TYPE_COLORS{
  Color::VIBRANT_PINK, Color::MINT, Color::VIBRANT_YELLOW, Color::WHITE, Color::BLUE};
static const Vector<Color> XR_HIT_RESULT_TYPE_COLORS{
  Color::PURPLE, Color::DARK_MATCHA, Color::BLACK, Color::WHITE};

HPoint3 correctARKitPosition(HPoint3 pt, ResponsePose::Reader computedPose) {
  auto initRot = computedPose.getInitialTransform().getRotation();
  auto initPos = computedPose.getInitialTransform().getPosition();
  auto initRotQ = Quaternion(initRot.getW(), initRot.getX(), initRot.getY(), initRot.getZ());
  auto initPosV = HVector3(initPos.getX(), initPos.getY(), initPos.getZ());
  auto initCam = cameraMotion(initPosV, initRotQ);
  auto initCamInv = initCam.inv();
  HMatrix invX{
    {-1.0f, 0.0f, 0.0f, 0.0f},
    {0.00f, 1.0f, 0.0f, 0.0f},
    {0.00f, 0.0f, 1.0f, 0.0f},
    {0.00f, 0.0f, 0.0f, 1.0f}};

  return initCamInv * invX * pt;
}

HPoint3 correctARCorePosition(HPoint3 pt, ResponsePose::Reader computedPose) {
  auto initRot = computedPose.getInitialTransform().getRotation();
  auto initPos = computedPose.getInitialTransform().getPosition();
  auto initRotQ = Quaternion(initRot.getW(), initRot.getX(), initRot.getY(), initRot.getZ());
  auto initPosV = HVector3(initPos.getX(), initPos.getY(), initPos.getZ());
  auto initCam = cameraMotion(initPosV, initRotQ);

  return initCam.inv() * HPoint3(pt.x(), pt.y(), -pt.z());
}

c8_PixelPinholeCameraModel intrinsics(RealityRequest::Reader request) {
  if (request.getSensors().getCamera().hasPixelIntrinsics()) {
    auto pixelIntrinsics = request.getSensors().getCamera().getPixelIntrinsics();
    return c8_PixelPinholeCameraModel{
      pixelIntrinsics.getPixelsWidth(),
      pixelIntrinsics.getPixelsHeight(),
      pixelIntrinsics.getPixelsWidth() / 2.0f,
      pixelIntrinsics.getPixelsHeight() / 2.0f,
      pixelIntrinsics.getFocalLengthHorizontal(),
      pixelIntrinsics.getFocalLengthVertical()};
  } else {
    auto deviceInfo = request.getDeviceInfo();
    return Intrinsics::getCameraIntrinsics(DeviceInfos::getDeviceModel(deviceInfo));
  }
}

Vector<HPoint3> getResponseFeatureSet(RealityResponse::Reader response) {
  auto featureSetPoints = response.getFeatureSet().getPoints();
  Vector<HPoint3> pc;
  for (auto pt : featureSetPoints) {
    auto pos = pt.getPosition();
    pc.push_back(HPoint3(pos.getX(), pos.getY(), pos.getZ()));
  }
  return pc;
}

void setDebugHitTestResult(
  std::unique_ptr<XromClientInterface> &client,
  RealityRequest::Reader request,
  RealityResponse::Reader response,
  XRHitTestResult::Reader resultReader) {

  Vector<Vector<HPoint3>> hitResultTypeSets(5);  // Num of hit test result types.

  for (auto result : resultReader.getResults()) {
    auto pos = result.getHitTransform().getPosition();
    HPoint3 pt(pos.getX(), pos.getY(), pos.getZ());
    HPoint3 xrPosition = request.getSensors().hasARCore()
      ? correctARCorePosition(pt, response.getPose())
      : correctARKitPosition(pt, response.getPose());

    hitResultTypeSets[static_cast<int>(result.getType())].push_back(xrPosition);
  }

  for (int i = 0; i < hitResultTypeSets.size(); ++i) {
    client->update(setPointSet(
      "htt" + std::to_string(i), "view", hitResultTypeSets[i], DEBUG_HIT_RESULT_TYPE_COLORS[i]));
  }
}

void setXrQueryResult(
  std::unique_ptr<XromClientInterface> &client, XrQueryResponse::Reader resultReader) {
  Vector<Vector<HPoint3>> hitResultTypeSets(4);  // Num of xr hit test result types.

  for (auto hit : resultReader.getHitTest().getHits()) {
    auto pos = hit.getPlace().getPosition();
    HPoint3 pt(pos.getX(), pos.getY(), pos.getZ());
    hitResultTypeSets[static_cast<int>(hit.getType())].push_back(pt);
  }

  for (int i = 0; i < hitResultTypeSets.size(); ++i) {
    client->update(setPointSet(
      "xrhtt" + std::to_string(i), "view", hitResultTypeSets[i], XR_HIT_RESULT_TYPE_COLORS[i]));
  }
}

class RenderCallback : public RealityStreamCallback {
public:
  RenderCallback() : client_(new RpcXromClient()) {
    auto c1 =
      cameraMotion(HPoint3(.5f, 1.0f, -3.0f), Quaternion(0.9848078f, 0.17364816f, 0.0f, 0.0f));
    auto c2 = cameraMotion(HPoint3(0.0f, 0.0f, 0.0f), Quaternion(1.0f, 0.0f, 0.0f, 0.0f));
    auto c3 = cameraMotion(
      HPoint3(-3.0f, 0.0f, 1.5f), Quaternion(0.70710678118f, 0.0f, 0.70710678118f, 0.0f));
    auto c4 = cameraMotion(
      HPoint3(0.0f, 3.0f, 1.5f), Quaternion(0.70710678118f, 0.70710678118f, 0.0f, 0.0f));

    client_->update(setAppLayout("app", "HitTest", {1440, 960}, {2, 1}, {{3, 1}, {1, 1}}))
      ->update(setView3d("view", "Steerable", "app", c1))
      ->update(setView3dViewToCopy(setView3d("view2", "MovesWithCamera", "app", c2), "view"))
      ->update(setView3dViewToCopy(setView3d("view3", "SideView", "app", c3), "view"))
      ->update(setView3dViewToCopy(setView3d("view4", "OverheadView", "app", c4), "view"));
  }

  void processReality(
    RealityStreamInterface *stream,
    RealityRequest::Reader request,
    RealityResponse::Reader response) override {
    auto camPos = response.getXRResponse().getCamera().getExtrinsic();
    auto camIntrinsics = intrinsics(request);
    client_->update(setView3d("view2", "MovesWithCamera", "app", camPos))
      ->update(setComponent3dPlace(
        setCamera("camera", "view", Color::MINT, camIntrinsics, 0.33f, 5.0f), camPos));

    client_->update(
      setPointSet("point_cloud", "view", getResponseFeatureSet(response), Color::PURPLE, 0.75f));

    for (auto dbg : request.getDebugData()) {
      if (strcmp(dbg.getTag().cStr(), "DEBUG_HIT_TEST") != 0) {
        continue;
      }
      ConstRootMessage<XRHitTestResult> result(dbg.getData());
      setDebugHitTestResult(client_, request, response, result.reader());
      break;
    }

    MutableRootMessage<XrQueryRequest> requestMessage;
    auto builder = requestMessage.builder();
    builder.getHitTest().setX(0.5f);
    builder.getHitTest().setY(0.5f);
    auto queryResponse = stream->query(builder.asReader());
    setXrQueryResult(client_, queryResponse->reader());

    client_->flush();
  }

private:
  std::unique_ptr<XromClientInterface> client_;
};

int main(int argc, char *argv[]) {
  RenderCallback callback;
  RealityStreamFactory::setDefault(RealityStreamFactory::REMOTE);
  auto rStream = RealityStreamFactory::createFromFlags(argc, argv);
  rStream->setCallback(&callback);
  rStream->spin();
  return 0;
}
