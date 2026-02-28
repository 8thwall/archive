---
sidebar_position: 1
---

# xr:meshfound

## Descripción {#description}

Este evento se emite cuando se encuentra una malla por primera vez, ya sea después del inicio o después de `recenter()`.

`xr:meshfound.detail : { id, position, rotation, mesh }`

| Propiedad                | Descripción                                                        |
| ------------------------ | ------------------------------------------------------------------ |
| id                       | Un id para esta malla que es estable dentro de una sesión          |
| position: `{x, y, z}`    | La posición 3d de la malla localizada.                             |
| rotation: `{w, x, y, z}` | La orientación local 3d (cuaternión) de la malla localizada.       |
| mesh: `pc.Mesh()`        | Una malla de PlayCanvas con atributos de índice, posición y color. |
