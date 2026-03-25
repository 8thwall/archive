# A-Frame: Inline AR

This example embeds a WebAR experience inside an existing website. Inline AR can be very useful for
immersive articles, e-commerce product carousels, or any situation where you would prefer WebAR to
integrate more organically in your site's design.

![](https://media.giphy.com/media/j6AzahiujLmHl9vMEW/giphy.gif)

In this sample project, the AR iframe is housed inside the ```<div id="inline-ar">``` element which contains
several controls such as a 'Start AR' button, camera-in-use indicator (that doubles as a 'Stop AR' button)
, and a fullscreen toggle. The 'Start AR' button sets the ```<iframe src="">``` to be the url of the AR website, 
deferring the load process until the user initiates it. The camera-in-use and fullscreen buttons only
appear when camera permissions have been accepted for the AR website. Through the use of an intersection
observer, the AR session ends automatically when the user scrolls the AR iframe out of view.

As a result of Safari blocking deviceorientation and devicemotion event access from cross-origin iframes,
you must include two scripts in your project to ensure cross-compatibility with iOS.

### For the OUTER website

'iframe.js' must be included in the HEAD of your OUTER website with this script tag:
```<script src="//cdn.8thwall.com/web/iframe/iframe.js"></script>```

After the page has loaded, register the XRIFrame to the window with this:
```window.XRIFrame.registerXRIFrame(IFRAME_ID)```

### For the INNER AR website

'iframe-inner.js' must be included in the HEAD of your INNER AR website with this script tag:
```<script src="//cdn.8thwall.com/web/iframe/iframe-inner.js"></script>```

For A-Frame projects, be sure to add the 'iframe-inner' component to your ```<a-scene>``` like so:
```<a-scene iframe-inner>```

-----------------------------------

Learn more about iframes in our [docs](https://www.8thwall.com/docs/web/#ios-8th-wall-web-inside-an-iframe).