---
id: generate-characters
sidebar_position: 3
---

# Animierte Charaktere generieren

Asset Lab unterstützt derzeit das Rigging und die Animation von **humanoiden, zweibeinigen** 3D-Charaktermodellen.

Um ein geriggtes und animiertes Charaktermodell zu generieren, müssen Sie zunächst ein 3D-Charaktermodell in einer T-Position aus mehreren Bildern generieren, die als Eingabe dienen.

## Schritt 1: Bildeingaben generieren

Es wird benötigt, um GPT-Bild 1 zur Erzeugung von Bildeingaben für Animierte Zeichen zu verwenden.  Siehe [Bilder generieren](/studio/asset-lab/generate-models) für weitere Details.

Verwenden Sie **GPT-Image-1**, um Zeichenbilder mit mehreren Ansichten in einer T-Position zu erzeugen:

1. Vorderansicht
2. Rechts-, Links- und Rückansicht

Klicken Sie dann auf **Senden an 3D-Modell**.

![](/images/studio/asset-lab/character-input.png)

## Schritt 2: 3D-Modell generieren

Wählen Sie ein unterstütztes 3D-Generationsmodell aus. Siehe [3D-Modelle generieren](/studio/asset-lab/generate-models) für weitere Details.

Wählen Sie die Schaltfläche Erzeugen, um den Antrag zu bearbeiten.

![](/images/studio/asset-lab/character-generation.png)

Wenn Sie fertig sind, klicken Sie auf **Zur Animation senden**.

## Schritt 3: Einrichten und Animieren

Unterstützt derzeit Rigging über **Meshy**. Die Eingabe muss ein zweibeiniger Humanoid mit klar definierten Gliedmaßen sein.

Gibt die folgenden Animationsclips zurück:

- Spaziergang
- ausführen.
- Leerlauf
- Springen
- Angriff
- Tod
- Zombie Walk
- Tanz

Klicken Sie auf **Rig + Animate**, um den Vorgang zu starten (kann bis zu 2 Minuten dauern).

![](/images/studio/asset-lab/character-animation.png)

## Schritt 4: In das Projekt importieren

Verwenden Sie die Schaltflächen zum Importieren oder Herunterladen, um Ihr manipuliertes Modell zu speichern.

![](/images/studio/asset-lab/character-import.png)

Filtern Sie in der Bibliothek nach **Animated Characters**, um sie zu finden.

![](/images/studio/asset-lab/character-library.png)

![](/images/studio/asset-lab/character-library2.png)
