---
id: release-notes
sidebar_position: 999
toc_max_heading_level: 2
latest_popup_id: neueste
runtime_version_2025_10_24: 2.2.0
runtime_version_2025_10_16: 2.1.0
runtime_version_2025_10_10: 2.0.1
runtime_version_2025_09_25: 2.0.1
runtime_version_2025_09_17: 2.0.0
runtime_version_2025_09_09: 2.0.0
runtime_version_2025_08_29: 1.1.0
runtime_version_2025_08_19: 1.0.0
runtime_version_2025_08_06: 1.0.0
---

# Anmerkungen zur Veröffentlichung

<style> p:has(+ ul) {margin-bottom: 0 !important}</style>

## Oktober 2025 [Update 3] {#version-2025-october-24}

Oktober 24, 2025

### Neue Funktionen

Runtime 2.2.0 fügt Physikkollider-Rotationsoffsets und andere Korrekturen/Verbesserungen hinzu. Lesen Sie die
vollständigen Versionshinweise [hier](/api/studio/changelog/#2.2.0).

## Oktober 2025 [Update 2] {#version-2025-october-16}

Oktober 16, 2025

### Neue Funktionen

Runtime 2.1.0 führt eine API für Skybox und Nebel sowie weitere Korrekturen und Erweiterungen ein. Lesen Sie die
vollständigen Versionshinweise [hier](/api/studio/changelog/#2.1.0).

## Oktober 2025 [Update 1] {#version-2025-october-10}

Oktober 10, 2025

### Neue Funktionen

Desktop-Anwendung

- Unterstützung für Windows hinzugefügt. Herunterladen [hier](https://www.8thwall.com/download).

Export von nativen Anwendungen

- Optionen zum Einbetten von iFrames mit einem kopierbaren Codeschnipsel im Veröffentlichungsablauf hinzugefügt. Erfahren Sie mehr [hier](https://www.8thwall.com/blog/post/196857049250/embedding-made-easy-iframe-support-in-8th-walls-publish-flow).

### Korrekturen und Erweiterungen

Desktop-Anwendung

- Problem behoben, bei dem die 8th Wall Desktop-Anwendung auf dem Mac manchmal bei der anfänglichen Wiedergabe stecken blieb
- Die Desktop-Anwendung unterstützt jetzt Übersetzungen basierend auf den Spracheinstellungen des Benutzers

Export von nativen Anwendungen

- Einführung einer Konfigurationsoption, um die Statusleiste in iOS Native App Export-Builds einzuschließen oder zu entfernen

Allgemein

- Markdown-Dateien werden standardmäßig im Vorschaumodus geöffnet (Studio Web)

## September 2025 [Update 3] {#version-2025-september-25}

September 25, 2025

### Korrekturen und Erweiterungen

Physik

- Problem behoben, das verhindert, dass dynamische Objekte eine vollständige Ruhephase erreichen
- Absturz nach wiederholten Skalenänderungen des Kolliders behoben

Partikel

- Falsche Emissionsrichtungen behoben
- Partikeleffekte sind unabhängig von der Framerate

Desktop-Anwendung

- Erhöhte Zuverlässigkeit des Simulators

UI

- Fehler behoben, der zu einer falschen Offset-Platzierung bei UI-Elementen führte

## September 2025 [Aktualisierung 2] {#version-2025-september-17}

17. September 2025

### Neue Funktionen

Desktop-Anwendung

- [Die 8th Wall Desktop App ist hier](http://8th.io/desktopappblog). Die Desktop App, die jetzt als Public Beta für macOS und bald auch für Windows verfügbar ist, verbindet die Geschwindigkeit der lokalen Entwicklung mit der Zusammenarbeit in der Cloud. [Weitere Informationen](https://www.8thwall.com/docs/studio/app/) und [Jetzt herunterladen](https://www.8thwall.com/download).

![](/images/studio/app/hub.jpg)

## September 2025 [Update 1] {#version-2025-september-9}

September 9, 2025

### Neue Funktionen

Physik-Upgrade

- Die brandneue Studio Runtime 2.0.0 kommt mit einer [überarbeiteten Physik-Engine](https://8th.io/v2update), die schneller und flüssiger ist und alles mitmacht, was Sie ihr vorsetzen.
- Einige physikalische Eigenschaften wie Reibung, Restitution und Dämpfung haben sich dadurch verändert. Sehen Sie sich den [Upgrade-Leitfaden](https://8th.io/v2upgradeguide) für einen reibungslosen Übergang zu 2.0 an.
- Kinematische Kollider: Die Option Kinematisch wurde zu den Kollidertypen hinzugefügt. Ermöglicht geskriptete oder animierte Bewegungen von Objekten und erlaubt gleichzeitig physikalische Kollisionsinteraktionen.

Export von nativen Anwendungen

- Exportieren Sie Ihr 3D- oder XR-Erlebnis als iOS-App und vergrößern Sie Ihre Reichweite, indem Sie es sowohl im Web als auch im iOS-App-Store veröffentlichen.

### Korrekturen und Erweiterungen

Fertighäuser

- Ein Problem wurde behoben, bei dem Kollider auf verschachtelten vorgefertigten Objekten nicht korrekt generiert wurden.

Export von nativen Anwendungen

- Das Android SDK-Ziel für den Android Native App Export wurde von API Level 34 auf API Level 36 aktualisiert, um die Einhaltung der Google Play-Verteilungsanforderungen zu gewährleisten (Apps müssen API Level 35+ erreichen).
- Es wurde ein Problem behoben, bei dem Partikeleffekte und benutzerdefinierte Schriftarten im Static-Bundle-Build-Modus für Android Native App Export nicht korrekt gerendert wurden.

Allgemein

- Das Autoplay-Verhalten von Videos wurde aktualisiert, sodass Videos mit Audio automatisch stummgeschaltet werden. Die Stummschaltung von Video-Audio wird automatisch aufgehoben, sobald eine Benutzerinteraktion stattgefunden hat.
- Strengere Typescript-Prüfung zur Erstellungszeit aktiviert, um die Fehlerberichterstattung zu verbessern.
- In Studio werden Sie nun automatisch über neu veröffentlichte Updates informiert.

## August 2025 [Update 3] {#version-2025-august-29}

August 29, 2025

### Neue Funktionen

Laufzeitversionierung

- Studio-Projekte können mit einer bestimmten Version laufen, die in den Einstellungen aktualisiert werden kann. Legen Sie Ihr Projekt auf eine feste Laufzeit fest, um es vorhersehbar zu machen, oder entscheiden Sie sich für automatische kleinere Updates und Fehlerbehebungen, um immer auf dem neuesten Stand zu bleiben.

### Korrekturen und Erweiterungen

Asset-Labor

- Frühere Schritte der Asset-Generierung werden jetzt ausgefüllt, wenn Assets aus der Bibliothek zur Erstellung von Workflows gesendet werden
- Wiederholung von mehreren Blickwinkeln auf einmal während der Bilderzeugung für 3D-Modelle und animierte Figuren

Gesicht

- Behoben: Das Gesichtsnetz wurde nicht wie konfiguriert mit der Face AR-Kamera gerendert

Physik

- Korrumpierte Form, die auf Auto-Kollider angewendet wurde, wurde behoben

## August 2025 [Update 2] {#version-2025-august-19}

August 19, 2025

### Neue Funktionen

Rechnungsstellung

- Einmalige Kreditaufstockung hinzugefügt

Allgemein

- Kamera-Vorschau-Widget hinzugefügt

### Korrekturen und Erweiterungen

Rechnungsstellung

- Stripe Billing Portal zur Verwaltung von Abonnements, Rechnungsinformationen und Rechnungen hinzugefügt

Bild-Ziele

- Ein Problem wurde behoben, das verhinderte, dass gekrümmte Bildziele aktualisiert wurden

Asset-Labor

- Ermöglicht die Neugenerierung eines einzelnen Bildes während der Bilderzeugung in mehreren Ansichten für 3D-Modelle und animierte Figuren

Allgemein

- Ein Problem wurde behoben, das einige Nutzer daran hinderte, sich bei Google anzumelden

## August 2025 [Update 1] {#version-2025-august-6}

6. August 2025

### Korrekturen und Erweiterungen

Allgemein

- Die Benutzerfreundlichkeit und Organisation der Kamerakomponente wurde verbessert
- Problem behoben, bei dem der Nebel nicht erschien, wenn er im Konfigurator aktiviert war
- Problem mit der Mauszeigersperre bei der Komponente Fly Controls in Studio behoben

Asset-Labor

- UI-Unterstützung für Hintergrund-Opazität für mit Image-GPT-1 erzeugte Bilder hinzugefügt

UI-Elemente

- Artefakt auf UI-Elementen mit transparenten Bildern auf einigen iOS-Geräten behoben
  Partikel
- GLTF-Partikel werden nicht mehr angezeigt
  Prefabs
- Aktualisierungen des Prefab-Kinderkolliders behoben

## Juli 2025 [Aktualisierung 4] {#version-2025-july-29}

Juli 29, 2025

### Neue Funktionen

Asset-Labor

- Kontrollen zur Optimierung der generierten 3D-Modelle hinzugefügt

UI-Elemente

- Konfiguration der Stapelreihenfolge hinzugefügt, um überlappende Elemente zu verwalten

### Korrekturen und Erweiterungen

UI-Elemente

- Verbesserte Handhabung der Sortierreihenfolge zwischen Geschwisterelementen
- UI-Elementgruppen werden jetzt in einer einzigen Ebene abgeflacht

Transformiert

- `getWorldQuaternion` und `setWorldQuaternion` zu world.transform hinzugefügt

Physik

- Aktivierter Hochpräzisionsmodus für dynamische Kollider

Materialien

- Texturfilterung mit Mipmap-Unterstützung hinzugefügt

Kleckse

- Unterstützung für spz v3 hinzugefügt

Asset-Labor

- Option zur Auswahl von Assets aus der Bibliothek zur Verwendung als Input in Bild-, 3D-Modell- und animierten Charakter-Workflows hinzugefügt

## Juli 2025 [Aktualisierung 3] {#version-2025-july-22}

22. Juli 2025

### Neue Funktionen

Eingabe-Manager

- Screen Touch Bindung zum Input Manager hinzugefügt.

### Korrekturen und Erweiterungen

Asset-Labor

- Unterstützung für vom Benutzer hochgeladene Bilder für den Workflow der 3D-Modellgenerierung wurde hinzugefügt.
- Der Arbeitsablauf für animierte Charaktere wurde aktualisiert, um Einzelbild-zu-3D-Generationen zu unterstützen.
- Unterstützung für vom Benutzer hochgeladene 3D-Modelle für den Arbeitsablauf von Animated Character wurde hinzugefügt.

XR

- Es wurde ein Problem behoben, bei dem das anfängliche Blinken während der Kamerazulassungen auftrat, wenn Szenenobjekte geladen wurden.

Export von nativen Anwendungen

- Der User-Agent-String für native Android-Apps wurde aktualisiert, um die Plattform und das Gerät genauer wiederzugeben.
- Ein Problem mit dem unerwarteten Verhalten von Touch-Ereignissen in nativen Android-Anwendungen wurde behoben.

## Juli 2025 [Aktualisierung 2] {#version-2025-july-15}

Juli 15, 2025

### Neue Funktionen

Räume

- Nebel-Konfiguration zu den Raumeinstellungen hinzugefügt.

### Korrekturen und Erweiterungen

UI-Elemente

- Option ignoreRaycast hinzugefügt.

Asset-Labor

- Es wurde die Möglichkeit hinzugefügt, eine Vorschau von Animationsclips im Arbeitsablauf für animierte Charaktere anzuzeigen.

XR

- Ungültiger App-Schlüssel-Fehler beim Neuladen der XR-Kamera behoben.

## Juli 2025 [Aktualisierung 1] {#version-2025-july-07}

7. Juli 2025

### Neue Funktionen

Asset-Labor

- Unterstützung für Hunyuan3D-2.1 Bild-zu-3D-Erzeugungsmodell hinzugefügt.
- Unterstützung für Flux Schnell Image Generation Modell hinzugefügt.

Export von nativen Anwendungen

- Unterstützung für verschiedene Geräteausrichtungen aktiviert.
- Konfigurationsoptionen für die Gerätestatusleiste hinzugefügt.
- Unterstützung für Multitouch hinzugefügt.

### Korrekturen und Erweiterungen

Allgemein

- Es wurde ein Fehler behoben, bei dem Kamera, die auf bewegte Objekte fokussiert werden sollte, nicht korrekt aktualisiert wurde.

Fertighäuser

- Behebung verschiedener Probleme bei der Laufzeit von Prefabs.
- Es wurde ein Problem behoben, bei dem die Kinderkomponenten von Prefabs nicht korrekt gelöscht wurden.
- Hervorgenommene Style-Updates, um überschriebene Komponenten und Änderungen besser hervorzuheben.
- Es wurde ein Problem behoben, bei dem die Kinderkomponenten von Prefabs nicht korrekt gelöscht wurden.

UI-Elemente

- Problem mit der Dehnung von Bildern bei der Einstellung "Enthalten" behoben.

Asset-Labor

- Behebung von Zeitüberschreitungen beim Laden von Bibliotheken.

Partikel

- Es wurde ein Fehler behoben, bei dem Partikel fälschlicherweise auf die Verwendung von Würfelprimitiven zurückfielen, wenn kein Primitiv gesetzt wurde.

Materialien

- Verbesserte Leistung von GLTF-Videomaterial.

Mesh

- Es wurde ein Fehler behoben, bei dem das Hinzufügen eines Colliders zu bestimmten GLBs das Objekt in Studioansichten verschwinden ließ.

Export von nativen Anwendungen

- Verbesserte UI-Skalierungskonsistenz für Android-Apps.
- Intermittierende Fehler beim Öffnen oder Schließen von Android-Apps behoben.

Simulator

- Ein Problem wurde behoben, bei dem der Simulator beim Öffnen zweimal initialisiert wurde.

## Juni 2025 [Update 3] {#version-2025-june-11}

11. Juni 2025

### Neue Funktionen

Asset-Labor

- Generieren Sie Bilder, 3D-Modelle sowie animierte und geriggte Charaktere mit unserem neuen Asset Lab und fügen Sie diese ganz einfach zu Ihrer Szene hinzu.

Export von nativen Anwendungen

- Exportieren Sie Ihr 3D- oder XR-Erlebnis als Android-App und vergrößern Sie Ihre Reichweite, indem Sie es sowohl im Web als auch in den App-Stores veröffentlichen.

**Korrekturen und Verbesserungen**

Allgemein

- Die optionale Einstellung "Live-Synchronisation" wurde entfernt, um das Wiedergabeverhalten zu optimieren.
- Die Steuerelemente für die Wiedergabe und den Aufbau des Studios wurden aktualisiert und sind nun noch benutzerfreundlicher.

## Juni 2025 [Update 2] {#version-2025-june-09}

9. Juni 2025

### Neue Funktionen

UI-Elemente

- Hover-Events werden nun für UI-Elemente unterstützt.

Materialien

- API für die Arbeit mit Videotexturen zur Laufzeit hinzugefügt.

**Korrekturen und Verbesserungen**

UI-Elemente

- Ein Problem wurde behoben, das dazu führte, dass UI-Elemente bei Verwendung von "display: none" bestehen blieben.

Animationen

- Fehler bei Animationsübergängen behoben.

## Juni 2025 [Update 1] {#version-2025-june-02}

2. Juni 2025

### Neue Funktionen

Fertighäuser

- Wir haben Unterstützung für Prefabs in Studio hinzugefügt, um wiederverwendbare, anpassbare Spielvorlagen zu erstellen, die Ihre Entwicklung rationalisieren und skalieren und die Leistung optimieren.
- Sehen Sie sich unseren [Prefabs Guide](/studio/guides/prefabs) an, um loszulegen.

Allgemein

- Videos werden jetzt als Materialtexturkarten unterstützt. Hinweis: Der neue VideoMaterial-Override überschreibt alle glTF-Materialien wie HiderMaterial und VideoMaterial.

## Mai 2025 [Update 2] {#version-2025-may-29}

Mai 29, 2025

### Neue Funktionen

UI-Elemente Ereignisse

- Wir haben UI-Ereignisse für funktionierende UI-Elemente wie Schaltflächen eingeführt. (d.h. Gedrückt, Freigegeben, Ausgewählt, Deaktiviert)
- UI Events haben jetzt eigene Strings.
- Weitere Informationen finden Sie im Abschnitt Ereignisse der API-Dokumentation.

Lichter

- Wir haben einen neuen Lichttyp namens "Flächenlicht" eingeführt, der Licht von einem rechteckigen Primitiv ausstrahlt.

### Korrekturen und Erweiterungen

Audio

- Ein Problem wurde behoben, bei dem mehrere Audio-Entitäten nicht korrekt spawnen konnten.

## Mai 2025 [Update 1] {#version-2025-may-05}

5. Mai 2025

### Neue Funktionen

Szenische Überlegungen

- Es wurde die Möglichkeit hinzugefügt, eine Reflektionskarte auf einen Raum zu legen. Diese Reflexionskarte wirkt sich auf die Beleuchtungseinstellungen Ihrer Szene aus und verändert die Darstellung von reflektierenden Materialien. Sehen Sie sich die neue Einstellung Reflections im Space Settings Panel an.

**Korrekturen und Verbesserungen**

Allgemein

- Neue Direktive "required" hinzugefügt, um Felder in benutzerdefinierten Komponenten als erforderlich zu definieren. Die Direktive "@required" für benutzerdefinierte Komponenten führt zu einem Fehler, wenn die Bedingung bei der Erstellung nicht erfüllt ist.

## April 2025 [Update 2] {#version-2025-april-29}

April 29, 2025

### Neue Funktionen

Materialien

- Es wurde eine neue Einstellung für die Texturumhüllung im Materialkonfigurator hinzugefügt.

## April 2025 [Update 1] {#version-2025-april-9}

April 9, 2025

### Neue Funktionen

Bild-Ziele

- **Image Targets werden jetzt in 8th Wall Studio unterstützt!** Entwickler können jetzt AR-Inhalte mit Bildern in der realen Welt verknüpfen und so eine neue Reihe von kreativen und pädagogischen Erfahrungen ermöglichen.

### Korrekturen und Erweiterungen

Eingabe

- input.getMousePosition()\\` gibt nun "clientX/Y" statt "screenX/Y" zurück, um eine bessere Anpassung an die Viewport-Koordinaten zu erreichen.
- Neues Ereignis `ecs.input.UI_CLICK` zur verbesserten Verfolgung von UI-Interaktionen hinzugefügt.

Transformiert

- Funktionen zum Transformieren zu world.transform hinzugefügt.

Raycasting

- Neue Raycasting-Funktionen hinzugefügt: `raycast()` und `raycastFrom()` für flexiblere und präzisere Interaktion mit 3D-Objekten.

UI

- Aktualisierungen der Studio UI-Systemschnittstelle für eine intuitivere Entwicklungserfahrung.

Allgemein

- Fehler behoben, bei dem auf `world.spaces` in `add` Callbacks nicht zugegriffen werden konnte.
- Es wurde ein Problem behoben, bei dem Ohranhänge nicht im Ansichtsfenster angezeigt wurden, wenn sie aktiviert waren.

## März 2025 [Update 1] {#version-2025-March-5}

März 5, 2025

### Korrekturen und Erweiterungen

Allgemein

- Ereignis "Ort gespawnt" hinzugefügt

Schatten

- Smart Shadow Kamerastumpf

Animationen

- Fehlerbehebung für Positions-/Rotationsanimationen
- Animationsstillstand beim Wechseln der Modelle behoben

Vermögenswerte

- Fehler behoben, bei dem die Einstellungen beim Laden von Assets veraltet sind
- Wettlaufbedingung beim Laden von UI-Bild-Assets behoben

## Februar 2025 [Update 1] {#version-2025-february-13}

Februar 13, 2025

### Neue Funktionen

Niantic-Karten für das Web

- Verbinden Sie Erlebnisse mit der realen Welt
  Karten sind der Schlüssel zur Entwicklung standortbezogener Erlebnisse. Mit Niantic Maps for Web, das direkt in 8th Wall Studio zur Verfügung steht, können Sie sie nahtlos in Ihren Arbeitsablauf integrieren. Mit Niantic Maps in Studio haben Studio-Entwickler jetzt Zugriff auf dieselbe Technologie, die Niantic für die beliebtesten Spiele in der realen Welt verwendet. Damit können Sie Ihre AR-Erlebnisse an realen Orten verankern, bei der Entdeckung ortsbezogener Erlebnisse helfen und als Aggregator für AR-Erlebnisse in der realen Welt fungieren. Karten sind jetzt vollständig in die Szenenhierarchie von Studio integriert, so dass Sie Karten mit einem Klick in Ihre Projekte einfügen können - eine zusätzliche API-Einrichtung ist nicht erforderlich.

Räume

- Mit Spaces haben Sie jetzt die Möglichkeit, mehrere unterschiedliche Bereiche innerhalb eines einzigen Projekts zu erstellen und zu verwalten. Sie können sich Spaces wie Szenen oder Umgebungen in anderen Spiel-Engines oder Design-Tools vorstellen. Einfach ausgedrückt, sind Spaces 3D-Rahmen, in denen Sie Elemente, Beleuchtung, Kameras und Spielinteraktionen platzieren können. Ein Raum (auch Szene genannt) enthält alle Ihre Objekte.

## Januar 2025 [Aktualisierung 3] {#version-2025-january-31}

31. Januar 2025

### Korrekturen und Erweiterungen

Allgemein

- Allgemeine Fehlerkorrekturen zur Verbesserung der Leistung beim Laden von Szenen, beim Laden von Splat und beim Arbeiten im Live-Sync-Modus

## Januar 2025 [Aktualisierung 2] {#version-2025-january-23}

Januar 23, 2025

### Korrekturen und Erweiterungen

UI-Elemente

- 9-Slice-Stretch-Konfiguration für Hintergrundgröße hinzugefügt (nur 3D-UI-Elemente)
- Konfiguration des Randradius hinzugefügt

Allgemein

- Fehler behoben, bei dem der Farbraum für UI-Elemente nicht korrekt wiedergegeben wurde

Physik

- Fügt einen Toggle für das Physiksystem hinzu, der das System bei jedem Tick überspringt, es funktioniert auch als Optimierung, wenn die Physik nicht verwendet wird.

## Januar 2025 [Aktualisierung 1] {#version-2025-january-15}

Januar 15, 2025

### Korrekturen und Erweiterungen

Licht

- Lichttyp `Punkt` hinzugefügt

Schatten

- Die Konfiguration des Empfangsschattens wird in die Mesh-Komponente verschoben.

Mathematik

- Mat4.decomposeT" hinzugefügt
- Mat4.decomposeR" hinzugefügt
- Mat4.decomposeS" hinzugefügt

## Dezember 2024 [Update 1] {#version-2024-december-09}

9. Dezember 2024

### Korrekturen und Erweiterungen

VPS

- Es wurde die Möglichkeit hinzugefügt, die Anzeige des Standort-Assets im Ansichtsfenster auszublenden.

UI

- Probleme bei der Anzeige benutzerdefinierter Schriften behoben

Audio

- Es wurde die Möglichkeit hinzugefügt, den Fortschritt von Audioclips abzurufen und einzustellen

VPS

- Ort" zu VPS-Ereignisdaten mit der eid der entsprechenden Ortseinheit hinzugefügt

## November 2024 [Update 2] {#version-2024-november-11}

11. November 2024

### Korrekturen und Erweiterungen

Allgemein

- Verbessertes Verhalten für `ecs.Disabled`
- Verbesserte Leistung mit Raycasting

VPS

- Fehler behoben, bei dem LocationMeshes während der Live-Synchronisation im Ansichtsfenster ausgeblendet werden

Beleuchtung

- Unterstützung der "follow camera" für gerichtetes Licht

## November 2024 [Update 1] {#version-2024-november-05}

5. November 2024

### Korrekturen und Erweiterungen

Allgemein

- Es wurde die Möglichkeit hinzugefügt, Entitäten und ihre Komponenten in einer Szene zu deaktivieren, um eine bessere Kontrolle und optimierte Laufzeitleistung zu erreichen.
- Es wurde eine neue Funktion hinzugefügt, um eine neue Client-Projektversion aus einer früheren Commit-Version zu erstellen. Greifen Sie auf diese Funktion über die Ansicht Projektverlauf in den Studio-Szeneneinstellungen zu.

Audio

- Hinzufügen von Ereignissen zum Laden und Beenden der Audiowiedergabe für eine einfachere Verwaltung und Kontrolle der Audiowiedergabe: `ecs.events.AUDIO_CAN_PLAY_THROUGH`, `ecs.events.AUDIO_END` Ereignisse

Vermögenswerte

- Funktion hinzugefügt, um den Status des Asset-Ladens zu sehen: `ecs.assets.getStatistics`

UI

- Funktion zur Bilddehnung als Teil eines UI-Elements hinzugefügt: `Ui.set({backgroundSize: 'contain/cover/stretch'})`

## Oktober 2024 [Update 3] {#version-2024-october-29}

29. Oktober 2024

### Neue Funktionen

Backend-Dienste

- Backend-Funktionen und Backend-Proxies werden jetzt in 8th Wall Studio unterstützt!

## Oktober 2024 [Update 2] {#version-2024-october-24}

Oktober 24, 2024

### Neue Funktionen

VPS

- **VPS wird jetzt in 8th Wall Studio unterstützt!** Entwickler können jetzt standortbasierte WebAR-Erlebnisse erstellen, indem sie AR-Inhalte mit realen Orten verbinden.

### Korrekturen und Erweiterungen

3D-Modelle

- Unterstützung für die Wiedergabe aller Animationsclips auf einem gltf-Modell hinzugefügt

UI

- Es wurde die Möglichkeit hinzugefügt, die Deckkraft von UI-Elementen einzustellen.

## Oktober 2024 [Update 1] {#version-2024-october-18}

18. Oktober 2024

### Korrekturen und Erweiterungen

Veranstaltungen

- Ereignis `ecs.events.SPLAT_MODEL_LOADED` hinzugefügt.

Physik

- Funktion [getLinearVelocity()](/api/studio/ecs/physics/#getlinearvelocity) hinzugefügt.

Primitive

- Das Primitiv Polyeder wurde hinzugefügt und ersetzt das Tetraeder.
- Primitiver Torus hinzugefügt.

## September 2024 [Aktualisierung 2] {#version-2024-september-30}

30. September 2024

### Neue Funktionen

3D-Modelle

- Unterstützung für das Hochladen und Konvertieren von 3D-Assets im FBX-Format.
- Unterstützung für die Vorschau und Konfiguration Ihrer 3D-Modelle. Mit unserer aktualisierten Asset-Vorschau können Sie Ihr Modell mit verschiedenen Beleuchtungseinstellungen prüfen, den Drehpunkt anpassen, die Einstellungen für die Netzkomprimierung ändern, die Skalierung aktualisieren, die enthaltenen Materialien prüfen und vieles mehr.

Materialien

- Die Materialien können in der Asset-Vorschau bearbeitet und gespeichert werden. Die Änderungen werden auf das Asset und die Szene übertragen.

UI

- Unterstützung für benutzerdefinierte Schriftarten mit der Möglichkeit, TTF-Dateien hochzuladen.
- Sie können Elemente wie Farbe, Ränder, Text, Deckkraft und vieles mehr fein abstimmen. Mit dem UI-Builder können Sie auch mehrere 2D-Elemente auf einer einzigen Leinwand kombinieren, um zusammengesetzte 2D-Grafiken und -Oberflächen zu erstellen. Bearbeiten und modifizieren Sie diese Elemente in Echtzeit im Studio Viewport, wobei die Änderungen sofort im Simulator angezeigt werden.

### Korrekturen und Erweiterungen

Partikel

- Aktualisierte Partikelkomponente mit zusätzlichen Konfigurationsoptionen und benutzerfreundlicheren Voreinstellungen

Physik

- applyImpulse api, Alternative zur Anwendung von Kraft für die Spieleentwicklung. Gut für Aktionen wie Springen, Schlagen, schnelles Schieben usw.
- Einfache Laufzeit-Getter-Funktion zur Abfrage der aktuellen Schwerkraft-Einstellung.

## September 2024 [Aktualisierung 1] {#version-2024-september-11}

11. September 2024

### Korrekturen und Erweiterungen

Zustandsmaschine

- Verbesserte Funktionen und erweiterte API für die Arbeit mit Zustandsautomaten und Ereignissen. Lesen Sie die [State Machine](/studio/essentials/state-machines/) Dokumentation, um mehr zu erfahren.

## August 2024 [Aktualisierung 5] {#version-2024-august-29}

29. August 2024

### Korrekturen und Erweiterungen

Partikel

- Es wurde ein Problem behoben, bei dem die Position des Partikel-Spawns für untergeordnete Objekte nicht korrekt festgelegt wurde.

## August 2024 [Update 4] {#version-2024-august-26}

26. August 2024

### Neue Funktionen

Kleckse

- **Gaußsche Splatting-Unterstützung in Studio ist da!** Mit der Niantic Scaniverse-App kannst du ganz einfach Splats erstellen und als SPZ-Datei exportieren. Sobald sie in 8th Wall Studio hochgeladen sind, können Splats nahtlos in Ihre Projekte integriert werden und dienen als Grundlage für hyperrealistische 3D-Erlebnisse.

### Korrekturen und Erweiterungen

Animationen

- Es wurde ein Problem behoben, bei dem nicht-schleifende Animationen nicht an der richtigen Position abgeschlossen wurden.

Vermögenswerte

- Verbesserte Unterstützung für die Vorschau von Assets und die Änderung von Asset-Einstellungen.

Audio

- Aktualisierte Audio-Lebenszyklus-APIs (Wiedergabe, Pause, Stummschaltung, Aufhebung der Stummschaltung)

Primitive

- Unterstützung für Hider-Materialien für primitive Objekte, mit denen Sie Objekte in einer Szene verdecken oder verstecken können.
- Unterstützung für unbeleuchtete Materialien für primitive Objekte, die Lichtverhältnisse ignorieren.
- Problem behoben, bei dem Zylinderkollider nicht mit der primitiven Form übereinstimmten

## August 2024 [Update 3] {#version-2024-august-15}

August 15, 2024

### Korrekturen und Erweiterungen

Veranstaltungen

- Ein Problem wurde behoben, bei dem Ereignis-Listener in bestimmten Szenarien übersprungen oder entfernt wurden.

UI

- Ein Problem wurde behoben, bei dem die Schriftarten nicht geändert werden konnten.
- Leistungsprobleme beim Laden und Rendern von UI-Elementen wurden behoben.

Dokumente

- Informationen über häufige Probleme und bewährte Praktiken bei der Skripterstellung von [benutzerdefinierten Komponenten](/studio/essentials/best-practices/) hinzugefügt

## August 2024 [Aktualisierung 2] {#version-2024-august-08}

8. August 2024

### Korrekturen und Erweiterungen

Eingabe-Manager

- Ein Problem wurde behoben, bei dem das Wischen/Ziehen im mobilen Browser nicht kontrolliert wurde.
- Es wurde die Möglichkeit hinzugefügt, die Zeigersperre zu kontrollieren und darauf zuzugreifen, was die Eingabe der Spielsteuerung verbessert.

Physik

- Es wurde ein Zeitproblem behoben, das zu einem falschen Verhalten der Physik führte.

Rendering

- Es wurde ein Problem behoben, das dazu führte, dass Materialien ausgewaschen aussahen.

UI

- Es wurde die Möglichkeit hinzugefügt, UI-Elemente in der Szene auszublenden, um ein dynamischeres UI-Verhalten zu ermöglichen.

## August 2024 [Update 1] {#version-2024-august-01}

1. August 2024

### Neue Funktionen

Animation

- Hinzufügen von Ereignissen und Konfigurationskontrollen zur Unterstützung von GLTF-Modellen mit vorgefertigten Animationen - siehe [3D Model guide](/studio/guides/models/)

Hierarchie

- Es wurde die Möglichkeit hinzugefügt, Objekte mit den Befehls-/Strg-Tasten mehrfach auszuwählen und zu verschieben.
- Es wurde die Möglichkeit hinzugefügt, Objekte mit der Umschalttaste auszuwählen.

Physik

- Ein Gravitationsfaktor für Physik und Kollider wurde hinzugefügt, um mehr konfigurierbare Physikeffekte zu unterstützen - siehe [Physics guide](/studio/guides/physics/).

Primitive

- Primitiver Typ RingGeometry hinzugefügt - siehe [Primitives guide](/studio/guides/models#primitives)

Ansichtsfenster

- Rechtsklick-Kontextmenü für ausgewählte Objekte hinzugefügt.
- Das Einrasten der Transformation bei gedrückter Umschalttaste wurde hinzugefügt.

### Korrekturen und Erweiterungen

Vermögenswerte

- Problem behoben, bei dem neue Dateien nicht hinzugefügt und Assets nicht verschoben werden konnten.

Kamera

- Fehler behoben, bei dem die Einstellung "Nah/Fern-Clip" nicht funktionierte.

Eingabe-Manager

- Problem behoben, bei dem die Pfeiltasten links/rechts vertauscht waren.

Simulator

- Die Größe des Simulators kann jetzt geändert werden.

UI

- Fehler behoben, der Änderungen der Schriftgröße für UI-Elemente verhinderte.

Ansichtsfenster

- 3D-Modelle, die in das Ansichtsfenster gezogen werden, rasten jetzt an der aktuellen Position des Mauszeigers ein.

Verschiedenes

- Verschiedene Verbesserungen der Benutzerfreundlichkeit der UI.
- Verbesserungen beim Kopieren und Einfügen von Objekten.

## Juni 2024 [Update 1] {#version-2024-june-18}

18. Juni 2024

### Neue Funktionen

Erste Veröffentlichung von 8th Wall Studio! Hallo Welt!

- Zu den wichtigsten Aktualisierungen gehören erste Systeme und Editor-Tools für Physik, Animationen, Spielereingaben, Kameras, Beleuchtung, Partikel, Audio, 3D-Modelle, Materialien, Meshes und vieles mehr. Weitere Informationen zu diesen Systemen finden Sie in der Studio-Dokumentation.
