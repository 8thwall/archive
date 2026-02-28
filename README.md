# What is this repository?

This repository contains the archived code for 8th Wall. It is not an actively maintained repository, instead the goal is to provide the full set of released 8th Wall code which can be pulled from as we work on [the new 8th Wall open source repository](https://github.com/8thwall/8thwall), which will contain a subset of this code.

Please note that this repository does not contain all of the code which ran 8th Wall, large portions of the codebase were removed for security and intellectual property reasons. Specifically, you'll notice that SLAM, VPS, and the much of the 8thwall.com server code is not included.

# 8th Wall

## Build System Philosophy

The goal of the build system is to be:

 * Repeatable - person A and person B can each compile code separately and obtain the same exact result.
 * Hermetic – person A doesn't need to install and maintain a set of prerequisite dependencies or toolchains for development
 * Cross-architecture development is consistent - e.g. the same standard C++ code will compile across Android, iOS, Windows, etc. Assumes compiler toolchains and standard libraries are relatively consistent, e.g. (c++20, llvm, libcpp, etc.)

## Prerequisites

There should be very few prerequisites required to build this repo and maintain the hermetic aspect of this repo. Nearly every toolchain dependency should be downloaded as part of the build.

## Pre-Bootstrap script

Run the following command to install the prerequisites and setup GitHub credentials with g8.
```bash
./bootstrap/bootstrap.sh
```

When prompted by OSX to enter your laptop password, click "Always Allow" (otherwise you'll be entering your password *a lot*).

If you're starting from a fresh machine, make sure to add `brew` and its installs to your PATH.
i.e. Add `export PATH=/opt/homebrew/bin:$PATH` to your .zshrc or other shell config files.

#### Updating your Personal Access Token for g8

If your token expires, run the following command to update your GitHub credentials with g8.

```bash
./bootstrap/update_token.sh
```

When prompted by OSX to enter your laptop password, click "Always Allow" (otherwise you'll be entering your password *a lot*).

### Run bootstrap script

```
cd ~/repo/tools8/bootstrap
make all
```

### Install Python and create a virtual environment

```bash
# Install Python 3.11
brew install python@3.11

# Create a virtualenv for this python 3.11
/opt/homebrew/bin/python3.11 -m venv ~/.venv

# Add the following to `~/.bashrc` and/or `~/.zshrc`

# Activate Python Virtual Env
export VIRTUAL_ENV_DISABLE_PROMPT=1
source ~/.venv/bin/activate
export PYTHON_BIN_PATH=$(which python3)
```

Then, **restart your shell** or `source` your .bashrc/.zshrc file so these settings are loaded.

### Install Python packages and set up git lfs

*The requirements.txt file is built for specific macOS versions, and have not been tested on the latest major macOS versions. Before updating your dev machine's major macOS version, please see threads in #build-infra (or create one) with your specific situation. Thank you.*

*When running the command below, you may get `No module named 'distutils'`. This happens because distutils package was removed in Python 3.12. You should downgrade to Python <3.12.* or run `pip3 install setuptools`
```
cd ~/repo/code8
python3 -m pip install -r requirements.txt
git lfs pull && git checkout -f HEAD
```

### Update JAVA_HOME in your .zshenv or .bashrc file
```bash
# Run the following to find the location of java (as installed by brew):
brew info openjdk
# Then edit in .zshenv to point to there:
export JAVA_HOME="[insert path here]"
```

### Update ANDROID_HOME in your .zsh or .bashrc file
```bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools
```

### Also setup android-sdk
```bash
bazel build @android-sdk//:stub
```

### Build and run an example binary
```bash
bazel run //bzl/examples:hello
```
If you see an error similar to `Expected directory at /opt/homebrew/share/android-sdk/platforms but it is not a directory or it does not exist`, then try running the `sdkmanager` tool: `./bin/sdkmanager "platforms;android-30" "build-tools;30.0.3" "extras;google;m2repository" "extras;android;m2repository"`

### Set up VSCode (optional)
```bash
cp -r bootstrap/vscode .vscode
```

## Working in the repo

### Fast-forward Merges and `g8`
This repo uses fast-forward merges and the `g8` git client for source code management.
Instructions on installing and using `g8` are here:
<REMOVED_BEFORE_OPEN_SOURCING>

### Code Style

This repo defines automatic code formatting rules that developers should apply to code before review. Use `clang-format` for C/C++/Java, `eslint` for JavaScript, and `buildifier` for Bazel and Skylark files.

### ESLint

#### CLI

```bash
# Lint some files
./eslint.sh path/to/file.js path/to/other/file.js

# Fix problems automatically
./eslint.sh --fix path/to/file.js path/to/other/file.js

# Lint all lintable files within a directory
g8 save && git ls-tree -r HEAD --name-only -- path/to/folder | grep -E "\.[tj]sx?" | xargs ./eslint.sh

# See all options
./eslint.sh --help
```

#### VSCode

- Run `./reality/scripts/apply-npm-rule.sh npm-eslint`
- Install the ESLint plugin
- Restart VSCode
- Add the following to `settings.json` for format on save:
```json
"editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
}
```

## Example Usage
Build a "Hello World!\n" binary for your local computer arch:
```
bazel build //bzl/examples:hello
```

Build the same "Hello World!\n" binary as a universal Mac binary (arm64/x86_64)
```
bazel build //bzl/examples:hello --platforms=//bzl:osx_universal
```

Build the same "Hello World!\n" binary as a Windows executable (x86_64)
```
bazel build //bzl/examples:hello --platforms=//bzl:windows_x86_64
```

Build the same "Hello World!\n" binary as an Android executable (arm64)
```
bazel build //bzl/examples:hello --platforms=//bzl:android_arm64
```

Build and run a JavaScript command line application.
```
bazel run //bzl/examples:hello-js-cli
```

Run a JavaScript unit test.
```
bazel test //bzl/examples:hello-js-test --test_output=all
```

Build the engine:
```
bazel build --platforms=//bzl:wasm32 //reality/app/xr/js:xr-js
```

Build the engine with the WASM release SIMD configuration:
```
bazel build --config=wasmreleasesimd //reality/app/xr/js:xr-js
```

Serve the engine (used for testing and development):
```
bazel run --platforms=//bzl:wasm32 //reality/app/xr/js:serve-xr
```

Download Omniscope datasets:
```
bazel run //reality/quality/datasets:dataset-sync -- --direction=down --dataset=all --local=${HOME}/datasets
```

Run Omniscope:
```
bazel run //apps/client/internalqa/omniscope/imgui:omniscope
```

# Advanced Topics

## Tools to catch memory errors
Here are tools you can use to catch memory errors:
* Asan:
  * `bazel run --copt=-fsanitize=address --linkopt=-fsanitize=address //bzl/examples:hello-cc-test`
    * You can also run this with `bazel run --config=asan //bzl/examples:hello-cc-test`
    * If you encounter problems like `Library not loaded: '@rpath/libclang_rt.asan_osx_dynamic.dylib`, then run `bazel clean --expunge` and try again. If the error still persists, add `tags = ["no-cache"],` to the test target and re-run.
  * `bazel run --copt=-fsanitize=undefined --linkopt=-fsanitize=undefined //bzl/examples:hello-cc-test`

## Bazel Caching
To learn about Bazel caching, please see [ci-support/bazel-cache-tools/README.md](ci-support/bazel-cache-tools/README.md).
