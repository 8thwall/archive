---
sidebar_position: 1
---

# xr:meshfound

## Description {#description}

Cet événement est émis lorsqu'un maillage est trouvé pour la première fois, soit après le démarrage, soit après `recenter()`.

`xr:meshfound.detail : { id, position, rotation, mesh }`

| Propriété                 | Description                                                                  |
| ------------------------- | ---------------------------------------------------------------------------- |
| id                        | Un identifiant pour ce maillage qui est stable au sein d'une session         |
| position : `{x, y, z}`    | La position 3D de la maille localisée.                                       |
| rotation : `{w, x, y, z}` | L'orientation locale 3D (quaternion) du maillage localisé.                   |
| mesh : `pc.Mesh()`        | Une maille PlayCanvas avec des attributs d'index, de position et de couleur. |
