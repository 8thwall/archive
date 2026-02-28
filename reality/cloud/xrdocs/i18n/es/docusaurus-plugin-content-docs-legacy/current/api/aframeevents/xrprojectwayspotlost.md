# xrprojectwayspotlost

## Descripción {#description}

Este evento es emitido por [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando una Ubicación de Proyecto deja de ser rastreada.

`xrprojectwayspotlost.detail : { name, position, rotation }`

| Propiedad                                    | Descripción                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| nombre                                       | El nombre de la ubicación del proyecto.                                                             |
| posición: `{x, y, z}`        | La posición 3d de la Ubicación del Proyecto localizada.                                             |
| rotación: \`{w, x, y, z}\`\` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |
