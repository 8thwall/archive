# A-Frame: Glass Material (Realtime & Static Cubemap)

This example shows you how to prepare a 3D model with glass-like materials for use in a Web AR project.

![](https://media.giphy.com/media/oR9YaNcL4IMk11OgVP/giphy.gif)


### ```Why is my model not appearing properly?```

When creating a 3D model or downloading one from online with a transparent material, it may not appear properly on a Web AR project. 
The cause of this can be from many things, including how the origional model was exported, the .gltf or .glb online download conversion, and or the 3D objects 
material isn't correct.

This example project shows an incorrect 3D model glass material and the same 3D model that has been converted via Blender with a glass material.

### ```Using Blender to create glass materials```

The two main components in creating a glass material for Web AR via Blender includes modifying a materials "Transmission" and "Blend Mode"

1. Open Blender and import your 3D model into the scene

2. Create a new default material in blender material tab for your 3D model

![](https://cdn.8thwall.com/web/img/readme/create-glass-material.jpg)

3. Under the surface panel change the materials "Transmission" slider from 0 to 1

![](https://cdn.8thwall.com/web/img/readme/transmission.jpg)

4. Blend Mode: Under the settings panel near the bottom of the material properties set of panels. Change Blend Mode to "Alpha Blend"

![](https://cdn.8thwall.com/web/img/readme/alpha_blend.jpg)

5. Depending on your models geometry you can also try turning on/off "Backface Culling" or "Show Backface" for a better outcome

6. Export your model as a .glTF 2.0 (.glb/.gltf) model 

You can mess around with these components along with the base color to create different looking transparent materials. You can also change the shadow opacity of 
the objects in your scene by chaning the opacity in the material of the "ground" plane of the scene. 

![](https://cdn.8thwall.com/web/img/readme/different-materials.jpg)

### ```Checking to see how your model looks```

Your model make still look different is Blenders rendering engine then what it may end up appearing like in Web AR. To check to see how your model will appear or other models
you can use a online .gltf viewers such as: https://gltf-viewer.donmccurdy.com/ 
