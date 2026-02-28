---
sidebar_label: recordVideo()
---

# XR8.MediaRecorder.recordVideo()

`XR8.MediaRecorder.recordVideo({ onError, onProcessFrame, onStart, onStop, onVideoReady })`

## Beschreibung {#description}

Aufnahme starten.

Diese Funktion nimmt ein Objekt an, das eine oder mehrere der folgenden Medienrekorder-Lizenzzyklus-Callback-Methoden implementiert:

## Parameter {#parameters}

| Parameter          | Beschreibung                                                                                                                                        |
| ------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| onError            | Callback im Falle eines Fehlers.                                                                                                    |
| onProcessFrame     | Callback für das Hinzufügen eines Overlays zum Video.                                                                               |
| onStart            | Rückruf, wenn die Aufnahme begonnen hat.                                                                                            |
| onStop             | Rückruf, wenn die Aufzeichnung beendet ist.                                                                                         |
| onPreviewReady     | Rückruf, wenn ein vorschaubares, aber nicht für die Freigabe optimiertes Video fertig ist (nur Android/Desktop). |
| onFinalizeProgress | Callback, wenn der Medienrekorder Fortschritte beim endgültigen Export macht (nur Android/Desktop).              |
| onVideoReady       | Rückruf, wenn die Aufnahme abgeschlossen und das Video bereit ist.                                                                  |

**Hinweis:** Wenn der Browser über native MediaRecorder-Unterstützung für webm und nicht mp4 verfügt (derzeit Android/Desktop), kann das webm-Video als Vorschauvideo verwendet werden, wird aber in mp4 konvertiert, um das endgültige Video zu erzeugen. `onPreviewReady` wird aufgerufen, wenn die Konvertierung beginnt, damit der Benutzer das Video sofort sehen kann, und wenn die mp4-Datei fertig ist, wird `onVideoReady` aufgerufen. Während der Konvertierung wird in regelmäßigen Abständen `onFinalizeProgress` aufgerufen, damit ein Fortschrittsbalken angezeigt werden kann.

## Rückgabe {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.MediaRecorder.recordVideo({
  onVideoReady: (result) => window.dispatchEvent(new CustomEvent('recordercomplete', {detail: result})),
  onStop: () => showLoading(),
  onError: () => clearState(),
  onProcessFrame: ({elapsedTimeMs, maxRecordingMs, ctx}) => {
    // überlagert roten Text über das Video
    ctx.fillStyle = 'red'
    ctx.font = '50px "Nunito"'
    ctx.fillText(`${elapsedTimeMs}/${maxRecordingMs}`, 50, 50)
    const timeLeft = ( 1 - elapsedTimeMs / maxRecordingMs)
    // Fortschrittsbalken aktualisieren, um anzuzeigen, wie viel Zeit noch bleibt
    progressBar.style.strokeDashoffset = `${100 * timeLeft }`
  },
  onFinalizeProgress: ({progress, total}) => {
    console.log('Export ist ' + Math.round(progress / total) + '% fertig')
  },
})
```
