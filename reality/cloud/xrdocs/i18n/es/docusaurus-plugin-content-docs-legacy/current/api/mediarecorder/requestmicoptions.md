---
sidebar_label: RequestMicOptions
---

# XR8.MediaRecorder.RequestMicOptions

Enumeración

## Descripción {#description}

Determina cuándo se solicitan los permisos de audio.

## Propiedades {#properties}

| Propiedad | Valor      | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| --------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| AUTO      | `'auto'`   | Solicitar automáticamente permisos de micrófono en [`onAttach()`](/legacy/api/camerapipelinemodule/onattach).                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| MANUAL    | `'manual'` | Los permisos de micrófono NO se solicitan en [`onAttach()`](/legacy/api/camerapipelinemodule/onattach). Cualquier otro audio añadido a la aplicación se sigue grabando si se añade al AudioContext y se conecta al audioProcessor proporcionado a la función [`configureAudioOutput`](/legacy/api/mediarecorder/configure/#parameters) del usuario pasada a [`XR8.MediaRecorder.configure()`](configure.md). Puede solicitar permisos de micrófono manualmente llamando a [`XR8.MediaRecorder.requestMicrophone()`](requestmicrophone.md). |
