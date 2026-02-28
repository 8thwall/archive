# Eventos AFrame

Esta sección describe los eventos emitidos por los componentes A-Frame `xrweb`, `xrface` y `xrhand`.

Puedes escuchar estos eventos en tu aplicación web para llamar a una función que gestione el evento.

## Eventos emitidos por [`xrconfig`](/api/aframe/#configuring-the-camera) {#events-emitted}

Los siguientes eventos son emitidos por `xrconfig` (que se añade automáticamente si solo utilizaa `xrweb`, `xrface`, `xrhand` o `xrlayers`):

| Evento emitido                              | Descripción                                                                                                                                                                                                                                                                      |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [camerastatuschange](camerastatuschange.md) | Este evento se emite cuando cambia el estado de la cámara. Consulte [`onCameraStatusChange`](/api/camerapipelinemodule/oncamerastatuschange) de [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) para obtener más información sobre los posibles estados.     |
| [realityerror](realityerror.md)             | Este evento se emite cuando se ha producido un error al inicializar 8th Wall Web. Este es el tiempo recomendado en el que deben mostrarse los mensajes de error. La API [`XR8.XrDevice()`](/api/xrdevice) puede ayudar a determinar qué tipo de mensaje de error debe mostrarse. |
| [realityready](realityready.md)             | Este evento se emite cuando 8th Wall Web se ha inicializado y se ha procesado correctamente al menos un fotograma. Este es el tiempo recomendado en el que deben ocultarse los elementos de carga.                                                                               |
| [screenshoterror](screenshoterror.md)       | Este evento se emite en respuesta al evento [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) que provoca un error.                                                                                                                                             |
| [screenshotready](screenshotready.md)       | Este evento se emite en respuesta a que el evento [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) se ha completado con éxito. Se proporcionará la imagen comprimida en JPEG del lienzo AFrame.                                                                |

## Eventos emitidos por [`xrweb`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) {#events-emitted-by-xrweb}

| Evento emitido                                          | Descripción                                                                                                                          |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| [xrimageloading](xrimageloading.md)                     | Este evento se emite cuando comienza la carga de la imagen de detección.                                                             |
| [xrimagescanning](xrimagescanning.md)                   | Este evento se emite cuando se han cargado todas las imágenes de detección y ha comenzado la exploración.                            |
| [xrimagefound](xrimagefound.md)                         | Este evento se emite cuando se encuentra por primera vez un objetivo de imagen.                                                      |
| [xrimageupdated](xrimageupdated.md)                     | Este evento se emite cuando un objetivo de imagen cambia de posición, rotación o escala.                                             |
| [xrimagelost](xrimagelost.md)                           | Este evento se emite cuando se deja de seguir un objetivo de imagen.                                                                 |
| [xrmeshfound](xrmeshfound.md)                           | Este evento se emite cuando se encuentra una malla por primera vez, ya sea después del inicio o después de un recentrado().          |
| [xrmeshupdated](xrmeshupdated.md)                       | Este evento se emite cuando la **primera** malla encontrada cambia de posición o de rotación.                                        |
| [xrmeshlost](xrmeshlost.md)                             | Este evento se emite cuando se llama a `recenter()`.                                                                                 |
| [xrprojectwayspotscanning](xrprojectwayspotscanning.md) | Este evento se emite cuando se han cargado todos los Wayspots del Proyecto para su escaneado.                                        |
| [xrprojectwayspotfound](xrprojectwayspotfound.md)       | Este evento se emite cuando se encuentra por primera vez un Proyecto Wayspot.                                                        |
| [xrprojectwayspotupdated](xrprojectwayspotupdated.md)   | Este evento se emite cuando un Proyecto Wayspot cambia de posición o rotación.                                                       |
| [xrprojectwayspotlost](xrprojectwayspotlost.md)         | Este evento se emite cuando un Proyecto Wayspot deja de ser rastreado.                                                               |
| [xrtrackingstatus](xrtrackingstatus.md)                 | Este evento se emite cuando se inicia [`XR8.XrController`](/api/xrcontroller) y cuando cambia el estado o el motivo del seguimiento. |

## Eventos emitidos por [`xrface`](/api/aframe/#face-effects) {#events-emitted-by-xrface}

