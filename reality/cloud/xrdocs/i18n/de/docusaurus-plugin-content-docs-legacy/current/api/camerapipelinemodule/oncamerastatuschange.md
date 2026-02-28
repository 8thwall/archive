# onCameraStatusChange()

`onCameraStatusChange: ({ status, stream, video, config })`

## Beschreibung {#description}

Die Funktion "onCameraStatusChange()" wird aufgerufen, wenn bei der Abfrage der Kamerazulassungen eine Änderung eintritt.

Aufgerufen mit dem Status und ggf. einem Verweis auf die neu verfügbaren Daten. Der typische Statusfluss ist folgender:

Anfordern" -> "hasStream" -> "hasVideo".

## Parameter {#parameters}

| Parameter                                                                               | Beschreibung                                                                                                                                                                |
| --------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Status                                                                                  | Eine von [ `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ]                                                    |
| stream: [Optional]  | Der [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream), der mit dem Kamerafeed verbunden ist, wenn der Status `'hasStream'` ist. |
| Video: [Fakultativ] | Das Video-DOM-Element, das den Stream anzeigt, wenn der Status hasVideo lautet.                                                                             |
| Konfiguration                                                                           | Die Konfigurationsparameter, die an [`XR8.run()`](/legacy/api/xr8/run) übergeben wurden, wenn der Status `'requesting'` ist.                                |

Der Parameter "Status" hat die folgenden Zustände:

| Staat                      | Beschreibung                                                                                                                                                                                                                                                                                  |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| anfordern. | Beim "Anfordern" öffnet der Browser die Kamera und prüft ggf. die Benutzerberechtigungen. In diesem Zustand ist es angebracht, den Benutzer aufzufordern, die Kamerarechte zu akzeptieren.                                                    |
| hasStream                  | Sobald die Benutzerrechte erteilt sind und die Kamera erfolgreich geöffnet wurde, wechselt der Status auf "hasStream" und alle Benutzerabfragen bezüglich der Berechtigungen können verworfen werden.                                                                         |
| hasVideo                   | Sobald die Kamerabilddaten für die Verarbeitung zur Verfügung stehen, wechselt der Status zu "hasVideo", und die Kameraübertragung kann beginnen.                                                                                                                             |
| gescheitert                | Wenn die Kameraübertragung nicht geöffnet werden kann, lautet der Status "fehlgeschlagen". In diesem Fall ist es möglich, dass der Benutzer die Berechtigungen verweigert hat, so dass es ratsam ist, ihm zu helfen, die Berechtigungen wieder zu aktivieren. |

## Beispiel {#example}

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
