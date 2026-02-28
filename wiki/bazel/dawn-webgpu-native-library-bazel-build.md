# Dawn - WebGPU Native Library Bazel Build

# Upgrade Dawn manually

Dawn build process reference <https://dawn.googlesource.com/dawn/+/HEAD/docs/building.md>

Dawn node binding build process reference `./src/dawn/node/README.md`

`emdawnwebgpu` build info - <https://github.com/emscripten-core/emscripten/tree/main/system/include/webgpu>

## Clone Dawn and checkout a commit with a Chromium version tag

Dawn has commits associate with Chromium versions. It would be helpful for us to checkout a commit with a certain Chromium version tag on it.

For example, the below command is synced to Chromium version 6875 -
```bash
# Clone the repo as "dawn"
git clone https://dawn.googlesource.com/dawn dawn_chromium_6875 && cd dawn_chromium_6875
```

You may want to compress the clean `third_party` sub directory without any third party repo cloned. Later we will want to package with a clean `third_party` sub directory when Dawn is ready to be uploaded.

## Sync dependency

Dawn can be prepared for build with or without `depot_tools`

With `depot_tools` -
```bash
# Bootstrap the gclient configuration
cp scripts/standalone.gclient .gclient

# Fetch external dependencies and toolchains with gclient
gclient sync
```

Without `depot_tools` -
```bash
# Fetch dependencies (lose equivalent of gclient sync)
python tools/fetch_dawn_dependencies.py --use-test-deps
```

## Build Dawn with CMake for reference

Building Dawn with CMake is helpful for referencing CMake build files vs Bazel.

Dawn can be compiled with the options below -

Compiling using CMake + Ninja
```bash
mkdir -p out/Debug
cd out/Debug
cmake -GNinja ../..
ninja # or autoninja
```

Compiling using CMake + make
```bash
mkdir -p out/Debug
cd out/Debug
cmake ../..
make # -j N for N-way parallel build
```

### Build Dawn Node Binding with CMake for reference

Reference `src/dawn/node/README.md`
```bash
git clone https://github.com/gpuweb/gpuweb.git third_party/gpuweb
cp third_party/gpuweb/spec/webgpu.idl third_party/gpuweb/webgpu.idl

git clone https://github.com/nodejs/node-api-headers.git third_party/node-api-headers

mkdir -p out/node_binding
cd out/node_binding
cmake ../.. -GNinja -DDAWN_BUILD_NODE_BINDINGS=1
```

## Setup Bazel build with local Dawn repo

Rename `BUILD.bazel` to some other name
```bash
mv BUILD.bazel _BUILD.bazel
```

Edit `WORKSPACE` to point to this Dawn path using `new_local_repository` rule to update local repo -
```
#http_archive(
# name = "dawn",
# build_file = "//bzl/thirdpartybuild:dawn.BUILD",
# sha256 = "059ca9176d5eb194cfa8d05e30c8b306a7be24bf7f07a6ae3eb33c0d1f677ca5",
# strip_prefix = "dawn_chromium_6644",
# url = "
#)
new_local_repository(
 name = "dawn",
 build_file = "//bzl/thirdpartybuild:dawn.BUILD",
 path = "/Users/xxx/dawn_chromium_6875",
)
```

All `BUILD.gn` and `CMakeLists.txt` files need to be diff-ed to see what changed for building Dawn-
```cmake
#!/bin/sh

OLD_PATH=/Users/xxx/dawn_chromium_6644
NEW_PATH=/Users/xxx/dawn_chromium_6875

diffFiles() {
 echo $1
 diff $OLD_PATH/$1 $NEW_PATH/$1
 echo
 echo
}

# dawn-common
diffFiles src/dawn/common/BUILD.gn

# native
diffFiles src/dawn/native/BUILD.gn

# patition-alloc
diffFiles src/dawn/partition_alloc/BUILD.gn

# platform
diffFiles src/dawn/platform/BUILD.gn

# utils
diffFiles src/dawn/utils/BUILD.gn

# wire
diffFiles src/dawn/wire/BUILD.gn

# glfw
diffFiles src/dawn/glfw/BUILD.gn

# samples
diffFiles src/dawn/samples/BUILD.gn

# node interop
diffFiles src/dawn/node/interop/CMakeLists.txt

# node binding
diffFiles src/dawn/node/binding/CMakeLists.txt

# node
diffFiles src/dawn/node/CMakeLists.txt
```

