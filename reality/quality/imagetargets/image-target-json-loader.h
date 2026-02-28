// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Erik Murphy-Chutorian (mc@8thwall.com)
//
// Read/write compressed images from the filesystem.

#pragma once

#include <nlohmann/json.hpp>

#include "c8/geometry/parameterized-geometry.h"
#include "c8/string.h"

namespace c8 {

CurvySpec curvySpecFromTargetJson(const nlohmann::json &targetData);

}  // namespace c8
