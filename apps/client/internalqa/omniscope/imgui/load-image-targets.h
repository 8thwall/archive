// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "apps/client/internalqa/omniscope/native/lib/detection-image.h"
#include "c8/camera/device-infos.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "reality/engine/features/gr8-feature-shader.h"

namespace c8 {

Vector<String> targetFiles();

OmniDetectionImage loadImageTargetFile(
  const String &file, Gr8FeatureShader *glShader, DeviceInfos::DeviceModel model);

}  // namespace c8
