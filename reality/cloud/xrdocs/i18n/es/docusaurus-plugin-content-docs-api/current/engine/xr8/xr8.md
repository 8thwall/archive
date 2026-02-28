# XR8

## Descripción {#description}

Punto de entrada a la API Javascript de 8th Wall

## Funciones {#functions}

| Función                                                       | Descripción                                                                                                                                                                                                                                 |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [addCameraPipelineModule](addcamerapipelinemodule.md)         | Añade un módulo a la canalización de la cámara que recibirá llamadas de retorno de eventos para cada etapa de la canalización de la cámara.                                                                                 |
| [addCameraPipelineModules](addcamerapipelinemodules.md)       | Añadir varios módulos de canalización de cámara. Este es un método conveniente que llama a [addCameraPipelineModule](addcamerapipelinemodule.md) en orden en cada elemento de la matriz de entrada.         |
| [clearCameraPipelineModules](clearcamerapipelinemodules.md)   | Retire todos los módulos de canalización de la cámara del bucle de la cámara.                                                                                                                                               |
| [inicializar](initialize.md)                                  | Devuelve una promesa que se cumple cuando se inicializa el WebAssembly del AR Engine.                                                                                                                                       |
| [isInitialized](isinitialized.md)                             | Indica si el WebAssembly del AR Engine está inicializado o no.                                                                                                                                                              |
| [isPaused](ispaused.md)                                       | Indica si la sesión XR está en pausa o no.                                                                                                                                                                                  |
| [pausa](pause.md)                                             | Pausa la sesión XR actual.  Mientras está en pausa, la alimentación de la cámara se detiene y no se rastrea el movimiento del dispositivo.                                                                  |
| [resume](resume.md)                                           | Reanuda la sesión XR actual.                                                                                                                                                                                                |
| [removeCameraPipelineModule](removecamerapipelinemodule.md)   | Elimina un módulo del canal de la cámara.                                                                                                                                                                                   |
| [removeCameraPipelineModules](removecamerapipelinemodules.md) | Eliminar varios módulos de canalización de cámara. Este es un método conveniente que llama a [removeCameraPipelineModule](removecamerapipelinemodule.md) en orden en cada elemento de la matriz de entrada. |
| [requiredPermissions](requiredpermissions.md)                 | Devuelve una lista de permisos requeridos por la aplicación.                                                                                                                                                                |
| ejecute                                                       | Abra la cámara y comience a ejecutar el bucle de ejecución de la cámara.                                                                                                                                                    |
| [runPreRender](runprerender.md)                               | Ejecuta todas las actualizaciones del ciclo de vida que deben producirse antes de la renderización.                                                                                                                         |
| [runPostRender](runpostrender.md)                             | Ejecuta todas las actualizaciones del ciclo de vida que deben producirse después de la renderización.                                                                                                                       |
| [stop](stop.md)                                               | Detener la sesión XR actual.  Mientras está detenido, la alimentación de la cámara está cerrada y no se rastrea el movimiento del dispositivo.                                                              |
| [versión](version.md)                                         | Consigue la versión del motor web de 8th Wall.                                                                                                                                                                              |

## Eventos {#events}

| Evento emitido | Descripción                                                           |
| -------------- | --------------------------------------------------------------------- |
| xrloaded       | Este evento se emite una vez que `XR8` se ha cargado. |

<!-- ## Modules {#modules}

Module | Description
-------- | -----------
[CameraPixelArray](../camerapixelarray/camerapixelarray.md) | Provides a camera pipeline module that gives access to camera data as a grayscale or color uint8 array.
[CanvasScreenshot](../canvasscreenshot/canvasscreenshot.md) | Provides a camera pipeline module that can generate screenshots of the current scene.
[Vps](../vps/vps.md) | Utilities to talk to Vps services.
[XrDevice](../xrdevice/xrdevice.md) | Provides information about device compatibility and characteristics.
[XrPermissions](../xrpermissions/xrpermissions.md) | Utilities for specifying permissions required by a pipeline module. -->
