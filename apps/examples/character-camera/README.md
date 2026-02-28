# A-Frame: Character Camera

This example allows the user to move an animated character by tapping or clicking the ground. 
This also uses URL parameters and the Web Share API to create personalized links for sharing with 
friends or family. Tap on the reindeer for a surprise!

![](https://media.giphy.com/media/OyaJcIJ1x8UjbMyMqO/giphy.gif)

### Optimizing for Metaversal Deployment

With R18, the all-new 8th Wall Engine features Metaversal Deployment, enabling you to create WebAR experiences once and deploy them to smartphones, tablets, computers and both AR and VR headsets. This project has a few platform-specific customizations:

In **body.html**, we add the ```"allowedDevices: any"``` parameter to our ```xrweb``` component in ```<a-scene>``` 
which ensures the project opens on all platforms, including desktop. Environment parameters 
have been customized to generate an open tundra space.

In components/**responsive-immersive.js**, the ```responsive-immersive``` component checks the 8th Wall Engine's 
```sessionAttributes``` then changes the text size and media recorder logic to match the detected platform.

---

#### Attribution

[03_Deery_m_07_f](https://skfb.ly/6UNPQ) by mgruosso | [Low Poly Pine](https://skfb.ly/6VoOK) by Afloat Above the World
