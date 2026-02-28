---
sidebar_position: 1
---

# xr:projectwayspotupdated

## Description {#description}

Cet événement est émis lorsqu'un emplacement de projet change de position ou de rotation.

`xr:projectwayspotupdated.detail : { name, position, rotation }`

| Propriété                                 | Description                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| nom                                       | Le nom de l'emplacement du projet.                                                           |
| position : `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                                          |
| rotation : `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |
