// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#pragma once

#include <nlohmann/json.hpp>

#include "c8/pixels/render/object8.h"
#include "c8/string.h"

namespace c8 {

// Renders a JSON as a tree, used for Object8 metadata and Renderable elementMetadata
void layoutJSON(
  const Object8 &node,
  const String &key,
  const nlohmann::json &json,
  int index,
  bool isElementMetadata,
  bool didSelectNodeInView,
  int selectedElementIndex);

}  // namespace c8
