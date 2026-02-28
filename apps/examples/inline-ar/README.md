# A-Frame: Inline AR

This example embeds a WebAR experience inside an existing website via iframe. Inline AR can be very useful for
immersive articles, e-commerce product carousels, or any situation where you would prefer WebAR to
integrate more organically into a site's design.

![](https://media.giphy.com/media/IhC7JSbw4ivPlhxmLn/giphy.gif)

In this sample project, the AR iframe is housed inside the ```<div id="inline-ar">``` element which contains
several controls such as a 'Start AR' button, a close button, and a fullscreen toggle. The 'Start AR' 
button sets the ```<iframe src="">``` to be the url of the AR website, deferring the load process 
until the user initiates it. The close and fullscreen buttons only appear when camera permissions 
have been accepted for the AR website. Through the use of an intersection observer, the AR 
session ends automatically when the user scrolls the AR iframe out of view.

### Adding Close and Fullscreen Buttons

In [app.js](https://www.8thwall.com/8thwall/inline-ar/code/app.js#L124), an event listener controls when the "Close" and
 "Fullscreen" buttons appear based on when the camera permissions are accepted in the inner AR site. 
 Here is a simple component in the inner AR site that sends a message to the parent window when the camera opens:


```
const messageComponent = {
  init() {
    this.el.sceneEl.addEventListener('realityready', () => {
      window.parent.postMessage('acceptedCamera', '*')
    })
  },
}
```

## Setup for Android and iOS 15+

To allow Inline AR for Android and iOS 15+, you must include an *allow* parameter in your iframe 
with the following [feature-policy directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy#directives): 
```<iframe allow="camera;gyroscope;accelerometer;magnetometer;xr-spatial-tracking;microphone;"></iframe>```

NOTE: `microphone` is optional.

## LEGACY METHOD: Supporting iOS versions prior to iOS 15

The following is ONLY required for supporting Inline AR in iOS versions prior to iOS 15. Given the high adoption of iOS 15+, we NO LONGER recommend using this approach. 

See the latest iOS adoption stats from Apple: [https://developer.apple.com/support/app-store/](https://developer.apple.com/support/app-store/)

In addition to including the *allow* parameter with the correct [feature-policy directives](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Feature-Policy#directives) 
in your iframe as explained above, to support World Tracking projects on iOS versions prior to iOS 15, 
you must also include additional javascript on both the OUTER and INNER AR pages as explained below.

In these versions, Safari blocks ```deviceorientation``` and ```devicemotion``` event 
access from cross-origin iframes. To counter this, you must include two scripts in your project 
to ensure cross-compatibility with iOS when deploying World Tracking projects. This is not required
for Face Effects or Image Target projects (with [
disableWorldTracking](https://www.8thwall.com/docs/web/#xr8aframe) set to *true*).

When implemented correctly, this process enables the OUTER website to send motion events down to the 
INNER AR website, a requirement for World Tracking.

### For the OUTER website  (Required only for iOS<15 World Tracking)

'iframe.js' must be included in the **HEAD** of your **OUTER** website with this script tag:

```<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>```

When starting AR, register the XRIFrame by iframe ID:

```window.XRIFrame.registerXRIFrame(IFRAME_ID)```

When stoppping AR, deregister the XRIFrame: 

```window.XRIFrame.deregisterXRIFrame()```

### For the INNER AR website  (Required only for iOS<15 World Tracking)

'iframe-inner.js' must be included in the **HEAD** of your **INNER AR** website with this script tag:

```<script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>```

For AFrame projects, be sure to add the 'iframe-inner' component to your ```<a-scene>``` like so:

```<a-scene iframe-inner>```

For non-AFrame projects, add ```iframeInnerPipelineModule``` to the custom pipeline module section
in ```onxrloaded``` like so:
```
XR8.addCameraPipelineModules([ 
  // Custom pipeline modules
  iframeInnerPipelineModule,
])
```
---

Learn more about working with iframes in our 
[documentation](https://www.8thwall.com/docs/web/#working-with-iframes).
