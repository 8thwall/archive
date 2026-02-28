# Script to strip down XCode to the minimum required for repo/code8 build

# Note, there are manual steps at the bottom that need to be done after running this script

# Obtain XCode. See latest versions here: https://developer.apple.com/download/all/?q=Xcode
# Put the .xip file in the root of the repo.

# Save the version in the environment, matching the file downloaded
export XCVER=16.4

# Display the original size of the XCode .xip bundle
du -hs Xcode_${XCVER}.xip

# Un-quarantine the XCode .xip bundle, if necessary (admin may have done this already, if obtaining internally)
xattr -d com.apple.quarantine Xcode_${XCVER}.xip

# Extract the XCode .xip bundle
xip -x Xcode_${XCVER}.xip

# Remove large Platform directories for unused platforms
pushd Xcode.app/Contents/Developer/Platforms
rm -rf AppleTVOS.platform DriverKit.platform WatchOS.platform AppleTVSimulator.platform WatchSimulator.platform
popd

# General cleanup...
pushd Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain
rm -rf Developer ToolchainInfo.plist
popd

pushd Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr
rm -rf bin include lib libexec share
popd

pushd Xcode.app/Contents
rm -rf Applications Info.plist PkgInfo version.plist Library MacOS _CodeSignature Resources
popd

pushd Xcode.app/Contents/Developer
rm -rf Applications Library Makefiles Tools usr
popd

pushd Xcode.app/Contents/SharedFrameworks
rm -rf DNTDocumentationSupport.framework
popd

# share/man has some invalid file names with colons.
rm -rf Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/share

# Look for circular symlinks and delete them
find Xcode.app/ -type l | xargs -I% ls -l % | grep -e "\-> \.$" | while read line
do
  remove="$(echo $line | perl -pe "s#.*? (Xcode.app.*?) ->.*#\1#g")"
  rm -f "$remove"
done

# There is a ruby -> . symlink that must be removed (Xcode 13.3.1 +) if it still exists
rm -f Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/System/Library/Frameworks/Ruby.framework/Versions/2.6/Headers/ruby/ruby

# Display the final size of the XCode .xip bundle
du -hs Xcode.app

# Circumvent apple’s security check (which checks the name “Xcode.app”) by renaming the folder
mv Xcode.app Xcode_app

# Pre-compress the XCode folder as Xcode_${XCVER}_stripped_libs.tar.gz
mkdir Xcode_${XCVER}
mv Xcode_app Xcode_${XCVER}/
# When building Rust libs for Tauri, we get errors such as:
#   /private/var/tmp/_bazel_jenkins/60d45ba6530dcd9c59b1eab6dad74cfe/external/xcode16/Xcode_app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/System/Library/Frameworks/CoreFoundation.framework/Headers/CFBase.h: 0:
#   23:40:08 <module-includes>:246:9: note: in file included from <module-includes>:246:
#   23:40:08 244 | #import "mach/machine/vm_types.h"
#   23:40:08 245 | #import "mach/arm/vm_types.h"
#   23:40:08 246 | #import "mach_debug/._hash_info.h"
#   23:40:08     |         `- note: in file included from <module-includes>:246:
#   23:40:08 247 | #import "mach_debug/._ipc_info.h"
#   23:40:08 248 | #import "mach_debug/._lockgroup_info.h"
#   23:40:08
#   23:40:08 /private/var/tmp/_bazel_jenkins/60d45ba6530dcd9c59b1eab6dad74cfe/external/xcode16/Xcode_app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/usr/include/mach_debug/._hash_info.h:1:157: error: source file is not valid UTF-8
#   23:40:08 1 | ����Mac OS X        �	2q��ATTR�������com.apple.provenance���v(�4,
#   23:40:08   |                                                                                                                                                     `- error: source file is not valid UTF-8
#   23:40:08
#   23:40:08 /private/var/tmp/_bazel_jenkins/60d45ba6530dcd9c59b1eab6dad74cfe/external/xcode16/Xcode_app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/System/Library/Frameworks/CoreFoundation.framework/Headers/CFBase.h: 0:
#   23:40:08 <module-includes>:246:9: note: in file included from <module-includes>:246:
#   23:40:08 244 | #import "mach/machine/vm_types.h"
#   23:40:08 245 | #import "mach/arm/vm_types.h"
#   23:40:08 246 | #import "mach_debug/._hash_info.h"
#   23:40:08     |         `- note: in file included from <module-includes>:246:
#   23:40:08 247 | #import "mach_debug/._ipc_info.h"
#   23:40:08 248 | #import "mach_debug/._lockgroup_info.h"
#   23:40:08
#   23:40:08 /private/var/tmp/_bazel_jenkins/60d45ba6530dcd9c59b1eab6dad74cfe/external/xcode16/Xcode_app/Contents/Developer/Platforms/iPhoneOS.platform/Developer/SDKs/iPhoneOS.sdk/usr/include/mach_debug/._hash_info.h:1:158: error: source file is not valid UTF-8
#   23:40:08 1 | ����Mac OS X        �	2q��ATTR�������com.apple.provenance���v(�4,
# These are AppleDouble format files used to store extended attributes and ACLs. We exclude them
# with COPYFILE_DISABLE=1 and --exclude='._*'.
COPYFILE_DISABLE=1 tar czvf Xcode_${XCVER}_stripped_libs.tar.gz --exclude='._*' Xcode_${XCVER}

# Manual Steps, to be completed after running this script:

# (1) Upload Xcode_${XCVER}_stripped_libs.tar.gz to the s3://8w-crosstool/xcode/ bucket
# Get the public URL for the file after uploading, it should look like this:
# https://huggingface.co/datasets/8thWall/bazel-dependencies/blob/main/xcode/Xcode_${XCVER}_stripped_libs.tar.gz

# (2) With the .tar.gz file, compute the sha256 hash:
##### openssl dgst -sha256 Xcode_${XCVER}_stripped_libs.tar.gz

# (3) Update the WORKSPACE toolchain, using the computed <sha256> and updated <version> from ${XCVER} of XCode stripped libraries
#
##### http_toolchain(
#####     name = "xcode<version>",
#####     build_file = "//third_party/xcode:xcode.BUILD",
#####     sha256 = "<sha256>",
#####     strip_prefix = "Xcode_<version>",
#####     url = "https://huggingface.co/datasets/8thWall/bazel-dependencies/blob/main/xcode/Xcode_${XCVER}_stripped_libs.tar",
##### )
#

# (4) Update the bzl/xcode/BUILD file to use the new version:
#
##### alias(
#####     name = "stub",
#####     actual = select({
#####         .... older versions ....
#####         "//bzl/conditions:xcode<version>": "@xcode<version>//:stub",
#####         "//conditions:default": "@xcode<version>//:stub",
#####     }),
##### )
#
##### string_flag(
#####     name = "version",
#####     build_setting_default = "<version>",
#####     values = [
#####         "13",
#####         "14",
#####         "15",
#####         "<version>",
#####     ],
#####     visibility = ["//visibility:public"],
##### )

# (5) Update the bzl/conditions/BUILD file to add a new config_setting for the new version:
#
##### config_setting(
#####     name = "xcode<version>",
#####     flag_values = {
#####         "//bzl/xcode:version": "<version>",
#####     },
#####     visibility = ["//visibility:public"],
##### )

# (6) Build the toolchain with the new version:
##### bazel build //bzl/crosstool:xcode-cc-toolchain --config=xcode<version>

# Sample PR: https://github.com/8thwall/code8/pull/2394
