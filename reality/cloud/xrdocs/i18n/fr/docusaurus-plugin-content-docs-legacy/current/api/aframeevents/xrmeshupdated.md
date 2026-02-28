# xrmeshupdated

## Description {#description}

Cet événement est émis par [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsque le **premier** maillage trouvé change de position ou de rotation.

`xrmeshupdated.detail : { id, position, rotation }`

| Propriété                                 | Description                                                                                   |
| ----------------------------------------- | --------------------------------------------------------------------------------------------- |
| id                                        | Un identifiant pour ce maillage qui est stable au sein d'une session                          |
| position : `{x, y, z}`    | La position 3D de la maille localisée.                                        |
| rotation : `{w, x, y, z}` | L'orientation locale 3D (quaternion) du maillage localisé. |
