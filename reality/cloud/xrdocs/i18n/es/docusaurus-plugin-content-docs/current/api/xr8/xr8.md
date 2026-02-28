# XR8

## Descripción {#description}

Punto de entrada para la API Javascript de 8th Wall

## Funciones {#functions}

| Función                                                       | Descripción                                                                                                                                                                                             |
| ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [addCameraPipelineModule](addcamerapipelinemodule.md)         | Añade un módulo a la canalización de la cámara que recibirá llamadas de retorno de eventos para cada etapa de la canalización de la cámara.                                                             |
| [addCameraPipelineModules](addcamerapipelinemodules.md)       | Añade varios módulos de canalización de cámara. Éste es un método práctico que llama a [addCameraPipelineModule](addcamerapipelinemodule.md) en orden en cada elemento de la matriz de entrada.         |
| [clearCameraPipelineModules](clearcamerapipelinemodules.md)   | Retira todos los módulos de canalización de la cámara del bucle de la cámara.                                                                                                                           |
| [initialize](initialize.md)                                   | Devuelve una promesa que se cumple cuando se inicializa el WebAssembly del AR Engine.                                                                                                                   |
| [isInitialized](isinitialized.md)                             | Indica si el WebAssembly del AR Engine está inicializado o no.                                                                                                                                          |
| [isPaused](ispaused.md)                                       | Indica si la sesión XR está en pausa o no.                                                                                                                                                              |
| [pause](pause.md)                                             | Pausa la sesión XR actual.  Mientras está en pausa, la alimentación de la cámara se detiene y no se rastrea el movimiento del dispositivo.                                                              |
| [resume](resume.md)                                           | Reanuda la sesión XR actual.                                                                                                                                                                            |
| [removeCameraPipelineModule](removecamerapipelinemodule.md)   | Elimina un módulo del canal de la cámara.                                                                                                                                                               |
| [removeCameraPipelineModules](removecamerapipelinemodules.md) | Elimina varios módulos de canalización de cámara. Este es un método práctico que llama a [removeCameraPipelineModule](removecamerapipelinemodule.md) en orden en cada elemento de la matriz de entrada. |
| [requiredPermissions](requiredpermissions.md)                 | Devuelve una lista de permisos requeridos por la aplicación.                                                                                                                                            |
| [run](run.md)                                                 | Abre la cámara y empieza a ejecutar el bucle de ejecución de la cámara.                                                                                                                                 |
| [runPreRender](runprerender.md)                               | Ejecuta todas las actualizaciones del ciclo de vida que deben producirse antes de la renderización.                                                                                                     |
| [runPostRender](runpostrender.md)                             | Ejecuta todas las actualizaciones del ciclo de vida que deben producirse después de la renderización.                                                                                                   |
| [stop](stop.md)                                               | Detén la sesión XR actual.  Mientras está parado, la alimentación de la cámara está cerrada y no se rastrea el movimiento del dispositivo.                                                              |
| [version](version.md)                                         | Consigue la versión del motor web de 8th Wall.                                                                                                                                                          |

## Eventos {#events}

| Evento emitido | Descripción                                           |
| -------------- | ----------------------------------------------------- |
| xrloaded       | Este evento se emite una vez que se ha cargado `XR8`. |

## Módulos {#modules}

| Módulo                                                         | Descripción                                                                                                                                                          |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AFrame](../aframe/aframe.md)                                  | Punto de entrada para la integración de A-Frame con 8th Wall Web.                                                                                                    |
| [Babylonjs](../babylonjs/babylonjs.md)                         | Punto de entrada para la integración de Babylon.js con 8th Wall Web.                                                                                                 |
| [CameraPixelArray](../camerapixelarray/camerapixelarray.md)    | Proporciona un módulo de canalización de cámara que da acceso a los datos de la cámara como una matriz uint8 en escala de grises o en color.                         |
| [CanvasScreenshot](../canvasscreenshot/canvasscreenshot.md)    | Proporciona un módulo de canalización de cámara que puede generar capturas de pantalla de la escena actual.                                                          |
| [FaceController](../facecontroller/facecontroller.md)          | Proporciona detección y mallado de caras, e interfaces para configurar el seguimiento.                                                                               |
| [GlTextureRenderer](../gltexturerenderer/gltexturerenderer.md) | Proporciona un módulo de canalización de cámara que dibuja la alimentación de la cámara en un lienzo, así como utilidades adicionales para operaciones de dibujo GL. |
| [HandController](../handcontroller/handcontroller.md)          | Proporciona detección y mallado de manos, e interfaces para configurar el seguimiento.                                                                               |
| [LayersController](../layerscontroller/layerscontroller.md)    | Proporciona un módulo de canalización de cámara que permite la detección semántica de capas e interfaces para configurar el renderizado de capas.                    |
| [MediaRecorder](../mediarecorder/mediarecorder.md)             | Proporciona un módulo de canalización de cámara que te permite grabar un vídeo en formato MP4.                                                                       |
| [PlayCanvas](../playcanvas/playcanvas.md)                      | Punto de entrada para la integración de PlayCanvas con 8th Wall Web.                                                                                                 |
| [Threejs](../threejs/threejs.md)                               | Proporciona un módulo de canalización de cámara que controla la cámara three.js para realizar superposiciones virtuales.                                             |
| [VPS](../vps/vps.md)                                           | Utilidades para hablar con los servicios VPS.                                                                                                                        |
| [XrConfig](../xrconfig/xrconfig.md)                            | Especificar la clase de dispositivos y cámaras en los que deben ejecutarse los módulos de canalización.                                                              |
| [XrController](../xrcontroller/xrcontroller.md)                | `XrController` proporciona seguimiento de cámara 6DoF e interfaces para configurar el seguimiento.                                                                   |
| [XrDevice](../xrdevice/xrdevice.md)                            | Proporciona información sobre la compatibilidad y las características del dispositivo.                                                                               |
| [XrPermissions](../xrpermissions/xrpermissions.md)             | Utilidades para especificar los permisos requeridos por un módulo de canalización.                                                                                   |
