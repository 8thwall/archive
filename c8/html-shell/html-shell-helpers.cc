// Copyright (c) 2025 Niantic Spatial, Inc.
// Original Author: Lucas Reyna (lucas@nianticspatial.com)

#include "c8/html-shell/html-shell-helpers.h"

#include <nlohmann/json.hpp>

#include "c8/io/file-io.h"

namespace c8 {

bool isNewWebBuild(
  const String &metadataPath, const String &commitIdAtAppBuildTime, const String &naeBuildMode) {
  if (c8::fileExists(metadataPath)) {
    std::string storedCommitId;
    std::string storedBuildMode;
    auto storedMetadata = readJsonFile(metadataPath);

    // Only new http-cache files are copied over, so we need to override this
    // behavior for new static builds that need to rely on updated fallback cache values.
    // This flag prevents issues in two cases:
    // 1st build: hot-reload, 2nd build: static
    // * In this situation, the hot-reload build will cache the appUrl and the new static build
    //   will fallback to the previous build's cached response and not the new response in the
    //   app bundle.
    // 1st build: static, 2nd build: static with app changes
    // * In this situation, the static build will cache the appUrl and the new static build will
    //   fallback to the previous build's cached response and not the new response in the app
    //   bundle.
    storedCommitId = storedMetadata["commitId"];
    storedBuildMode = storedMetadata["naeBuildMode"];
    bool isNewBuild = commitIdAtAppBuildTime != storedCommitId || naeBuildMode != storedBuildMode;

    if (isNewBuild) {
      // Update metadata.json with new values when a new build is detected
      updateMetadataFile(metadataPath, commitIdAtAppBuildTime, naeBuildMode);
    }
    return isNewBuild;
  } else {
    // If metadata.json doesn't exist, this is the first build, so we need to create
    // the metadata file with the current commitId and naeBuildMode.
    updateMetadataFile(metadataPath, commitIdAtAppBuildTime, naeBuildMode);

    return true;
  }
}

void updateMetadataFile(
  const String &metadataPath, const String &commitId, const String &naeBuildMode) {
  nlohmann::json metadata;
  metadata["commitId"] = commitId;
  metadata["naeBuildMode"] = naeBuildMode;
  c8::writeTextFile(metadataPath, metadata.dump(2));
}

}  // namespace c8
