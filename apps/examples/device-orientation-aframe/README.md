# Device Orientation

This project illustrates how to set desired device orientation. In the event a user rotates their
device in to an undesired orientation (landscape in this example), a message will be displayed until
they rotate back to the desired orientation (portrait)

The `orientation` property that is available to `onStart`and `onDeviceOrientationChange`
pipeline module lifecycle methods is checked and an html overlay is displayed/hidden as needed.

See:

https://www.8thwall.com/docs/web/#onstart

https://www.8thwall.com/docs/web/#ondeviceorientationchange

![](https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExMmZja2tucXZyN3c0ejVoNWlweWNieDB0MmI4MHNrOG83bHJvdHZreiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/79sOtDMy3TI1GUIRqf/giphy.gif)
