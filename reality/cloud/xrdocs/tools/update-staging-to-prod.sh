#!/usr/bin/env bash
set -e
set -v
DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Copying XR Docs Staging to Prod"
$DIR/update-links.sh staging prod
echo ">>>>> Finished deploying XrDocs Prod"

echo "Starting prod docs invalidation"
$DIR/invalidate-deploy.sh prod
echo ">>>>> Finished invalidating prod docs"