# xrmeshupdated

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn das **erste gefundene** Netz seine Position oder Drehung ändert.

`xrmeshupdated.detail : { id, position, rotation }`

| Eigentum                 | Beschreibung                                                     |
| ------------------------ | ---------------------------------------------------------------- |
| id                       | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist  |
| position: `{x, y, z}`    | Die 3d-Position des georteten Netzes.                            |
| rotation: `{w, x, y, z}` | Die lokale 3D-Ausrichtung (Quaternion) des lokalisierten Netzes. |
