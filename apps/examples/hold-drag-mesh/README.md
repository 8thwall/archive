# A-Frame: Drag Along Mesh

This example allows the user to drag an entity along the surface of another, rotating it to match 
the face normal of the target.

![](https://media.giphy.com/media/QgKxQe2K1odw94spSA/giphy.gif)

### Project Components

```xrextras-gesture-detector``` is required on your ```<a-scene>``` for gesture components to 
function correctly.

- element: the element touch event listeners are added to (default: '')

```hold-drag-around-entity``` drags around its entity on finger down/drag and rotates to align 
with the face normal of the target entity. This entity must receive raycasts.

- cameraId: the id of the ```<a-camera>``` (default: 'camera')
- targetId: the id of the ```<a-entity>``` you want to drag your model along (default: 'ground')
- dragDelay: the time required for the user's finger to be down before lifting the object (default: 300)

Known issue: This assumes that the target entity has a rotation of "0 0 0".
