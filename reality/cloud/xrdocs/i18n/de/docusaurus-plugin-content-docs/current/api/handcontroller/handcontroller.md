# XR8.HandController

## Beschreibung {#description}

`HandController` bietet Handerkennung und -verknüpfung sowie Schnittstellen zur Konfiguration der Verfolgung.

- `HandController` und `XrController` können nicht gleichzeitig verwendet werden.
- `HandController` und `LayersController` können nicht gleichzeitig verwendet werden.
- `HandController` und `FaceController` können nicht gleichzeitig verwendet werden.

## Funktionen {#functions}

| Funktion                                | Beschreibung                                                                                                                                                                                                                                       |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)               | Legt fest, welche Verarbeitung von HandController durchgeführt wird.                                                                                                                                                                               |
| [pipelineModule](pipelinemodule.md)     | Erstellt ein Kamera-Pipelinemodul, das nach der Installierung Rückrufe empfängt, wenn die Kamera gestartet wurde, Ereignisse der Kameraprozessierung und andere Statusänderungen. Diese werden verwendet, um die Position der Kamera zu berechnen. |
| [AttachmentPoints](attachmentpoints.md) | Punkte auf der Hand, an denen Sie Inhalte verankern können.                                                                                                                                                                                        |
