// Copyright (c) 2025 Niantic Spatial, Inc.
// Original Author: Lucas Reyna (lucas@nianticspatial.com)

#include "c8/html-shell/html-shell-helpers.h"

#include <gtest/gtest.h>

#include <nlohmann/json.hpp>

#include "c8/io/file-io.h"

namespace {

const std::string kTempMetadataPath = "temp_metadata.json";

class ScopedTempMetadata {
public:
  ScopedTempMetadata() { std::remove(kTempMetadataPath.c_str()); }

  ~ScopedTempMetadata() { std::remove(kTempMetadataPath.c_str()); }
};

}  // namespace

namespace c8 {

// Tests for the HTML Shell helpers, specifically for checking if a new web build is detected
// based on the metadata file. The non-path inputs to the isNewWebBuild function will always be
// read from the app's manifest, and they represent the commit ID and build mode at the time
// of the app's build.
//
// The metadata file is a live file that lives in app storage, and should track the latest commit ID
// and build mode. In static mode, this will always the be the same as the build time params, but in
// hot-reload mode, this will change with each new build and appURL revalidation.

class HtmlShellHelpersTest : public ::testing::Test {};

TEST_F(HtmlShellHelpersTest, ReturnsFalseOnRepeatAfterSecondBuild) {
  ScopedTempMetadata tempMetadata;

  // Ensure the metadata file does not exist
  EXPECT_FALSE(fileExists(kTempMetadataPath));

  // Simulate first build: creates metadata file with Build 1 data
  EXPECT_TRUE(c8::isNewWebBuild(kTempMetadataPath, "commit1", "modeA"));

  // Verify metadata file was created with correct values
  EXPECT_TRUE(fileExists(kTempMetadataPath));
  auto metadata = readJsonFile(kTempMetadataPath);
  EXPECT_EQ(metadata["commitId"], "commit1");
  EXPECT_EQ(metadata["naeBuildMode"], "modeA");

  // Simulate second build: different commit should return true and update metadata
  EXPECT_TRUE(c8::isNewWebBuild(kTempMetadataPath, "commit2", "modeA"));
  metadata = readJsonFile(kTempMetadataPath);
  EXPECT_EQ(metadata["commitId"], "commit2");
  EXPECT_EQ(metadata["naeBuildMode"], "modeA");

  // Simulate repeat of Build 2: same commit should return false (no changes needed)
  EXPECT_FALSE(c8::isNewWebBuild(kTempMetadataPath, "commit2", "modeA"));
  metadata = readJsonFile(kTempMetadataPath);
  EXPECT_EQ(metadata["commitId"], "commit2");
  EXPECT_EQ(metadata["naeBuildMode"], "modeA");
}

TEST_F(HtmlShellHelpersTest, ReturnsTrueIfMetadataDoesNotExist) {
  ScopedTempMetadata tempMetadata;

  EXPECT_TRUE(c8::isNewWebBuild(kTempMetadataPath, "commit1", "modeA"));
}

TEST_F(HtmlShellHelpersTest, ReturnsFalseIfCommitAndModeMatch) {
  ScopedTempMetadata tempMetadata;

  // First call creates the file
  c8::isNewWebBuild(kTempMetadataPath, "commit1", "modeA");

  // Second call with same values should return false
  EXPECT_FALSE(c8::isNewWebBuild(kTempMetadataPath, "commit1", "modeA"));
}

TEST_F(HtmlShellHelpersTest, ReturnsTrueIfCommitDiffers) {
  ScopedTempMetadata tempMetadata;

  c8::isNewWebBuild(kTempMetadataPath, "commit1", "modeA");
  EXPECT_TRUE(c8::isNewWebBuild(kTempMetadataPath, "commit2", "modeA"));
}

TEST_F(HtmlShellHelpersTest, ReturnsTrueIfModeDiffers) {
  ScopedTempMetadata tempMetadata;

  c8::isNewWebBuild(kTempMetadataPath, "commit1", "modeA");
  EXPECT_TRUE(c8::isNewWebBuild(kTempMetadataPath, "commit1", "modeB"));
}

TEST_F(HtmlShellHelpersTest, MetadataFileIsUpdatedCorrectly) {
  ScopedTempMetadata tempMetadata;

  // First build
  c8::isNewWebBuild(kTempMetadataPath, "commit1", "modeA");

  // Verify metadata file has correct initial values
  auto metadata1 = readJsonFile(kTempMetadataPath);
  EXPECT_EQ(metadata1["commitId"], "commit1");
  EXPECT_EQ(metadata1["naeBuildMode"], "modeA");

  // Second build with different commit
  c8::isNewWebBuild(kTempMetadataPath, "commit2", "modeB");

  // Verify metadata file was updated with new values
  auto metadata2 = readJsonFile(kTempMetadataPath);
  EXPECT_EQ(metadata2["commitId"], "commit2");
  EXPECT_EQ(metadata2["naeBuildMode"], "modeB");
}

}  // namespace c8
