---
sidebar_label: addCameraPipelineModule()
---

# XR8.addCameraPipelineModule()

`XR8.addCameraPipelineModule(módule)`

## Descripción {#description}

las aplicaciones de cámara de 8th Wall se construyen utilizando un marco de módulos de canalización de cámara. Para una descripción completa de los módulos de canalización de cámara, consulta [CameraPipelineModule](/api/camerapipelinemodule).

Las aplicaciones instalan módulos que luego controlan el comportamiento de la aplicación en tiempo de ejecución. Un objeto módulo debe tener una cadena **.name** que sea única dentro de la aplicación, y luego debe proporcionar uno o más métodos del ciclo de vida de la cámara que se ejecutarán en el punto apropiado del bucle de ejecución.

Durante el tiempo de ejecución principal de una aplicación, cada fotograma de la cámara pasa por el siguiente ciclo:

`onBeforeRun` -> `onCameraStatusChange` (`requesting` -> `hasStream` -> `hasVideo` | `failed`) -> `onStart` -> `onAttach` -> `onProcessGpu` -> `onProcessCpu` -> `onUpdate` -> `onRender`

Los módulos de cámara deben implementar uno o varios de los siguientes métodos del ciclo de vida de la cámara:

| Función                                                                          | Descripción                                                                                                                                                                                                                                                                                                                                                                                   |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [onAppResourcesLoaded](/api/camerapipelinemodule/onappresourcesloaded)           | Se activa cuando hemos recibido del servidor los recursos adjuntos a una aplicación.                                                                                                                                                                                                                                                                                                          |
| [onAttach](/api/camerapipelinemodule/onattach)                                   | Se activa antes de la primera vez que un módulo recibe actualizaciones de fotograma. Se activan los módulos que se han añadido antes o después de que se ejecute la canalización.                                                                                                                                                                                                             |
| [onBeforeRun](/api/camerapipelinemodule/onbeforerun)                             | Llamada inmediatamente después de [`XR8.run()`](run.md). Si se devuelve alguna promesa, XR esperará todas las promesas antes de continuar.                                                                                                                                                                                                                                                    |
| [onCameraStatusChange](/api/camerapipelinemodule/oncamerastatuschange)           | Se activa cuando se produce un cambio durante la solicitud de permisos de la cámara.                                                                                                                                                                                                                                                                                                          |
| [onCanvasSizeChange](/api/camerapipelinemodule/oncanvassizechange)               | Se ejecuta cuando el lienzo cambia de tamaño.                                                                                                                                                                                                                                                                                                                                                 |
| [onDetach](/api/camerapipelinemodule/ondetach)                                   | se llama después de la última vez que un módulo recibe actualizaciones de marcos. Esto ocurre después de parar el motor o de retirar manualmente el módulo de la canalización, lo que ocurra primero.                                                                                                                                                                                         |
| [onDeviceOrientationChange](/api/camerapipelinemodule/ondeviceorientationchange) | Se ejecuta cuando el dispositivo cambia de orientación horizontal/vertical.                                                                                                                                                                                                                                                                                                                   |
| [onException](/api/camerapipelinemodule/onexception)                             | Se activa cuando se produce un error en XR. Llamada con el objeto de error.                                                                                                                                                                                                                                                                                                                   |
| [onPaused](/api/camerapipelinemodule/onpaused)                                   | Se activa cuando se llama a [`XR8.pause()`](pause.md).                                                                                                                                                                                                                                                                                                                                        |
| [onProcessCpu](/api/camerapipelinemodule/onprocesscpu)                           | Llamada para leer los resultados del procesamiento de la GPU y devolver los datos utilizables.                                                                                                                                                                                                                                                                                                |
| [onProcessGpu](/api/camerapipelinemodule/onprocessgpu)                           | Llamada para iniciar el procesamiento de la GPU.                                                                                                                                                                                                                                                                                                                                              |
| [onRemove](/api/camerapipelinemodule/onremove)                                   | se activa cuando se elimina un módulo de la canalización.                                                                                                                                                                                                                                                                                                                                     |
| [onRender](/api/camerapipelinemodule/onrender)                                   | Activado después de onUpdate. Este es el momento en que el motor de renderizado emite cualquier comando de dibujo WebGL. Si una aplicación proporciona su propio bucle de ejecución y confía en [`XR8.runPreRender()`](runprerender.md) y [`XR8.runPostRender()`](runpostrender.md), no se llama a este método y toda la renderización debe ser coordinada por el bucle de ejecución externo. |
| [onResume](/api/camerapipelinemodule/onresume)                                   | Se activa cuando se llama a [`XR8.resume()`](resume.md).                                                                                                                                                                                                                                                                                                                                      |
| [onStart](/api/camerapipelinemodule/onstart)                                     | Se activa cuando se inicia XR. Primera llamada de retorno después de llamar a [`XR8.run()`](run.md).                                                                                                                                                                                                                                                                                          |
| [onUpdate](/api/camerapipelinemodule/onupdate)                                   | Llamada para actualizar la escena antes de la renderización. Los datos devueltos por los módulos en [`onProcessGpu`](/api/camerapipelinemodule/onprocessgpu) y [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu) estarán presentes como processGpu.modulename y processCpu.modulename, donde el nombre viene dado por module.name = "modulename".                                      |
| [onVideoSizeChange](/api/camerapipelinemodule/onvideosizechange)                 | Se ejecuta cuando el lienzo cambia de tamaño.                                                                                                                                                                                                                                                                                                                                                 |
| [requiredPermissions](/api/camerapipelinemodule/requiredpermissions)             | Los módulos pueden indicar qué capacidades del navegador requieren que puedan necesitar solicitudes de permisos. El marco de trabajo puede utilizarlos para solicitar los permisos adecuados si no los tiene, o para crear componentes que soliciten los permisos adecuados antes de ejecutar XR.                                                                                             |

Nota: Los módulos de cámara que implementen [`onProcessGpu`](/api/camerapipelinemodule/onprocessgpu) o [`onProcessCpu`](/api/camerapipelinemodule/onprocesscpu) pueden proporcionar datos a etapas posteriores de la canalización. Esto se hace mediante el nombre del módulo.

## Parámetros {#parameters}

| Parámetro | Tipo     | Descripción       |
| --------- | -------- | ----------------- |
| módulo    | `Objeto` | El módulo objeto. |

## Returns {#returns}

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
// Instala un módulo que obtenga la alimentación de la cámara como un UInt8Array.
XR8.addCameraPipelineModule(
  XR8.CameraPixelArray.pipelineModule({luminance: true, width: 240, height: 320}))

// Instala un módulo que dibuje la imagen de la cámara en el lienzo.
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Crea nuestra lógica de aplicación personalizada para escanear y mostrar códigos QR.
XR8.addCameraPipelineModule({
  name: 'qrscan',
  onProcessCpu: ({processGpuResult}) => {
    // CameraPixelArray.pipelineModule() los devuelve en onProcessGpu.
    const { pixels, rows, cols, rowBytes } = processGpuResult.camerapixelarray
    const { wasFound, url, corners } = findQrCode(pixels, rows, cols, rowBytes)
    return { wasFound, url, corners }
 }},
  onUpdate: ({processCpuResult}) => {
 // Estos fueron devueltos por este módulo ('qrscan') en onProcessCpu
    const {wasFound, url, corners } = processCpuResult.qrscan
    if (wasFound) {
      showUrlAndCorners(url, corners)
 }},
)
```
