---
slug: '/'
sidebar_label: API-Einführung
sidebar_position: 1
description: Dieser Abschnitt bietet einen detaillierten Einblick in die APIs, die für die Erstellung immersiver WebAR-Erlebnisse mit 8th Wall Studio verfügbar sind.
---

# API-Einführung

Dieser Abschnitt bietet einen detaillierten Einblick in die APIs, die für die Erstellung immersiver WebAR-Erlebnisse mit 8th Wall Studio verfügbar sind.

Die 8th Wall API-Referenz ist in zwei Hauptgruppen unterteilt:

## Studio-API

Die Studio-API bietet alles, was Sie für die Erstellung strukturierter, dynamischer Erlebnisse in Studio benötigen.

Die Studio-API umfasst:

- [**Entity-Component System (ECS)**](/api/studio/ecs) - APIs für die Arbeit mit der ECS-Architektur von Studio, mit denen Sie Entitäten und Komponenten zur Laufzeit erstellen, ändern und organisieren können.
- [**World**](/api/studio/world) - Kernfunktionen und Dienstprogramme für die Verwaltung des gesamten Szenengraphen, einschließlich Entitätshierarchien, Transformationen und Räume. Die Welt ist der Container für alle Räume, Entitäten, Abfragen und Beobachter in Ihrem Projekt.
- [**Events**](/api/studio/events) - Ein umfangreiches System zum Senden und Reagieren auf Laufzeitereignisse in Studio.

Verwenden Sie die Studio-API, um immersive, zustandsabhängige Erlebnisse zu erstellen, die auf Spielereingaben, Weltveränderungen und Echtzeitinteraktionen reagieren.

[Erkunden Sie die Studio-API →](/api/studio)

## Motor-API

Die Engine-API ermöglicht den Zugriff auf die zugrunde liegende AR-Engine von 8th Wall auf niedrigerer Ebene:

- **8th Wall Camera Pipeline Modules** - Kamera-Pipeline-Module, entwickelt von 8th Wall.
- **Benutzerdefinierte Kamera-Pipeline-Module** - Schnittstelle für die Arbeit mit der Kamera-Bildverarbeitungs-Pipeline.

Verwenden Sie die Engine-API, wenn Sie eine fein abgestufte Steuerung der Kameraeingabe und der Bildverarbeitung benötigen oder wenn Sie benutzerdefinierte WebGL- oder Computer-Vision-Workflows in Ihr Projekt integrieren möchten.

[Erkunden Sie die Motor-API →](/api/engine)

---

## Die Auswahl der richtigen API

- **Building in 8th Wall Studio?** → Beginnen Sie mit der **Studio API**, um in der strukturierten Entwicklungsumgebung von Studio zu arbeiten.

- **Auf der Engine-Ebene arbeiten oder Funktionalität erweitern?** → Eintauchen in die **Engine-API** für den Kamerazugriff und Low-Level-AR-Funktionen.

:::note
**Studio-Erfahrungen können benutzerdefinierte Kamera-Pipeline-Module für eine erweiterte Steuerung verwenden, aber die Studio-API und die Engine-API dienen unterschiedlichen Zwecken: Studio kümmert sich um den Aufbau der Welt und die Interaktion, während Engine die Low-Level-Kamera und die Bildverarbeitung verwaltet.**
:::
