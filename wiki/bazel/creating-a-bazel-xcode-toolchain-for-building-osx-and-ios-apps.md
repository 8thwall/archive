# Creating a Bazel XCode toolchain for building OSX and iOS apps

Edit: A script now exists in repo/niantic to create the stripped XCode folder that can be then uploaded to the filestore. It includes complete instructions:

* * *

Manual steps (warning: not completed updated!)

## Get or build an llvm crosstool

Instructions on this page. This will be used for compilation instead of the Apple Clang within XCode.

Build an LLVM toolchain for compiling on MacOSX

## Download a new XCode from Apple

<https://developer.apple.com/download/all/?q=Xcode>

## *Save the version in your shell, e.g. 13.3.1, matching the file you downloaded.
```bash
export XCVER=13.3.1
```

## *Un-quarantine the XCode .xip bundle
```bash
xattr -d com.apple.quarantine Xcode_${XCVER}.xip
```

## *Unpack the XCode .xip bundle
```bash
xip -x Xcode_${XCVER}.xip
```

## Remove large Platform directories for unused platforms
```bash
pushd Xcode.app/Contents/Developer/Platforms
rm -rf AppleTVOS.platform DriverKit.platform WatchOS.platform AppleTVSimulator.platform WatchSimulator.platform
popd
```

## ~~Remove the built-in Apple LLVM~~ – Keep the built-in Apple Toolchain.

~~true || rm -rf Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain~~

## ~~Remove the CoreSimulator Profiles~~ – Keep as of 14.2

~~true || rm -rf Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/Library/Developer/CoreSimulator/Profiles~~

## Remove the `Templates` and `man` directory

Contains some invalid file names with colons.
```bash
rm -rf Xcode.app/Contents/Developer/Library/Xcode/Templates Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/usr/share/man
```

## Look for circular symlinks and delete them
```bash
find Xcode.app/ -type l | xargs -I% ls -l % | grep -e "\-> \.$"
```

## *There is a `ruby -> .` symlink that must be removed (Xcode 13.3.1 +)
```bash
rm -f Xcode.app/Contents/Developer/Platforms/MacOSX.platform/Developer/SDKs/MacOSX.sdk/System/Library/Frameworks/Ruby.framework/Versions/2.6/Headers/ruby/ruby
```

## *Now should have an XCode.app that is about 3.5GB (~9.xGB with 13.2+)
```bash
du -hs Xcode.app
```

## New with XCode 15, circumvent apple’s security check (which looks at the folder path “Xcode.app”):
```bash
mv Xcode.app Xcode_app
```

## *Compress it into an gzip archive

There are other compression algorithms that provide smaller file sizes, but decompression speed is important as Bazel will re-decompress following certain types of updates (such as bazel version upgrades). Gzip provides good decompression speeds given the size of this archive.

~~tar czvf Xcode_${XCVER}.tgz Xcode_${XCVER}~~ Since MR-21701, we can pre-compress the file instead of creating a tgz.
```bash
mkdir Xcode_${XCVER}
mv Xcode_app Xcode_${XCVER}/
tar czvf Xcode_${XCVER}.tar.gz Xcode_${XCVER}
```

## *Upload the file to google drive, and share the link with #gitlab-admin to publish to the filestore.
```
Ping the #gitlab-admin folks with:
Source: `<REMOVED_BEFORE_OPEN_SOURCING>` (Google Drive)
It should then be available at
(yes, .tar even tho uploaded as tar.gz)
```

 After the file is on the `filestore`, download the .tar: `

## With the .tar file, compute the sha256 hash
```bash
openssl dgst -sha256 Xcode_${XCVER}.tar
```

## ~~Upload it to the crosstool cloud storage bucket~~

~~TODO: Currently using AWS. Update to use GCP~~

~~aws s3 cp --acl=public-read Xcode_${XCVER}.tgz s3://<REMOVED_BEFORE_OPEN_SOURCING>/xcode/~~

### *Update the WORKSPACE file in the bazel repo, using your `sha256` and `version`.
```
http_toolchain(
 name = "xcode<version>",
 build_file = "//third_party/xcode:xcode.BUILD",
 sha256 = "<sha256>",
 url = "
 strip_prefix = "Xcode_<version>",
)
```

Note: the url still points to a `.tar` file, even though the uploaded file is `.tar.gz`. See MR-21701 notes for more information.

Sample MR:
