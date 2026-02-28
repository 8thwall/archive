---
id: simulator
sidebar_position: 2
---

# Simulator

Wenn Sie Ihre Szene abspielen wollen, wird eine Simulator-Instanz verbunden. Der Simulator wird per Fernzugriff
die im Ansichtsfenster vorgenommenen Änderungen wiedergeben.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

Mit dem Simulator können Sie Projektänderungen in verschiedenen Geräteansichtsgrößen und
simulierten realen Umgebungen testen und anzeigen, ohne Studio verlassen zu müssen. Der Simulator funktioniert, indem er
die 8th Wall AR Engine in Echtzeit über die mitgelieferte Sammlung von voraufgezeichneten AR-Sequenzen laufen lässt.
Sie können so viele Simulatorinstanzen öffnen, wie Sie möchten, und so Projektänderungen in einer Vielzahl von Szenarien testen
. Der Simulator verfügt über eine Reihe von Wiedergabesteuerungen und Komfortfunktionen wie
:

- Abspielbalken, Scrubber und In-/Out-Griffe: Ermöglicht das Einrichten von Loop-Punkten, so dass Sie eine granulare
  Kontrolle über die ausgewählte Sequenz erhalten.
- Schaltfläche "Zurücksetzen" (unten rechts): Setzt das Kamerabild wieder an seinen Ausgangspunkt zurück. HINWEIS: Bei jeder Schleife der Sequenz und bei jeder Auswahl einer neuen Sequenz wird auch
  aufgerufen.
- Schaltfläche Aktualisieren (oben rechts): Aktualisiert die Seite, wobei zwischengespeicherte Inhalte erhalten bleiben. Wenn Sie die UMSCHALTTASTE gedrückt halten und auf
  auf die Schaltfläche "Aktualisieren" klicken, wird eine vollständige Neuladung durchgeführt, wobei alle zwischengespeicherten Inhalte ignoriert werden.

Sie können Ihr Erlebnis in einer Reihe von verschiedenen AR-Sequenzen simulieren, mit denen Sie Effekte wie Face
, Hand Tracking, World Effects, Absolute Scale, Shared AR und vieles mehr testen können. Eine AR-Sequenz umfasst
sowohl die Videoaufzeichnungsdaten als auch die Gyroskop- oder Orientierungsdaten des Geräts, so dass Sie
AR simulieren können. Verwenden Sie das Menü "Sequenzauswahl" unten links, um die AR-Sequenz zu ändern. Mit dem Karussell
können Sie zwischen den Optionen der Kategorie "Reihenfolge" wechseln. Wenn Sie die Sequenz anhalten, wird nur das Video angehalten,
so dass Sie Änderungen an demselben Bild testen können. Ziehen Sie die Wiedergabegriffe, um Schleifenein- und -ausgänge zu setzen.

![Simulator2](/images/studio/studio-navigate-simulator2.png)

![SimulatorSequenceSelector](/images/simulator-sequence-selector.jpg)

Die Live-Ansicht folgt der gleichen Logik wie die Kamerakonfiguration Ihres Projekts und ermöglicht es Ihnen,
Ihr Projekt zu simulieren, indem Sie den Feed von Ihrem Desktop anstelle einer zuvor aufgezeichneten AR-Sequenz verwenden. Wenn Ihr Projekt
zum Beispiel Face Effects verwendet und Sie das Studio-Projekt auf dem Desktop geöffnet haben, wird die Desktop-Kamera
geöffnet. Hinweis: Bei der Live-Ansicht im Simulator werden Sie möglicherweise aufgefordert, die Berechtigungen für Kamera, Mikrofon oder Standort zu aktivieren
, je nachdem, was in Ihrem Projekt aktiviert ist. Klicken Sie auf Erlaubnis erteilen, um
Ihre Erfahrungen in der Live-Ansicht zu sehen.

Ihr Projekt kann auf verschiedenen Geräten aufgrund von Unterschieden in der Ansichtsgröße des mobilen Webs
unterschiedlich aussehen. Oder Sie möchten Ihr Projekt sowohl im Quer- als auch im Hochformat sehen. Oben auf
links im Simulator können Sie aus einer Reihe gängiger Geräteansichtsgrößen auswählen, die Ausrichtung von
ändern oder den responsiven Modus zur Anpassung an eine benutzerdefinierte Größe verwenden. Sie können auch auf die Ränder
des Simulator-Panels doppelklicken, um den Simulator automatisch an die Breite des ausgewählten Gerätefensters
anzupassen. \*\*Hinweis: Die Abmessungen werden in logischen CSS-Pixeln (AKA-Viewport-Abmessungen) angegeben, nicht in physischen
-Gerätepixeln. Wenn ein Gerät aus dem Selektor ausgewählt wird, werden nur die Abmessungen des Ansichtsfensters
aktualisiert, nicht aber der User Agent des Clients.

![SimulatorDeviceSelector](/images/simulator-device-selector.jpg)

## Ein Gerät anschließen

1. Klicken Sie am unteren Rand des Studiofensters auf die Schaltfläche **Gerät verbinden**.

2. Scannen Sie den QR-Code mit Ihrem Mobilgerät, um einen Webbrowser zu öffnen und eine Live-Vorschau des Projekts anzuzeigen.

![GettingStartedPreview](/images/editor-preview.jpg)

**Hinweis**: Der "Vorschau"-QR-Code ist ein \*\*vorübergehender, einmalig verwendbarer QR-Code
\*\*, der nur für die Verwendung durch den Entwickler während der aktiven Arbeit am Projekt gedacht ist. Dieser QR-Code
führt Sie zu einer privaten, für die Entwicklung bestimmten URL, die für andere nicht zugänglich ist. Um Ihre Arbeit mit
zu teilen, lesen Sie bitte den Abschnitt **Veröffentlichung Ihres Projekts**.
