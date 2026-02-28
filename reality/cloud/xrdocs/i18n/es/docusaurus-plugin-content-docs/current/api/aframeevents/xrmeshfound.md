# xrmeshfound

## Descripción {#description}

Este evento es emitido por [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando se encuentra una malla por primera vez, ya sea tras el inicio o tras un recentrado().

`xrmeshfound.detail : { id, position, rotation, bufferGeometry }`

| Propiedad                | Descripción                                                  |
| ------------------------ | ------------------------------------------------------------ |
| id                       | Un id para esta malla que es estable dentro de una sesión    |
| position: `{x, y, z}`    | La posición 3d de la malla localizada.                       |
| rotation: `{w, x, y, z}` | La orientación local 3d (cuaternión) de la malla localizada. |
| bufferGeometry:          | Una malla `TRES.BufferGeometry`.                             |
