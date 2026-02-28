#!/bin/bash
set -e

PACKAGE="com.the8thwall.dynamicurl.android"
ACTIVITY="android.app.NativeActivity"

if [ -z "$1" ]; then
  echo "Error: Missing App URL $1"
  echo "Usage: $0 https://example.8thwall.app/myproject"
  exit 1
fi
if [ -n "$2" ]; then
  BAZEL_SERIAL="--adb_arg=-s --adb_arg=$2"
  SERIAL="-s $2"
fi
bazel build \
  --platforms=//bzl:android_arm64 \
  --config=angle \
  ${BAZEL_SERIAL} \
  //apps/client/nae/dynamicurl:dynamicurl-android
trap '{ adb ${SERIAL} shell am force-stop ${PACKAGE}; exit 1; } ' INT
adb ${SERIAL} logcat -c
adb ${SERIAL} install -d -r bazel-bin/apps/client/nae/dynamicurl/dynamicurl-android.apk
adb ${SERIAL} shell am start -n ${PACKAGE}/${ACTIVITY} --es "app_url_key" "$1"

PID=""
TIMEOUT=5
START_TIME=$(date +%s)
while [ -z "$PID" ]; do
  CURRENT_TIME=$(date +%s)
  ELAPSED_TIME=$((CURRENT_TIME - START_TIME))
  if [ $ELAPSED_TIME -ge $TIMEOUT ]; then
    echo "Timeout: Failed to get the PID within $TIMEOUT seconds."
    exit 1
  fi
  set +e
  PID=$(adb ${SERIAL} shell pidof ${PACKAGE})
  set -e
done

adb ${SERIAL} logcat -v color --pid=$PID *:I
