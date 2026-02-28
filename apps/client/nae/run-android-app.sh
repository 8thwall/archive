#!/bin/bash
set -e

function verify_value() {
  local arg=$1
  local arg_name=$2
  local default_value=$3

  if [ -z "$arg" ]; then
    if [ -n "$default_value" ]; then
      arg="$default_value"
    else
      echo "Error: Missing $arg_name value." >&2
      return 1
    fi
  fi

  echo "$arg"
}

function clear_cache() {
  if [ "$CLEAR_CACHE" = true ]; then
    adb ${SERIAL} shell pm clear ${PACKAGE} &> /dev/null
  fi
}

DEFAULT_PACKAGE="com.the8thwall.splatviewer"
ACTIVITY="android.app.NativeActivity"
CLEAR_CACHE=false

while [[ $# -gt 0 ]]; do
  case $1 in
    --serial)
      SERIAL="-s $2"
      shift 2
      ;;
    --clear-cache)
      CLEAR_CACHE=true
      shift
      ;;
    *)
      # If PACKAGE is not set, treat the first positional argument as the package name
      if [ -z "$PACKAGE" ]; then
        PACKAGE="$1"
      else
        echo "Unknown option: $1"
        exit 1
      fi
      shift
      ;;
  esac
done

PACKAGE="${PACKAGE:-$DEFAULT_PACKAGE}"

echo "Package: $PACKAGE"
echo "Clear Cache: $CLEAR_CACHE"

if [ -z "$SERIAL" ]; then
  echo "No serial specified. Using default device."
else
  echo "Serial: $SERIAL"
fi

clear_cache

trap '{ adb ${SERIAL} shell am force-stop ${PACKAGE}; exit 1; } ' INT
adb ${SERIAL} logcat -c
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
