# A-Frame: Video Material on Mesh

This project applies video textures to imported glb models. The chair model uses the `video-texture`
component to replace all the diffuse maps on the model with a video file. The TV model uses the 
`video-texture-camera-roll` component which replaces the diffuse map of a sub-mesh (the screen) with 
a video file. Users can also replace the video on the screen with one from their camera roll.

![](https://media.giphy.com/media/gtfuPId8wvtfkyQ7Tc/giphy.gif)


### Scene Components

```video-texture``` (*/js/video-texture-components.js*)

Attached to a gltf model, this component replaces the diffuse maps on the 
model with a video file.

- video: id of <video>

```video-texture-camera-roll``` (*/js/video-texture-components.js*) 

Attached to a gltf model, this component replaces a specific diffuse map within the model with a 
video file and allows the user to upload their own videos to replace it. *Note: Due to a bug 
in iOS 15, video texture upload is only available in Android and previous iOS versions.*

- video: id of <video>

### ```Attribution```

TV Model by [donnichols](https://www.cgtrader.com/free-3d-models/electronics/video/vintage-tv-a4f79508-a594-4119-a80f-e3151c855af3) /
Chair Model by [PrismaRenders](https://www.cgtrader.com/free-3d-models/furniture/chair/moon-armchair-568340c2-2819-4516-80ab-279976a1d7be) / 
Videos by [Videezy](https://www.videezy.com/backgrounds/49755-multiple-colors-in-one-box)
