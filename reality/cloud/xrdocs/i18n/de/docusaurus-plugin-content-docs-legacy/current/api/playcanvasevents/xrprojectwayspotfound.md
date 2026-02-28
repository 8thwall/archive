---
sidebar_position: 1
---

# xr:projectwayspotfound

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn ein Projektstandort zum ersten Mal gefunden wird.

xr:projectwayspotfound.detail : { name, position, rotation }\\`

| Eigentum                              | Beschreibung                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Name                                  | Der Name des Projektstandorts.                                                   |
| Position: `{x, y, z}` | Die 3d-Position des Projektstandorts.                                            |
| Drehung: "w, x, y, z  | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |
