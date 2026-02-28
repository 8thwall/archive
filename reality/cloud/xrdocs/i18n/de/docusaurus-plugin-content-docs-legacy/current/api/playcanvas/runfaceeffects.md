---
sidebar_label: runFaceEffects() (veraltet)
---

# XR8.PlayCanvas.runFaceEffects() (veraltet)

`XR8.PlayCanvas.runFaceEffects( {pcCamera, pcApp}, [extraModules], config )`

## Beschreibung {#description}

Öffnet die Kamera und startet die Ausführung von XR World Tracking und/oder Image Targets in einer PlayCanvas-Szene.

## Parameter {#parameters}

| Parameter                                                                   | Beschreibung                                                                                                    |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| pcKamera                                                                    | Die PlayCanvas-Szenenkamera zum Fahren mit AR.                                                  |
| pcApp                                                                       | Die PlayCanvas-Anwendung, in der Regel `this.app`.                                              |
| extraModules [Optional] | Eine optionale Reihe von zusätzlichen zu installierenden Pipeline-Modulen.                      |
| Konfiguration                                                               | Konfigurationsparameter zur Übergabe an [XR8.run()\\`](/legacy/api/xr8/run) |

config" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum                                                                                                 | Typ                                                                                            | Standard                                                                                        | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Leinwand                                                                                                 | [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/legacy/api/HTMLCanvasElement) |                                                                                                 | Die HTML-Leinwand, auf die der Kamerafeed gezeichnet wird. In der Regel handelt es sich dabei um "application-canvas".                                                                                                                                                                                                                                                                                          |
| webgl2 [Optional]                                    | `Boolean`                                                                                      | false                                                                                           | Bei "true" wird WebGL2 verwendet, falls verfügbar, andernfalls wird auf WebGL1 zurückgegriffen.  Wenn false, wird immer WebGL1 verwendet.                                                                                                                                                                                                                                                                       |
| ownRunLoop [Optional]                                | `Boolean`                                                                                      | false                                                                                           | Wenn dies der Fall ist, sollte XR seine eigene Laufschleife verwenden.  Wenn false, stellen Sie Ihre eigene Ausführungsschleife bereit und sind selbst für den Aufruf von [`XR8.runPreRender()`](/legacy/api/xr8/runprerender) und [`XR8.runPostRender()`](/legacy/api/xr8/runpostrender) verantwortlich [Nur für fortgeschrittene Benutzer]                                |
| cameraConfig: {direction} [Optional] | Objekt                                                                                         | `{Richtung: XR8.XrConfig.camera().BACK}`                                                        | Gewünschte Kamera zu verwenden. Unterstützte Werte für `Richtung` sind `XR8.XrConfig.camera().BACK` oder `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                                          |
| glContextConfig [Kann]                               | WebGLContextAttribute                                                                          | `Null`                                                                                          | Die Attribute zur Konfiguration des WebGL-Canvas-Kontextes.                                                                                                                                                                                                                                                                                                                                                                     |
| allowedDevices [Optional]                            | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)                                         | XR8.XrConfig.device().MOBILE | Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll.  Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, wird immer die Kamera geöffnet. Beachten Sie, dass die Weltverfolgung nur mit `XR8.XrConfig.device().MOBILE` verwendet werden kann. |

## Rückgabe {#returns}

Keine
