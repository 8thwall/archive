# xrmeshfound

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn ein Mesh zum ersten Mal entweder nach dem Start oder nach einem recenter() gefunden wird.

xrmeshfound.detail : { id, position, rotation, bufferGeometry }\\`

| Eigentum                              | Beschreibung                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| id                                    | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist                                      |
| Position: `{x, y, z}` | Die 3D-Position des lokalisierten Netzes.                                            |
| Drehung: "w, x, y, z  | Die lokale 3D-Orientierung (Quaternion) des lokalisierten Netzes. |
| bufferGeometry:       | Ein "THREE.BufferGeometry"-Netz.                                     |
