---
sidebar_label: FAQ
sidebar_position: 5
---

# VPS FAQ {#lightship-vps-faq}

## Was ist Lightship VPS? {#what-is-lightship-vps}

Lightship VPS (Visual Positioning System) ist ein Cloud-Service, der es Anwendungen ermöglicht, das Gerät eines
Nutzers an realen Orten zu lokalisieren, so dass Nutzer mit persistenten AR-Inhalten interagieren können und
neue immersive Erfahrungen ermöglicht. VPS bestimmt die Position und Ausrichtung (Pose) des Geräts, indem
auf Kartendaten in der Cloud von Niantic verweist.

## Wie funktioniert VPS? {#how-does-vps-work}

Wenn ein Gerät den VPS-Dienst anruft, empfängt der Dienst ein Abfrage-Bild vom Gerät des Benutzers
zusammen mit dessen ungefährem Standort (von GPS) als Eingaben und versucht, ihn anhand der
Karte(n) zu lokalisieren, die an diesem Standort existieren. Bei erfolgreicher Lokalisierung gibt der Dienst
die Position und Ausrichtung (Pose) des Geräts zurück, die mit dem Zeitstempel des übermittelten Bildes
übereinstimmen. Da eine Zeitverzögerung zwischen der Aufnahme eines VPS-Abfragebildes und dem Empfang einer Antwort von
vom VPS-Dienst besteht, muss das Gerät über ein System zur Bewegungsverfolgung (
) verfügen, um während der Bewegung genau lokalisiert zu bleiben. Wenn der VPS-Dienst eine Posenschätzung an das Gerät
sendet, wird der Unterschied in der Pose vom Tracking-System des Geräts zur Antwort der Lokalisierung
hinzugefügt, so dass der VPS mit der Bewegung des Geräts "Schritt halten" kann, während er auf die Antwort des Servers
auf die VPS-Anfrage wartet.

## Was ist ein Scan? {#what-is-a-scan}

AR-Scans von Spielern, Entwicklern und Vermessern sind die Grundlage für die Erstellung der
Niantic Map: Die 3D-Weltkarte von Niantic. AR-Scans werden mit dem AR-Scan-Framework von Niantic
aufgezeichnet und hochgeladen, einem Modul, das in Pokemon Go, Ingress und der Wayfarer-App verwendet wird. Jeder AR
-Scan besteht aus einer Reihe von Videobildern mit unterstützenden Daten von Beschleunigungsmessern und GPS-Sensoren
, die ein 3D-Modell der Welt aus mehreren 2D-Bildern erstellen. AR-Scans werden von Niantic verwendet, um
Karten und Meshes von realen Orten zu erstellen.

## Was ist eine Karte? {#what-is-a-map}

Im VPS-Jargon ist eine Karte das Datenartefakt, das zur Lokalisierung Ihres Geräts verwendet wird, wenn die VPS-API
aufgerufen wird. Eine Karte kann man sich als eine Funktion vorstellen, die ein Abfragebild als Eingabe nimmt und dann
Position und Ausrichtung (Pose) als Ausgabe zurückgibt. Die Karte, die einem bestimmten Ort entspricht, wird
aus den Scans erstellt, die an diesem Ort hochgeladen wurden. VPS-Karten sind nicht für Menschen lesbar.

## Was ist eine Masche? {#what-is-a-mesh}

Im VPS-Jargon ist ein Netz ein 3D-Modell eines realen Ortes oder Objekts. Meshes bieten eine detaillierte
Darstellung eines physischen Raums oder Objekts und sind nützlich, um zu verstehen, wie ein Ort
aussieht, als Referenz für die Erstellung von AR-Inhalten und für die Erstellung von Physik- und Okklusionseffekten. Wie bei
werden Meshes, die einem bestimmten Ort entsprechen, aus den Scans erstellt, die unter
an diesem Ort hochgeladen wurden. Meshes sind sowohl für Menschen als auch für Maschinen lesbar.

## Wo kann ich VPS nutzen? {#where-can-i-use-vps}

VPS ist an über 150.000 realen Standorten verfügbar, und täglich kommen weitere Standorte hinzu. Unter
muss eine ausreichende Menge an AR-Scandaten auf
hochgeladen und der VPS-Aktivierungsprozess abgeschlossen werden, damit ein Standort auf der VPS verfügbar ist. Entwickler können neue Standorte auf
der Karte hinzufügen und die VPS-Aktivierung vollständig gescannter Standorte über den Geospatial Browser anfordern.

## Wie funktioniert die VPS-Aktivierung? {#how-does-vps-activation-work}

