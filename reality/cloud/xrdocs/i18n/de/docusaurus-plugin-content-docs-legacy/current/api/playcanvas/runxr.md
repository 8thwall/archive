---
sidebar_label: runXr() (veraltet)
---

# XR8.PlayCanvas.runXr() (veraltet)

XR8.PlayCanvas.runXr( {pcCamera, pcApp}, [extraModules], config )\\`

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

| Eigentum                                                                                                 | Typ                                                                                     | Standard                                                                                        | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Leinwand                                                                                                 | [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) |                                                                                                 | Die HTML-Leinwand, auf die der Kamerafeed gezeichnet wird. In der Regel handelt es sich dabei um "application-canvas".                                                                                                                                                                                                                                                                                          |
| webgl2 [Optional]                                    | `Boolean`                                                                               | false                                                                                           | Bei "true" wird WebGL2 verwendet, falls verfügbar, andernfalls wird auf WebGL1 zurückgegriffen.  Wenn false, wird immer WebGL1 verwendet.                                                                                                                                                                                                                                                                       |
| ownRunLoop [Optional]                                | `Boolean`                                                                               | false                                                                                           | Wenn dies der Fall ist, sollte XR seine eigene Laufschleife verwenden.  Wenn false, stellen Sie Ihre eigene Ausführungsschleife bereit und sind selbst für den Aufruf von [`XR8.runPreRender()`](/legacy/api/xr8/runprerender) und [`XR8.runPostRender()`](/legacy/api/xr8/runpostrender) verantwortlich [Nur für fortgeschrittene Benutzer]                                |
| cameraConfig: {direction} [Optional] | Objekt                                                                                  | `{Richtung: XR8.XrConfig.camera().BACK}`                                                        | Gewünschte Kamera zu verwenden. Unterstützte Werte für `Richtung` sind `XR8.XrConfig.camera().BACK` oder `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                                          |
| glContextConfig [Kann]                               | WebGLContextAttribute                                                                   | `Null`                                                                                          | Die Attribute zur Konfiguration des WebGL-Canvas-Kontextes.                                                                                                                                                                                                                                                                                                                                                                     |
| allowedDevices [Optional]                            | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)                                  | XR8.XrConfig.device().MOBILE | Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll.  Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, wird immer die Kamera geöffnet. Beachten Sie, dass die Weltverfolgung nur mit `XR8.XrConfig.device().MOBILE` verwendet werden kann. |

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
var xrcontroller = pc.createScript('xrcontroller')

// Optional kann die Weltverfolgung deaktiviert werden, um die Effizienz beim Verfolgen von Bildzielen zu erhöhen.
xrcontroller.attributes.add('disableWorldTracking', {type: 'Boolean'})

xrcontroller.prototype.initialize = function() {
  const disableWorldTracking = this.disableWorldTracking

  // Nachdem XR vollständig geladen wurde, öffnen Sie den Kamera-Feed und beginnen Sie mit der Anzeige von AR.
  const runOnLoad = ({pcCamera, pcApp}, extramodules) => () => {
    XR8.xrController().configure({disableWorldTracking})
    // Geben Sie den Namen Ihrer Leinwand ein. Normalerweise ist dies 'application-canvas'.
    const config = {canvas: document.getElementById('application-canvas') }
    XR8.PlayCanvas.runXr({pcCamera, pcApp}, extraModules, config)
  }

  // Finden Sie die Kamera in der PlayCanvas-Szene und binden Sie sie an die Bewegung des Telefons des Benutzers in der
  // Welt.
  const pcCamera = XRExtras.PlayCanvas.findOneCamera(this.entity)

  // Zeigen Sie einige hilfreiche Dinge, während XR noch geladen wird.
  // Fast fertig: Erkennt, ob die Umgebung des Benutzers web ar unterstützen kann, und wenn nicht,
  // zeigt Hinweise zur Anzeige des Erlebnisses an.
  // Laden: Zeigt Aufforderungen zur Erteilung von Kamerazulassungen an und blendet die Szene aus, bis sie zur Anzeige bereit ist.
  // Laufzeitfehler: Wenn etwas Unerwartetes schief geht, wird ein Fehlerbildschirm angezeigt.
  XRExtras.Loading.showLoading({onxrloaded: runOnLoad({pcCamera, pcApp: this.app}, [
    // Optionale Module, die Entwickler möglicherweise anpassen oder thematisieren möchten.
    XRExtras.AlmostThere.pipelineModule(), // Erkennt nicht unterstützte Browser und gibt Hinweise.
    XRExtras.Loading.pipelineModule(), // Verwaltet den Ladebildschirm beim Starten.
    XRExtras.RuntimeError.pipelineModule(), // Zeigt bei Laufzeitfehlern ein Fehlerbild an.
  ])})
}
```
