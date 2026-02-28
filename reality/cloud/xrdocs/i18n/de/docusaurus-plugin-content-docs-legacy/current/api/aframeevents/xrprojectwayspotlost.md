# xrprojectwayspotlost

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn ein Projektstandort nicht mehr verfolgt wird.

xrprojectwayspotlost.detail : { name, position, rotation }\\`

| Eigentum                              | Beschreibung                                                                                     |
| ------------------------------------- | ------------------------------------------------------------------------------------------------ |
| Name                                  | Der Name des Projektstandorts.                                                   |
| Position: `{x, y, z}` | Die 3d-Position des Projektstandorts.                                            |
| Drehung: "w, x, y, z  | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |
