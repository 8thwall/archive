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

# The output app path, i.e. "/foo/App.apk" or "/bar/app.aab".
APP_OUTPUT_FILE="$(verify_argument "$1" "app_output_file")"
mkdir -p "$(dirname "$APP_OUTPUT_FILE")"
ARTIFIFACT_TYPE="${APP_OUTPUT_FILE##*.}"
if [ "$ARTIFIFACT_TYPE" != "apk" ] && [ "$ARTIFIFACT_TYPE" != "aab" ]; then
  echo "Error: Invalid artifact type. Must be 'apk' or 'aab'." >&2
  exit 1
fi

JAVA_BIN="$(verify_argument "$2" "java_bin")"
ANDROID_JAR="$(verify_argument "$3" "android_jar")"
AAPT2="$(verify_argument "$4" "aapt2")"
MANIFEST_MERGER_JAR="$(verify_argument "$5" "manifest_merger_jar")"
BUNDLETOOL="$(verify_argument "$6" "bundletool")"
SHELL_AAR_PATH="$(verify_argument "$7" "shell_aar_path")"
MANIFEST_TEMPLATE="$(verify_argument "$8" "manifest_template")"
HTML_APP_URL="${9}"
HTML_APP_PACKAGE="$(verify_argument "${10}" "html_app_package")"
MIN_SDK_VERSION="$(verify_argument "${11}" "min_sdk_version")"
TARGET_SDK_VERSION="$(verify_argument "${12}" "target_sdk_version")"
RESOURCE_FILES="$(verify_argument "${13}" "resource_files")"
SIGNING_KEY="$(verify_argument "${14}" "signing_key")"
NIA_ENV_ACCESS_CODE="${15}"
ENCRYPTED_DEV_COOKIE="${16}"
OCULUS_SPLASH_SCREEN_PATH="${17}"
KS_KEY_ALIAS="$(verify_argument "${18}" "ks_alias")"
KS_PASS="$(verify_argument "${19}" "ks_pass")"
VERSION_CODE="$(verify_argument "${20}" "version_code")"
VERSION_NAME="$(verify_argument "${21}" "version_name")"
HTTP_CACHE_PATH="${22}"
MANIFEST_OVERLAY_PATH="${23}"
COMMIT_ID="${24}"
NAE_BUILD_MODE="${25}"
JARSIGNER_BIN="$(verify_argument "${26}" "jarsigner_bin")"
TEMP_DIR_ARG="${27}"
SCREEN_ORIENTATION="$(verify_argument "${28}" "screen_orientation")"
STATUS_BAR_VISIBLE="$(verify_argument "${29}" "status_bar_visible")"
D8_BIN="$(verify_argument "${30}" "d8_bin")"

if [ -n "$TEMP_DIR_ARG" ]; then
  TEMP_DIR="$TEMP_DIR_ARG"
else
  TEMP_DIR=$(mktemp -d)
fi
echo "Using TEMP_DIR: $TEMP_DIR"

OCULUS_SPLASH_SCREEN_ENABLED="false"
if [ -n "$OCULUS_SPLASH_SCREEN_PATH" ]; then
  OCULUS_SPLASH_SCREEN_ENABLED="true"
fi

DEBUGGABLE="false"
if [ "$KS_KEY_ALIAS" == "androiddebugkey" ]; then
  DEBUGGABLE="true"
fi
echo "Debuggable: $DEBUGGABLE"

if [ -n "$MANIFEST_OVERLAY_PATH" ]; then
  OVERLAY_OPTION="--overlays $MANIFEST_OVERLAY_PATH"
else
  OVERLAY_OPTION=""
fi

# Extract the contents of the AAR
echo "Extracting shell AAR files..."
unzip -q "$SHELL_AAR_PATH" -d "$TEMP_DIR"/aar_extracted

# TODO(lreyna): See if this search should be more generic
JAVA_COMPILED_SOURCES="$TEMP_DIR/aar_extracted/classes.jar"
HAS_DEX_FILE="false"

