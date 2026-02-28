---
id: navigate-interface
sidebar_position: 4
---

# Navigieren in der Schnittstelle

Studio verfügt über eine reichhaltige Editoroberfläche, die aus einer Reihe von verschiedenen Werkzeugen und Ansichten besteht, von denen jede einzelne
für die Entwicklung Ihres Projekts unerlässlich ist.

In den folgenden Abschnitten werden die wichtigsten Elemente der Studio-Editor-Oberfläche vorgestellt, wobei die grundlegenden Funktionen
hervorgehoben werden.

![StudioInterface1](/images/studio/studio-navigate-interface.png)

![StudioInterface2](/images/studio/studio-navigate-editor.png)

## Hierarchie {#hierarchy}

Zeigen Sie die im Raum enthaltenen Entitäten und Objekte an, und ändern Sie ihre Verschachtelung. Sie können das Objekt reparieren oder
aufheben, indem Sie darauf klicken und es an eine andere Position in der Hierarchie ziehen. Klicken Sie mit der rechten Maustaste auf
, um Objekte zu duplizieren oder zu löschen. Fügen Sie neue Objekte zu Ihrem Raum hinzu. Suchen und filtern Sie nach verschiedenen Objekten.

![StudioHierarchy](/images/studio/studio-navigate-hierarchy.png)

## Vermögenswerte {#assets}

Dateien und Assets können über den unteren linken Bereich verwaltet werden.

![StudioAssets](/images/studio/studio-navigate-assets.png)

### Dateien {#files}

Laden Sie Ihre eigenen 3D-Modelle, 2D-Bilder, Audiodateien
, eigene Skripte und vieles mehr hoch. Erstellen Sie Ordner und ziehen Sie Dateien, um deren Platzierung neu zu organisieren. Sie können
auch ein Asset per Drag & Drop in das Ansichtsfenster oder die Hierarchie ziehen, um das Objekt in Ihre Szene einzufügen. Weitere Informationen über die Verwendung und Optimierung von 3D-Modulen im GLB/GLTF-Format finden Sie unter
[Ihre 3D-Modelle im
Web] (/legacy/guides/your-3d-models-on-the-web/).

### Vermögenslabor {#asset-lab}

Generieren Sie Bilder, 3D-Modelle, animierte und geriggte Charaktere mit Asset Lab und greifen Sie auf Ihre
Asset Lab-Bibliothek zu, um Assets einfach in Ihr Projekt zu importieren.
[Erfahren Sie mehr über Asset Lab](/studio/asset-lab/).

### Fertighäuser {#prefabs}

Erstellen Sie wiederverwendbare, anpassbare Spielvorlagen, die Ihre Entwicklung rationalisieren und skalieren.
[Erfahren Sie mehr über Fertighäuser](/studio/guides/prefabs/).

### Ziele {#targets}

Hochladen und Verwalten von Projekt-Bildzielen.
[Erfahren Sie mehr über Image Targets](/studio/guides/xr/image-targets/).

### Module {#modules}

8th Wall Module ist eine leistungsstarke 8th Wall Funktion, die die Effizienz der
Projektentwicklung drastisch erhöht. 8th Wall Module ermöglichen es Ihnen, Komponenten (Code, Assets, Dateien)
in Ihrem Arbeitsbereich zu speichern und wiederzuverwenden sowie von 8th Wall erstellte Module zu finden und in Ihr Projekt zu importieren.
[Erfahren Sie mehr über 8th Wall Modules](/studio/guides/modules/).

## Ansichtsfenster {#viewport}

Hinzufügen, Positionieren, Aktualisieren und Arbeiten mit Objekten und Beleuchtung im Raum. Verwenden Sie das untere perspektivische
Gizmo, um die Ansicht der Szene zu ändern, die Sichtbarkeit von Licht und Schatten zu ändern und von der orthografischen
zur perspektivischen Ansicht zu wechseln. Verwenden Sie die obere Symbolleiste, um die Position, die Drehung oder die Skalierung von
einem ausgewählten Objekt zu ändern oder um Bearbeitungen rückgängig zu machen und wiederherzustellen.

