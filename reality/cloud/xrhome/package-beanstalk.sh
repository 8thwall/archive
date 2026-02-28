#!/bin/bash
set -e

FOLDER_TO_PACKAGE=".ebextensions dist package.json server-dist node_modules .platform run-eb.sh"

echo "Packaging CONSOLE SERVER for ${LABEL}"

# Ensure we have a fresh install of all dependencies.
rm -rf node_modules

# Install node modules for Elastic Beanstalk environment
# These exports are because command line flags don't work:
# e.g. npm --target_arch=x64 --target_platform=linux install
export npm_config_platform=linux
export npm_config_arch=x64
export SHARP_IGNORE_GLOBAL_LIBVIPS=1

npm ci --force --legacy-peer-deps

# Package our front end
npm run dist

npm prune --omit=dev --legacy-peer-deps

# Time to create our zip file
OUTPUT_FILE="console-server.zip"
rm -f $OUTPUT_FILE
find $FOLDER_TO_PACKAGE \( -type l -o -type f \) | egrep -v 'BUILD|run-server-local.sh|storage/seeders|storage/migrations|^dist/sourcemaps' | xargs zip --symlinks $OUTPUT_FILE > /dev/null

# NOTE(dat): It's important you do NOT include the seeder files whose content might coincide with the DB data

echo ">>>>> Finished outputting to zip file $OUTPUT_FILE"
