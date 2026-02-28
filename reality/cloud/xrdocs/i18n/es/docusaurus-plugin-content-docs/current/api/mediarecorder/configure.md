---
sidebar_label: configure()
---

# XR8.MediaRecorder.configure()

`XR8.MediaRecorder.configure({ coverImageUrl, enableEndCard, endCardCallToAction, footerImageUrl, foregroundCanvas, maxDurationMs, maxDimension, shortLink, configureAudioOutput, audioContext, requestMic })`

## Descripción {#description}

Configura varios parámetros de MediaRecorder.

## Parámetros {#parameters}

| Parámetro                       | Tipo     | Por defecto                                                            | Descripción                                                                                                                                                                                                                                                                                                            |
| ------------------------------- | -------- | ---------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| coverImageUrl [Opcional]        | `Cadena` | Imagen de portada configurada en el proyecto, `null` en caso contrario | Fuente de la imagen de portada.                                                                                                                                                                                                                                                                                        |
| enableEndCard [Opcional]        | `Cadena` | `false`                                                                | Si es verdadero, activa la tarjeta final.                                                                                                                                                                                                                                                                              |
| endCardCallToAction [Opcional]  | `Cadena` | `'Pruébalo en: '`                                                      | Establece la cadena de texto para la llamada a la acción.                                                                                                                                                                                                                                                              |
| fileNamePrefix [Opcional]       | `Cadena` | `'my-capture-'`                                                        | Establece la cadena de texto que antepone la marca de tiempo única al nombre del archivo.                                                                                                                                                                                                                              |
| footerImageUrl [Opcional]       | `Cadena` | `null`                                                                 | Fuente de imagen para la imagen de portada.                                                                                                                                                                                                                                                                            |
| foregroundCanvas [Opcional]     | `Cadena` | `null`                                                                 | El lienzo que se utilizará como primer plano en el vídeo grabado.                                                                                                                                                                                                                                                      |
| maxDurationMs [Opcional]        | `Number` | `15000`                                                                | Duración máxima del vídeo, en milisegundos.                                                                                                                                                                                                                                                                            |
| maxDimension [Opcional]         | `Number` | `1280`                                                                 | Dimensión máxima de la grabación capturada, en píxeles.                                                                                                                                                                                                                                                                |
| shortLink [Opcional]            | `Cadena` | enlace directo a 8th.io desde el panel de control del proyecto         | Establece la cadena de texto para el enlace corto.                                                                                                                                                                                                                                                                     |
| configureAudioOutput [Opcional] | `Objeto` | `null`                                                                 | Función proporcionada por el usuario que recibirá los nodos de audio `microphoneInput` y `audioProcessor` para un control completo del audio de la grabación. Los nodos conectados al nodo procesador de audio formarán parte del audio de la grabación. Debe devolver el nodo final del gráfico de audio del usuario. |
| audioContext [Opcional]         | `Cadena` | `null`                                                                 | Instancia de `AudioContext` proporcionada por el usuario. Motores como three.js y BABYLON.js tienen su propia instancia interna de audio. Para que las grabaciones contengan sonidos definidos en esos motores, deberás proporcionar su instancia `AudioContext`.                                                      |
| requestMic [Opcional]           | `Cadena` | `'auto'`                                                               | Determina cuándo se solicitan los permisos de audio. Las opciones se proporcionan en [`XR8.MediaRecorder.RequestMicOptions`](requestmicoptions.md).                                                                                                                                                                    |

La función pasada a `configureAudioOutput` toma un objeto con los siguientes parámetros:

| Parámetro       | Descripción                                                                                                                                                                                                                                                     |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| microphoneInput | Un [`GainNode`](https://developer.mozilla.org/en-US/docs/Web/API/GainNode) que contiene la entrada de micro del usuario. Si no se aceptan los permisos del usuario, este nodo no emitirá la entrada del micrófono, pero seguirá estando presente.               |
| audioProcessor  | un [`ScriptProcessorNode`](https://developer.mozilla.org/en-US/docs/Web/API/ScriptProcessorNode) que pasa datos de audio a la grabadora. Si quieres que un nodo de audio forme parte de la salida de audio de la grabación, debes conectarlo al audioProcessor. |

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.MediaRecorder.configure({
  maxDurationMs: 15000,
  enableEndCard: true,
  endCardCallToAction: 'Try it at:',
  shortLink: '8th.io/my-link',
})
```

## Ejemplo - salida de audio configurada por el usuario {#example---user-configured-audio-output}

```javascript
const userConfiguredAudioOutput = ({microphoneInput, audioProcessor}) => {
  const myCustomAudioGraph = ...
  myCustomAudioSource.connect(myCustomAudioGraph)
  microphoneInput.connect(myCustomAudioGraph)

  // Conecta el nodo final del gráfico de audio al hardware.
  myCustomAudioGraph.connect(microphoneInput.context.destination)

 // El gráfico de audio se conectará automáticamente al procesador.
  return myCustomAudioGraph
}
const threejsAudioContext = THREE.AudioContext.getContext()
XR8.MediaRecorder.configure({
  configureAudioOutput: userConfiguredAudioOutput,
  audioContext: threejsAudioContext,
  requestMic: XR8.MediaRecorder.RequestMicOptions.AUTO,
})
```
