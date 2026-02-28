# Eventos AFrame

Esta sección describe los eventos emitidos por los componentes A-Frame `xrweb`, `xrface` y `xrhand`.

Puedes escuchar estos eventos en tu aplicación web para llamar a una función que gestione el evento.

## Eventos emitidos por `xrconfig` {#events-emitted}

Los siguientes eventos son emitidos por `xrconfig` (que se añade automáticamente si sólo utilizas `xrweb`, `xrface`, `xrhand` o `xrlayers`):

| Evento emitido                              | Descripción                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [camerastatuschange](camerastatuschange.md) | Este evento se emite cuando cambia el estado de la cámara. Véase [`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) de [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) para más información sobre los posibles estados.                       |
| [realityerror](realityerror.md)             | Este evento se emite cuando se ha producido un error al inicializar 8th Wall Web. Esta es la hora recomendada en la que deben mostrarse los mensajes de error. La [`XR8.XrDevice()` API](/legacy/api/xrdevice) puede ayudar a determinar qué tipo de mensaje de error debe mostrarse. |
| [realityready](realityready.md)             | Este evento se emite cuando 8th Wall Web se ha inicializado y se ha procesado correctamente al menos un fotograma. Este es el momento recomendado en el que se deben ocultar los elementos de carga.                                                                                                  |
| [screenshoterror](screenshoterror.md)       | Este evento se emite en respuesta al evento [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) que resulta en un error.                                                                                                                                                                        |
| [screenshotready](screenshotready.md)       | Este evento se emite en respuesta al evento [`screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) que se ha completado con éxito. Se proporcionará la imagen comprimida en JPEG del lienzo AFrame.                                                                                |

## Eventos emitidos por `xrweb` {#events-emitted-by-xrweb}

| Evento emitido                                          | Descripción                                                                                                                                                            |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrimageloading](xrimageloading.md)                     | Este evento se emite cuando comienza la carga de la imagen de detección.                                                                               |
| [xrimagescanning](xrimagescanning.md)                   | Este evento se emite cuando se han cargado todas las imágenes de detección y se ha iniciado la exploración.                                            |
| [xrimagefound](xrimagefound.md)                         | Este evento se emite cuando se encuentra por primera vez un objetivo de imagen.                                                                        |
| [xrimageupdated](xrimageupdated.md)                     | Este evento se emite cuando un objetivo de imagen cambia de posición, rotación o escala.                                                               |
| [xrimagelost](xrimagelost.md)                           | Este evento se emite cuando un objetivo de imagen deja de ser rastreado.                                                                               |
| [xrmeshfound](xrmeshfound.md)                           | Este evento es emitido cuando una malla es encontrada por primera vez ya sea después del inicio o después de un recenter().         |
| [xrmeshupdated](xrmeshupdated.md)                       | Este evento se emite cuando la **primera** malla encontrada cambia de posición o rotación.                                                             |
| [xrmeshlost](xrmeshlost.md)                             | Este evento se emite cuando se llama a `recenter()`.                                                                                                   |
| [xrprojectwayspotscanning](xrprojectwayspotscanning.md) | Este evento se emite cuando todos los puntos de paso del proyecto se han cargado para su exploración.                                                  |
| [xrprojectwayspotfound](xrprojectwayspotfound.md)       | Este evento se emite cuando se encuentra por primera vez un Project Wayspot.                                                                           |
| [xrprojectwayspotupdated](xrprojectwayspotupdated.md)   | Este evento se emite cuando un Project Wayspot cambia de posición o rotación.                                                                          |
| [xrprojectwayspotlost](xrprojectwayspotlost.md)         | Este evento se emite cuando un Project Wayspot deja de ser rastreado.                                                                                  |
| [xrtrackingstatus](xrtrackingstatus.md)                 | Este evento se emite cuando [`XR8.XrController`](/legacy/api/xrcontroller) se inicia y en cualquier momento cambia el estado o motivo del seguimiento. |

## Eventos emitidos por `xrface` {#events-emitted-by-xrface}

