---
id: your-3d-models-on-the-web
---

# Ihre 3D-Modelle im Internet

Wir empfehlen die Verwendung von 3D-Modellen im GLB-Format (glTF 2.0 binary) für alle WebAR-Erlebnisse. GLB ist
derzeit das beste Format für WebAR mit seiner geringen Dateigröße, großartigen Leistung und vielseitiger
Funktionsunterstützung (PBR, Animationen, etc.).

## Konvertierung von Modellen in das GLB-Format {#converting-models-to-glb}

Vergewissern Sie sich vor dem Export, dass:

- Der Drehpunkt befindet sich an der Basis des Modells (wenn es am Boden befestigt werden soll).
- Der Vorwärtsvektor des Objekts liegt entlang der Z-Achse (wenn man davon ausgeht, dass es nach vorne zeigt)

Wenn Ihr Modell als glTF exportiert wurde, ziehen Sie den glTF-Ordner in
[gltf.report](https://gltf.report) und klicken Sie auf _Export_, um es in eine GLB zu konvertieren.

Wenn Ihr Modell nicht in glTF/GLB aus einer 3D-Modellierungssoftware exportiert werden kann, importieren Sie es in Blender und
exportieren Sie es als gLTF oder verwenden Sie einen Konverter.

**Online-Konverter**: [Creators3D](https://www.creators3d.com/online-viewer), [Boxshot](https://boxshot.com/facebook-3d-converter/)

**Native Konverter**: [Maya2glTF](https://github.com/iimachines/Maya2glTF), [3DS Max](https://doc.babylonjs.com/features/featuresDeepDive/Exporters/3DSMax)

Eine vollständige Liste der Konverter finden Sie unter <https://github.com/khronosgroup/gltf#gltf-tools>.

Es ist eine gute Idee, das Modell im [glTF Viewer](https://gltf-viewer.donmccurdy.com/) zu betrachten, bevor
es in ein 8th Wall Projekt importiert. Auf diese Weise können Sie eventuelle Probleme mit Ihrem Modell erkennen, bevor Sie es
zu einem 8th Wall-Projekt hinzufügen.

Stellen Sie nach dem Import in ein 8th Wall-Projekt sicher, dass:

- Die Skala erscheint korrekt bei (1, 1, 1). Wenn die Skala um einen erheblichen Betrag abweicht (z. B. 0,0001 oder
  10000\), ändern Sie die Skala nicht im Code. Ändern Sie sie stattdessen in Ihrer Modellierungssoftware und importieren Sie sie erneut unter
  . Wenn Sie die Skalierung im Code erheblich ändern, kann dies zu Problemen mit dem Modell führen.
- Die Materialien erscheinen korrekt. Wenn Ihr Modell über reflektierende Materialien verfügt, können diese schwarz erscheinen, es sei denn,
  gibt etwas zu reflektieren. Siehe das
  [reflections sample project](https://www.8thwall.com/8thwall/cubemap-aframe) und/oder das
  [glass sample project](https://www.8thwall.com/playground/glass-materials-aframe)

Weitere Informationen über bewährte Verfahren für 3D-Modelle finden Sie im Abschnitt [GLB-Optimierung] (#glb-optimization).

Bitte lesen Sie auch den Blogbeitrag [5 Tipps für Entwickler, um jedes 8th Wall WebAR-Projekt realistischer zu gestalten] (https://www.8thwall.com/blog/post/41447089034/5-tips-for-developers-to-make-any-8th-wall-webar-project-more-realistic).

### Konvertierung von FBX in GLB {#converting-fbx-to-glb}

Die folgende Anleitung erklärt, wie Sie das von Facebook entwickelte [FBX2glTF CLI-Konvertierungstool] (https://github.com/facebookincubator/FBX2glTF) lokal auf Ihrem Mac installieren und ausführen. Dieses Tool ist bei weitem das zuverlässigste Tool, das wir bei 8th Wall bisher für die Konvertierung von FBX in GLB verwendet haben, und wir haben es bis heute für alle unsere First-Party-Inhalte eingesetzt.

**FBX2glTF auf dem Mac installieren**

1. Diese Datei herunterladen: https://github.com/facebookincubator/FBX2glTF/releases/download/v0.9.7/FBX2glTF-darwin-x64
2. Terminal öffnen
3. Navigieren Sie zum Ordner "Downloads": `cd ~/Downloads`
4. Machen Sie die Datei ausführbar: `chmod +x FBX2glTF-darwin-x64`
5. Wenn Sie eine Warnung über die heruntergeladene Datei sehen, klicken Sie einfach auf "Abbrechen".

![macos-warning-1](/images/macos-download-warning-fbx2gltf-1.jpg)

6. Öffnen Sie `Systemeinstellungen` -> `Sicherheit & Datenschutz`, klicken Sie auf das `Schloss`-Symbol und geben Sie dann Ihr `macOS-Passwort` ein.

![macos-security-and-privacy](/images/macos-security-and-privacy.jpg)

7. Klicken Sie auf "Trotzdem zulassen".
8. Schließen Sie die Systemeinstellungen.
9. Zurück zum Terminal-Fenster
10. Führen Sie den vorherigen Befehl erneut aus (durch Drücken des Pfeils nach oben wird der vorherige Befehl wiederhergestellt): `chmod +x FBX2glTF-darwin-x64`
11. Es wird eine aktualisierte Warnung angezeigt, klicken Sie auf "Öffnen":

![macos-warning-2](/images/macos-download-warning-fbx2gltf-2.jpg)

12. An diesem Punkt sollten Sie in der Lage sein, das FBX2glTF

**Kopieren Sie FBX2glTF in ein Systemverzeichnis (optional)**

Um die Ausführung des FBX2glTF-Konverters zu erleichtern, kopieren Sie ihn in das Verzeichnis /usr/local/bin. Damit entfällt die Notwendigkeit, jedes Mal zum Ordner Downloads zu navigieren, um den Befehl auszuführen.

1. Führen Sie im Ordner "Downloads" den Befehl "sudo cp ./FBX2glTF-darwin-x64 /usr/local/bin" aus.
2. Das System wird Sie wahrscheinlich nach Ihrem macOS-Kennwort fragen. Tippen Sie es ein und drücken Sie "Enter".
3. Da `/usr/local/bin` standardmäßig in Ihrem PATH sein sollte, können Sie nun einfach
   `FBX2glTF-darwin-x64` aus jedem Verzeichnis ausführen.

**Ausführen von FBX2glTF auf dem Mac**

1. Navigieren Sie im Terminal zu dem Ordner, in dem sich Ihre fbx-Dateien befinden. Hier sind einige hilfreiche
   Befehle zum Durchsuchen von Verzeichnissen über die Kommandozeile unter macOS:

- `pwd` gibt das aktuelle Verzeichnis des Terminals aus.
- `ls` listet den Inhalt des aktuellen Verzeichnisses auf.
- `cd` wechselt das Verzeichnis und nimmt entweder einen relativen (z.B. `cd ~/Downloads`) oder absoluten Pfad (z.B. `cd /var/tmp`)

2. Führen Sie das Programm `FBX2glTF-darwin-x64` aus und geben Sie Parameter für Eingabe- (-i) und Ausgabedateien (-o) an.

#### FBX2glTF Beispiel {#fbx2gltf-example}

```bash
FBX2glTF-darwin-x64 -i yourfile.fbx -o newfile.glb
```

3. Das obige Beispiel konvertiert "yourfile.fbx" in eine neue GLB-Datei namens "newfile.glb".
4. Ziehen Sie die neu erstellte GLB-Datei per Drag & Drop auf https://gltf-viewer.donmccurdy.com/, um zu überprüfen, ob sie
   korrekt funktioniert.
5. Für die erweiterte Konfiguration der glb-Konvertierung stehen die folgenden Befehle zur Verfügung:
   https://github.com/facebookincubator/FBX2glTF#cli-switches

**FBX2glTF Batch-Konvertierung**

Wenn Sie mehrere FBX-Dateien im selben Verzeichnis haben, können Sie sie alle auf einmal konvertieren

1. Navigieren Sie im Terminal zu dem Ordner, der mehrere FBX-Dateien enthält
2. Führen Sie den folgenden Befehl aus:

#### FBX2glTF Batch-Konvertierung Beispiel {#fbx2gltf-batch-conversion-example}

```bash
ls *.fbx | xargs -n1 -I {} FBX2glTF-darwin-x64 -i {} -o {}.glb
```

3. Dies sollte glb-Versionen von jeder fbx-Datei erzeugen, die Sie im aktuellen Ordner haben!

## GLB-Optimierung {#glb-optimization}

Die Optimierung von Assets ist ein entscheidender Schritt bei der Erstellung zauberhafter WebAR-Inhalte. Große Assets können zu
Problemen wie unendlichem Laden, schwarzen Texturen und Abstürzen führen.

### Texturoptimierung {#texture-optimization}

Texturen tragen in der Regel am meisten zu großen Dateigrößen bei, daher ist es eine gute Idee, diese
zuerst zu optimieren.

Für beste Ergebnisse empfehlen wir, Texturen mit einer Größe von 1024x1024 oder kleiner zu verwenden. Die Texturgrößen sollten immer auf
als Zweierpotenz eingestellt werden (512x512, 1024x1024, usw.).

Dies kann mit Ihrem bevorzugten Bildbearbeitungs- und/oder 3D-Modellierungsprogramm durchgeführt werden; wenn Sie jedoch
bereits ein bestehendes GLB-Modell haben, ist eine schnelle und einfache Möglichkeit, die Größe der Texturen innerhalb des 3D-Modells
zu ändern, die Verwendung von [gltf.report](https://gltf.report)

- Ziehen Sie Ihr 3D-Modell auf die Seite.  Stellen Sie in der linken Spalte die maximal gewünschte Texturgröße ein (1).
- Klicken Sie auf Play (2), um das Skript auszuführen. Die Konsole (unten links) zeigt den Status des Vorgangs an.
- Laden Sie Ihr modifiziertes GLB-Modell herunter, indem Sie auf Export (3) klicken.

![gltf-report](/images/gltf-report.jpg)

### Komprimierung {#compression}

Durch Komprimierung kann die Dateigröße erheblich reduziert werden. Die Draco-Kompression ist die beliebteste Kompressionsmethode
und kann in den Blender-Exporteinstellungen oder nach dem Export in
[gltf.report](https://gltf.report) konfiguriert werden.

Das Laden komprimierter Modelle in Ihr Projekt erfordert eine zusätzliche Konfiguration. Weitere Informationen finden Sie in
[A-Frame-Beispielprojekt] (https://www.8thwall.com/playground/draco-compression) oder
[three.js-Beispielprojekt] (https://www.8thwall.com/playground/draco-threejs).

### Geometrie-Optimierung {#geometry-optimization}

Zur weiteren Optimierung sollten Sie das Modell dezimieren, um die Anzahl der Polygone zu reduzieren.

Wenden Sie in Blender den Modifikator _Decimate_ auf das Modell an und reduzieren Sie die Einstellung _Ratio_ auf einen Wert unter 1.

Wählen Sie in den Exporteinstellungen _Modifikatoren anwenden_.

### Optimierungs-Tutorial {#optimization-tutorial}

```mdx-code-block
<iframe width="560" height="315" src="https://www.youtube.com/embed/1ToEPOHN1no" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

```
