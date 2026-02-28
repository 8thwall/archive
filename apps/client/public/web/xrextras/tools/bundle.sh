#!/bin/bash
set -e
rm -rf dist

echo "Building..."
npm run build
timestamp=$(echo "console.log(Date.now().toString(36))" | node)

# XRExtras
echo "Zipping xrextras..."
cd dist/external/xrextras
zip_path="xrextras-$timestamp.zip"
zip -r "$zip_path" ./xrextras.js resources LICENSE -x '**/.*' -x '**/__MACOSX'
echo "Zipped xrextras to:"
realpath "$zip_path"
cd ../../..

# XRExtras Shared Resources
echo "Zipping xrextras-shared-resources..."
cd dist/external/xrextras-shared-resources
shared_resources_zip_path="xrextras-shared-resources-$timestamp.zip"
zip -r "$shared_resources_zip_path" . -x '**/.*' -x '**/__MACOSX'
echo "Zipped xrextras-shared-resources to:"
realpath "$shared_resources_zip_path"
