---
sidebar_label: projetWayspots()
---

# XR8.Vps.projectWayspots()

`XR8.Vps.projectWayspots()`

## Description {#description}

Interroger les données relatives à chacun de vos sites de projet.

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

Une promesse avec un tableau de `ClientWayspotInfo`, qui contient des données sur chacun de vos emplacements de projet.

`[{id, name, imageUrl, title, lat, lng }]` \\`[{id, name, imageUrl, title, lat, lng }]

| Propriété                                                            | Type     | Description                                                                       |
| -------------------------------------------------------------------- | -------- | --------------------------------------------------------------------------------- |
| id                                                                   | `Chaîne` | pour cet emplacement, qui n'est stable qu'au cours d'une session. |
| nom [Facultatif] | `Chaîne` | Une référence à l'emplacement du projet.                          |
| imageUrl                                                             | `Chaîne` | URL d'une image représentative de ce lieu.                        |
| titre                                                                | `Chaîne` | Titre de l'emplacement.                                           |
| lat                                                                  | `Nombre` | Latitude de l'emplacement du projet.                              |
| lng                                                                  | `Nombre` | Longitude de l'emplacement du projet.                             |

## Exemple {#example}

```javascript
// Enregistrer les emplacements du projet.
XR8.Vps.projectWayspots().then((projectLocations) => {
  projectLocations.forEach((projectLocation) => {
    console.log('projectLocation : ', projectLocation)
  })
})
```