![StudioViewport](/images/studio/studio-navigate-viewport.png)

### Abkürzungen {#shortcuts}

| Funktion                      | Tastaturkürzel                                               |
| ----------------------------- | ------------------------------------------------------------ |
| Kamera-Umlaufbahn             | ⌥ Linksklick+Ziehen                                          |
| Kameraschwenk                 | ⌥ Rechtsklick+Ziehen, Rechtsklick+Ziehen, Mittelklick+Ziehen |
| Kamera-Zoom                   | Scrollrad                                                    |
| Fokus auf ausgewähltes Objekt | F                                                            |
| Übersetzen Sie                | W                                                            |
| Drehen Sie                    | E                                                            |
| Skala                         | R                                                            |
| UI-Ebene ausblenden/anzeigen  | ⌘\                                                          |
| Objekt löschen                | Löschen                                                      |
| Duplizieren Sie               | ⌘D                                                           |
| Objekt kopieren               | ⌘C                                                           |
| Objekt einfügen               | ⌘V                                                           |
| Rückgängig machen             | ⌘Z                                                           |
| Redo                          | ⌘⇧Z, ⌘Y                                                      |

## Simulator {#simulator}

Starten Sie den Simulator, um Ihre Szene abzuspielen. Sie können Änderungen an den Objekten in Ihrem Raum vornehmen und
sehen, dass diese sofort im Simulator angezeigt werden. Mit dem Simulator können Sie auch Projektänderungen in verschiedenen Geräteansichtsgrößen und
simulierten realen Umgebungen testen und anzeigen, ohne Studio verlassen zu müssen.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

![Simulator2](/images/studio/studio-navigate-simulator2.png)

Wenn Sie AR entwickeln, können Sie auf eine Sammlung von voraufgezeichneten Kamerasequenzen zugreifen.
Der AR-Simulator verfügt über eine Reihe von Wiedergabesteuerungen und Komfortfunktionen wie
:

- Abspielbalken, Scrubber und In/Out-Griffe: Ermöglicht das Einrichten von Loop-Punkten, so dass Sie eine granulare
  Kontrolle über die ausgewählte Sequenz erhalten.
- Schaltfläche "Zurücksetzen" (unten rechts): Setzt das Kamerabild wieder an seinen Ausgangspunkt zurück. HINWEIS: Bei jeder Schleife der Sequenz und bei jeder Auswahl einer neuen Sequenz wird auch
  aufgerufen.

## Symbolleiste starten {#launch-toolbar}

Studio speichert Ihren Fortschritt automatisch, während Sie an einem Projekt arbeiten. Wichtige Phasen der Entwicklung von
können jedoch markiert werden, indem Sie Ihr Projekt manuell erstellen, Ihre Änderungen als Commits speichern und Ihr Projekt unter
veröffentlichen.

![StudioLaunchToolbar](/images/studio/studio-navigate-launch-toolbar.png)

**Erstellen**: Klicken Sie auf Erstellen, um Ihre Arbeit zu speichern und einen neuen Cloud-Build Ihres Projekts zu starten.

**Landen oder synchronisieren**: Wenn Sie mit Ihren Änderungen zufrieden sind, legen Sie den aktualisierten Code in der integrierten Versionskontrolle von Studio
ab. Klicken Sie oben rechts im Studiofenster auf Land. Die Schaltfläche ist grün,
und zeigt an, dass es in Ihrem Projekt Änderungen gibt, die noch nicht in der Versionskontrolle gelandet sind.
"Sync" zeigt an, dass Ihr Projekt nicht auf dem neuesten Stand ist, was die letzten Änderungen in der Quellcodekontrolle
betrifft (Beispiel: ein anderes Teammitglied hat Projektänderungen in die Quellcodekontrolle eingespeist).

![StudioLand](/images/studio/studio-navigate-land.png)

