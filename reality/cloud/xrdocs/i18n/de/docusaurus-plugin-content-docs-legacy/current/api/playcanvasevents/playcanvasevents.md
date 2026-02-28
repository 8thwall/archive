# PlayCanvas-Ereignisse

Dieser Abschnitt beschreibt die Ereignisse, die von 8th Wall in einer PlayCanvas-Umgebung ausgelöst werden.

Sie können auf diese Ereignisse in Ihrer Webanwendung warten.

## Ereignisse Emittiert {#events-emitted}

| Emittiertes Ereignis                                             | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:camerastatuschange](xrcamerastatuschange.md) | Dieses Ereignis wird ausgelöst, wenn sich der Status der Kamera ändert. Siehe [`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) von [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) für weitere Informationen über den möglichen Status.                                                                                                                                                                       |
| [xr:realityerror](xrrealityerror.md)             | Dieses Ereignis wird ausgelöst, wenn bei der Initialisierung von 8th Wall Web ein Fehler aufgetreten ist. Dies ist der empfohlene Zeitpunkt, zu dem eventuelle Fehlermeldungen angezeigt werden sollten. Die [XR8.XrDevice()API] (/legacy/api/xrdevice) kann dabei helfen, die Art der Fehlermeldung zu bestimmen, die angezeigt werden soll. |
| [xr:realityready](xrrealityready.md)             | Dieses Ereignis wird ausgelöst, wenn 8th Wall Web initialisiert wurde und mindestens ein Frame erfolgreich verarbeitet wurde. Dies ist der empfohlene Zeitpunkt, zu dem alle Ladeelemente ausgeblendet werden sollten.                                                                                                                                                                                                                                                  |
| [xr:screenshoterror](xrscreenshoterror.md)       | Dieses Ereignis wird als Reaktion auf die [`Screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) ausgegeben, die zu einem Fehler führt.                                                                                                                                                                                                                                                                                                                              |
| [xr:screenshotready](xrscreenshotready.md)       | Dieses Ereignis wird als Reaktion auf die erfolgreiche Beendigung des Ereignisses [`Screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) ausgegeben. Das JPEG-komprimierte Bild der AFrame-Leinwand wird zur Verfügung gestellt.                                                                                                                                                                                                                     |

## XR8.XrController Ausgelöste Ereignisse {#xrcontroller-events-emitted}

Wenn `XR8.XrController.pipelineModule()` hinzugefügt wird, indem es in `extraModules` an `XR8.PlayCanvas.run()` übergeben wird, werden diese Ereignisse ausgelöst:

| Emittiertes Ereignis                                                     | Beschreibung                                                                                                                                                      |
| ------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:imageloading](playcanvas-image-target-events.md)     | Dieses Ereignis wird ausgelöst, wenn das Laden des Erkennungsbildes beginnt.                                                                      |
| [xr:imagescanning](playcanvas-image-target-events.md)    | Dieses Ereignis wird ausgelöst, wenn alle Erkennungsbilder geladen wurden und der Scanvorgang begonnen hat.                                       |
| [xr:imagefound](playcanvas-image-target-events.md)       | Dieses Ereignis wird ausgelöst, wenn ein Bildziel zum ersten Mal gefunden wird.                                                                   |
| [xr:imageupdated](playcanvas-image-target-events.md)     | Dieses Ereignis wird ausgelöst, wenn ein Bildziel seine Position, Drehung oder Skalierung ändert.                                                 |
| [xr:imagelost](playcanvas-image-target-events.md)        | Dieses Ereignis wird ausgelöst, wenn ein Bildziel nicht mehr verfolgt wird.                                                                       |
| [xr:meshfound](xrmeshfound.md)                           | Dieses Ereignis wird ausgelöst, wenn ein Mesh zum ersten Mal entweder nach dem Start oder nach einem recenter() gefunden wird. |
| [xr:meshupdated](xrmeshupdated.md)                       | Dieses Ereignis wird ausgelöst, wenn das **erste** gefundene Netz seine Position oder Drehung ändert.                                             |
| [xr:meshlost](xrmeshlost.md)                             | Dieses Ereignis wird ausgelöst, wenn "recenter()" aufgerufen wird.                                                             |
| [xr:projectwayspotscanning](xrprojectwayspotscanning.md) | Dieses Ereignis wird ausgelöst, wenn alle Projektstandorte zum Scannen geladen wurden.                                                            |
| [xr:projectwayspotfound](xrprojectwayspotfound.md)       | Dieses Ereignis wird ausgelöst, wenn ein Projektstandort zum ersten Mal gefunden wird.                                                            |
| [xr:projectwayspotupdated](xrprojectwayspotupdated.md)   | Dieses Ereignis wird ausgelöst, wenn ein Projektstandort seine Position oder Drehung ändert.                                                      |
| [xr:projectwayspotlost](xrprojectwayspotlost.md)         | Dieses Ereignis wird ausgelöst, wenn ein Projektstandort nicht mehr verfolgt wird.                                                                |

## XR8.LayersController Ausgelöste Ereignisse {#layerscontroller-events-emitted}

Wenn `XR8.LayersController.pipelineModule()` hinzugefügt wird, indem es in `extraModules` an `XR8.PlayCanvas.run()` übergeben wird, werden diese Ereignisse ausgelöst:

| Emittiertes Ereignis                                   | Beschreibung                                                                                                                                                                                |
| ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xr:layerloading](xrlayerloading.md)   | Wird ausgelöst, wenn der Ladevorgang für zusätzliche Ebenensegmentierungsressourcen beginnt.                                                                                |
| [xr:layerscanning](xrlayerscanning.md) | Wird ausgelöst, wenn alle Ebenensegmentierungsressourcen geladen wurden und der Scanvorgang begonnen hat. Pro gescannter Ebene wird ein Ereignis ausgelöst. |
| [xr:layerfound](xrlayerfound.md)       | Wird ausgelöst, wenn eine Ebene zum ersten Mal gefunden wird.                                                                                                               |

## XR8.FaceController-Ereignisse, die ausgegeben werden {#facecontroller-events-emitted}

Wenn `XR8.FaceController.pipelineModule()` hinzugefügt wird, indem es in `extraModules` an `XR8.PlayCanvas.run()` übergeben wird, werden diese Ereignisse ausgelöst:

| Emittiertes Ereignis                                                 | Beschreibung                                                                                                  |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [xr:faceloading](playcanvas-face-effects-events.md)  | Wird ausgelöst, wenn der Ladevorgang für zusätzliche Face-AR-Ressourcen beginnt.              |
| [xr:facescanning](playcanvas-face-effects-events.md) | Wird ausgelöst, wenn alle Face-AR-Ressourcen geladen wurden und der Scanvorgang begonnen hat. |
| [xr:facefound](playcanvas-face-effects-events.md)    | Wird ausgelöst, wenn ein Gesicht zum ersten Mal gefunden wird.                                |
| [xr:faceupdated](playcanvas-face-effects-events.md)  | Wird ausgelöst, wenn anschließend ein Gesicht gefunden wird.                                  |
| [xr:facelost](playcanvas-face-effects-events.md)     | Wird ausgelöst, wenn ein Gesicht nicht mehr verfolgt wird.                                    |

## XR8.HandController Ausgelöste Ereignisse {#handcontroller-events-emitted}

Wenn `XR8.HandController.pipelineModule()` hinzugefügt wird, indem es in `extraModules` an `XR8.PlayCanvas.run()` übergeben wird, werden diese Ereignisse ausgelöst:

| Emittiertes Ereignis                                                  | Beschreibung                                                                                                  |
| --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| [xr:handloading](playcanvas-hand-tracking-events.md)  | Wird ausgelöst, wenn der Ladevorgang für zusätzliche Hand-AR-Ressourcen beginnt.              |
| [xr:handscanning](playcanvas-hand-tracking-events.md) | Wird ausgelöst, wenn alle Hand-AR-Ressourcen geladen wurden und der Scanvorgang begonnen hat. |
| [xr:handfound](playcanvas-hand-tracking-events.md)    | Wird ausgelöst, wenn eine Hand zum ersten Mal gefunden wird.                                  |
| [xr:handupdated](playcanvas-hand-tracking-events.md)  | Wird ausgelöst, wenn anschließend eine Hand gefunden wird.                                    |
| [xr:handlost](playcanvas-hand-tracking-events.md)     | Wird ausgelöst, wenn eine Hand nicht mehr verfolgt wird.                                      |
