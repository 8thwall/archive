# xrmeshfound

## Description {#description}

This event is emitted by [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) when a mesh is first found either after start or after a recenter().

`xrmeshfound.detail : { id, position, rotation, bufferGeometry }`

Property  | Description
--------- | -----------
id | An id for this mesh that is stable within a session
position: `{x, y, z}` | The 3d position of the located mesh.
rotation: `{w, x, y, z}` | The 3d local orientation (quaternion) of the located mesh.
bufferGeometry:  | A `THREE.BufferGeometry` mesh.
