// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)
//
// Library for retrieving iOS device information.

#pragma once

#include "reality/engine/api/device/info.capnp.h"

namespace c8 {

  // Writes information of the currently running iOS device to the provided builder.
  void c8_exportDeviceInfo(c8::DeviceInfo::Builder &infoBuilder);
}
