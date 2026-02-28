---
id: media-recorder
---

# Eventos Media Recorder

## Descripción

Esta grabadora multimedia le permite capturar capturas de pantalla y grabar vídeo de su proyecto Studio en tiempo de ejecución.

## Eventos

### RECORDER_SCREENSHOT_READY

Emitido cuando la captura de pantalla está lista.

#### Propiedades

| Propiedad | Tipo | Descripción                                         |
| --------- | ---- | --------------------------------------------------- |
| gota      | Gota | El blob de la imagen JPEG de la captura de pantalla |

#### Ejemplo

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_SCREENSHOT_READY, (e) => {
    const blob = e.data;
    console.log('Captura de pantalla blob:', blob);
});
```

### RECORDER_VIDEO_DESCRIPTION

Emitido cuando la grabación ha comenzado.

#### Propiedades

Ninguno.

#### Ejemplo

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_STARTED, () => {
    console.log('Grabación iniciada');
});
```

### RECORDER_VIDEO_DESCRIPTION

Emitido cuando la grabación se ha detenido.

#### Propiedades

Ninguna.

#### Ejemplo

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_STOPPED, () => {
    console.log('Grabación detenida');
});
```

### Error de retorno

Emitido cuando hay un error.

#### Propiedades

| Propiedad | Tipo   | Descripción                          |
| --------- | ------ | ------------------------------------ |
| mensaje   | cadena | El mensaje de error                  |
| nombre    | cadena | El nombre del error                  |
| pila      | cadena | El seguimiento de la pila de errores |

#### Ejemplo

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_ERROR, (error) => {
    console.error('Error de grabación:', error.message);
});
```

### RECORDER_VIDEO_READY

Emitido cuando la grabación se ha completado y el vídeo está listo.

#### Propiedades

| Propiedad | Tipo | Descripción              |
| --------- | ---- | ------------------------ |
| videoBlob | Gota | El blob de vídeo grabado |

#### Ejemplo

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_VIDEO_READY, ({ videoBlob }) => {
    console.log('Video ready:', videoBlob);
});
```

### RECORDER_PREVIEW_READY

Emitido cuando un vídeo previsualizable, pero no optimizado para compartir, está listo (sólo para Android/Escritorio).

#### Propiedades

| Propiedad | Tipo | Descripción                     |
| --------- | ---- | ------------------------------- |
| videoBlob | Gota | Bloque de vídeo de vista previa |

#### Ejemplo

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_PREVIEW_READY, ({ videoBlob }) => {
    console.log('Preview ready:', videoBlob);
});
```

### FINALIZE_PROGRESS

Emitido cuando el grabador de medios está progresando en la exportación final (sólo Android/Desktop).

#### Propiedades

| Propiedad | Tipo   | Descripción                                         |
| --------- | ------ | --------------------------------------------------- |
| progreso  | número | Progreso de finalización (0 a 1) |

#### Ejemplo

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_FINALIZE_PROGRESS, ({ progress }) => {
    console.log(`Finalizar progreso: ${progress * 100}%`);
});
```

### PROCESS_FRAME

#### Propiedades

| Propiedad | Tipo            | Descripción                                          |
| --------- | --------------- | ---------------------------------------------------- |
| frame     | Datos de imagen | El marco de vídeo procesado                          |
| fecha     | número          | La marca de tiempo del marco (ms) |

#### Ejemplo

```
world.events.addListener(world.events.globalId, ecs.events.RECORDER_PROCESS_FRAME, ({ frame, timestamp }) => {
    console.log(`Frame procesado a ${timestamp}ms`, frame);
});
```