Damit ein Standort für die VPS-Aktivierung in Frage kommt, müssen mindestens 10 Scans hochgeladen werden, die die Mindestqualitätsprüfungen von
bestehen, und die Zeitdifferenz zwischen den ältesten und neuesten Scans am Standort
muss mindestens 5 Stunden betragen. Diese Anforderungen stellen sicher, dass die resultierenden Karten und Netze von
ausreichender Qualität sind und genügend Variationen erfassen, so dass die Benutzer in der Lage sind, zuverlässig zu lokalisieren.
Der VPS-Aktivierungsprozess läuft über die AR-Mapping-Infrastruktur von Niantic und umfasst viele komplexe Schritte
. Aus dem Pool der in Frage kommenden Scans am Standort wählt ein Algorithmus die meisten Scans aus, um
für die Erstellung von Karten und Netzen zu verwenden, und die verbleibende Handvoll für die Validierung und die Messung der Lokalisierungsqualität
. Der Aktivierungsprozess für einen Standort läuft auf den Servern von Niantic und dauert normalerweise
1-2 Stunden.

## Kann ich meine Scans finden, nachdem die VPS-Aktivierung abgeschlossen ist? {#can-i-find-my-scans-after-vps-activation-is-done}

Während des Aktivierungsprozesses werden die Karten und Netze, die aus den hochgeladenen Scans erstellt wurden, mit
verschmolzen, um so viele Informationen wie möglich einzubeziehen. Das Endprodukt, das
von Entwicklern zur Erstellung von Inhalten und von Benutzern zur Lokalisierung verwendet wird, besteht aus Scans aus vielen verschiedenen
Quellen. Die Scandaten werden gemischt, um eine umfassendere Darstellung des Standorts zu erstellen,
. Es besteht also keine Eins-zu-eins-Beziehung zwischen den Scans, die an einem Standort hochgeladen werden, und den
Karten und Netzen, die nach der VPS-Aktivierung erstellt werden.

## Kann ich weitere Scans zu einem bereits aktivierten Standort hinzufügen? {#can-i-add-more-scans-to-a-location-thats-already-activated}

In manchen Fällen möchten Entwickler zusätzliche Scans zu einem Standort hinzufügen, der zuvor unter
aktiviert wurde, um die Qualität und den Abdeckungsgrad der Karten und Meshes des Standorts zu verbessern. Damit ein Standort für eine "Reaktivierung" in Frage kommt, müssen seit der letzten Aktivierung mindestens 5 zusätzliche Scans
hochgeladen worden sein (
). Wichtig ist, dass es noch nicht möglich ist, neue Scans
zu einer bestehenden fusionierten Karte hinzuzufügen. Vielmehr muss für die Reaktivierung eine neue fusionierte Karte
erstellt werden, die die neuen Scans in den Kontext der bestehenden Scans einbezieht.

## Wie beantrage ich die VPS-Aktivierung für einen neuen Standort? {#how-do-i-request-vps-activation-of-a-new-location}

Sobald ein Standort genügend Scans hochgeladen hat, um die Anforderungen für die VPS-Aktivierung zu erfüllen (insgesamt mindestens 10
Scans mit einem Zeitunterschied von mindestens 5 Stunden zwischen dem ältesten und dem neuesten Scan), können Entwickler unter
die VPS-Aktivierung beantragen, indem sie den Standort in der Wayfarer App oder im Geospatial Browser auswählen und unter
auf die Schaltfläche "aktivieren" klicken. Dadurch wird der Ort in die Aktivierungswarteschlange aufgenommen. Normalerweise wird eine
Aktivierungsanfrage innerhalb von 2 Stunden bearbeitet. Die Entwickler haben auch die Möglichkeit, die Reaktivierung eines bestehenden Standorts unter
zu beantragen, sobald 5 zusätzliche Scans hochgeladen wurden.

## Funktioniert VPS auch nachts oder bei schlechten Wetterbedingungen? {#does-vps-work-at-night-or-in-poor-weather-conditions}

VPS funktioniert am besten, wenn eine gute Sichtbarkeit gegeben ist. Um die Wahrscheinlichkeit erfolgreicher
VPS-gestützter Erfahrungen zu maximieren, ist es am besten, viele AR-Scans hochzuladen, die eine große Bandbreite verschiedener
Bedingungen abdecken (z. B. verschiedene Tageszeiten, verschiedene Wetterbedingungen usw.). Wenn Sie zum Beispiel
ein Erlebnis an einem Ort aufbauen, an dem es viel regnet, ist es sehr hilfreich, einige Scans von einem Regentag zu haben
.

## Benötigen AR-Scanner und VPS Telefone mit LiDAR-Sensoren? {#do-ar-scanning-and-vps-require-phones-with-lidar-sensors}

Für AR-Scanning und VPS ist kein LiDAR erforderlich.
