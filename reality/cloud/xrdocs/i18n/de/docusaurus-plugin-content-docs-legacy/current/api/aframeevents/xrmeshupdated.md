# xrmeshupdated

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn das **erste** gefundene Netz seine Position oder Drehung ändert.

`xrmeshupdated.detail : { id, position, rotation }`

| Eigentum                              | Beschreibung                                                                                         |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| id                                    | Eine ID für dieses Netz, die innerhalb einer Sitzung stabil ist                                      |
| Position: `{x, y, z}` | Die 3D-Position des lokalisierten Netzes.                                            |
| Drehung: "w, x, y, z  | Die lokale 3D-Orientierung (Quaternion) des lokalisierten Netzes. |
