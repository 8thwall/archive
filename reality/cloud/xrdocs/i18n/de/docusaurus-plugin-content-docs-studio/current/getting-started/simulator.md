---
id: simulator
sidebar_position: 5
---

# Simulator

## Übersicht

Starten Sie den Simulator, um Ihre Szene abzuspielen. Sie können Änderungen an den Objekten in Ihrem Raum vornehmen und
sehen, dass diese sofort im Simulator angezeigt werden. Mit dem Simulator können Sie auch Projektänderungen in verschiedenen Geräteansichtsgrößen und
simulierten realen Umgebungen testen und anzeigen, ohne Studio verlassen zu müssen.

![Simulator1](/images/studio/studio-navigate-simulator1.png)

![Simulator2](/images/studio/studio-navigate-simulator2.png)

## AR-Simulator

Wenn Sie AR entwickeln, können Sie auf eine Sammlung von voraufgezeichneten Kamerasequenzen zugreifen.
Der AR-Simulator verfügt über eine Reihe von Wiedergabesteuerungen und Komfortfunktionen wie
:

- Abspielbalken, Scrubber und In-/Out-Griffe: Ermöglicht das Einrichten von Loop-Punkten, so dass Sie eine granulare
  Kontrolle über die ausgewählte Sequenz erhalten.
- Schaltfläche "Zurücksetzen" (unten rechts): Setzt das Kamerabild wieder an seinen Ausgangspunkt zurück. HINWEIS: Bei jeder Schleife der Sequenz und bei jeder Auswahl einer neuen Sequenz wird auch
  aufgerufen.

![ARSimulator](/images/studio/studio-ar-simulator.png)

Verwenden Sie das Menü "Sequenzauswahl" unten links, um die AR-Sequenz zu ändern. Mit dem Karussell
können Sie zwischen den Optionen der Kategorie "Reihenfolge" wechseln. Wenn Sie die Sequenz anhalten, wird nur das Video angehalten,
so dass Sie Änderungen an demselben Bild testen können. Ziehen Sie die Wiedergabegriffe, um Schleifenein- und -ausgänge zu setzen.

![SimulatorSequenceSelector](/images/studio/studio-sequence-selector.png)

Die Kamerataste in der rechten unteren Ecke öffnet die Live-Ansicht, die der gleichen Logik folgt wie die Kamerakonfiguration Ihres Projekts. Mit der Live-Ansicht können Sie Ihr Projekt simulieren, indem Sie den Feed von Ihrem Desktop anstelle einer zuvor aufgezeichneten AR-Sequenz verwenden. Wenn Ihr Projekt
beispielsweise Face Effects verwendet und Sie das Studio-Projekt auf dem Desktop geöffnet haben, wird die Desktop-Kamera
geöffnet.

:::note
In der Live-Ansicht im Simulator werden Sie möglicherweise aufgefordert, die Berechtigungen für Kamera, Mikrofon oder Standort
zu aktivieren, je nachdem, was in Ihrem Projekt aktiviert ist. Klicken Sie auf Erlaubnis erteilen, um
Ihre Erfahrungen in der Live-Ansicht zu sehen.
:::

Ihr Projekt kann auf verschiedenen Geräten aufgrund von Unterschieden in der Ansichtsgröße des mobilen Webs
unterschiedlich aussehen. Oder Sie möchten Ihr Projekt sowohl im Quer- als auch im Hochformat sehen. Oben auf
links im Simulator können Sie aus einer Reihe gängiger Geräteansichtsgrößen auswählen, die Ausrichtung von
ändern oder den responsiven Modus zur Anpassung an eine benutzerdefinierte Größe verwenden. Sie können auch auf die Ränder
des Simulator-Panels doppelklicken, um den Simulator automatisch an die Breite des ausgewählten Gerätefensters
anzupassen. \*\*Hinweis: Die Abmessungen werden in logischen CSS-Pixeln (AKA-Viewport-Abmessungen) angegeben, nicht in physischen
-Gerätepixeln. Wenn ein Gerät aus dem Selektor ausgewählt wird, werden nur die Abmessungen des Ansichtsfensters
aktualisiert, nicht aber der User Agent des Clients.

![SimulatorDeviceSelector](/images/studio/studio-device-selector.png)

Sie können auch bestimmte GPS-Koordinaten simulieren, wenn Sie ein orts- oder kartenbasiertes Erlebnis entwickeln.

![SimulatorLocation](/images/studio/studio-simulator-location.png)
