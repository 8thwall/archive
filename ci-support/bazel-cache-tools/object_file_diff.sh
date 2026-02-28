#!/bin/sh

# This script can be used to look at differences between object files. You should first download an
# object file and save it.
#
#  Set up:
#  - `brew install diffoscope`
# - (Optional) Create an object file to compare. Example which has the correct variables set below:
#   `bazel clean && bazel build //bzl/examples:hello-cc-test && cp bazel-out/darwin_arm64-fastbuild/bin/bzl/examples/_objs/hello-cc-test/hello-cc-test.pic.o ${HOME}/object_file_diff/hello-cc-test_existing.pic.o`
#
#  To run:
#  - cd ~/repo/niantic && ./ci-support/bazel-cache-tools/object_file_diff.sh
#   - Note that this will only work on an M1 Mac. On an Intel Mac you'll need to update `new_object_file_path`.

####################################################################################################
#### 1. Configuration
####################################################################################################
# First we determine where we'll save data from this run.
date=$(date '+%m-%d-%I-%M%p-%S')
save_path="${HOME}/object_file_diff/${date}"
save_path_diffoscope_object_file="${save_path}/diffoscope_object_file"
save_path_diffoscope_otool="${save_path}/diffoscope_otool"
save_path_diffoscope_objdump="${save_path}/diffoscope_objdump"

# You should manually create this object file (i.e. with a local build or CI job) and save it here.
existing_object_file_path="${HOME}/object_file_diff/hello-cc-test_existing.pic.o"

# This is the target we will build.
target="//bzl/examples:hello-cc-test"
# And this is the object file to analyze after building the target.
new_object_file_path="${HOME}/repo/niantic/bazel-out/darwin_arm64-fastbuild/bin/bzl/examples/_objs/hello-cc-test/hello-cc-test.pic.o"

mkdir -p ${save_path}

red='\033[0;31m'
green='\033[0;32m'
yellow='\033[0;33m'
reset='\033[0m'

echo "${green}Set up:${reset}"
echo "  save_path: ${save_path}"
echo "  existing_object_file_path: ${existing_object_file_path}"
echo "  target: ${target}"
echo "  new_object_file_path: ${new_object_file_path}"

####################################################################################################
#### 2. Build and analyze results
####################################################################################################
bazel clean
bazel build ${target}

echo "${green}Finished build${reset}"
cp ${existing_object_file_path} ${save_path}/
cp ${new_object_file_path} ${save_path}/

existing_object_file_dumped="${save_path}/existing_object_file_dumped.txt"
new_object_file_dumped="${save_path}/new_object_file_dumped.txt"
objdump -s ${existing_object_file_path} > ${existing_object_file_dumped}
objdump -s ${new_object_file_path} > ${new_object_file_dumped}
echo "${green}Finished with objdump:${reset}"
echo "  existing_object_file_dumped: ${existing_object_file_dumped}"
echo "  new_object_file_dumped: ${new_object_file_dumped}"

existing_object_file_otool="${save_path}/existing_object_file_otool.txt"
new_object_file_otool="${save_path}/new_object_file_otool.txt"
otool -l ${existing_object_file_path} > ${existing_object_file_otool}
otool -l ${new_object_file_path} > ${new_object_file_otool}
echo "${green}\nFinished with otool:${reset}"
echo "  existing_object_file_otool: ${existing_object_file_otool}"
echo "  new_object_file_otool: ${new_object_file_otool}"

diffoscope --html-dir=${save_path_diffoscope_object_file} --output-empty ${existing_object_file_path} ${new_object_file_path}
diffoscope --html-dir=${save_path_diffoscope_objdump} --output-empty ${existing_object_file_dumped} ${new_object_file_dumped}
diffoscope --html-dir=${save_path_diffoscope_otool} --output-empty ${existing_object_file_otool} ${new_object_file_otool}
echo "${green}\nWe also have diffoscope output which we will open it up automatically.${reset}"
echo "  save_path_diffoscope_object_file: ${save_path_diffoscope_object_file}/index.html"
echo "  save_path_diffoscope_objdump: ${save_path_diffoscope_objdump}/index.html"
echo "  save_path_diffoscope_otool: ${save_path_diffoscope_otool}/index.html"
open ${save_path_diffoscope_object_file}/index.html
open ${save_path_diffoscope_objdump}/index.html
open ${save_path_diffoscope_otool}/index.html

echo "${green}Done${reset}"
