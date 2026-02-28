---
sidebar_label: RequestMicOptions
---

# XR8.MediaRecorder.RequestMicOptions

Enumération

## Description {#description}

Détermine le moment où les autorisations audio sont demandées.

## Propriétés {#properties}

| Propriété | Valeur   | Description                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| --------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| AUTO      | `auto`   | Demandez automatiquement les autorisations pour le microphone dans [`onAttach()`](/api/camerapipelinemodule/onattach).                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| MANUEL    | `manuel` | Les autorisations pour le microphone ne sont PAS demandées dans [`onAttach()`](/api/camerapipelinemodule/onattach). Tout autre son ajouté à l'application est toujours enregistré s'il est ajouté à l'AudioContext et connecté à l'audioProcessor fourni à la fonction [`configureAudioOutput`](/api/mediarecorder/configure/#parameters) de l'utilisateur transmise à [`XR8.MediaRecorder.configure()`](configure.md). Vous pouvez demander les autorisations de microphone manuellement en appelant [`XR8.MediaRecorder.requestMicrophone()`](requestmicrophone.md). |
