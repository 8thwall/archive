# xrprojectwayspotscanning

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst durch [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) wenn alle Projektstandorte zum Scannen geladen wurden.

`xrprojectwayspotscanning.detail : { wayspots: [] }`

| Eigentum     | Beschreibung                                      |
| ------------ | ------------------------------------------------- |
| wayspots: [] | Ein Array von Objekten mit Standortinformationen. |

`wayspots` ist ein Array von Objekten mit den folgenden Eigenschaften:

| Eigentum | Beschreibung                                                               |
| -------- | -------------------------------------------------------------------------- |
| id       | Eine ID für diesen Projektstandort, die innerhalb einer Sitzung stabil ist |
| name     | Der Name des Projektstandorts.                                             |
| imageUrl | URL zu einem repräsentativen Bild für diesen Projektstandort.              |
| titel    | Der Titel des Standorts.                                                   |
| lat      | Breitengrad dieses Projektstandorts.                                       |
| lng      | Längengrad dieses Projektstandorts.                                        |
