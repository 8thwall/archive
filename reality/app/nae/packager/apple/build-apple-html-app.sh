#!/bin/bash
set -e

function verify_argument() {
  local arg=$1
  local arg_name=$2
  local optional_flag=$3

  if [ "$optional_flag" != "optional" ] && [ -z "$arg" ]; then
    echo "Error: Missing $arg_name argument." >&2
    return 1
  fi

  echo "$arg"
}

# The output directory for our app, i.e. "foo/App.app".
APP_OUTPUT_PATH="$(verify_argument "$1" "app_output_path")"
echo "Building app at $APP_OUTPUT_PATH"
ARTIFACT_TYPE="${APP_OUTPUT_PATH##*.}"
if [ "$ARTIFACT_TYPE" != "app" ] && [ "$ARTIFACT_TYPE" != "ipa" ]; then
  echo "Error: Invalid artifact type. Must be 'app' or 'ipa'." >&2
  exit 1
fi

# We want APP_OUTPUT_DIR to be the directory where the .app bundle will be created.
# APP_OUTPUT_PATH is the full path of the output file, e.g. "foo/App.app" or "foo/App.ipa".
# If the artifact type is "ipa", we will create a .app bundle inside a "Payload" directory,
# and then zip that directory to create the .ipa file.
if [ "$ARTIFACT_TYPE" == "app" ]; then
  APP_OUTPUT_DIR="$APP_OUTPUT_PATH"
else
  APP_OUTPUT_DIR="${APP_OUTPUT_PATH%.ipa}.app"
fi

mkdir -p "$(dirname "$APP_OUTPUT_DIR")"

# The path to the html-shell .zip file, which contains the shell executable and javascript resources.
SHELL_ZIP_PATH="$(verify_argument "$2" "shell_zip_path")"

# The app URL, e.g. "https://threejs.org/examples/webgl_morphtargets_horse.html".
HTML_APP_URL="$3"
# The app bundle identifier, e.g. "com.nianticlabs.foo".
BUNDLE_IDENTIFIER="$(verify_argument "$4" "bundle_identifier")"
# The app team identifier, e.g. "AB12C34D56".
TEAM_IDENTIFIER="$(verify_argument "$5" "TEAM_IDENTIFIER" "optional")"
# The project app name, e.g. "doty-run".
APP_NAME="$(verify_argument "$6" "app_name")"
# The version code and name.
VERSION_CODE="$(verify_argument "$7" "version_code")"
VERSION_NAME="$(verify_argument "$8" "version_name")"

# Whether to skip signing.
SHOULD_SIGN="$(verify_argument "$9" "should_sign")"
if [ "$SHOULD_SIGN" != "true" ] && [ "$SHOULD_SIGN" != "false" ]; then
  echo "Error: Invalid should_sign argument. Must be 'true' or 'false', but was $SHOULD_SIGN." >&2
  exit 1
fi
# The entitlements.plist file path.
ENTITLEMENTS_TEMPLATE="$(verify_argument "${10}" "entitlements_template" "optional")"
if [ "$SHOULD_SIGN" == "true" ] && [ -z "$ENTITLEMENTS_TEMPLATE" ]; then
  echo "Error: Missing entitlements template argument." >&2
  exit 1
fi
# The Info.plist template file path.
INFO_PLIST_TEMPLATE="$(verify_argument "${11}" "info_plist_template")"
# The provisioning profile path.
PROVISIONING_PROFILE_PATH="$(verify_argument "${12}" "provisioning_profile_path" "optional")"
# The signing certificate path.
CERTIFICATE="$(verify_argument "${13}" "certificate" "optional")"

PLATFORM="$(verify_argument "${14}" "platform")"
if [ "$PLATFORM" != "ios" ] && [ "$PLATFORM" != "osx" ]; then
  echo "Error: Invalid platform argument. Must be 'ios' or 'osx'." >&2
  exit 1
fi

MIN_OS_VERSION="$(verify_argument "${15}" "min_os_version")"
if [[ ! $MIN_OS_VERSION =~ ^[0-9]+\.[0-9]+$ ]]; then
  echo "Error: Invalid minimum OS version argument. Must be in the format 'X.Y'." >&2
  exit 1
fi

RESOURCE_FILES="$(verify_argument "${16}" "resource_files" "optional")"
HTTP_CACHE_PATH="${17}"
COMMIT_ID="${18}"
NAE_BUILD_MODE="${19}"
ENCRYPTED_DEV_COOKIE="${20}"

