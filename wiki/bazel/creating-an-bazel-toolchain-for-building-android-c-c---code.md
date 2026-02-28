# Creating an Bazel toolchain for building Android C/C++ code

### Install the Android sdkmanager brew package if not already installed
```bash
brew install --cask android-sdk
```

### Make a directory and enter it
```bash
mkdir android-ndk
cd android-ndk
```

### List the available Android NDKs
```bash
sdkmanager --list --sdk_root=. | grep "ndk;"
```

### Read and save version, e.g. `24.0.8215888`, the latest, install it, and accept terms.
```bash
export NDK_VER=<version>
sdkmanager --install --sdk_root=. "ndk;${NDK_VER}"
```

### Create a gzip archive
```bash
tar czvf ../android-ndk-${NDK_VER}-osx.tgz ./
```

### Upload it to the crosstool cloud storage bucket

TODO: Currently using AWS. Update to use GCP
```bash
cd ..
aws s3 cp --acl=public-read android-ndk-${NDK_VER}-osx.tgz s3://<REMOVED_BEFORE_OPEN_SOURCING>/android-ndk/
```

### Compute the sha256 hash of the file
```bash
openssl dgst -sha256 android-ndk-${NDK_VER}-osx.tgz
```

### Update the WORKSPACE file in the bazel repo, using your `sha256` and `version`.
```
http_toolchain(
 name = "android-ndk-macosx",
 build_file = "//third_party/android-ndk:android-ndk.BUILD",
 sha256 = "<sha256>",
 url = "<REMOVED_BEFORE_OPEN_SOURCING>",
 strip_prefix="ndk/<version>",
)
```
