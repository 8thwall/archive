---
sidebar_label: run()
---

# XR8.PlayCanvas.run()

`XR8.PlayCanvas.run( {pcCamera, pcApp}, [extraModules], config )`

## Beschreibung {#description}

Fügt die angegebenen Pipeline-Module hinzu und öffnet dann die Kamera.

## Parameter {#parameters}

| Parameter               | Typ                                                                                     | Beschreibung                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| pcKamera                | [`pc.CameraComponent`](https://developer.playcanvas.com/en/api/pc.CameraComponent.html) | Die PlayCanvas Szenenkamera zur Benutzung mit AR.                                                                                        |
| pcApp                   | [`pc.Anwendung`](https://developer.playcanvas.com/en/api/pc.Application.html)           | Die PlayCanvas-App, typischerweise `this.app`.                                                                                           |
| extraModules [Optional] | `[Objekt]`                                                                              | Eine optionale Reihe von zusätzlichen Pipeline-Modulen, die Sie installieren können.                                                     |
| config                  | `{canvas, webgl2, ownRunLoop, cameraConfig, glContextConfig, allowedDevices, layers}`   | Konfigurationsparameter, die an [`XR8.run()`](/api/xr8/run) übergeben werden, sowie PlayCanvas-spezifische Konfiguration, z.B. `layers`. |

`config` ist ein Objekt mit den folgenden Eigenschaften:

| Eigentum                             | Typ                                                                                       | Standard                                  | Beschreibung                                                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------ | ----------------------------------------------------------------------------------------- | ----------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| canvas                               | [`HTMLCanvasElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) |                                           | Die HTML-Leinwand, in die der Kamera-Feed gezeichnet wird. Normalerweise ist dies `document.getElementById('application-canvas')`.                                                                                                                                                                                                                                           |
| webgl2 [Optional]                    | `Boolesche`                                                                               | `false`                                   | Bei Wahr verwenden Sie WebGL2, falls verfügbar, andernfalls wird auf WebGL1 zurückgegriffen.  Wenn Falsch, verwenden Sie immer WebGL1.                                                                                                                                                                                                                                       |
| ownRunLoop [Optional]                | `Boolesche`                                                                               | `false`                                   | Wenn Wahr, sollte XR seine eigene Laufschleife verwenden.  Wenn Falsch, stellen Sie Ihre eigene Laufschleife bereit und sind selbst für den Aufruf von [`XR8.runPreRender()`](/api/xr8/runprerender) und [`XR8.runPostRender()`](/api/xr8/runpostrender) verantwortlich [Nur für fortgeschrittene Benutzer]                                                                  |
| cameraConfig: {direction} [Optional] | `Objekt`                                                                                  | `{direction: XR8.XrConfig.camera().BACK}` | Zu verwendende Kamera. Unterstützte Werte für `Richtung` sind `XR8.XrConfig.camera().BACK` oder `XR8.XrConfig.camera().FRONT`                                                                                                                                                                                                                                                |
| glContextConfig [Optional]           | `WebGLContextAttribute`                                                                   | `null`                                    | Die Attribute zur Konfiguration des WebGL-Canvas-Kontextes.                                                                                                                                                                                                                                                                                                                  |
| allowedDevices [Optional]            | [`XR8.XrConfig.device()`](/api/xrconfig/device)                                           | `XR8.XrConfig.device().MOBILE`            | Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll.  Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, öffnen Sie immer die Kamera. Beachten Sie, dass die Weltverfolgung nur mit `XR8.XrConfig.device().MOBILE` verwendet werden kann. |
| ebenen [Optional]                    | `[]`                                                                                      | `[]`                                      | Geben Sie die Liste der zu zeichnenden Ebenen mit `GlTextureRenderer` an. Der Schlüssel ist der Name der Ebene in 8th Wall und der Wert ist eine Liste von PlayCanvas-Ebenennamen, die wir mit Hilfe der Ebene 8th Wall in eine Textur und Maske rendern sollen. Beispielwert: `{"sky": ["FirstSkyLayer", "SecondSkyLayer"]}`.                                               |

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
var layerscontroller = pc.createScript('layerscontroller')

layerscontroller.prototype.initialize = function() {
  // Nachdem XR vollständig geladen ist, öffnen Sie den Kamera-Feed und beginnen mit der Anzeige von AR.
  const runOnLoad = ({pcCamera, pcApp}, extramodules) => () => {
    // Geben Sie den Namen Ihrer Leinwand ein. In der Regel ist dies 'application-canvas'.
    const config = {
      canvas: document.getElementById('application-canvas'),
      layers: {"sky": ["Sky"]}
    }
    XR8.PlayCanvas.run({pcCamera, pcApp}, extraModules, config)
  }

  // Suchen Sie die Kamera in der PlayCanvas-Szene und binden Sie sie an die Bewegung des Telefons des Benutzers in der
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
    XR8.LayersController.pipelineModule(), // Fügt Unterstützung für Himmelseffekte hinzu.
  ])})
}
```
