#!/bin/bash
set -e

BUILD_INFO_DIR=deployment/build-info

date -u +"%Y/%m/%d %T UTC" > $BUILD_INFO_DIR/buildTime

# NOTE(christoph): We have a different application per realm, so this allows us to upload the bundle
# to the correct application
function initEbConfig() {
  cp .elasticbeanstalk/$1.yml .elasticbeanstalk/config.yml
}

function printHelp() {
  echo "usage: ./package-deploy.sh [ENVIRONMENT]"
  echo -e "\n  Deploy a new applicaiton version to the given ElasticBeanstalk environment\n"
  echo "Environments:"
  echo -e "  Console-dev\t\tBuilds a dev version of xrhome and deploys to Console-dev"
  echo -e "  Console-Staging\tBuilds a prod version of xrhome and deploys to Console-Staging"
  echo -e "  Apps-dev\t\tBuilds a dev version of apps server and deploys to Apps-dev"
}

function checkLocalGitState() {
  # Exit early if we detect local changes.
  if [ $(git diff --name-only | wc -l) != 0 ]
  then
    echo "local git changes detected"
    echo "not deploying"
    exit 1
  fi

  git rev-parse HEAD > $BUILD_INFO_DIR/commitId
}

function buildEbPackage () {
  checkLocalGitState

  export MESSAGE=$(head -c 30 <<< $(git log -n 1 --pretty='%H %s'))

  case $1 in
    "All-dev")
      # Our fuse.js expects this to be the XRHOME_ENV for buildif flags gated on remote dev builds.
      export XRHOME_ENV=Console-dev
      export BUILDIF_FLAG_LEVEL='experimental'
      export LABEL="dev-console-server-$(date +%Y%m%d.%H%M%S)"
      ;;
    "cd-prod")
      export BUILDIF_FLAG_LEVEL='mature'
      export LABEL="xrhome-cd-prod-$(date +%Y%m%d.%H%M%S)"
      ;;
    "Console-Staging")
      export BUILDIF_FLAG_LEVEL='launch'
      export LABEL="prod-console-server-$(date +%Y%m%d.%H%M%S)"
      ;;
    *)
      echo "Error: Cannot build & deploy directly to ${1}"
      exit 1
      ;;
  esac

  echo "${LABEL}" > $BUILD_INFO_DIR/label

  npm run eb-package
}

function deployToEb() {
  case $1 in
    "All-dev")
      export XRHOME_ENV=ConsoleCdQa
      initEbConfig XrhomeQa
      eb deploy ${XRHOME_ENV} -l "${LABEL}" -m "${MESSAGE}"
      export XRHOME_ENV=AppsCdQa
      eb deploy ${XRHOME_ENV} -l "${LABEL}" -m "${MESSAGE}"
      ;;
    "cd-prod")
      initEbConfig XrhomeCdProd
      eb deploy ConsoleCdProd -l "${LABEL}" -m "${MESSAGE}"
      # TODO(christoph): Spin up apps
      # eb deploy AppsCdProd -l "${LABEL}" -m "${MESSAGE}"
      ;;
    "Console-Staging")
      unset XRHOME_ENV
      initEbConfig XrhomeProd
      eb deploy ConsoleRcProd -l "${LABEL}" -m "${MESSAGE}"
      ;;
    *)
      echo "Error: Cannot build & deploy directly to ${1}"
      exit 1
      ;;
  esac
}

# NOTE(kyle): On May 21 2025 we lost access to Niantic Artifactory. This function is unused until
# (1) we deem it necessary to run IIF and (2) get access to the IIF image in Spatial Artifactory.
function scanForInternalInformation() {
  echo "Scanning for internal information in the build..."
  rm -rf build-dist

  # Unpack just the "dist" folder, as those files are sent directly to end-user browsers.
  unzip -u console-server.zip "dist/*" -d build-dist > /dev/null

  # Run the Internal Information Finder (IIF) on the "dist" folder. Known public keys, such as
  # as the Google OAuth client key and Google Maps API client key are excluded.
  # If any other public keys are introduced, their respective hashes should be added to
  # th IIF_KNOWN_GOOD param.
  set +e
  docker run -e IIF_KNOWN_GOOD=REMOVED_BEFORE_OPEN_SOURCING1,REMOVED_BEFORE_OPEN_SOURCING2 \
    --rm -v ${PWD}/build-dist:/releasegate/scan artifactory.<REMOVED_BEFORE_OPEN_SOURCING>.<REMOVED_BEFORE_OPEN_SOURCING>/security-docker-local/internalinformationfinder \
    internalinformationfinder -c https://storage.googleapis.com/sec-swischmann-leakprotector-tfstate/92iMLPOsu22smcYjigHLBMBrf/rules.toml \
    --ignore-rules twitter_oauth,github,facebook_oauth --folder ./scan/dist

  if [ $? != 0 ]
  then
    echo "ERROR: Internal information found in the build. Stopping deployment."
    exit 1
  fi
  set -e

  rm -rf build-dist
  echo "COMPLETE: No internal information found in the build."
}

function uploadStaticAssets() {
  # Unzip files from /dist/static in the zip and upload them to s3
  rm -rf static-upload
  unzip -u console-server.zip -d static-upload dist/static/**.** > /dev/null
  npm install aws-sdk mime --legacy-peer-deps
  ./tools/upload-static-to-s3.js static-upload/dist 8w-xrhome-static
  rm -rf static-upload
}

function sendUploadSuccessSlackMessage() {
  curl -s -X POST https://slack.com/api/chat.postMessage \
    --data-urlencode "channel=8w-release-active" \
    --data-urlencode "token=${SLACK_TOKEN}" \
    --data-urlencode "username=xrhome.bot" \
    --data-urlencode "text=$(whoami) deployed new prod xrhome application version (${LABEL})"
}

if [ $# -lt 1 ]
then
  printHelp
  exit 1
fi

case $1 in
  "All-dev")
    buildEbPackage $1
    deployToEb $1
    ./upload-sourcemaps.sh
    ;;
  "cd-prod")
    buildEbPackage cd-prod
    deployToEb cd-prod
    ./upload-sourcemaps.sh
    ;;
  "Console-Staging")
    # TODO(alvin): Check params here

    case $2 in
      "deploy")
        node src/server/scripts/staging-deploy.js
        ;;
      "upload")
        buildEbPackage Console-Staging
        uploadStaticAssets
        deployToEb Console-Staging
        sendUploadSuccessSlackMessage
        # These are used for https://ac.8thwall.com/errors
        ./upload-sourcemaps.sh
        ./submit-build-info.js
        ;;
      *)
        printHelp
        exit 1
        ;;
    esac
    ;;
  *)
    printHelp
    exit 1
    ;;
esac
