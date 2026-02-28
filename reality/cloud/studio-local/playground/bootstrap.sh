#!/bin/bash
set -e

cd ../ecs-build
./tools/build.sh
./tools/bundle.sh

cd ../playground
npm uninstall @8thwall/build
npm install ../ecs-build/8thwall-build-0.1.0.tgz
