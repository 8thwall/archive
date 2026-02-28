---
id: generate-models
sidebar_position: 2
---

# 3D-Modelle generieren

Um ein 3D-Modell (Format "glb") zu erzeugen, müssen Sie zunächst ein Bild oder mehrere Bilder erzeugen, die als Eingabe dienen. 3D-Modelle werden entweder aus einem Einzelbild oder einem Satz von Bildern mit mehreren Ansichten erstellt.

Dieses Verfahren eignet sich am besten für einzelne Motive wie Objekte oder Gebäude, nicht für ganze Szenen.

## Schritt 1: Bildeingaben generieren

Wählen Sie zunächst über das Dropdown-Menü ein Modell aus.

![](/images/studio/asset-lab/model-model.png)

Jedes Modell hat unterschiedliche Stärken und einen unterschiedlichen Kreditpreis pro Anfrage (angezeigt in der Schaltfläche "Generieren" am unteren Rand). Die vollständige Preisliste finden Sie im Dokument über die Kreditpreise.

Je nachdem, welches Modell Sie für die Erstellung eines Bildes wählen, haben Sie unterschiedliche Eingabemöglichkeiten. Weitere Einzelheiten zu den verfügbaren Modellen und Eingaben finden Sie unter Arbeitsablauf der Bilderzeugung.

Verwenden Sie die Umschaltfunktion, um entweder ein einzelnes Bild (am besten für einfache symmetrische Objekte) oder die Vorderansicht in einem Mehrbildsatz (am besten für komplexere oder asymmetrische Objekte) zu erzeugen.

Wenn Sie Einzelansicht wählen, erzeugen Sie ein Bild des Objekts in einer ¾-Ansicht.

![](/images/studio/asset-lab/model-single.png)

Wenn Sie Multi-View wählen, erzeugen Sie zunächst eine Ansicht der "Vorderseite" Ihres Objekts. Wenn Sie mit dem Ergebnis zufrieden sind, können Sie anschließend die Ansichten "rechts", "links" und "hinten" desselben Objekts über die Schaltfläche "Mehrfachansicht erzeugen" generieren. Für diesen Schritt ist die Verwendung von GPT-image-1 erforderlich.

![](/images/studio/asset-lab/model-multi.png)

Wenn Sie mit Ihren Bildeingaben zufrieden sind, können Sie unten rechts auf die Schaltfläche "An 3D-Modell senden" klicken, um zum nächsten Schritt zu gelangen.

## Schritt 2: 3D-Modell generieren

Wählen Sie das gewünschte Modell und passen Sie die Parameter nach Bedarf an.

### Unterstützte Modelle

**Trellis**\
Großes Modell von Microsoft für hochwertige texturierte Meshes.\
Eingänge:  
Eingänge:

- Bilder in einer oder mehreren Ansichten
- Formvorgabe (0-10)
- Detail Anleitung (1-10)
- Maschenvereinfachung (0.9-0.98)
- Texturgröße: 512x512 oder 1024x1024

**Hunyuan 3D-2**\
Tencents hochauflösender Asset-Generator.\
Eingänge:  
Eingänge:

- Bilder in einer oder mehreren Ansichten
- Geschwindigkeit (Standard oder Turbo)
- Orientierungshilfe (0-20)
- Form Detail (1-1024)

**Hunyuan 3D-2 Mini**\
Die ressourcenärmere Variante des Hunyuan 3D-2.\
Eingänge:  
Eingänge:

- Nur einzelne Bilder
- Geschwindigkeit (Standard oder Turbo)
- Orientierungshilfe (0-20)
- Form Detail (1-1024)

Jedes Modell hat unterschiedliche Stärken und auch einen unterschiedlichen Kreditpreis pro Anfrage (angezeigt in der Schaltfläche "Generieren" am unteren Rand). Die vollständige Preisliste finden Sie im Dokument über die Kreditpreise.

Wählen Sie die Schaltfläche "Generieren", um zu beginnen.

![](/images/studio/asset-lab/model-generate.png)

## Schritt 3: In das Projekt importieren oder herunterladen

Verwenden Sie die Schaltflächen am unteren Rand, um Ihr 3D-Modell zu importieren oder herunterzuladen.

![](/images/studio/asset-lab/model-import.png)

Sie können auf alle Assets, die von Benutzern in Ihrem Arbeitsbereich erstellt wurden, über die Bibliothek zugreifen, die auf der linken Registerkarte des Vollbild-Asset-Labs oder auf der linken Registerkarte im Studio zu finden ist. Verwenden Sie die Filteroption, um nur 3D-Modelle anzuzeigen.

![](/images/studio/asset-lab/model-library.png)

![](/images/studio/asset-lab/model-library2.png)

