Videos may not autoplay with battery saving features enabled in Safari. To solve this, you can use custom logic which catches the error thrown when battery saving features are enabled (`NotAllowedError`) and plays the video upon a tap.

```
vid.play().catch((error) => {
    if (error.name === 'NotAllowedError') {
      // low power mode is enabled
    }
```

With this solution you can play the video as a result of a user gesture, but the video still appears black until that gesture is captured. To solve this, simply added #t=0.001 to the end of the video src so that it will display the first frame of the video instead of the zeroth:

```
<video id="vid" src="./assets/video.mp4#t=0.001" muted loop></video>
```