**Veröffentlichen**: Der letzte Schritt ist die Veröffentlichung Ihres aktualisierten und gelandeten Projektcodes mit 8th Walls
Built-in Hosting. Öffentlich ermöglicht es, dass das Projekt von jedem im Internet eingesehen werden kann. Mit Staging
können Personen, die über einen Passcode verfügen, Ihr Projekt einsehen.

![StudioPublish](/images/studio/studio-navigate-publish.png)

Sobald Sie bereit sind, Ihr Projekt zu veröffentlichen, benötigen Sie eine Beschreibung und ein Titelbild. Unter
erfahren Sie mehr darüber, wie Sie ein Projekt für die Öffentlichkeit zugänglich machen können, und zwar unter
[Veröffentlichen Sie Ihr Projekt](/studio/getting-started/publish).

## Einstellungen & Inspektor {#settings-inspector}

Sie können objektspezifische Komponenten anzeigen und konfigurieren sowie allgemeine Einstellungen für den Editor vornehmen.

### Raumeinstellungen {#space-settings}

Wenn **keine Entität** ausgewählt ist, sehen Sie allgemeine Einstellungen für Ihr Projekt.

![StudioGeneralSettings](/images/studio/studio-navigate-general-settings.png)

#### Standardeinstellungen {#default-settings}

Gestalte deinen Raum mit Einstellungen wie Skybox und Nebel. Skyboxes sind ein Wrapper um Ihre gesamte Szene, der zeigt, wie die Welt
über Ihre Geometrie hinaus aussieht. Wenn Ihr Projekt für die Verwendung von AR auf einem AR-kompatiblen Gerät konfiguriert ist,
(siehe [XR](/studio/guides/xr/world/)), wird die Skybox nicht gerendert.

#### Projekteinstellungen {#project-settings}

Wenn Sie mehrere Räume haben, wählen Sie aus, welcher der Eingangsraum sein soll.

Verwenden Sie den Eingabe-Manager, um Erlebnisse einzurichten, die über verschiedene Geräteeingaben wie
Tastaturen, Gamepad-Steuerungen, Trackpads und Touchscreen-Aktionen funktionieren. Erstellen Sie Ihre Ereignisaktion und richten Sie unter
eine Zuordnung (oder Bindung) zu verschiedenen Eingängen ein. [Erfahren Sie mehr über das Eingabesystem](/studio/guides/input)

#### Projektversion {#project-version}

Studio-Projekte können unter einer bestimmten Laufzeitversion laufen, die hier ausgewählt werden kann. Legen Sie Ihr Projekt auf eine feste Laufzeit fest, um es vorhersehbar zu machen, oder entscheiden Sie sich für automatische kleinere Updates und Fehlerbehebungen, um immer auf dem neuesten Stand zu bleiben.

#### Quellenkontrolle {#source-control}

Verwalten Sie verschiedene Versionen Ihres Projekts und den Änderungsverlauf. Durch das Erstellen eines neuen Mandanten wird eine neue
Version Ihres Projekts erstellt, die für das Testen von Änderungen hilfreich sein kann, ohne die Hauptversion
zu beeinflussen. Sie können auch auf eine Historie der früheren Änderungen des Projekts zugreifen, indem Sie die Funktion
Projekthistorie wählen.

#### Code-Editor {#code-editor}

Wählen Sie aus verschiedenen Einstellungen für die Benutzerfreundlichkeit, wie z. B. Hell-/Dunkelmodus, Tastenkombinationen und Codespeichereinstellungen.

### Inspektor {#inspector}

Prüfen und konfigurieren Sie eine Entität und ihre Komponenten. Erfahren Sie mehr über Entitäten und Komponenten in [Übersicht](/studio/essentials/overview/).

Standardmäßig zeigt jedes Objekt eine Transform-Komponente im Inspektor an. Verschiedene Arten von Objekten
können verschiedene Komponenten anzeigen, z.B. zeigt ein Primitiv eine Mesh-Komponente mit
konfigurierbaren Optionen wie Geometrieformeinstellungen, Materialien, Texturen, etc.

