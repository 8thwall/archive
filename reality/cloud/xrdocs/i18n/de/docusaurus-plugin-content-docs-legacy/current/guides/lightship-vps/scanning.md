---
sidebar_position: 3
---

# Standorte scannen

## Scaniverse für Niantic-Entwickler {#scaniverse-for-niantic-developers}

Scaniverse für Niantic-Entwickler integriert den Geospatial Browser (GSB)
nahtlos mit der preisgekrönten Scaniverse-Erfahrung. Mit
werden die Arbeitsabläufe von Entwicklern beim Durchsuchen der Karte, beim Hinzufügen von Standorten und beim Scannen von
erheblich vereinfacht:

- Wir haben den Geospatial Browser (GSB) mobilfreundlich gestaltet, so dass er innerhalb von
  Scaniverse effektiv genutzt werden kann, um die Karte zu durchsuchen, Standorte zu prüfen, Standorte hinzuzufügen und die VPS-Aktivierung zu beantragen.
- Vereinfachte Anmeldung über einen einfachen QR-Code, der Scaniverse mit Ihrem
  8th Wall-Konto verbindet.
- Wir haben die bestehende Benutzeroberfläche von Scaniverse übernommen, um das Erstellen und Hochladen von Scans zu erleichtern.
- Wir haben das Testen der Lokalisierung an VPS-aktivierten Standorten in Scaniverse aktiviert.
- Wir haben unsere neuesten Verbesserungen bei der Kartenfilterung integriert, damit es einfacher denn je ist, den/die
  Standort(e) zu finden, nach denen Sie suchen.

### Verknüpfung von Scaniverse mit dem Geospatial Browser (GSB) {#linking-scaniverse-with-the-geospatial-browser}

