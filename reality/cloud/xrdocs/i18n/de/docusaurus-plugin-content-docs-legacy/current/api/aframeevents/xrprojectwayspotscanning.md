# xrprojectwayspotscanning

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn alle Projektstandorte zum Scannen geladen wurden.

`xrprojectwayspotscanning.detail : { wayspots: [] }`

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
