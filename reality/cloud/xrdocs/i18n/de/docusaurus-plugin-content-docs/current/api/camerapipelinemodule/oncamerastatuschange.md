# onCameraStatusChange()

`onCameraStatusChange: ({ status, stream, video, config })`

## Beschreibung {#description}

`onCameraStatusChange()` wird aufgerufen, wenn eine Änderung bei der Abfrage der Kamerazulassung eintritt.

Aufgerufen mit dem Status und, falls zutreffend, einem Verweis auf die neu verfügbaren Daten. Der typische Statusfluss sieht folgendermaßen aus:

`abfrage` -> `hasStream` -> `hasVideo`.

## Parameter {#parameters}

| Parameter          | Beschreibung                                                                                                                                                |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| status             | Eine von [ `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ]                                                                                        |
| stream: [Optional] | Der [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream), der mit dem Kamerafeed verbunden ist, wenn der Status `'hasStream'` ist. |
| video: [Optional]  | Das Video-DOM-Element, das den Stream anzeigt, wenn der Status hasVideo ist.                                                                                |
| config             | Die Konfigurationsparameter, die an [`XR8.run()`](/api/xr8/run) übergeben wurden, wenn der Status `'anfordernd'` ist.                                       |

Der Parameter `status` hat die folgenden Zustände:

| Zustand     | Beschreibung                                                                                                                                                                                                                          |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| beantragen  | Unter `'beantragen'` öffnet der Browser die Kamera und prüft ggf. die Benutzerberechtigungen. In diesem Zustand ist es sinnvoll, den Benutzer aufzufordern, die Kamerazulassung zu akzeptieren.                                       |
| hasStream   | Sobald die Benutzerberechtigungen erteilt sind und die Kamera erfolgreich geöffnet wurde, wechselt der Status zu `'hasStream'` und alle Benutzerabfragen bezüglich der Berechtigungen können verworfen werden.                        |
| hasVideo    | Sobald die Kamerabilddaten für die Verarbeitung zur Verfügung stehen, wechselt der Status zu `'hasVideo'`, und die Kamerafeed kann beginnen.                                                                                          |
| gescheitert | Wenn sich der Kamerafeed nicht öffnen lässt, lautet der Status `'failed'`. In diesem Fall ist es möglich, dass der Benutzer Berechtigungen verweigert hat, und es ist ratsam, ihm zu helfen, die Berechtigungen wieder zu aktivieren. |

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
