---
sidebar_position: 1
---
# xr:meshupdated

## Description {#description}

This event is emitted when the **first** mesh found changes position or rotation.

`xr:meshupdated.detail : { id, position, rotation }`

Property  | Description
--------- | -----------
id | An id for this mesh that is stable within a session
position: `{x, y, z}` | The 3d position of the located mesh.
rotation: `{w, x, y, z}` | The 3d local orientation (quaternion) of the located mesh.
