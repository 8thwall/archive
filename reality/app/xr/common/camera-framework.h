// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Interfaces for camera lifecycle hooks.

#pragma once

#include "reality/engine/api/reality.capnp.h"

namespace c8 {

// Interface for lifecycle hooks after a reality update has occurred.
class RealityPostprocessor {
public:
  virtual void pause() {}   // NOP in default implementation.
  virtual void resume() {}  // NOP in default implementation.
  virtual RealityResponse::Reader update(
    RealityRequest::Reader request, RealityResponse::Reader response) = 0;
  virtual ~RealityPostprocessor() noexcept(false) {}
};

// Inteface for enabling or disabling features.
class FeatureProvider {
public:
  enum FeatureStatus {
    UNSPECIFIED = 0,
    DISABLED = 1,
    ENABLED = 2,
  };
  FeatureProvider() = default;
  virtual void pause() {}   // NOP in default implementation.
  virtual void resume() {}  // NOP in default implementation.
  virtual FeatureStatus status(const char *name) { return FeatureStatus::UNSPECIFIED; }
  virtual ~FeatureProvider() {}
};

}  // namespace c8
