# AFrame-Ereignisse

Dieser Abschnitt beschreibt Ereignisse, die von den A-Frame-Komponenten `xrweb`, `xrface` und `xrhand` ausgegeben werden.

Sie können in Ihrer Webanwendung auf diese Ereignisse warten, um eine Funktion aufzurufen, die das Ereignis behandelt.

## Ereignisse, die von [`ausgegeben werden xrconfig`](/api/aframe/#configuring-the-camera) {#events-emitted}

Die folgenden Ereignisse werden von `xrconfig` (das automatisch hinzugefügt wird, wenn Sie nur `xrweb`, `xrface`, `xrhand` oder `xrlayers` verwenden) ausgelöst:

| Ausgegebenes Ereignis                         | Beschreibung                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [camerastatuschange](camerastatuschange.md)   | Dieses Ereignis wird ausgelöst, wenn sich der Status der Kamera ändert. Siehe [`onCameraStatusChange`](/api/camerapipelinemodule/oncamerastatuschange) von [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) für weitere Informationen über den möglichen Status.                                                       |
| [realityerror](realityerror.md)               | Dieses Ereignis wird ausgelöst, wenn bei der Initialisierung von 8th Wall Web ein Fehler aufgetreten ist. Dies ist die empfohlene Zeit, zu der eventuelle Fehlermeldungen angezeigt werden sollten. Die [`XR8.XrDevice()` API](/api/xrdevice) kann Ihnen dabei helfen, die Art der Fehlermeldung zu bestimmen, die angezeigt werden soll. |
| [realityready](realityready.md)               | Dieses Ereignis wird ausgelöst, wenn 8th Wall Web initialisiert wurde und mindestens ein Frame erfolgreich verarbeitet wurde. Dies ist der empfohlene Zeitpunkt, zu dem alle Ladeelemente ausgeblendet werden sollten.                                                                                                                    |
| [bildschirmfehlermeldung](screenshoterror.md) | Dieses Ereignis wird als Reaktion auf das Ereignis [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) ausgegeben, das zu einem Fehler führt.                                                                                                                                                                              |
| [screenshotready](screenshotready.md)         | Dieses Ereignis wird als Reaktion auf die erfolgreiche Beendigung des Ereignisses [`screenshotrequest`](/api/aframeeventlisenters/screenshotrequest) ausgelöst. Das JPEG-komprimierte Bild der AFrame Leinwand wird zur Verfügung gestellt.                                                                                               |

## Ereignisse, die von [`xrweb ausgegeben werden`](/api/aframe/#world-tracking-image-targets-andor-lightship-vps) {#events-emitted-by-xrweb}

