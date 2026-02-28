---
sidebar_position: 1
---
# xr:projectwayspotlost

## Description {#description}

This event is emitted when a Project Location is no longer being tracked.

`xr:projectwayspotlost.detail : { name, position, rotation }`

Property  | Description
--------- | -----------
name | The Project Location name.
position: `{x, y, z}` | The 3d position of the located Project Location.
rotation: `{w, x, y, z}` | The 3d local orientation (quaternion) of the located Project Location.
