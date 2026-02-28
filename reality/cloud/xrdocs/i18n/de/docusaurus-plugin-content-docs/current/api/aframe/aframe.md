# XR8.AFrame

A-Frame (<https://aframe.io>) ist ein Web-Framework, das für die Erstellung von Virtual-Reality-Erlebnissen entwickelt wurde. Indem Sie 8th Wall Web zu Ihrem A-Frame Projekt hinzufügen, können Sie jetzt ganz einfach **Augmentierte Realität** Erlebnisse für das Web erstellen.

## Hinzufügen des 8th Wallstegs zum A-Frame {#adding-8th-wall-web-to-a-frame}

#### Cloud Editor {#cloud-editor}

1. Fügen Sie einfach einen "meta"-Tag in head.html ein, um die "8-Frame"-Bibliothek in Ihr Projekt aufzunehmen. Wenn Sie von einer der auf A-Frame basierenden Vorlagen von 8th Wall oder von selbst gehosteten Projekten klonen, ist sie bereits vorhanden.  Außerdem müssen Sie Ihren AppKey nicht manuell hinzufügen.

`<meta name="8thwall:renderer" content="aframe:1.4.1">`

#### Selbst gehostet {#self-hosted}

8th Wall Web kann in wenigen einfachen Schritten zu Ihrem A-Frame-Projekt hinzugefügt werden:

1. Enthält eine leicht modifizierte Version von A-Frame (genannt "8-Frame"), die einige Fehler behebt:

`<script src="//cdn.8thwall.com/web/aframe/8frame-1.4.1.min.js"></script>`

2. Fügen Sie den folgenden Script-Tag in den HEAD Ihrer Seite ein. Ersetzen Sie die X's durch Ihren App-Schlüssel:

`<script src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>`

## Konfigurieren der Kamera: `xrconfig` {#configuring-the-camera}

Um den Kamerafeed zu konfigurieren, fügen Sie die Komponente `xrconfig` zu Ihrer `A-Szene` hinzu:

`<a-scene xrconfig>`

#### xrconfig Attribute (alle optional) {#xrconfig-attributes}

| Komponente                            | Typ         | Standard                | Beschreibung                                                                                                                                                                                                                                                                                                           |
| ------------------------------------- | ----------- | ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraDirection                       | `String`    | `'zurück'`              | Zu verwendende Kamera. Wählen Sie aus: `hinten` oder `vorne`. Verwenden Sie `cameraDirection: front;` mit `mirroredDisplay: true;` für den Selfie-Modus. Beachten Sie, dass die Weltverfolgung nur mit `cameraDirection: back;`.` unterstützt wird                                                                    |
| allowedDevices                        | `String`    | `'mobile-and-headsets'` | Unterstützte Geräteklassen. Wählen Sie aus: `'mobile-and-headsets'` , `'mobile'` oder `'any'`. Verwenden Sie `'any'`, um Laptop- oder Desktop-Geräte mit eingebauten oder angeschlossenen Webcams zu aktivieren. Beachten Sie, dass die Weltverfolgung nur auf `'mobile-and-headsets'` oder `mobile` unterstützt wird. |
| mirroredDisplay                       | `Boolesche` | `false`                 | Wenn wahr, spiegeln Sie in der Ausgabegeometrie nach links und rechts und kehren die Richtung des Kamerabildes um. Verwenden Sie `'mirroredDisplay: true;'` mit `'cameraDirection: front;'` für den Selfie-Modus. Sollte nicht aktiviert werden, wenn World Tracking (SLAM) aktiviert ist.                             |
| disableXrTablet                       | `Boolesche` | `false`                 | Deaktivieren Sie das sichtbare Tablet in immersiven Sitzungen.                                                                                                                                                                                                                                                         |
| xrTabletStartsMinimized               | `Boolesche` | `false`                 | Das Tablet wird minimiert gestartet.                                                                                                                                                                                                                                                                                   |
| disableDefaultEnvironment             | `Boolesche` | `false`                 | Deaktivieren Sie den Standardhintergrund "leerer Raum".                                                                                                                                                                                                                                                                |
| disableDesktopCameraControls          | `Boolesche` | `false`                 | Deaktivieren Sie WASD und Mausblick für die Kamera.                                                                                                                                                                                                                                                                    |
| disableDesktopTouchEmulation          | `Boolesche` | `false`                 | Deaktivieren Sie Fake Touches auf dem Desktop.                                                                                                                                                                                                                                                                         |
| disableXrTouchEmulation               | `Boolesche` | `false`                 | Geben Sie keine Touch-Ereignisse basierend auf Controller-Raycasts mit der Szene aus.                                                                                                                                                                                                                                  |
| disableCameraReparenting              | `Boolesche` | `false`                 | Kamera deaktivieren -> Controller Objekt bewegen                                                                                                                                                                                                                                                                       |
| defaultEnvironmentFloorScale          | `Nummer`    | `1`                     | Verkleinern oder vergrößern Sie die Bodentextur.                                                                                                                                                                                                                                                                       |
| defaultEnvironmentFloorTexture        | Asset       |                         | Geben Sie ein alternatives Textur-Asset oder eine URL für den gefliesten Boden an.                                                                                                                                                                                                                                     |
| defaultEnvironmentFloorColor          | Hex-Farbe   | `#1A1C2A`               | Legen Sie die Farbe des Bodens fest.                                                                                                                                                                                                                                                                                   |
| defaultEnvironmentFogIntensity        | `Nummer`    | `1`                     | Erhöhen oder verringern Sie die Nebeldichte.                                                                                                                                                                                                                                                                           |
| defaultEnvironmentSkyTopColor         | Hex-Farbe   | `#BDC0D6`               | Legen Sie die Farbe des Himmels direkt über dem Benutzer fest.                                                                                                                                                                                                                                                         |
| defaultEnvironmentSkyBottomColor      | Hex-Farbe   | `#1A1C2A`               | Legen Sie die Farbe des Himmels am Horizont fest.                                                                                                                                                                                                                                                                      |
| defaultEnvironmentSkyGradientStrength | `Nummer`    | `1`                     | Legen Sie fest, wie scharf die Übergänge des Himmelsgradienten sind.                                                                                                                                                                                                                                                   |

Anmerkungen:

* `cameraDirection`: Wenn Sie `xrweb` für die Weltverfolgung (SLAM) verwenden, wird nur die `hintere` Kamera unterstützt. Wenn Sie die `Frontkamera` verwenden, müssen Sie die Weltverfolgung deaktivieren, indem Sie `disableWorldTracking: true` auf `xrweb` einstellen.

## Weltverfolgung, Bildziele und/oder Feuerschiff VPS: `xrweb` {#world-tracking-image-targets-andor-lightship-vps}

Wenn Sie World Tracking Image Targets oder Lightship VPS wünschen, fügen Sie die Komponente `xrweb` zu Ihrer `A-Szene` hinzu:

`<a-scene xrconfig xrweb>`

#### xrweb Attribute (alle optional) {#xrweb-attributes}

| Komponente           | Typ         | Standard       | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ----------- | -------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| scale                | `String`    | `'responsive'` | Entweder `'responsive'` oder `'absolute'`. `'responsive'` gibt Werte zurück, so dass sich die Kamera auf Bild 1 am Ursprung befindet, der über [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix) definiert wurde. `'absolut'` gibt die Kamera, Bildziele usw. in Metern zurück. Die Standardeinstellung ist `'responsive'`. Wenn Sie `'absolut'` verwenden, werden die x-Position, die z-Position und die Drehung der Ausgangspose die in [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix) festgelegten Parameter berücksichtigen, sobald die Skalierung geschätzt wurde. Die y-Position hängt von der physischen Höhe der Kamera über dem Boden ab. |
| disableWorldTracking | `Boolesche` | `false`        | Wenn ja, schalten Sie die SLAM-Verfolgung aus Effizienzgründen aus.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| enableVps            | `Boolesche` | `false`        | Wenn ja, suchen Sie nach Projektstandorten und einem Netz. Das zurückgegebene Netz hat keinen Bezug zu Projektstandorten und wird auch dann zurückgegeben, wenn keine Projektstandorte konfiguriert sind. Die Aktivierung von VPS setzt die Einstellungen für `scale` und `disableWorldTracking` außer Kraft.                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| projectWayspots      | `Array`     | `[]`           | Durch Kommata getrennte Zeichenketten mit Namen von Projektstandorten, die ausschließlich lokalisiert werden sollen. Wenn nicht gesetzt oder eine leere Zeichenkette übergeben wird, werden alle nahegelegenen Projektstandorte lokalisiert.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

Anmerkungen:

* `xrweb` und `xrface` können nicht gleichzeitig verwendet werden.
* `xrweb` und `xrlayers` können gleichzeitig verwendet werden. Sie müssen dazu `xrconfig` verwenden.
  * Die beste Vorgehensweise ist, immer `xrconfig` zu verwenden. Wenn Sie jedoch `xrweb` ohne `xrface` oder `xrlayers` oder `xrconfig` verwenden, wird `xrconfig` automatisch hinzugefügt. Wenn dies geschieht, werden alle Attribute, die auf `xrweb` gesetzt wurden, an `xrconfig` weitergegeben.
* `cameraDirection`: Die Weltverfolgung (SLAM) wird nur von der Rückkamera `` unterstützt. Wenn Sie die `` Frontkamera verwenden, müssen Sie die Weltverfolgung deaktivieren, indem Sie `disableWorldTracking: true` einstellen.
* Die Weltverfolgung (SLAM) wird nur auf mobilen Geräten unterstützt.

## Himmelseffekte: `xrlayers` und `xrlayerscene` {#sky-effects-xrlayers-and-xrlayerscene}

Wenn Sie Himmelseffekte wünschen:

1. Fügen Sie die Komponente `xrlayers` zu Ihrer `a-Szene hinzu`
2. Fügen Sie die Komponente `xrlayerscene` zu einer `a-entity` hinzu und fügen Sie den Inhalt, den Sie im Himmel haben möchten, unter dieser `a-entity` ein.

```html

  
    <!-- Fügen Sie hier Ihren Himmelseffekt-Inhalt hinzu. -->
  </a-entity>
</a-scene>
```

#### xrlayers Attribute {#xrlayers-attributes}

Keine

Anmerkungen:

* `xrlayers` und `xrface` können nicht gleichzeitig verwendet werden.
* `xrlayers` und `xrweb` können gleichzeitig verwendet werden. Sie müssen dazu `xrconfig` verwenden.
  * Die beste Vorgehensweise ist, immer `xrconfig` zu verwenden. Wenn Sie jedoch `xrlayers` ohne `xrface` oder `xrweb` oder `xrconfig` verwenden, wird `xrconfig` automatisch hinzugefügt. Wenn dies geschieht, werden alle Attribute, die auf `xrweb` gesetzt wurden, an `xrconfig` weitergegeben.

#### xrlayerscene Attribute {#xrlayerscene-attributes}

| Komponente      | Typ         | Standard | Beschreibung                                                                                                                                                                                                             |
| --------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| name            | `String`    | `''`     | Der Name der Ebene. Sollte einem Layer aus [`XR8.LayersController`](../layerscontroller/layerscontroller.md). Die einzige derzeit unterstützte Ebene ist `sky`.                                                          |
| invertLayerMask | `Boolesche` | `false`  | Wenn dies der Fall ist, verdecken Inhalte, die Sie in Ihrer Szene platzieren, Bereiche außerhalb des Himmels. Wenn diese Option falsch ist, verdeckt der Inhalt, den Sie in Ihrer Szene platzieren, die Himmelsbereiche. |
| edgeSmoothness  | `Nummer`    | `0`      | Menge, um die Ränder der Ebene zu glätten. Gültige Werte zwischen 0-1.                                                                                                                                                   |

## Gesichtseffekte: `xrface` {#face-effects}

Wenn Sie die Verfolgung von Gesichtseffekten wünschen, fügen Sie die Komponente `xrface` zu Ihrer `A-Szene` hinzu:

`<a-scene xrconfig xrface>`

#### xrface Attribute {#xrface-attributes}

| Komponente               | Typ        | Standard                               | Beschreibung                                                                                                                                                                                                                  |
| ------------------------ | ---------- | -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| meshGeometry             | `Array`    | `['Gesicht']`                          | Durch Kommata getrennte Strings, die festlegen, für welche Teile des Gesichtsnetzes Dreiecksindizes zurückgegeben werden sollen. Kann eine beliebige Kombination aus `'Gesicht'`, `'Augen'`, `'Iris'` und/oder `'Mund'` sein. |
| maxDetections [Optional] | `Nummer`   | `1`                                    | Die maximale Anzahl der zu erkennenden Gesichter. Sie haben die Wahl zwischen 1, 2 und 3.                                                                                                                                     |
| uvType [Optional]        | `String`   | `[XR8.FaceController.UvType.STANDARD]` | Legt fest, welche Uvs im Facescanning- und Faceloading-Ereignis zurückgegeben werden. Die Optionen sind: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`                                          |
| enableEars [Optional]    | `Boolesch` | `false`                                | Wenn „true“, wird die Ohrenerkennung gleichzeitig mit den Gesichtseffekten ausgeführt und die Ohranbringungspunkte werden zurückgegeben.                                                                                      |


Anmerkungen:

* `xrface` und `xrweb` können nicht gleichzeitig verwendet werden.
* `xrface` und `xrlayers` können nicht gleichzeitig verwendet werden.
* Am Besten verwenden Sie immer `xrconfig`; wenn Sie jedoch `xrface` ohne `xrconfig` erwenden, wird `xrconfig` automatisch hinzugefügt. Wenn dies geschieht, werden alle Attribute, die auf `xrface` gesetzt wurden, an `xrconfig` weitergegeben.

## Handverfolgung: `xrhand` {#hand-tracking}

Wenn Sie Handverfolgung wünschen, fügen Sie die Komponente `xrhand` zu Ihrer `A-Szene` hinzu:

`<a-scene xrconfig xrhand>`

#### xrhand Attribute {#xrhand-attributes}

| Komponente              | Typ        | Standard | Beschreibung                                                                                                                                      |
| ----------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| enableWrists [Optional] | `Boolesch` | `false`  | Wenn "true", wird die Handgelenkserkennung gleichzeitig mit der Handverfolgung durchgeführt und die Handgelenksansatzpunkte werden zurückgegeben. |

Keine

Anmerkungen:

* `xrhand` und `xrweb` können nicht gleichzeitig verwendet werden.
* `xrhand` und `xrlayers` können nicht gleichzeitig verwendet werden.
* `xrhand` und `xrface` können nicht gleichzeitig verwendet werden.

## Funktionen {#functions}

| Funktion                                          | Beschreibung                                                                                                                                                                                         |
| ------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrconfigComponent](xrconfigcomponent.md)         | Erzeugt eine A-Frame-Komponente zur Konfiguration der Kamera, die mit `AFRAME.registerComponent()` registriert werden kann. Muss im Allgemeinen nicht direkt aufgerufen werden.                      |
| [xrwebComponent](xrwebcomponent.md)               | Erzeugt eine A-Frame Komponente für World Tracking und/oder Image Target Tracking, die mit `AFRAME.registerComponent()` registriert werden kann. Muss im Allgemeinen nicht direkt aufgerufen werden. |
| [xrlayersComponent](xrlayerscomponent.md)         | Erzeugt eine A-Frame Komponente für die Ebenenverfolgung, die mit `AFRAME.registerComponent()` registriert werden kann. Muss im Allgemeinen nicht direkt aufgerufen werden.                          |
| [xrfaceComponent](xrfacecomponent.md)             | Erstellt eine A-Frame-Komponente für Face Effects Tracking, die mit `AFRAME.registerComponent()` registriert werden kann. Muss im Allgemeinen nicht direkt aufgerufen werden.                        |
| [xrlayersceneComponent](xrlayerscenecomponent.md) | Erzeugt eine A-Frame Komponente für eine Layer-Szene, die mit `AFRAME.registerComponent()` registriert werden kann. Muss im Allgemeinen nicht direkt aufgerufen werden.                              |

#### Beispiel - SLAM aktiviert (Standard) {#example---slam-enabled-default}

```html
<a-scene xrconfig xrweb>
```

#### Beispiel - SLAM deaktiviert (nur Bildverfolgung) {#example---slam-disabled-image-tracking-only}

```html
<a-scene xrconfig xrweb="disableWorldTracking: true">
```

#### Beispiel - VPS aktivieren {#example---enable-vps}

```html
<a-scene xrconfig xrweb="enableVps: true; projectWayspots=location1,location2,location3">
```

#### Beispiel - Frontkamera (nur Bildverfolgung) {#example---front-camera-image-tracking-only}

```html
<a-scene xrconfig="cameraDirection: front" xrweb="disableWorldTracking: true">
```

#### Beispiel - Frontkamera Himmelseffekte {#example---front-camera-sky-effects}

```html
<a-scene xrconfig="cameraDirection: front" xrlayers>
```

#### Beispiel - Himmel + SLAM {#example---sky--slam}

```html

  
    <!-- Fügen Sie hier Ihren Himmelseffekt-Inhalt hinzu. -->
  </a-entity>
</a-scene>
```

#### Beispiel - Gesichtseffekte {#example---face-effects}

```html
<a-scene xrconfig xrface>
```

#### Beispiel – Gesichtseffekte mit Ohren {#example---face-effects-ears}

```html
<a-scene xrconfig xrface="enableEars:true">
```

#### Beispiel - Handverfolgung {#example---hand-tracking}

```html
<a-scene xrconfig xrhand>
```
