---
sidebar_position: 1
---

# xr:meshupdated

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn das **erste** gefundene Netz seine Position oder Drehung ändert.

`xr:meshupdated.detail : { id, position, rotation }`

| Eigentum                              | Beschreibung                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| id                                    | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist                                      |
| Position: `{x, y, z}` | Die 3D-Position des lokalisierten Netzes.                                            |
| Drehung: "w, x, y, z  | Die lokale 3D-Orientierung (Quaternion) des lokalisierten Netzes. |
