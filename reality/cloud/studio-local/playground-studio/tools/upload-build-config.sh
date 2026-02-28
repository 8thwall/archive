#!/bin/bash
set -e

# Configuration
SOURCE_DIR=".."
S3_BUCKET="8w-us-west-2-web"
S3_KEY_PREFIX="web/offline-code-export/studio/build-config/"

TIMESTAMP=$(date +%Y%m%d%H%M)
ZIP_NAME="bundle-${TIMESTAMP}.zip"

echo "Starting config export process..."

# Check if required files/folders exist - fail if any are missing
if [ ! -d "${SOURCE_DIR}/config" ]; then
    echo "Error: config folder not found"
    exit 1
fi

if [ ! -f "${SOURCE_DIR}/package.json" ]; then
    echo "Error: package.json not found"
    exit 1
fi

if [ ! -f "${SOURCE_DIR}/tsconfig.json" ]; then
    echo "Error: tsconfig.json not found"
    exit 1
fi

# Create zip file
echo "Creating zip archive: ${ZIP_NAME}"
cd "${SOURCE_DIR}"

# Create external/tools directory if it doesn't exist
mkdir -p external/tools

# Use zip command to create archive
zip -r "external/tools/${ZIP_NAME}" \
    config/ \
    package.json \
    tsconfig.json \
    2>/dev/null

cd external/tools

# Check if zip was created successfully
if [ ! -f "${ZIP_NAME}" ]; then
    echo "Error: Failed to create zip file"
    exit 1
fi

ZIP_SIZE=$(stat -f%z "${ZIP_NAME}" 2>/dev/null || stat -c%s "${ZIP_NAME}" 2>/dev/null)
echo "Archive created: ${ZIP_NAME} (${ZIP_SIZE} bytes)"


echo "Uploading to s3://${S3_BUCKET}/${S3_KEY_PREFIX}${ZIP_NAME}"
aws s3 cp "${ZIP_NAME}" "s3://${S3_BUCKET}/${S3_KEY_PREFIX}${ZIP_NAME}" \
    --content-type "application/zip"

if [ $? -eq 0 ]; then
    echo "Upload successful!"

    # Clean up temporary file
    rm "${ZIP_NAME}"
    echo "Temporary zip file cleaned up"
else
    echo "Upload failed"
    exit 1
fi

echo "Config export completed successfully!"
