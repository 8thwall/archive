# xrmeshfound

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgegeben, wenn ein Netz zum ersten Mal entweder nach dem Start oder nach einem recenter() gefunden wird.

`xrmeshfound.detail : { id, position, rotation, bufferGeometry }`

| Eigentum                 | Beschreibung                                                     |
| ------------------------ | ---------------------------------------------------------------- |
| id                       | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist  |
| position: `{x, y, z}`    | Die 3d-Position des georteten Netzes.                            |
| rotation: `{w, x, y, z}` | Die lokale 3D-Ausrichtung (Quaternion) des lokalisierten Netzes. |
| bufferGeometry:          | A `THREE.BufferGeometry` mesh.                                   |
