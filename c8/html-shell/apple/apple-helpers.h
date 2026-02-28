// Copyright (c) 2025 8th Wall, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)
//
// Helpers for file operations on OSX and iOS.

#pragma once

#include <filesystem>
#include <functional>

#include "c8/string.h"

namespace c8 {

// Returns the path to the application's support directory, or an empty string on error.
String getApplicationSupportDirectory();

// Copies the contents of the app bundle's Resources directory to destPath.
void copyResourcesDirectory(const String &destPath);

void copyDirectory(
  const String &srcPath,
  const String &destPath,
  std::function<bool(const std::filesystem::path &)> shouldSkipThisRelativePath = nullptr);

// Deletes the contents of path, but not the directory itself.
void deleteDirectoryContents(const String &path);

// Deletes the contents of path, but not the directory itself. Preserves the specified file.
void deleteDirectoryContents(const String &path, const String &pathToNotDelete);

// Gets the system locale as a string, e.g. "en-US".
String getLocale();

// Gets the user agent as a string, e.g. "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0) ..."
String getUserAgent();

}  // namespace c8
