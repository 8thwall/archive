# xrprojectwayspotscanning

## Description {#description}

Cet événement est émis par [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) lorsque tous les emplacements de projet ont été chargés pour être scannés.

`xrprojectwayspotscanning.detail : { wayspots : [] }`

| Propriété                                                                                 | Description                                                                       |
| ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| points de repère : [] | Un tableau d'objets contenant des informations sur l'emplacement. |

`wayspots` est un tableau d'objets ayant les propriétés suivantes :

| Propriété | Description                                                                        |
| --------- | ---------------------------------------------------------------------------------- |
| id        | Un identifiant pour cet emplacement de projet qui est stable au sein d'une session |
| nom       | Le nom de l'emplacement du projet.                                 |
| imageUrl  | URL d'une image représentative de l'emplacement du projet.         |
| titre     | Le titre de l'emplacement.                                         |
| lat       | Latitude de l'emplacement du projet.                               |
| lng       | Longitude de l'emplacement du projet.                              |
