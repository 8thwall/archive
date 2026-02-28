---
sidebar_position: 1
---
# xr:meshfound

## Description {#description}

This event is emitted when a mesh is first found either after start or after a `recenter()`.

`xr:meshfound.detail : { id, position, rotation, mesh }`

Property  | Description
--------- | -----------
id | An id for this mesh that is stable within a session
position: `{x, y, z}` | The 3d position of the located mesh.
rotation: `{w, x, y, z}` | The 3d local orientation (quaternion) of the located mesh.
mesh: `pc.Mesh()` | A PlayCanvas mesh with index, position, and color attributes.
