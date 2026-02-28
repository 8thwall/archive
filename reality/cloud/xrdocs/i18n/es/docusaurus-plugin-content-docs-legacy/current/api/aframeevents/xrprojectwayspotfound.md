# xrprojectwayspotfound

## Descripción {#description}

Este evento es emitido por [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando se encuentra por primera vez una Ubicación de Proyecto.

`xrprojectwayspotfound.detail : { name, position, rotation }`

| Propiedad                                    | Descripción                                                                                                         |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| nombre                                       | El nombre de la ubicación del proyecto.                                                             |
| posición: `{x, y, z}`        | La posición 3d de la Ubicación del Proyecto localizada.                                             |
| rotación: \`{w, x, y, z}\`\` | La orientación local 3d (cuaternión) de la Localización del Proyecto localizada. |
