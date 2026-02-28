---
sidebar_position: 1
---

# xr:mallaactualizada

## Descripción {#description}

Este evento se emite cuando la **primera** malla encontrada cambia de posición o rotación.

`xr:meshupdated.detail : { id, position, rotation }`

| Propiedad                                    | Descripción                                                                                     |
| -------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| id                                           | Un id para esta malla que es estable dentro de una sesión                                       |
| posición: `{x, y, z}`        | La posición 3d de la malla localizada.                                          |
| rotación: \`{w, x, y, z}\`\` | La orientación local 3d (cuaternión) de la malla localizada. |
