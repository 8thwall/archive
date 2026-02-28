# xrprojectwayspotfound

## Description {#description}

This event is emitted by [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) when a Project Location is first found.

`xrprojectwayspotfound.detail : { name, position, rotation }`

Property  | Description
--------- | -----------
name | The Project Location name.
position: `{x, y, z}` | The 3d position of the located Project Location.
rotation: `{w, x, y, z}` | The 3d local orientation (quaternion) of the located Project Location.
