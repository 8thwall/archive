---
sidebar_position: 1
---

# xr:projectwayspotscanning

## Descripción {#description}

Este evento se emite cuando todas las Ubicaciones de Proyecto han sido cargadas para su escaneo.

`xr:projectwayspotfound.detail : { wayspots: [] }`

| Propiedad    | Descripción                                                        |
| ------------ | ------------------------------------------------------------------ |
| wayspots: [] | Una matriz de objetos que contiene información sobre la ubicación. |

`wayspots` es una matriz de objetos con las siguientes propiedades:

| Propiedad | Descripción                                                                 |
| --------- | --------------------------------------------------------------------------- |
| id        | Un id para esta Ubicación del Proyecto que es estable dentro de una sesión. |
| name      | El nombre de la ubicación del proyecto.                                     |
| imagenUrl | URL de una imagen representativa de este proyecto Ubicación.                |
| título    | El título de Localización.                                                  |
| lat       | Latitud de la ubicación de este proyecto.                                   |
| lng       | Longitud de la ubicación de este proyecto.                                  |
