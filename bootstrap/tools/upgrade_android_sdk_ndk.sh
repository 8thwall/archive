#!/bin/bash

# Copyright (c) 2017 8th Wall, Inc.
# Original Author: Tony Tomarchio (tony@8thwall.com)

. `dirname $0`/bootstrap_funcs.sh

print_banner "Uninstall Android SDK and NDK"
brew8 cask uninstall android-sdk
brew8 cask uninstall android-ndk

# Install Android SDK
print_banner "Install New Android SDK and NDK"
brew8 cask install android-sdk

# Install Android NDK. We explicitly download the API 26 release, as API 27+ no longer has platform
# specific includes: https://developercommunity.visualstudio.com/content/problem/171290/android-ndk-include-paths-are-incorrect.html
brew8 cask install https://raw.githubusercontent.com/caskroom/homebrew-cask/7ef0a7a277d022c0d93ea6371a10688ed4408d4b/Casks/android-ndk.rb

addBashRC "export ANDROID_HOME=/usr/local/share/android-sdk"
addBashRC "export ANDROID_SDK_ROOT=/usr/local/share/android-sdk"
addBashRC "export ANDROID_NDK_HOME=/usr/local/share/android-ndk"

echo "Contents of ~/.bashrc :"
echo " "
cat ~/.bashrc

# Determine location of sdkmanager
if [ -f /usr/local/share/android-sdk/tools/bin/sdkmanager ] ; then
  SDK_MANAGER="/usr/local/share/android-sdk/tools/bin/sdkmanager"
elif [ -f /usr/local/opt/android-sdk/tools/bin/sdkmanager ] ; then
  SDK_MANAGER="/usr/local/opt/android-sdk/tools/bin/sdkmanager"
else
  echo "sdkmanager not found"
fi

$SDK_MANAGER "extras;android;m2repository"
$SDK_MANAGER "platforms;android-29"
$SDK_MANAGER "platform-tools"
$SDK_MANAGER "build-tools;29.0.0"
$SDK_MANAGER "ndk;20.0.5594570"

# This is a hack to deal with an issue with the Android SDK tools directory
# See https://issuetracker.unity3d.com/issues/android-build-fails-when-the-latest-android-sdk-tools-25-dot-3-1-version-is-used
# https://dl.google.com/android/repository/tools_r25.2.5-macosx.zip
# https://dl.google.com/android/repository/sdk-tools-darwin-3859397.zip (probably newer)

print_banner "Downloading Android SDK Tools"
cd /tmp
if [ ! -f ./tools_r25.2.5-macosx.zip ]; then
  echo "tools zip file doesn't exist...downloading..."
  # Check to see if the installer is on the local 8th Wall file server to save on AWS bandwidth charges
  download_local=$(curl -s -k --head https://10.8.8.10/<REMOVED_BEFORE_OPEN_SOURCING>/android-sdk/tools_r25.2.5-macosx.zip | head -n 1 | awk '{ print $2 }')
  if [ $download_local == "200" ] ; then
    # -k to ignore the self signed cert
    echo "Downloading from 8th Wall server"
    curl -k -O --retry 5 https://10.8.8.10/<REMOVED_BEFORE_OPEN_SOURCING>/android-sdk/tools_r25.2.5-macosx.zip
  else
    echo "Downloading from AWS S3 bucket"
    curl -O --retry 5 https://s3-us-west-2.amazonaws.com/<REMOVED_BEFORE_OPEN_SOURCING>/android-sdk/tools_r25.2.5-macosx.zip
  fi
else
  echo "Android SDK Tools installer already cached...skip download"
fi

if [ -d /usr/local/share/android-sdk/tools ] ; then
  cd /usr/local/share/android-sdk
  mv /usr/local/share/android-sdk/tools /usr/local/share/android-sdk/tools.orig
  unzip /tmp/tools_r25.2.5-macosx.zip
fi
