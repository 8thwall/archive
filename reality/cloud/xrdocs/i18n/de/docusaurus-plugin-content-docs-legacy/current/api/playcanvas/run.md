---
sidebar_label: run()
---

# XR8.PlayCanvas.run()

XR8.PlayCanvas.run( {pcCamera, pcApp}, [extraModules], config )\\`

## Beschreibung {#description}

Fügt die angegebenen Pipeline-Module hinzu und öffnet dann die Kamera.

## Parameter {#parameters}

| Parameter                                                                   | Typ                                                                                                       | Beschreibung                                                                                                                                                                                     |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| pcKamera                                                                    | [pc.CameraComponent\\`](https://developer.playcanvas.com/en/api/pc.CameraComponent.html) | Die PlayCanvas-Szenenkamera zum Fahren mit AR.                                                                                                                                   |
| pcApp                                                                       | [pc.Application\\`](https://developer.playcanvas.com/en/api/pc.Application.html)         | Die PlayCanvas-Anwendung, in der Regel `this.app`.                                                                                                                               |
| extraModules [Optional] | `[Objekt]`                                                                                                | Eine optionale Reihe von zusätzlichen zu installierenden Pipeline-Modulen.                                                                                                       |
| Konfiguration                                                               | `{canvas, webgl2, ownRunLoop, cameraConfig, glContextConfig, allowedDevices, layers}`                     | Konfigurationsparameter, die an [`XR8.run()`](/legacy/api/xr8/run) zu übergeben sind, sowie PlayCanvas-spezifische Konfiguration, z.B. "Layers". |

config" ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum                                                                                                 | Typ                                                                                     | Standard                                                                                        | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| -------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Leinwand                                                                                                 | [HTMLCanvasElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) |                                                                                                 | Die HTML-Leinwand, auf die der Kamerafeed gezeichnet wird. Normalerweise ist dies `document.getElementById('application-canvas')`.                                                                                                                                                                                                                                                                              |
| webgl2 [Optional]                                    | `Boolean`                                                                               | false                                                                                           | Bei "true" wird WebGL2 verwendet, falls verfügbar, andernfalls wird auf WebGL1 zurückgegriffen.  Wenn false, wird immer WebGL1 verwendet.                                                                                                                                                                                                                                                                       |
| ownRunLoop [Optional]                                | `Boolean`                                                                               | false                                                                                           | Wenn dies der Fall ist, sollte XR seine eigene Laufschleife verwenden.  Wenn false, stellen Sie Ihre eigene Ausführungsschleife bereit und sind selbst für den Aufruf von [`XR8.runPreRender()`](/legacy/api/xr8/runprerender) und [`XR8.runPostRender()`](/legacy/api/xr8/runpostrender) verantwortlich [Nur für fortgeschrittene Benutzer]                                |
| cameraConfig: {direction} [Optional] | Objekt                                                                                  | `{Richtung: XR8.XrConfig.camera().BACK}`                                                        | Gewünschte Kamera zu verwenden. Unterstützte Werte für `Richtung` sind `XR8.XrConfig.camera().BACK` oder `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                                                          |
| glContextConfig [Kann]                               | WebGLContextAttribute                                                                   | `Null`                                                                                          | Die Attribute zur Konfiguration des WebGL-Canvas-Kontextes.                                                                                                                                                                                                                                                                                                                                                                     |
| allowedDevices [Optional]                            | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)                                  | XR8.XrConfig.device().MOBILE | Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll.  Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, wird immer die Kamera geöffnet. Beachten Sie, dass die Weltverfolgung nur mit `XR8.XrConfig.device().MOBILE` verwendet werden kann. |
| Schichten [Optional]                                 | `[]`                                                                                    | `[]`                                                                                            | Geben Sie die Liste der Ebenen an, die mit dem `GlTextureRenderer` gezeichnet werden sollen. Der Schlüssel ist der Name der Ebene in 8th Wall, und der Wert ist eine Liste von PlayCanvas-Ebenennamen, die wir in eine Textur und Maske unter Verwendung der Ebene 8th Wall rendern sollen. Beispielwert: `{"Himmel": ["FirstSkyLayer", "SecondSkyLayer"]}`.                    |

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
var layerscontroller = pc.createScript('layerscontroller')

layerscontroller.prototype.initialize = function() {
  // Nachdem XR vollständig geladen ist, öffnen Sie den Kamera-Feed und beginnen Sie mit der Anzeige von AR.
  const runOnLoad = ({pcCamera, pcApp}, extramodules) => () => {
    // Übergeben Sie den Namen Ihrer Leinwand. Normalerweise ist dies 'application-canvas'.
    const config = {
      canvas: document.getElementById('application-canvas'),
      layers: {"sky": ["Sky"]}
    }
    XR8.PlayCanvas.run({pcCamera, pcApp}, extraModules, config)
  }

  // Finde die Kamera in der PlayCanvas-Szene und binde sie an die Bewegung des Telefons des Benutzers in der
  // Welt.
  const pcCamera = XRExtras.PlayCanvas.findOneCamera(this.entity)

  // Während XR noch lädt, zeige einige hilfreiche Dinge.
  // Fast fertig: Erkennt, ob die Umgebung des Benutzers web ar unterstützen kann, und wenn nicht,
  // zeigt Hinweise zur Anzeige des Erlebnisses an.
  // Laden: Zeigt Aufforderungen zur Erteilung von Kamerazulassungen an und blendet die Szene aus, bis sie zur Anzeige bereit ist.
  // Laufzeitfehler: Wenn etwas Unerwartetes schief geht, wird ein Fehlerbildschirm angezeigt.
  XRExtras.Loading.showLoading({onxrloaded: runOnLoad({pcCamera, pcApp: this.app}, [
    // Optionale Module, die Entwickler möglicherweise anpassen oder thematisieren möchten.
    XRExtras.AlmostThere.pipelineModule(), // Erkennt nicht unterstützte Browser und gibt Hinweise.
    XRExtras.Loading.pipelineModule(), // Verwaltet den Ladebildschirm beim Starten.
    XRExtras.RuntimeError.pipelineModule(), // Zeigt bei Laufzeitfehlern ein Fehlerbild an.
    XR8.LayersController.pipelineModule(), // Fügt Unterstützung für Sky-Effekte hinzu.
  ])})
}
```
