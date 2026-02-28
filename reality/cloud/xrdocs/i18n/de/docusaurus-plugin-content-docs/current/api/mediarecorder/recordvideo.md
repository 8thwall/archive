---
sidebar_label: recordVideo()
---

# XR8.MediaRecorder.recordVideo()

`XR8.MediaRecorder.recordVideo({ onError, onProcessFrame, onStart, onStop, onVideoReady })`

## Beschreibung {#description}

Starten Sie die Aufnahme.

Diese Funktion nimmt ein Objekt entgegen, das eine oder mehrere der folgenden Medienrekorder-Lizenzzyklus-Callback-Methoden implementiert:

## Parameter {#parameters}

| Parameter          | Beschreibung                                                                                                       |
| ------------------ | ------------------------------------------------------------------------------------------------------------------ |
| onError            | Callback, wenn ein Fehler aufgetreten ist.                                                                         |
| onProcessFrame     | Callback für das Hinzufügen eines Overlays zum Video.                                                              |
| onStart            | Callback, wenn die Aufnahme begonnen hat.                                                                          |
| onStop             | Rückruf, wenn die Aufnahme gestoppt wurde.                                                                         |
| onPreviewReady     | Rückruf, wenn ein vorschaubares, aber nicht für die Weitergabe optimiertes Video fertig ist (nur Android/Desktop). |
| onFinalizeProgress | Callback, wenn der Medienrekorder Fortschritte beim endgültigen Export macht (nur Android/Desktop).                |
| onVideoReady       | Rückruf, wenn die Aufnahme abgeschlossen ist und das Video bereit ist.                                             |

**Hinweis:** Wenn der Browser über eine native MediaRecorder-Unterstützung für webm und nicht mp4 verfügt (derzeit Android/Desktop), ist das webm als Vorschauvideo verwendbar, wird aber in mp4 konvertiert, um das endgültige Video zu erzeugen. `onPreviewReady` wird aufgerufen, wenn die Konvertierung beginnt, damit der Benutzer das Video sofort sehen kann, und wenn die mp4-Datei fertig ist, wird `onVideoReady` aufgerufen. Während der Konvertierung wird `onFinalizeProgress` in regelmäßigen Abständen aufgerufen, damit ein Fortschrittsbalken angezeigt werden kann.

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.MediaRecorder.recordVideo({
  onVideoReady: (result) => window.dispatchEvent(new CustomEvent('recordercomplete', {detail: result})),
  onStop: () => showLoading(),
  onError: () => clearState(),
  onProcessFrame: ({elapsedTimeMs, maxRecordingMs, ctx}) => {
    // roten Text über das Video legen
    ctx.fillStyle = 'red'
    ctx.font = '50px "Nunito"'
    ctx.fillText(`${elapsedTimeMs}/${maxRecordingMs}`, 50, 50)
    const timeLeft = ( 1 - elapsedTimeMs / maxRecordingMs)
    // Aktualisieren Sie den Fortschrittsbalken, um anzuzeigen, wie viel Zeit noch bleibt
    progressBar.style.strokeDashoffset = `${100 * timeLeft }`
  },
  onFinalizeProgress: ({progress, total}) => {
    console.log('Der Export ist ' + Math.round(progress / total) + '% abgeschlossen')
  },
})
```
