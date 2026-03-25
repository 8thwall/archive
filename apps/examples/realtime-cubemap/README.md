# A-Frame: Cubemap

This example shows how to apply environment cubemaps to your glb models.

![](https://media.giphy.com/media/ResL97qyOBt197aUqG/giphy.gif)

'cubemap-absolute.js' is a slightly modified version of 'cube-env-map.js' that works with 8th Wall's asset hierarchy. 

[(see original)](https://raw.githubusercontent.com/donmccurdy/aframe-extras/master/src/misc/cube-env-map.js)

You can swap out the images in assets/cubemap/ to see the results on a PBR gltf-model, in this case ‘jini-ball’.

.hdri/.hdr files are supported but tend to be much larger than jpg/png so keep that in mind.

You will need to break your panoramic image into a cubemap and label each image accordingly. 

A very easy workflow I have found is taking an image from [this website](https://hdrihaven.com/) (all the images are public domain), 
dropping them into [this website](https://jonaszeitler.se/cubemap-toastmap-generator/), compressing them if necessary,
renaming to match ‘posx.png’ naming scheme and then uploading to /assets/cubemap/ folder

Learn more about donmccurdy's aframe-extras [here](https://github.com/donmccurdy/aframe-extras/tree/master/src/misc)