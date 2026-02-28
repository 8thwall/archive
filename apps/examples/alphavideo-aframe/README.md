# A-Frame: Green Screen Video

This example uses an A-Frame component to remove the background of an mp4 video file. 
This also supports fading in the alpha video.

`chroma-key.js` contains the `chromakey` shader which is based on
[this](https://github.com/nikolaiwarner/aframe-chromakey-material/blob/master/README.md).

`target-video` handles video playback and fading. Set the `fade` property to 0 to disable fading.

![](https://media.giphy.com/media/RNEuESBCtAEeBr432D/giphy.gif)

Point your phone at this image target to test: ![](https://cdn.8thwall.com/web/img/readme/alpha-target.jpg)

If you want to move the position of your video entity please set it as a child-parent relationship

Example:

<a-entity position="0 0 2">
<a-entity
target-video="name: outside; video: #alpha-video; fade: 800"
material="shader: chromakey; src: #alpha-video; color: 0.1 0.9 0.2"
geometry="primitive: plane; height: 0.6; width: 1.38;">
</a-entity>
</a-entity>