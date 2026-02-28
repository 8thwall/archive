---
sidebar_position: 1
---

# xr:projectwayspotscanning

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn alle Projektstandorte zum Scannen geladen wurden.

`xr:projectwayspotfound.detail : { wayspots: [] }`

| Eigentum                                                                          | Beschreibung                                                      |
| --------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Wegpunkte: [] | Ein Array von Objekten mit Standortinformationen. |

wayspots" ist eine Reihe von Objekten mit den folgenden Eigenschaften:

| Eigentum | Beschreibung                                                                  |
| -------- | ----------------------------------------------------------------------------- |
| id       | Eine ID für diesen Projektstandort, die innerhalb einer Sitzung stabil ist    |
| Name     | Der Name des Projektstandorts.                                |
| imageUrl | URL zu einem repräsentativen Bild für diesen Projektstandort. |
| Titel    | Der Titel des Standorts.                                      |
| lat      | Breitengrad dieses Projektstandorts.                          |
| lng      | Längengrad dieses Projektstandorts.                           |