**Voraussetzung**: Installieren Sie Scaniverse aus dem iOS [App Store](https://apps.apple.com/us/app/scaniverse-3d-scanner/id1541433223). Die Unterstützung für Android-Geräte ist in Vorbereitung.

1. Melden Sie sich auf Ihrem Desktop bei Ihrem 8th Wall-Konto an. Öffnen Sie den **Geodaten-Browser (GSB)**, wählen Sie einen beliebigen Ort
   auf der Karte aus, und wählen Sie dann **Details anzeigen**. Drücken Sie in der unteren rechten Ecke der Karte mit den Standortangaben
   auf **QR-Code generieren**. Es wird ein QR-Code angezeigt.

![Scaniverse1](/images/scaniverse1.png)

2. Scannen Sie den **QR-Code** mit Ihrer Kamera-App. Öffnen Sie die Kamera-App auf Ihrem Telefon und richten Sie sie auf den QR-Code.

3. Tippen Sie auf den Link **Scaniverse**, der angezeigt wird. Dadurch wird Scaniverse mit Ihrem 8th Wall
   Entwicklerkonto verknüpft. Dieser Vorgang muss nur einmal durchgeführt werden.
   :::info
   **Stellen Sie sicher, dass Sie www.8thwall.com erlauben,
   Ihren aktuellen Standort zu verwenden, wenn Sie dazu aufgefordert werden; dies ist für den ordnungsgemäßen Betrieb der GSB-Schnittstelle erforderlich.**

![Scaniverse2](/images/scaniverse2.png)

4. Sobald Sie Scaniverse mit GSB verknüpft haben, können Sie jederzeit zum GSB-Bildschirm zurückkehren
   , indem Sie auf die **GSB-Schaltfläche** in der unteren Leiste der Scaniverse-App tippen. Beachten Sie, dass Sie
   Scaniverse jederzeit vom GSB trennen können, indem Sie im Menü **Einstellungen** die Option **Niantic
   Entwicklermodus** deaktivieren.

5. Alle Scans, die du außerhalb des Niantic-Entwicklermodus gemacht hast, bleiben zugänglich, wenn
   Scaniverse mit GSB verknüpft/entkoppelt.

![Scaniverse3](/images/scaniverse3.png)

### Durchsuchen der GSB-Karte in Scaniverse

1. Wenn Sie auf das Symbol **Person** tippen, können Sie Ihren 8. Wandarbeitsplatz auswählen.

2. Wenn Sie auf die Schaltfläche **Hochladen** tippen, können Sie die hochzuladenden Ortsscans auswählen. Beachten Sie, dass
   nur Scans, die aus dem Niantic-Entwicklermodus stammen (unter Verwendung der Optionen "Scans hinzufügen" oder "Testscan"), für die VPS-Aktivierung an Niantic hochgeladen werden können
   .

3. Wenn Sie auf die Schaltfläche **Plus** tippen, können Sie neue Standorte und Testscans erstellen.

4. Durch Tippen auf die Schaltfläche **Ebenen** können Sie die Satellitenansicht der Karte einschalten.

5. Durch Tippen auf die Schaltfläche **Reticule** wird die Karte auf Ihren Standort zentriert.

6. Wenn Sie auf die Schaltfläche **Kompass** tippen, wird die Karte wieder standardmäßig nach Norden ausgerichtet.

7. Über die Schaltfläche **Steuerung** können Sie die Standorte, die auf der Karte
   angezeigt werden, nach Größe, Kategorie oder Aktivierungsstatus filtern.

8. Die Schaltfläche **Lupe** ermöglicht Ihnen die Suche auf der Karte.

9. Durch Tippen auf die Schaltfläche **X** wird der GSB geschlossen und Sie kehren zum Scaniverse-Startbildschirm zurück.

![Scaniverse4](/images/scaniverse4.jpg)

10. Wenn Sie einen Ort auf der Karte auswählen, wird ein **Vorschaubild** angezeigt, das Sie antippen können, um weitere Details zu
    zu erhalten.

11. Wenn Sie einen VPS-aktivierten Standort ausgewählt haben, können Sie auf die Schaltfläche **VPS testen** tippen, um zu überprüfen, ob die
    Lokalisierung funktioniert.

12. Um einen Scan zu erstellen, der einem bestimmten Ort hinzugefügt werden soll, tippen Sie auf die Schaltfläche **Scans hinzufügen** des entsprechenden
    Ortes. Beachten Sie, dass Sie sich in der Nähe des Ortes befinden müssen, damit die Option Scans hinzufügen verfügbar ist.

![Scaniverse5](/images/scaniverse5.png)

### Erstellen und Hochladen von Scans

1. Die Schaltfläche **Aufzeichnen** dient zum Starten und Stoppen des Scanvorgangs.

2. Mit der Schaltfläche **Pause** können Sie den Scanvorgang vorübergehend unterbrechen, falls gewünscht.

3. Die Anzeige **Zeit** zeigt die Dauer des aktuellen Suchlaufs an. Eine Mindestlänge von 15 Sekunden
   ist erforderlich, damit ein Scan für den Upload für VPS-Entwicklungszwecke geeignet ist. Eine Scanlänge von 30-60
   Sekunden ist ideal (Scans, die länger als 60 Sekunden dauern, werden in mehrere Teile aufgeteilt, um
   zu verarbeiten).

4. Wenn Sie auf die Schaltfläche **X** tippen, kehren Sie zum Startbildschirm von Scaniverse zurück.

![Scaniverse6](/images/scaniverse6.png)

5. Wenn Sie einen Scan abgeschlossen haben, können Sie ein **Vorschaunetz** der von Ihnen erfassten Szene
   einsehen.

6. Wenn Sie mit Ihrem Scan zufrieden sind, können Sie ihn sofort hochladen, indem Sie auf die Schaltfläche **Upload
   Scan** klicken.

7. Sie können auch **Später hochladen** wählen, wenn Sie eine WiFi-Verbindung nutzen möchten (empfohlen).

8. Wenn Sie mit Ihrem Scan nicht zufrieden sind, können Sie ihn durch Drücken der Taste **Löschen** verwerfen.

![Scaniverse7](/images/scaniverse7.png)

## Installation von Niantic Wayfarer {#installing-niantic-wayfarer}

Wir unterstützen derzeit nur die Wayfarer App auf iOS, die eine Alternative zu scaniverse ist. Um neue VPS
Standorte zu scannen oder Scans zu bereits aktivierten Standorten hinzuzufügen, lesen Sie bitte unten die Anweisungen zur Installation und zur Verwendung von
.

### iOS {#ios}

Die Niantic Wayfarer App erfordert iOS 12 oder höher und ein iPhone 8 oder höher. Ein LiDAR-fähiges Gerät
ist **nicht** erforderlich.

Um die Niantic Wayfarer App zu installieren, gehe auf
[Testflug für Niantic Wayfarer](https://testflight.apple.com/join/VXu1F2jf)
([8th.io/wayfarer-ios](https://8th.io/wayfarer-ios))
auf deinem iOS-Gerät.

## Verwendung von Niantic Wayfarer {#using-niantic-wayfarer}

Du kannst mit der Niantic Wayfarer App Scans zu [Öffentlichen Orten](./vps-locations.md#location-types) hinzufügen sowie
[Test Scans](./vps-locations.md#test-scans) erstellen.

Sobald Sie die App installiert haben, melden Sie sich mit Ihren 8th Wall-Zugangsdaten an, indem Sie auf die Schaltfläche _Login with
8th Wall_ klicken.

Wenn Sie Zugang zu mehreren Arbeitsbereichen haben, wählen Sie einen Arbeitsbereich aus, indem Sie auf der Profilseite auf das Dropdown-Menü _8th Wall Workspace_
klicken.

| Login-Seite                                           | Profil Seite                                              |
| ----------------------------------------------------- | --------------------------------------------------------- |
| ![wayfarer app login](/images/wayfarer-app-login.jpg) | ![wayfarer app profile](/images/wayfarer-app-profile.jpg) |

Wählen Sie auf der Seite _Karte_ einen VPS-Standort, um einen Scan zu einem öffentlichen Standort hinzuzufügen (1), oder wählen Sie _Scan_, um einen Testscan zu Ihrem Arbeitsbereich hinzuzufügen (2).

Führen Sie einen Scan des Bereichs mit der empfohlenen [Scan-Technik] durch (#scanning-technique).

| Karte Seite                                         | Seite scannen                                       |
| --------------------------------------------------- | --------------------------------------------------- |
| ![wayfarer add scan](/images/wayfarer-add-scan.jpg) | ![wayfarer scanning](/images/wayfarer-scanning.jpg) |

Wählen Sie nach Abschluss des Scans entweder "Öffentlich" oder "Test" und laden Sie die Datei hoch.

| Scan-Typ                                              | Scan-Upload                                               |
| ----------------------------------------------------- | --------------------------------------------------------- |
| ![wayfarer scan type](/images/wayfarer-scan-type.jpg) | ![wayfarer scan upload](/images/wayfarer-scan-upload.jpg) |

Die Bearbeitung von Scans kann 15-30 Minuten dauern. Sobald die Scans verarbeitet sind, werden sie im Geodatenbrowser angezeigt.

Fragen im Zusammenhang mit dem Scannen oder der Verarbeitung sollten an [support@lightship.dev](mailto://support@lightship.dev) gerichtet werden.

Weitere Informationen zur Verwendung der Wayfarer-App finden Sie in der [Lightship-Dokumentation](https://lightship.dev/docs/ardk/vps/generating_scans.html#using-the-niantic-wayfarer-app).

## Scanning-Technik {#scanning-technique}

Gescannte VPS-aktivierte Standorte sollten nicht größer sein als ein Durchmesser von 10 Metern um den Standort herum.
Eine typische Statue würde zum Beispiel als VPS-aktivierter Standort funktionieren. Ein ganzes Gebäude jedoch,
, nicht. Ein Gesicht oder eine Tür/ein Eingang zu einem Gebäude könnte funktionieren. Wir empfehlen, sich zunächst auf
kleinere Flächen zu beschränken (z. B. einen Schreibtisch, eine Statue oder ein Wandbild).

Machen Sie sich vor dem Scannen ein Bild von Ihrer Umgebung und vergewissern Sie sich, dass Sie das Recht haben, den Ort
zu betreten, den Sie scannen.

1. Überprüfen Sie den zu scannenden Bereich und die Umgebung des gescannten Objekts, um festzustellen, ob es
   irgendwelche Hindernisse gibt, und um eine Scanroute auszuwählen. Bevor Sie mit dem Scannen beginnen, müssen Sie die Route planen, die Sie für
   verwenden möchten.

2. Stellen Sie sicher, dass Ihre Kamera scharf eingestellt ist. Kameraverwacklungen können die 3D-Rekonstruktion negativ beeinflussen. Halten Sie
   Ihr Telefon so nah wie möglich an Ihrer Seite, um Unschärfe zu vermeiden. Gehen Sie um das Objekt herum, das Sie
   scannen, anstatt an einer Stelle zu stehen und Ihr Telefon zu bewegen.

3. Gehen Sie in einem langsamen und natürlichen Schritttempo. Bewegen Sie sich beim Scannen langsam und gleichmäßig. Plötzliche Richtungsänderungen
   sind ein absolutes Tabu. Bewegen Sie sich langsam und gleichmäßig mit den Füßen auf dem Boden. Wenn Sie
   in einer dunkleren Umgebung scannen, ist es noch wichtiger, dass Sie sich langsam und gleichmäßig bewegen. Bewegen Sie das Telefon
   mit Ihnen, während Sie sich bewegen (z. B.

4. Der VPS-Standort sollte immer im Mittelpunkt stehen. Damit wir die Karte erstellen können, ist es wichtig, dass
   sich auf den VPS-Standort konzentriert und die volle 360°-Umlaufbahn davon erfasst. Wenn es nicht sicher oder nicht
   möglich ist, einen 360°-Rundumblick zu erhalten, sollten Sie so viel wie möglich aufnehmen.

5. Variieren Sie die Entfernung/Winkel (0-10m oder 0-35ft). Damit die 3D-Karte in verschiedenen
   Szenarien gut funktioniert, ist es wichtig, dass wir die Umgebung des Standorts erfassen und eine Vielzahl von
   verschiedenen Scans haben. Es ist wichtig, dass Sie beim Scannen des Standorts die Entfernung und den Winkel variieren.

Video der empfohlenen VPS-Standort-Scan-Technik:

```mdx-code-block
<iframe width="560" height="315" src="https://www.youtube.com/embed/FYS3fe5drf0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
```

#### Dinge, die beim Scannen von {#things-to-avoid-while-scanning}zu vermeiden sind

1. Vermeiden Sie das Scannen, wenn die Umgebung nicht sicher ist, z. B. mitten auf der Straße oder auf einem
   Spielplatz mit Kindern.

2. Vermeiden Sie es, den Standort zu scannen, wenn er zu weit entfernt ist (>10m oder 35ft) oder zu groß, um ihn mit der Kamera zu fokussieren
   .

3. Vermeiden Sie das Scannen während eines Spaziergangs oder einer Joggingrunde. Es ist wichtig, dass Sie den
   Standort immer im Blick haben.

4. Richten Sie Ihr Telefon nicht auf sehr helle Objekte wie Neonröhren oder die Sonne.

5. Vermeiden Sie es, sich beim Scannen nicht oder zu schnell zu bewegen. Abrupte Bewegungen führen zu Verschiebungen in der
   Rekonstruktion.

6. Vermeiden Sie das Scannen, wenn Ihr Telefon zu heiß wird. Wenn die Temperatur des Geräts zu hoch ansteigt, wird die Leistung des Geräts
   stark reduziert, was sich negativ auf den Scanvorgang auswirkt.

7. Vermeiden Sie es, Scans hochzuladen, die unvollständig oder nicht repräsentativ für das sind, was Sie zu scannen versuchen
   .