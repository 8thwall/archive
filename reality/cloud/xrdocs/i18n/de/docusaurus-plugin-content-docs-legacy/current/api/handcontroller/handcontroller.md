# XR8.HandController

## Beschreibung {#description}

HandController" ermöglicht die Erkennung und Vernetzung von Händen und bietet Schnittstellen zur Konfiguration der Verfolgung.

- HandController" und "XrController" können nicht gleichzeitig verwendet werden.
- HandController" und "LayersController" können nicht gleichzeitig verwendet werden.
- HandController" und "FaceController" können nicht gleichzeitig verwendet werden.

## Funktionen {#functions}

| Funktion                                | Beschreibung                                                                                                                                                                                                                                                                             |
| --------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [configure](configure.md)               | Legt fest, welche Verarbeitung von HandController durchgeführt wird.                                                                                                                                                                                                     |
| [pipelineModule](pipelinemodule.md)     | Erstellt ein Kamera-Pipeline-Modul, das, wenn es installiert ist, Rückrufe empfängt, wenn die Kamera gestartet wurde, Ereignisse zur Kameraprozessierung und andere Zustandsänderungen. Diese werden verwendet, um die Position der Kamera zu berechnen. |
| [AttachmentPoints](attachmentpoints.md) | Punkte auf der Hand, an denen Sie Inhalte verankern können.                                                                                                                                                                                                              |
