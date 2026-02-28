# xrimagescanning

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/legacy/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn alle Erkennungsbilder geladen wurden und die Überprüfung begonnen hat.

`imagescanning.detail : { imageTargets: {name, type, metadata, geometry} }`

| Eigentum  | Beschreibung                                                                                                                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Name      | Der Name des Bildes.                                                                                                                                                                                                                         |
| Typ       | Eines von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.                                                                                                                                                                                            |
| Metadaten | Benutzer-Metadaten.                                                                                                                                                                                                                          |
| Geometrie | Objekt mit Geometriedaten. Wenn type=FLAT:{scaledWidth, scaledHeight}", sonst bei type=CYLINDRICAL oder type=CONICAL: "{Höhe, RadiusOben, RadiusUnten, BogenStartRadian, BogenLängeRadian}". |

Wenn Typ = `FLAT`, Geometrie:

| Eigentum        | Beschreibung                                                                                   |
| --------------- | ---------------------------------------------------------------------------------------------- |
| skalierteBreite | Die Breite des Bildes in der Szene, multipliziert mit dem Maßstab.             |
| scaledHeight    | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |

Wenn type= `CYLINDRICAL` oder `CONICAL`, Geometrie:

| Eigentum         | Beschreibung                                                       |
| ---------------- | ------------------------------------------------------------------ |
| Höhe             | Höhe der gekrümmten Zielscheibe.                   |
| radiusTop        | Radius der gekrümmten Zielscheibe am oberen Rand.  |
| radiusBottom     | Radius der gekrümmten Zielscheibe am unteren Rand. |
| arcStartRadian   | Startwinkel in Radiant.                            |
| arcLengthRadians | Zentralwinkel in Radiant.                          |
