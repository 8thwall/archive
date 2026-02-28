#!/bin/bash

set -e

REMOTE_LOGPATH="/sdcard/Download"
LOCAL_LOGPATH="${HOME}/datarecorder"

function usage() {
    echo "usage: $0 [options]"
    echo "  -s SERIAL       specify device"
    echo "  -d LOCAL_PATH   local path for log files  [${LOCAL_LOGPATH}]"
    echo "  -r REMOTE_PATH  remote path for log files [${REMOTE_LOGPATH}]"
    echo "will pull all log files from remote device and save in \${LOCAL_LOGPATH}/\${MODEL}"
    echo "deletes files on remote after syncing."
    exit 2
}

while [ -n "$1" ]; do
  case $1 in
    -s) shift; SERIAL="-s $1"; shift;;
    -d) shift; LOCAL_LOGPATH="$1"; shift;;
    -r) shift; REMOTE_LOGPATH="$1"; shift;;
    *) usage;;
  esac
done

ADB="adb ${SERIAL}"
SERIALNO=$(${ADB} get-serialno)
if [ -z "$SERIALNO" ]; then
  exit 1
fi
MODEL=$(adb devices -l | grep ${SERIALNO} | sed 's/.*model://;s/ .*//')
mkdir -p "${LOCAL_LOGPATH}/${MODEL}"

echo "Files on remote:"
${ADB} shell ls ${REMOTE_LOGPATH}/log.* 2> /dev/null
echo "Downloading..."
${ADB} shell ls ${REMOTE_LOGPATH}/log.* 2> /dev/null | while read file; do
    REMOTE_FILE=$(echo "${file}" | tr -d '\r')
    LOCAL_FILE="${LOCAL_LOGPATH}/${MODEL}/$(basename ${REMOTE_FILE})"
    echo ${LOCAL_FILE}
    ${ADB} pull ${REMOTE_FILE} ${LOCAL_FILE}
done
echo "Removing remote files..."
${ADB} shell rm ${REMOTE_LOGPATH}/log.* 2> /dev/null
echo "Saved files in ${LOCAL_LOGPATH}/${MODEL}"
