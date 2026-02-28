---
sidebar_position: 1
---

# xr:meshfound

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn ein Netz zum ersten Mal gefunden wird, entweder nach dem Start oder nach einem `recenter()`.

`xr:meshfound.detail : { id, position, rotation, mesh }`

| Eigentum                                                            | Beschreibung                                                                                         |
| ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| id                                                                  | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist                                      |
| Position: `{x, y, z}`                               | Die 3D-Position des lokalisierten Netzes.                                            |
| Drehung: "w, x, y, z                                | Die lokale 3D-Orientierung (Quaternion) des lokalisierten Netzes. |
| Netz: "pc.Mesh() | Ein PlayCanvas-Mesh mit Index-, Positions- und Farbattributen.                       |