# Convert compiled java to dex
if [ -f "$JAVA_COMPILED_SOURCES" ]; then
  echo "Converting compiled Java resources to DEX..."
  mkdir -p "$TEMP_DIR"/temp_bundle/dex

  # NOTE(lreyna): d8 tries to use the systemwide Java bin
  export JAVA_HOME=$(dirname $(dirname $JAVA_BIN))
  export PATH="$JAVA_HOME/bin:$PATH"
  $D8_BIN --output "$TEMP_DIR"/temp_bundle/dex/ $JAVA_COMPILED_SOURCES

  # D8 doesn't have a dry-run type of option for us to see if a classes.jar will produce DEX files.
  # So we manually check if the DEX files were created.
  if ls "$TEMP_DIR"/temp_bundle/dex/*.dex 1> /dev/null 2>&1; then
    HAS_DEX_FILE="true"
    echo "DEX files successfully created"
  else
    echo "No DEX files were produced"
    HAS_DEX_FILE="false"
  fi
fi

## Replace placeholders in the manifest with app values.
echo "Creating app manifest..."
mkdir -p "$TEMP_DIR"/app-manifest
sed -e "s|\$HTML_APP_URL|${HTML_APP_URL//&/\\&amp;}|g" \
    -e "s|\$NIA_ENV_ACCESS_CODE|$NIA_ENV_ACCESS_CODE|g" \
    -e "s|\$ENCRYPTED_DEV_COOKIE|$ENCRYPTED_DEV_COOKIE|g" \
    -e "s|\$HTML_APP_PACKAGE|$HTML_APP_PACKAGE|g" \
    -e "s|\$OCULUS_SPLASH_SCREEN_ENABLED|${OCULUS_SPLASH_SCREEN_ENABLED}|g" \
    -e "s|\$MIN_SDK_VERSION|$MIN_SDK_VERSION|g" \
    -e "s|\$TARGET_SDK_VERSION|$TARGET_SDK_VERSION|g" \
    -e "s|\$VERSION_CODE|$VERSION_CODE|g" \
    -e "s|\$VERSION_NAME|$VERSION_NAME|g" \
    -e "s|\$DEBUGGABLE|$DEBUGGABLE|g" \
    -e "s|\$NAE_BUILD_MODE|$NAE_BUILD_MODE|g" \
    -e "s|\$COMMIT_ID|$COMMIT_ID|g" \
    -e "s|\$SCREEN_ORIENTATION|$SCREEN_ORIENTATION|g" \
    -e "s|\$STATUS_BAR_VISIBLE|$STATUS_BAR_VISIBLE|g" \
    -e "s|\$HAS_DEX_FILE|$HAS_DEX_FILE|g" \
    "$MANIFEST_TEMPLATE" > "$TEMP_DIR"/app-manifest/AndroidManifest.xml

# Merge Manifests
echo "Merging manifests..."
"$JAVA_BIN" -jar "$MANIFEST_MERGER_JAR" \
  --main "$TEMP_DIR"/app-manifest/AndroidManifest.xml \
  --libs "$TEMP_DIR"/aar_extracted/AndroidManifest.xml \
  $OVERLAY_OPTION \
  --merge-type APPLICATION \
  --out "$TEMP_DIR"/AndroidManifest.xml

# Compile resources
## TODO(alvinp): Probably need to include res/ files from the aar, if any exist.
echo "Compiling resources..."
"$AAPT2" compile $(echo "$RESOURCE_FILES" | sed 's/,/ /g') -o "$TEMP_DIR"/compiled_resources.zip

mkdir -p "$TEMP_DIR"/linked_resources
mkdir -p "$TEMP_DIR"/compiled_resources

# Link resources and generate resources.pb
unzip "$TEMP_DIR"/compiled_resources.zip -d "$TEMP_DIR"/compiled_resources &> /dev/null

echo "Linking resources..."
"$AAPT2" link \
    -o "$TEMP_DIR"/linked_resources \
    -I "$ANDROID_JAR" \
    --manifest "$TEMP_DIR"/AndroidManifest.xml \
    -R "$TEMP_DIR"/compiled_resources/*.flat \
    --auto-add-overlay \
    --proto-format \
    --output-to-dir

echo "Resources compiled and linked"

# Prepare the structure for the App Bundle
echo "Preparing App Bundle file structure..."
mkdir -p "$TEMP_DIR"/temp_bundle/manifest
mkdir -p "$TEMP_DIR"/temp_bundle/lib/arm64-v8a
mkdir -p "$TEMP_DIR"/temp_bundle/res
mkdir -p "$TEMP_DIR"/temp_bundle/assets

# Move the files to their correct locations
echo "Moving files to the App Bundle structure..."
cp "$TEMP_DIR"/linked_resources/AndroidManifest.xml "$TEMP_DIR"/temp_bundle/manifest/AndroidManifest.xml
cp "$TEMP_DIR"/aar_extracted/jni/arm64-v8a/* "$TEMP_DIR"/temp_bundle/lib/arm64-v8a/
cp "$TEMP_DIR"/linked_resources/resources.pb "$TEMP_DIR"/temp_bundle/resources.pb

# If there are resources, move them to the res directory
cp -r "$TEMP_DIR"/linked_resources/res/* "$TEMP_DIR"/temp_bundle/res/

# If there are assets, move them to the assets directory
cp -r "$TEMP_DIR"/aar_extracted/assets/* "$TEMP_DIR"/temp_bundle/assets/

if [ -n "$HTTP_CACHE_PATH" ]; then
  cp -r "$HTTP_CACHE_PATH" "$TEMP_DIR"/temp_bundle/assets/
fi

if [ -n "$OCULUS_SPLASH_SCREEN_PATH" ]; then
  cp "$OCULUS_SPLASH_SCREEN_PATH" "$TEMP_DIR"/temp_bundle/assets/vr_splash.png
fi

# Create the zip file from the temp_bundle directory
echo "Creating zip file from temp bundle file structure..."
cd "$TEMP_DIR"/temp_bundle &> /dev/null
zip -r -0 ../temp_bundle.zip ./* &> /dev/null
cd - &> /dev/null

echo "Running Bundle Tool to generate AAB..."
# Build the Android App Bundle using bundletool
AAB_OUTPUT_FILE="$TEMP_DIR/app.aab"
"$JAVA_BIN" -jar "$BUNDLETOOL" build-bundle \
    --modules="$TEMP_DIR"/temp_bundle.zip \
    --output="$AAB_OUTPUT_FILE"

# If we are building an AAB, we should copy the AAB to the output directory and return.
if [ "$ARTIFIFACT_TYPE" == "aab" ]; then
  if [ -n "$SIGNING_KEY" ]; then
    echo "Signing the AAB..."
    # Until now, we've been signing the APK with bundletool, which required passwords to be prepended
    # with "pass:". Now we need to sign the AAB with jarsigner, which does not accept this format.
    STORE_PASS=$KS_PASS
    if [[ "$STORE_PASS" == pass:* ]]; then
      STORE_PASS="${STORE_PASS#pass:}"
    fi

    $JARSIGNER_BIN \
      -keystore "$SIGNING_KEY" \
      -storepass "$STORE_PASS" \
      -keypass "$STORE_PASS" \
      "$AAB_OUTPUT_FILE" \
      "$KS_KEY_ALIAS"
  fi

  echo "Copying AAB to $APP_OUTPUT_FILE..."
  cp "$AAB_OUTPUT_FILE" "$APP_OUTPUT_FILE"

  echo "Cleaning up temporary files..."
  rm -rf "$TEMP_DIR"

  echo "Build Complete"
  exit 0
fi

echo "Generating Universal APK from AAB..."
"$JAVA_BIN" -jar "$BUNDLETOOL" build-apks \
    --ks="$SIGNING_KEY" \
    --ks-key-alias="$KS_KEY_ALIAS" \
    --ks-pass="$KS_PASS" \
    --bundle="$AAB_OUTPUT_FILE" \
    --output="$TEMP_DIR"/app.apks \
    --mode=universal

echo "Extracting APK from AAB..."
cd "$TEMP_DIR" &> /dev/null
mkdir apks
unzip app.apks -d apks &> /dev/null
cd - &> /dev/null

echo "Copying APK to $APP_OUTPUT_FILE..."
cp "$TEMP_DIR"/apks/universal.apk "$APP_OUTPUT_FILE"

echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"

echo "Build Complete"