| Evento emitido                                          | Descripción                                                                                                                                                  |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [xrfaceloading](xrfaceloading.md)                       | Este evento se emite cuando comienza la carga de recursos adicionales de AR facial.                                                                          |
| [xrfacescanning](xrfacescanning.md)                     | Este evento se emite cuando se han cargado los recursos AR y ha comenzado la exploración.                                                                    |
| [xrfacefound](xrfacefound.md)                           | Este evento se emite cuando se encuentra una cara por primera vez.                                                                                           |
| [xrfaceupdated](xrfaceupdated.md)                       | Este evento se emite cuando posteriormente se encuentra la cara.                                                                                             |
| [xrfacelost](xrfacelost.md)                             | Este evento se emite cuando se deja de seguir una cara.                                                                                                      |
| [xrmouthopened](xrmouthopened.md)                       | Este evento se emite cuando se abre la boca de una cara rastreada.                                                                                           |
| [xrmouthclosed](xrmouthclosed.md)                       | Este evento se emite cuando se cierra la boca de una cara rastreada.                                                                                         |
| [xrlefteyeopened](xrlefteyeopened.md)                   | Este evento se emite cuando se abre el ojo izquierdo de una cara rastreada.                                                                                  |
| [xrlefteyeclosed](xrlefteyeclosed.md)                   | Este evento se emite cuando se cierra el ojo izquierdo de una cara rastreada.                                                                                |
| [xrrighteyeopened](xrrighteyeopened.md)                 | Este evento se emite cuando se abre el ojo derecho de una cara rastreada.                                                                                    |
| [xrrighteyeclosed](xrrighteyeclosed.md)                 | Este evento se emite cuando se cierra el ojo derecho de una cara rastreada.                                                                                  |
| [xrlefteyebrowraised](xrlefteyebrowraised.md)           | Este evento se emite cuando la ceja izquierda de una cara rastreada se levanta de su posición inicial al encontrar la cara.                                  |
| [xrlefteyebrowlowered](xrlefteyebrowlowered.md)         | Este evento se emite cuando la ceja izquierda de una cara rastreada se baja a su posición inicial cuando se encontró la cara.                                |
| [xrrighteyebrowraised](xrrighteyebrowraised.md)         | Este evento se emite cuando la ceja derecha de una cara rastreada se levanta de su posición inicial al encontrar la cara.                                    |
| [xrrighteyebrowlowered](xrrighteyebrowlowered.md)       | Este evento se emite cuando la ceja derecha de una cara rastreada se baja a su posición inicial cuando se encontró la cara.                                  |
| [xrlefteyewinked](xrlefteyewinked.md)                   | Este evento se emite cuando el ojo izquierdo de una cara rastreada se cierra y se abre en un plazo de 750 ms, mientras que el ojo derecho permanece abierto. |
| [xrrighteyewinked](xrrighteyewinked.md)                 | Este evento se emite cuando el ojo derecho de una cara rastreada se cierra y se abre en un plazo de 750 ms, mientras que el ojo izquierdo permanece abierto. |
| [xrblinked](xrblinked.md)                               | Este evento se emite cuando los ojos de una cara rastreada parpadean.                                                                                        |
| [xrinterpupillarydistance](xrinterpupillarydistance.md) | Este evento se emite cuando se detecta por primera vez la distancia en milímetros entre los centros de cada pupila de una cara rastreada.                    |

## Eventos emitidos por [`xrhand`](/api/aframe/#hand-tracking) {#events-emitted-by-xrhand}

| Evento emitido                      | Descripción                                                                               |
| ----------------------------------- | ----------------------------------------------------------------------------------------- |
| [xrhandloading](xrhandloading.md)   | Este evento se emite cuando comienza la carga de recursos manuales AR adicionales.        |
| [xrhandscanning](xrhandscanning.md) | Este evento se emite cuando se han cargado los recursos AR y ha comenzado la exploración. |
| [xrhandfound](xrhandfound.md)       | Este evento se emite cuando se encuentra una mano por primera vez.                        |
| [xrhandupdated](xrhandupdated.md)   | Este evento se emite cuando posteriormente se encuentra la mano.                          |
| [xrhandlost](xrhandlost.md)         | Este evento se emite cuando se deja de seguir una mano.                                   |
