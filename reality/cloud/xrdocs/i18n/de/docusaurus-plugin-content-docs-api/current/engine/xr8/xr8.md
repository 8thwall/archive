# XR8

## Beschreibung {#description}

Einstiegspunkt für die Javascript-API von 8th Wall

## Funktionen {#functions}

| Funktion                                                      | Beschreibung                                                                                                                                                                                                                           |
| ------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [addCameraPipelineModule](addcamerapipelinemodule.md)         | Fügt der Kamera-Pipeline ein Modul hinzu, das Ereignisrückrufe für jede Phase der Kamera-Pipeline empfängt.                                                                                                            |
| [addCameraPipelineModules](addcamerapipelinemodules.md)       | Fügen Sie mehrere Kamera-Pipelinemodule hinzu. Dies ist eine bequeme Methode, die [addCameraPipelineModule](addcamerapipelinemodule.md) nacheinander für jedes Element des Eingabe-Arrays aufruft.     |
| [clearCameraPipelineModules](clearcamerapipelinemodules.md)   | Entfernen Sie alle Kamera-Pipelinemodule aus der Kameraschleife.                                                                                                                                                       |
| [initialisieren](initialize.md)                               | Gibt ein Versprechen zurück, das erfüllt wird, wenn die WebAssembly der AR Engine initialisiert wird.                                                                                                                  |
| [isInitialized](isinitialized.md)                             | Zeigt an, ob die WebAssembly der AR Engine initialisiert ist oder nicht.                                                                                                                                               |
| [isPaused](ispaused.md)                                       | Zeigt an, ob die XR-Sitzung unterbrochen ist oder nicht.                                                                                                                                                               |
| [pause](pause.md)                                             | Unterbrechen Sie die aktuelle XR-Sitzung.  Im angehaltenen Zustand wird die Kameraübertragung gestoppt und die Bewegung des Geräts wird nicht verfolgt.                                                |
| [resume](resume.md)                                           | Fortsetzen der aktuellen XR-Sitzung.                                                                                                                                                                                   |
| [removeCameraPipelineModule](removecamerapipelinemodule.md)   | Entfernt ein Modul aus der Kamera-Pipeline.                                                                                                                                                                            |
| [removeCameraPipelineModules](removecamerapipelinemodules.md) | Entfernen Sie mehrere Kamera-Pipelinemodule. Dies ist eine bequeme Methode, die [removeCameraPipelineModule](removecamerapipelinemodule.md) nacheinander für jedes Element des Eingabe-Arrays aufruft. |
| [requiredPermissions](requiredpermissions.md)                 | Gibt eine Liste der von der Anwendung benötigten Berechtigungen zurück.                                                                                                                                                |
| laufen.                                       | Öffnen Sie die Kamera und starten Sie die Kameraablaufschleife.                                                                                                                                                        |
| [runPreRender](runprerender.md)                               | Führt alle Lebenszyklusaktualisierungen aus, die vor dem Rendern erfolgen sollen.                                                                                                                                      |
| [runPostRender](runpostrender.md)                             | Führt alle Lebenszyklusaktualisierungen aus, die nach dem Rendering erfolgen sollen.                                                                                                                                   |
| [stop](stop.md)                                               | Beendet die aktuelle XR-Sitzung.  Im angehaltenen Zustand ist die Kameraübertragung geschlossen und die Bewegung des Geräts wird nicht verfolgt.                                                       |
| [Version](version.md)                                         | Holen Sie sich die 8. Version der Wall-Web-Engine.                                                                                                                                                     |

## Veranstaltungen {#events}

| Emittiertes Ereignis | Beschreibung                                                              |
| -------------------- | ------------------------------------------------------------------------- |
| xrloaded             | Dieses Ereignis wird ausgelöst, sobald "XR8" geladen ist. |

<!-- ## Modules {#modules}

Module | Description
-------- | -----------
[CameraPixelArray](../camerapixelarray/camerapixelarray.md) | Provides a camera pipeline module that gives access to camera data as a grayscale or color uint8 array.
[CanvasScreenshot](../canvasscreenshot/canvasscreenshot.md) | Provides a camera pipeline module that can generate screenshots of the current scene.
[Vps](../vps/vps.md) | Utilities to talk to Vps services.
[XrDevice](../xrdevice/xrdevice.md) | Provides information about device compatibility and characteristics.
[XrPermissions](../xrpermissions/xrpermissions.md) | Utilities for specifying permissions required by a pipeline module. -->
