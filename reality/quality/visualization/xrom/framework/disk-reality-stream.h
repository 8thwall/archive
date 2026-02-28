// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include <memory>

#include "c8/string.h"
#include "reality/app/xr/capnp/xr-capnp.h"
#include "reality/quality/visualization/protolog/log-record-capture.h"
#include "reality/quality/visualization/xrom/framework/reality-stream-interface.h"

#pragma once

namespace c8 {

class DiskRealityStream : public RealityStreamInterface {
public:
  void setCallback(RealityStreamCallback *callback) override;
  void spin() override;
  void stop() override;
  ConstRootMessage<XrQueryResponse> *query(XrQueryRequest::Reader request) override;
  void setUseExistingResponse(bool useExistingResponse);

  // Constructor.
  DiskRealityStream(const String &filename);
  virtual ~DiskRealityStream() {}

  // Default move constructors.
  DiskRealityStream(DiskRealityStream &&) = default;
  DiskRealityStream &operator=(DiskRealityStream &&) = default;

  // Disallow copying.
  DiskRealityStream(const DiskRealityStream &) = delete;
  DiskRealityStream &operator=(const DiskRealityStream &) = delete;

private:
  bool stopped_ = false;
  RealityStreamCallback *callback_ = nullptr;
  std::unique_ptr<LogRecordCapture> cap_;
  std::unique_ptr<XRCapnp> engine_;
  XRCapnpSensors sensors_;
  XRCapnpReality reality_;
  bool useExistingResponse_;
};

}  // namespace c8
