# XR8.XrController

## Voraussetzungen

Die aktive Kamera muss eine Welt-AR-Kamera sein, und der Chunk "Slam" muss geladen sein. Diese Funktion ist standardmäßig aktiviert.

## Beschreibung {#description}

XrController" bietet 6DoF-Kameraverfolgung und Schnittstellen zur Konfiguration der Verfolgung.

## Funktionen {#functions}

| Funktion                                                        | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                          |
| --------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)                                       | Legt fest, welche Verarbeitung von `XrController` durchgeführt wird (kann Auswirkungen auf die Leistung haben).                                                                                                                                                                                                                                                                    |
| [hitTest](hittest.md)                                           | Schätzen Sie die 3D-Position eines Punktes auf dem Kamerabild.                                                                                                                                                                                                                                                                                                                                        |
| [pipelineModule](pipelinemodule.md)                             | Erstellt ein Kamera-Pipeline-Modul, das, wenn es installiert ist, Rückrufe empfängt, wenn die Kamera gestartet wurde, Ereignisse zur Kameraprozessierung und andere Zustandsänderungen. Diese werden verwendet, um die Position der Kamera zu berechnen.                                                                                                                              |
| [recenter](recenter.md)                                         | Positioniert die Kamera in die durch updateCameraProjectionMatrix angegebene Richtung und startet die Verfolgung neu.                                                                                                                                                                                                                                                                                 |
| [updateCameraProjectionMatrix](updatecameraprojectionmatrix.md) | Setzen Sie die Anzeigegeometrie der Szene und die Startposition der Kamera in der Szene zurück. Die Anzeigegeometrie wird benötigt, um die Position von Objekten in der virtuellen Szene ordnungsgemäß mit der entsprechenden Position im Kamerabild zu überlagern. Die Startposition gibt an, wo die Kamera zu Beginn einer Sitzung platziert und ausgerichtet wird. |
