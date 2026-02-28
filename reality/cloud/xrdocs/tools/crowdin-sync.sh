#!/usr/bin/env bash

npm install

parent_path=$( cd "$(dirname "${BASH_SOURCE[0]}")" ; pwd -P )
cd "$parent_path"

npm run write-translations

if [ "$1" = "upload" ]; then
  echo "Uploading only..."
  npx crowdin upload --config="../crowdin.xrdocs.yml"
elif [ "$1" = "download" ]; then
  echo "Downloading only..."
  npx crowdin download --config="../crowdin.xrdocs.yml"
  npm run write-i18n-markdown-ids
else
  echo "Running full sync (upload + download)..."
  npx crowdin upload --config="../crowdin.xrdocs.yml"
  npx crowdin download --config="../crowdin.xrdocs.yml"
  npm run write-i18n-markdown-ids
fi

cd -