# The app display name, e.g. "Doty Run".
APP_DISPLAY_NAME="$(verify_argument "${21}" "app_display_name")"
XCODE_MAJOR_VERSION="$(verify_argument "${22}" "xcode_major_version")"

# NOTE(lreyna): These values are based on the WORKSPACE's xcode stub. This could be updated to be
# more hermetic, but the stub is missing some binaries that could be used at runtime. They may also,
# not be supported by linux.
case "$XCODE_MAJOR_VERSION" in
  16)
    XCODE_VERSION_NUMBER="1640"
    XCODE_BUILD_NUMBER="16F6"
    ;;
  15)
    XCODE_VERSION_NUMBER="1540"
    XCODE_BUILD_NUMBER="15F31d"
    ;;
  *)
    echo "Unknown or Unsupported Xcode version: $XCODE_MAJOR_VERSION" >&2
    exit 1
    ;;
esac

SUPPORTED_INTERFACE_ORIENTATION_ARRAY="$(verify_argument "${23}" "supported_interface_orientation_array" "optional")"
if [[ "$PLATFORM" == "ios" && ! "$SUPPORTED_INTERFACE_ORIENTATION_ARRAY" =~ ^(\<string\>[^<]+\<\/string\>(\\n|[[:space:]])?)+$ ]]; then
  echo "Error: SUPPORTED_INTERFACE_ORIENTATION_ARRAY is NOT a valid list of string tag UI Interface options - \
i.e. <string>{value}</string>\n<string>{value2}</string>." >&2
  exit 1
fi

RUST_CODESIGN_BIN="$(verify_argument "${24}" "rust_codesign_bin" "optional")"
P12_FILE_PATH="$(verify_argument "${25}" "p12_file" "optional")"
if [ -n "$P12_FILE_PATH" ] && [[ ! "$P12_FILE_PATH" =~ \.p12$ ]]; then
  echo "Error: P12 file path must have a .p12 extension, got '$P12_FILE_PATH'." >&2
  exit 1
fi
P12_PASSWORD="$(verify_argument "${26}" "p12_password" "optional")"

# NOTE(lreyna): Default to old behavior of not using Rust Codesign if arguments are not provided.
if [ -z "$RUST_CODESIGN_BIN" ] || [ -z "$P12_FILE_PATH" ] || [ -z "$P12_PASSWORD" ]; then
  echo "Using legacy codesign method, since Rust Codesign arguments are not provided." >&2
  echo -e "\t - If this is not intended, provide a valid Rust Codesign binary, P12 file, and P12 password.\n" >&2
  RUST_CODESIGN_BIN=""
fi

if [ "$SHOULD_SIGN" == "true" ]; then
  if [ -z "$RUST_CODESIGN_BIN" ] && [ -z "$CERTIFICATE" ]; then
    echo "Error: Missing certificate argument for legacy codesign." >&2
    exit 1
  fi
fi

NIA_ENV_ACCESS_CODE="$(verify_argument "${27}" "nia_env_access_code" "optional")"

# Collect App Permissions
APP_PERMISSIONS_LIST="$(verify_argument "${28}" "app_permissions_list" "optional")"
APP_PERMISSIONS_DESCRIPTION_LIST="$(verify_argument "${29}" "app_permissions_description_list" "optional")"

DEFAULT_PERMISSION_TEMPLATE_STRING="This app requires \$PERMISSION_NAME access to fully function"

# Reference: https://www.iosdev.recipes/info-plist/permissions/
# Keys should match values from nae-constants.ts in IOS_AVAILABLE_PERMISSIONS
get_plist_key() {
  case "$1" in
    camera) echo "NSCameraUsageDescription" ;;
    location) echo "NSLocationWhenInUseUsageDescription" ;;
    microphone) echo "NSMicrophoneUsageDescription" ;;
    *) echo "" ;;
  esac
}

