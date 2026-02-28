---
id: image-targets
---

# Bild-Ziele

Erwecken Sie Schilder, Zeitschriften, Schachteln, Flaschen, Becher und Dosen mit den 8th Wall Image Targets zum Leben. 8th
Wall Web kann flache, zylindrische und konisch geformte Bildziele erkennen und verfolgen, so dass Sie mit
statische Inhalte zum Leben erwecken können.

Das von Ihnen festgelegte Bildziel kann nicht nur ein Web-AR-Erlebnis auslösen, sondern Ihre Inhalte haben auch die Möglichkeit, über
direkt zu diesem Ziel zu führen.

Bildziele können mit unserem World Tracking (SLAM) kombiniert werden und ermöglichen eine Kombination aus
Bildzielen und markerlosem Tracking.

Sie können bis zu 5 Bildziele gleichzeitig verfolgen, wenn World Tracking aktiviert ist, oder bis zu 10, wenn es
deaktiviert ist.

Es können bis zu 5 Bildziele pro Projekt **"Autoloaded "** werden. Ein automatisch geladenes Bildziel wird
sofort beim Laden der Seite aktiviert. Dies ist nützlich für Anwendungen, die 5 oder weniger Bildziele verwenden, wie z. B. Produktverpackungen, ein Filmplakat oder eine Visitenkarte.

Die Menge der aktiven Bildziele kann jederzeit durch Aufruf von
[XR8.XrController.configure()](/legacy/api/xrcontroller/configure) geändert werden. So können Sie Hunderte von Bildzielen
pro Projekt verwalten und Anwendungsfälle wie geografisch abgegrenzte Bildzieljagden, AR-Bücher, geführte
Kunstmuseumsführungen und vieles mehr ermöglichen. Wenn Ihr Projekt die meiste Zeit SLAM, aber einige Zeit Bildziele
verwendet, können Sie die Leistung verbessern, indem Sie nur Bildziele laden, wenn Sie sie benötigen. Sie
können sogar hochgeladene Zielnamen aus URL-Parametern lesen, die in verschiedenen QR-Codes gespeichert sind. So können Sie
in derselben Webanwendung zunächst unterschiedliche Ziele laden lassen, je nachdem, welche QR-Codes der Benutzer
scannt, um das Erlebnis zu betreten.

