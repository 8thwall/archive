---
sidebar_label: projectWayspots()
---

# XR8.Vps.proyPuntosDeVía()

`XR8.Vps.projectWayspots()`

## Descripción {#description}

Consulte datos sobre cada una de las ubicaciones de sus proyectos.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Una promesa con un array de `ClientWayspotInfo`, que contiene datos sobre cada una de las ubicaciones de tu proyecto.

`[{id, name, imageUrl, title, lat, lng }]`

| Propiedad                                                             | Tipo     | Descripción                                                                |
| --------------------------------------------------------------------- | -------- | -------------------------------------------------------------------------- |
| id                                                                    | Cadena   | id para esta Ubicación, sólo estable dentro de una sesión. |
| nombre [Opcional] | Cadena   | Referencia a la ubicación de un proyecto.                  |
| imageUrl                                                              | Cadena   | URL de una imagen representativa de esta Ubicación.        |
| título                                                                | Cadena   | El título del lugar.                                       |
| lat                                                                   | `Número` | Latitud de la ubicación del proyecto.                      |
| lng                                                                   | `Número` | Longitud de la ubicación del proyecto.                     |

## Ejemplo {#example}

```javascript
// Registra las Ubicaciones del Proyecto.
XR8.Vps.projectWayspots().then((projectLocations) => {
  projectLocations.forEach((projectLocation) => {
    console.log('projectLocation: ', projectLocation)
  })
})
```
