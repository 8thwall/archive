#!/bin/bash
set -e

PACKAGE="com.nianticlabs.apps.client.exploratory.nativebrowse.android"
ACTIVITY="android.app.NativeActivity"

if [ -n "$1" ]; then
  BAZEL_SERIAL="--adb_arg=-s --adb_arg=$1"
  SERIAL="-s $1"
fi
bazel build \
  --platforms=//bzl:android_arm64 \
  --config=angle \
  ${BAZEL_SERIAL} \
  //apps/client/exploratory/native-browse/android:native-browse
trap '{ adb ${SERIAL} shell am force-stop ${PACKAGE}; exit 1; } ' INT
adb ${SERIAL} logcat -c
adb ${SERIAL} install -d -r bazel-bin/apps/client/exploratory/native-browse/android/native-browse.apk
adb ${SERIAL} shell am start -n ${PACKAGE}/${ACTIVITY}

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
