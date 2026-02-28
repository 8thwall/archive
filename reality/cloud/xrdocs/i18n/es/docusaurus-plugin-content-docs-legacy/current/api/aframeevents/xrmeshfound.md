# xrmeshfound

## Descripción {#description}

Este evento es emitido por [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando una malla es encontrada por primera vez ya sea después del inicio o después de un recenter().

`xrmeshfound.detail : { id, position, rotation, bufferGeometry }`

| Propiedad                                    | Descripción                                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| id                                           | Un id para esta malla que es estable dentro de una sesión                                       |
| posición: `{x, y, z}`        | La posición 3d de la malla localizada.                                          |
| rotación: \`{w, x, y, z}\`\` | La orientación local 3d (cuaternión) de la malla localizada. |
| búferGeometría:              | Una malla `THREE.BufferGeometry`.                                               |
