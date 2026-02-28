---
sidebar_position: 1
---

# xr:puntodeproyectoperdido

## Descripción {#description}

Este evento se emite cuando una Ubicación de Proyecto deja de ser rastreada.

`xr:projectwayspotlost.detail : { name, position, rotation }`

| Propiedad                                    | Descripción                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| nombre                                       | El nombre de la ubicación del proyecto.                                                             |
| posición: `{x, y, z}`        | La posición 3d de la Ubicación del Proyecto localizada.                                             |
| rotación: \`{w, x, y, z}\`\` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |
