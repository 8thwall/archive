# xrmeshfound

## Description {#description}

Cet événement est émis par [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsqu’un maillage est trouvé pour la première fois, soit après le démarrage, soit après un recentrage().

`xrmeshfound.detail : { id, position, rotation, bufferGeometry }`

| Propriété                 | Description                                                          |
| ------------------------- | -------------------------------------------------------------------- |
| id                        | Un identifiant pour ce maillage qui est stable au sein d'une session |
| position : `{x, y, z}`    | La position 3D de la maille localisée.                               |
| rotation : `{w, x, y, z}` | L'orientation locale 3D (quaternion) du maillage localisé.           |
| bufferGeometry :          | Un maillage `THREE.BufferGeometry`.                                  |
