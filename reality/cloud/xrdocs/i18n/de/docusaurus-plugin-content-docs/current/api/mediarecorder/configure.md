---
sidebar_label: configure()
---

# XR8.MediaRecorder.configure()

`XR8.MediaRecorder.configure({ coverImageUrl, enableEndCard, endCardCallToAction, footerImageUrl, foregroundCanvas, maxDurationMs, maxDimension, shortLink, configureAudioOutput, audioContext, requestMic })`

## Beschreibung {#description}

Konfiguriert verschiedene MediaRecorder-Parameter.

## Parameter {#parameters}

| Parameter                       | Typ      | Standard                                          | Beschreibung                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------- | -------- | ------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| coverImageUrl [Optional]        | `String` | Im Projekt konfiguriertes Titelbild, `null` sonst | Bildquelle für das Titelbild.                                                                                                                                                                                                                                                                                                                         |
| enableEndCard [Optional]        | `String` | `false`                                           | Wenn wahr, aktivieren Sie die Endkarte.                                                                                                                                                                                                                                                                                                               |
| endCardCallToAction [Optional]  | `String` | `'Versuchen Sie es bei: '`                        | Legt den Textstring für den Aufruf zur Aktion fest.                                                                                                                                                                                                                                                                                                   |
| fileNamePrefix [Optional]       | `String` | `'my-capture-'`                                   | Legt den Textstring fest, die dem Dateinamen den eindeutigen Zeitstempel voranstellt.                                                                                                                                                                                                                                                                 |
| footerImageUrl [Optional]       | `String` | `null`                                            | Bild src für Titelbild.                                                                                                                                                                                                                                                                                                                               |
| foregroundCanvas [Optional]     | `String` | `null`                                            | Die Leinwand, die im aufgenommenen Video als Vordergrund verwendet werden soll.                                                                                                                                                                                                                                                                       |
| maxDurationMs [Optional]        | `Nummer` | `15000`                                           | Maximale Dauer des Videos, in Millisekunden.                                                                                                                                                                                                                                                                                                          |
| maxDimension [Optional]         | `Nummer` | `1280`                                            | Maximale Größe der aufgenommenen Aufnahme in Pixeln.                                                                                                                                                                                                                                                                                                  |
| shortLink [Optional]            | `String` | 8th.io Shortlink vom Projekt-Dashboard            | Legt den Textstring für den Shortlink fest.                                                                                                                                                                                                                                                                                                           |
| configureAudioOutput [Optional] | `Objekt` | `null`                                            | Vom Benutzer bereitgestellte Funktion, die die Audioknoten `microphoneInput` und `audioProcessor` empfängt, um die vollständige Kontrolle über den Ton der Aufnahme zu erhalten. Die an den Audioprozessor-Knoten angeschlossenen Knoten werden Teil des Tons der Aufnahme sein. Sie müssen den Endknoten des Audiographen des Benutzers zurückgeben. |
| audioContext [Optional]         | `String` | `null`                                            | Vom Benutzer bereitgestellte `AudioContext` Instanz. Engines wie three.js und BABYLON.js haben ihre eigene interne Audio-Instanz. Damit die Aufnahmen Sounds enthalten, die in diesen Engines definiert wurden, müssen Sie deren `AudioContext` Instanz bereitstellen.                                                                                |
| requestMic [Optional]           | `String` | `'auto'`                                          | Legt fest, wann die Audiorechte angefordert werden. Die Optionen werden in [`XR8.MediaRecorder.RequestMicOptions`](requestmicoptions.md) bereitgestellt.                                                                                                                                                                                              |

Die Funktion, die an `configureAudioOutput` übergeben wird, nimmt ein Objekt mit den folgenden Parametern an:

| Parameter       | Beschreibung                                                                                                                                                                                                                                                                 |
| --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| microphoneInput | Ein [`GainNode`](https://developer.mozilla.org/en-US/docs/Web/API/GainNode) der den Mikrofoneingang des Benutzers enthält. Wenn die Berechtigungen des Benutzers nicht akzeptiert werden, gibt dieser Knoten den Mikrofoneingang nicht aus, ist aber dennoch vorhanden.      |
| audioProzessor  | ein [`ScriptProcessorNode`](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode) der Audiodaten an den Rekorder weitergibt. Wenn Sie möchten, dass ein Audioknoten Teil der Audioausgabe der Aufnahme ist, müssen Sie ihn mit dem audioProcessor verbinden. |

## Returns {#returns}

Keine

## Beispiel {#example}

```javascript
XR8.MediaRecorder.configure({
  maxDurationMs: 15000,
  enableEndCard: true,
  endCardCallToAction: 'Versuchen Sie es bei:',
  shortLink: '8th.io/my-link',
})
```

## Beispiel - benutzerdefinierte Audioausgabe {#example---user-configured-audio-output}

```javascript
const userConfiguredAudioOutput = ({microphoneInput, audioProcessor}) => {
  const myCustomAudioGraph = ...
  myCustomAudioSource.connect(myCustomAudioGraph)
  microphoneInput.connect(myCustomAudioGraph)

  // Verbinden Sie den Endknoten des Audiographen mit der Hardware.
  myCustomAudioGraph.connect(microphoneInput.context.destination)

  // Der Audiograph wird automatisch mit dem Prozessor verbunden.
  return myCustomAudioGraph
}
const threejsAudioContext = THREE.AudioContext.getContext()
XR8.MediaRecorder.configure({
  configureAudioOutput: userConfiguredAudioOutput,
  audioContext: threejsAudioContext,
  requestMic: XR8.MediaRecorder.RequestMicOptions.AUTO,
})
```
