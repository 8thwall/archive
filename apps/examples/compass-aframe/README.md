This project demonstrates how to access compass data across iOS and non-iOS devices.

iOS devices require a user interaction to prompt device orientation permissions. 
You don't need to worry about this for normal AR experiences -- permissions are captured before the user sees the camera feed. 
Since this sample project uses the Lightship Maps module, the user must click the *start compass* button to request device orientation sensors.

You might notice some inconsistency between devices. This is the case even when using native compass apps. 

It can be helpful to compare native compass apps to understand that results will never be 100% accurate across all devices due to differences in hardware.

This web compass is based on this article: https://dev.to/orkhanjafarovr/real-compass-on-mobile-browsers-with-javascript-3emi.