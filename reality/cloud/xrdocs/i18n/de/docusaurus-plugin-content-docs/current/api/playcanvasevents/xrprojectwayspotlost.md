---
sidebar_position: 1
---

# xr:projectwayspotlost

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn ein Projektstandort nicht mehr verfolgt wird.

`xr:projectwayspotlost.detail : { name, position, rotation }`

| Eigentum                 | Beschreibung                                                  |
| ------------------------ | ------------------------------------------------------------- |
| name                     | Der Name des Projektstandorts.                                |
| position: `{x, y, z}`    | Die 3d-Position des Projektstandorts.                         |
| rotation: `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |
