---
sidebar_label: runXr() (veraltet)
---

# XR8.PlayCanvas.runXr() (veraltet)

`XR8.PlayCanvas.runXr( {pcCamera, pcApp}, [extraModules], config )`

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

## Beispiel {#example}

```javascript
var xrcontroller = pc.createScript('xrcontroller')

// Optional kann die Weltverfolgung deaktiviert werden, um die Effizienz beim Verfolgen von Bildzielen zu erhöhen.
xrcontroller.attributes.add('disableWorldTracking', {type: 'Boolean'})

xrcontroller.prototype.initialize = function() {
  const disableWorldTracking = this.disableWorldTracking

  // Nachdem XR vollständig geladen ist, öffnen Sie den Kamera-Feed und beginnen mit der Anzeige von AR.
  const runOnLoad = ({pcCamera, pcApp}, extramodules) => () => {
    XR8.xrController().configure({disableWorldTracking})
    // Geben Sie Ihren Canvas-Namen ein. In der Regel ist dies 'application-canvas'.
    const config = {canvas: document.getElementById('application-canvas') }
    XR8.PlayCanvas.runXr({pcCamera, pcApp}, extraModules, config)
  }

  // Finden Sie die Kamera in der PlayCanvas-Szene und binden Sie sie an die Bewegung des Telefons des Benutzers in der
  // Welt.
  const pcCamera = XRExtras.PlayCanvas.findOneCamera(this.entity)

  // Während XR noch lädt, zeigt es einige hilfreiche Dinge an.
  // Fast fertig: Erkennt, ob die Umgebung des Benutzers web ar unterstützen kann, und wenn nicht,
  // zeigt es Hinweise an, wie Sie das Erlebnis anzeigen können.
  // Laden: Zeigt eine Aufforderung zur Erteilung der Kamerazulassung an und blendet die Szene aus, bis sie zur Anzeige bereit ist.
  // Laufzeitfehler: Wenn etwas unerwartet schief geht, wird ein Fehlerbildschirm angezeigt.
  XRExtras.Loading.showLoading({onxrloaded: runOnLoad({pcCamera, pcApp: this.app}, [
    // Optionale Module, die Entwickler möglicherweise anpassen oder thematisieren möchten.
    XRExtras.AlmostThere.pipelineModule(), // Erkennt nicht unterstützte Browser und gibt Hinweise.
    XRExtras.Loading.pipelineModule(), // Verwaltet den Ladebildschirm beim Starten.
    XRExtras.RuntimeError.pipelineModule(), // Zeigt ein Fehlerbild bei Laufzeitfehlern.
  ])})
}
```
