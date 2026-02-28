# xrhandupdated

## Description {#description}

This event is emitted by [`xrhand`](/legacy/api/aframe/#hand-tracking) when hand is subsequently found.

`xrhandupdated.detail : {id, transform, vertices, normals, handKind, attachmentPoints}`

Property  | Description
--------- | -----------
id | A numerical id of the located hand.
transform: `{position, rotation, scale}` | Transform information of the located hand.
vertices: [{x, y, z}] | Position of hand points, relative to transform.
normals: [{x, y, z}] | Normal direction of vertices, relative to transform.
handKind | A numerical representation of the handedness of the located hand. Valid values are 0 (unspecified), 1 (left), and 2 (right).
attachmentPoints: { name, position: {x,y,z} } | See [`XR8.HandController.AttachmentPoints`](/legacy/api/handcontroller/attachmentpoints) for list of available attachment points. `position` is relative to the transform.

`transform` is an object with the following properties:

Property  | Description
--------- | -----------
position {x, y, z} | The 3d position of the located hand.
rotation {w, x, y, z} | The 3d local orientation of the located hand.
scale | A scale factor that should be applied to objects attached to this hand.

`attachmentPoints` is an object with the following properties:

Property  | Description
--------- | -----------
name |  The name of the attachment point. See [`XR8.HandController.AttachmentPoints`](/legacy/api/handcontroller/attachmentpoints) for list of available attachment points.
position {x, y, z} | The 3d position of the attachment point on the located hand.
rotation {w, x, y, z} | The rotation quaternion that rotates positive-Y vector to the attachment point bone vector.
innerPoint {x, y, z} | The inner point of an attachment point. (ex. hand palm side)
outerPoint {x, y, z} | The outer point of an attachment point. (ex. hand backside)
radius | The radius of finger attachment points.
minorRadius | The shortest radius from hand surface to the wrist attachment point.
majorRadius |The longest radius from hand surface to the wrist attachment point.

## Example {#example}

```javascript
const handRigidComponent = {
  init: function () {
    const object3D = this.el.object3D
    object3D.visible = false
    const show = ({detail}) => {
      const {position, rotation, scale} = detail.transform
      object3D.position.copy(position)
      object3D.quaternion.copy(rotation)
      object3D.scale.set(scale, scale, scale)
      object3D.visible = true
    }
    const hide = ({detail}) => { object3D.visible = false }
    this.el.sceneEl.addEventListener('xrhandfound', show)
    this.el.sceneEl.addEventListener('xrhandupdated', show)
    this.el.sceneEl.addEventListener('xrhandlost', hide)
  }
}
```
