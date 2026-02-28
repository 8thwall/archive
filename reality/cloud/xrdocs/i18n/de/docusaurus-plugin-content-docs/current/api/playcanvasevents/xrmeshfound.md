---
sidebar_position: 1
---

# xr:meshfound

## Beschreibung {#description}

Dieses Ereignis wird ausgegeben, wenn ein Netz zum ersten Mal gefunden wird, entweder nach dem Start oder nach einem `recenter()`.

`xr:meshfound.detail : { id, position, rotation, mesh }`

| Eigentum                 | Beschreibung                                                     |
| ------------------------ | ---------------------------------------------------------------- |
| id                       | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist  |
| position: `{x, y, z}`    | Die 3d-Position des georteten Netzes.                            |
| rotation: `{w, x, y, z}` | Die lokale 3D-Ausrichtung (Quaternion) des lokalisierten Netzes. |
| mesh: `pc.Masche()`      | Ein PlayCanvas-Mesh mit Index-, Positions- und Farbattributen.   |
