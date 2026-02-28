// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  hdrs = {
    "xr-capnp.h",
  };
  deps = {
    "//c8:hpoint",
    "//c8:quaternion",
    "//c8:vector",
    "//c8/io:capnp-messages",
    "//c8/pixels:pixel-buffer",
    "//c8/pixels:pixel-transforms",
    "//c8/pixels:pixels",
    "//c8/pixels/opengl:gl-texture",
    "//c8/protolog:xr-extern",
    "//c8/protolog:xr-requests",
    "//reality/engine/api:reality.capnp-cc",
    "//reality/engine/executor:xr-engine",
  };
}
cc_end(0xb0bfe1bc);

#include "reality/app/xr/capnp/xr-capnp.h"

namespace c8 {

void XRCapnp::pushRealityForward(const XRCapnpSensors &sensors, XRCapnpReality *newReality) {
  MutableRootMessage<RealityRequest> realityRequestMessage(sensors.requestMessage->reader());
  MutableRootMessage<RealityResponse> realityResponseMessage;

  auto requestBuilder = realityRequestMessage.builder();
  auto responseBuilder = realityResponseMessage.builder();

  requestBuilder.setMask(capnp::defaultValue<RequestMask>());
  requestBuilder.getMask().setFeatures(configuration_.outputMaskFeatures);
  requestBuilder.getMask().setPose(configuration_.outputMaskPose);
  requestBuilder.getMask().setSensorTest(configuration_.outputMaskSensorTest);
  requestBuilder.getFlags().setExperimental(!configuration_.disableExperimental);
  requestBuilder.setXRConfiguration(configuration_.xrConfig.reader());

  if (!requestBuilder.getXRConfiguration().hasGraphicsIntrinsics()) {
    auto gi = requestBuilder.getXRConfiguration().getGraphicsIntrinsics();
    gi.setTextureWidth(
      requestBuilder.getSensors()
        .getCamera()
        .getCurrentFrame()
        .getImage()
        .getOneOf()
        .getGrayImagePointer()
        .getCols());
    gi.setTextureHeight(
      requestBuilder.getSensors()
        .getCamera()
        .getCurrentFrame()
        .getImage()
        .getOneOf()
        .getGrayImagePointer()
        .getRows());
    gi.setNearClip(0.001);
    gi.setFarClip(1000.0);
  }

  if (!requestBuilder.getXRConfiguration().getCameraConfiguration().hasCaptureGeometry()) {
    requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setWidth(
      requestBuilder.getSensors()
        .getCamera()
        .getCurrentFrame()
        .getImage()
        .getOneOf()
        .getGrayImagePointer()
        .getCols());
    requestBuilder.getXRConfiguration().getCameraConfiguration().getCaptureGeometry().setHeight(
      requestBuilder.getSensors()
        .getCamera()
        .getCurrentFrame()
        .getImage()
        .getOneOf()
        .getGrayImagePointer()
        .getRows());
  }

  // Copy the input sensor data to lastSensorValues.
  lastSensorValues_ = &sensors;

  lastRequest_ = ConstRootMessage<RealityRequest>(requestBuilder);

  // Run the request.
  engine_->execute(requestBuilder.asReader(), &responseBuilder);

  newReality->xrResponse = ConstRootMessage<RealityResponse>(realityResponseMessage);
}


}  // namespace c8
