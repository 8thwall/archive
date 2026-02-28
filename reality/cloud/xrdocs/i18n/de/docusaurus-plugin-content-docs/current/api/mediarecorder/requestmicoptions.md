---
sidebar_label: RequestMicOptions
---

# XR8.MediaRecorder.RequestMicOptions

Aufzählung

## Beschreibung {#description}

Legt fest, wann die Audiorechte angefordert werden.

## Eigenschaften {#properties}

| Eigentum | Wert        | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTO     | `'auto'`    | Fordern Sie automatisch Mikrofonrechte in [`onAttach()`](/api/camerapipelinemodule/onattach) an.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| MANUELL  | `'manuell'` | Mikrofonberechtigungen werden NICHT in [`onAttach()`](/api/camerapipelinemodule/onattach) angefordert. Alle anderen Audiodaten, die der App hinzugefügt werden, werden trotzdem aufgezeichnet, wenn sie dem AudioContext hinzugefügt und mit dem audioProcessor verbunden werden, der der [`configureAudioOutput`](/api/mediarecorder/configure/#parameters) Funktion des Benutzers übergeben wird [`XR8.MediaRecorder.configure()`](configure.md). Sie können Mikrofonberechtigungen manuell anfordern, indem Sie [`XR8.MediaRecorder.requestMicrophone()`](requestmicrophone.md) aufrufen. |
