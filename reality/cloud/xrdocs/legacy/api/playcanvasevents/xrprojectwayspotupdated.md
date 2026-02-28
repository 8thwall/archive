---
sidebar_position: 1
---
# xr:projectwayspotupdated

## Description {#description}

This event is emitted when a Project Location changes position or rotation.

`xr:projectwayspotupdated.detail : { name, position, rotation }`

Property  | Description
--------- | -----------
name | The Project Location name.
position: `{x, y, z}` | The 3d position of the located Project Location.
rotation: `{w, x, y, z}` | The 3d local orientation (quaternion) of the located Project Location.