PERMISSIONS_ARRAY=()
if [ -n "$APP_PERMISSIONS_LIST" ]; then
  IFS=',' read -r -a permissions_array <<< "$APP_PERMISSIONS_LIST"

  # Only split descriptions if the variable is set and non-empty, otherwise create a list of empty strings
  if [ -n "$APP_PERMISSIONS_DESCRIPTION_LIST" ]; then
    IFS=',' read -r -a permission_descriptions <<< "$APP_PERMISSIONS_DESCRIPTION_LIST"
  else
    permission_descriptions=()
    for _ in "${permissions_array[@]}"; do
      permission_descriptions+=("")
    done
  fi

  # To prevent errors, make sure permission_descriptions is at least as long as permissions_array
  while [ "${#permission_descriptions[@]}" -lt "${#permissions_array[@]}" ]; do
    permission_descriptions+=("")
  done

  for i in "${!permissions_array[@]}"; do
    permission=${permissions_array[$i]}
    permission_description=${permission_descriptions[$i]}

    permission_plist_key=$(get_plist_key "$permission")
    if [[ -n "$permission_plist_key" ]]; then

      if [ -n "$permission_description" ]; then
        permission_description=$(echo "$permission_description" | base64 --decode)
      else
        permission_description=$(sed "s/\$PERMISSION_NAME/$permission/g" <<< "$DEFAULT_PERMISSION_TEMPLATE_STRING")
      fi

      PERMISSIONS_ARRAY+=("    <key>$permission_plist_key</key>")
      PERMISSIONS_ARRAY+=("    <string>$permission_description</string>")
    else
      echo "Warning: Unknown permission '$permission' ignored" >&2
    fi
  done
elif [ -n "$APP_PERMISSIONS_DESCRIPTION_LIST" ]; then
  echo "Warning: APP_PERMISSIONS_DESCRIPTION_LIST provided without APP_PERMISSIONS_LIST. Ignoring descriptions." >&2
fi

# Convert array to string with escaped newlines (required for sed)
PERMISSIONS_XML=""
for permission_line in "${PERMISSIONS_ARRAY[@]}"; do
  PERMISSIONS_XML="${PERMISSIONS_XML}${permission_line}\\n"
done
PERMISSIONS_XML="${PERMISSIONS_XML%$"\\n"}"

STATUS_BAR_VISIBLE="$(verify_argument "${30}" "status_bar_visible")"
# Invert the value for Info.plist, which uses the "UIStatusBarHidden" key
if [ "$STATUS_BAR_VISIBLE" == "true" ]; then
  STATUS_BAR_HIDDEN="false"
else
  STATUS_BAR_HIDDEN="true"
fi

echo "Will create app at $APP_OUTPUT_DIR"
# Clean up the output directory if it exists, remove any potential artifacts.
PARENT_DIR="$(dirname "$APP_OUTPUT_DIR")"
rm -rf "$APP_OUTPUT_PATH"

## Replace placeholders in the Info.plist with app values.
mkdir -p $APP_OUTPUT_DIR
if [ "$PLATFORM" == "osx" ]; then
  mkdir -p "$APP_OUTPUT_DIR/Contents"
fi
INFO_PLIST_PATH="$APP_OUTPUT_DIR/Info.plist"
if [ "$PLATFORM" == "osx" ]; then
  INFO_PLIST_PATH="$APP_OUTPUT_DIR/Contents/Info.plist"
fi
echo "INFO_PLIST_TEMPLATE: $INFO_PLIST_TEMPLATE"
echo "Writing Info.plist to $INFO_PLIST_PATH..."
sed -e "s|\$HTML_APP_URL|${HTML_APP_URL//&/\\&amp;}|g" \
    -e "s|\$TEAM_IDENTIFIER|$TEAM_IDENTIFIER|g" \
    -e "s|\$BUNDLE_IDENTIFIER|$BUNDLE_IDENTIFIER|g" \
    -e "s|\$APP_NAME|$APP_NAME|g" \
    -e "s|\$APP_DISPLAY_NAME|$APP_DISPLAY_NAME|g" \
    -e "s|\$VERSION_CODE|$VERSION_CODE|g" \
    -e "s|\$VERSION_NAME|$VERSION_NAME|g" \
    -e "s|\$MIN_OS_VERSION|$MIN_OS_VERSION|g" \
    -e "s|\$COMMIT_ID|$COMMIT_ID|g" \
    -e "s|\$NAE_BUILD_MODE|$NAE_BUILD_MODE|g" \
    -e "s|\$ENCRYPTED_DEV_COOKIE|$ENCRYPTED_DEV_COOKIE|g" \
    -e "s|\$XCODE_VERSION_NUMBER|$XCODE_VERSION_NUMBER|g" \
    -e "s|\$XCODE_BUILD_NUMBER|$XCODE_BUILD_NUMBER|g" \
    -e "s|\$SUPPORTED_INTERFACE_ORIENTATION_ARRAY|$SUPPORTED_INTERFACE_ORIENTATION_ARRAY|g" \
    -e "s|\$NIA_ENV_ACCESS_CODE|$NIA_ENV_ACCESS_CODE|g" \
    -e "s|\$PERMISSIONS_XML|$PERMISSIONS_XML|g" \
    -e "s|\$STATUS_BAR_HIDDEN|$STATUS_BAR_HIDDEN|g" \
    "$INFO_PLIST_TEMPLATE" > "$INFO_PLIST_PATH"

