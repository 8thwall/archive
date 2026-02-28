---
id: image-targets
---

# Bildziele

Erwecken Sie Beschilderungen, Zeitschriften, Schachteln, Flaschen, Tassen und Dosen mit den 8th Wall Image Targets zum Leben. 8th Wall Web kann flache, zylindrische und konisch geformte Bildziele erkennen und verfolgen, so dass Sie statische Inhalte zum Leben erwecken können.

Ihr bestimmtes Bildziel kann nicht nur ein WebAR-Erlebnis auslösen, sondern Ihr Inhalt hat auch die Fähigkeit, direkt zu diesem Ziel zu führen.

Bildziele können mit unserem World Tracking (SLAM) kombiniert werden und ermöglichen so Erlebnisse, die Bildziele und markerloses Tracking kombinieren.

Sie können bis zu 5 Bildziele gleichzeitig verfolgen, wenn World Tracking aktiviert ist, oder bis zu 10, wenn es deaktiviert ist.

Bis zu 5 Bildziele pro Projekt können **"Autoloaded"** sein. Ein automatisch geladenes Bildziel wird sofort beim Laden der Seite aktiviert. Dies ist nützlich für Anwendungen, die 5 oder weniger Bildziele verwenden, wie z.B. Produktverpackungen, ein Filmplakat oder eine Visitenkarte.

Die Menge der aktiven Bildziele kann jederzeit geändert werden, indem Sie [XR8.XrController.configure()](/api/xrcontroller/configure) aufrufen. Damit können Sie Hunderte von Bildzielen pro Projekt verwalten und Anwendungsfälle wie geografisch abgegrenzte Bildzieljagden, AR-Bücher, geführte Kunstmuseumstouren und vieles mehr ermöglichen. Wenn Ihr Projekt die meiste Zeit SLAM verwendet, aber manchmal auch Bildziele , können Sie die Leistung verbessern, indem Sie Bildziele nur laden, wenn Sie sie benötigen. Sie können sogar die Namen der hochgeladenen Ziele aus den URL-Parametern lesen, die in den verschiedenen QR-Codes gespeichert sind. So können Sie unterschiedliche Ziele in derselben Web-App laden lassen, je nachdem, welche QR-Codes der Benutzer scannt, um das Erlebnis zu betreten.

