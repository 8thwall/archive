# HMD Development in Studio

This document discusses the 8th Wall XR engine development and testing with Studio for HMD devices. Make sure the development on Studio is done and tested and is already deployed to <server> domain.

Make sure the HMD device and the dev machine are on the same local WiFi, e.g. `vessel-demark`

# Development Environment Setup

 1. Install Meta Quest Developer Hub from <https://developer.oculus.com/downloads/native-android/>

 2. Make sure your HMD can be connected to your Mac for USB debugging

 3. If you do not have a Studio project shared by <server> and cd-qa domains, follow this pageSetting up a Cloud Editor app on dev to create a project so that the built and published app can be seen in a browser tab in cd-qa.

 4. Add `manifest.json` to the project. Typical settings can be:
```json
{
  "version": 1,
  "config": {
    "runtimeUrl": "https://<dev-machine-ip>:8004/runtime.js",
    "dev8Url": "https://<dev-machine-ip>:9001/dev8.js",
    "preloadChunks": ["slam", "face"]
  }
}
```

 5. If a local version of `dev8`needs to be loaded, the port number in `apps/client/public/web/dev8/webpack.config.js`need to be changed to a new port other than `9000`because port `9000` is for Quest’s internal use therefore it’s blocked by Developer Hub. For the example above, the port number is changed to `9001`.

# Dev Token

 1. Open the project dashboard on <server>

 2. Click on `Device Authorization`

 3. Choose the right engine version. For example, choose `0.0.0.0` for the local engine. Input the URL for local engine, e.g. https://<dev-machine-ip>:8888/reality/app/xr/js/xr.js. The QR code image will be refreshed.

 4. Right click on the QR code image and `Copy Image Address`

 5. Edit the copied address to get the token address. For example, the QR image address is ` , the first part of the address need to be removed and the parameter URL should be transformed into a normal URL address. For this example, the token address is `

 6. In Meta Quest Developer Hub, copy the above token address and open it on Quest.

 7. The 8th Wall device authorization page should be loaded with correct engine version and URL.

# Debugging on HMD

 1. Get Dev Token following above steps

 2. Open these addresses on Quest to get past the security warnings:
```
https://<dev-machine-ip>:8888/reality/app/xr/js/xr.js
https://<dev-machine-ip>:8004/runtime.js
https://<dev-machine-ip>:9001/dev8.js
```

 3. Open the built Studio app in desktop browser in a browser tab, the app should work on desktop with void spaces. For example, the app address is at `

 4. Copy the built Studio app URL and open it on HMD. You should be able to debug the app.

 5. Open `chrome://inspect/#devices`on desktop Chrome, choose the HMD, and you can inspect the app page that’s running on the HMD device.

### Debugging WebXR with console logs

Sometimes you may want to view console logs in an HMD (such as when debugging WebXR applications in the Quest Browser). In order to view these logs:

 1. Create a threejs/webxr project.

 2. In that project maintain a global list called logEntries

 3. Override the `console.log` function to push to this list with the following:
```js
// Override console.log to capture the output
 (function() {
 const oldLog = console.log;
 console.log = function(...args) {
 oldLog.apply(console, args);

 // Store log message in an array
 const message = args.join(' ');
 logEntries.push(message);
 };
 })();
```

 4. Add this method at the bottom of your project code to create the download button listener:

```js
function downloadLogFile() {
 // Create a Blob from the log entries
 const blob = new Blob([logEntries.join('\n')], { type: 'text/plain' });

 // Create a link element to download the Blob as a file
 const link = document.createElement('a');
 link.href = URL.createObjectURL(blob);
 link.download = 'console_log.txt'; // Name of the file
 link.click(); // Trigger the download
}
```

 5. Create a simple HTML download button:
```js
const downloadButton = document.createElement('button');
 downloadButton.innerText = 'Download Log File';
 downloadButton.style.position = 'fixed';
 downloadButton.style.bottom = '10px';
 downloadButton.style.left = '10px';
 downloadButton.onclick = downloadLogFile;

 document.body.appendChild(downloadButton);
```

Note: In most cases, you’ll probably want to self-host this threejs sample and run it on device/in the HMD native browser. You can easily do so by exposing the localhost of your machine to the network and connect both your HMD and device to the same network. Make sure you host a **HTTPS** connection for WebXR.