| Ausgegebenes Ereignis                                   | Beschreibung                                                                                                                                              |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [xrimageloading](xrimageloading.md)                     | Dieses Ereignis wird ausgelöst, wenn das Laden des Erkennungsbildes beginnt.                                                                              |
| [xrimagescanning](xrimagescanning.md)                   | Dieses Ereignis wird ausgelöst, wenn alle Erkennungsbilder geladen wurden und der Scanvorgang begonnen hat.                                               |
| [xrimagefound](xrimagefound.md)                         | Dieses Ereignis wird ausgelöst, wenn ein Bildziel zum ersten Mal gefunden wird.                                                                           |
| [xrimageupdated](xrimageupdated.md)                     | Dieses Ereignis wird ausgelöst, wenn ein Bildziel seine Position, Drehung oder Skalierung ändert.                                                         |
| [xrimagelost](xrimagelost.md)                           | Dieses Ereignis wird ausgelöst, wenn ein Bildziel nicht mehr verfolgt wird.                                                                               |
| [xrmeshfound](xrmeshfound.md)                           | Dieses Ereignis wird ausgelöst, wenn ein Netz zum ersten Mal gefunden wird, entweder nach dem Start oder nach einem recenter().                           |
| [xrmeshupdated](xrmeshupdated.md)                       | Dieses Ereignis wird ausgelöst, wenn das erste gefundene Netz **** seine Position oder Drehung ändert.                                                    |
| [xrmeshlost](xrmeshlost.md)                             | Dieses Ereignis wird ausgelöst, wenn `recenter()` aufgerufen wird.                                                                                        |
| [xrprojectwayspotscanning](xrprojectwayspotscanning.md) | Dieses Ereignis wird ausgelöst, wenn alle Projekt-Wayspots zum Scannen geladen wurden.                                                                    |
| [xrprojectwayspotfound](xrprojectwayspotfound.md)       | Dieses Ereignis wird ausgelöst, wenn ein Projekt-Wayspot zum ersten Mal gefunden wird.                                                                    |
| [xrprojectwayspotupdated](xrprojectwayspotupdated.md)   | Dieses Ereignis wird ausgelöst, wenn ein Projekt-Wayspot seine Position oder Drehung ändert.                                                              |
| [xrprojectwayspotlost](xrprojectwayspotlost.md)         | Dieses Ereignis wird ausgelöst, wenn ein Projekt-Wayspot nicht mehr verfolgt wird.                                                                        |
| [xrtrackingstatus](xrtrackingstatus.md)                 | Dieses Ereignis wird ausgelöst, wenn [`XR8.XrController`](/api/xrcontroller) gestartet wird und sich der Status oder der Grund der Zeitverfolgung ändert. |

## Von [`emittierte Ereignisse xrface`](/api/aframe/#face-effects) {#events-emitted-by-xrface}

| Ausgegebenes Ereignis                                   | Beschreibung                                                                                                                                                             |
| ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [xrfaceloading](xrfaceloading.md)                       | Dieses Ereignis wird ausgelöst, wenn der Ladevorgang für zusätzliche Gesichtseffekt-AR-Ressourcen beginnt.                                                               |
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
| [xrlefteyewinked](xrlefteyewinked.md)                   | Dieses Ereignis wird ausgelöst, wenn sich das linke Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das rechte Auge offen bleibt.       |
| [xrrighteyewinked](xrrighteyewinked.md)                 | Dieses Ereignis wird ausgelöst, wenn sich das rechte Auge eines verfolgten Gesichts innerhalb von 750 ms schließt und öffnet, während das linke Auge offen bleibt.       |
| [xrblinked](xrblinked.md)                               | Dieses Ereignis wird ausgelöst, wenn die Augen eines verfolgten Gesichts blinzeln.                                                                                       |
| [xrinterpupillarydistance](xrinterpupillarydistance.md) | Dieses Ereignis wird ausgelöst, wenn der Abstand in Millimetern zwischen den Mittelpunkten der einzelnen Pupillen eines verfolgten Gesichts zum ersten Mal erkannt wird. |

## Von [`emittierte Ereignisse xrhand`](/api/aframe/#hand-tracking) {#events-emitted-by-xrhand}

| Ausgegebenes Ereignis               | Beschreibung                                                                                        |
| ----------------------------------- | --------------------------------------------------------------------------------------------------- |
| [xrhandloading](xrhandloading.md)   | Dieses Ereignis wird ausgelöst, wenn der Ladevorgang für zusätzliche Hand-AR-Ressourcen beginnt.    |
| [xrhandscanning](xrhandscanning.md) | Dieses Ereignis wird ausgelöst, wenn die AR-Ressourcen geladen wurden und das Scannen begonnen hat. |
| [xrhandfound](xrhandfound.md)       | Dieses Ereignis wird ausgelöst, wenn eine Hand zum ersten Mal gefunden wird.                        |
| [xrhandupdated](xrhandupdated.md)   | Dieses Ereignis wird ausgelöst, wenn die Hand später gefunden wird.                                 |
| [xrhandlost](xrhandlost.md)         | Dieses Ereignis wird ausgelöst, wenn eine Hand nicht mehr verfolgt wird.                            |
