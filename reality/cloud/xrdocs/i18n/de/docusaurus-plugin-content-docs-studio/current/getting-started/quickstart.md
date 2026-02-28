---
id: quickstart
sidebar_position: 2
---

# Schnellstart

## Erstellen eines Studio-Projekts {#creating-a-studio-project}

1. Um mit einem Studio-Projekt zu beginnen, klicken Sie auf die Schaltfläche **"Neues Projekt starten "** auf der Seite Arbeitsbereich.

![StartNewProject](/images/console-workspace-start-project.jpg)

2. Wenn sich Ihr Arbeitsbereich auf einem "Profi-Plan" befindet, müssen Sie einen Projekttyp auswählen. Wählen Sie **Studio**:

![StartNewProject](/images/studio/new-project-studio.png)

3. **Wählen Sie eine Vorlage**: Wenn Sie das neue Projekt öffnen, werden Ihnen einige Projektvorlagen (
   ) angezeigt, die Ihnen den Einstieg erleichtern, darunter spielorientierte und AR-orientierte Vorlagen. Diese
   Projektvorlagen zeigen verschiedene Funktionalitäten und können durch den Austausch Ihrer
   eigenen Assets leicht verändert werden. Erstellen Sie ein Projekt unter Verwendung einer der verfügbaren Vorlagen oder erstellen Sie ein Projekt aus der Vorlage Empty
   .

![StudioTemplatePicker](/images/studio/studio-template-picker.png)

Wenn Ihr Projekt alles geladen hat, was Sie brauchen, um zu beginnen, können Sie mit der Erstellung beginnen.

## Navigieren auf der Schnittstelle {#navigating-the-interface}

:::warning
**Beschränken Sie Ihr Projekt auf eine einzige Browser-Registerkarte.** Wenn mehrere Registerkarten desselben Projekts gleichzeitig geöffnet sind, kann dies zu
unerwarteten Problemen während des Erstellungsprozesses führen. Um mögliche Probleme zu vermeiden, stellen Sie sicher, dass jeweils nur eine Registerkarte Ihres Projekts aktiv ist
.
:::

Studio verfügt über eine reichhaltige Editoroberfläche, die aus einer Reihe von verschiedenen Werkzeugen und Ansichten besteht, von denen jede einzelne
für die Entwicklung Ihres Projekts unerlässlich ist.

In den folgenden Abschnitten werden die wichtigsten Elemente der Studio-Editor-Oberfläche vorgestellt, wobei die grundlegenden Funktionen
hervorgehoben werden.

![StudioSchnittstelle1](/images/studio/studio-navigate-interface.png)

![StudioInterface2](/images/studio/studio-navigate-editor.png)

### Hierarchie {#hierarchy}

Zeigen Sie die im Raum enthaltenen Entitäten und Objekte an, und ändern Sie ihre Verschachtelung. Sie können das Objekt reparieren oder
aufheben, indem Sie darauf klicken und es an eine andere Position in der Hierarchie ziehen. Klicken Sie mit der rechten Maustaste auf
, um Objekte zu duplizieren oder zu löschen. Fügen Sie neue Objekte zu Ihrem Raum hinzu. Suchen und filtern Sie nach verschiedenen Objekten.

![StudioHierarchie](/images/studio/studio-navigate-hierarchy.png)

### Vermögenswerte {#assets}

