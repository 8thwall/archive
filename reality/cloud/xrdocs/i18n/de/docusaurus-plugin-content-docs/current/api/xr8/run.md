---
sidebar_label: run()
---

# XR8.run()

`XR8.run(canvas, webgl2, ownRunLoop, cameraConfig, glContextConfig, allowedDevices, sessionConfiguration)`

## Beschreibung {#description}

Öffnen Sie die Kamera und starten Sie die Schleife zum Ausführen der Kamera.

## Parameter {#parameters}

| Eigentum                                                                                          | Typ                                             | Standard                                    | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| canvas                                                                                            | `HTMLCanvasElement`                             |                                             | Die HTML-Leinwand, in die der Kamera-Feed gezeichnet wird.                                                                                                                                                                                                                                                                                                                                                                    |
| webgl2 [Optional]                                                                                 | `Boolesche`                                     | `wahr`                                      | Bei Wahr verwenden Sie WebGL2, falls verfügbar, andernfalls wird auf WebGL1 zurückgegriffen.  Wenn Falsch, verwenden Sie immer WebGL1.                                                                                                                                                                                                                                                                                        |
| ownRunLoop [Optional]                                                                             | `Boolesche`                                     | `wahr`                                      | Wenn Wahr, sollte XR seine eigene Laufschleife verwenden.  Wenn Falsch, stellen Sie Ihre eigene Laufschleife bereit und sind selbst für den Aufruf von [runPreRender](runprerender.md) und [runPostRender](runpostrender.md) verantwortlich [Nur für fortgeschrittene Benutzer]                                                                                                                                               |
| cameraConfig: {direction} [Optional]                                                              | `Objekt`                                        | `{direction: XR8.XrConfig.camera().BACK}`   | Zu verwendende Kamera. Unterstützte Werte für `Richtung` sind `XR8.XrConfig.camera().BACK` oder `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                                                 |
| glContextConfig [Optional]                                                                        | `WebGLContextAttribute`                         | `null`                                      | Die Attribute zur Konfiguration des WebGL-Canvas-Kontextes.                                                                                                                                                                                                                                                                                                                                                                   |
| allowedDevices [Optional]                                                                         | [`XR8.XrConfig.device()`](/api/xrconfig/device) | `XR8.XrConfig.device().MOBILE_AND_HEADSETS` | Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll.  Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, öffnen Sie immer die Kamera. Beachten Sie, dass die Weltverfolgung nur mit `XR8.XrConfig.device().MOBILE_AND_HEADSETS` oder `XR8.XrConfig.device().MOBILE` verwendet werden kann. |
| sessionConfiguration: `{disableXrTablet, xrTabletStartsMinimized, defaultEnvironment}` [Optional] | `Objekt`                                        | `{}`                                        | Konfigurieren Sie die Optionen für die verschiedenen Arten von Sitzungen.                                                                                                                                                                                                                                                                                                                                                     |

`sessionConfiguration` ist ein Objekt mit den folgenden [optionalen] Eigenschaften:

| Eigentum                                                                                                                                         | Typ         | Standard | Beschreibung                                                                      |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------- | -------- | --------------------------------------------------------------------------------- |
| disableXrTablet [Optional]                                                                                                                       | `Boolesche` | `false`  | Deaktivieren Sie das sichtbare Tablet in immersiven Sitzungen.                    |
| xrTabletStartsMinimized [Optional]                                                                                                               | `Boolesche` | `false`  | Das Tablet wird minimiert gestartet.                                              |
| defaultEnvironment `{disabled, floorScale, floorTexture, floorColor, fogIntensity, skyTopColor, skyBottomColor, skyGradientStrength}` [Optional] | `Objekt`    | {}       | Konfigurieren Sie die Optionen für die Standardumgebung Ihrer immersiven Sitzung. |

`defaultEnvironment` ist ein Objekt mit den folgenden [optionalen] Eigenschaften:

| Eigentum                       | Typ         | Standard  | Beschreibung                                                                       |
| ------------------------------ | ----------- | --------- | ---------------------------------------------------------------------------------- |
| deaktiviert [Optional]         | `Boolesche` | `false`   | Deaktivieren Sie den Standardhintergrund "leerer Raum".                            |
| floorScale [Optional]          | `Nummer`    | `1`       | Verkleinern oder vergrößern Sie die Bodentextur.                                   |
| floorTexture [Optional]        | Asset       |           | Geben Sie ein alternatives Textur-Asset oder eine URL für den gefliesten Boden an. |
| floorColor [Optional]          | Hex-Farbe   | `#1A1C2A` | Legen Sie die Farbe des Bodens fest.                                               |
| fogIntensity [Optional]        | `Nummer`    | `1`       | Erhöhen oder verringern Sie die Nebeldichte.                                       |
| skyTopColor [Optional]         | Hex-Farbe   | `#BDC0D6` | Legen Sie die Farbe des Himmels direkt über dem Benutzer fest.                     |
| skyBottomColor [Optional]      | Hex-Farbe   | `#1A1C2A` | Legen Sie die Farbe des Himmels am Horizont fest.                                  |
| skyGradientStrength [Optional] | `Nummer`    | `1`       | Legen Sie fest, wie scharf die Übergänge des Himmelsgradienten sind.               |

Anmerkungen:

* `cameraConfig`: Die Weltverfolgung (SLAM) wird nur von der Rückfahrkamera `` unterstützt.  Wenn Sie die `Frontkamera` verwenden, müssen Sie zuerst die Weltverfolgung deaktivieren, indem Sie `XR8.XrController.configure({disableWorldTracking: true})` aufrufen.

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
// Öffnen Sie die Kamera und starten Sie die Kameralaufschleife
// In index.html: 
XR8.run({canvas: document.getElementById('camerafeed')})
```

## Beispiel - Verwendung der Frontkamera (nur Bildverfolgung) {#example---using-front-camera-image-tracking-only}

```javascript
// Deaktivieren Sie die Weltverfolgung (SLAM). Dies ist erforderlich, um die Frontkamera zu verwenden.
XR8.XrController.configure({disableWorldTracking: true})
// Öffnen Sie die Kamera und starten Sie die Kameralaufschleife
// In index.html: 
XR8.run({canvas: document.getElementById('camerafeed'), cameraConfig: {direction: XR8.XrConfig.camera().FRONT}})
```

## Beispiel - glContextConfig einstellen {#example---set-glcontextconfig}

```javascript
// Öffnen Sie die Kamera und starten Sie die Kameralaufschleife mit einer opaken Leinwand.
// In index.html: 
XR8.run({canvas: document.getElementById('camerafeed'), glContextConfig: {alpha: false, preserveDrawingBuffer: false}})
```
