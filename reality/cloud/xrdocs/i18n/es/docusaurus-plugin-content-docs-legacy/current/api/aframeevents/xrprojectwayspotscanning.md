# xrprojectwayspotscanning

## Descripción {#description}

Este evento es emitido por [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) cuando todas las Ubicaciones de Proyecto han sido cargadas para su escaneo.

`xrprojectwayspotscanning.detail : { wayspots: [] }`

| Propiedad                                                                        | Descripción                                                                        |
| -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| wayspots: [] | Una matriz de objetos que contiene información sobre la ubicación. |

`wayspots` es un array de objetos con las siguientes propiedades:

| Propiedad | Descripción                                                                                 |
| --------- | ------------------------------------------------------------------------------------------- |
| id        | Un id para esta Ubicación del Proyecto que es estable dentro de una sesión. |
| nombre    | El nombre de la ubicación del proyecto.                                     |
| imageUrl  | URL de una imagen representativa de este proyecto Ubicación.                |
| título    | El título de Localización.                                                  |
| lat       | Latitud de la ubicación de este proyecto.                                   |
| lng       | Longitud de la ubicación de este proyecto.                                  |
