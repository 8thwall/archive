#!/bin/bash
ROOT=$(cd $(dirname $0); bazel info workspace)

if [ ! -e "${ROOT}/bazel-bin/reality/quality/visualization/cvcamcalibration" ]; then
  echo "Building..."
  (cd ${ROOT} && bazel build //reality/quality/visualization:cvcamcalibration)
fi

function calibrate() {
  local OUTPUT="$1.calib.yaml"
  ${ROOT}/bazel-bin/reality/quality/visualization/cvcamcalibration -w=7 -h=7 -p=chessboard -n=10 -d=1000 -s=20 -o="${OUTPUT}" -op -oe -zt -a=1.0 -g
  echo "Wrote calibration to $OUTPUT"
}

if [ -n "$1" ]; then
  if [ "$1" == "-h" ]; then
    echo "usage: $0 [logfile]"
    echo "  if supplied, calibrate logfile, otherwise calibrate from network using logservice:main"
    exit 2
  fi
  FILE=$1
  echo "Calibrating $FILE"
  cat $FILE | calibrate $FILE
else
  if [ ! -e "${ROOT}/bazel-bin/apps/server/logservice/main" ]; then
    (cd ${ROOT} && bazel build --copt=-DC8_RELEASE_CONFIG_ENABLE_CONSOLE_LOGGING=false //apps/server/logservice:main)
  fi
  echo "Calibrating from logservice:main"
  ${ROOT}/bazel-bin/apps/server/logservice/main | calibrate $HOME/Desktop/cam
fi