\*\*Hinweis: Benutzerdefinierte Bildziele können derzeit nicht im
[Simulator] (/legacy/getting-started/quick-start-guide/#simulator ) angezeigt werden.

## Bildzieltypen {#image-target-types}

\| |
\-|-|-
**Flat**|![FlatTarget](/images/flat.jpg)| Verfolgen Sie 2D-Bilder wie Poster, Schilder, Zeitschriften, Schachteln, usw. **Cylindrical**|![CylindricalTarget](/images/cylindrical.jpg)| Verfolgen Sie Bilder, die um zylindrische Gegenstände wie Dosen und Flaschen gewickelt sind.
**Konisch**|![ConicalTarget](/images/conical.jpg)| Verfolgen Sie Bilder, die um Objekte mit unterschiedlichem oberen und unteren Umfang gewickelt sind, z. B. Kaffeetassen usw.

## Bildzielanforderungen {#image-target-requirements}

- Dateitypen: **.jpg**, **.jpeg** oder **.png**
- Abmessungen:
  - Minimum: **480 x 640 Pixel**
  - Maximale Länge oder Breite: **2048 Pixel**.
    - Hinweis: Wenn Sie etwas Größeres hochladen, wird das Bild auf eine maximale Länge/Breite von 2048
      verkleinert, wobei das Seitenverhältnis erhalten bleibt.
- Hosting: Alle Bildziele müssen in Ihr 8th Wall Projekt hochgeladen werden, bevor sie auf
  verwendet werden können. Sie können den Rest Ihrer Web AR-Erfahrung selbst hosten (wenn Sie einen Enterprise oder Legacy Pro
  Plan haben), aber das Quellbild-Ziel wird immer von 8th Wall gehostet. Unter
  finden Sie Anweisungen zum Erstellen/Upload von flachen oder gekrümmten Bildzielen.

## Bild Zielmengen {#image-target-quantities}

Die Anzahl der Bildziele, die mit einem Projekt verknüpft werden können, ist nicht begrenzt. Allerdings gibt es unter
eine Begrenzung der Anzahl der Bildziele, die im Browser des Benutzers zu einem bestimmten Zeitpunkt **aktiv** sein können
.

- Aktive Bildziele pro Projekt: **32**

## Verwalten von Bildzielen {#manage-image-targets}

Klicken Sie auf das Symbol für Bildziele in der linken Navigation oder auf den Link "Bildziele verwalten" auf dem Projekt
Dashboard, um Ihre Bildziele zu verwalten.

![ManageImageTargets](/images/console-appkey-imagetargets.jpg)

Auf diesem Bildschirm können Sie die mit Ihrem Projekt verbundenen Bildziele erstellen, bearbeiten und löschen.
Klicken Sie auf ein vorhandenes Bildziel, um es zu bearbeiten.  Klicken Sie auf das "+"-Symbol für den gewünschten Bildzieltyp, um unter
ein neues Bildziel zu erstellen.

![ManageImageTargets2](/images/console-appkey-imagetarget-library.jpg)

## Flat Image Target erstellen {#create-flat-image-target}

1. Klicken Sie auf das Symbol "+ Flach", um ein neues Flachbildziel zu erstellen.

![ImageTargetFlat1](/images/image-target-create-flat.jpg)

2. **Flachbild-Ziel hochladen**: Ziehen Sie Ihr Bild (.jpg, .jpeg oder .png) in das Upload-Panel, oder klicken Sie in den gepunkteten Bereich und verwenden Sie Ihren Dateibrowser, um Ihr Bild auszuwählen.

3. **Verfolgungsregion** (und Ausrichtung) festlegen: Verwenden Sie den Schieberegler, um den Bereich des Bildes festzulegen, der für die Erkennung und Verfolgung Ihres Ziels innerhalb der WebAR-Erfahrung verwendet werden soll. Der Rest des Bildes wird verworfen, und der von Ihnen angegebene Bereich wird in Ihrem Erlebnis verfolgt.

![SetTrackingRegion](https://media.giphy.com/media/RCFntZ0hn5VO3W9Mld/giphy.gif)

4. **Eigenschaften des flachen Bildziels bearbeiten**:

- (1) Geben Sie Ihrem Bildziel einen **Namen**, indem Sie das Feld oben links im Fenster bearbeiten.
- (2) **WICHTIG!** Testen Sie Ihr Bildziel: Der beste Weg, um festzustellen, ob Ihr hochgeladenes Bild ein gutes oder schlechtes Bildziel darstellt (siehe [Optimierung der Bildzielverfolgung](#optimizing-image-target-tracking)), ist die Verwendung des Simulators zur Beurteilung der Verfolgungsqualität.  Scannen Sie den QR-Code mit Ihrer Kamera-App, um den Simulator-Link zu öffnen, und zeigen Sie dann mit Ihrem Gerät auf den Bildschirm oder das physische Objekt.
- (3) Klicken Sie auf **Automatisch laden**, wenn Sie möchten, dass das Bildziel beim Laden des WebAR-Projekts automatisch aktiviert wird. Bis zu 5 Bildziele können automatisch geladen werden, ohne dass eine einzige Zeile Code geschrieben werden muss.  Weitere Ziele können programmgesteuert über die Javascript-API geladen werden.
- (4) Optional: Wenn Sie Ihrem Bild Metadaten hinzufügen möchten, entweder im Text- oder JSON-Format, klicken Sie auf die Schaltfläche **Metadaten** am unteren Rand des Fensters.

![EditFlatImageTarget](/images/edit-flat-image-target.jpg)

5. Die auf diesem Bildschirm vorgenommenen Änderungen werden automatisch gespeichert.  Klicken Sie auf **Schließen**, um zu Ihrer Bildzielbibliothek zurückzukehren.

## Zylindrisches Bildziel erstellen {#create-cylindrical-image-target}

1. Klicken Sie auf das Symbol "+ Zylindrisch", um ein neues flaches Bildziel zu erstellen.

![ImageTargetFlat1](/images/image-target-create-cylindrical.jpg)

2. **Flachbild-Ziel hochladen**: Ziehen Sie Ihr Bild (.jpg, .jpeg oder .png) in das Upload-Panel, oder klicken Sie in den gepunkteten Bereich und verwenden Sie Ihren Dateibrowser, um Ihr Bild auszuwählen.

3. **Verfolgungsregion** (und Ausrichtung) festlegen: Verwenden Sie den Schieberegler, um den Bereich des Bildes festzulegen, der für die Erkennung und Verfolgung Ihres Ziels innerhalb der WebAR-Erfahrung verwendet werden soll. Der Rest des Bildes wird verworfen, und der von Ihnen angegebene Bereich wird in Ihrem Erlebnis verfolgt.

![](https://media.giphy.com/media/AdgvL3hqQAULWEHWTg/giphy.gif)

4. **Eigenschaften von zylindrischen Bildzielen bearbeiten**:

- (1) Geben Sie Ihrem Bildziel einen **Namen**, indem Sie das Feld oben links im Fenster bearbeiten.
- (2) **Ziehen Sie die Schieberegler**, bis die Form Ihres Etiketts im Simulator wie erwartet erscheint, oder **geben Sie die Maße** direkt ein.
- (3) **WICHTIG!** Testen Sie Ihr Bildziel: Der beste Weg, um festzustellen, ob Ihr hochgeladenes Bild ein gutes oder schlechtes Bildziel darstellt (siehe [Optimierung der Bildzielverfolgung](#optimizing-image-target-tracking)), ist die Verwendung des Simulators zur Beurteilung der Verfolgungsqualität.  Scannen Sie den QR-Code mit Ihrer Kamera-App, um den Simulator-Link zu öffnen, und zeigen Sie dann mit Ihrem Gerät auf den Bildschirm oder das physische Objekt.
- (4) Klicken Sie auf **Automatisch laden**, wenn Sie möchten, dass das Bildziel beim Laden des WebAR-Projekts automatisch aktiviert wird. Bis zu 5 Bildziele können automatisch geladen werden, ohne dass eine einzige Zeile Code geschrieben werden muss.  Weitere Ziele können programmgesteuert über die Javascript-API geladen werden.
- (5) Optional: Wenn Sie Ihrem Bild Metadaten hinzufügen möchten, entweder im Text- oder JSON-Format, klicken Sie auf die Schaltfläche **Metadaten** am unteren Rand des Fensters.

![EditCylindricalImageTarget](/images/edit-cylindrical-image-target.jpg)

5. Die auf diesem Bildschirm vorgenommenen Änderungen werden automatisch gespeichert.  Klicken Sie auf **Schließen**, um zu Ihrer Bildzielbibliothek zurückzukehren.

## Konisches Bildziel erstellen {#create-conical-image-target}

1. Klicken Sie auf das Symbol "+ Konisch", um ein neues flaches Bildziel zu erstellen.

![ImageTargetFlat1](/images/image-target-create-conical.jpg)

2. **Konisches Bildziel hochladen**: Ziehen Sie Ihr Bild (.jpg, .jpeg oder .png) in das Upload-Panel, oder klicken Sie in den gepunkteten Bereich und verwenden Sie Ihren Dateibrowser, um Ihr Bild auszuwählen.  Das hochgeladene Bild sollte im "unrapped", also im "Regenbogen"-Format sein und wie folgt beschnitten werden:

![conical rainbow image](/images/conical-rainbow-image.jpg)

3. **Ausrichtung des großen Bogens einstellen**: Ziehen Sie den Schieberegler, bis die **rote** Linie den **großen Bogen** des hochgeladenen Bildes überlagert.

![set large arc](https://media.giphy.com/media/1zcOKYrjOmhaxUJ7lh/giphy.gif)

4. **Ausrichtung des kleinen Bogens einstellen**: Machen Sie dasselbe für den kleinen Bogen.  Ziehen Sie den Schieberegler, bis die **blaue** Linie den **kleinen Bogen** des hochgeladenen Bildes überlagert.

5. **Tracking-Bereich** (und Ausrichtung) festlegen: Ziehen und zoomen Sie auf dem Bild, um den Teil des Bildes festzulegen, der erkannt und verfolgt werden soll. Dies sollte der funktionsreichste Bereich Ihres Bildes sein.

![set tracking](https://media.giphy.com/media/t2rSve9UshxGB07US2/giphy.gif)

6. **Eigenschaften des konischen Bildziels bearbeiten**:

- (1) Geben Sie Ihrem Bildziel einen **Namen**, indem Sie das Feld oben links im Fenster bearbeiten.
- (2) **Ziehen Sie die Schieberegler**, bis die Form Ihres Etiketts im Simulator wie erwartet erscheint, oder **geben Sie die Maße** direkt ein.
- (3) **WICHTIG!** Testen Sie Ihr Bildziel: Der beste Weg, um festzustellen, ob Ihr hochgeladenes Bild ein gutes oder schlechtes Bildziel darstellt (siehe [Optimierung der Bildzielverfolgung](#optimizing-image-target-tracking)), ist die Verwendung des Simulators zur Beurteilung der Verfolgungsqualität.  Scannen Sie den QR-Code mit Ihrer Kamera-App, um den Simulator-Link zu öffnen, und zeigen Sie dann mit Ihrem Gerät auf den Bildschirm oder das physische Objekt.
- (4) Klicken Sie auf **Automatisch laden**, wenn Sie möchten, dass das Bildziel beim Laden des WebAR-Projekts automatisch aktiviert wird. Bis zu 5 Bildziele können automatisch geladen werden, ohne dass eine einzige Zeile Code geschrieben werden muss.  Weitere Ziele können programmgesteuert über die Javascript-API geladen werden.
- (5) Optional: Wenn Sie Ihrem Bild Metadaten hinzufügen möchten, entweder im Text- oder JSON-Format, klicken Sie auf die Schaltfläche **Metadaten** am unteren Rand des Fensters.

![EditConicalImageTarget](/images/edit-conical-image-target.jpg)

7. Die auf diesem Bildschirm vorgenommenen Änderungen werden automatisch gespeichert.  Klicken Sie auf **Schließen**, um zu Ihrer Bildzielbibliothek zurückzukehren.

## Bildziele bearbeiten {#edit-image-targets}

Klicken Sie auf eines der Bildziele unter **Meine Bildziele**, um dessen Eigenschaften anzuzeigen und/oder zu ändern:

1. Bild Zielname
2. Schieberegler/Messungen (nur zylindrische/konische Bildziele)
3. Simulator QR-Code
4. Bildziel löschen
5. Automatisch laden
6. Metadaten
7. Ausrichtung und Abmessungen
8. Status der automatischen Speicherung
9. Schließen Sie

| Typ         | Felder                                                                |
| ----------- | --------------------------------------------------------------------- |
| Wohnung     | ![flat target](/images/edit-flat-image-target-full.jpg)               |
| Zylindrisch | ![cylindrical target](/images/edit-cylindrical-image-target-full.jpg) |
| Konisch     | ![conical target](/images/edit-conical-image-target-full.jpg)         |

## Ändern von aktiven Bildzielen {#changing-active-image-targets}

Die Menge der aktiven Bildziele kann zur Laufzeit durch Aufruf von
[XR8.XrController.configure()](/legacy/api/xrcontroller/configure) geändert werden.

Hinweis: Der Satz der derzeit aktiven Bildziele wird durch den neuen Satz passwd auf
[XR8.XrController.configure()](/legacy/api/xrcontroller/configure) **ersetzt**.

#### Beispiel - Ändern des aktiven Bildzielsatzes {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
```

## Optimierung der Bildzielverfolgung {#optimizing-image-target-tracking}

Um die höchste Qualität bei der Verfolgung von Bildzielen zu gewährleisten, sollten Sie bei der Auswahl eines Bildziels die folgenden Richtlinien beachten.

_**DO**_ haben:

- viele unterschiedliche Details
- hoher Kontrast

_**DON'T**_ haben:

- sich wiederholende Muster
- übermäßiger Totraum
- Bilder mit niedriger Auflösung

Farbe: Die Bildzielerfassung kann nicht zwischen Farben unterscheiden.

Die besten Ergebnisse erzielen Sie, wenn Sie Bilder auf flachen, zylindrischen oder konischen Oberflächen für die Bildzielverfolgung verwenden.

Berücksichtigen Sie das Reflexionsvermögen des physischen Materials Ihres Bildobjekts. Glänzende Oberflächen und Bildschirmreflexionen können die Abtastqualität beeinträchtigen. Verwenden Sie matte Materialien bei diffusen Lichtverhältnissen, um eine optimale Bildqualität zu erzielen.

Hinweis: Die Erkennung erfolgt am schnellsten in der Mitte des Bildschirms.

| Gute Marker                                  | Schlechte Markierungen                     |
| -------------------------------------------- | ------------------------------------------ |
| ![good logo](/images/it-logo-good.jpg)       | ![bad logo](/images/it-logo-bad.jpg)       |
| ![movie poster](/images/it-movie-poster.jpg) | ![bad pattern](/images/it-pattern-bad.jpg) |

## Bildziel Ereignisse {#image-target-events}

8th Wall Web sendet Events / Observables für verschiedene Ereignisse im Lebenszyklus des Bildziels (z.B. imageloading, imagescaning, imagefound, imageupdated, imagelost). Bitte lesen Sie die API-Referenz für Anweisungen zur Handhabung dieser Ereignisse in Ihrer Webanwendung:

- [AFrame Ereignisse](/legacy/api/aframeevents)
- [BabylonJS Observables](/legacy/api/babylonjs/observables)
- [PlayCanvas Ereignisse](/legacy/api/playcanvasevents/playcanvas-image-target-events)
- [XrController Dispatched Events](/legacy/api/xrcontroller/pipelinemodule/#dispatched-events)

#### Beispielprojekte {#example-projects}

<https://github.com/8thwall/web/tree/master/examples/aframe/artgallery>

<https://github.com/8thwall/web/tree/master/examples/aframe/flyer>
