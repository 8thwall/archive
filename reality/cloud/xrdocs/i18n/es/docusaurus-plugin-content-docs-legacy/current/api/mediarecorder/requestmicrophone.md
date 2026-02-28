---
sidebar_label: solicitarMicrófono()
---

# XR8.MediaRecorder.requestMicrophone()

`XR8.MediaRecorder.requestMicrophone()`

## Descripción {#description}

Activa la grabación de audio (si no se activa automáticamente), solicitando permisos si es necesario.

Devuelve una promesa que permite al cliente saber cuando el flujo está listo.  Si empieza a grabar
antes de que el flujo de audio esté listo, es posible que se pierda la salida del micrófono del usuario al principio de la grabación
.

## Parámetros {#parameters}

Ninguno

## Devuelve {#returns}

Una promesa.

## Ejemplo {#example}

```javascript
XR8.MediaRecorder.requestMicrophone()
.then(() => {
  console.log('¡Micrófono solicitado!')
})
.catch((err) => {
  console.log('Se ha producido un error: ', err)
})
```
