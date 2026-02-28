---
sidebar_position: 2
---

# VPS-Standorte

## Standorte verwalten {#managing-locations}

Der Geospatial Browser kann von Ihrem Projekt aus aufgerufen werden, indem Sie das Kartensymbol im linken Menü von
auswählen (in der Abbildung unten mit #1 gekennzeichnet). Auf dieser Seite finden Sie eine Kartenansicht (#2)
, die Sie für die Suche nach VPS-aktivierten Standorten verwenden können. Wenn Sie einen VPS-aktivierten
Standort auswählen, wird das 3D-Mesh des Standorts angezeigt (#3), so dass Sie überprüfen können, ob Sie den
richtigen Standort ausgewählt haben, und ihn zu Ihrem Projekt hinzufügen können (#4).

![ConsoleGSB](/images/console-geospatial-browser.jpg)

Wenn Sie einen VPS-aktivierten Standort zu Ihrem Projekt hinzufügen, sehen Sie den Standort in der Tabelle "Projekt
Standorte" im Geospatial Browser (in der Abbildung unten als #1 gekennzeichnet). Sobald Sie einen
Standort in der Tabelle "Projektstandorte" haben, können Sie die Schaltfläche "Herunterladen" (#2) verwenden, um eine GLB- oder
OBJ-Version des 3D-Meshes herunterzuladen (als #3 angezeigt) und es in 3D-Softwareanwendungen von Drittanbietern zu öffnen,
wie z. B. Blender, oder es direkt in Ihr 8th Wall-Projekt zu importieren. Wenn Sie in
auf Standorte verweisen, müssen Sie das Feld "Name" (Nr. 4) aus der Tabelle "Projektstandorte" kopieren.

![ConsoleGSBManageWayspots](/images/console-geospatial-browser-manage-wayspots.jpg)

Wenn der Ort, den Sie in Ihrem Projekt verwenden möchten, nicht als VPS-Ort verfügbar ist, können Sie
den Ort erstellen, indem Sie den Anweisungen im Abschnitt
[Neuen Ort erstellen](#create-new-location) folgen.

## Neuen Standort erstellen {#create-new-location}

1. Klicken Sie auf einen freien Punkt auf der Karte, um den Ort auszuwählen, an dem Sie einen neuen VPS-Standort erstellen möchten. Siehe
   [Anforderungen an den VPS-Standort](#location-requirements), um mehr über die Auswahl eines guten Ortes für die Erstellung eines VPS-Standorts
   zu erfahren.

![ConsoleCreateWayspot](/images/console-create-wayspot.png)

2. Arbeitsbereiche mit den Tarifen "Pro" oder "Enterprise" haben die Option **Öffentlichen Standort erstellen** oder
   **Privaten Standort erstellen**. Öffentliche Standorte sind für alle Entwickler und Personen zugänglich, die
   und ihre Projekte verwenden, während private Standorte nur für Ihren Arbeitsbereich und
   und seine Projekte sichtbar und zugänglich sind. Die Erstellung eines öffentlichen Standorts ist für die meisten Projekte die richtige Wahl; private Standorte
   sind eine Premium-Funktion für Entwickler, die spezielle zugangskontrollierte oder temporäre VPS
   Erfahrungen erstellen müssen. Klicken Sie entweder auf die Schaltfläche **Öffentlichen Standort erstellen** oder auf die Schaltfläche **Privaten Standort erstellen**
   , um die Erstellung des Standorts zu starten.

3. **Prüfen Sie auf Duplikate**: Bevor Sie einen neuen Standort erstellen, müssen Sie überprüfen, ob Ihr
   Standort nicht bereits existiert. Vergleichen Sie Ihren gewünschten Standort mit anderen, die bereits auf der Karte vorhanden sind, um sicherzustellen,
   dass Sie kein Duplikat erstellen. Wenn es sich nicht um einen doppelten Standort handelt, müssen Sie das Kontrollkästchen **Mein
   Standort ist kein Duplikat** aktivieren und auf die Schaltfläche **Weiter** klicken, um fortzufahren.

![ConsoleCreateWayspotNoDuplicate](/images/console-create-wayspot-nodupe.png)

4. **Standortinformationen hinzufügen**: Standort-Metadaten sind für Entwickler sichtbar, die den
   Geospatial Browser verwenden, und können für Endbenutzer sichtbar sein. Denken Sie daran, dass das Trust & Safety Team von Niantic
   die von Ihnen zur Verfügung gestellten Informationen verwendet, um festzustellen, ob der Standort unsere Kriterien erfüllt, um öffentlich
   zugänglich gemacht zu werden. Sobald Sie die folgenden Informationen für den Standort, den Sie erstellen möchten, eingegeben haben, klicken Sie auf
   auf die Schaltfläche **Submit**:

- Titel (125 Zeichen)
- Beschreibung (250 Zeichen)
- Kategorie (1 oder mehr)
- Bild (falls vorhanden)

5. Ihr Standort sollte sofort mit seinem Typ ("Öffentlich" oder "Privat") und dem Status ("Nicht aktiviert") zu Ihrer Registerkarte "Standortübermittlung" im Geospatial
   Browser hinzugefügt werden. Sie wird innerhalb weniger Minuten auf
   zum Scannen verfügbar sein und die VPS-Aktivierung kann angefordert werden, sobald sie vollständig gescannt wurde.

## Standortanforderungen {#location-requirements}

Bei der Auswahl eines Standortes für die Verwendung von VPS sollten Sie folgende Punkte beachten:

- VPS funktioniert am besten an Orten, die ein klares und einheitliches Erscheinungsbild haben (z. B. ein Sandstrand oder
  ein überfüllter Innenhof mit beweglichen Möbeln funktioniert nicht gut).
- Standorte, die von reflektierenden oder transparenten Elementen (z. B. Fenstern und Spiegeln) dominiert werden, sind
  nicht zu empfehlen.
- Je größer das Erlebnis ist, desto mehr Scans müssen Sie durchführen, um den Raum zu erfassen. Die von
  empfohlene Maximalgröße für ein VPS-Erlebnis beträgt heute 400 m^2 (20 x 20 m), obwohl größere Erlebnisse mit sorgfältigen Scans unterstützt werden können
  .

### Anforderungen an öffentliche Standorte {#public-location-requirements}

**Öffentliche Standorte** sind für alle Entwickler und Personen, die ihre Projekte und Anwendungen nutzen, zugänglich. Wenn Sie unter
einen neuen öffentlichen Standort hinzufügen, beachten Sie bitte die folgenden Richtlinien:

- Öffentliche Orte sollten dauerhafte physische, greifbare und identifizierbare Orte oder Objekte sein.
- Öffentliche Standorte sollten für Fußgänger sicher und öffentlich zugänglich sein.
- Achten Sie darauf, dass der Titel, die Beschreibung und das Foto genaue Informationen enthalten, damit Ihre Nutzer
  den Ort finden können.

### Anforderungen an private Standorte {#private-location-requirements}

**Private Standorte** sind ein Premium-Feature für Entwickler, die spezielle
zugangskontrollierte oder temporäre VPS-Erlebnisse schaffen müssen. Sie sind nur für den
Arbeitsbereich, der sie erstellt hat, sichtbar und zugänglich. Wenn Sie einen neuen privaten Standort erstellen, beachten Sie bitte Folgendes:

- Private Standorte sind nur von dem Arbeitsbereich auffindbar, in dem sie erstellt wurden, so dass sie nur von Mitgliedern und Benutzern der Projekte dieses Arbeitsbereichs unter
  durchsucht und lokalisiert werden können.
- Private Standorte sind eine gute Wahl, wenn Sie ein spezielles zugangskontrolliertes Erlebnis bauen
  (z. B. auf Ihrem oder dem Privatgrundstück Ihres Kunden).
- Private Standorte sind auch eine Option, wenn Sie ein Erlebnis an einem öffentlichen Ort aufbauen, der
  vorübergehend ein anderes Aussehen hat (z. B. ein Konzert, eine Museumsausstellung oder eine andere besondere Veranstaltung).

## Standort Mengen {#location-quantities}

Es gibt keine Begrenzung für die Anzahl der Standorte, die mit einem 8th Wall-Projekt verbunden werden können.
Die Standorte werden serverseitig über den VPS-Dienst lokalisiert.

## Standorttypen {#location-types}

Im Geospatial Browser sehen Sie vier verschiedene Arten von Standorten:

| Typ         | Icon                                             | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ----------- | ------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Öffentlich  | ![WSPublic](/images/wayspot-type-public.png)     | "Öffentliche" Standorte wurden vom Trust & Safety Team von Niantic genehmigt und erfüllen die erforderlichen Kriterien für Sicherheit und öffentliche Zugänglichkeit. Diese Standorte können in veröffentlichten Projekten verwendet werden.                                                                                                                                       |
| Gescheitert | ![WSPending](/images/wayspot-type-pending.png)   | "Ausstehende" Standorte werden vom Trust & Safety Team von Niantic überprüft, um festzustellen, ob sie die erforderlichen Kriterien für Sicherheit und öffentliche Zugänglichkeit erfüllen. **Dieser Vorgang kann bis zu 2 Arbeitstage dauern.** Ausstehende Standorte können gescannt und aktiviert werden, während Sie auf den Abschluss der Überprüfung warten. |
| Abgelehnt   | ![WSRejected](/images/wayspot-type-rejected.png) | "Abgelehnte" Orte können die Vertrauens- und Sicherheitsprüfung von Niantic nicht bestanden haben, ein Duplikat eines bestehenden oder zuvor abgelehnten Ortes sein oder von Niantic aus einem anderen Grund nicht zugelassen werden. Diese Standorte können nicht zu Projekten hinzugefügt werden.                                                                                                    |
| Test        | ![WSTest](/images/wayspot-type-private.png)      | "Test"-Standorte sind nur dann für deinen Arbeitsbereich zugänglich, wenn du den Standort mit der Wayfarer-App von Niantic scannst. Testlokationen sind für die Verwendung während der Entwicklung vorgesehen und dürfen nicht in ein veröffentlichtes Projekt aufgenommen werden.                                                                                                                     |

Bei Fragen oder Problemen im Zusammenhang mit der Erstellung von VPS-Standorten oder um den Status eines bestehenden Standorts zu überprüfen, wenden Sie sich bitte an [support@lightship.dev](mailto://support@lightship.dev)

## Standort Status {#location-status}

Im Geospatial Browser sehen Sie fünf verschiedene Status für VPS-Standorte:

| Status          | Icon                                                        | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| --------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Nicht aktiviert | ![WSNotActivated](/images/wayspot-status-not-activated.png) | Bei Standorten mit dem Status "Nicht aktiviert" wurden keine Scans für den Standort eingereicht. Es müssen mindestens 10 brauchbare Scans für den Standort eingereicht werden, bevor Sie die Aktivierung beantragen können. Nachdem ein Scan durchgeführt wurde, ändert sich der Status des Standorts auf "Scanning".                                                                                                                                                                                                                               |
| Scannen         | ![WSScanning](/images/wayspot-status-scanning.png)          | Bei Standorten mit dem Status "Scanning" wurde mindestens ein Scan für den Standort durchgeführt. Es müssen mindestens 10 brauchbare Scans für den Standort eingereicht werden, bevor Sie die Aktivierung beantragen können.                                                                                                                                                                                                                                                                                                                                        |
| Verarbeitung    | ![WSProcessing](/images/wayspot-status-processing.png)      | Standorte mit dem Status "in Bearbeitung" haben einen Aktivierungsantrag gestellt und zeigen den Status "in Bearbeitung" an, bis der Aktivierungsprozess abgeschlossen ist. \*\*In der Regel wird ein Aktivierungsantrag innerhalb von 4 Stunden bearbeitet. Sie erhalten eine E-Mail, wenn der Vorgang abgeschlossen ist.                                                                                                                                                                                                                          |
| Aktiv           | ![WSActive](/images/wayspot-status-active.png)              | Standorte mit dem Status "Aktiv" können in Projekten zur Erstellung von WebAR-Inhalten mit VPS for Web verwendet werden.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Gescheitert     | ![WSFailed](/images/wayspot-status-failed.png)              | Bei Standorten mit dem Status "Fehlgeschlagen" ist während des Aktivierungsprozesses ein Problem aufgetreten. Dies kann auf verschiedene Faktoren zurückzuführen sein, z. B. auf eine schlechte Eignung des Standorts für VPS, unzureichende Scans oder beschädigte Daten. Leider bedeutet dies, dass dieser Standort nicht für die Erstellung von WebAR-Inhalten mit VPS verwendet werden kann. Wir möchten Sie ermutigen, einen neuen Standort für Ihr 8. Wand-Projekt zu finden. |

Bei Fragen oder Problemen im Zusammenhang mit Standort-Scans, Aktivierung oder Status wenden Sie sich bitte an [support@lightship.dev](mailto://support@lightship.dev)

## Standortqualität {#location-quality}

Nachdem ein Standort in der VPS aktiviert wurde, gibt Niantic im Geospatial-Browser eine Qualitätsbewertung ab.
Die Ortsangaben zeigen entweder _Mäßige Qualität_ oder _Gute Qualität_.

Die Standortqualität bezieht sich auf die Fähigkeit des Standorts, jederzeit zu lokalisieren. Standorte mit mehreren Scans
in allen Beleuchtungsarten haben in der Regel eine höhere Qualität. Standorte mit einem Minimum an erforderlichen Scans oder einer
Mehrheit von Scans bei einer bestimmten Beleuchtungsart haben tendenziell eine geringere Qualität.

Die Qualitätsbewertung ist ein automatischer Prozess und spiegelt möglicherweise nicht die tatsächliche Leistung des Standorts wider.
Die beste Art, die Qualität zu bestimmen, ist, sie selbst auszuprobieren.

## Standortausrichtung {#location-alignment}

Die Warnung "unaligned" kann aus verschiedenen Gründen auftreten und bedeutet, dass die Lokalisierung gegen das Netz nicht garantiert werden kann
. Obwohl das Netz für die Lokalisierung gut geeignet ist, weist die Warnung darauf hin, dass das Netz
experimentell ist und auf eigene Gefahr verwendet werden sollte.

Hinweis: Alle **Test**-Scans sind nicht ausgerichtet.

## Standort Veranstaltungen {#location-events}

8th Wall sendet Ereignisse in verschiedenen Phasen des Lebenszyklus des Projektstandorts (z. B. Scannen, gefunden,
aktualisiert, verloren, usw.). Bitte lesen Sie die API-Referenz für spezifische Anweisungen zur Handhabung dieser Ereignisse
in Ihrer Webanwendung:

- [AFrame Ereignisse](/legacy/api/aframeevents)
- [PlayCanvas Ereignisse](/legacy/api/playcanvasevents/playcanvas-image-target-events)
- [XrController Dispatched Events](/legacy/api/xrcontroller/pipelinemodule/#dispatched-events)

## Test-Scans {#test-scans}

Test-Scans sind ein einzelnes Netz, das nur einem Arbeitsbereich zur Verfügung steht, um VPS
Erfahrungen zu entwickeln und zu testen. Während Test-Scans eine großartige Lösung für die Entwicklung und das Testen von VPS-Erfahrungen
sind, während ein öffentlicher Standort nominiert oder aktiviert wird, sind sie nicht für die Verwendung in veröffentlichten
Projekten zugelassen.

Test-Scans werden mit der Niantic Wayfarer-App erstellt. Vergewissern Sie sich, dass Sie bei Wayfarer mit den
8th Wall-Zugangsdaten angemeldet sind und dass der richtige Arbeitsbereich auf der Profilseite ausgewählt ist. Der Test-Scan
ist nur im ausgewählten 8th Wall-Arbeitsbereich zum Zeitpunkt des Scannens und
Hochladens verfügbar. Scans können nicht auf einen anderen Arbeitsbereich oder ein anderes Lightship-Konto verschoben werden.

Wählen Sie in der Wayfarer-App _Scan_ und [scannen Sie den Bereich](/legacy/guides/lightship-vps#using-niantic-wayfarer).

Test-Scans sollten 60 Sekunden oder weniger dauern; alle 60 Sekunden wird ein neues Mesh generiert - ein Scan von
für 120 Sekunden ergibt also 2 Test-Scans. Alle Testabfragen sind
[unaligned](#location-alignment).

Nach der Verarbeitung können Sie eine Vorschau des Netzes anzeigen und es über die Registerkarte _Test Scans_ des Geodatenbrowsers
zu Ihrem Projekt hinzufügen.

![Test scans tab](/images/private-scans-tab.jpg)

Wenn Ihr Test-Scan nicht verarbeitet werden kann, müssen Sie möglicherweise einen neuen Scan durchführen. Wenden Sie sich an
[support@lightship.dev](mailto://support@lightship.dev) für weitere Informationen.
