# A-Frame: Video with sound

This example illustrates how to display an splash screen before the AR engine is started.

When the user clicks the "Start AR" button the 8th Wall AR engine is lauched and the splash screen is hidden.

This project includes an mp4 video with sound.  The video plays after the "Start AR" button is clicked.

Note that videos with sound can not autoplay - we must register a user interaction, such as a tap, through a splash screen, tap to place, etc.

# Project Components

There is no ```xrweb``` component on the ```<a-scene>```.  This is because it will be programatically added once the user clicks "Start AR"

```splash-image``` : Starts the AR engine, hides the splash screen and plays a video with sound when a button is pressed

- disableWorldTracking: If true, disable SLAM tracking. (default: 'false')
- requestGyro: If world tracking is disabled, and you want gyro's to be enabled (i.e. 3DoF mode), set this to ```true```.
Has no effect if disableWorldTracking is false (i.e. SLAM enabled) as SLAM already requests gyro. (default: false)

