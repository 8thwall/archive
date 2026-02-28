---
sidebar_label: RequestMicOptions
---

# XR8.MediaRecorder.RequestMicOptions

Enumeración

## Descripción {#description}

Determina cuándo se solicitan los permisos de audio.

## Propiedades {#properties}

| Propiedad | Valor      | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTO      | `'auto'`   | Solicita automáticamente los permisos del micrófono en [`onAttach()`](/api/camerapipelinemodule/onattach).                                                                                                                                                                                                                                                                                                                                                                                                                   |
| MANUAL    | `'manual'` | Los permisos del micrófono NO se solicitan en [`onAttach()`](/api/camerapipelinemodule/onattach). Cualquier otro audio añadido a la aplicación se sigue grabando si se añade a AudioContext y se conecta a audioProcessor proporcionado a la función [`configureAudioOutput`](/api/mediarecorder/configure/#parameters) del usuario pasada a [`XR8.MediaRecorder.configure()`](configure.md). Puedes solicitar permisos de micrófono manualmente llamando a [`XR8.MediaRecorder.requestMicrophone()`](requestmicrophone.md). |
