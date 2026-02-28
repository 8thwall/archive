# A-Frame: Capture Photo

This example allows the user to capture photo evidence of a UFO abduction. 

![](https://media.giphy.com/media/WSwp12dlhLyMPDWcZb/giphy.gif)

This project includes photo capture functionality through the use of 
[XRExtras.MediaRecorder](https://www.8thwall.com/docs/web/#customize-video-recording), 
[XR8.MediaRecorder](https://www.8thwall.com/docs/web/#xr8mediarecorder), and 
[XR8.CanvasScreenshot](https://www.8thwall.com/docs/web/#xr8canvasscreenshot).

We set ```<xrextras-capture-button>``` to **```capture-mode="photo"```** so that only photos are taken.
A watermark image is added and customized in ```<xrextras-capture-config>```. 

We also generate a message to 'Tap + Hold to Add to Photos' which appears when the 
**```mediarecorder-photocomplete```** event is emitted and hides when 
**```mediarecorder-previewclosed```** is emitted.

Learn more about customization with the XRExtras.MediaRecorder API 
[here](https://www.8thwall.com/docs/web/#customize-video-recording).
