#!/bin/bash
set -e
if [ -n "$1" ]; then
  BAZEL_SERIAL="--adb_arg=-s --adb_arg=$1"
  SERIAL="-s $1"
fi
bazel build \
  -c opt \
  --platforms=//bzl:android_arm64 \
  ${BAZEL_SERIAL} \
  //apps/client/internalqa/omniscope/android:omniscope
trap '{ adb ${SERIAL} shell am force-stop com.the8thwall.Omniscope; exit 1; }' INT
adb ${SERIAL} install -d -r bazel-bin/apps/client/internalqa/omniscope/android/omniscope.apk
adb ${SERIAL} logcat -c
adb ${SERIAL} shell am start -n com.the8thwall.Omniscope/com.the8thwall.OmniscopeActivity
adb ${SERIAL} logcat -v color -s 8thWall,8thWallJava,Unity,libc,DEBUG,DynamiteClient,NianticJava,AndroidRuntime
