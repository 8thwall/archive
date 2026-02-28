// Copyright (c) 2025 8th Wall, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#include "c8/html-shell/apple/apple-helpers.h"

#include <gmock/gmock.h>
#include <gtest/gtest.h>

#include <filesystem>
#include <fstream>

#include "c8/c8-log.h"
#include "c8/string.h"

namespace c8 {

class FilesHelperTest : public ::testing::Test {
protected:
  void SetUp() override {
    tempDir = std::filesystem::temp_directory_path() / "test_dir";
    std::filesystem::create_directories(tempDir);
  }

  void TearDown() override { std::filesystem::remove_all(tempDir); }

  std::filesystem::path tempDir;
};

TEST_F(FilesHelperTest, GetApplicationSupportDirectoryNoCrash) {
  String dir = getApplicationSupportDirectory();
  // We will not have a bundle identifier, so we should not have a directory. Just make sure we
  // don't crash.
  EXPECT_TRUE(dir.empty());
}

TEST_F(FilesHelperTest, deleteDirectoryContents) {
  std::filesystem::path dirToClear = tempDir / "to_clear";
  std::filesystem::create_directories(dirToClear);
  std::ofstream(dirToClear / "file1.txt") << "Test";
  std::ofstream(dirToClear / "file2.txt") << "Test";

  deleteDirectoryContents(dirToClear.string());

  EXPECT_TRUE(std::filesystem::exists(dirToClear));
  EXPECT_TRUE(std::filesystem::is_empty(dirToClear));
}

TEST_F(FilesHelperTest, deleteDirectoryContentsPreservesSpecifiedFile) {
  std::filesystem::path dirToClear = tempDir / "to_clear";
  std::filesystem::create_directories(dirToClear);
  std::ofstream(dirToClear / "file1.txt") << "Test";
  std::ofstream(dirToClear / "preserve_me.txt") << "Keep this";
  std::ofstream(dirToClear / "file2.txt") << "Test";

  std::filesystem::path fileToPreserve = dirToClear / "preserve_me.txt";
  deleteDirectoryContents(dirToClear.string(), fileToPreserve.string());

  EXPECT_TRUE(std::filesystem::exists(dirToClear));
  EXPECT_FALSE(std::filesystem::is_empty(dirToClear));
  EXPECT_TRUE(std::filesystem::exists(fileToPreserve));
  EXPECT_FALSE(std::filesystem::exists(dirToClear / "file1.txt"));
  EXPECT_FALSE(std::filesystem::exists(dirToClear / "file2.txt"));
}

TEST_F(FilesHelperTest, copyDirectorySkipsPredicate) {
  std::filesystem::path srcDir = tempDir / "src";
  std::filesystem::create_directories(srcDir / "SC_Info");
  std::filesystem::create_directories(srcDir / "keep_dir");
  std::ofstream(srcDir / "file1.txt") << "Test";
  std::ofstream(srcDir / "SC_Info" / "should_skip.txt") << "Skip me";
  std::ofstream(srcDir / "keep_dir" / "keep.txt") << "Keep me";
  std::ofstream(srcDir / "skip_me.txt") << "Skip me too";

  std::filesystem::path destDir = tempDir / "dest";

  // Lambda skips anything in SC_Info and any file named skip_me.txt
  auto shouldSkipThisRelativePath = [](const std::filesystem::path &relativePath) {
    if (!relativePath.empty() && *relativePath.begin() == "SC_Info") {
      return true;
    }
    if (relativePath.filename() == "skip_me.txt") {
      return true;
    }
    return false;
  };

  copyDirectory(srcDir.string(), destDir.string(), shouldSkipThisRelativePath);

  EXPECT_TRUE(std::filesystem::exists(destDir / "file1.txt"));
  EXPECT_TRUE(std::filesystem::exists(destDir / "keep_dir" / "keep.txt"));
  EXPECT_FALSE(std::filesystem::exists(destDir / "SC_Info" / "should_skip.txt"));
  EXPECT_FALSE(std::filesystem::exists(destDir / "skip_me.txt"));
}

TEST_F(FilesHelperTest, copyDirectoryInvalidSrc) {
  std::filesystem::path destDir = tempDir / "dest";

  copyDirectory("invalid_src", destDir.string());

  EXPECT_FALSE(std::filesystem::exists(destDir));
}

}  // namespace c8
