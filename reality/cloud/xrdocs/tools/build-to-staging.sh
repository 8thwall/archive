#!/usr/bin/env bash
set -e
set -v
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Building XR Docs to deploy onto S3"

npm ci

echo "Starting translations download"
npm run crowdin:sync:download
echo ">>>>> Finished downloading translations"

# There should be no local changes if translations are up-to-date.
if [[ -n $(git status --porcelain) ]]; then
  echo "Error: Translations are out of date."
  echo "   1. Please download translations with \`npm run crowdin:sync:download\`"
  echo "   2. Merge into GitHub"
  echo "   3. Try deploying again."
  exit 1
fi

npm run build

mkdir -p build/assets/json/
npx ts-node ./tools/extract-release-notes.ts > build/assets/json/studio-release-notes.json

echo ">>>>> Finished building XrDocs"

echo "Uploading XR Docs to Staging"
$DIR/upload-website-then-link.sh staging
echo ">>>>> Finished upload to Staging"

echo "Starting staging docs invalidation"
$DIR/invalidate-deploy.sh staging
echo ">>>>> Finished invalidating staging docs"