#### Komponenten {#components}

Sie können eine Komponente über die Schaltfläche "+ Neue Komponente" hinzufügen. Es gibt mehrere Arten von integrierten
Komponenten in Studio, einschließlich Physik, Beleuchtung, Audio, Animationen und mehr. Benutzerdefinierte Komponenten
können ebenfalls hinzugefügt werden - [Erfahren Sie mehr über benutzerdefinierte Komponenten](/studio/essentials/custom-components/). Einmal eingerichtet, erscheint Ihre benutzerdefinierte Komponentein der Kategorie Benutzerdefiniert. Klicken Sie auf die drei Punkte, um eine Komponente zu entfernen.

![StudioNewComponent](/images/studio/studio-navigate-components.png)

## Geräte & Konsole {#devices--console}

### Gerät verbinden {#connect-device}

:::tip
Durch das Testen Ihres Projekts auf mehreren Geräten wird sichergestellt, dass die Benutzer auf
eine konsistente Erfahrung mit einer Vielzahl von Bildschirmgrößen und Plattformen haben.
:::

Zeigen Sie Ihre Projekte sofort in einer Vorschau auf dem Handy, dem Desktop, dem Headset oder in einem anderen Browserfenster an, während Sie
per Link/QR-Code entwickeln.

![SimulatorPreview](/images/studio/studio-navigate-preview-links.png)

- Klicken Sie unten im Studio-Interfact auf die Schaltfläche Gerät verbinden.
- Scannen Sie den QR-Code mit Ihrem mobilen Gerät, um einen Webbrowser zu öffnen und Ihr Projekt zu testen.
  Oder klicken Sie auf den QR-Code, um eine neue Registerkarte in Ihrem Desktop-Browser zu öffnen.
- Wenn die Seite geladen wird und Ihr Projekt WebAR verwendet, werden Sie aufgefordert, auf die Bewegungs- und
  Orientierungssensoren (bei einigen Geräten) und die Kamera (bei allen Geräten) zuzugreifen. Klicken Sie auf Zulassen für alle Berechtigungsaufforderungen
  . Sie werden auf die URL für die private Entwicklung des Projekts weitergeleitet.
- Hinweis: Der "Preview"-QR-Code ist ein temporärer, einmalig verwendbarer QR-Code
  , der nur für die Verwendung durch den Entwickler während der aktiven Entwicklung in Studio gedacht ist. Dieser QR-Code führt Sie zu
  , einer privaten Entwicklungs-URL, die für andere nicht zugänglich ist. Um Ihre Arbeit mit anderen zu teilen,
  , lesen Sie bitte den Abschnitt unten über die Veröffentlichung Ihres Projekts.
- Klicken Sie auf das Headset-Symbol, um einen Link für ein Headset-Gerät zu erstellen.

### Konsole {#console}

Debuggen Sie die Build-Aktionen und die Laufzeit Ihres Projekts. Der Debug-Modus ist eine erweiterte Studio-Funktion, die
Protokollierung, Leistungsinformationen und erweiterte Visualisierungen direkt auf Ihrem Gerät bietet.

![StudioConsole](/images/studio/studio-navigate-console.png)

## Code-Editor {#code-editor-1}

Der 8th Wall Code Editor gibt Entwicklern eine Reihe von Codierungswerkzeugen an die Hand, mit denen sie webbasierte XR-Inhalte erstellen, zusammenarbeiten und
veröffentlichen können. Unsere leistungsstarke IDE umfasst einen Code-Editor, eine integrierte Versionskontrolle, einen
Commit-Verlauf, eine Live-Vorschau, drahtloses Remote-Debugging und Push-Button-Hosting in einem globalen CDN.
Weitere Funktionen des Code-Editors sind:

- Intellisense
- Befehlspalette
- Code Peek
- Hell/Dunkel-Themen

![StudioEditor](/images/studio/studio-navigate-editor.png)