## Dawn Tint Target

Monorepo uses `@com_google_absl` repo name for `abseil_cpp`. Therefore we need to change the lib name for tint build.

Fix `src/tint/utils/strconv/BUILD.bazel`
```
- "@abseil_cpp//absl/strings",
+ "@com_google_absl//absl/strings",
```

The `tint` targets should be able to build after this fix -
```bash
bazel build @dawn//src/tint/api:api
bazel build --platforms=//bzl:android_arm64 --@dawn//:android-backend=vulkan --subcommands --sandbox_debug @dawn//src/tint/api:api
```

## Dawn WebGPU Target

### Auto-gen Files

There are source files need to be generated using scripts. The generation functions can be found in `./generator/CMakeLists.txt`. Diff this file with older version to update the auto-gen script accordingly.

<https://github.com/nodejs/node-api-headers.git> needs to be cloned into `third_party` folder to generate `NapiSymbols.h` for node binding build.

`dawn-auto-gen.sh` to be executed in Dawn root dir.
```cpp
#!/bin/sh

# https://dawn.googlesource.com/dawn/+/HEAD/docs/building.md
# fetach dependencies
python3 tools/fetch_dawn_dependencies.py --use-test-deps

# replicate DawnJSONGenerator function in ./generator/CMakeLists.txt
DawnJSONGenerator() {
 python3 ./generator/dawn_json_generator.py \
 --template-dir ./generator/templates \
 --root-dir . \
 --output-dir . \
 --dawn-json ./src/dawn/dawn.json \
 --wire-json ./src/dawn/dawn_wire.json \
 --kotlin-json ./src/dawn/dawn_kotlin.json \
 --targets $1 \
 --jinja2-path ./third_party/jinja2 \
 --markupsafe-path ./third_party/markupsafe
}

# dawn_headers
DawnJSONGenerator headers

# dawncpp_headers
DawnJSONGenerator cpp_headers

# dawn_proc
DawnJSONGenerator proc

# webgpu_headers_gen
DawnJSONGenerator webgpu_headers

# dawn_native_webgpu_dawn
DawnJSONGenerator webgpu_dawn_native_proc

# dawn_native_utils
DawnJSONGenerator native_utils

# dawn_wire
DawnJSONGenerator wire

# dawn_version_gen
python3 ./generator/dawn_version_generator.py \
 --template-dir ./generator/templates \
 --root-dir . \
 --output-dir . \
 --dawn-dir . \
 --jinja2-path ./third_party/jinja2 \
 --markupsafe-path ./third_party/markupsafe

# dawn_GPU_info_gen
python3 ./generator/dawn_gpu_info_generator.py \
 --template-dir ./generator/templates \
 --root-dir . \
 --output-dir . \
 --gpu-info-json ./src/dawn/gpu_info.json \
 --jinja2-path ./third_party/jinja2 \
 --markupsafe-path ./third_party/markupsafe

# src/emdawnwebgpu
DawnJSONGenerator emdawnwebgpu_headers

DawnJSONGenerator emdawnwebgpu_js

# node API NapiSymbols.h
awk 'match($0, /napi_[a-z0-9_]*/) { print "NAPI_SYMBOL("substr($0, RSTART, RLENGTH)")"}' third_party/node-api-headers/symbols.js > src/dawn/node/NapiSymbols.h
```

### Auto-gen Dawn Node files
```cpp
go run tools/src/cmd/idlgen/main.go \
 --template src/dawn/node/interop/WebGPU.h.tmpl \
 --output src/dawn/node/interop/WebGPU.h \
 src/dawn/node/interop/Browser.idl third_party/gpuweb/webgpu.idl src/dawn/node/interop/DawnExtensions.idl

go run tools/src/cmd/idlgen/main.go \
 --template src/dawn/node/interop/WebGPU.cpp.tmpl \
 --output src/dawn/node/interop/WebGPU.cpp \
 src/dawn/node/interop/Browser.idl third_party/gpuweb/webgpu.idl src/dawn/node/interop/DawnExtensions.idl
```

