# Eventos de PlayCanvas

Esta sección describe los eventos disparados por 8th Wall en un entorno PlayCanvas.

Puede escuchar estos eventos en su aplicación web.

## Eventos Emitidos {#events-emitted}

| Evento emitido                                                   | Descripción                                                                                                                                                                                                                                                                                                                           |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:camerastatuschange](xrcamerastatuschange.md) | Este evento se emite cuando cambia el estado de la cámara. Véase [`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) de [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) para más información sobre los posibles estados.                       |
| [xr:realityerror](xrrealityerror.md)             | Este evento se emite cuando se ha producido un error al inicializar 8th Wall Web. Esta es la hora recomendada en la que deben mostrarse los mensajes de error. La [`XR8.XrDevice()` API](/legacy/api/xrdevice) puede ayudar a determinar qué tipo de mensaje de error debe mostrarse. |
| [xr:realityready](xrrealityready.md)             | Este evento se emite cuando 8th Wall Web se ha inicializado y se ha procesado correctamente al menos un fotograma. Este es el momento recomendado en el que se deben ocultar los elementos de carga.                                                                                                  |
| [xr:screenshoterror](xrscreenshoterror.md)       | Este evento se emite en respuesta a la [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) que resulta en un error.                                                                                                                                                                             |
| [xr:screenshotready](xrscreenshotready.md)       | Este evento se emite en respuesta al evento [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) que se ha completado con éxito. Se proporcionará la imagen comprimida en JPEG del lienzo AFrame.                                                                                |

## XR8.XrController Eventos emitidos {#xrcontroller-events-emitted}

Cuando se añade `XR8.XrController.pipelineModule()` pasándolo en `extraModules` a `XR8.PlayCanvas.run()` se emiten estos eventos:

| Evento emitido                                                           | Descripción                                                                                                                                                    |
| ------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:imageloading](playcanvas-image-target-events.md)     | Este evento se emite cuando comienza la carga de la imagen de detección.                                                                       |
| [xr:imagescanning](playcanvas-image-target-events.md)    | Este evento se emite cuando se han cargado todas las imágenes de detección y se ha iniciado la exploración.                                    |
| [xr:imagefound](playcanvas-image-target-events.md)       | Este evento se emite cuando se encuentra por primera vez un objetivo de imagen.                                                                |
| [xr:imageupdated](playcanvas-image-target-events.md)     | Este evento se emite cuando un objetivo de imagen cambia de posición, rotación o escala.                                                       |
| [xr:imagelost](playcanvas-image-target-events.md)        | Este evento se emite cuando un objetivo de imagen deja de ser rastreado.                                                                       |
| [xr:meshfound](xrmeshfound.md)                           | Este evento es emitido cuando una malla es encontrada por primera vez ya sea después del inicio o después de un recenter(). |
| [xr:meshupdated](xrmeshupdated.md)                       | Este evento se emite cuando la **primera** malla encontrada cambia de posición o rotación.                                                     |
| [xr:meshlost](xrmeshlost.md)                             | Este evento se emite cuando se llama a `recenter()`.                                                                                           |
| [xr:projectwayspotscanning](xrprojectwayspotscanning.md) | Este evento se emite cuando todas las Ubicaciones de Proyecto han sido cargadas para su escaneo.                                               |
| [xr:projectwayspotfound](xrprojectwayspotfound.md)       | Este evento se emite cuando se encuentra por primera vez una Ubicación de Proyecto.                                                            |
| [xr:projectwayspotupdated](xrprojectwayspotupdated.md)   | Este evento se emite cuando una Ubicación de Proyecto cambia de posición o rotación.                                                           |
| [xr:projectwayspotlost](xrprojectwayspotlost.md)         | Este evento se emite cuando una Ubicación de Proyecto deja de ser rastreada.                                                                   |

## Eventos emitidos por XR8.LayersController {#layerscontroller-events-emitted}

Cuando se añade `XR8.LayersController.pipelineModule()` pasándolo en `extraModules` a `XR8.PlayCanvas.run()` se emiten estos eventos:

| Evento emitido                                         | Descripción                                                                                                                                                                              |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:layerloading](xrlayerloading.md)   | Se activa cuando comienza la carga de recursos adicionales de segmentación de capas.                                                                                     |
| [xr:layerscanning](xrlayerscanning.md) | Se activa cuando se han cargado todos los recursos de segmentación de capas y se ha iniciado la exploración. Se envía un evento por cada capa escaneada. |
| [xr:layerfound](xrlayerfound.md)       | Se activa cuando se encuentra una capa por primera vez.                                                                                                                  |

## Eventos emitidos por XR8.FaceController {#facecontroller-events-emitted}

Cuando se añade `XR8.FaceController.pipelineModule()` pasándolo en `extraModules` a `XR8.PlayCanvas.run()` se emiten estos eventos:

| Evento emitido                                                       | Descripción                                                                                                    |
| -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| [xr:faceloading](playcanvas-face-effects-events.md)  | Se dispara cuando comienza la carga de recursos adicionales de face AR.                        |
| [xr:facescanning](playcanvas-face-effects-events.md) | Se activa cuando se han cargado todos los recursos de face AR y se ha iniciado la exploración. |
| [xr:facefound](playcanvas-face-effects-events.md)    | Se activa cuando se encuentra una cara por primera vez.                                        |
| [xr:faceupdated](playcanvas-face-effects-events.md)  | Se activa cuando se encuentra una cara.                                                        |
| [xr:facelost](playcanvas-face-effects-events.md)     | Se activa cuando se deja de seguir una cara.                                                   |

## Eventos emitidos por XR8.HandController {#handcontroller-events-emitted}

Cuando se añade `XR8.HandController.pipelineModule()` pasándolo en `extraModules` a `XR8.PlayCanvas.run()` se emiten estos eventos:

| Evento emitido                                                        | Descripción                                                                                                      |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| [xr:handloading](playcanvas-hand-tracking-events.md)  | Se dispara cuando se inicia la carga para obtener recursos adicionales de AR manual.             |
| [xr:handscanning](playcanvas-hand-tracking-events.md) | Se dispara cuando se han cargado todos los recursos manuales AR y se ha iniciado la exploración. |
| [xr:handfound](playcanvas-hand-tracking-events.md)    | Se dispara cuando se encuentra una mano por primera vez.                                         |
| [xr:handupdated](playcanvas-hand-tracking-events.md)  | Se dispara cuando posteriormente se encuentra una mano.                                          |
| [xr:handlost](playcanvas-hand-tracking-events.md)     | Se dispara cuando una mano deja de ser rastreada.                                                |
