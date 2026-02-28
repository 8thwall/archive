---
sidebar_label: addCameraPipelineModule()
---

# XR8.addCameraPipelineModule()

`XR8.addCameraPipelineModule(module)`

## Descripción {#description}

Las aplicaciones de cámara de 8th Wall se construyen utilizando un marco de módulos de canalización de cámara. Para obtener una descripción completa de los módulos de canalización de cámara, consulte [CameraPipelineModule](/legacy/api/camerapipelinemodule).

Las aplicaciones instalan módulos que controlan el comportamiento de la aplicación en tiempo de ejecución. Un objeto módulo debe tener una cadena **.name** que sea única dentro de la aplicación, y luego debe proporcionar uno o más de los métodos del ciclo de vida de la cámara que se ejecutarán en el punto apropiado del bucle de ejecución.

Durante el tiempo de ejecución principal de una aplicación, cada fotograma de la cámara pasa por el siguiente ciclo:

`onBeforeRun` -> `onCameraStatusChange` (`requesting` -> `hasStream` -> `hasVideo` | `failed`) -> `onStart` -> `onAttach` -> `onProcessGpu` -> `onProcessCpu` -> `onUpdate` -> `onRender`

Los módulos de cámara deben implementar uno o más de los siguientes métodos de ciclo de vida de la cámara:

| Función                                                                                 | Descripción                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| --------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [onAppResourcesLoaded](/legacy/api/camerapipelinemodule/onappresourcesloaded)           | Llamada cuando hemos recibido del servidor los recursos adjuntos a una app.                                                                                                                                                                                                                                                                                                                                                                  |
| [onAttach](/legacy/api/camerapipelinemodule/onattach)                                   | Llamada antes de la primera vez que un módulo recibe actualizaciones de trama. Se llama a los módulos que se han añadido antes o después de que se ejecute el canal.                                                                                                                                                                                                                                                         |
| [onBeforeRun](/legacy/api/camerapipelinemodule/onbeforerun)                             | Llamada inmediatamente después de [`XR8.run()`](run.md). Si se devuelve alguna promesa, XR esperará todas las promesas antes de continuar.                                                                                                                                                                                                                                                                                   |
| [onCameraStatusChange](/legacy/api/camerapipelinemodule/oncamerastatuschange)           | Se ejecuta cuando se produce un cambio durante la solicitud de permisos de la cámara.                                                                                                                                                                                                                                                                                                                                                        |
| [onCanvasSizeChange](/legacy/api/camerapipelinemodule/oncanvassizechange)               | Se ejecuta cuando el lienzo cambia de tamaño.                                                                                                                                                                                                                                                                                                                                                                                                |
| [onDetach](/legacy/api/camerapipelinemodule/ondetach)                                   | se llama después de la última vez que un módulo recibe actualizaciones de trama. Esto ocurre después de que el motor se detiene o el módulo se retira manualmente de la tubería, lo que ocurra primero.                                                                                                                                                                                                                      |
| [onDeviceOrientationChange](/legacy/api/camerapipelinemodule/ondeviceorientationchange) | Se ejecuta cuando el dispositivo cambia de orientación horizontal/vertical.                                                                                                                                                                                                                                                                                                                                                                  |
| [onException](/legacy/api/camerapipelinemodule/onexception)                             | Llamada cuando se produce un error en XR. Llamada con el objeto de error.                                                                                                                                                                                                                                                                                                                                                    |
| [onPaused](/legacy/api/camerapipelinemodule/onpaused)                                   | Llamada cuando se llama a [`XR8.pause()`](pause.md).                                                                                                                                                                                                                                                                                                                                                                                         |
| [onProcessCpu](/legacy/api/camerapipelinemodule/onprocesscpu)                           | Llamada para leer los resultados del procesamiento de la GPU y devolver los datos utilizables.                                                                                                                                                                                                                                                                                                                                               |
| [onProcessGpu](/legacy/api/camerapipelinemodule/onprocessgpu)                           | Llamada para iniciar el procesamiento de la GPU.                                                                                                                                                                                                                                                                                                                                                                                             |
| [onRemove](/legacy/api/camerapipelinemodule/onremove)                                   | cuando se elimina un módulo del canal.                                                                                                                                                                                                                                                                                                                                                                                                       |
| [onRender](/legacy/api/camerapipelinemodule/onrender)                                   | Llamada después de onUpdate. Este es el momento para que el motor de renderizado emita cualquier comando de dibujo WebGL. Si una aplicación está proporcionando su propio bucle de ejecución y está confiando en [`XR8.runPreRender()`](runprerender.md) y [`XR8.runPostRender()`](runpostrender.md), este método no es llamado y todo el renderizado debe ser coordinado por el bucle de ejecución externo. |
| [onResume](/legacy/api/camerapipelinemodule/onresume)                                   | Llamada cuando se llama a [`XR8.resume()`](resume.md).                                                                                                                                                                                                                                                                                                                                                                                       |
| [onStart](/legacy/api/camerapipelinemodule/onstart)                                     | Se activa cuando se inicia XR. Primera llamada de retorno tras la llamada a [`XR8.run()`](run.md).                                                                                                                                                                                                                                                                                                                           |
| [onUpdate](/legacy/api/camerapipelinemodule/onupdate)                                   | Llamada para actualizar la escena antes de renderizar. Los datos devueltos por los módulos en [`onProcessGpu`](/legacy/api/camerapipelinemodule/onprocessgpu) y [`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu) estarán presentes como processGpu.modulename y processCpu.modulename donde el nombre viene dado por module.name = "modulename".              |
| [onVideoSizeChange](/legacy/api/camerapipelinemodule/onvideosizechange)                 | Se ejecuta cuando el lienzo cambia de tamaño.                                                                                                                                                                                                                                                                                                                                                                                                |
| [requiredPermissions](/legacy/api/camerapipelinemodule/requiredpermissions)             | Los módulos pueden indicar qué capacidades del navegador requieren que puedan necesitar solicitudes de permisos. Estos pueden ser utilizados por el framework para solicitar los permisos apropiados en caso de que no existan, o para crear componentes que soliciten los permisos apropiados antes de ejecutar XR.                                                                                                         |

Nota: Los módulos de cámara que implementan [`onProcessGpu`](/legacy/api/camerapipelinemodule/onprocessgpu) o [`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu) pueden proporcionar datos a etapas posteriores del pipeline. Esto se hace mediante el nombre del módulo.