## All Build Targets

tint lib
```bash
# build tint
# Mac
bazel build @dawn//src/tint/api:api

# Android ARM64 w/ Vulkan
bazel build --platforms=//bzl:android_arm64 --@dawn//:android-backend=vulkan --subcommands --sandbox_debug @dawn//src/tint/api:api
```

dawn-common
```bash
bazel build @dawn//:dawn-common
bazel build --platforms=//bzl:android_arm64 --@dawn//:android-backend=vulkan @dawn//:dawn-common
```

dawn-proc
```bash
bazel build @dawn//:dawn-proc
bazel build --platforms=//bzl:android_arm64 --@dawn//:android-backend=vulkan @dawn//:dawn-proc
```

dawn-platform
```bash
bazel build @dawn//:dawn-platform
bazel build --platforms=//bzl:android_arm64 --@dawn//:android-backend=vulkan @dawn//:dawn-platform
```

dawn-native
```bash
# Mac with Metal
bazel build @dawn//:dawn-native-backend-null
bazel build @dawn//:dawn-native-backend-metal-objc
bazel build @dawn//:dawn-native

# Android with Vulkan
bazel build --platforms=//bzl:android_arm64 --@dawn//:android-backend=vulkan @dawn//:dawn-native
```

dawn-utils
```bash
bazel build @dawn//:dawn-utils
bazel build --platforms=//bzl:android_arm64 --@dawn//:android-backend=vulkan @dawn//:dawn-utils
```

dawn-wire
```bash
bazel build @dawn//:dawn-wire
bazel build --platforms=//bzl:android_arm64 --@dawn//:android-backend=vulkan @dawn//:dawn-wire
```

dawn-glfw
```bash
bazel build @dawn//:dawn-glfw
```

dawn-samples
```bash
# Mac
bazel build @dawn//:dawn-sample-utils
```

dawn-node-interop
```bash
bazel build @dawn//:dawn-node-interop
```

dawn-node-binding
```bash
bazel build @dawn//:dawn-node-binding
```

dawn-node
```bash
bazel build @dawn//:dawn-node
```

dawn-addon
```bash
bazel build @dawn//:dawn-addon
```

### Examples
```bash
# Mac
bazel run @dawn//:dawn-samples-hello-triangle
bazel run @dawn//:dawn-samples-compute-boids
bazel run @dawn//:dawn-samples-animometer
bazel run @dawn//:dawn-samples-dawn-info
bazel run @dawn//:dawn-samples-manual-surface-test
```

### Dawn Node WebGPU CTS

Clone the `webgpu-cts` repo to a local folder and run the script under `/Users/xxx/dawn_chromium_6875` -
```bash
git clone https://github.com/gpuweb/cts.git <repo/webgpu-cts> # not necessary under dawn repo

bazel build @dawn//:dawn-addon

# <path of repo/webgpu-cts> could be /Users/xxx/third_party/webgpu-cts
# <dawn-addon location> could be /Users/xxx/repo/niantic/bazel-bin/external/dawn/
# <output folder> could be /Users/xxx/third_party/webgpu-cts-results folder
cd /Users/xxx/dawn_chromium_6875
go run tools/src/cmd/run-cts/main.go \
 -cts=<path of repo/webgpu-cts> \
 -bin <dawn-addon location> \
 -output <output folder> \
 -verbose 'webgpu:*'
```

## Update `WORKSPACE`

 1. remove build files under build folders, e.g. `out/Debug` for CMake

 2. remove `third_party` folder that contains cloned repos

 3. restore empty `third_party`folder from a clean clone

 4. compress the repo, e.g. `dawn_chromium_6875.zip`

 5. upload to `

 6. create sha256 checksum for the package
```bash
shasum -a 256 dawn_chromium_6875.zip
```

 7. run tests with this new package

 8. update `WORKSPACE` with new package address and sha256 checksum
