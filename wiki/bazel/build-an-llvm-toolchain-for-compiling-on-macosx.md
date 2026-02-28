# Build an LLVM toolchain for compiling on MacOSX

### Prerequsites

Install ninja and cmake
```bash
brew install ninja
brew install cmake
```

### Clone LLVM
```bash
git clone https://github.com/llvm/llvm-project.git
```

### Cd to llvm-project directory
```bash
cd llvm-project
```

### List tags
```bash
git fetch
git tag
```

### Checkout a tag (16.0.6 in this case)
```bash
export LLVM_VER=16.0.6
git checkout llvmorg-${LLVM_VER}
```

### Change and create directories
```bash
mkdir -p build
mkdir -p toinstall
cd build
```

### Choose the architecture

Configure for an arm64 or x86_64 osx compiler. We generate separate arm64 and x86_64 compilers to ensure the developer download is smaller and only gets the binaries needed for the host computer.
```bash
# Choose arm64 or x86_64.
export LLVM_HOST_ARCH=arm64
```

### Configure the build

Configure for a compiler, linker, and clang tools, with support for targeting WebAssembly, arm*, and x86*.

 * We enable RTTI so inliner can be used

 * We don’t build examples or tests to save time

 * ZSTD compression is disabled as the LLVM build scripts as of 6.21.23 were not finding or building a portable zstd library, instead linking to a brew-installed shared library.

```bash
cmake -G Ninja \
-DLLVM_ENABLE_PROJECTS="clang;compiler-rt;lld;clang-tools-extra" \
-DCMAKE_BUILD_TYPE=Release \
-DCMAKE_INSTALL_PREFIX=../toinstall \
-DLLVM_CREATE_XCODE_TOOLCHAIN=on \
-DLLVM_TARGETS_TO_BUILD="WebAssembly;AArch64;X86;ARM" \
-DCMAKE_OSX_ARCHITECTURES="${LLVM_HOST_ARCH}" \
-DLLVM_INCLUDE_EXAMPLES=OFF \
-DLLVM_INCLUDE_TESTS=OFF \
-DLLVM_ENABLE_RTTI=ON \
-DLLVM_ENABLE_ZSTD=OFF \
../llvm
```

### Build the LLVM binaries and libraries
```bash
cmake --build .
```

### Create the xcode toolchain plist and copy everything to the `toinstall` directory
```bash
cmake --build . --target install-xcode-toolchain
```

### Rename and move the `toinstall` directory
```bash
export LLVM_REV=$(git rev-parse --short=7 HEAD)
```
```bash
export LLVM=llvm-${LLVM_VER}-${LLVM_REV}-macosx-${LLVM_HOST_ARCH}
```
```bash
mv ../toinstall ../../${LLVM} && cd ../..
```

### Create a GZip archive

There are other compression algorithms that provide smaller file sizes, but decompression speed is important as Bazel will re-decompress following certain types of updates (such as bazel version upgrades). Gzip provides good decompression speeds given the size of this archive.
```bash
tar czvf ${LLVM}.tgz ${LLVM}
```

## Upload it to the crosstool cloud storage bucket

Currently uploading to AWS due to the ability to work as precompressed gzip tar archive. (That means the resource downloaded is a .tar, but it is sent over the network as if it were a .tar.gz.
```bash
aws s3 cp --acl=public-read --content-encoding=gzip --content-type=application/x-tar \
${LLVM}.tgz s3://<REMOVED_BEFORE_OPEN_SOURCING>/llvm/${LLVM}.tar
```

Or upload it to the filestore:
```bash
# Upload to GCS hosted bucket
export BUCKET=gs://<REMOVED_BEFORE_OPEN_SOURCING>
export PREFIX=LLVM/${LLVM_VER}/osx
gsutil -h "Content-Encoding:gzip" \
 -h "Content-Type:application/x-tar" \
 cp ${LLVM}.tgz ${BUCKET}/${PREFIX}/${LLVM}.tar
# SSH into filestore VM
gcloud compute ssh <REMOVED_BEFORE_OPEN_SOURCING> --project=<REMOVED_BEFORE_OPEN_SOURCING>
# Elevate privileges and sync locally
sudo -s
cd /opt/srv/Filestore/LLVM/
gsutil cp -r gs://<REMOVED_BEFORE_OPEN_SOURCING>/LLVM/${LLVM_VER} .
```

## Compute the sha256 hash of the tar file
```bash
gunzip -c ${LLVM}.tgz | openssl dgst -sha256
```

### Update the WORKSPACE file in the bazel repo, using your `sha256` and `version`.
```
http_toolchain(
 name = "llvm-macosx",
 build_file = "//third_party/llvm:llvm-macosx.BUILD",
 sha256 = "<sha256>",
 url = "<REMOVED_BEFORE_OPEN_SOURCING>",
 strip_prefix="llvm-<version>-macosx",
)
```
