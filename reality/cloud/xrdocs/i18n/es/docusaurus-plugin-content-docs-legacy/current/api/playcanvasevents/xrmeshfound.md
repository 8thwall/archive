---
sidebar_position: 1
---

# xr:malla encontrada

## Descripción {#description}

Este evento se emite cuando se encuentra una malla por primera vez, ya sea después del inicio o después de un `recenter()`.

`xr:meshfound.detail : { id, position, rotation, mesh }`

| Propiedad                                    | Descripción                                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| id                                           | Un id para esta malla que es estable dentro de una sesión                                       |
| posición: `{x, y, z}`        | La posición 3d de la malla localizada.                                          |
| rotación: \`{w, x, y, z}\`\` | La orientación local 3d (cuaternión) de la malla localizada. |
| mesh: `pc.Mesh()`            | Una malla PlayCanvas con atributos de índice, posición y color.                 |
