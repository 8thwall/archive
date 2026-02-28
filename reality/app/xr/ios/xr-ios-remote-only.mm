// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "reality/app/xr/ios/xr-ios-remote-only.h"

#include "c8/protolog/api/log-request.capnp.h"

namespace c8 {

struct XRIosRemoteOnly : public XRDriverIos {
public:
  // Constructor.
  XRIosRemoteOnly(XRIos *xr) { C8Log("[xr-ios-remote-only] %s", "create"); }

  virtual ~XRIosRemoteOnly() { C8Log("[xr-ios-remote-only] %s", "destroy"); }

  // Default move constructors.
  XRIosRemoteOnly(XRIosRemoteOnly &&) = default;
  XRIosRemoteOnly &operator=(XRIosRemoteOnly &&) = default;

  // Disallow copying.
  XRIosRemoteOnly(const XRIosRemoteOnly &) = delete;
  XRIosRemoteOnly &operator=(const XRIosRemoteOnly &) = delete;

  void configure(XRConfiguration::Reader config) override {
    // Ignore
  }

  void resume() override { C8Log("[xr-ios-remote-only] %s", "resume"); }

  void pause() override { C8Log("[xr-ios-remote-only] %s", "pause"); }

  void getAppEnvironment(XRAppEnvironment::Builder env) override {
    // Set texture to an arbitrary size in case anyone asks.
    env.getManagedCameraTextures().getYTexture().setWidth(100);
    env.getManagedCameraTextures().getYTexture().setHeight(100);
    env.getManagedCameraTextures().getUvTexture().setWidth(50);
    env.getManagedCameraTextures().getUvTexture().setHeight(50);
  }

  RealityEngineLogRecordHeader::EngineType getType() override {
    return RealityEngineLogRecordHeader::EngineType::REMOTE_ONLY;
  }

private:
};

XRDriverIos *createXRIosRemoteOnly(XRIos *xr) { return new XRIosRemoteOnly(xr); }

}  // namespace c8
