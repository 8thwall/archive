# XR8

## Beschreibung {#description}

Einstiegspunkt für die Javascript-API von 8th Wall

## Funktionen {#functions}

| Funktion                                                      | Beschreibung                                                                                                                                                                                               |
| ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [addCameraPipelineModule](addcamerapipelinemodule.md)         | Fügt der Kamera-Pipeline ein Modul hinzu, das Ereignisrückrufe für jede Phase der Kamera-Pipeline empfängt.                                                                                                |
| [addCameraPipelineModules](addcamerapipelinemodules.md)       | Fügen Sie mehrere Kamera-Pipelinemodule hinzu. Dies ist eine praktische Methode, die [addCameraPipelineModule](addcamerapipelinemodule.md) nacheinander für jedes Element des Eingabe-Arrays aufruft.      |
| [clearCameraPipelineModules](clearcamerapipelinemodules.md)   | Entfernen Sie alle Kamera-Pipeline-Module aus der Kameraschleife.                                                                                                                                          |
| [initialisieren](initialize.md)                               | Gibt ein Versprechen zurück, das erfüllt wird, wenn die WebAssembly der AR Engine initialisiert wird.                                                                                                      |
| [isInitialized](isinitialized.md)                             | Zeigt an, ob die WebAssembly der AR Engine initialisiert ist oder nicht.                                                                                                                                   |
| [isPaused](ispaused.md)                                       | Zeigt an, ob die XR-Sitzung pausiert ist oder nicht.                                                                                                                                                       |
| [pause](pause.md)                                             | Pausieren Sie die aktuelle XR-Sitzung.  Während der Pause wird die Kamerafeed angehalten und die Bewegung des Geräts wird nicht verfolgt.                                                                  |
| [resume](resume.md)                                           | Setzen Sie die aktuelle XR-Sitzung fort.                                                                                                                                                                   |
| [removeCameraPipelineModule](removecamerapipelinemodule.md)   | Entfernt ein Modul aus der Kamera-Pipeline.                                                                                                                                                                |
| [removeCameraPipelineModules](removecamerapipelinemodules.md) | Entfernen Sie mehrere Kamera-Pipeline-Module. Dies ist eine praktische Methode, die [removeCameraPipelineModule](removecamerapipelinemodule.md) nacheinander für jedes Element des Eingabe-Arrays aufruft. |
| [requiredPermissions](requiredpermissions.md)                 | Gibt eine Liste der von der Anwendung benötigten Berechtigungen zurück.                                                                                                                                    |
| [laufen](run.md)                                              | Öffnen Sie die Kamera und starten Sie die Schleife zum Ausführen der Kamera.                                                                                                                               |
| [runPreRender](runprerender.md)                               | Führt alle Lebenszyklusaktualisierungen aus, die vor dem Rendern erfolgen sollen.                                                                                                                          |
| [runPostRender](runpostrender.md)                             | Führt alle Lebenszyklusaktualisierungen aus, die nach dem Rendern erfolgen sollen.                                                                                                                         |
| [stop](stop.md)                                               | Beendet die aktuelle XR-Sitzung.  Wenn die Kamera angehalten ist, ist die Kamerafeed geschlossen und die Bewegung des Geräts wird nicht verfolgt.                                                          |
| [version](version.md)                                         | Holen Sie sich die Version der 8th Wall Web Engine.                                                                                                                                                        |

## Ereignisse {#events}

| Ausgegebenes Ereignis | Beschreibung                                                |
| --------------------- | ----------------------------------------------------------- |
| xrloaded              | Dieses Ereignis wird ausgelöst, sobald `XR8` geladen wurde. |

## Module {#modules}

| Modul                                                          | Beschreibung                                                                                                                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [AFrame](../aframe/aframe.md)                                  | Einstiegspunkt für die Integration von A-Frame mit 8th Wall Web.                                                                                                    |
| [Babylonjs](../babylonjs/babylonjs.md)                         | Einstiegspunkt für die Integration von Babylon.js in 8th Wall Web.                                                                                                  |
| [CameraPixelArray](../camerapixelarray/camerapixelarray.md)    | Bietet ein Kamera-Pipeline-Modul, das den Zugriff auf Kameradaten als Graustufen- oder Farb-uint8-Array ermöglicht.                                                 |
| [CanvasScreenshot](../canvasscreenshot/canvasscreenshot.md)    | Stellt ein Kamera-Pipeline-Modul zur Verfügung, das Bildschirmfotos der aktuellen Szene erstellen kann.                                                             |
| [FaceController](../facecontroller/facecontroller.md)          | Bietet Gesichtserkennung und -vernetzung sowie Schnittstellen zur Konfiguration der Verfolgung.                                                                     |
| [GlTextureRenderer](../gltexturerenderer/gltexturerenderer.md) | Stellt ein Kamera-Pipeline-Modul bereit, das den Kamera-Feed auf eine Leinwand zeichnet, sowie zusätzliche Dienstprogramme für GL-Zeichenoperationen.               |
| [HandController](../handcontroller/handcontroller.md)          | Bietet Handerkennung und -verknüpfung sowie Schnittstellen zur Konfiguration der Verfolgung.                                                                        |
| [LayersController](../layerscontroller/layerscontroller.md)    | Stellt ein Kamera-Pipeline-Modul zur Verfügung, das die semantische Erkennung von Ebenen und Schnittstellen für die Konfiguration des Ebenen-Renderings ermöglicht. |
| [MediaRecorder](../mediarecorder/mediarecorder.md)             | Bietet ein Kamera-Pipeline-Modul, mit dem Sie ein Video im MP4-Format aufnehmen können.                                                                             |
| [PlayCanvas](../playcanvas/playcanvas.md)                      | Einstiegspunkt für die PlayCanvas-Integration mit 8th Wall Web.                                                                                                     |
| [Threejs](../threejs/threejs.md)                               | Stellt ein Kamera-Pipeline-Modul zur Verfügung, das die three.js-Kamera ansteuert, um virtuelle Overlays zu erstellen.                                              |
| [VPS](../vps/vps.md)                                           | Dienstprogramme, um mit Vps-Diensten zu sprechen.                                                                                                                   |
| [XrConfig](../xrconfig/xrconfig.md)                            | Angabe der Geräte- und Kameraklasse, auf der die Pipeline-Module laufen sollen.                                                                                     |
| [XrController](../xrcontroller/xrcontroller.md)                | `XrController` bietet 6DoF-Kamera-Tracking und Schnittstellen zur Konfiguration des Trackings.                                                                      |
| [XrDevice](../xrdevice/xrdevice.md)                            | Hier finden Sie Informationen zur Kompatibilität und zu den Eigenschaften der Geräte.                                                                               |
| [XrPermissions](../xrpermissions/xrpermissions.md)             | Hilfsprogramme zum Festlegen von Berechtigungen, die für ein Pipeline-Modul erforderlich sind.                                                                      |
