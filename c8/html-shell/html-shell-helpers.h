// Copyright (c) 2025 Niantic Spatial, Inc.
// Original Author: Lucas Reyna (lucas@nianticspatial.com)

#pragma once

#include "c8/string.h"

namespace c8 {

bool isNewWebBuild(
  const String &metadataPath, const String &commitIdAtAppBuildTime, const String &naeBuildMode);

void updateMetadataFile(
  const String &metadataPath, const String &commitId, const String &naeBuildMode);

}  // namespace c8
