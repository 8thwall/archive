# A-Frame: Ready Player Me Avatar

This example illustrates how to integrate a Ready Player Me avatar into an 8th Wall project.

![](https://media.giphy.com/media/DngpgXUrRr4i74Q9aH/giphy.gif)

To begin integrating Ready Player Me avatars into your commercial projects, sign up to develop with Ready Player Me at https://readyplayer.me/become-a-partner
or contact the Wolf3D team at [info@wolf3d.io](mailto:info@wolf3d.io).

**What do you get as a Ready Player Me partner?**
- Your own partner subdomain (i.e. yourappname.readyplayer.me) 
- Light or dark avatar creator theme 
- A choice between full-body and half-body avatar types 
- Advanced avatar configuration settings: texture LODs, toggling hands, changing the export pose, animation blendshapes, etc. 
- Dedicated developer support 
- Exclusive updates for our partners

---

### Project Overview

In **body.html**, we add the ```rpmContainer``` div which contains an iFrame pointing to your Ready Player Me partner domain. Update the ```src``` of 
the iFrame to the domain provided to you by the Wolf3D team after you sign up as a developer. This iFrame enables end-users to leverage Ready Player Me 
to take the following actions:

- Take a photo that is used to automatically generate an avatar 
- Bring a pre-built avatar associated with their Ready Player Me account into your WebAR experience
- Manually go through an avatar creation flow

**avatar-instantiate.js** contains all the logic for bringing the avatar created in the Ready Player Me iFrame and making it available in your WebAR experience. 
This component automatically hides the Ready Player Me iFrame so that the underlying WebAR experience becomes visible once they have configured their avatar. 

**avatar-face-effects.js** it is here that the 8th Wall face mesh anchor points are synched with the Ready Player Me avatar morph targets. 

**rig-animation.js** grabs the animations that are uploaded as ```animations.glb``` in the models folder and dynamically associates these animations to the 
downloaded Ready Player Me avatar. 

Upload your own animations be replacing the ```animations.glb``` file with any file you have of baked skeleton animations. You can download baked skeleton 
animations from [Mixamo](https://www.mixamo.com/#/?page=1&type=Motion%2CMotionPack). Make sure to convert the .FBX file from Mixamo into a .GLB or .GLTF before
uploading to 8th Wall. 

---
Looking for information about the joystick contoller components? Check out the 8th Wall [Playground](https://www.8thwall.com/playground/joystick-movement).
