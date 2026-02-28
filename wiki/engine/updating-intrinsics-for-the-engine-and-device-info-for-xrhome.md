# Updating intrinsics for the engine & device info for XRHome

Both the engine and XRHome benefit from having updated info on new devices. For the engine, updated intrinsics benefit engine performance, as you can see here: `<REMOVED_BEFORE_OPEN_SOURCING>` (Google Sheet). For XRHome, correct device info silences console warnings and shows the correct phone model in the console logs tab for a connected device.

Here is how you can keep this info up to date :)

# Updating the engine

There are two steps:

### 1) Detection of device

 * Go to `reality/app/xr/js/src/js-device.js`'s `detectIOsModel()`.

 * Determine `width` and `height` for the device. This can be done by checking out the values at the bottom of the pipeline-tester's "Device Info" view. Or, you can open up an 8th Wall app, go to the xrhome console, and do `console.log(``width: ${window.screen.width * window.devicePixelRatio} height: ${window.screen.height * window.devicePixelRatio}``)`

 * Turn on Display Zoom (<https://support.apple.com/en-in/guide/iphone/iphd6804774e/ios)> and repeat.

**Note** : This information is also available online, see: <https://ios-resolution.com/.> The main issue is that it is hard to find stats on Display Zoom sizing. But this site is useful to check that your numbers match up.

### 2) Device intrinsics

 * Print the checkboard saved here: `<REMOVED_BEFORE_OPEN_SOURCING>` (Google Doc)

 * Go to `apps/client/calibratejs/calibrate.cc` and set the parameters. e.g. number of inner corners for the chessboard, sizing of each square. You generally don't need to do this.

 * Run `calibratejs` with `~/repo/code8$ ./apps/client/calibratejs/serve.sh`.

 * Run the app get the focal length. When doing so make sure to get it from different angles (try to go as far as the app will let you). You want as much perspective distortion as the detector will allow b/c in-plane images give no info about focal length.

 * Add this to `reality/engine/geometry/intrinsics.cc` as a new enum.

 * Now add the mapping between the phone model string and your enum. Check in `js-device.js` to see what the model string it sends is. One way to do this would be to add a console.log into `js-device.js` to see what the system parses as the manufacturer and model fields. You can then run a local engine and get this string printed in the console (direct USB debugging connection or 8th Wall editor).

Note that the phone model and manufacturer strings may not be what you expect, as we sometimes can only narrow down the phone to one of several models. Finally,

 * Add appropriate handling in `getDeviceModel` (`device-infos.cc`) and `getFallbackCameraIntrinsics` (`intrinsics.cc`)

**Note** : You can also do this on your monitor instead of printing out the board, just adjust the size of the boardand measure it as you would if you printed it (recommended target size is 2cm). Note(Paris): You may want to do this in addition to printing it out, as I got different values between the two.

# Updating XRHome

 * Go to `reality/cloud/xrhome/src/client/editor/device-models.ts`'s `detectIOSDeviceTitle`.

 * Determine `width` and `height` for the device. Get the device height in inches by doing TODO(paris): I believe you just Google around for it, i.e. something like: <https://28b.co.uk/ios-device-dimensions-reference-table/.>

# Updating webvr-polyfill-dpdb

When building an app with 8th Wall you may see the `No DPDB device match.` and `Failed to recalculate device parameters.` console errors. These are fairly easy to fix - you just need to update <https://github.com/immersive-web/webvr-polyfill-dpdb.> This repo holds a JSON file that webvr-polyfill relies on, which AFrame in turn relies on. It seems that no one is keeping this up to date. As of Dec 2020 the most recent iOS addition was the iPhone XR in Nov 2019. To update the values:

 * You will need to follow these instructions: <https://github.com/immersive-web/webvr-polyfill-dpdb#adding-a-device>

 * And here is a sample PR which outlines the calculations needed: <https://github.com/immersive-web/webvr-polyfill-dpdb/pull/62>
