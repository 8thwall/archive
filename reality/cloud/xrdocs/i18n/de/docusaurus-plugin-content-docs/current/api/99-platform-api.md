# Plattform-API: Bildziele

Die 8th Wall Image Target Management API ermöglicht es Entwicklern, die **Image Target Bibliothek** dynamisch zu verwalten, die mit ihren 8th Wall powered WebAR Projekten verbunden ist. Diese API und die dazugehörige Dokumentation ist für Entwickler gedacht, die mit der Web-Entwicklung und den 8-Wall-Bildzielen vertraut sind.

**Bevor Sie beginnen:** Bevor Sie die Image Target API verwenden können, muss Ihr Arbeitsbereich über einen **Pro-** oder **Enterprise-Abrechnungstarif** verfügen. Für ein Upgrade wenden Sie sich bitte an [oder](https://www.8thwall.com/licensing).

## Authentifizierung {#authentication}

Die Authentifizierung erfolgt über geheime Schlüssel. Arbeitsbereiche mit einem Pro- oder Enterprise-Tarif können einen API-Schlüssel anfordern. Sie werden diesen geheimen Schlüssel in jede Anfrage einfügen, um zu überprüfen, ob die Anfrage autorisiert ist. Da der Schlüssel auf Ihren Arbeitsbereich beschränkt ist, hat der Schlüssel Zugriff auf alle Bildziele in allen Anwendungen in diesem Arbeitsbereich.

Sie können Ihren Schlüssel auf der Seite Ihres Kontos einsehen.

![Visualisierung von Bildzielen innerhalb von Apps, Apps innerhalb des Arbeitsbereichs und des API-Schlüssels innerhalb des Arbeitsbereichs](/images/authentication-structure.png)

#### Wichtig {#important}

Der Image Target API-Schlüssel ist ein B2B-Schlüssel, der mit Ihrem Arbeitsbereich verbunden ist. Befolgen Sie die bewährten Methoden, um Ihren API-Schlüssel zu sichern, da die öffentliche Bekanntgabe Ihres API-Schlüssels zu unbeabsichtigter Nutzung und unbefugtem Zugriff führen kann . Bitte vermeiden Sie insbesondere:

- Einbetten des Image Target API-Schlüssels in Code, der auf dem Gerät eines Benutzers läuft oder öffentlich freigegeben wird
- Speichern des Image Target API-Schlüssels innerhalb des Quellbaums Ihrer Anwendung

## Grenzwerte und Quoten {#limits-and-quotas}

- 25 Anfragen pro Minute, mit einer Burst-Erlaubnis von 500, d.h. Sie können 500 Anfragen in einer Minute stellen, danach 25 Anfragen pro Minute, oder Sie können 20 Minuten warten und weitere 500 Anfragen stellen.
- 10.000 Anfragen pro Tag.

**Hinweis**: Diese Einschränkungen gelten nur für die Image Target Management API, die es Entwicklern ermöglicht, die mit einem 8th Wall-Projekt verbundene Bildbibliothek dynamisch zu verwalten. **Diese Grenzen gelten nicht für die Aktivierung eines WebAR-Erlebnisses durch den Endbenutzer.**

Um eine Erhöhung der Bildziel-API-Quotenlimits für Projekte in Ihrem Arbeitsbereich zu beantragen, senden Sie bitte eine Anfrage an [support](mailto:support@8thwall.com).

## Endpunkte {#endpoints}

- [Bildziel erstellen](#create-image-target)
- [Bildziele auflisten](#list-image-targets)
- [Bildziel abrufen](#get-image-target)
- [Bildziel ändern](#modify-image-target)
- [Bildziel löschen](#delete-image-target)
- [Ziel der Bildvorschau](#preview-image-target)

### Bildziel erstellen {#create-image-target}

Ein neues Ziel in die Liste der Bildziele einer App hochladen

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

| Feld                          | Typ          | Standardwert | Beschreibung                                                                                                                                         |
|:----------------------------- |:------------ |:------------ |:---------------------------------------------------------------------------------------------------------------------------------------------------- |
| bild                          | Binäre Daten |              | PNG- oder JPEG-Format, muss mindestens 480x640, weniger als 2048x2048 und weniger als 10MB groß sein                                                 |
| name                          | `String`     |              | Muss innerhalb einer Anwendung eindeutig sein, darf keine Tilden (~) enthalten und darf 255 Zeichen nicht überschreiten                              |
| typ [Optional]                | `String`     | `'PLANAR'`   | `'PLANAR'`, `'ZYLINDER'`, oder `'KONISCH'`.                                                                                                          |
| metadaten [optional]          | `String`     | `null`       | Muss gültiges JSON sein, wenn `metadataIsJson` wahr ist, und darf 2048 Zeichen nicht überschreiten                                                   |
| metadataIsJson [Optional]     | `Boolesche`  | `wahr`       | Sie können auf Falsch setzen, um die Metadaten-Eigenschaft als rohen String zu verwenden                                                             |
| loadAutomatisch [Optional]    | `Boolesche`  | `false`      | Jede App ist auf 5 Bildziele beschränkt mit `loadAutomatically: true`                                                                                |
| geometry.isRotated [Optional] | `Boolesche`  | `false`      | Auf true gesetzt, wenn das Bild vom Querformat ins Hochformat vorgedreht ist.                                                                        |
| geometrie.top                 | integer      |              | Diese Eigenschaften legen fest, wie Ihr Bild zugeschnitten werden soll. Es muss ein Seitenverhältnis von 3:4 haben und mindestens 480x640 groß sein. |
| geometry.left                 | integer      |              |                                                                                                                                                      |
| geometry.width                | integer      |              |                                                                                                                                                      |
| geometry.height               | integer      |              |                                                                                                                                                      |
| geometry.topRadius            | integer      |              | Nur erforderlich für `Typ: 'CONICAL'`                                                                                                                |
| geometry.bottomRadius         | integer      |              | Nur erforderlich für `Typ: 'CONICAL'`                                                                                                                |

#### Planar/Zylinder Hochladen Geometrie {#planar--cylinder-upload-geometry}

Dieses Diagramm zeigt, wie der angegebene Ausschnitt auf Ihr hochgeladenes Bild angewendet wird, um die `imageUrl` und `thumbnailImageUrl` zu erzeugen. Das Verhältnis Breite:Höhe ist immer 3:4.

![Das Diagramm zeigt, wie Zuschneiden, Drehen und Skalieren auf ebene und zylindrische Bildziele angewendet werden](/images/flat-geometry.jpg)

Für einen Querformatausschnitt laden Sie das Bild um 90 Grad im Uhrzeigersinn gedreht hoch, stellen `geometry.isRotated: true` ein und legen den Ausschnitt für das gedrehte Bild fest.

![Diagramm, das zeigt, wie Zuschneiden, Drehen und Skalieren auf ebene und zylindrische Bildziele angewendet werden, wenn isRotated true ist](/images/rotated-geometry.jpg)

#### Konische Hochladung Geometrie {#conical-upload-geometry}

Dieses Diagramm zeigt, wie Ihr hochgeladenes Bild auf der Grundlage der Parameter verkleinert und zugeschnitten wird. Das hochgeladene Bild hat ein "Regenbogen"-Format, bei dem der obere und untere Rand Ihres Inhalts an zwei konzentrischen Kreisen ausgerichtet ist . Wenn Ihr Ziel oben schmaler ist als unten, geben Sie `topRadius` als Negativ des Außenradius und `bottomRadius` als Innenradius (positiv) an. Für einen Landschaftsausschnitt setzen Sie `geometry.isRotated: true`, und das reduzierte Bild wird gedreht, bevor der Ausschnitt angewendet wird.

![Diagramm, das zeigt, wie Zuschneiden, Drehen und Skalieren auf konische Bildziele angewendet werden](/images/cone-geometry.jpg)

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
    "originalBreite": 2000,
    "originalHeight": 2000
  },
  "metadata": null,
  "metadataIsJson": true,
  "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
  "imageUrl": "https://cdn.8thwall.com/image-target/...",
  "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
  "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
  "erstellt": 1613508074845,
  "updated": 1613683291310
}
```

| Eigentum           | Typ         | Beschreibung                                                                                                                          |
|:------------------ |:----------- |:------------------------------------------------------------------------------------------------------------------------------------- |
| name               | `String`    |                                                                                                                                       |
| uuid               | `String`    | Eindeutige ID dieses Bildziels                                                                                                        |
| typ                | `String`    | `'PLANAR'`, `'ZYLINDER'`, oder `'KONISCH'`                                                                                            |
| loadAutomatisch    | `Boolesche` |                                                                                                                                       |
| status             | `String`    | `'AVAILABLE'` oder `'TAKEN_DOWN'`                                                                                                     |
| appKey             | `String`    | Die App, zu der das Ziel gehört                                                                                                       |
| geometry           | `Objekt`    | Siehe unten                                                                                                                           |
| metadaten          | `String`    |                                                                                                                                       |
| metadataIsJson     | `Boolesche` |                                                                                                                                       |
| originalImageUrl   | `String`    | CDN URL für das hochgeladene Quellbild                                                                                                |
| imageUrl           | `String`    | Abgeschnittene Version von `geometryTextureUrl`                                                                                       |
| thumbnailImageUrl  | `String`    | 350px hohe Version der `imageUrl` zur Verwendung in Miniaturansichten                                                                 |
| geometryTextureUrl | `String`    | Für konisch ist dies eine abgeflachte Version des Originalbildes, für planar und zylindrisch ist dies dasselbe wie `originalImageUrl` |
| erstellt           | integer     | Erstellungsdatum in Millisekunden nach der Unix-Epoche                                                                                |
| updated            | integer     | Datum der letzten Aktualisierung in Millisekunden nach der Unix-Epoche                                                                |

#### Planare Geometrie {#planar-geometry}

| Eigentum       | Typ       | Beschreibung                    |
|:-------------- |:--------- |:------------------------------- |
| top            | integer   |                                 |
| left           | integer   |                                 |
| width          | integer   |                                 |
| height         | integer   |                                 |
| isRotated      | Boolesche |                                 |
| originalWidth  | integer   | Breite des hochgeladenen Bildes |
| originalHeight | integer   | Höhe des hochgeladenen Bildes   |

#### Zylinder oder konische Geometrie {#cylinder-or-conical-geometry}

Erweitert die Eigenschaften von Planar Geometry mit der Änderung, dass `originalWidth` und `originalHeight` sich auf die Abmessungen des reduzierten Bildes beziehen, das unter geometryTextureUrl gespeichert ist.

| Eigentum                    | Typ      | Beschreibung                                                                                                                       |
|:--------------------------- |:-------- |:---------------------------------------------------------------------------------------------------------------------------------- |
| topRadius                   | float    |                                                                                                                                    |
| bottomRadius                | float    |                                                                                                                                    |
| coniness                    | float    | Immer 0 für `type: ZYLINDER`, abgeleitet von `topRadius`/`bottomRadius` für `type: KONISCH`                                        |
| cylinderCircumferenceTop    | float    | Der Umfang des Vollkreises, der von der oberen Kante Ihrer Zielscheibe gezogen wird                                                |
| targetCircumferenceTop      | float    | Die Länge entlang der oberen Kante Ihres Ziels, bevor der Beschnitt angewendet wird                                                |
| cylinderCircumferenceBottom | float    | Abgeleitet von `cylinderCircumferenceTop` und `topRadius`/`bottomRadius`                                                           |
| cylinderSideLength          | float    | Abgeleitet von `targetCircumferenceTop` und den ursprünglichen Bildmaßen                                                           |
| arcAngle                    | float    | Abgeleitet von `cylinderCircumferenceTop` und `targetCircumferenceTop`                                                             |
| inputMode                   | `String` | `'BASIC'` oder `'ADVANCED'`. Steuert, was Benutzer in der 8th Wall-Konsole sehen, entweder Schieberegler oder Zahleneingabefelder. |

### Bildziele auflisten {#list-image-targets}

Abfrage nach einer Liste von Bildzielen, die zu einer App gehören. Die Ergebnisse sind paginiert, d.h. wenn die App mehr Bildziele enthält, als in einer Antwort zurückgegeben werden können, müssen Sie mehrere Anfragen stellen, um die vollständige Liste der Bildziele aufzulisten.

#### Anfrage {#list-request}

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets" -H "X-Api-Key:$SECRET_KEY"
```

| Parameter              | Typ      | Beschreibung                                                                                                         |
|:---------------------- |:-------- |:-------------------------------------------------------------------------------------------------------------------- |
| von [Optional]         | `String` | Gibt die Spalte an, nach der sortiert werden soll. Die Optionen sind "erstellt", "aktualisiert", "Name" oder "uuid". |
| dir [Optional]         | `String` | Steuert die Sortierrichtung der Liste. Entweder "asc" oder "desc".                                                   |
| start [Optional]       | `String` | Gibt an, dass die Liste mit Artikeln beginnt, die diesen Wert in der Spalte `von` haben                              |
| nach [Optional]        | `String` | Legt fest, dass die Liste unmittelbar nach den Elementen beginnt, die diesen Wert haben                              |
| limit [Optional]       | integer  | Muss zwischen 1 und 500 liegen                                                                                       |
| fortsetzung [Optional] | `String` | Dient zum Abrufen der nächsten Seite nach der ersten Abfrage.                                                        |

#### Sortierte Liste {#sorted-list}

Diese Abfrage listet die Ziele der App auf, beginnend mit "z" und in Richtung "a".

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=name&dir=desc" -H "X-Api-Key:$SECRET_KEY"
```

#### Mehrere Sorten {#multiple-sorts}

Sie können einen zweiten "sort-by"-Parameter angeben, der im Falle von Duplikaten in Ihrem ersten `nach` Wert als Tiebreaker fungiert. `uuid` wird als Standard-Tiebreaker verwendet, wenn keine Angaben gemacht werden.

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid" -H "X-Api-Key:$SECRET_KEY"
```

#### Einen Startpunkt festlegen {#specify-a-starting-point}

Sie können `ab` oder `nach den` -Werten angeben, die den `- bis` -Werten entsprechen, um Ihre aktuelle Position in der Liste anzugeben. Wenn Sie möchten, dass Ihre Liste unmittelbar nach dem Artikel mit `aktualisiert beginnt: 333` und `uuid: 777`, würden Sie verwenden:

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid&start=333&after=777" -H "X-Api-Key:$SECRET_KEY"
```

Auf diese Weise werden Artikel mit `aktualisiert: 333` noch auf der nächsten Seite erscheinen, wenn ihre `uuid` nach `777` kommt. Wenn der Wert `aktualisiert` größer ist als `333`, aber seine `uuid` kleiner ist als `777`, wird er trotzdem auf der nächsten Seite angezeigt, da die zweite Eigenschaft `by` nur bei Tiebreakern zum Tragen kommt.

Es ist nicht zulässig, für die Hauptsortierung einen Wert `nach` anzugeben, während für die Tiebreaker-Sortierung ein `Startwert` angegeben wird. Es wäre zum Beispiel nicht zulässig, `?by=name&by=uuid&after=my-name-&start=333` anzugeben. Dies sollte stattdessen`?by=name&by=uuid&after=my-name-` sein, da der zweite Startpunkt nur dann ins Spiel kommt, wenn der Hauptstartpunkt inklusive ist (mit `starten Sie`).

![Das Diagramm zeigt, wie die Parameter by, start und after den Startpunkt der Liste festlegen](/images/image-target-sort.png)

#### Antwort {#list-response}

JSON-Objekt mit der Eigenschaft `targets`, bei der es sich um ein Array von Bildzielobjekten im [Standardformat](#image-target-format) handelt.

Wenn `continuationToken` vorhanden ist, müssen Sie `?continuation=[continuationToken]` in einer Folgeanfrage angeben, um die nächste Seite der Bildziele abzurufen.

```json
{
  "continuationToken": "...",
  "targets": [{
    "name": "...",
    "uuid": "...",
    "type": "PLANAR",
    "loadAutomatically": true,
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
    "erstellt": 1613508074845,
    "updated": 1613683291310
  }, {
    "name": "...",
    "uuid": "...",
    "type": "CONICAL",
    "loadAutomatically": true,
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
    "metadata": "{\"my-metadata\": 34534}",
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/...",
    "imageUrl": "https://cdn.8thwall.com/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/...",
    "erstellt": 1613508074845,
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

JSON-Objekt des [Standard-Bildzielformats](#image-target-format)

### Bildziel ändern {#modify-image-target}

Die folgenden Eigenschaften können geändert werden:

- `name`
- `loadAutomatically`
- `metadata`
- `metadataIsJson`

Es gelten die gleichen Überprüfungsregeln wie beim ersten Hochladen von [](#create-image-target)

Für zylindrische und konische Bildziele können die folgenden Eigenschaften des Objekts `geometry` ebenfalls geändert werden:

- `cylinderCircumferenceTop`
- `targetCircumferenceTop`
- `inputMode`

Die anderen Geometrieeigenschaften des Ziels werden entsprechend aktualisiert.

#### Anfrage {#patch-request}

```bash
curl -X PATCH "https://api.8thwall.com/v1/targets/$TARGET_UUID"\
    -H "X-Api-Key:$SECRET_KEY"\
    -H "Content-Type: application/json"\
    --data '{"name":"new-name", "geometry: {"inputMode": "BASIC"}, "metadata": "{}"}'
```

#### Antwort {#patch-response}

JSON-Objekt des [Standard-Bildzielformats](#image-target-format)

### Bildziel löschen {#delete-image-target}

#### Anfrage {#delete-request}

```bash
curl -X DELETE "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Antwort {#delete-response}

Bei einem erfolgreichen Löschvorgang wird eine leere Antwort mit dem Statuscode `204 zurückgegeben: Kein Inhalt`.

### Ziel der Bildvorschau {#preview-image-target}

Generieren Sie eine URL, die Benutzer verwenden können, um eine Vorschau des Trackings für ein Ziel zu sehen.

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

| Eigentum | Typ      | Beschreibung                                                                                                    |
|:-------- |:-------- |:--------------------------------------------------------------------------------------------------------------- |
| url      | `String` | Die URL, die für die Vorschau der Zielverfolgung verwendet werden kann                                          |
| token    | `String` | Dieser Token kann derzeit nur von unserer Vorschau-App verwendet werden.                                        |
| exp      | integer  | Der Zeitstempel in Millisekunden, wann der Token ablaufen wird. Token verfallen eine Stunde nach ihrer Ausgabe. |

Die Vorschaufunktion ist für die Verwendung im Zusammenhang mit einem bestimmten Benutzer gedacht, der Bildziele verwaltet oder konfiguriert. Veröffentlichen Sie keine Vorschau-URLs auf einer öffentlichen Website oder teilen Sie sie mit einer großen Anzahl von Benutzern.

**Bewährte Verfahren für benutzerdefinierte Vorschaubilder:** Die Vorschau-URL, die von der API zurückgegeben wird, ist das generische VorschauBildzielerlebnis von 8th Wall. Wenn Sie das Frontend Ihrer Bildzielvorschau weiter anpassen möchten, gehen Sie wie folgt vor:

1. Erstellen Sie ein öffentliches 8th Wall Projekt
1. Passen Sie die UX dieses Projekts nach Ihren Wünschen an
1. Laden Sie mit dem App-Schlüssel für das Projekt, das Sie in Schritt 1 erstellt haben, über die API Bildziele hoch, die Benutzer testen möchten
1. Generieren Sie eine testbare Bildziel-URL für Endbenutzer, indem Sie die öffentliche URL des Projekts in Schritt 1 und einen URL-Parameter mit dem Namen des Bildziels verwenden
1. In dem Projekt, das Sie in Schritt 1 erstellt haben, verwenden Sie den URL-Parameter, um das aktive Bildziel festzulegen, indem Sie aufrufen [`XR8.XrController.configure({imageTargets: ['theTargetName']})`](./xrcontroller/configure.md).

## Fehlerbehandlung {#error-handling}

Wenn die API Ihre Anfrage ablehnt, lautet die Antwort `Content-Type: application/json`, und der Körper enthält eine `Nachricht` Eigenschaft, die eine Fehlerzeichenfolge enthält.

## Beispiel {#example}

```json
{
  "Nachricht": "App nicht gefunden: ..."
}
```

#### Status Codes {#status-codes}

| Status | Grund                                                                                                                                                                                                                                                   |
|:------ |:------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400    | Dies kann passieren, wenn Sie einen ungültigen Wert angegeben oder einen Parameter angegeben haben, der nicht existiert.                                                                                                                                |
| 403    | Dies kann passieren, wenn Sie Ihren geheimen Schlüssel nicht korrekt angeben.                                                                                                                                                                           |
| 404    | Die App oder das Bildziel könnte gelöscht worden sein, oder der App-Schlüssel oder die Ziel-UUID ist falsch. Dies ist auch der Antwortcode, wenn der angegebene API-Schlüssel nicht mit der Ressource übereinstimmt, auf die Sie zuzugreifen versuchen. |
| 413    | Das hochgeladene Bild wurde abgelehnt, weil die Datei zu groß ist.                                                                                                                                                                                      |
| 429    | Ihr API-Schlüssel hat das zugehörige [Ratenlimit überschritten](#limits-and-quotas).                                                                                                                                                                    |
