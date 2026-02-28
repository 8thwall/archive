---
sidebar_position: 1
---

# xr:projectwayspotupdated

## Descripción {#description}

Este evento se emite cuando una Ubicación de Proyecto cambia de posición o rotación.

`xr:projectwayspotupdated.detail : { name, position, rotation }`

| Propiedad                | Descripción                                                                      |
| ------------------------ | -------------------------------------------------------------------------------- |
| name                     | El nombre de la ubicación del proyecto.                                          |
| position: `{x, y, z}`    | La posición 3d de la Ubicación del Proyecto localizada.                          |
| rotation: `{w, x, y, z}` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |
