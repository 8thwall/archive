---
sidebar_label: projectWayspots()
---

# XR8.Vps.projectWayspots()

`XR8.Vps.projectWayspots()`

## Beschreibung {#description}

Abfrage von Daten über jeden Ihrer Projektstandorte.

## Parameter {#parameters}

Keine

## Returns {#returns}

Ein Versprechen mit einem Array von `ClientWayspotInfo`, das Daten über jeden Ihrer Projektstandorte enthält.

`[{id, name, imageUrl, title, lat, lng }]`

| Eigentum        | Typ      | Beschreibung                                           |
| --------------- | -------- | ------------------------------------------------------ |
| id              | `String` | id für diesen Ort, nur innerhalb einer Sitzung stabil. |
| name [Optional] | `String` | Ein Verweis auf einen Projektstandort.                 |
| imageUrl        | `String` | URL zu einem repräsentativen Bild für diesen Standort. |
| titel           | `String` | Der Titel des Standorts.                               |
| lat             | `Nummer` | Breitengrad des Projektstandorts.                      |
| lng             | `Nummer` | Längengrad des Projektstandorts.                       |

## Beispiel {#example}

```javascript
// Protokollieren Sie die Projektstandorte.
XR8.Vps.projectWayspots().then((projectLocations) => {
  projectLocations.forEach((projectLocation) => {
    console.log('projectLocation: ', projectLocation)
  })
})
```
