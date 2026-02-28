---
sidebar_label: requestMicrophone()
---

# XR8.MediaRecorder.requestMicrophone()

`XR8.MediaRecorder.requestMicrophone()`

## Descripción {#description}

Activa la grabación de audio (si no se activa automáticamente), solicitando permisos si es necesario.

Devuelve una promesa que permite al cliente saber cuándo está listo el flujo.  Si empiezas a grabar antes de que el flujo de audio esté listo, puede que te pierdas la salida del micrófono del usuario en el comienzo de la grabación.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Una promesa.

## Ejemplo {#example}

```javascript
XR8.MediaRecorder.requestMicrophone()
.then(() => {
  console.log('Microphone requested!')
})
.catch((err) => {
  console.log('Hit an error: ', err)
})
```
