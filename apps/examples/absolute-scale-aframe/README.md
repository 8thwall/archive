# A-Frame: Absolute Scale Chair

This project template demonstrates how to implement Absolute Scale. 

### Using Absolute Scale

With R19, 8th Wall introduced a new capability to our already powerful SLAM system — Absolute Scale. Absolute Scale brings interactive, cross-platform, real-world scale AR to the web. 

In **body.html**, we add the ```"scale: absolute"``` parameter to our ```xrweb``` component in ```<a-scene>``` 
which ensures the project utilizes Absolute Scale instead of the default Responsive Scale. 

Setting the scale to “absolute” will dynamically set the virtual camera height to the actual height of the device camera. 
To estimate scale, the 8th Wall Engine needs data to determine the height of the camera, this requires users to move their device to generate data for determining scale. 
To guide your user through this flow, we have created a new pipeline module called Coaching Overlay which can easily be added to your project.

In **head.html**, we add the ```<meta name="8thwall:package" content="@8thwall.coaching-overlay">``` meta tag which makes the coaching overlay module available to the project.
Then in **body.html**, we add the ```"coaching-overlay``` component to our ```<a-scene>```. 

Full details on configuration and customization options for the coaching overlay are available in the [docs](https://www.8thwall.com/docs/web). 

---
### Tutorial Video
https://www.youtube.com/watch?v=Dw1Ds4X6IdU

---

In js/**responsive-immersive.js**, the ```responsive-immersive``` component checks the 8th Wall Engine's 
```sessionAttributes``` then uses ```cubemap-realtime``` on mobile devices and removes it on desktop mode. 

---

### ```Attribution```

Model by [kilicarslan] (https://sketchfab.com/3d-models/high-poly-office-chair-fa2d5243f916407a93db7efcaae75e0d)
