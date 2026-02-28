---
id: importing-xrextras-into-cloud-editor
---

# XRExtras in den Cloud Editor importieren

Dieser Teil der Dokumentation ist für fortgeschrittene Benutzer gedacht, die den 8th Wall Cloud
Editor verwenden und eine vollständig angepasste Version von XRExtras erstellen müssen. Dieser Prozess umfasst:

- Klonen des XRExtras-Codes von GitHub
- Importieren von Dateien in Ihr Cloud Editor-Projekt
- Deaktivierung der Typüberprüfung in A-Frame-Komponentendateien
- Aktualisieren Sie Ihren Code, um Ihre lokale, benutzerdefinierte Kopie von XRExtras zu verwenden, anstatt unsere Standardversion aus dem CDN zu beziehen (über Meta-Tag)

Wenn Sie nur grundlegende Anpassungen des XRExtras-Ladebildschirms vornehmen müssen, lesen Sie bitte stattdessen
[diesen Abschnitt](/legacy/guides/advanced-topics/load-screen).

Hinweis: Wenn Sie eine Kopie von XRExtras in Ihr Cloud Editor-Projekt importieren, erhalten Sie nicht mehr die
neuesten XRExtras-Updates und -Funktionen, die im CDN verfügbar sind. Stellen Sie sicher, dass Sie immer die neueste
Version des XRExtras-Codes von GitHub ziehen, wenn Sie neue Projekte beginnen.

Anweisungen:

1. Erstellen Sie einen Ordner "myxrextras" in Ihrem Cloud Editor-Projekt

2. Klonen <https://github.com/8thwall/web>

3. Fügen Sie den Inhalt des Verzeichnisses "xrextras/src/" (<https://github.com/8thwall/web/tree/master/xrextras/src>)
   zu Ihrem Projekt hinzu, mit der **Ausnahme** von index.js

4. Der Inhalt Ihres Projekts wird in etwa so aussehen:

![xrextras files](/images/xrextras-import-files.jpg)

5. Entfernen Sie für **jede** Datei im Ordner "aframe/components" die Anweisung "import" und ersetzen Sie sie durch "// @ts-nocheck".

![xrextras disable type-checking](/images/xrextras-disable-type-checking.jpg)

6. Entfernen Sie in head.html den Tag "<meta>" für @8thwall.xrextras oder kommentieren Sie ihn aus, damit er nicht mehr von unserem CDN bezogen wird:

![xrextras head](/images/xrextras-import-head.jpg)

7. Importieren Sie in app.js Ihre lokale xrextras-Bibliothek:

![xrextras appjs](/images/xrextras-import-appjs.jpg)

#### Ändern/Hinzufügen von Bildmaterial {#changingadding-image-assets}

Ziehen Sie zunächst neue Bilder per Drag & Drop in assets/, um sie in Ihr Projekt hochzuladen:

![xrextras asset](/images/xrextras-import-asset.jpg)

In **html**-Dateien mit `src`-Parametern, verweisen Sie auf das Bild-Asset mit einem relativen Pfad:

`<img src="​../../assets/​my-logo.png" id="loadImage" class="spin" />`

In **Javascript**-Dateien, verwenden Sie einen relativen Pfad und `require()`, um auf Assets zu verweisen:

`img.src = require('../../assets/mein-logo.png')`