Dateien und Assets können über den unteren linken Bereich verwaltet werden. Laden Sie Ihre eigenen 3D-Modelle, 2D-Bilder, Audio-Dateien
, benutzerdefinierte Skripte und vieles mehr hoch. Erstellen Sie Ordner und ziehen Sie Dateien, um deren Platzierung neu zu organisieren. Sie können
auch ein Asset per Drag & Drop in das Ansichtsfenster oder die Hierarchie ziehen, um das Objekt in Ihre Szene einzufügen. Weitere Informationen über die Verwendung und Optimierung von 3D-Modulen im GLB/GLTF-Format finden Sie unter
[Ihre 3D-Modelle im
Web](https://www.8thwall.com/docs/guides/your-3d-models-on-the-web/).

![StudioAssets](/images/studio/studio-navigate-assets.png)

### Ansichtsfenster {#viewport}

Hinzufügen, Positionieren, Aktualisieren und Arbeiten mit Objekten und Beleuchtung im Raum. Verwenden Sie das untere perspektivische
Gizmo, um die Ansicht der Szene zu ändern, die Beleuchtung und die Schattensichtbarkeit zu ändern und von der orthografischen
zur perspektivischen Ansicht zu wechseln. Verwenden Sie die obere Symbolleiste, um die Position, die Drehung oder die Skalierung von
einem ausgewählten Objekt zu ändern oder um Bearbeitungen rückgängig zu machen und wiederherzustellen.

![StudioViewport](/images/studio/studio-navigate-viewport.png)

#### Ansichtsfenster Navigationskurzbefehle {#viewport-navigation-shortcuts}

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

### Simulator & Vorschau Links {#simulator--preview-links}

#### Simulator {#simulator}

Wenn Sie Ihre Szene abspielen wollen, wird eine Simulator-Instanz verbunden. Ihr Ansichtsfenster wird
die Wiedergabe im Simulator widerspiegeln. Sie können gespawnte oder prozedurale Objekte sehen, die
bei der Wiedergabe in der Raumhierarchie passieren. Sie können Änderungen an den Objekten in Ihrem Bereich vornehmen und
sehen, dass diese sofort in der Client-Ansicht angezeigt werden. Wenn Sie in Ihren Space-Einstellungen die Option
Änderungen im Spielmodus beibehalten aktiviert haben, bleiben diese Änderungen erhalten, nachdem der Spielstatus unter
beendet wurde. Der aktuell verbundene Client wird durch das Steckersymbol angezeigt.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

![Simulator2](/images/studio/studio-navigate-simulator2.png)

Mit dem Simulator können Sie außerdem Projektänderungen in verschiedenen Geräteansichtsgrößen und
simulierten realen Umgebungen testen und anzeigen, ohne Studio verlassen zu müssen. Der Simulator funktioniert, indem er
die 8th Wall AR Engine in Echtzeit über die mitgelieferte Sammlung von voraufgezeichneten AR-Sequenzen laufen lässt.
Sie können so viele Simulatorinstanzen öffnen, wie Sie möchten, und so Projektänderungen in einer Vielzahl von Szenarien testen
. Der Simulator verfügt über eine Reihe von Wiedergabesteuerungen und Komfortfunktionen wie
:

- Abspielbalken, Scrubber und In-/Out-Griffe: Ermöglicht das Einrichten von Loop-Punkten, so dass Sie eine granulare
  Kontrolle über die ausgewählte Sequenz erhalten.
- Schaltfläche "Zurücksetzen" (unten rechts): Setzt das Kamerabild wieder an seinen Ausgangspunkt zurück. HINWEIS: Bei jeder Schleife der Sequenz und bei jeder Auswahl einer neuen Sequenz wird auch
  aufgerufen.
- Schaltfläche „Aktualisieren“ (oben rechts): Aktualisiert die Seite, wobei zwischengespeicherte Inhalte erhalten bleiben. Wenn Sie die UMSCHALTTASTE gedrückt halten und auf
  auf die Schaltfläche "Aktualisieren" klicken, wird eine vollständige Neuladung durchgeführt, wobei alle zwischengespeicherten Inhalte ignoriert werden.

#### Vorschau Links {#preview-links}

Zeigen Sie Ihre Projekte sofort in der Vorschau auf dem Handy, dem Desktop, dem Headset oder in einem anderen Browserfenster an, während Sie
per Link/QR-Code entwickeln.

![SimulatorVorschau](/images/studio/studio-navigate-preview-links.png)

#### Live-Vorschau verwenden {#using-live-preview}

- Klicken Sie oben im Fenster Cloud Editor auf die Schaltfläche Neues Gerät verbinden.
- Scannen Sie den QR-Code mit Ihrem Mobilgerät, um einen Webbrowser zu öffnen und eine Live-Vorschau des Projekts
  WebAR zu sehen. Oder klicken Sie auf den QR-Code, um eine neue Registerkarte in Ihrem aktuellen Browser zu öffnen
- Wenn Ihr Projekt Web AR verwendet, werden Sie beim Laden der Seite aufgefordert, auf die Bewegungs- und
  Orientierungssensoren (bei einigen Geräten) sowie auf die Kamera (bei allen Geräten) zuzugreifen. Klicken Sie auf Zulassen für alle Berechtigungsaufforderungen
  . Sie werden auf die URL für die private Entwicklung des Projekts weitergeleitet.
- Hinweis: Der "Vorschau"-QR-Code, der im Cloud Editor angezeigt wird, ist ein temporärer, einmalig verwendbarer QR-Code
  , der nur für die Verwendung durch den Entwickler während der aktiven Arbeit im Cloud Editor gedacht ist. Dieser QR-Code führt Sie zu
  , einer privaten Entwicklungs-URL, die für andere nicht zugänglich ist. Um Ihre Arbeit mit anderen zu teilen,
  , lesen Sie bitte den Abschnitt unten über die Veröffentlichung Ihres Projekts.
- Klicken Sie auf das Headset-Symbol, um einen Link für ein Headset-Gerät zu erstellen.

:::tip
Durch das Testen Ihres Projekts auf mehreren Geräten wird sichergestellt, dass die Benutzer auf
eine konsistente Erfahrung mit einer Vielzahl von Bildschirmgrößen und Plattformen haben.
:::

### Symbolleiste starten {#launch-toolbar}

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

<!-- ![StudioLand](/images/studio/TODO.png) -->

**Veröffentlichen**: Der letzte Schritt ist die Veröffentlichung Ihres aktualisierten und gelandeten Projektcodes mit 8th Walls
Built-in Hosting. Öffentlich ermöglicht es, dass das Projekt von jedem im Internet eingesehen werden kann. Mit Staging
können Personen, die über einen Passcode verfügen, Ihr Projekt einsehen.

![StudioPublish](/images/studio/studio-navigate-publish.png)

Sobald Sie bereit sind, Ihr Projekt zu veröffentlichen, benötigen Sie eine Beschreibung und ein Titelbild. Um
mehr über den Veröffentlichungsablauf und die Bereitstellung eines Projekts für die Öffentlichkeit zu erfahren, lesen Sie bitte die
[Abschnitt Veröffentlichung in der allgemeinen 8th Wall Dokumentation](https://www.8thwall.com/docs/getting-started/quick-start-guide/#publish-your-project).

### Inspektor & Raumeinstellungen {#inspector--space-settings}

Sie können objektspezifische Komponenten anzeigen und konfigurieren sowie allgemeine Einstellungen für den Editor vornehmen.

#### Allgemeine Einstellungen {#general-settings}

Wenn kein Objekt ausgewählt ist, sehen Sie die allgemeinen Einstellungen für Ihr Projekt.

![StudioGeneralSettings](/images/studio/studio-navigate-general-settings.png)

#### Raumeinstellungen {#space-settings}

Gestalte die Skybox deines Raums. Skyboxes sind ein Wrapper um Ihre gesamte Szene, der zeigt, wie die Welt
über Ihre Geometrie hinaus aussieht. Wenn Ihr Projekt für die Verwendung von AR auf einem AR-kompatiblen Gerät konfiguriert ist,
(siehe [XR](/studio/guides/xr/world/)), wird die Skybox nicht gerendert.

#### Quellenkontrolle {#source-control}

Verwalten Sie verschiedene Versionen Ihres Projekts und den Änderungsverlauf. Durch das Erstellen eines neuen Mandanten wird eine neue
Version Ihres Projekts erstellt, die für das Testen von Änderungen hilfreich sein kann, ohne dass sich dies auf Ihre Hauptversion
auswirkt. Sie können auch auf eine Historie der früheren Änderungen des Projekts zugreifen, indem Sie die Funktion
Projekthistorie wählen.

#### Eingaben {#inputs}

Verwenden Sie den Eingabe-Manager, um Erlebnisse einzurichten, die über verschiedene Geräteeingaben wie
Tastaturen, Gamepad-Steuerungen, Trackpads und Touchscreen-Aktionen funktionieren. Erstellen Sie Ihre Ereignisaktion und richten Sie unter
eine Zuordnung (oder Bindung) zu verschiedenen Eingängen ein. [Erfahren Sie mehr über das Input-System](/studio/guides/input)

#### Code-Editor {#code-editor}

Wählen Sie aus verschiedenen Einstellungen für die Benutzerfreundlichkeit, wie z. B. Hell-/Dunkelmodus, Tastenkombinationen und Codespeichereinstellungen.

#### Spielmodus {#play-mode}

Wenn Sie die Live-Synchronisierung aktiviert haben, bleiben Änderungen, die Sie im Editor vornehmen, auch nach dem Trennen der Verbindung mit dem
Simulator oder der Live-Vorschau erhalten. Wenn diese Einstellung deaktiviert ist, können Sie im
Editor Änderungen vornehmen, die dann im Simulator angezeigt werden. Diese Änderungen werden jedoch nicht gespeichert, wenn die Verbindung zum
Simulator unterbrochen wird. Weitere Informationen zum Simulator finden Sie im Abschnitt
[Simulator](/studio/getting-started/quickstart#simulator--preview-links). Änderungen beibehalten ist standardmäßig auf
aktiviert.

#### Inspektor {#inspector}

Prüfen und konfigurieren Sie eine Entität und ihre Komponenten. Erfahren Sie mehr über Entitäten und Komponenten in
[Key Concepts](/studio/essentials/entities-and-components/).

Standardmäßig zeigt jedes Objekt eine Transform-Komponente im Inspektor an. Verschiedene Arten von Objekten
können verschiedene Komponenten anzeigen, z.B. zeigt ein Primitiv eine Mesh-Komponente mit
konfigurierbaren Optionen wie Geometrieformeinstellungen, Materialien, Texturen, etc.

#### Hinzufügen einer Komponente {#adding-a-component}

Sie können eine Komponente über die Schaltfläche "+ Neue Komponente" hinzufügen. Es gibt mehrere Arten von integrierten
Komponenten in Studio, einschließlich Physik, Beleuchtung, Audio, Animationen und mehr. Benutzerdefinierte Komponenten
können ebenfalls hinzugefügt werden - [Erfahren Sie mehr über benutzerdefinierte Komponenten](/studio/essentials/entities-and-components/components/). Einmal eingerichtet, erscheint Ihre benutzerdefinierte Komponentein der Kategorie Benutzerdefiniert. Klicken Sie auf die drei Punkte, um eine Komponente zu entfernen.

![StudioNewComponent](/images/studio/studio-navigate-adding-a-component.png)

### Konsole {#console}

Debuggen Sie die Build-Aktionen und die Laufzeit Ihres Projekts. Der Debug-Modus ist eine erweiterte Studio-Funktion, die
Protokollierung, Leistungsinformationen und erweiterte Visualisierungen direkt auf Ihrem Gerät bietet.

![StudioConsole](/images/studio/studio-navigate-console.png)

### Code-Editor {#code-editor-1}

Der 8th Wall Code Editor gibt Entwicklern eine Reihe von Codierungswerkzeugen an die Hand, mit denen sie webbasierte XR-Inhalte erstellen, zusammenarbeiten und
veröffentlichen können. Unsere leistungsstarke IDE umfasst einen Code-Editor, eine integrierte Versionskontrolle, einen
Commit-Verlauf, eine Live-Vorschau, drahtloses Remote-Debugging und Push-Button-Hosting in einem globalen CDN.
Weitere Funktionen des Code-Editors sind:

- Intellisense
- Befehlspalette
- Code Peek
- Hell/Dunkel-Themen

![StudioEditor](/images/studio/studio-navigate-editor.png)

### Module {#modules}

8th Wall Module ist eine leistungsstarke Funktion von 8th Wall, die die Effizienz der
Projektentwicklung drastisch erhöht. Mit 8th Wall Modulen können Sie Komponenten (Code, Assets, Dateien)
in Ihrem Arbeitsbereich speichern und wiederverwenden sowie von 8th Wall erstellte Module finden und in Ihr Projekt importieren.

[Erfahren Sie mehr über 8th Wall Modules](https://www.8thwall.com/docs/guides/modules/overview/).

#### Landing Page Modul {#landing-page-module}

Neben dem Dateibrowser sehen Sie eine Registerkarte namens Module. Jedes der Beispielprojekte, einschließlich
, das Basisprojekt Empty, wird mit dem Modul "Landing Page" geliefert.
Um mehr über Module im Allgemeinen zu erfahren, lesen Sie unsere [8th Wall Modules overview](https://www.8thwall.com/docs/guides/modules/overview/).

![StudioLandingPageModule](/images/studio/studio-navigate-landing-page.png)

Landing Pages sind mit dem Modulkonfigurator anpassbar. Alle Landing Page-Vorlagen sind
optimiert für Branding und Bildung mit verschiedenen Layouts, einem verbesserten QR-Code-Design und Unterstützung
für wichtige Medien.

Landing Pages sorgen dafür, dass Ihre Nutzer unabhängig vom verwendeten Gerät ein sinnvolles Erlebnis haben.
Sie erscheinen auf Geräten, die nicht direkt auf das Web AR-Erlebnis zugreifen dürfen oder können.

Landing Pages passen sich auf intelligente Weise an Ihre Konfiguration an. Zum Beispiel:

![StudioLandingPageModuleBeispiele](/images/studio/studio-navigate-landing-page2.png)

:::tip
Wir empfehlen, dass alle Projekte das Landing Page Modul verwenden, um eine einheitliche Darstellung auf allen
Geräten zu gewährleisten.
:::
