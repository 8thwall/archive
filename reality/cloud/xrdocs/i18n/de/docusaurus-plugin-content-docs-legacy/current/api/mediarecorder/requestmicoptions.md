---
sidebar_label: RequestMicOptions
---

# XR8.MediaRecorder.RequestMicOptions

Aufzählung

## Beschreibung {#description}

Legt fest, wann die Audiorechte angefordert werden.

## Eigenschaften {#properties}

| Eigentum | Wert     | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| -------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTO     | `Auto'`  | Automatische Abfrage von Mikrofonberechtigungen in [`onAttach()`](/legacy/api/camerapipelinemodule/onattach).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| MANUELL  | Handbuch | Mikrofonberechtigungen werden NICHT in [`onAttach()`](/legacy/api/camerapipelinemodule/onattach) angefordert. Alle anderen Audiodaten, die der Anwendung hinzugefügt werden, werden weiterhin aufgezeichnet, wenn sie dem AudioContext hinzugefügt und mit dem audioProcessor verbunden werden, der der Funktion [`configureAudioOutput`](/legacy/api/mediarecorder/configure/#parameters) des Benutzers übergeben wird, die an [`XR8.MediaRecorder.configure()`](configure.md) übergeben wird. Sie können Mikrofonberechtigungen manuell anfordern, indem Sie [`XR8.MediaRecorder.requestMicrophone()`](requestmicrophone.md) aufrufen. |