# Extract the contents of the shell zip file.
echo "Extracting shell zip file from $SHELL_ZIP_PATH to $APP_OUTPUT_DIR..."
unzip -q "$SHELL_ZIP_PATH" -d "$APP_OUTPUT_DIR"

# Rename the executable to the app name.
APP_BINARY_PATH="$APP_OUTPUT_DIR/$APP_NAME"
if [ "$PLATFORM" == "osx" ]; then
  APP_BINARY_PATH="$APP_OUTPUT_DIR/Contents/MacOS/$APP_NAME"
fi
echo "Moving shell executable to $APP_BINARY_PATH..."
if [ "$PLATFORM" == "ios" ]; then
  mv "$APP_OUTPUT_DIR/html-shell-ios" "$APP_BINARY_PATH"
else
  mv "$APP_OUTPUT_DIR/Contents/MacOS/html-shell-osx" "$APP_BINARY_PATH"
fi

# RESOURCE_FILES is a comma-separated list of resource files. Copy them all to the app bundle.
if [ -n "$RESOURCE_FILES" ]; then
  echo "Copying resource files ($RESOURCE_FILES) to $APP_OUTPUT_DIR..."
  IFS=',' read -r -a resource_files <<< "$RESOURCE_FILES"
  for resource_file in "${resource_files[@]}"; do
    cp -r "$resource_file" "$APP_OUTPUT_DIR/"
  done
  echo "Resource files processing complete."
else
  echo "No resource files provided. Skipping copy."
fi

if [ -n "$HTTP_CACHE_PATH" ]; then

  if [ "$PLATFORM" == "osx" ]; then
    mkdir -p "$APP_OUTPUT_DIR/Contents/Resources/"
    cp -r "$HTTP_CACHE_PATH" "$APP_OUTPUT_DIR/Contents/Resources/"
  elif [ "$PLATFORM" == "ios" ]; then
    # TODO(lreyna): Potentially support assets.car
    cp -r "$HTTP_CACHE_PATH" "$APP_OUTPUT_DIR/"
  else
    echo "Bundling assets are not yet support on this platform ($PLATFORM)"
  fi

fi

if [ "$SHOULD_SIGN" == "false" ]; then

  if [ "$PLATFORM" == "osx" ]; then
    echo "Skipping signing for macOS app..."
  else
    echo "Invalid platform ($PLATFORM) to create apps that are NOT signed. They cannot be installed otherwise."
    exit 1
  fi

  echo "Build Complete"
  exit 0
fi

# Copy the provisioning profile into the app bundle.
APP_PROVISIONING_PROFILE_PATH="$APP_OUTPUT_DIR/embedded.mobileprovision"
if [ "$PLATFORM" == "osx" ]; then
  APP_PROVISIONING_PROFILE_PATH="$APP_OUTPUT_DIR/Contents/embedded.provisionprofile"
fi
echo "Copying provisioning profile to $APP_PROVISIONING_PROFILE_PATH..."
if [ -n "$PROVISIONING_PROFILE_PATH" ]; then
  cp "$PROVISIONING_PROFILE_PATH" "$APP_PROVISIONING_PROFILE_PATH"
else
  echo "No provisioning profile provided. Skipping copy."
fi

# Remove .DS_Store files if find command exists
if command -v find &> /dev/null; then
  find "$APP_OUTPUT_DIR" -name .DS_Store -type f -delete
else
  echo "Warning: 'find' command not available. Skipping .DS_Store cleanup."
fi

# Sign all files in the app bundle.
# NOTE(lreyna): We don't use the rust codesign here, since its implementation does not encourage
# signing files individually. There were problems with the signing being reset when signing the main executable.
echo "Signing all files in $APP_OUTPUT_DIR..."
if [ -z "$RUST_CODESIGN_BIN" ]; then
  find "$APP_OUTPUT_DIR" -type file | while read file; do
    codesign --force --verify --sign "$CERTIFICATE" "$file"
  done