**Hinweis: Benutzerdefinierte Bildziele können derzeit nicht im [Simulator](/getting-started/quick-start-guide/#simulator)angezeigt werden.**

## Bildzieltypen {#image-target-types}

 |                 |                                                                                                                                                                        |
 | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 | **Flach**       | ![FlatTarget](/images/flat.jpg)| Verfolgen Sie 2D-Bilder wie Poster, Schilder, Zeitschriften, Schachteln usw.                                                          |
 | **Zylindrisch** | ![CylindricalTarget](/images/cylindrical.jpg)| Track-Bilder, die um zylindrische Gegenstände wie Dosen und Flaschen gewickelt sind.                                    |
 | **Konisch**     | ![ConicalTarget](/images/conical.jpg)| Verfolgen Sie Bilder, die um Objekte mit unterschiedlichem oberen und unteren Umfang gewickelt sind, wie z.B. Kaffeetassen usw. |

## Anforderungen an das Bildziel {#image-target-requirements}

* Dateitypen: **.jpg**, **.jpeg** oder **.png**
* Abmessungen:
  * Minimum: **480 x 640 Pixel**
  * Maximale Länge oder Breite: **2048 Pixel**.
    * Hinweis: Wenn Sie etwas Größeres hochladen, wird das Bild auf eine maximale Länge/Breite von 2048 verkleinert, wobei das Seitenverhältnis erhalten bleibt.
* Hosting: Alle Bildziele müssen in Ihr 8th Wall Projekt hochgeladen werden, bevor sie auf verwendet werden können. Sie können den Rest Ihres Web AR-Erlebnisses selbst hosten (wenn Sie einen Pro- oder Enterprise-Tarif haben), aber , das Quellbild-Ziel, wird immer von 8th Wall gehostet. Eine Anleitung zum Erstellen/Hochladen von flachen oder gekrümmten Bildzielen finden Sie weiter unten.

## Bildzielmengen {#image-target-quantities}

Die Anzahl der Bildziele, die mit einem Projekt verknüpft werden können, ist nicht begrenzt. Allerdings ist die Anzahl der Bildziele begrenzt, die zu einem bestimmten Zeitpunkt aktiv **** werden können.

Bis zu 5 Bildziele können gleichzeitig aktiv sein, während das World Tracking (SLAM) aktiviert ist. Wenn World Tracking (SLAM) deaktiviert ist (durch die Einstellung "disableWorldTracking: true"), können bis zu 10 Bildziele gleichzeitig aktiv sein.

* Aktive Bilder pro Projekt (World Tracking aktiviert): **5**
* Aktive Bilder pro Projekt (World Tracking deaktiviert): **10**

## Bildziele verwalten {#manage-image-targets}

Klicken Sie auf das Symbol Bildziel in der linken Navigation oder auf den Link "Bildziele verwalten" auf dem Projekt Dashboard, um Ihre Bildziele zu verwalten.

![ManageImageTargets](/images/console-appkey-imagetargets.jpg)

Auf diesem Bildschirm können Sie die mit Ihrem Projekt verbundenen Bildziele erstellen, bearbeiten und löschen. Klicken Sie auf ein vorhandenes Bildziel, um es zu bearbeiten.  Klicken Sie auf das "+"-Symbol für den gewünschten Bildzieltyp, um ein neues Bild zu erstellen.

![ManageImageTargets2](/images/console-appkey-imagetarget-library.jpg)

## Flaches Bildziel erstellen {#create-flat-image-target}

1. Klicken Sie auf das Symbol "+ Flach", um ein neues Flachbildziel zu erstellen.

![ImageTargetFlat1](/images/image-target-create-flat.jpg)

2. **Flaches Bildziel hochladen **: Ziehen Sie Ihr Bild (.jpg, .jpeg oder .png) in das Upload-Feld oder klicken Sie in den punktierten Bereich und wähen Sie mit Ihrem Dateibrowser Ihr Bild aus.

3. **Tracking-Bereich festlegen** (und Ausrichtung): Leben Sie mit dem Schieberegler den Bereich des Bildes fest, der für die Erkennung und Verfolgung Ihres Ziels in WebAR verwendet werden soll. Der Rest des Bildes wird verworfen, und der von Ihnen angegebene Bereich wird in Ihrem Erlebnis verfolgt.

![SetTrackingRegion](https://media.giphy.com/media/RCFntZ0hn5VO3W9Mld/giphy.gif)

4. **Bearbeiten Sie die Eigenschaften von Flaches Bildziel**:

* (1) Geben Sie Ihrem Bildziel einen **Namen**, indem Sie das Feld oben links im Fenster bearbeiten.
* (2) **WICHTIG!** Testen Sie Ihr Bildziel: Der beste Weg, um festzustellen, ob Ihr hochgeladenes Bild ein gutes oder schlechtes Bildziel darstellt (siehe [Optimieren der Bildzielverfolgung](#optimizing-image-target-tracking)), ist die Verwendung des Simulators, um die Verfolgungsqualität zu beurteilen.  Scannen Sie den QR-Code mit Ihrer Kamera-App, um den Simulator-Link zu öffnen, und richten Sie Ihr Gerät dann auf den Bildschirm oder das physische Objekt.
* (3) Klicken Sie auf **Automatisch laden**, wenn Sie möchten, dass das Bildziel beim Laden des WebAR-Projekts automatisch aktiviert wird. Bis zu 5 Bildziele können automatisch geladen werden, ohne dass Sie eine einzige Zeile Code schreiben müssen.  Weitere Ziele können programmgesteuert über die Javascript-API geladen werden.
* (4) Optional: Wenn Sie Ihrem Bild Metadaten hinzufügen möchten, entweder im Text- oder JSON-Format, klicken Sie auf die Schaltfläche **Metadaten** unten im Fenster.

![EditFlatImageTarget](/images/edit-flat-image-target.jpg)

5. Die auf diesem Bildschirm vorgenommenen Änderungen werden automatisch gespeichert.  Klicken Sie auf **Schließen**, um zu Ihrer Bildzielbibliothek zurückzukehren.

## Zylindrisches Bildziel erstellen {#create-cylindrical-image-target}

1. Klicken Sie auf das Symbol "+ Zylindrisch", um ein neues flaches Bildziel zu erstellen.

![ImageTargetFlat1](/images/image-target-create-cylindrical.jpg)

2. **Flaches Bildziel hochladen **: Ziehen Sie Ihr Bild (.jpg, .jpeg oder .png) in das Upload-Feld oder klicken Sie in den punktierten Bereich und wähen Sie mit Ihrem Dateibrowser Ihr Bild aus.

3. **Tracking-Bereich festlegen** (und Ausrichtung): Leben Sie mit dem Schieberegler den Bereich des Bildes fest, der für die Erkennung und Verfolgung Ihres Ziels in WebAR verwendet werden soll. Der Rest des Bildes wird verworfen, und der von Ihnen angegebene Bereich wird in Ihrem Erlebnis verfolgt.

![](https://media.giphy.com/media/AdgvL3hqQAULWEHWTg/giphy.gif)

4. **Bearbeiten Sie die Eigenschaften des zylindrischen Bildziels**:

* (1) Geben Sie Ihrem Bildziel einen **Namen**, indem Sie das Feld oben links im Fenster bearbeiten.
* Ziehen Sie die Schieberegler, bis die Form Ihres Labels wie erwartet im Simulator erscheint, oder geben Sie die Maße direkt ein.
* (3) **WICHTIG!** Testen Sie Ihr Bildziel: Der beste Weg, um festzustellen, ob Ihr hochgeladenes Bild ein gutes oder schlechtes Bildziel darstellt (siehe [Optimieren der Bildzielverfolgung](#optimizing-image-target-tracking)), ist die Verwendung des Simulators, um die Verfolgungsqualität zu beurteilen.  Scannen Sie den QR-Code mit Ihrer Kamera-App, um den Simulator-Link zu öffnen, und richten Sie Ihr Gerät dann auf den Bildschirm oder das physische Objekt.
* (4) Klicken Sie auf **Automatisch laden** , wenn Sie möchten, dass das Bildziel beim Laden des WebAR-Projekts automatisch aktiviert wird. Bis zu 5 Bildziele können automatisch geladen werden, ohne dass Sie eine einzige Zeile Code schreiben müssen.  Weitere Ziele können programmgesteuert über die Javascript-API geladen werden.
* (5) Optional: Wenn Sie Ihrem Bild Metadaten hinzufügen möchten, entweder im Text- oder JSON-Format, klicken Sie auf die Schaltfläche **Metadaten** unten im Fenster.

![EditCylindricalImageTarget](/images/edit-cylindrical-image-target.jpg)

5. Die auf diesem Bildschirm vorgenommenen Änderungen werden automatisch gespeichert.  Klicken Sie auf **Schließen**, um zu Ihrer Bildzielbibliothek zurückzukehren.

## Konisches Bildziel erstellen {#create-conical-image-target}

1. Klicken Sie auf das Symbol "+ Konisch", um ein neues flaches Bildziel zu erstellen.

![ImageTargetFlat1](/images/image-target-create-conical.jpg)

2. **Konisches Bild hochladen Ziel**: Ziehen Sie Ihr Bild (.jpg, .jpeg oder .png) in das Upload-Panel oder klicken Sie auf den gepunkteten Bereich und wählen Sie Ihr Bild mit Ihrem Dateibrowser aus.  Das hochgeladene Bild sollte im "unverpackten", sog. "Regenbogen"-Format sein und wie folgt beschnitten werden:

![kegelförmiges Regenbogenbild](/images/conical-rainbow-image.jpg)

3. **Ausrichtung des großen Bogens festlegen**: Ziehen Sie den Schieberegler, bis die **rote** Linie den **großen Bogen des hochgeladenen Bildes überlagert**.

![großen Bogen setzen](https://media.giphy.com/media/1zcOKYrjOmhaxUJ7lh/giphy.gif)

4. **Stellen Sie die Ausrichtung des kleinen Bogens ein**: Machen Sie dasselbe für den kleinen Bogen.  Ziehen Sie den Schieberegler, bis die blaue Linie **** den kleinen Bogen **des hochgeladenen Bildes** überlagert.

5. **Tracking-Bereich festlegen** (und Ausrichtung): Ziehen und zoomen Sie auf dem Bild, um den Teil des Bildes festzulegen, der erkannt und verfolgt werden soll. Dies sollte der detailreichste Bereich Ihres Bildes sein.

![Tracking einstellen](https://media.giphy.com/media/t2rSve9UshxGB07US2/giphy.gif)

6. **Bearbeiten Sie die Eigenschaften des konischen Bildziels**:

* (1) Geben Sie Ihrem Bildziel im Feld oben links im Fenster einen **Namen**
* Ziehen Sie die Schieberegler, bis die Form Ihres Labels wie erwartet im Simulator erscheint, oder geben Sie die Maße direkt ein.
* (3) **WICHTIG!** Testen Sie Ihr Bildziel: Der beste Weg, um festzustellen, ob Ihr hochgeladenes Bild ein gutes oder schlechtes Bildziel darstellt (siehe [Optimieren der Bildzielverfolgung](#optimizing-image-target-tracking)), ist die Verwendung des Simulators, um die Verfolgungsqualität zu beurteilen.  Scannen Sie den QR-Code mit Ihrer Kamera-App, um den Simulator-Link zu öffnen, und richten Sie Ihr Gerät dann auf den Bildschirm oder das physische Objekt.
* (4) Klicken Sie auf **Automatisch laden** , wenn Sie möchten, dass das Bildziel beim Laden des WebAR-Projekts automatisch aktiviert wird. Bis zu 5 Bildziele können automatisch geladen werden, ohne dass Sie eine einzige Zeile Code schreiben müssen.  Weitere Ziele können programmgesteuert über die Javascript-API geladen werden.
* (5) Optional: Wenn Sie Ihrem Bild Metadaten hinzufügen möchten, entweder im Text- oder JSON-Format, klicken Sie auf die Schaltfläche **Metadaten** unten im Fenster.

![EditConicalImageTarget](/images/edit-conical-image-target.jpg)

7. Die auf diesem Bildschirm vorgenommenen Änderungen werden automatisch gespeichert.  Klicken Sie auf **Schließen**, um zu Ihrer Bildzielbibliothek zurückzukehren.

## Bildziele bearbeiten {#edit-image-targets}

Klicken Sie auf ein beliebiges Bildziel unter **Meine Bildziele**, um dessen Eigenschaften anzuzeigen und/oder zu ändern:

1. Bildzielname
2. Schieberegler/Messungen (nur zylindrische/konische Bildziele)
3. Simulator QR Code
4. Bildziel löschen
5. Automatisch laden
6. Metadaten
7. Ausrichtung und Abmessungen
8. Status der automatischen Speicherung
9. Schließen

| Typ         | Felder                                                                |
| ----------- | --------------------------------------------------------------------- |
| Flach       | ![flaches Ziel](/images/edit-flat-image-target-full.jpg)              |
| Zylindrisch | ![zylindrisches Ziel](/images/edit-cylindrical-image-target-full.jpg) |
| Konisch     | ![kegelziel](/images/edit-conical-image-target-full.jpg)              |

## Aktive Bildziele ändern {#changing-active-image-targets}

Die Menge der aktiven Bildziele kann zur Laufzeit geändert werden, indem Sie [XR8.XrController.configure() aufrufen](/api/xrcontroller/configure)

Hinweis: Der Satz der derzeit aktiven Bildziele wird **** durch den neuen Satz passwd zu [XR8.XrController.configure()](/api/xrcontroller/configure) ersetzt.

#### Beispiel - Aktives Bildzielset ändern {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
```

## Optimierung der Bildzielverfolgung {#optimizing-image-target-tracking}

Um die höchste Qualität bei der Verfolgung von Bildzielen zu gewährleisten, sollten Sie bei der Auswahl eines Bildziels die folgenden Richtlinien beachten.

***DO*** haben:

* eine Menge abwechslungsreicher Details
* hohen Kontrast

***HABEN NICHT***:

* sich wiederholende Muster
* übermäßiger ungenutzter Raum
* Bilder mit niedriger Auflösung

Farbe: Die Erkennung von Bildzielen kann nicht zwischen Farben unterscheiden. Verlassen Sie sich also nicht darauf als wichtiges Unterscheidungsmerkmal zwischen Zielen.

Die besten Ergebnisse erzielen Sie, wenn Sie Bilder auf flachen, zylindrischen oder konischen Oberflächen für die Bildzielverfolgung verwenden.

Berücksichtigen Sie das Reflexionsvermögen des physischen Materials Ihres Bildziels. Glänzende Oberflächen und Bildschirmreflexionen können die Bildqualität beeinträchtigen. Verwenden Sie matte Materialien bei diffusen Lichtverhältnissen für optimale Tracking-Qualität.

Hinweis: Die Erkennung erfolgt am schnellsten in der Mitte des Bildschirms.

| Gute Markierungen                          | Schlechte Markierungen                           |
| ------------------------------------------ | ------------------------------------------------ |
| ![gutes Logo](/images/it-logo-good.jpg)    | ![schlechtes Logo](/images/it-logo-bad.jpg)      |
| ![filmposter](/images/it-movie-poster.jpg) | ![schlechtes Muster](/images/it-pattern-bad.jpg) |

## Bildzielereignisse {#image-target-events}

8th Wall Web gibt Ereignisse / Observables für verschiedene Ereignisse im Lebenszyklus des Bildziels aus (z.B. imageloading, imagescaning, imagefound, imageupdated, imagelost). Anweisungen zur Handhabung dieser Ereignisse in Ihrer Webanwendung finden Sie in der API-Referenz:

* [AFrame-Ereignisse](/api/aframeevents)
* [BabylonJS Observables](/api/babylonjs/observables)
* [PlayCanvas-Ereignisse](/api/playcanvasevents/playcanvas-image-target-events)
* [XrController Ausgelöste Ereignisse](/api/xrcontroller/pipelinemodule/#dispatched-events)

#### Beispiel-Projekte {#example-projects}

<https://github.com/8thwall/web/tree/master/examples/aframe/artgallery>

<https://github.com/8thwall/web/tree/master/examples/aframe/flyer>
