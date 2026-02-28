# Plattform-API: Bild-Ziele

Die 8th Wall Image Target Management API ermöglicht es Entwicklern, die \*\*Bildzielbibliothek
\*\*, die mit ihren 8th Wall powered WebAR-Projekten verbunden ist, dynamisch zu verwalten. Diese API und die begleitende Dokumentation
sind für Entwickler gedacht, die mit der Web-Entwicklung und den 8th Wall Image Targets vertraut sind.

**Bevor Sie beginnen:** Bevor Sie die Image Target API verwenden können, muss Ihr Arbeitsbereich über einen
**Enterprise**-Abrechnungstarif verfügen. Für ein Upgrade wenden Sie sich bitte an den [Vertrieb] (https://www.8thwall.com/licensing).

## Authentifizierung {#authentication}

Die Authentifizierung erfolgt über geheime Schlüssel. Arbeitsbereiche mit einem Enterprise-Plan können einen API-Schlüssel anfordern.
Sie werden diesen geheimen Schlüssel in jede Anfrage aufnehmen, um zu überprüfen, ob die Anfrage autorisiert ist. Da der Schlüssel
auf Ihren Arbeitsbereich beschränkt ist, hat der Schlüssel Zugriff auf alle Bildziele innerhalb aller Anwendungen in diesem
Arbeitsbereich.

Sie können Ihren Schlüssel auf der Seite Ihres Kontos einsehen.

![Visualization showing image targets inside apps, apps inside the workspace, and the API Key inside the workspace](/images/authentication-structure.png)

#### Wichtig {#important}

Der Image Target API-Schlüssel ist ein B2B-Schlüssel, der mit Ihrem Arbeitsbereich verknüpft ist. Befolgen Sie die bewährten Verfahren, um
Ihren API-Schlüssel zu sichern, da die öffentliche Bekanntgabe Ihres API-Schlüssels zu unbeabsichtigter Nutzung und unbefugtem Zugriff führen kann
. Bitte vermeiden Sie insbesondere:

- Einbetten des Image Target API-Schlüssels in Code, der auf dem Gerät eines Benutzers ausgeführt oder öffentlich freigegeben wird
- Speichern des Image Target API-Schlüssels im Quellbaum Ihrer Anwendung

## Grenzwerte und Quoten {#limits-and-quotas}

- Sie können 500 Anfragen in einer
  Minute stellen, danach 25 Anfragen pro Minute, oder Sie können 20 Minuten warten und weitere
  500 Anfragen stellen.
- 10.000 Anfragen pro Tag.

**Anmerkung**: Diese Grenzwerte gelten nur für die Image Target Management API, die es Entwicklern ermöglicht,
dynamisch die mit einem 8th Wall-Projekt verbundene Bildbibliothek zu verwalten. **Diese Grenzen gelten nicht
für die Aktivierung eines Web-AR-Erlebnisses durch den Endnutzer**.

Um eine Erhöhung der Image Target API-Quoten für Projekte in Ihrem Arbeitsbereich
zu beantragen, senden Sie bitte eine Anfrage an [support](mailto:support@8thwall.com).

## Endpunkte {#endpoints}

- [Bildziel erstellen](#create-image-target)
- [Bildziele auflisten](#list-image-targets)
- [Bildziel abrufen](#get-image-target)
- [Bildziel ändern](#modify-image-target)
- [Bildziel löschen](#delete-image-target)
- [Ziel der Bildvorschau](#preview-image-target)

### Bildziel erstellen {#create-image-target}

Hochladen eines neuen Ziels in die Liste der Bildziele einer Anwendung

#### Anfrage {#post-request}

```bash
curl -X POST "https://api.8thwall.com/v1/apps/$APP_KEY/targets" \
    -H "X-Api-Key:$SECRET_KEY" \
    -F "name=my-target-name" \
    -F "image=@image.png"\
    -F "geometry.top=0"\
    -F "geometry.left=0"\
    -F "geometry.width=480"\
    -F "geometry.height=640"\
    -F "metadata={\"customFlag\":true}"
    -F "loadAutomatically=true"
```

| Feld                                                                                              | Typ          | Standardwert | Beschreibung                                                                                                                                                                                                       |
| :------------------------------------------------------------------------------------------------ | :----------- | :----------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bild                                                                                              | Binäre Daten |              | PNG- oder JPEG-Format, muss mindestens 480x640, weniger als 2048x2048 und weniger als 10MB groß sein                                                                                                               |
| Name                                                                                              | `String`     |              | Muss innerhalb einer Anwendung eindeutig sein, darf keine Tilden (~) enthalten und darf 255 Zeichen nicht überschreiten.                                        |
| type [Optional]                               | `String`     | 'PLANAR'     | 'PLANAR', 'ZYLINDER' oder 'KONISCH'.                                                                                                                                                               |
| Metadaten [Optional]                          | `String`     | `Null`       | Muss gültiges JSON sein, wenn "MetadataIsJson" wahr ist, und darf 2048 Zeichen nicht überschreiten.                                                                                                |
| metadataIsJson [Optional]                     | `Boolean`    | `true`       | Sie können "false" einstellen, um die Metadateneigenschaft als rohen String zu verwenden                                                                                                                           |
| loadAutomatisch [Optional]                    | `Boolean`    | false        | Jede Anwendung ist auf 5 Bildziele mit "Automatisch laden: wahr" beschränkt.                                                                                                       |
| geometry.isRotated [Optional] | `Boolean`    | false        | Wird auf true gesetzt, wenn das Bild vom Querformat ins Hochformat vorgedreht wird.                                                                                                                |
| Geometrie.oben                                                                    | Ganzzahl     |              | Diese Eigenschaften bestimmen den Zuschnitt, der auf Ihr Bild angewendet werden soll. Es muss ein Seitenverhältnis von 3:4 haben und mindestens 480x640 groß sein. |
| Geometrie.links                                                                   | Ganzzahl     |              |                                                                                                                                                                                                                    |
| Geometrie.Breite                                                                  | Ganzzahl     |              |                                                                                                                                                                                                                    |
| Geometrie.Höhe                                                                    | Ganzzahl     |              |                                                                                                                                                                                                                    |
| geometry.topRadius                                                                | Ganzzahl     |              | Nur erforderlich für `Typ: 'CONICAL'`                                                                                                                                                                              |
| geometry.bottomRadius                                                             | Ganzzahl     |              | Nur erforderlich für `Typ: 'CONICAL'`                                                                                                                                                                              |

#### Planar/Zylinder Upload Geometrie {#planar--cylinder-upload-geometry}

Dieses Diagramm zeigt, wie der angegebene Ausschnitt auf Ihr hochgeladenes Bild angewendet wird, um die
`imageUrl` und `thumbnailImageUrl` zu erzeugen. Das Verhältnis Breite:Höhe ist immer 3:4.

![Diagram showing how crop, rotation, and scale are applied to planar and cylinder image targets](/images/flat-geometry.jpg)

Für einen Querformatausschnitt laden Sie das Bild um 90 Grad im Uhrzeigersinn gedreht hoch, stellen
`geometry.isRotated: true` ein und geben den Ausschnitt anhand des gedrehten Bildes an.

![Diagram showing how crop, rotation, and scale are applied to planar and cylinder image targets when isRotated is true](/images/rotated-geometry.jpg)

#### Konische Upload-Geometrie {#conical-upload-geometry}

Dieses Diagramm zeigt, wie Ihr hochgeladenes Bild auf der Grundlage der Parameter reduziert und beschnitten wird. Das hochgeladene Bild
hat ein "Regenbogen"-Format, bei dem der obere und der untere Rand Ihres Inhalts an zwei konzentrischen Kreisen ausgerichtet sind
. Wenn Ihr Ziel oben schmaler ist als unten, geben Sie "topRadius"
als den negativen Wert des äußeren Radius und "bottomRadius" als den inneren Radius (positiv) an. Für einen
Landschaftsausschnitt setzen Sie `geometry.isRotated: true`, und das abgeflachte Bild wird gedreht, bevor der
Ausschnitt angewendet wird.

![Diagram showing how crop, rotation, and scale are applied to conical image targets](/images/cone-geometry.jpg)

#### Antwort {#post-response}

<span id="image-target-format">Dies ist das Standard-JSON-Antwortformat für Bildziele.</span>

```json
{
  "name": "...",
  "uuid": "...",
  "type": "PLANAR",
  "loadAutomatisch": true,
  "status": "AVAILABLE",
  "appKey": "...",
  "geometry": {
    "top": 842,
    "left": 392,
    "width": 851,
    "height": 1135,
    "isRotated": true,
    "originalWidth": 2000,
    "originalHeight": 2000
  },
  "metadata": null,
  "metadataIsJson": true,
  "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
  "imageUrl": "https://cdn.8thwall.com/image-target/...",
  "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
  "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
  "created": 1613508074845,
  "updated": 1613683291310
}
```

| Eigentum           | Typ       | Beschreibung                                                                                                                                                               |
| :----------------- | :-------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Name               | `String`  |                                                                                                                                                                            |
| uuid               | `String`  | Eindeutige ID dieses Bildziels                                                                                                                                             |
| Typ                | `String`  | 'PLANAR', 'ZYLINDER', oder 'KONISCH'.                                                                                                                      |
| loadAutomatisch    | `Boolean` |                                                                                                                                                                            |
| Status             | `String`  | `'AVAILABLE'` oder `'TAKEN_DOWN'`                                                                                                                                          |
| appKey             | `String`  | Die App, zu der das Ziel gehört                                                                                                                                            |
| Geometrie          | Objekt    | Siehe unten                                                                                                                                                                |
| Metadaten          | `String`  |                                                                                                                                                                            |
| metadataIsJson     | `Boolean` |                                                                                                                                                                            |
| originalImageUrl   | `String`  | CDN-URL für das hochgeladene Quellbild                                                                                                                                     |
| imageUrl           | `String`  | Beschnittene Version von "GeometryTextureUrl".                                                                                                             |
| thumbnailImageUrl  | `String`  | 350px hohe Version der `imageUrl` zur Verwendung in Miniaturansichten                                                                                                      |
| geometryTextureUrl | `String`  | Bei konischen Bildern ist dies eine abgeflachte Version des Originalbildes, bei ebenen und zylindrischen Bildern ist dies dasselbe wie `originalImageUrl`. |
| erstellt           | Ganzzahl  | Erstellungsdatum in Millisekunden nach der Unix-Epoche                                                                                                                     |
| aktualisiert       | Ganzzahl  | Datum der letzten Aktualisierung in Millisekunden nach der Unix-Epoche                                                                                                     |

#### Planare Geometrie {#planar-geometry}

| Eigentum       | Typ       | Beschreibung                    |
| :------------- | :-------- | :------------------------------ |
| top            | Ganzzahl  |                                 |
| links          | Ganzzahl  |                                 |
| Breite         | Ganzzahl  |                                 |
| Höhe           | Ganzzahl  |                                 |
| isRotated      | Boolesche |                                 |
| originalBreite | Ganzzahl  | Breite des hochgeladenen Bildes |
| originalHöhe   | Ganzzahl  | Höhe des hochgeladenen Bildes   |

#### Zylinder oder konische Geometrie {#cylinder-or-conical-geometry}

Erweitert die Eigenschaften von Planar Geometry mit der Änderung, dass `originalWidth` und
`originalHeight` sich auf die Dimensionen des unter geometryTextureUrl gespeicherten abgeflachten Bildes beziehen.

| Eigentum                    | Typ       | Beschreibung                                                                                                                                                       |
| :-------------------------- | :-------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| topRadius                   | Schwimmer |                                                                                                                                                                    |
| bottomRadius                | Schwimmer |                                                                                                                                                                    |
| Konformität                 | Schwimmer | Immer 0 für `type: ZYLINDER`, abgeleitet von `topRadius`/`bottomRadius` für `type: KONISCH`                                                                        |
| ZylinderUmfangOben          | Schwimmer | Der Umfang des Vollkreises, der von der oberen Kante Ihrer Zielscheibe gezogen wird                                                                                |
| targetCircumferenceTop      | Schwimmer | Die Länge entlang der Oberkante der Zielscheibe, bevor der Beschnitt erfolgt                                                                                       |
| cylinderCircumferenceBottom | Schwimmer | Abgeleitet von "CylinderCircumferenceTop" und "TopRadius" / "BottomRadius".                                                                        |
| cylinderSideLength          | Schwimmer | Abgeleitet von `targetCircumferenceTop` und den ursprünglichen Bildabmessungen                                                                                     |
| arcAngle                    | Schwimmer | Abgeleitet von `cylinderCircumferenceTop` und `targetCircumferenceTop`.                                                                            |
| inputMode                   | `String`  | 'BASIC' oder 'ADVANCED'. Steuert, was die Benutzer in der 8th Wall-Konsole sehen, entweder Schieberegler oder Zahleneingabefelder. |

### Bildziele auflisten {#list-image-targets}

Abfrage nach einer Liste von Bildzielen, die zu einer Anwendung gehören. Die Ergebnisse sind paginiert, d. h. wenn die Anwendung
mehr Bildziele enthält, als in einer Antwort zurückgegeben werden können, müssen Sie mehrere
Anfragen stellen, um die vollständige Liste der Bildziele aufzulisten.

#### Anfrage {#list-request}

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets" -H "X-Api-Key:$SECRET_KEY"
```

| Parameter                                                                  | Typ      | Beschreibung                                                                                                                                         |
| :------------------------------------------------------------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------- |
| von [fakultativ]       | `String` | Gibt die Spalte an, nach der sortiert werden soll. Die Optionen sind "erstellt", "aktualisiert", "Name" oder "uuid". |
| dir [Optional]         | `String` | Steuert die Sortierrichtung der Liste. Entweder "asc" oder "desc".                                                   |
| start [Optional]       | `String` | Gibt an, dass die Liste mit Einträgen beginnt, die diesen Wert in der Spalte "by" haben.                                             |
| nach [fakultativ]      | `String` | Gibt an, dass die Liste unmittelbar nach den Einträgen beginnt, die diesen Wert haben                                                                |
| Grenze [Optional]      | Ganzzahl | Muss zwischen 1 und 500 liegen                                                                                                                       |
| Fortsetzung [Optional] | `String` | Dient zum Abrufen der nächsten Seite nach der ersten Abfrage.                                                                        |

#### Sortierte Liste {#sorted-list}

Diese Abfrage listet die Ziele der App auf, beginnend mit "z" und gehend zu "a".

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=name&dir=desc" -H "X-Api-Key:$SECRET_KEY"
```

#### Mehrere Sorten {#multiple-sorts}

Sie können einen zweiten "sort-by"-Parameter angeben, der im Falle von Duplikaten in Ihrem ersten "by"-Wert als Tiebreaker fungiert. uuid" wird als Standard-Tiebreaker verwendet, wenn keine Angaben gemacht werden.

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid" -H "X-Api-Key:$SECRET_KEY"
```

#### Geben Sie einen Startpunkt an {#specify-a-starting-point}

Sie können "Start"- oder "After"-Werte angeben, die den "By"-Werten entsprechen, um Ihre aktuelle Position in der Liste zu bestimmen. Wenn Sie möchten, dass Ihre Liste unmittelbar nach dem Eintrag mit `updated: 333` und `uuid: 777` beginnen soll, würden Sie verwenden:

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid&start=333&after=777" -H "X-Api-Key:$SECRET_KEY"
```

Auf diese Weise werden Elemente mit \\`updated: 333" immer noch auf der nächsten Seite erscheinen, wenn ihre "uuid" nach "777" kommt. Wenn der Wert "Aktualisiert" eines Eintrags größer als "333", seine "UID" aber kleiner als "777" ist, wird er trotzdem auf der nächsten Seite angezeigt, da die zweite Eigenschaft "Durch" nur bei Tiebreakern zum Tragen kommt.

Es ist nicht zulässig, einen "After"-Wert für die Hauptsortierung anzugeben, während ein "Start"-Wert für die Tiebreaker-Sortierung angegeben wird. Es wäre zum Beispiel nicht zulässig, `?by=name&by=uuid&after=my-name-&start=333` anzugeben. Dies sollte stattdessen `?by=name&by=uuid&after=my-name-` lauten, da der zweite Startpunkt nur ins Spiel kommt, wenn der Hauptstartpunkt inklusive ist (mit `start`).

![Diagram showing how the by, start, and after parameters specify the starting point of the list](/images/image-target-sort.png)

#### Antwort {#list-response}

JSON-Objekt, das die Eigenschaft "targets" enthält, ein Array von Bildzielobjekten im [Standardformat] (#post-response).

Wenn `continuationToken` vorhanden ist, müssen Sie in einer Folgeanfrage `?continuation=[continuationToken]` angeben, um die nächste Seite der Bildziele abzurufen.

```json
{
  "continuationToken": "...",
  "targets": [{
    "name": "...",
    "uuid": "...",
    "type": "PLANAR",
    "loadAutomatisch": true,
    "status": "AVAILABLE",
    "appKey": "...",
    "geometry": {
      "top": 842,
      "left": 392,
      "width": 851,
      "height": 1135,
      "isRotated": true,
      "originalWidth": 2000,
      "originalHeight": 2000
    },
    "metadata": null,
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
    "imageUrl": "https://cdn.8thwall.com/image-target/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
    "created": 1613508074845,
    "updated": 1613683291310
  }, {
    "name": "...",
    "uuid": "...",
    "type": "CONICAL",
    "loadAutomatisch": true,
    "status": "AVAILABLE",
    "appKey": "...",
    "geometry": {
      "top": 0,
      "left": 0,
      "width": 480,
      "height": 640,
      "originalWidth": 886,
      "originalHeight": 2048,
      "isRotated": true,
      "cylinderCircumferenceTop": 100,
      "cylinderCircumferenceBottom": 40,
      "targetCircumferenceTop": 50,
      "cylinderSideLength": 21.63,
      "topRadius": 1600,
      "bottomRadius": 640,
      "arcAngle": 180,
      "coniness": 1.3219280948873624,
      "inputMode": "BASIC"
    },
    "metadata": "my-metadata": 34534}",
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/...",
    "imageUrl": "https://cdn.8thwall.com/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/...",
    "created": 1613508074845,
    "updated": 1613683291310
  }]
}
```

### Bildziel abrufen {#get-image-target}

#### Anfrage {#get-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Antwort {#get-response}

JSON-Objekt des [Standard-Bildzielformats](#post-response)

### Ändern Sie das Bildziel {#modify-image-target}

Die folgenden Eigenschaften können geändert werden:

- Name
- Automatisch laden
- Metadaten
- `metadataIsJson`

Es gelten dieselben Überprüfungsregeln wie beim [ersten Hochladen](#create-image-target)

Für zylindrische und konische Bildziele können die folgenden Eigenschaften des Objekts "Geometrie" ebenfalls geändert werden:

- `ZylinderumfangOben`
- ZielUmfangOben
- Eingabemodus

Die anderen Geometrieeigenschaften des Ziels werden entsprechend aktualisiert.

#### Anfrage {#patch-request}

```bash
curl -X PATCH "https://api.8thwall.com/v1/targets/$TARGET_UUID"\
    -H "X-Api-Key:$SECRET_KEY"\
    -H "Content-Type: application/json"\
    --data '{"name": "new-name", "geometry: {"inputMode": "BASIC"}, "metadata": "{}"}'
```

#### Antwort {#patch-response}

JSON-Objekt des [Standard-Bildzielformats](#post-response)

### Bildziel löschen {#delete-image-target}

#### Anfrage {#delete-request}

```bash
curl -X DELETE "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Antwort {#delete-response}

Ein erfolgreicher Löschvorgang liefert eine leere Antwort mit dem Statuscode \\`204: Kein Inhalt" zurück.

### Vorschaubild Ziel {#preview-image-target}

Generieren Sie eine URL, mit der die Benutzer eine Vorschau des Trackings für ein Ziel anzeigen können.

#### Anfrage {#preview-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID/test" -H "X-Api-Key:$SECRET_KEY"
```

#### Antwort {#preview-response}

```json
{
  "url": "https://8w.8thwall.app/previewit/?j=...",
  "token": "...",
  "exp": 1612830293128
}
```

| Eigentum | Typ      | Beschreibung                                                                                                                                        |
| :------- | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------- |
| url      | `String` | Die URL, die für die Vorschau der Zielverfolgung verwendet werden kann                                                                              |
| Token    | `String` | Dieser Token kann derzeit nur von unserer Vorschau-App verwendet werden.                                                            |
| exp      | Ganzzahl | Der Zeitstempel in Millisekunden, wann das Token ablaufen wird. Die Token verfallen eine Stunde nach ihrer Ausgabe. |

Die Vorschaufunktion ist für die Verwendung im Kontext eines bestimmten Benutzers gedacht, der Bildziele verwaltet oder
konfiguriert. Veröffentlichen Sie keine Vorschau-URLs auf einer öffentlichen Website oder geben Sie sie nicht an eine große Anzahl von Benutzern weiter.

**Best Practices für benutzerdefinierte Vorschau-Erlebnisse:** Die Vorschau-URL, die von der API zurückgegeben wird, ist
das 8. generische Vorschau-Bild-Ziel-Erlebnis. Wenn Sie das
Frontend Ihrer Bildzielvorschau weiter anpassen möchten, führen Sie folgende Schritte aus:

1. Erstellen Sie ein öffentliches 8th Wall-Projekt
2. Passen Sie die UX dieses Projekts nach Ihren Wünschen an
3. Laden Sie die Bildziele, die die Benutzer testen möchten, über die API hoch, indem Sie den App-Schlüssel für das Projekt verwenden, das Sie
   in Schritt 1 erstellt haben.
4. Generieren Sie eine testbare Bildziel-URL für Endbenutzer unter Verwendung der öffentlichen URL des Projekts aus Schritt 1
   und eines URL-Parameters mit dem Namen des Bildziels
5. In dem Projekt, das Sie in Schritt 1 erstellt haben, verwenden Sie den URL-Parameter, um das aktive Bildziel mit dem Aufruf
   [`XR8.XrController.configure({imageTargets: ['theTargetName']})`](./xrcontroller/configure.md) festzulegen.

## Fehlerbehandlung {#error-handling}

Wenn die API Ihre Anfrage zurückweist, lautet die Antwort `Content-Type: application/json`, und der
body enthält eine `message`-Eigenschaft mit einer Fehlerzeichenfolge.

## Beispiel {#example}

```json
{
  "Nachricht": "App nicht gefunden: ..."
}
```

#### Status Codes {#status-codes}

| Status | Grund                                                                                                                                                                                                                                                                                                         |
| :----- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 400    | Dies kann passieren, wenn Sie einen ungültigen Wert angegeben oder einen Parameter angegeben haben, der nicht existiert.                                                                                                                                                                      |
| 403    | Dies kann passieren, wenn Sie Ihren geheimen Schlüssel nicht korrekt angeben.                                                                                                                                                                                                                 |
| 404    | Die Anwendung oder das Bildziel könnte gelöscht worden sein, oder der Schlüssel der Anwendung oder die UUID des Ziels sind falsch. Dies ist auch der Antwortcode, wenn der angegebene API-Schlüssel nicht mit der Ressource übereinstimmt, auf die Sie zuzugreifen versuchen. |
| 413    | Das hochgeladene Bild wurde abgelehnt, weil die Datei zu groß ist.                                                                                                                                                                                                                            |
| 429    | Ihr API-Schlüssel hat sein zugehöriges [Ratenlimit] überschritten (#limits-and-quotas).                                                                                                                                |
