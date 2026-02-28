#!/bin/bash

# Copyright (c) 2017 8th Wall, Inc.
# Original Author: Tony Tomarchio (tony@8thwall.com)

# This script will uninstall unity and reinstall the latest version with appropriate plugins

. `dirname $0`/bootstrap_funcs.sh

#print_banner "Ask for sudo password upfront"
#sudo -v # ask for sudo upfront

# Unity: configure Android SDK & NDK settings:
pListSet ~/Library/Preferences/com.unity3d.UnityEditor5.x.plist :AndroidNdkRoot "/usr/local/share/android-ndk"
pListSet ~/Library/Preferences/com.unity3d.UnityEditor5.x.plist :AndroidSdkRoot "/usr/local/share/android-sdk"

