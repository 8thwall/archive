#!/bin/bash
set -e

if [ -z "$DEPLOY_STAGE" ]; then
  echo "Error: DEPLOY_STAGE environment variable is required"
  exit 1
fi

if [ -z "$BUILDER_COMMAND" ]; then
  echo "Error: BUILDER_COMMAND is required (start, build, or publish)"
  exit 1
fi

export PLATFORM=${PLATFORM:-mac}
export ARCH=${ARCH:-arm64}

export DEPLOY_STAGE="$DEPLOY_STAGE"

if [ "$RELEASE" = "true" ] && [ "$DEPLOY_STAGE" = "prod" ]; then
  export S3_BUCKET_KEY="8w-us-west-2-web"
  export DEPLOY_PATH="web/desktop/rc/${PLATFORM}/${ARCH}"
  export CDN_URL="https://cdn.8thwall.com/web/desktop/latest/${PLATFORM}/${ARCH}"
else
  export S3_BUCKET_KEY="8w-us-west-2-web-test"
  export DEPLOY_PATH="web/desktop-test/${DEPLOY_STAGE}/${PLATFORM}/${ARCH}"
  export CDN_URL="https://cdn-dev.8thwall.com/${DEPLOY_PATH}"
fi

# Package @8thwall/build first
cd ../studio-local/ecs-build
./tools/build.sh
PACKAGE_FILE=$(./tools/bundle.sh)
mkdir -p ../../studiohub/build_package
cp "$PACKAGE_FILE" ../../studiohub/build_package/8thwall-build.tgz

# Then build electron app
cd ../../studiohub
./app-build.sh

case "$BUILDER_COMMAND" in
  "start")
    npx electron-builder install-app-deps
    electron .
    ;;
  "build")
    echo "Building Electron app with electron-builder..."
    npx electron-builder --config ../../../bazel-bin/reality/cloud/studiohub/builder.js --${PLATFORM} --${ARCH}
    ;;
  "publish")
    echo "Publishing Electron app with electron-builder..."
    npx electron-builder --config ../../../bazel-bin/reality/cloud/studiohub/builder.js --${PLATFORM} --${ARCH} --publish always
    ;;
  *)
    echo "Error: Unknown BUILDER_COMMAND '$BUILDER_COMMAND'. Use 'start', 'build', or 'publish'"
    exit 1
    ;;
esac
