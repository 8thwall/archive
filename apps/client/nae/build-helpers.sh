#!/bin/bash

function set_default() {
  local var_name=$1
  local default_value=$2

  if [ -z "${!var_name}" ]; then
    eval "$var_name=\"$default_value\""
    echo "Using default value for $var_name => ($default_value)"
  fi
}

function human_readable_byte_size() {
  local size=$1
  local units=("B" "KB" "MB" "GB" "TB")
  local unit_index=0

  while (( size >= 1024 && unit_index < ${#units[@]} - 1 )); do
    size=$(( size / 1024 ))
    unit_index=$(( unit_index + 1 ))
  done

  echo "${size} ${units[$unit_index]}"
}

function date_to_seconds() {
  local date="$1"
  date -j -f "%Y%m%d%H%M%S" "$date" "+%s"
}

function date_diff_in_hours() {
  local start_date="$1"
  local end_date="$2"

  local start_date_seconds=$(date_to_seconds "$start_date")
  local end_date_seconds=$(date_to_seconds "$end_date")

  local difference_seconds=$((end_date_seconds - start_date_seconds))
  echo $((difference_seconds / 3600))
}

function ios_device_id() {
  local device_id_regex="(.+) \(([0-9]+\.[0-9]+(\.[0-9]+)?)\) \(([^)]+)\)"
  # If you get an error saying:
  # "xcrun: error: unable to find utility "xctrace", not a developer tool or in PATH"
  # then you need to install Xcode command line tools:
  #   - xcode-select --install
  # If that doesn't work, you can try running:
  #   - sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
  local device_list=$(xcrun xctrace list devices | grep -E "$device_id_regex" | grep -v "Simulators")
  local device_id=$(echo "$device_list" | sed -E "s/$device_id_regex/\4/" | head -n 1)
  echo "$device_id"
}
