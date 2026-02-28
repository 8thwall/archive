# Eventos PlayCanvas

Esta sección describe los eventos disparados por 8th Wall en un entorno PlayCanvas.

Puedes escuchar estos eventos en tu aplicación web.

## Eventos emitidos {#events-emitted}

| Evento emitido                                   | Descripción                                                                                                                                                                                                                                                                      |
| ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:camerastatuschange](xrcamerastatuschange.md) | Este evento se emite cuando cambia el estado de la cámara. Consulta [`onCameraStatusChange`](/api/camerapipelinemodule/oncamerastatuschange) de [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) para obtener más información sobre los posibles estados.     |
| [xr:realityerror](xrrealityerror.md)             | Este evento se emite cuando se ha producido un error al inicializar 8th Wall Web. Este es el tiempo recomendado en el que deben mostrarse los mensajes de error. La API [`XR8.XrDevice()`](/api/xrdevice) puede ayudar a determinar qué tipo de mensaje de error debe mostrarse. |
| [xr:realityready](xrrealityready.md)             | Este evento se emite cuando 8th Wall Web se ha inicializado y se ha procesado correctamente al menos un fotograma. Este es el tiempo recomendado en el que deben ocultarse los elementos de carga.                                                                               |
| [xr:screenshoterror](xrscreenshoterror.md)       | Este evento se emite en respuesta a la [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) que provoca un error.                                                                                                                                                  |
| [xr:screenshotready](xrscreenshotready.md)       | Este evento se emite en respuesta a que el evento [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) se ha completado con éxito. Se proporcionará la imagen comprimida en JPEG del lienzo AFrame.                                                                |

## Eventos emitidos por XR8.XrController {#xrcontroller-events-emitted}

Cuando se añade `XR8.XrController.pipelineModule()` pasándolo en `extraModules` a `XR8.PlayCanvas.run()` se emiten estos eventos:

| Evento emitido                                           | Descripción                                                                                                            |
| -------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| [xr:imageloading](playcanvas-image-target-events.md)     | Este evento se emite cuando comienza la carga de la imagen de detección.                                               |
| [xr:imagescanning](playcanvas-image-target-events.md)    | Este evento se emite cuando se han cargado todas las imágenes de detección y ha comenzado la exploración.              |
| [xr:imagefound](playcanvas-image-target-events.md)       | Este evento se emite cuando se encuentra por primera vez un objetivo de imagen.                                        |
| [xr:imageupdated](playcanvas-image-target-events.md)     | Este evento se emite cuando un objetivo de imagen cambia de posición, rotación o escala.                               |
| [xr:imagelost](playcanvas-image-target-events.md)        | Este evento se emite cuando se deja de seguir un objetivo de imagen.                                                   |
| [xr:meshfound](xrmeshfound.md)                           | Este evento se emite cuando se encuentra una malla por primera vez, ya sea después del inicio o después de recenter(). |
| [xr:meshupdated](xrmeshupdated.md)                       | Este evento se emite cuando la **primera malla** encontrada cambia de posición o de rotación.                          |
| [xr:meshlost](xrmeshlost.md)                             | Este evento se emite cuando se llama a `recenter()`.                                                                   |
| [xr:projectwayspotscanning](xrprojectwayspotscanning.md) | Este evento se emite cuando todas las Ubicaciones de Proyecto han sido cargadas para su escaneo.                       |
| [xr:projectwayspotfound](xrprojectwayspotfound.md)       | Este evento se emite cuando se encuentra por primera vez una Ubicación de Proyecto.                                    |
| [xr:projectwayspotupdated](xrprojectwayspotupdated.md)   | Este evento se emite cuando una Ubicación de Proyecto cambia de posición o rotación.                                   |
| [xr:projectwayspotlost](xrprojectwayspotlost.md)         | Este evento se emite cuando una Ubicación de Proyecto deja de ser rastreada.                                           |

## Eventos emitidos por XR8.LayersController {#layerscontroller-events-emitted}

Cuando se añade `XR8.LayersController.pipelineModule()` pasándolo en `extraModules` a `XR8.PlayCanvas.run()` se emiten estos eventos:

| Evento emitido                         | Descripción                                                                                                                                        |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:layerloading](xrlayerloading.md)   | Se dispara cuando comienza la carga de recursos adicionales de segmentación de capas.                                                              |
| [xr:layerscanning](xrlayerscanning.md) | Se dispara cuando se han cargado todos los recursos de segmentación de capas y ha comenzado la exploración. Se envía un evento por capa escaneada. |
| [xr:layerfound](xrlayerfound.md)       | Se activa cuando se encuentra una capa por primera vez.                                                                                            |

## Eventos emitidos por XR8.FaceController {#facecontroller-events-emitted}

Cuando se añade `XR8.FaceController.pipelineModule()` pasándolo en `extraModules` a `XR8.PlayCanvas.run()` se emiten estos eventos:

| Evento emitido                                       | Descripción                                                                                        |
| ---------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| [xr:faceloading](playcanvas-face-effects-events.md)  | Se dispara cuando comienza la carga de recursos adicionales de AR de cara.                         |
| [xr:facescanning](playcanvas-face-effects-events.md) | Se dispara cuando se han cargado todos los recursos de AR de cara y se ha iniciado la exploración. |
| [xr:facefound](playcanvas-face-effects-events.md)    | Se activa cuando se encuentra una cara por primera vez.                                            |
| [xr:faceupdated](playcanvas-face-effects-events.md)  | Se dispara cuando posteriormente se encuentra una cara.                                            |
| [xr:facelost](playcanvas-face-effects-events.md)     | Se dispara cuando se deja de seguir una cara.                                                      |

## Eventos emitidos por XR8.HandController {#handcontroller-events-emitted}

Cuando se añade `XR8.HandController.pipelineModule()` pasándolo en `extraModules` a `XR8.PlayCanvas.run()` se emiten estos eventos:

| Evento emitido                                        | Descripción                                                                                      |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| [xr:handloading](playcanvas-hand-tracking-events.md)  | Se dispara cuando se inicia la carga de recursos adicionales de AR de mano.                      |
| [xr:handscanning](playcanvas-hand-tracking-events.md) | Se dispara cuando se han cargado todos los recursos de AR de mano y ha comenzado la exploración. |
| [xr:handfound](playcanvas-hand-tracking-events.md)    | Se dispara cuando se encuentra una mano por primera vez.                                         |
| [xr:handupdated](playcanvas-hand-tracking-events.md)  | Se dispara cuando posteriormente se encuentra una mano.                                          |
| [xr:handlost](playcanvas-hand-tracking-events.md)     | Se dispara cuando se deja de seguir una mano.                                                    |
