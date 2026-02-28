# Building Emscripten Toolchain

Notes and steps for building an emscripten toolchain for code8.

## Install cmake and ninja
```bash
brew install cmake
brew install ninja
```

## ssh to jenkins

Build LLVM with Jenkins. It takes a lot of compute power to compile and Jenkins is much faster than your laptop.
```bash
ssh <internal-server>
```

Note `<internal-server> = <internal-ip>` if you don’t have an `/etc/hosts` entry

## Clone or pull llvm-project
```bash
git clone <https://github.com/llvm/llvm-project.git>
cd llvm-project
mkdir -p build
mkdir -p toinstall
cd build
```

or
```bash
cd third_party_local/llvm-project
git pull
rm -rf build toinstall
mkdir -p build
mkdir -p toinstall
cd build
```

## Create Ninja Build rules - Release for host and WebAssembly
```bash
cmake -G Ninja -DLLVM_ENABLE_PROJECTS="clang;compiler-rt;lld;clang-tools-extra" -DCMAKE_BUILD_TYPE=Release -DCMAKE_INSTALL_PREFIX=/Users/jenkins/third_party_local/llvm-project/toinstall -DLLVM_CREATE_XCODE_TOOLCHAIN=on -DLLVM_TARGETS_TO_BUILD="host;WebAssembly;AArch64;X86;ARM" -DCMAKE_OSX_ARCHITECTURES="arm64;x86_64" -DLLVM_INCLUDE_EXAMPLES=OFF -DLLVM_INCLUDE_TESTS=OFF ../llvm
```

## Run the build

cmake --build .

## Copy the result into the toinstall directory

cmake --build . --target install
~~cmake --build . --target install-xcode-toolchain~~

## Go get an emscripten build

> TODO(mc): Fill this section and similar once we next upgrade emscripten.

{.is-warning}

## Replace llvm in emscripten

In your emscripten toolchain, replace `llvm` directorty with the contents of the `toinstall` directory.

## mv or copy toinstall

mv toinstall ../../llvm-14.0.0git-8ae5e0b

## Create the highly-compressed .xz archive
```bash
# Create a tar archive
tar -cvpf emsdk-sdk-2.0.7-llvm-xxxxxxx.tar emsdk-sdk-2.0.7-llvm-xxxxxxx
# Multi-threaded xv compression at level 9-extreme.
xz -T0 -v -9e -c emsdk-sdk-2.0.7-llvm-ec54867.tar > emsdk-sdk-2.0.7-llvm-ec54867.tar.xz
```

This step takes awhile, but the size reduction is much greater than gzip or bzip2.

## References

<https://emscripten.org/docs/building_from_source/index.html>

## Copy to S3

aws s3 cp llvm-14.0.0git-8ae5e0b.tar.xz s3://<REMOVED_BEFORE_OPEN_SOURCING>/llvm/

## Change ACL to public-read

# WIP Upgrade Emscripten

### Get the emsdk repo
```bash
git clone <https://github.com/emscripten-core/emsdk.git>
```

### Download and 'install' the latest SDK tools.
```bash
./emsdk install latest
```

### Delete the git repo info

rm -rf ../emsdk/.git
rm ../emsdk/.gitignore
rm -rf ../emsdk/.github

### Get the sha hash

openssl dgst -sha256 emsdk-sdk-2.X.XX.tar.xz

### Upload to S3 as a public readable object

aws s3 cp --acl public-read emsdk-sdk-2.X.XX-llvm-8ae5e0b1.tar.xv s3://<REMOVED_BEFORE_OPEN_SOURCING>/

### Rename the directory to the correct SDK and llvm version

cd ..
mv emsdk emsdk-sdk-2.0.7-llvm-a5bb247

Copy over the llvm directory to emsdk-sdk-2.0.7-llvm-a5bb247
(Optional) remove {bin include lib libexec share} in upstream

Comment out the emcctoolchain in WORKSPACE and add the following for debugging and testing:

new_local_repository(
name = "emcctoolchain",
build_file = "//bzl/thirdpartybuild:emcctoolchain.BUILD",
path = "/path/to/your/emsdk-sdk-2.0.7-llvm-a5bb247"
)

Create a .emscripten file in the repo, copying it from the previous verion. Edit as necessary for new updated paths, like node.

Create all of the precompiled libraries for both LTO and non-LTO
./upstream/emscripten/embuilder build SYSTEM
./upstream/emscripten/embuilder --lto build SYSTEM

./upstream/emscripten/embuilder build bzip2 zlib libpng libjpeg
./upstream/emscripten/embuilder --lto build bzip2 zlib libpng libjpeg

#Edit paths in these files
bzl/thirdpartybuild/emcctoolchain.BUILD
bzl/crosstool/node-toolchain.bzl

bazel clean
Try first build
bazel build bzl/hellobuild/cc:hello --cpu=js

3/22/22
Create all of the precompiled libraries for both LTO and non-LTO
./emscripten/main/embuilder build SYSTEM
./emscripten/main/embuilder --lto build SYSTEM
./emscripten/main/embuilder build bzip2 zlib libpng libjpeg
./emscripten/main/embuilder --lto build bzip2 zlib libpng libjpeg
```cmake
diff --git a/emsdk.py b/emsdk.py
index 697f753..b97d7b5 100644
--- a/emsdk.py
+++ b/emsdk.py
@@ -1041,14 +1041,20 @@ def cmake_configure(generator, build_root, src_root, build_type, extra_cmake_arg
 cmdline = ['cmake'] + generator + ['-DCMAKE_BUILD_TYPE=' + build_type, '-DPYTHON_EXECUTABLE=' + sys.executable]
 # Target macOS 10.11 at minimum, to support widest range of Mac devices from "Mid 2007" and newer:
 # <https://en.wikipedia.org/wiki/MacBook_Pro#Supported_macOS_releases>
- cmdline += ['-DCMAKE_OSX_DEPLOYMENT_TARGET=10.11']
+ cmdline += ['-DCMAKE_C_COMPILER=/private/var/tmp/_bazel_mc/c4f4f6f74f33415f35a1ab44963d1e4f/external/llvm-dc19c70/bin/clang']
+ cmdline += ['-DCMAKE_CXX_ARCHIVE_CREATE=/usr/bin/libtool -static -D -o <TARGET> <LINK_FLAGS> <OBJECTS>']
+ cmdline += ['-DCMAKE_RANLIB=echo']
+ cmdline += ['-DCMAKE_CXX_COMPILER=/private/var/tmp/_bazel_mc/c4f4f6f74f33415f35a1ab44963d1e4f/external/llvm-dc19c70/bin/clang++']
+ cmdline += ['-DCMAKE_OSX_DEPLOYMENT_TARGET=10.13']
+ cmdline += ['-DCMAKE_OSX_ARCHITECTURES=arm64;x86_64']
+ #cmdline += ['-DCMAKE_OSX_ARCHITECTURES="x86_64"']
 cmdline += extra_cmake_args + [src_root]

 print('Running CMake: ' + str(cmdline))

 # Specify the deployment target also as an env. var, since some Xcode versions
 # read this instead of the CMake field.
- os.environ['MACOSX_DEPLOYMENT_TARGET'] = '10.11'
+ os.environ['MACOSX_DEPLOYMENT_TARGET'] = '10.13'

 def quote_parens(x):
 if ' ' in x:
```
