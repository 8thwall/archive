# three.js: Depthkit

three.js integration of Scatter's [Depthkit](https://www.depthkit.tv/) using 8th Wall.

![](https://media.giphy.com/media/ieheDWwZs6UHYgNLZF/giphy.gif)

Learn more about Depthkit.js [here](https://github.com/ScatterCo/Depthkit.js).

### Depthkit Studio Compatibility

Recently, Depthkit has been updated to support multiple perspectives with Depthkit Studio. 
This feature modified the structure of assets exported out of Depthkit, breaking compatibility with Depthkit.js.
Single-perspective Depthkit assets from Depthkit Core and Depthkit Cinema can be modified to the 
older structure to make them compatible with Depthkit.js using the [following steps](https://github.com/ScatterCo/Depthkit.js/blob/master/README.md#workaround-for-metadata-files-from-depthkit-054-and-later):

1. Locate the metadata file of your Depthkit asset, make a backup of it, and open it in a text/code editor. Editors like SublimeText and Atom can make it easier to read the metadata’s JSON format.
2. Locate the `"numAngles"` and `"perspectives"` objects.
    - Delete the entire `"numAngles": 1`, line.
    - Within the `"perspectives"` array in brackets `[]`, you’ll find an unnamed object in curly braces `{}`.
    - Delete the `"perspectives" [ {` preceding the contents of the object, and the `} ]` following it.
    - The remaining contents, beginning with `"clipEpsilon"` and `"crop"` objects, and ending with the `"farClip"` and `"nearClip"` and their values, are now elevated to the same level as the other objects in the metadata.
    - Make sure that each object is followed by a comma except for the final one.
3. Save this modified version.

### Adding your own Depthkit captures

1. Capture your volumetric content with [Depthkit](https://www.depthkit.tv/)


2. Export your capture in *Combined Per Pixel Video* format which will produce a .txt file and 
.mp4 file. **Your .mp4 resolution must not exceed 4096 pixels (width or height). For best results, 
do not exceed 2160 pixels (width or height)**


3. Drag and drop your .txt file in capture-data/ and your .mp4 file in assets/captures/

![](https://miro.medium.com/max/1280/1*QYBxu2_eDEbEiKazH_BiZQ.gif)


4. Reference your assets in the *capture* variable from within *threejs-scene-init.js*. 
This assumes your .txt and .mp4 share the same name (i.e. autumn in this example).

![](https://media.giphy.com/media/S8UJT99IHSjYIvgAtJ/giphy.gif)


5. Test and Publish!

### Playback Controls

`depthkit.play()` Play the video

`depthkit.pause()` Pause the video

`depthkit.stop()` Stop and rewind to begining

`depthkit.setLoop(isLooping)` Set loop to true or false

`depthkit.setVolume(volume)` Change the volume of the audio

`depthkit.setOpacity(opacity)` Change opacity

`depthkit.dispose()` Dispose and clean the character instance
