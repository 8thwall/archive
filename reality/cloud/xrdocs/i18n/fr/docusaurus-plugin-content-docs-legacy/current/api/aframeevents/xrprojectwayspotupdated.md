# xrprojectwayspotupdated

## Description {#description}

Cet événement est émis par [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsqu'un emplacement de projet change de position ou de rotation.

`xrprojectwayspotupdated.detail : { name, position, rotation }`

| Propriété                                 | Description                                                                                                  |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| nom                                       | Le nom de l'emplacement du projet.                                                           |
| position : `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                                          |
| rotation : `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |
