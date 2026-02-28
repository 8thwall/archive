# onCameraStatusChange()

`onCameraStatusChange: ({ status, stream, video, config })`

## Descripción {#description}

Se llama a `onCameraStatusChange()` cuando se produce un cambio durante la solicitud de permisos de la cámara.

Llamada con el estado y, si procede, una referencia a los nuevos datos disponibles. El flujo de estado típico será:

`requesting` -> `hasStream` -> `hasVideo`.

## Parámetros {#parameters}

| Parámetro                                                                              | Descripción                                                                                                                                                                |
| -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| estado                                                                                 | Uno de [ `'requesting'`, `'hasStream'`, `'hasVideo'`, `'failed'` ]                                                     |
| stream: [Opcional] | El [`MediaStream`](https://developer.mozilla.org/en-US/docs/Web/API/MediaStream) asociado con la alimentación de la cámara, si el estado es `'hasStream'`. |
| video: [Opcional]  | El elemento DOM de vídeo que muestra el flujo, si el estado es hasVideo.                                                                                   |
| config                                                                                 | Los parámetros de configuración que se pasaron a [`XR8.run()`](/api/engine/xr8), si el estado es `'solicitando'`.                                          |

El parámetro `status` tiene los siguientes estados:

| Estado      | Descripción                                                                                                                                                                                                                                     |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| solicitando | En "solicitando", el navegador está abriendo la cámara y, si procede, comprobando los permisos del usuario. En este estado, es apropiado mostrar un aviso al usuario para que acepte los permisos de la cámara. |
| hasStream   | Una vez que se han concedido los permisos de usuario y la cámara se ha abierto con éxito, el estado cambia a `'hasStream'` y se puede descartar cualquier pregunta de usuario relativa a los permisos.                          |
| hasVideo    | Una vez que los datos de los fotogramas de la cámara comienzan a estar disponibles para su procesamiento, el estado cambia a "hasVideo", y la alimentación de la cámara puede comenzar a mostrarse.                             |
| fallido     | Si la alimentación de la cámara no se abre, el estado es `'failed'`. En este caso es posible que el usuario haya denegado permisos, por lo que es aconsejable ayudarle a volver a habilitarlos.                 |

## Ejemplo {#example}

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
