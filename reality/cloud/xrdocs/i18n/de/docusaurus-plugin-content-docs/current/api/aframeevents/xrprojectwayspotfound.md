# xrprojectwayspotfound

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst durch [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) wenn ein Projektstandort zum ersten Mal gefunden wird.

`xrprojectwayspotfound.detail : { name, position, rotation }`

| Eigentum                 | Beschreibung                                                  |
| ------------------------ | ------------------------------------------------------------- |
| name                     | Der Name des Projektstandorts.                                |
| position: `{x, y, z}`    | Die 3d-Position des Projektstandorts.                         |
| rotation: `{w, x, y, z}` | Die lokale 3D-Orientierung (Quaternion) des Projektstandorts. |
