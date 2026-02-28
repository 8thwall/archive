#!/bin/bash

# Copyright (c) 2017 8th Wall, Inc.
# Original Author: Tony Tomarchio (tony@8thwall.com)

# This script will uninstall unity and reinstall the latest version with appropriate plugins

. `dirname $0`/bootstrap_funcs.sh

print_banner "Ask for sudo password upfront"
sudo -v # ask for sudo upfront

brew8 update

#print_banner "Uninstall Unity and Plugins"
brew8 cask uninstall unity-monodevelop
brew8 cask uninstall unity-android-support-for-editor
brew8 cask uninstall unity-ios-support-for-editor
brew8 cask uninstall unity

# Install Android SDK and NDK
print_banner "Install Unity and Plugins"
brew8 cask install unity
brew8 cask install unity-ios-support-for-editor
brew8 cask install unity-android-support-for-editor
brew8 cask install unity-monodevelop

# Unity: configure Android SDK & NDK settings:
pListSet ~/Library/Preferences/com.unity3d.UnityEditor5.x.plist :AndroidNdkRoot "/usr/local/share/android-ndk"
pListSet ~/Library/Preferences/com.unity3d.UnityEditor5.x.plist :AndroidSdkRoot "/usr/local/share/android-sdk"

print_banner "IMPORTANT: Remember to open Unity re-accept the license if prompted !!!"