| Evento emitido                                          | Descripción                                                                                                                                                                      |
| ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrfaceloading](xrfaceloading.md)                       | Este evento se emite cuando comienza la carga de recursos adicionales de Face AR.                                                                                |
| [xrfacescanning](xrfacescanning.md)                     | Este evento se emite cuando se han cargado los recursos AR y ha comenzado la exploración.                                                                        |
| [xrfacefound](xrfacefound.md)                           | Este evento se emite cuando se encuentra una cara por primera vez.                                                                                               |
| [xrfaceupdated](xrfaceupdated.md)                       | Este evento se emite cuando posteriormente se encuentra la cara.                                                                                                 |
| [xrfacelost](xrfacelost.md)                             | Este evento se emite cuando se deja de seguir una cara.                                                                                                          |
| [xrmouthopened](xrmouthopened.md)                       | Este evento se emite cuando se abre la boca de una cara rastreada.                                                                                               |
| [xrmouthclosed](xrmouthclosed.md)                       | Este evento se emite cuando se cierra la boca de una cara rastreada.                                                                                             |
| [xrlefteyeopened](xrlefteyeopened.md)                   | Este evento se emite cuando se abre el ojo izquierdo de una cara rastreada.                                                                                      |
| [xrlefteyeclosed](xrlefteyeclosed.md)                   | Este evento se emite cuando el ojo izquierdo de una cara rastreada se cierra.                                                                                    |
| [xrrighteyeopened](xrrighteyeopened.md)                 | Este evento se emite cuando se abre el ojo derecho de una cara rastreada.                                                                                        |
| [xrrighteyeclosed](xrrighteyeclosed.md)                 | Este evento se emite cuando el ojo derecho de una cara rastreada se cierra.                                                                                      |
| [xrlefteyebrowraised](xrlefteyebrowraised.md)           | Este evento se emite cuando la ceja izquierda de una cara rastreada se levanta de su posición inicial cuando se encontró la cara.                                |
| [xrlefteyebrowlowered](xrlefteyebrowlowered.md)         | Este evento se emite cuando la ceja izquierda de una cara rastreada se baja a su posición inicial cuando se encontró la cara.                                    |
| [xrrighteyebrowraised](xrrighteyebrowraised.md)         | Este evento se emite cuando la ceja derecha de una cara rastreada se levanta de su posición inicial cuando se encontró la cara.                                  |
| [xrrighteyebrowlowered](xrrighteyebrowlowered.md)       | Este evento se emite cuando la ceja derecha de una cara rastreada se baja a su posición inicial cuando se encontró la cara.                                      |
| [xrlefteyewinked](xrlefteyewinked.md)                   | Este evento se emite cuando el ojo izquierdo de un rostro rastreado se cierra y se abre en un plazo de 750 ms mientras que el ojo derecho permanece abierto.     |
| [xrrighteyewinked](xrrighteyewinked.md)                 | Este evento se emite cuando el ojo derecho de una cara rastreada se cierra y se abre en un intervalo de 750 ms, mientras que el ojo izquierdo permanece abierto. |
| [xrblinked](xrblinked.md)                               | Este evento se emite cuando los ojos de una cara rastreada parpadean.                                                                                            |
| [xrinterpupillarydistance](xrinterpupillarydistance.md) | Este evento se emite cuando se detecta por primera vez la distancia en milímetros entre los centros de cada pupila de una cara rastreada.                        |

## Eventos emitidos por `xrhand` {#events-emitted-by-xrhand}

| Evento emitido                      | Descripción                                                                                               |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------- |
| [xrhandloading](xrhandloading.md)   | Este evento se emite cuando comienza la carga de recursos manuales AR adicionales.        |
| [xrhandscanning](xrhandscanning.md) | Este evento se emite cuando se han cargado los recursos AR y ha comenzado la exploración. |
| [xrhandfound](xrhandfound.md)       | Este evento se emite cuando se encuentra una mano por primera vez.                        |
| [xrhandupdated](xrhandupdated.md)   | Este evento se emite cuando posteriormente se encuentra la mano.                          |
| [xrhandlost](xrhandlost.md)         | Este evento se emite cuando se deja de seguir una mano.                                   |
