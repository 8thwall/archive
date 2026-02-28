# xrprojectwayspotfound

## Description {#description}

Cet événement est émis par [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsqu'un lieu de projet est trouvé pour la première fois.

`xrprojectwayspotfound.detail : { name, position, rotation }`

| Propriété                 | Description                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| nom                       | Le nom de l'emplacement du projet.                                        |
| position : `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                       |
| rotation : `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |
