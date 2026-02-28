---
sidebar_label: addCameraPipelineModule()
---

# XR8.addCameraPipelineModule()

`XR8.addCameraPipelineModule(modul)`

## Beschreibung {#description}

8th Wall Kameraanwendungen werden mit Hilfe eines Kamera-Pipeline-Modul-Frameworks erstellt. Eine vollständige Beschreibung der Kamera-Pipeline-Module finden Sie unter [CameraPipelineModule](/api/camerapipelinemodule).

Anwendungen installieren Module, die dann das Verhalten der Anwendung zur Laufzeit steuern. Ein Modulobjekt muss einen **.name** String haben, die innerhalb der Anwendung eindeutig ist, und sollte dann eine oder mehrere der Lebenszyklusmethoden der Kamera bereitstellen, die an der entsprechenden Stelle in der Laufschleife ausgeführt werden.

Während der Hauptlaufzeit einer Anwendung durchläuft jedes Kamerabild den folgenden Zyklus:

`onBeforeRun` -> `onCameraStatusChange` (`requesting` -> `hasStream` -> `hasVideo` | `failed`) -> `onStart` -> `onAttach` -> `onProcessGpu` -> `onProcessCpu` -> `onUpdate` -> `onRender`

Kameramodule sollten eine oder mehrere der folgenden Methoden für den Lebenszyklus einer Kamera implementieren:

| Funktion                                                                         | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                      |
| -------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [onAppResourcesLoaded](/api/camerapipelinemodule/onappresourcesloaded)           | Wird aufgerufen, wenn wir die mit einer App verbundenen Ressourcen vom Server erhalten haben.                                                                                                                                                                                                                                                                                                                     |
| [onAttach](/api/camerapipelinemodule/onattach)                                   | Wird aufgerufen, bevor ein Modul zum ersten Mal Rahmenaktualisierungen empfängt. Sie wird für Module aufgerufen, die entweder vor oder nach der Ausführung der Pipeline hinzugefügt wurden.                                                                                                                                                                                                                       |
| [onBeforeRun](/api/camerapipelinemodule/onbeforerun)                             | Wird unmittelbar nach [`XR8.run()`](run.md) aufgerufen. Wenn irgendwelche Versprechen zurückgegeben werden, wartet XR auf alle Versprechen, bevor es weitergeht.                                                                                                                                                                                                                                                  |
| [onCameraStatusChange](/api/camerapipelinemodule/oncamerastatuschange)           | Wird aufgerufen, wenn eine Änderung bei der Abfrage der Kamerarechte auftritt.                                                                                                                                                                                                                                                                                                                                    |
| [onCanvasSizeChange](/api/camerapipelinemodule/oncanvassizechange)               | Wird aufgerufen, wenn sich die Größe der Leinwand ändert.                                                                                                                                                                                                                                                                                                                                                         |
| [onDetach](/api/camerapipelinemodule/ondetach)                                   | wird aufgerufen, nachdem ein Modul zum letzten Mal Rahmenaktualisierungen erhalten hat. Dies geschieht entweder, nachdem der Motor abgestellt oder das Modul manuell aus der Pipeline entfernt wurde, je nachdem, was zuerst eintritt.                                                                                                                                                                            |
| [onDeviceOrientationChange](/api/camerapipelinemodule/ondeviceorientationchange) | Wird aufgerufen, wenn das Gerät die Ausrichtung Querformat/Hochformat ändert.                                                                                                                                                                                                                                                                                                                                     |
| [onException](/api/camerapipelinemodule/onexception)                             | Wird aufgerufen, wenn ein Fehler in XR auftritt. Wird mit dem Fehlerobjekt aufgerufen.                                                                                                                                                                                                                                                                                                                            |
| [onPaused](/api/camerapipelinemodule/onpaused)                                   | Wird aufgerufen, wenn [`XR8.pause()`](pause.md) aufgerufen wird.                                                                                                                                                                                                                                                                                                                                                  |
| [onProcessCpu](/api/camerapipelinemodule/onprocesscpu)                           | Wird aufgerufen, um die Ergebnisse der GPU-Verarbeitung zu lesen und verwertbare Daten zurückzugeben.                                                                                                                                                                                                                                                                                                             |
| [onProcessGpu](/api/camerapipelinemodule/onprocessgpu)                           | Wird aufgerufen, um die GPU-Verarbeitung zu starten.                                                                                                                                                                                                                                                                                                                                                              |
| [onRemove](/api/camerapipelinemodule/onremove)                                   | wird aufgerufen, wenn ein Modul aus der Pipeline entfernt wird.                                                                                                                                                                                                                                                                                                                                                   |
| [onRender](/api/camerapipelinemodule/onrender)                                   | Wird nach onUpdate aufgerufen. Dies ist der Zeitpunkt, an dem die Rendering-Engine alle WebGL-Zeichenbefehle ausgibt. Wenn eine Anwendung ihre eigene Laufschleife bereitstellt und sich auf [`XR8.runPreRender()`](runprerender.md) und [`XR8.runPostRender()`](runpostrender.md) verlässt, wird diese Methode nicht aufgerufen und das gesamte Rendering muss von der externen Laufschleife koordiniert werden. |
| [onResume](/api/camerapipelinemodule/onresume)                                   | Wird aufgerufen, wenn [`XR8.resume()`](resume.md) aufgerufen wird.                                                                                                                                                                                                                                                                                                                                                |
| [onStart](/api/camerapipelinemodule/onstart)                                     | Wird aufgerufen, wenn XR startet. Erster Callback nach [`XR8.run()`](run.md) wird aufgerufen.                                                                                                                                                                                                                                                                                                                     |
| [onUpdate](/api/camerapipelinemodule/onupdate)                                   | Wird aufgerufen, um die Szene vor dem Rendern zu aktualisieren. Die von den Modulen in [`onProcessGpu`](/api/camerapipelinemodule/onprocessgpu) und [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu) zurückgegebenen Daten werden als processGpu.modulename und processCpu.modulename vorliegen, wobei der Name durch module.name = "modulename" angegeben wird.                                          |
| [onVideoSizeChange](/api/camerapipelinemodule/onvideosizechange)                 | Wird aufgerufen, wenn sich die Größe der Leinwand ändert.                                                                                                                                                                                                                                                                                                                                                         |
| [requiredPermissions](/api/camerapipelinemodule/requiredpermissions)             | Module können angeben, welche Browserfunktionen sie benötigen, für die möglicherweise Berechtigungsanfragen erforderlich sind. Diese können vom Framework verwendet werden, um die entsprechenden Berechtigungen anzufordern, wenn sie nicht vorhanden sind, oder um Komponenten zu erstellen, die die entsprechenden Berechtigungen anfordern, bevor XR ausgeführt wird.                                         |

Hinweis: Kameramodule, die [`onProcessGpu`](/api/camerapipelinemodule/onprocessgpu) oder [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu) implementieren, können Daten an nachfolgende Stufen der Pipeline liefern. Dies geschieht über den Namen des Moduls.

## Parameter {#parameters}

| Parameter | Typ      | Beschreibung     |
| --------- | -------- | ---------------- |
| module    | `Objekt` | Das Modulobjekt. |

## Returns {#returns}

Keine

## Beispiel 1 - Ein Kamera-Pipeline-Modul zur Verwaltung von Kamerazulassungen: {#example-1---a-camera-pipeline-module-for-managing-camera-permissions}

```javascript
XR8.addCameraPipelineModule({
  name: 'camerastartupmodule',
  onCameraStatusChange: ({status}) {
    if (status == 'requesting') {
      myApplication.showCameraPermissionsPrompt()
    } else if (status == 'hasStream') {
      myApplication.dismissCameraPermissionsPrompt()
    } else if (status == 'hasVideo') {
      myApplication.startMainApplictation()
    } else if (status == 'failed') {
      myApplication.promptUserToChangeBrowserSettings()
    }
  },
})
```

## Beispiel 2 - eine Anwendung zum Scannen von QR-Codes könnte wie folgt aufgebaut sein {#example-2---a-qr-code-scanning-application-could-be-built-like-this}

```javascript
// Installieren Sie ein Modul, das den Kamerafeed als UInt8Array abruft.
XR8.addCameraPipelineModule(
  XR8.CameraPixelArray.pipelineModule({luminance: true, width: 240, height: 320}))

// Installieren Sie ein Modul, das den Kamerafeed auf die Leinwand zeichnet.
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Erstellen Sie unsere eigene Anwendungslogik zum Scannen und Anzeigen von QR-Codes.
XR8.addCameraPipelineModule({
  name: 'qrscan',
  onProcessCpu: ({processGpuResult}) => {
    // CameraPixelArray.pipelineModule() liefert diese in onProcessGpu.
    const { pixels, rows, cols, rowBytes } = processGpuResult.camerapixelarray
    const { wasFound, url, corners } = findQrCode(pixels, rows, cols, rowBytes)
    return { wasFound, url, corners }
  },
  onUpdate: ({processCpuResult}) => {
    // Diese wurden von diesem Modul ('qrscan') in onProcessCpu zurückgegeben
    const {wasFound, url, corners } = processCpuResult.qrscan
    if (wasFound) {
      showUrlAndCorners(url, corners)
    }
  },
})
```
