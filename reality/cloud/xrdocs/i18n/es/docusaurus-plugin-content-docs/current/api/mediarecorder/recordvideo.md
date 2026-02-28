---
sidebar_label: recordVideo()
---

# XR8.MediaRecorder.recordVideo()

`XR8.MediaRecorder.recordVideo({ onError, onProcessFrame, onStart, onStop, onVideoReady })`

## Descripción {#description}

Inicia la grabación.

Esta función toma un objeto que implementa uno o más de los siguientes métodos de devolución de llamada del ciclo de licencia de la grabadora multimedia:

## Parámetros {#parameters}

| Parámetro          | Descripción                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| onError            | Llamada de retorno cuando se produce un error.                                                                                  |
| onProcessFrame     | Llamada de retorno para añadir una sobreimpresión al vídeo.                                                                     |
| onStart            | Llamada de retorno cuando se ha iniciado la grabación.                                                                          |
| onStop             | Llamada de retorno cuando se detiene la grabación.                                                                              |
| onPreviewReady     | Devolución de llamada cuando un vídeo previsualizable, pero no optimizado para compartir, está listo (sólo Android/Escritorio). |
| onFinalizeProgress | Llamada de retorno cuando la grabadora multimedia está avanzando en la exportación final (sólo Android/Escritorio).             |
| onVideoReady       | Devuelve la llamada cuando se haya completado la grabación y el vídeo esté listo.                                               |

**Nota:** Cuando el navegador tiene soporte nativo MediaRecorder para webm y no para mp4 (actualmente Android/Escritorio), el webm se puede utilizar como vídeo de previsualización, pero se convierte a mp4 para generar el vídeo final. `onPreviewReady` se llama cuando se inicia la conversión, para que el usuario pueda ver el vídeo inmediatamente, y cuando el archivo mp4 esté listo, se llamará a `onVideoReady`.  Durante la conversión, se llama periódicamente a `onFinalizeProgress` para que se muestre una barra de progreso.

## Devuelve {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.MediaRecorder.recordVideo({
  onVideoReady: (result) => window.dispatchEvent(new CustomEvent('recordercomplete', {detail: result})),
  onStop: () => showLoading(),
  onError: () => clearState(),
  onProcessFrame: ({elapsedTimeMs, maxRecordingMs, ctx}) => {
    // superpón un texto rojo sobre el vídeo
    ctx.fillStyle = 'red'
    ctx.font = '50px "Nunito"'
    ctx.fillText(`${elapsedTimeMs}/${maxRecordingMs}`, 50, 50)
    const timeLeft =  ( 1 - elapsedTimeMs / maxRecordingMs)
    // actualiza la barra de progreso para mostrar cuánto tiempo queda
    progressBar.style.strokeDashoffset = `${100 * timeLeft }`
  },
  onFinalizeProgress: ({progress, total}) => {
    console.log('Export is ' + Math.round(progress / total) + '% complete')
  },
})
```
