# A-Frame: HoloStream Hologram

HoloStream is an adaptive bitrate volumetric video streaming solution. 
This example illustrates how to integrate a volumetric video hosted by HoloStream into an 8th Wall WebAR project.

Interested in adding adaptive bitrate volumetric video streaming to your project? Reach out to [Arcturus](https://arcturus.studio/holostream#contact) directly to get started using HoloStream. 

![](https://media.giphy.com/media/pfj9tBC17EqguxTFGn/giphy.gif)

---

### Project Overview

In **head.html**, we add  
```<script src="https://static.holostream.arcturus.studio/release/2021.1.13/remote/HoloStream-2021.1.13.min.js"></script>```  
to download the latest version of the HoloStream player.

In **body.html**, we add the ```<holostream-hologram>``` primitive to our ```<a-scene>``` which has a few important
parameters:

- src: holostream asset path (Arcturus-supplied external cdn link)
- size: starting size of hologram (default: 1)
- touch-target-size: size of touch target cylinder: 'height radius' (default: '1.65 0.35')
- touch-target-offset: offset of touch target cylinder: 'x z' (default: '0 0')
- touch-target-visible: if true, show touch target for debugging (default: false)

**holostream-component.js** contains all the logic for the ```<holostream-hologram>``` primitive.

See HoloStream Documentation [here](https://learn.arcturus.studio/docs/).

---

This sample project was contributed by 8th Wall partner, [Arcturus](https://arcturus.studio/).
