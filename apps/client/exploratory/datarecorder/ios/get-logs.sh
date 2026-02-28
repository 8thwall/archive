#!/bin/bash

LOCAL_LOGPATH="${HOME}/datarecorder"
BUNDLE_ID="com.nianticlabs.DataRecorder"

function usage() {
    echo "usage: $0 [options]"
    echo "  -l              only list files, do not move"
    echo "  -i DEVICE_ID    id of the device to connect to"
    echo "  -b BUNDLE_ID    bundle id of app to grab files [${BUNDLE_ID}]"
    echo "  -d LOCAL_PATH   local path for log files  [${LOCAL_LOGPATH}]"
    echo "will pull all log files from remote device and save in \${LOCAL_PATH}/\${DEVICE_MODEL}"
    echo "deletes files on remote after syncing."
    exit 2
}

LIST_ONLY=false
while [ -n "$1" ]; do
  case $1 in
    -l) LIST_ONLY=true; shift;;
    -i) shift; SERIAL="-i $1"; shift;;
    -b) shift; BUNDLE_ID="$1"; shift;;
    -d) shift; LOCAL_LOGPATH="$1"; shift;;
    -r) shift; REMOTE_LOGPATH="$1"; shift;;
    *) usage;;
  esac
done

MODEL=$(ios-deploy ${SERIAL} -c | grep Found | grep USB | sed "s/.* '//;s/' .*//" | head -n 1)
MODEL_CLEAN=$(echo ${MODEL} | sed "s/[[:space:]]//g")

TMP=$(mktemp -d)
trap "rm -rf ${TMP}" EXIT


ADB="ios-deploy ${SERIAL} --bundle_id ${BUNDLE_ID}"
echo "Files on Remote: ${MODEL}"
${ADB} -l /tmp 2>&1 | grep log > ${TMP}/filelist
cat ${TMP}/filelist
if $LIST_ONLY; then
  exit
fi
if [ $(cat ${TMP}/filelist | wc -l) -eq 0 ]; then
  echo "no files to download"
  exit
fi

mkdir -p "${LOCAL_LOGPATH}/${MODEL_CLEAN}"

echo "Downloading..."
${ADB} -w /tmp --to $TMP 2>&1 | grep log
echo "Removing..."
find $TMP/tmp | grep log | while read file; do
  REMOTE_FILE=$(echo $file | sed 's|.*/tmp|/tmp|')
  echo ${REMOTE_FILE}
  mv "$file" "${LOCAL_LOGPATH}/${MODEL_CLEAN}"
  ${ADB} --rm ${REMOTE_FILE} &> /dev/null
done
echo "Saved files in ${LOCAL_LOGPATH}/${MODEL_CLEAN}"
