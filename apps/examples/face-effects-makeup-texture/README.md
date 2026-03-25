# A-Frame: Face Effects Makeup Textures

This A-frame example project showcases how to use .png images with alpha as makeup textures along with adding eyelash materials.

![](https://media.giphy.com/media/tYhegXrsyXDzzXIMj1/giphy.gif)

### Face Components & Primitives

xrface is required in your <a-scene> for face effects.

<xrextras-faceanchor> inherits the detected face transforms. Entities inside will move with the face.

xrextras-hider-material is applied to any mesh or primitive that you would like to be transparent while blocking the rendering of models behind it. In the scene, this is applied to the head-occluder.glb.

<xrextras-face-mesh> generates a face mesh in your scene.

<xrextras-face-attachment> inherits the detected attachment point transforms. Entities inside will move with the assigned attachment point. 

As you can in the project the eyelash <a-plane> materials are attached to the rightEye and leftEye attachement points.

Attachment points include: forehead, rightEyebrowInner, rightEyebrowMiddle, rightEyebrowOuter, leftEyebrowInner, leftEyebrowMiddle, leftEyebrowOuter, leftEar, rightEar, leftCheek, rightCheek, noseBridge, noseTip, leftEye, rightEye, leftEyeOuterCorner, rightEyeOuterCorner, upperLip, lowerLip, mouth, mouthRightCorner, mouthLeftCorner, chin

Reference Assets
Download 'uv.png' from /assets/textures for face mesh UV reference images when creating your makeup .png texture in a software like photoshop.
