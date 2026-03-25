# MRCS Hologram: iOS 14 Fix

### iOS 14.0 - 14.2.1 (and 2020 iPhones) contain a bug that affects HLS streaming in WebGL, blocking HCAP (HLS) playback. 
This project falls back to HCAP (MP4) for those devices. Separately, there are also specific iOS webviews that block HCAP playback entirely.

![](https://media.giphy.com/media/mFAmlSthWAhEmRpvH8/giphy.gif)

### PREVIOUS WORKAROUND

MRCS .hcap files use HLS streaming by default in iOS, therefore HCAP playback is also broken by default. 
As a workaround to support devices on iOS 14.0, 14.0.1, or 14.1 until broad 14.2 adoption,
you can modify your .hcap file to prevent HLS streaming on these affected devices while allowing HLS on other platforms.**

### STEPS TO FIX: 
1. Open .hcap file
2. Search for "hlsUri" and add a letter to the end (as illustrated below)


![](https://static.8thwall.app/assets/modify-hcap-ypnnmel6ew.gif)


3. Save file
4. Upload .hcap + .mp4 + .bin files as an Asset Bundle
5. In aframe-components/hcap.js, update the file paths for both the modified (iOS 14) and unmodified HCAP asset bundles.

This will ensure the HLS version of the HCAP file continues to work elsewhere while iOS 14 will 
use the modified version.

### Read about the bug [here](https://bugs.webkit.org/show_bug.cgi?id=215908).