## Parámetros {#parameters}

| Parámetro | Tipo   | Descripción                           |
| --------- | ------ | ------------------------------------- |
| módulo    | Objeto | El objeto del módulo. |

## Devuelve {#returns}

Ninguno

## Ejemplo 1 - Un módulo de canalización de cámaras para gestionar los permisos de las cámaras: {#example-1---a-camera-pipeline-module-for-managing-camera-permissions}

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

## Ejemplo 2 - una aplicación para escanear códigos QR podría construirse así {#example-2---a-qr-code-scanning-application-could-be-built-like-this}

```javascript
// Instala un módulo que obtenga el feed de la cámara como un UInt8Array.
XR8.addCameraPipelineModule(
  XR8.CameraPixelArray.pipelineModule({luminance: true, width: 240, height: 320}))

// Instala un módulo que dibuje la imagen de la cámara en el lienzo.
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Crear nuestra lógica de aplicación personalizada para escanear y mostrar códigos QR.
XR8.addCameraPipelineModule({
  name: 'qrscan',
  onProcessCpu: ({processGpuResult}) => {
    // CameraPixelArray.pipelineModule() devuelve esto en onProcessGpu.
    const { pixels, rows, cols, rowBytes } = processGpuResult.camerapixelarray
    const { wasFound, url, corners } = findQrCode(pixels, rows, cols, rowBytes)
    return { wasFound, url, corners }
  },
  onUpdate: ({processCpuResult}) => {
    // Estos fueron devueltos por este módulo ('qrscan') en onProcessCpu
    const {wasFound, url, corners } = processCpuResult.qrscan
    if (wasFound) {
      showUrlAndCorners(url, corners)
    }
  },
})
```
