#!/bin/bash
set -e

# Increase max number of file descriptors
ulimit -n 20000

if [[ $EXECUTABLE_NAME == "console" ]]; then
  npm run console:eb
elif [[ $EXECUTABLE_NAME == "apps" ]]; then
  npm run apps:eb
else
  echo "Warning: Unknown executable name, falling back to npm run console"
  npm run console
fi
