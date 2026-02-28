// Copyright (c) 2025 8th Wall, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#include "c8/html-shell/apple/apple-helpers.h"

#import <Foundation/Foundation.h>

#if TARGET_OS_IOS
#import <UIKit/UIKit.h>
#elif TARGET_OS_OSX
#import <AppKit/AppKit.h>
#endif

#include "c8/c8-log.h"
namespace c8 {

String getApplicationSupportDirectory() {
  @autoreleasepool {
    // Access the Application Support Directory
    NSArray *paths =
      NSSearchPathForDirectoriesInDomains(NSApplicationSupportDirectory, NSUserDomainMask, YES);
    if ([paths count] > 0) {
      NSString *appSupportDir = [paths objectAtIndex:0];

      // Optionally, you can append the app's bundle identifier for uniqueness.
      NSString *bundleIdentifier = [[NSBundle mainBundle] bundleIdentifier];
      if (!bundleIdentifier) {
        C8Log("[apple-helpers@getApplicationSupportDirectory] Failed to get bundle identifier");
        return "";
      }

      NSString *appDir = [appSupportDir stringByAppendingPathComponent:bundleIdentifier];
      NSFileManager *fileManager = [NSFileManager defaultManager];

      // Create the directory if it doesn't exist.
      if (![fileManager fileExistsAtPath:appDir]) {
        NSError *error = nil;
        [fileManager createDirectoryAtPath:appDir
               withIntermediateDirectories:YES
                                attributes:nil
                                     error:&error];
        if (error) {
          C8Log(
            "apple-helpers@getApplicationSupportDirectory] Failed to create filesDir: %s",
            error.localizedDescription);
        }
      }

      return String([appDir UTF8String]);
    }
  }
  return "";
}

// Android does this differently:
// - It first copies top-level files from the assets directory, i.e. app.js
// - Then it copies the entire /runfiles directory
// - Then it copies the entire /_http-cache directory
// We just recursively copy. Which means we might copy more than them.
// TODO(paris): Once we have app icon, etc, come back and make sure this is still okay.
// Example destPath: "/Users/parismorgan/Library/Application Support/parismorganniantic.HelloOSX/".
void copyResourcesDirectory(const String &destPath) {
  NSBundle *bundle = [NSBundle mainBundle];
  NSString *resourcePath = [bundle resourcePath];

  copyDirectory(
    String([resourcePath UTF8String]), destPath, [](const std::filesystem::path &relativePath) {
      // Distribution builds include SC_Info files in the bundle, but attempting to copy them
      // to the Application Support directory fails with an "Operation not permitted" error.
      if (!relativePath.empty() && *relativePath.begin() == "SC_Info") {
        return true;
      }
      if (relativePath.filename() == ".DS_Store") {
        return true;
      }
      return false;
    });
}

void copyDirectory(
  const String &srcPath,
  const String &destPath,
  std::function<bool(const std::filesystem::path &)> shouldSkipThisRelativePath) {
  std::filesystem::path sourceDir(srcPath);
  if (!std::filesystem::exists(sourceDir)) {
    C8Log("[apple-helpers@copyDirectory] Source directory does not exist: %s", srcPath.c_str());
    return;
  }

  std::filesystem::path destinationDir(destPath);
  std::filesystem::create_directories(destinationDir);

  try {
    for (const auto &entry : std::filesystem::recursive_directory_iterator(
           sourceDir, std::filesystem::directory_options::skip_permission_denied)) {
      std::filesystem::path relativePath = std::filesystem::relative(entry.path(), sourceDir);
      std::filesystem::path targetPath = destinationDir / relativePath;

      if (shouldSkipThisRelativePath && shouldSkipThisRelativePath(relativePath)) {
        continue;
      }

      if (entry.is_directory()) {
        std::filesystem::create_directories(targetPath);
      } else if (entry.is_regular_file()) {
        // NOTE(paris): This may fail for large files. Instead we may want to use
        // std::ifstream and std::ofstream for buffered reads and writes.
        std::filesystem::copy_file(
          entry.path(), targetPath, std::filesystem::copy_options::overwrite_existing);
      }
    }
  } catch (const std::exception &ex) {
    C8Log("[apple-helpers@copyDirectory] %s", ex.what());
  }
}

void deleteDirectoryContents(const String &dirPath, const String &pathToNotDelete) {
  std::filesystem::path dir(dirPath);
  if (!std::filesystem::exists(dir)) {
    C8Log("[apple-helpers@deleteDirectoryContents] Directory does not exist: %s", dirPath.c_str());
    return;
  }

  for (const auto &entry : std::filesystem::directory_iterator(dir)) {
    try {
      if (!pathToNotDelete.empty() && entry.path() == pathToNotDelete) {
        // Skip deleting the specified file.
        continue;
      }
      if (entry.is_directory()) {
        std::filesystem::remove_all(entry.path());
      } else if (entry.is_regular_file()) {
        std::filesystem::remove(entry.path());
      }
    } catch (const std::exception &ex) {
      C8Log("[apple-helpers@deleteDirectoryContents] %s", ex.what());
    }
  }
}

void deleteDirectoryContents(const String &dirPath) { deleteDirectoryContents(dirPath, ""); }

String getLocale() {
  @autoreleasepool {
    NSString *languageCode = [[NSLocale currentLocale] objectForKey:NSLocaleLanguageCode];
    NSString *countryCode = [[NSLocale currentLocale] objectForKey:NSLocaleCountryCode];

    if (!languageCode) {
      languageCode = @"en";
    }
    if (!countryCode) {
      countryCode = @"US";
    }

    NSString *systemLocale = [NSString stringWithFormat:@"%@-%@", languageCode, countryCode];
    return String([systemLocale UTF8String]);
  }
}

String getUserAgent() {
  @autoreleasepool {
#if TARGET_OS_IOS
    NSString *version = [[UIDevice currentDevice] systemVersion];
    NSString *platform = [[UIDevice currentDevice] model];
    NSString *model = [NSString stringWithFormat:@"CPU %@ OS", platform];
#elif TARGET_OS_OSX
    NSString *platform = @"Macintosh";
    NSString *version = [[NSProcessInfo processInfo] operatingSystemVersionString];
    NSString *model = @"Mac OS X";
#else
    NSString *platform = @"Unknown";
    NSString *version = @"Unknown";
    NSString *model = @"Unknown";
#endif

    NSString *formatVersion = [version stringByReplacingOccurrencesOfString:@"." withString:@"_"];

    NSString *userAgent = [NSString
      stringWithFormat:@"Mozilla/5.0 (%@; %@ %@) NAE/1.0.0 ", platform, model, formatVersion];

    return String([userAgent UTF8String]);
  }
}

}  // namespace c8