fi

# Determine the 'get-task-allow' value based on the provisioning profile.
if [ -f "$PROVISIONING_PROFILE_PATH" ]; then
  # Extract the 'get-task-allow' value from the provisioning profile.
  # If the xml logic needs to be more robust, we can use a cross-platform plutil tool.
  GET_TASK_ALLOW=$(openssl smime -inform der -verify -noverify -in "$PROVISIONING_PROFILE_PATH" 2> /dev/null \
    | grep -A 1 "<key>get-task-allow</key>" | grep -oE 'true|false')

  if [ $? -ne 0 ]; then
    echo "Error: Failed to extract get-task-allow from provisioning profile." >&2
    exit 1
  elif [[ "$GET_TASK_ALLOW" != "true" && "$GET_TASK_ALLOW" != "false" ]]; then
    echo "Error: Invalid get-task-allow value: '$GET_TASK_ALLOW'. Expected 'true' or 'false'." >&2
    exit 1
  fi
else
  echo "No provisioning profile provided. Defaulting get-task-allow to true."
  GET_TASK_ALLOW="true"
fi

# Write a temporary entitlements file. We do this so that we can replace placeholders in the entitlements template.
TEMP_DIR=$(mktemp -d)
ENTITLEMENTS_PATH="$TEMP_DIR/Entitlements.plist"
echo "Writing entitlements file to $ENTITLEMENTS_PATH..."
sed -e "s|\$TEAM_IDENTIFIER|$TEAM_IDENTIFIER|g" \
    -e "s|\$BUNDLE_IDENTIFIER|$BUNDLE_IDENTIFIER|g" \
    -e "s|\$GET_TASK_ALLOW|$GET_TASK_ALLOW|g" \
    "$ENTITLEMENTS_TEMPLATE" > "$ENTITLEMENTS_PATH"
echo "ENTITLEMENTS_PATH: $ENTITLEMENTS_PATH"

# Re-sign the main executable with extra arguments:
# 1. Sign with entitlements file.
#    - https://developer.apple.com/forums/thread/129980
# 2. Sign with --options=runtime.
#    - https://developer.apple.com/forums/thread/701514
echo "Re-signing main executable with entitlements..."
if [ -z "$RUST_CODESIGN_BIN" ]; then
  codesign --force --verify --options=runtime --entitlements "$ENTITLEMENTS_PATH" --sign "$CERTIFICATE" "$APP_BINARY_PATH"
else
  # Sign all of the files in the app bundle with Rust Codesign.
  $RUST_CODESIGN_BIN sign \
    --p12-file "$P12_FILE_PATH" \
    --p12-password "$P12_PASSWORD" \
    --entitlements-xml-file "$ENTITLEMENTS_PATH" \
    --code-signature-flags runtime \
    "$APP_OUTPUT_DIR"
fi

# Delete the temporary entitlements file.
echo "Deleting the temporary entitlements file..."
rm -f "$ENTITLEMENTS_PATH"

# Verify that codesigning was successful.
echo "Verifying codesigning..."
if [ -z "$RUST_CODESIGN_BIN" ]; then
  codesign --verify --deep --strict --verbose=3 "$APP_OUTPUT_DIR"
else
  $RUST_CODESIGN_BIN verify "$APP_BINARY_PATH"
fi

if [ "$ARTIFACT_TYPE" == "ipa" ]; then
  # Create an IPA file from the app bundle.
  echo "Creating IPA file from $APP_OUTPUT_DIR..."
  PAYLOAD_DIR="$PARENT_DIR/Payload"

  # Delete any existing Payload directory and artifacts, then create a new Payload directory.
  # NOTE(lreyna): Keeping the Payload directory around can be helpful for debugging, which is why
  # we don't delete it at the end of the script.
  # If apps are built in a tmp directory, it should be cleaned up automatically.
  rm -rf "$PAYLOAD_DIR"/*
  mkdir -p "$PAYLOAD_DIR"

  mv "$APP_OUTPUT_DIR" "$PAYLOAD_DIR"

  echo "Creating ZIP archive of Payload directory..."
  cd "$PARENT_DIR" > /dev/null
  zip -r "$(basename "$APP_OUTPUT_PATH")" Payload > /dev/null
  cd - > /dev/null

  echo "IPA created successfully at $APP_OUTPUT_PATH"
else
  echo "App built successfully at $APP_OUTPUT_DIR"
fi
