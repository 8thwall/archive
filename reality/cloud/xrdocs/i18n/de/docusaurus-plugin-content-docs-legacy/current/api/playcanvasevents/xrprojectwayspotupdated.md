---
sidebar_position: 1
---

# xr:projectwayspotupdated

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn ein Projektstandort seine Position oder Drehung ändert.

`xr:projectwayspotupdated.detail : { name, position, rotation }`

| Eigentum                              | Beschreibung                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Name                                  | Der Name des Projektstandorts.                                                   |
| Position: `{x, y, z}` | Die 3d-Position des Projektstandorts.                                            |
| Drehung: "w, x, y, z  | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |
