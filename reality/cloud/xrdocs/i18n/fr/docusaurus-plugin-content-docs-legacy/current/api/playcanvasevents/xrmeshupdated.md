---
sidebar_position: 1
---

# xr:meshupdated

## Description {#description}

Cet événement est émis lorsque la **première** maille trouvée change de position ou de rotation.

`xr:meshupdated.detail : { id, position, rotation }`

| Propriété                                 | Description                                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| id                                        | Un identifiant pour ce maillage qui est stable au sein d'une session                          |
| position : `{x, y, z}`    | La position 3D de la maille localisée.                                        |
| rotation : `{w, x, y, z}` | L'orientation locale 3D (quaternion) du maillage localisé. |
