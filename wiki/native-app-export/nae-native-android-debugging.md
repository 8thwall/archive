# NAE Native Android Debugging

Debugging by stepping through code and stopping at breakpoints / watchpoints can be immensely useful when tackling challenging problems. Being able to slowly and intentionally track the state of a running application can give a user more insight than spamming console logs. That said, this should only be used if the code you’re getting nowhere with print statements and are willing to wait for debug builds to compile.

This page is going to walk through setting up breakpoint debugging using Android Studio with the `//apps/client/nae/dragondash/android:dragon-dash` bazel build target. These steps are fairly general and can be applied to different android apps. If there are any issues or new strategies, please update the document. A nice win would be to set up this debugging through vscode directly, but we would need to collect all of the `adb` and other debugging commands used by Android studio into a runnable script.

NOTE: Debugging with the fastbuild / optimized APK is still a WIP, until the right `.so` paths for symbols and configuration are sorted out.

 1. Make sure you have Android CLI set up on your system:

 1. In code8, `bazel build @android-sdk//:stub`

 2. Add important Android binaries to your path:
```bash
export ANDROID_HOME=/opt/homebrew/share/android-commandlinetools

 export BUILD_TOOLS_VERSION=34.0.0
 export PATH=$PATH:"$ANDROID_HOME/build-tools/$BUILD_TOOLS_VERSION"
 export PATH=$PATH:"$ANDROID_HOME/platform-tools"
 export PATH=$PATH:"$ANDROID_HOME/cmdline-tools/latest/bin"
 export PATH=$PATH:"$ANDROID_HOME/emulator"
```

 2. Download Android Studio Code from: <https://developer.android.com/studio>

 3. Build the the bazel target in debug mode: `bazel build --platforms=//bzl:android_arm64 --config=angle --config=debug //apps/client/nae/dragondash/android:dragon-dash`

 1. Note: You need to do this to get symbols from the Android `.so`

 4. After building you should collect the path to the apk:

 1. i.e. `bazel-bin/apps/client/nae/dragondash/android/dragon-dash.apk`

 2. Then run `adb install <path_to_apk>` and make sure the app boots up. Note that debug builds are going to be SLOW, so if you see a black screen for a while it could still be working. Run `apps/client/nae/run-android-app.sh <package_name>` to easily open the app with android logs.

 5. Open Android Studio and Navigate to `File > Profile or Debug APK`

 1. This should open a new Android Studio project

 5. Open the project in Android Studio. Modify your debug configuration (`Run -> Edit Configurations -> Debugger` tab). Change “Debug Type”  to “native only”

 1. (MAYBE UNNECESSARY for debug APK, there was a notification in Android Studio mentioning that it found all of the relevant symbols) Point to any `.so` that you want to debug by adding it to “Symbol Directories”. i.e. for `libheadless-gl-addon-platform.so` add the complement directory (use the path on your system) like `/private/var/tmp/_bazel_lucas/38594d40c43ab903d136e895c662c8a3/execroot/_main/bazel-out/arm64-v8a-dbg-ST-045bf4cee607/bin/third_party/headless-gl/`

 6. Debugging can be started in a couple different ways. However, they seem semi flaky and may timeout, but can usually be done on a subsequent attempt:

 1. Click on the “debug” button, which should launch the app for you and attach the debugger:

 2. Launch the app like normal. Then, in Android Studio, Attach to the device using `Run -> “Attach Debugger to Android Process”`

 7. The debugger will start now. Click Pause in Android Studio to pause the app and then click `Console -> LLDB` to get to an LLDB terminal.

 1. Here you can run `image lookup -vn <native symbol>` to verify the `.so` llibs are loaded properly:

 2. To map the source code and properly set breakpoints in the next step, run `settings set settings set target.source-map . <path_to_code8_monorepo>`

 8. To set breakpoints, open a native source file in Android Studio (possibly by dragging files directly from Finder), then click on the line numbers you want to debug:

 1. Make sure the Red Circles have a 'checkmark' to indicate that the source has been mapped properly.

 9. Resume the program to hit your breakpoints and observe the threads / variables in the Debug menu in Android Studio. Happy debugging!

IMG_1008.MOV
