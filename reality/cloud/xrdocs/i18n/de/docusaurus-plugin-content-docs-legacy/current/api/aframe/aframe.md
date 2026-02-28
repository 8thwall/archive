# XR8.AFrame

A-Frame (<https://aframe.io>) ist ein Web-Framework für die Entwicklung von Virtual-Reality-Erfahrungen.
Durch das Hinzufügen von 8th Wall Web zu Ihrem A-Frame Projekt können Sie jetzt ganz einfach **Augmented Reality**
Erlebnisse für das Web erstellen.

## Hinzufügen des 8. Wandstegs zum A-Rahmen {#adding-8th-wall-web-to-a-frame}

#### Cloud Editor {#cloud-editor}

1. Fügen Sie einfach einen "meta"-Tag in head.html ein, um die "8-Frame"-Bibliothek in Ihr Projekt aufzunehmen. Wenn Sie von einer der auf A-Frame basierenden Vorlagen von 8th Wall oder von selbst gehosteten Projekten klonen, ist sie bereits vorhanden.  Es ist auch nicht erforderlich, den AppKey manuell hinzuzufügen.

`<meta name="8thwall:renderer" content="aframe:1.4.1">`

#### Selbst gehostet {#self-hosted}

8th Wall Web kann in wenigen einfachen Schritten zu Ihrem A-Frame-Projekt hinzugefügt werden:

1. Enthält eine leicht veränderte Version von A-Frame (genannt "8-Frame"), die einige Probleme bei der Optimierung behebt:

`<script src="//cdn.8thwall.com/web/aframe/8frame-1.4.1.min.js"></script>`

2. Fügen Sie das folgende Skript-Tag in den HEAD Ihrer Seite ein. Ersetzen Sie die X's durch Ihren App-Schlüssel:

`<script src="//apps.8thwall.com/xrweb?appKey=XXXXX"></script>`

## Konfigurieren der Kamera: `xrconfig` {#configuring-the-camera}

Um den Kamera-Feed zu konfigurieren, fügen Sie die Komponente "xrconfig" zu Ihrer "a-scene" hinzu:

`<a-scene xrconfig>`

#### xrconfig Attribute (alle optional) {#xrconfig-attributes}

| Komponente                            | Typ       | Standard            | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------- | --------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| cameraDirection                       | `String`  | Rücken              | Gewünschte Kamera zu verwenden. Wählen Sie aus: "hinten" oder "vorne". Verwenden Sie `cameraDirection: front;` mit `mirroredDisplay: true;` für den Selfie-Modus. Beachten Sie, dass die Weltverfolgung nur mit `cameraDirection: back;` unterstützt wird.                                                      |
| allowedDevices                        | `String`  | Handy und Kopfhörer | Unterstützte Geräteklassen. Wählen Sie aus: "Handy und Kopfhörer", "Handy" oder "beliebig". Verwenden Sie `'any'`, um Laptop- oder Desktop-Geräte mit eingebauter oder angeschlossener Webcam zu aktivieren. Beachten Sie, dass die Weltverfolgung nur bei "Handy und Kopfhörer" oder "Handy" unterstützt wird. |
| mirroredDisplay                       | `Boolean` | false               | Wenn "true", wird in der Ausgangsgeometrie nach links und rechts gespiegelt und die Richtung der Kameraführung umgekehrt. Verwenden Sie `'mirroredDisplay: true;'` mit `'cameraDirection: front;'` für den Selfie-Modus. Sollte nicht aktiviert werden, wenn World Tracking (SLAM) aktiviert ist.                            |
| disableXrTablet                       | `Boolean` | false               | Deaktivieren Sie die Sichtbarkeit des Tablets in immersiven Sitzungen.                                                                                                                                                                                                                                                                                                          |
| xrTabletStartsMinimized               | `Boolean` | false               | Das Tablet wird minimiert gestartet.                                                                                                                                                                                                                                                                                                                                            |
| disableDefaultEnvironment             | `Boolean` | false               | Deaktivieren Sie den Standardhintergrund "leerer Raum".                                                                                                                                                                                                                                                                                                                         |
| disableDesktopCameraControls          | `Boolean` | false               | Deaktivieren Sie WASD und Mausblick für die Kamera.                                                                                                                                                                                                                                                                                                                             |
| disableDesktopTouchEmulation          | `Boolean` | false               | Deaktivieren Sie gefälschte Berührungen auf dem Desktop.                                                                                                                                                                                                                                                                                                                        |
| disableXrTouchEmulation               | `Boolean` | false               | Geben Sie keine Berührungsereignisse auf der Grundlage von Controller-Raycasts mit der Szene aus.                                                                                                                                                                                                                                                                               |
| disableCameraReparenting              | `Boolean` | false               | Kamera deaktivieren -> Controller Objekt bewegen                                                                                                                                                                                                                                                                                                                                                |
| defaultEnvironmentFloorScale          | Nummer    | `1`                 | Verkleinern oder Vergrößern der Bodentextur.                                                                                                                                                                                                                                                                                                                                    |
| defaultEnvironmentFloorTexture        | Vermögen  |                     | Geben Sie ein alternatives Texturelement oder eine URL für den gefliesten Boden an.                                                                                                                                                                                                                                                                                             |
| defaultEnvironmentFloorColor          | Hex-Farbe | #1A1C2A             | Legen Sie die Bodenfarbe fest.                                                                                                                                                                                                                                                                                                                                                  |
| defaultEnvironmentFogIntensity        | Nummer    | `1`                 | Erhöhen oder verringern Sie die Nebeldichte.                                                                                                                                                                                                                                                                                                                                    |
| defaultEnvironmentSkyTopColor         | Hex-Farbe | `#BDC0D6`           | Legen Sie die Farbe des Himmels direkt über dem Benutzer fest.                                                                                                                                                                                                                                                                                                                  |
| defaultEnvironmentSkyBottomColor      | Hex-Farbe | #1A1C2A             | Legen Sie die Farbe des Himmels am Horizont fest.                                                                                                                                                                                                                                                                                                                               |
| defaultEnvironmentSkyGradientStrength | Nummer    | `1`                 | Legen Sie fest, wie scharf der Himmelsverlauf übergeht.                                                                                                                                                                                                                                                                                                                         |

Anmerkungen:

- kameraRichtung": Bei der Verwendung von "xrweb" für die Weltverfolgung (SLAM) wird nur die "Rückwärts"-Kamera unterstützt
  . Wenn Sie die "Front"-Kamera verwenden, müssen Sie die Weltverfolgung deaktivieren, indem Sie
  "disableWorldTracking: true" auf "xrweb" einstellen.

## Weltverfolgung, Bildziele und/oder Feuerschiff VPS: `xrweb` {#world-tracking-image-targets-andor-lightship-vps}

Wenn du World Tracking Image Targets oder Lightship VPS möchtest, füge die Komponente "xrweb" zu deiner "a-scene" hinzu:

`<a-scene xrconfig xrweb>`

#### xrweb Attribute (alle optional) {#xrweb-attributes}

| Komponente           | Typ       | Standard         | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | --------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skala                | `String`  | 'reaktionsfähig' | Entweder `'responsive'` oder `'absolute'`. 'responsive' gibt Werte zurück, so dass sich die Kamera auf Bild 1 am Ursprung befindet, der mit [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix) definiert wurde. 'absolute' gibt die Kamera, die Bildziele usw. in Metern zurück. Die Voreinstellung ist `'responsive'`. Bei der Verwendung von `'absolute'` werden die x-Position, die z-Position und die Drehung der Ausgangspose die in [`XR8.XrController.updateCameraProjectionMatrix()`](../xrcontroller/updatecameraprojectionmatrix) festgelegten Parameter einhalten, sobald die Skalierung geschätzt wurde. Die y-Position hängt von der physischen Höhe der Kamera über der Bodenebene ab. |
| disableWorldTracking | `Boolean` | false            | Wenn ja, wird das SLAM-Tracking aus Effizienzgründen deaktiviert.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| enableVps            | `Boolean` | false            | Wenn ja, suchen Sie nach Projektstandorten und einem Netz. Das zurückgegebene Netz hat keinen Bezug zu Projektstandorten und wird auch dann zurückgegeben, wenn keine Projektstandorte konfiguriert sind. Die Aktivierung von VPS überschreibt die Einstellungen für `Scale` und `disableWorldTracking`.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| projectWayspots      | Array     | `[]`             | Durch Kommata getrennte Zeichenketten mit Namen von Projektstandorten, die ausschließlich lokalisiert werden sollen. Wenn nicht gesetzt oder eine leere Zeichenkette übergeben wird, werden alle nahegelegenen Projektstandorte lokalisiert.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

Anmerkungen:

- xrweb" und "xrface" können nicht gleichzeitig verwendet werden.
- xrweb" und "xrlayers" können gleichzeitig verwendet werden. Sie müssen dazu `xrconfig` verwenden.
  - Die beste Vorgehensweise ist, immer `xrconfig` zu verwenden; wenn Sie jedoch `xrweb` ohne `xrface` oder
    `xrlayers` oder `xrconfig` verwenden, wird `xrconfig` automatisch hinzugefügt. Wenn dies geschieht, werden alle
    Attribute, die auf `xrweb` gesetzt wurden, an `xrconfig` weitergegeben.
- kameraRichtung": Die Weltverfolgung (SLAM) wird nur von der "Rückwärts"-Kamera unterstützt. Wenn Sie
  die "Frontkamera" verwenden, müssen Sie die Weltverfolgung deaktivieren, indem Sie "DisableWorldTracking: true" einstellen.
- Die Weltverfolgung (SLAM) wird nur auf mobilen Geräten unterstützt.

## Himmels-Effekte: `xrlayers` und `xrlayerscene` {#sky-effects-xrlayers-and-xrlayerscene}

Wenn Sie Sky Effects wünschen:

1. Fügen Sie die Komponente "xrlayers" zu Ihrer "a-scene" hinzu.
2. Fügen Sie die Komponente "xrlayerscene" zu einer "a-entity" hinzu und fügen Sie den Inhalt, den Sie im Himmel sehen wollen, unter dieser "a-entity" ein.

```html
<a-scene xrconfig xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Add your Sky Effects content here. -->
  </a-entity>
</a-scene>
```

#### xrlayers Attribute {#xrlayers-attributes}

Keine

Anmerkungen:

- xrlayers" und "xrface" können nicht gleichzeitig verwendet werden.
- xrlayers" und "xrweb" können gleichzeitig verwendet werden. Sie müssen dazu `xrconfig` verwenden.
  - Die beste Praxis ist, immer `xrconfig` zu verwenden; wenn Sie jedoch `xrlayers` ohne `xrface` oder `xrweb` oder `xrconfig` verwenden, wird `xrconfig` automatisch hinzugefügt. Wenn dies geschieht, werden alle Attribute, die auf `xrweb` gesetzt wurden, an `xrconfig` weitergegeben.

#### xrlayerscene Attribute {#xrlayerscene-attributes}

| Komponente      | Typ       | Standard | Beschreibung                                                                                                                                                                                                                                      |
| --------------- | --------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name            | `String`  | `''`     | Der Name der Ebene. Sollte einer Ebene aus [XR8.LayersController](../layerscontroller/layerscontroller.md) entsprechen. Derzeit wird nur die Ebene "Himmel" unterstützt.          |
| invertLayerMask | `Boolean` | false    | Wenn dies der Fall ist, verdeckt der Inhalt, den Sie in Ihrer Szene platzieren, Nicht-Himmel-Bereiche. Wenn diese Option falsch ist, verdeckt der Inhalt, den Sie in Ihrer Szene platzieren, die Himmelsbereiche. |
| edgeSmoothness  | Nummer    | `0`      | Menge, um die Ränder der Schicht zu glätten. Gültige Werte zwischen 0-1.                                                                                                                                          |

## Gesichtseffekte: `xrface` {#face-effects}

Wenn Sie die Verfolgung von Gesichtseffekten wünschen, fügen Sie die Komponente "xrface" zu Ihrer "Szene" hinzu:

`<a-scene xrconfig xrface>`

#### xrface Attribute {#xrface-attributes}

| Komponente                                                                   | Typ       | Standard                               | Beschreibung                                                                                                                                                                                                                                               |
| ---------------------------------------------------------------------------- | --------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| meshGeometry                                                                 | Array     | `['Gesicht']`                          | Durch Kommata getrennte Zeichenketten, die festlegen, für welche Teile des Flächennetzes Dreiecksindizes zurückgegeben werden sollen. Kann eine beliebige Kombination von "Gesicht", "Augen", "Iris" und/oder "Mund" sein. |
| maxDetections [Optional] | Nummer    | `1`                                    | Die maximale Anzahl der zu erkennenden Gesichter. Die verfügbaren Optionen sind 1, 2 oder 3.                                                                                                                               |
| uvType [Optional]        | `String`  | `[XR8.FaceController.UvType.STANDARD]` | Gibt an, welche Uvs im Facescanning- und Faceloading-Ereignis zurückgegeben werden. Die Optionen sind: `[XR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`                                         |
| enableEars [Optional]    | `Boolean` | false                                  | Wenn "true", wird die Ohrenerkennung gleichzeitig mit den Gesichtseffekten ausgeführt und die Ohranlegepunkte werden zurückgegeben.                                                                                                        |

Anmerkungen:

- xrface" und "xrweb" können nicht gleichzeitig verwendet werden.
- xrface" und "xrlayers" können nicht gleichzeitig verwendet werden.
- Die beste Praxis ist, immer `xrconfig` zu verwenden; wenn Sie jedoch `xrface` ohne `xrconfig` verwenden, wird `xrconfig` automatisch hinzugefügt. Wenn dies geschieht, werden alle Attribute, die auf `xrface` gesetzt wurden, an `xrconfig` weitergegeben.

## Handverfolgung: "xrhand" {#hand-tracking}

Wenn Sie die Handverfolgung wünschen, fügen Sie die Komponente "xrhand" zu Ihrer "a-scene" hinzu:

`<a-scene xrconfig xrhand>`

#### xrhand Attribute {#xrhand-attributes}

| Komponente                                                                  | Typ       | Standard | Beschreibung                                                                                                                                                     |
| --------------------------------------------------------------------------- | --------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enableWrists [Optional] | `Boolean` | false    | Wenn "true", wird die Handgelenkserkennung gleichzeitig mit der Handverfolgung ausgeführt und die Handgelenksanhängepunkte werden zurückgegeben. |

Keine

Anmerkungen:

- Die Programme "xrhand" und "xrweb" können nicht gleichzeitig verwendet werden.
- Die Programme "xrhand" und "xrlayers" können nicht gleichzeitig verwendet werden.
- xrhand" und "xrface" können nicht gleichzeitig verwendet werden.

## Funktionen {#functions}

| Funktion                                          | Beschreibung                                                                                                                                                                                                                               |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [xrconfigComponent](xrconfigcomponent.md)         | Erzeugt eine A-Frame-Komponente zur Konfiguration der Kamera, die mit `AFRAME.registerComponent()` registriert werden kann. Im Allgemeinen müssen sie nicht direkt aufgerufen werden.                      |
| [xrwebComponent](xrwebcomponent.md)               | Erzeugt eine A-Frame-Komponente für World Tracking und/oder Image Target Tracking, die mit `AFRAME.registerComponent()` registriert werden kann. Im Allgemeinen müssen sie nicht direkt aufgerufen werden. |
| [xrlayersComponent](xrlayerscomponent.md)         | Erzeugt eine A-Frame-Komponente für die Ebenenverfolgung, die mit `AFRAME.registerComponent()` registriert werden kann. Im Allgemeinen müssen sie nicht direkt aufgerufen werden.                          |
| [xrfaceComponent](xrfacecomponent.md)             | Erzeugt eine A-Frame-Komponente für die Verfolgung von Gesichtern, die mit `AFRAME.registerComponent()` registriert werden kann. Im Allgemeinen müssen sie nicht direkt aufgerufen werden.                 |
| [xrlayersceneComponent](xrlayerscenecomponent.md) | Erzeugt eine A-Frame-Komponente für eine Layer-Szene, die mit `AFRAME.registerComponent()` registriert werden kann. Im Allgemeinen müssen sie nicht direkt aufgerufen werden.                              |

#### Beispiel - SLAM aktiviert (Standard) {#example---slam-enabled-default}

```html
<a-scene xrconfig xrweb>
```

#### Beispiel - SLAM deaktiviert (nur Bildverfolgung) {#example---slam-disabled-image-tracking-only}

```html
<a-scene xrconfig xrweb="disableWorldTracking: true">
```

#### Beispiel - VPS einschalten {#example---enable-vps}

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
<a-scene xrconfig xrweb xrlayers>
  <a-entity xrlayerscene="name: sky; edgeSmoothness:0.6; invertLayerMask: true;">
    <!-- Add your Sky Effects content here. -->
  </a-entity>
</a-scene>
```

#### Beispiel - Gesichtseffekte {#example---face-effects}

```html
<a-scene xrconfig xrface>
```

#### Beispiel - Gesichtseffekte mit Ohren {#example---face-effects-ears}

```html
<a-scene xrconfig xrface="enableEars:true">
```

#### Beispiel - Hand Tracking {#example---hand-tracking}

```html
<a-scene xrconfig xrhand>
```
