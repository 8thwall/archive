#!/bin/bash
set -e

# TODO(lreyna): Turn this into Typescript to make things more configurable

# Set up the helper functions
source "apps/client/nae/build-helpers.sh"

# Default values
BAZEL_OUTPUT="bazel-bin/apps/client/nae/doty-run/osx/doty-run.app"
CONFIG_FILE_PATH="apps/client/nae/doty-run/osx/config-prod.json"

# Parse CLI flags
while [[ $# -gt 0 ]]; do
  case "$1" in
    --out)
      BAZEL_OUTPUT="$2"
      shift 2
      ;;
    --config)
      CONFIG_FILE_PATH="$2"
      shift 2
      ;;
    *)
      break
      ;;
  esac
done

CONFIG_DATA="$(cat "$CONFIG_FILE_PATH")"
if [ -z "$CONFIG_DATA" ]; then
  echo "Error: Failed to read config file at $CONFIG_FILE_PATH" >&2
  exit 1
fi

SHELL_TYPE="$(echo "$CONFIG_DATA" | jq -r '.shell')"
BUNDLE_ID="$(echo "$CONFIG_DATA" | jq -r '.appInfo.bundleIdentifier')"

REPO_ROOT="$(git rev-parse --show-toplevel)"

if [ "$SHELL_TYPE" == "android" ] || [ "$SHELL_TYPE" == "quest" ]; then
  ACTIVITY="android.app.NativeActivity"

  set_default VERSION_CODE 1
  set_default VERSION_NAME 0.0.1

  if [ -n "$1" ]; then
    BAZEL_SERIAL="--adb_arg=-s --adb_arg=$1"
    SERIAL="-s $1"
  fi

  if [[ -n "$KEYSTORE_FILE" && -n "$UPLOAD_KEYSTORE_PASSWORD" && -n "$UPLOAD_KEYSTORE_ALIAS" ]]; then
    echo "Preparing app signing variables..."
    KEYSTORE_FILE_PATH=$(realpath $KEYSTORE_FILE)
    KS_PATH_OPTION="--android.ksPath=$KEYSTORE_FILE_PATH --android.ksPass=$UPLOAD_KEYSTORE_PASSWORD --android.ksAlias=$UPLOAD_KEYSTORE_ALIAS"
  else
    KS_PATH_OPTION=""
  fi

  bazel run \
    --run_under="cd $PWD && " //reality/app/nae/packager:packager -- \
    --config=$CONFIG_FILE_PATH \
    --appInfo.versionCode=$VERSION_CODE \
    --appInfo.versionName=$VERSION_NAME \
    $KS_PATH_OPTION \
    --out=$BAZEL_OUTPUT

  trap '{ adb ${SERIAL} shell am force-stop ${BUNDLE_ID}; exit 1; } ' INT
  adb ${SERIAL} logcat -c
  adb ${SERIAL} install -d -r "$BAZEL_OUTPUT"
  adb ${SERIAL} shell am start -n ${BUNDLE_ID}/${ACTIVITY}

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
    PID=$(adb ${SERIAL} shell pidof ${BUNDLE_ID})
    set -e
  done

  adb ${SERIAL} logcat -v color --pid=$PID *:I
elif [ "$SHELL_TYPE" == "ios" ]; then
  # NOTE(lreyna): You will need to have built a bazel target after setting up your Xcode and Apple
  # Developer account for `bazel-code8/external/apple-developer-team/BUILD` to exist.

  # Can override PROVISIONING_PROFILE_PATH if it's already defined:
  if [ -z "$PROVISIONING_PROFILE_PATH" ]; then
    APPLE_DEV_BUILD_PATH="$REPO_ROOT/bazel-code8/external/apple-developer-team/BUILD"
    if [ ! -f "$APPLE_DEV_BUILD_PATH" ]; then
      echo "Error: The Apple Developer Team BUILD file does not exist.
        Please ensure you have set up your Xcode and Apple Developer account correctly."
      exit 1
    fi

    # NOTE(lreyna): The target //apple-developer-team:Wildcard Development can't be queried directly
    # because it has a space in the name, so we use awk as a workaround to extract the profile path.
    PROVISIONING_PROFILE_PATH=$(awk '
      /string_flag\(/ {in_flag=1; name=0}
      /name = "Wildcard Development"/ {if (in_flag) name=1}
      in_flag && name && /build_setting_default/ {
        # Extract value between first pair of double quotes
        match($0, /"[^"]+"/)
        val = substr($0, RSTART+1, RLENGTH-2)
        print val
        exit
      }
      /\)/ {in_flag=0}
      ' $APPLE_DEV_BUILD_PATH)
  fi

  APPLE_CERTIFICATE=$(
    bazel query @apple-developer-team//:personal-certificate --output=build \
    | grep build_setting_default \
    | sed -E 's/.*build_setting_default = "(.*)",/\1/')

  bazel run \
    --run_under="cd $PWD && " //reality/app/nae/packager:packager -- \
    --config=$CONFIG_FILE_PATH \
    --apple.provisioningProfile="$PROVISIONING_PROFILE_PATH" \
    --apple.certificate="$APPLE_CERTIFICATE" \
    --out=$BAZEL_OUTPUT

  device_id=$(ios_device_id)
  if [ -z "$device_id" ]; then
    echo "No device found. Please connect a device and try again."
    exit 1
  fi
  echo "Using device: $device_id"

  xcrun devicectl device install app --device $device_id $BAZEL_OUTPUT

  xcrun devicectl device process launch --console --device $device_id $BUNDLE_ID
elif [ "$SHELL_TYPE" == "osx" ]; then
  bazel run \
    --run_under="cd $PWD && " //reality/app/nae/packager:packager -- \
    --config=$CONFIG_FILE_PATH \
    --out=$BAZEL_OUTPUT

  open $BAZEL_OUTPUT
else
  echo "Unsupported shell type: $SHELL_TYPE"
  exit 1
fi
