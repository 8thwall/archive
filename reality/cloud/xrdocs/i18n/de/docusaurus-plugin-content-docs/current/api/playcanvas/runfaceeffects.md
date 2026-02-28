---
sidebar_label: runFaceEffects() (veraltet)
---

# XR8.PlayCanvas.runFaceEffects() (veraltet)

`XR8.PlayCanvas.runFaceEffects( {pcCamera, pcApp}, [extraModules], config )`

## Beschreibung {#description}

Öffnet die Kamera und startet die Ausführung von XR World Tracking und/oder Image Targets in einer PlayCanvas-Szene.

## Parameter {#parameters}

| Parameter               | Beschreibung                                                                         |
| ----------------------- | ------------------------------------------------------------------------------------ |
| pcKamera                | Die PlayCanvas Szenenkamera zur Benutzung mit AR.                                    |
| pcApp                   | Die PlayCanvas-App, typischerweise `this.app`.                                       |
| extraModules [Optional] | Eine optionale Reihe von zusätzlichen Pipeline-Modulen, die Sie installieren können. |
| config                  | Konfigurationsparameter zur Übergabe an [`XR8.run()`](/api/xr8/run)                  |

`config` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum                             | Typ                                                                                       | Standard                                  | Beschreibung                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| canvas                               | [`HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) |                                           | Die HTML-Leinwand, in die der Kamera-Feed gezeichnet wird. In der Regel ist dies 'application-canvas'.                                                                                                                                                                                                                                                                       |
| webgl2 [Optional]                    | `Boolesche`                                                                               | `false`                                   | Bei Wahr verwenden Sie WebGL2, falls verfügbar, andernfalls wird auf WebGL1 zurückgegriffen.  Wenn Falsch, verwenden Sie immer WebGL1.                                                                                                                                                                                                                                       |
| ownRunLoop [Optional]                | `Boolesche`                                                                               | `false`                                   | Wenn Wahr, sollte XR seine eigene Laufschleife verwenden.  Wenn Falsch, stellen Sie Ihre eigene Laufschleife bereit und sind selbst für den Aufruf von [`XR8.runPreRender()`](/api/xr8/runprerender) und [`XR8.runPostRender()`](/api/xr8/runpostrender) verantwortlich [Nur für fortgeschrittene Benutzer]                                                                  |
| cameraConfig: {direction} [Optional] | `Objekt`                                                                                  | `{direction: XR8.XrConfig.camera().BACK}` | Zu verwendende Kamera. Unterstützte Werte für `Richtung` sind `XR8.XrConfig.camera().BACK` oder `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                |
| glContextConfig [Optional]           | `WebGLContextAttribute`                                                                   | `null`                                    | Die Attribute zur Konfiguration des WebGL-Canvas-Kontextes.                                                                                                                                                                                                                                                                                                                  |
| allowedDevices [Optional]            | [`XR8.XrConfig.device()`](/api/xrconfig/device)                                           | `XR8.XrConfig.device().MOBILE`            | Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll.  Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, öffnen Sie immer die Kamera. Beachten Sie, dass die Weltverfolgung nur mit `XR8.XrConfig.device().MOBILE` verwendet werden kann. |

## Returns {#returns}

Keine
