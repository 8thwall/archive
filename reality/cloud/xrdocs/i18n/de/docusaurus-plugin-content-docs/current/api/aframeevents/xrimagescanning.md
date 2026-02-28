# xrimagescanning

## Beschreibung {#description}

Dieses Ereignis wird von [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) ausgelöst, wenn alle Erkennungsbilder geladen wurden und der Scanvorgang begonnen hat.

`imagescanning.detail : { imageTargets: {name, type, metadata, geometry} }`

| Eigentum | Beschreibung                                                                                                                                                                                  |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name     | Der Name des Bildes.                                                                                                                                                                          |
| typ      | Eine von `'FLAT'`, `'CYLINDRICAL'`, `'CONICAL'`.                                                                                                                                              |
| metadata | Benutzer-Metadaten.                                                                                                                                                                           |
| geometry | Objekt mit Geometriedaten. Wenn type=FLAT: `{scaledWidth, scaledHeight}`, lse wenn type=CYLINDRICAL oder type=CONICAL: `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}` |

Wenn Typ = `FLAT`, Geometrie:

| Eigentum     | Beschreibung                                                                     |
| ------------ | -------------------------------------------------------------------------------- |
| scaledWidth  | Die Breite des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird. |
| scaledHeight | Die Höhe des Bildes in der Szene, wenn sie mit dem Maßstab multipliziert wird.   |

Wenn type= `CYLINDRICAL` oder `CONICAL`, Geometrie:

| Eigentum         | Beschreibung                                 |
| ---------------- | -------------------------------------------- |
| height           | Höhe des gebogenen Ziels.                    |
| radiusTop        | Radius des gebogenen Ziels oben.             |
| radiusBottom     | Radius des gekrümmten Ziels am unteren Rand. |
| arcStartRadians  | Startwinkel in Radiant.                      |
| arcLengthRadians | Zentraler Winkel in Radiant.                 |
