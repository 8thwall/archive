# XR8.FaceController

## Beschreibung {#description}

`FaceController` bietet Gesichtserkennung und -verknüpfung sowie Schnittstellen zur Konfiguration der Verfolgung.

## Funktionen {#functions}

| Funktion                                | Beschreibung                                                                                                                                                                                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)               | Legt fest, welche Verarbeitung von FaceController durchgeführt wird.                                                                                                                                                                               |
| [pipelineModule](pipelinemodule.md)     | Erstellt ein Kamera-Pipelinemodul, das nach der Installierung Rückrufe empfängt, wenn die Kamera gestartet wurde, Ereignisse der Kameraprozessierung und andere Statusänderungen. Diese werden verwendet, um die Position der Kamera zu berechnen. |
| [AttachmentPoints](attachmentpoints.md) | Punkte auf dem Gesicht, an denen Sie Inhalte verankern können.                                                                                                                                                                                     |
| [MeshGeometry](meshgeometry.md)         | Optionen, um festzulegen, für welche Teile der Fläche Mesh-Dreiecke zurückgegeben werden sollen.                                                                                                                                                   |
