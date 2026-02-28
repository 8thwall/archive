---
id: requirements
---
# Requirements

**All projects** must display the [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing) 
badge on the loading page. It's included by default in the `Loading Module` and cannot be removed.
Please see [here](/legacy/guides/advanced-topics/load-screen/) for instructions on customizing the Load Screen.

## Web Browser Requirements {#web-browser-requirements}

Mobile browsers require the following functionality to support 8th Wall Web experiences:

* **WebGL** (canvas.getContext('webgl') || canvas.getContext('webgl2'))
* **getUserMedia** (navigator.mediaDevices.getUserMedia)
* **deviceorientation** (window.DeviceOrientationEvent - only needed if SLAM is enabled)
* **Web-Assembly/WASM** (window.WebAssembly)

**NOTE**: 8th Wall Web experiences must be viewed via **https**. This is **required** by browsers for **camera access**.

This translates to the following compatibility for iOS and Android devices:

* iOS:
  * **Safari** (iOS 11+)
  * **Apps** that use **SFSafariViewController** web views (iOS 13+)
    * Apple added getUserMedia() support to SFSafariViewController in iOS 13.  8th Wall works within iOS 13 apps that use SFSafariViewController web views.
    * Examples: Twitter, Slack, Discord, Gmail, Hangouts, and more.
  * **Apps/Browsers** that use **WKWebView** web views (iOS 14.3+)
    * Examples:
      * Chrome
      * Firefox
      * Microsoft Edge
      * Facebook
      * Facebook Messenger
      * Instagram
      * and more...
* Android:
  * **Browsers** known to natively support the features required for WebAR:
    * **Chrome**
    * **Firefox**
    * **Samsung Internet**
    * **Microsoft Edge**
  * **Apps** using Web Views known to support the features required for WebAR:
    * Twitter, WhatsApp, Slack, Gmail, Hangouts, Reddit, LinkedIn, and more.

#### Link-out support {#link-out-support}

For apps that don’t natively support the features required for WebAR, our XRExtras library provides flows to direct users to the right place, maximizing accessibility of your WebAR projects from these apps.

Examples: TikTok, Facebook (Android), Facebook Messenger (Android), Instagram (Android)

Screenshots:

Launch Browser from Menu (iOS) | Launch Browser from Button (Android) | Copy Link to Clipboard |
--- | --- | --- |
![iOS](/images/launch-browser-from-menu.jpg) | ![Android](/images/launch-browser-from-button.jpg) | ![copy to clipboard](/images/copy-link-to-clipboard.jpg) |

## Supported Frameworks {#supported-frameworks}

8th Wall Web is easily integrated into 3D JavaScript frameworks such as:

* A-Frame (<https://aframe.io/>)
* three.js (<https://threejs.org/>)
* Babylon.js (<https://www.babylonjs.com/>)
* PlayCanvas (<https://www.playcanvas.com>)


