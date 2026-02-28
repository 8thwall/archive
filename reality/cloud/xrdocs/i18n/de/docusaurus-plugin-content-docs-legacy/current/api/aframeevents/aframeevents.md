# AFrame-Ereignisse

Dieser Abschnitt beschreibt Ereignisse, die von den A-Frame-Komponenten `xrweb`, `xrface` und `xrhand` ausgegeben werden.

Sie können auf diese Ereignisse in Ihrer Webanwendung warten, um eine Funktion aufzurufen, die das Ereignis verarbeitet.

## Ereignisse, die von "xrconfig" ausgegeben werden {#events-emitted}

Die folgenden Ereignisse werden von `xrconfig` ausgelöst (das automatisch hinzugefügt wird, wenn Sie nur `xrweb`, `xrface`, `xrhand` oder `xrlayers` verwenden):

| Emittiertes Ereignis                        | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [camerastatuschange](camerastatuschange.md) | Dieses Ereignis wird ausgelöst, wenn sich der Status der Kamera ändert. Siehe [`onCameraStatusChange`](/legacy/api/camerapipelinemodule/oncamerastatuschange) von [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) für weitere Informationen über den möglichen Status.                                                                                                                                                                       |
| [realityerror](realityerror.md)             | Dieses Ereignis wird ausgelöst, wenn bei der Initialisierung von 8th Wall Web ein Fehler aufgetreten ist. Dies ist der empfohlene Zeitpunkt, zu dem eventuelle Fehlermeldungen angezeigt werden sollten. Die [XR8.XrDevice()API] (/legacy/api/xrdevice) kann dabei helfen, die Art der Fehlermeldung zu bestimmen, die angezeigt werden soll. |
| [realityready](realityready.md)             | Dieses Ereignis wird ausgelöst, wenn 8th Wall Web initialisiert wurde und mindestens ein Frame erfolgreich verarbeitet wurde. Dies ist der empfohlene Zeitpunkt, zu dem alle Ladeelemente ausgeblendet werden sollten.                                                                                                                                                                                                                                                  |
| [screenshoterror](screenshoterror.md)       | Dieses Ereignis wird als Reaktion auf das Ereignis [`Screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest), das zu einem Fehler führt, ausgelöst.                                                                                                                                                                                                                                                                                                                     |
| [screenshotready](screenshotready.md)       | Dieses Ereignis wird als Reaktion auf die erfolgreiche Beendigung des Ereignisses [`Screenshotrequest`](/legacy/api/aframeeventlisenters/screenshotrequest) ausgelöst. Das JPEG-komprimierte Bild der AFrame-Leinwand wird zur Verfügung gestellt.                                                                                                                                                                                                                      |

## Ereignisse, die von "xrweb" ausgegeben werden {#events-emitted-by-xrweb}

| Emittiertes Ereignis                                    | Beschreibung                                                                                                                                                              |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrimageloading](xrimageloading.md)                     | Dieses Ereignis wird ausgelöst, wenn das Laden des Erkennungsbildes beginnt.                                                                              |
| [xrimagescanning](xrimagescanning.md)                   | Dieses Ereignis wird ausgelöst, wenn alle Erkennungsbilder geladen wurden und der Scanvorgang begonnen hat.                                               |
| [xrimagefound](xrimagefound.md)                         | Dieses Ereignis wird ausgelöst, wenn ein Bildziel zum ersten Mal gefunden wird.                                                                           |
| [xrimageupdated](xrimageupdated.md)                     | Dieses Ereignis wird ausgelöst, wenn ein Bildziel seine Position, Drehung oder Skalierung ändert.                                                         |
| [xrimagelost](xrimagelost.md)                           | Dieses Ereignis wird ausgelöst, wenn ein Bildziel nicht mehr verfolgt wird.                                                                               |
| [xrmeshfound](xrmeshfound.md)                           | Dieses Ereignis wird ausgelöst, wenn ein Mesh zum ersten Mal entweder nach dem Start oder nach einem recenter() gefunden wird.         |
| [xrmeshupdated](xrmeshupdated.md)                       | Dieses Ereignis wird ausgelöst, wenn das **erste** gefundene Netz seine Position oder Drehung ändert.                                                     |
| [xrmeshlost](xrmeshlost.md)                             | Dieses Ereignis wird ausgelöst, wenn "recenter()" aufgerufen wird.                                                                     |
| [xrprojectwayspotscanning](xrprojectwayspotscanning.md) | Dieses Ereignis wird ausgelöst, wenn alle Projekt-Wayspots zum Scannen geladen worden sind.                                                               |
| [xrprojectwayspotfound](xrprojectwayspotfound.md)       | Dieses Ereignis wird ausgelöst, wenn ein Project Wayspot zum ersten Mal gefunden wird.                                                                    |
| [xrprojectwayspotupdated](xrprojectwayspotupdated.md)   | Dieses Ereignis wird ausgelöst, wenn ein Project Wayspot seine Position oder Drehung ändert.                                                              |
| [xrprojectwayspotlost](xrprojectwayspotlost.md)         | Dieses Ereignis wird ausgelöst, wenn ein Project Wayspot nicht mehr verfolgt wird.                                                                        |
| [xrtrackingstatus](xrtrackingstatus.md)                 | Dieses Ereignis wird ausgelöst, wenn [`XR8.XrController`](/legacy/api/xrcontroller) startet und sich der Status oder der Grund der Zeitverfolgung ändert. |

## Ereignisse, die von "xrface" ausgesendet werden {#events-emitted-by-xrface}

| Emittiertes Ereignis                                    | Beschreibung                                                                                                                                                                             |
| ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrfaceloading](xrfaceloading.md)                       | Dieses Ereignis wird ausgelöst, wenn der Ladevorgang für zusätzliche Face AR-Ressourcen beginnt.                                                                         |
| [xrfacescanning](xrfacescanning.md)                     | Dieses Ereignis wird ausgelöst, wenn die AR-Ressourcen geladen wurden und das Scannen begonnen hat.                                                                      |
| [xrfacefound](xrfacefound.md)                           | Dieses Ereignis wird ausgelöst, wenn ein Gesicht zum ersten Mal gefunden wird.                                                                                           |
| [xrfaceupdated](xrfaceupdated.md)                       | Dieses Ereignis wird ausgelöst, wenn das Gesicht anschließend gefunden wird.                                                                                             |
| [xrfacelost](xrfacelost.md)                             | Dieses Ereignis wird ausgelöst, wenn ein Gesicht nicht mehr verfolgt wird.                                                                                               |
| [xrmouthopened](xrmouthopened.md)                       | Dieses Ereignis wird ausgelöst, wenn sich der Mund eines verfolgten Gesichts öffnet.                                                                                     |
| [xrmouthclosed](xrmouthclosed.md)                       | Dieses Ereignis wird ausgelöst, wenn sich der Mund eines verfolgten Gesichts schließt.                                                                                   |
| [xrlefteyeopened](xrlefteyeopened.md)                   | Dieses Ereignis wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts öffnet.                                                                               |
| [xrlefteyeclosed](xrlefteyeclosed.md)                   | Dieses Ereignis wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts schließt.                                                                             |
| [xrrighteyeopened](xrrighteyeopened.md)                 | Dieses Ereignis wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts öffnet.                                                                              |
| [xrrighteyeclosed](xrrighteyeclosed.md)                 | Dieses Ereignis wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts schließt.                                                                            |
| [xrlefteyebrowraised](xrlefteyebrowraised.md)           | Dieses Ereignis wird ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts aus ihrer Ausgangsposition angehoben wird, als das Gesicht gefunden wurde.           |
| [xrlefteyebrowlowered](xrlefteyebrowlowered.md)         | Dieses Ereignis wird ausgelöst, wenn die linke Augenbraue eines verfolgten Gesichts in ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.         |
| [xrrighteyebrowraised](xrrighteyebrowraised.md)         | Dieses Ereignis wird ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts aus ihrer Ausgangsposition angehoben wird, als das Gesicht gefunden wurde.          |
| [xrrighteyebrowlowered](xrrighteyebrowlowered.md)       | Dieses Ereignis wird ausgelöst, wenn die rechte Augenbraue eines verfolgten Gesichts in ihre ursprüngliche Position gesenkt wird, als das Gesicht gefunden wurde.        |
| [xrlefteyewinked](xrlefteyewinked.md)                   | Dieses Ereignis wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das rechte Auge geöffnet bleibt.    |
| [xrrighteyewinked](xrrighteyewinked.md)                 | Dieses Ereignis wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das linke Auge geöffnet bleibt.    |
| [xrblinked](xrblinked.md)                               | Dieses Ereignis wird ausgelöst, wenn die Augen eines verfolgten Gesichts blinzeln.                                                                                       |
| [xrinterpupillarydistance](xrinterpupillarydistance.md) | Dieses Ereignis wird ausgelöst, wenn der Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen eines verfolgten Gesichts zum ersten Mal erkannt wird. |

## Ereignisse, die von "xrhand" ausgesendet werden {#events-emitted-by-xrhand}

| Emittiertes Ereignis                | Beschreibung                                                                                                        |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [xrhandloading](xrhandloading.md)   | Dieses Ereignis wird ausgelöst, wenn der Ladevorgang für zusätzliche Hand-AR-Ressourcen beginnt.    |
| [xrhandscanning](xrhandscanning.md) | Dieses Ereignis wird ausgelöst, wenn die AR-Ressourcen geladen wurden und das Scannen begonnen hat. |
| [xrhandfound](xrhandfound.md)       | Dieses Ereignis wird ausgelöst, wenn eine Hand zum ersten Mal gefunden wird.                        |
| [xrhandupdated](xrhandupdated.md)   | Dieses Ereignis wird ausgelöst, wenn die Hand später gefunden wird.                                 |
| [xrhandlost](xrhandlost.md)         | Dieses Ereignis wird ausgelöst, wenn eine Hand nicht mehr verfolgt wird.                            |
