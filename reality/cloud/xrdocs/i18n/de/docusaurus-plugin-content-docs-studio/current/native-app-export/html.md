---
id: html
description: 'In diesem Abschnitt wird erklärt, wie Sie ein HTML5-Bundle exportieren.'
---

# HTML

## Exportieren eines HTML5-Bündels {#exporting-an-html5-bundle}

:::info[Important]
Zurzeit werden AR-Erlebnisse noch nicht über den HTML5-Export bereitgestellt.
Ihr Projekt muss 3D-Kameras verwenden, um richtig zu funktionieren.
:::

1. Der HTML5-Export ist derzeit nur für kostenpflichtige Konten verfügbar. Bitte lesen Sie die Informationen unter [Kontoeinstellungen](/account/settings/) für weitere Einzelheiten.

2. **Öffnen Sie Ihr Studio-Projekt**.

3. Klicken Sie auf **Veröffentlichen**. Wählen Sie unter dem Abschnitt **Export** die Option **HTML5**.

4. Wählen Sie eine Umgebung aus, in der Sie Ihr Bundle erstellen möchten.

5. Klicken Sie auf **Erstellen**, um Ihr HTML5-Bundle zu generieren.

> Sobald der Build abgeschlossen ist, laden Sie die `.zip`-Datei über die in der Build-Zusammenfassung angegebenen Download-Links herunter.

---

## Veröffentlichen Sie Ihr 8th Wall-Projekt auf Spieleplattformen

Da es sich bei den 8th Wall HTML5-Bundles um vollständig enthaltene Builds handelt, können sie selbst gehostet oder auf vielen Spieleplattformen veröffentlicht werden.

### Selbsthosting

:::note
Das HTML5-Bündel kann selbst gehostet oder auf viele verschiedene Arten bereitgestellt werden. Die folgende Anleitung ist nur ein Beispiel für die Verwendung von `npm`.
Umfassendere Informationen über Selbst-Hosting finden Sie in diesem [Leitfaden](https://github.com/mikeroyal/Self-Hosting-Guide).
:::

1. Laden Sie das `.zip`-Bündel herunter und entpacken Sie die Datei.
2. Wenn Sie `npm` noch nicht installiert haben, folgen Sie den Anweisungen auf dieser [Seite](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm), um es einzurichten.
3. Führen Sie `npm install --global http-server` aus, um das npm-Paket [http-server](https://www.npmjs.com/package/http-server) als globales CLI-Tool zu installieren.
4. Führen Sie `http-server <path_to_unzipped_folder>` aus.
   1. Beispiel: "htp-server /Benutzer/John/Downloads/mein-projekt".
5. Es sollte einige Protokolle geben, die eine Reihe lokaler URLs auflisten, wie z.B.:

```sh
Available on:
  http://127.0.0.1:8080
  http://192.168.20.43:8080
  http://172.29.29.159:8080
```

6. Öffnen Sie eine der URLs in Ihrem Webbrowser.

### Itch.io

1. Laden Sie das `.zip`-Bündel herunter.
2. Melden Sie sich bei [Itch.io](https://itch.io) an und [erstellen Sie ein neues Projekt](https://itch.io/game/new).
3. Füllen Sie die Projektdetails aus:
   - Wählen Sie unter **Projektart** die Option **HTML**.
   - Wählen Sie unter **Uploads** die Option **Dateien hochladen**. Laden Sie die in Schritt 1 heruntergeladene `.zip`-Datei hoch. Aktivieren Sie das Kontrollkästchen **Diese Datei wird im Browser abgespielt**.
   - Wählen Sie unter **Einbettungsoptionen** die passende Größe für Ihr Projekt.
4. Beenden Sie die Konfiguration Ihres Spiels und veröffentlichen Sie es.

### Vielfältig

1. Melden Sie sich bei [Viverse](https://viverse.com) an und [gehen Sie zu Viverse Studio](https://studio.viverse.com).
2. Klicken Sie unter **Eigenes Build hochladen** auf **Hochladen**.
3. Klicken Sie auf **Neue Welt erstellen**.
4. Geben Sie den **Name** und die **Beschreibung** für Ihr Projekt ein, und klicken Sie dann auf **Erstellen**.
5. Klicken Sie auf **Inhaltsversionen**.
6. Klicken Sie unter **Neue Version** auf **Datei auswählen**. Laden Sie die in Schritt 1 heruntergeladene "zip"-Datei hoch, und klicken Sie dann auf **Hochladen**.
7. Klicken Sie unter **iframe Support for Preview** auf **Apply iframe Settings** und aktivieren Sie alle für Ihr Projekt erforderlichen Berechtigungen.
   - Beachten Sie, dass Viverse das von 8th Wall heruntergeladene Projekt in einen eigenen iFrame einfügt, und dass der Viverse iFrame eine für Ihr Projekt erforderliche Genehmigung erteilen muss.
8. Beenden Sie die Konfiguration Ihres Spiels und veröffentlichen Sie es.

### Spiel Ruck

1. Melden Sie sich bei [Game Jolt](https://gamejolt.com) und [go to Game Jolt Store](https://gamejolt.com/games) an.
2. Klicken Sie auf **Ihr Spiel hinzufügen**.
3. Geben Sie die Projektdetails ein und klicken Sie auf **Speichern & Weiter**.
4. Klicken Sie in Ihrem Spiel-Dashboard unter **Pakete** auf **Paket hinzufügen**.
5. Klicken Sie unter **Paket bearbeiten** auf **Neue Version**.
6. Klicken Sie auf **Browser-Build hochladen**. Laden Sie die in Schritt 1 heruntergeladene `.zip`-Datei hoch.
7. Konfigurieren Sie die Abmessungen Ihres Spiels, oder wählen Sie **An den Bildschirm anpassen?**, wenn das Spiel an den Bildschirm angepasst werden soll.
8. Beenden Sie die Konfiguration Ihres Spiels und veröffentlichen Sie es.

### GamePix

:::info[Important]
GamePix erlaubt keine Spiele mit externen Links. Stellen Sie sicher, dass Ihr Projekt KEINE Netzwerkanrufe außerhalb des Bundles tätigt.
:::

1. Laden Sie den **Vollständigen HTML** Einbettungscode herunter.\
2. Melden Sie sich für ein [GamePix Developer Account](https://partners.gamepix.com/join-us?t=developer) an und gehen Sie zum [GamePix Dashboard](https://my.gamepix.com/dashboard).
3. Klicken Sie auf **Neues Spiel erstellen**.
4. Geben Sie die Spieldaten ein und klicken Sie auf **Erstellen**.
5. Wählen Sie unter **Info** die Option **HTML5-JS** unter **Game Engine**.
6. Klicken Sie unter **Build** auf **Datei durchsuchen**. Laden Sie die zuvor heruntergeladene `.zip`-Datei hoch.
7. Beenden Sie die Konfiguration Ihres Spiels und veröffentlichen Sie es.

### Newgrounds

1. Laden Sie den **Full HTML** Einbettungscode herunter. Erstellen Sie eine "zip"-Datei von dieser "index.html"-Datei.
2. Registriere dich für einen [Newgrounds-Account](https://www.newgrounds.com).
3. Klicken Sie auf den Pfeil in der oberen rechten Ecke und wählen Sie **Game (swf, HTML5)**
4. Klicken Sie unter **Einreichungsdatei(en)** auf **Datei hochladen**. Laden Sie die zuvor heruntergeladene `.zip`-Datei hoch.
5. Konfigurieren Sie Ihre Spielabmessungen und überprüfen Sie **Touchscreen-freundlich**
6. Beenden Sie die Konfiguration Ihres Spiels und veröffentlichen Sie es.

### Y8

1. Laden Sie den **Full HTML** Einbettungscode herunter. Erstellen Sie eine "zip"-Datei von dieser "index.html"-Datei.
2. Melden Sie sich bei [Y8](https://www.y8.com/upload) an.
3. Vergewissern Sie sich, dass Sie Ihre E-Mail verifiziert haben, dann [erstellen Sie ein kostenloses Y8-Speicher-Konto](https://account.y8.com/storage_account).
4. Wählen Sie unter **Game** die Option **Zip** und dann **HTML5**.
5. Klicken Sie auf **Datei wählen**. Laden Sie die zuvor heruntergeladene `.zip`-Datei hoch. Wenn Sie kein Speicherkonto erstellt haben, schlägt der Vorgang fehl. Klicken Sie in diesem Fall auf **Speicherkonto erstellen**, um ein Konto zu erstellen, aktualisieren Sie dann die Seite **Ihre Inhalte auf Y8 hochladen** und versuchen Sie es erneut.
6. Beenden Sie die Konfiguration Ihres Spiels und veröffentlichen Sie es.

### Poki

1. Rufen Sie das [Poki Developer Portal](https://developers.poki.com/share) auf.
2. Geben Sie Ihre Projektdetails ein, indem Sie den Link zu Ihrem gehosteten Projekt unter **Link zu Ihrem Spiel** verwenden.
3. Klicken Sie auf **Dein Spiel teilen**.

### Kongregate

1. Schicke eine E-Mail an das Kongregate-Team unter [bd@kongregate.com](mailto:bd@kongregate.com). Fügen Sie Ihrer E-Mail den Link zu Ihrem gehosteten Projekt bei.

### Rüstungsspiele

1. Senden Sie eine E-Mail an das Armor Games-Team unter [mygame@armorgames.com](mailto:mygame@armorgames.com). Fügen Sie Ihrer E-Mail den Link zu Ihrem gehosteten Projekt bei.

### Süchtig machende Spiele

1. Laden Sie den **Full HTML** Einbettungscode herunter.
2. Senden Sie eine E-Mail an das Addicting Games-Team unter [games@addictinggames.com](mailto:games@addictinggames.com). Fügen Sie Ihrer E-Mail die \`.zip'-Datei bei, sowie alle anderen Informationen, die im [Addicting Games Developer Center](https://www.addictinggames.com/about/upload#Send) verlangt werden.

### Verzögert

1. Senden Sie eine E-Mail an das Lagged-Team unter [contact@lagged.com](mailto:contact@lagged.com). Fügen Sie Ihrer E-Mail den Link zu Ihrem gehosteten Projekt bei.
2. Sobald du zugelassen bist, kannst du dich mit dem **Invite Code**, den sie dir zur Verfügung stellen, für ein Lagged-Konto [https://lagged.dev/signup] anmelden und dein Spiel hochladen.

### Discord

#### Beispielprojekt

Als Ausgangspunkt für die Verwendung des Discord Embedded SDK mit Ihrem Projekt können Sie unser Beispielprojekt ausprobieren.

1. Navigieren Sie zu https://www.8thwall.com/8thwall/discord-activity-example und klonen Sie das Projekt in Ihren Arbeitsbereich.
2. Folgen Sie den Schritten unter [Exportieren eines HTML5-Bündels](#exporting-an-html5-bundle)
3. Laden Sie die Datei `.zip` an einen Ort Ihrer Wahl herunter.

#### Discord-Entwickler einrichten

Um einen Web-Client in Discord zu betreiben, müssen Sie ein Konto einrichten und eine App im Entwickler-Hub erstellen.

1. Erstellen Sie ein Discord-Konto und navigieren Sie zu https://discord.com/developers/applications.

2. Erstellen Sie eine neue Anwendung, indem Sie auf die Schaltfläche in der oberen rechten Ecke klicken.
   1. Geben Sie einen Namen für die Anwendung ein und akzeptieren Sie die Nutzungsbedingungen

![New Activity](/images/studio/native-app-export/discord/new-activity.png)

3. Rufen Sie die Seite **OAuth2** auf, die sich im Abschnitt **Einstellungen** befindet:
   1. Fügen Sie `http://127.0.0.1` als Redirect-URI zum Testen hinzu.
   2. Speichern Sie die `Client ID` an einem sicheren Ort.
   3. Klicken Sie auf "Geheimnis zurücksetzen", um das "Kundengeheimnis" abzurufen und es an einem sicheren Ort zu speichern.
   4. Drücken Sie auf "Speichern", um Ihre Einstellungen zu speichern.

![Redirect](/images/studio/native-app-export/discord/redirect.png)

4. Navigieren Sie zur Seite **URL-Zuordnungen** unter dem Abschnitt **Aktivitäten**:
   1. Fügen Sie der Stammzuordnung ein temporäres Ziel wie "127.0.0.1:8888" hinzu. Diese wird später durch Ihre öffentliche URL ersetzt, aber sie wird benötigt, um im nächsten Schritt Aktivitäten zu aktivieren.

5. Gehen Sie auf die Seite **Einstellungen**, unter dem Abschnitt **Aktivitäten**:
   1. Aktivieren Sie **Aktivitäten aktivieren** und akzeptieren Sie die Vereinbarung über den App-Start.

![Enable Activity](/images/studio/native-app-export/discord/enable-activity.png)

6. Gehen Sie dann auf die Registerkarte **Installation** unter dem Abschnitt **Einstellungen**:
   1. Kopieren Sie den Link aus dem Fenster **Installationslink** und öffnen Sie ihn in Ihrem Browser.
   2. Installieren Sie die Anwendung, um sie auf einem beliebigen Server oder DM zugänglich zu machen.

#### Starten einer Anwendung

1. Richten Sie den Beispiel-Servercode unter https://github.com/8thwall/discord-activity-example ein.
   1. `git clone https://github.com/8thwall/discord-activity-example`
   2. Führen Sie `npm install` aus
   3. Entpacken Sie die zuvor heruntergeladene `.zip`, die das Frontend des Projekts enthält.
   4. Erstellen Sie eine "env"-Datei im Stammverzeichnis des Repos und füllen Sie sie mit den Angaben aus dem Discord-Entwicklerportal:
   ```
   DISCORD_CLIENT_ID=XXXXXXXXXX
   DISCORD_CLIENT_SECRET=XXXXXXXXXX
   DISCORD_CLIENT_HOST_PATH=/path/to/unzipped/folder
   ```
   5. Geben Sie `npm start` ein, um den Server zu starten.

2. Verwenden Sie `cloudflared`, um einen Tunnel zu erstellen, damit das Projekt über das Internet öffentlich zugänglich ist.

   1. brew install cloudflared", um das CLI-Tool "cloudflared" herunterzuladen
   2. Führen Sie "cloudflared tunnel --url http://localhost:8888" aus.
   3. Notieren Sie sich die URL, die generiert wurde.

   Beispiel:

   ```
   2025-10-11T03:05:16Z INF +--------------------------------------------------------------------------------------------+
   2025-10-11T03:05:16Z INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
   2025-10-11T03:05:16Z INF |  https://sporting-follow-audit-href.trycloudflare.com                                      |
   2025-10-11T03:05:16Z INF +--------------------------------------------------------------------------------------------+
   ```

   4. Öffnen Sie die `cloudflared` URL in Ihrem Browser, um sicherzustellen, dass das Projekt geladen wird.

3. Aktualisieren Sie die Einstellungen Ihrer Discord-Anwendung:
   1. Öffnen Sie das Discord-Entwicklerportal und navigieren Sie zu Ihrer Anwendung
   2. Gehen Sie zu **URL-Zuordnungen** unter dem Abschnitt **Aktivitäten**.
   3. Ersetzen Sie das temporäre Ziel durch Ihre "cloudflared"-URL für das **Root Mapping**.

![Cloudflare URL](/images/studio/native-app-export/discord/cloudflare-url.png)

4. Testen Sie Ihre Discord-Aktivität:
   1. Öffnen Sie Discord und navigieren Sie zu einem beliebigen DM oder Server
   2. Klicken Sie auf das Aktivitäten-Symbol (Game Controller) in der Sprachkanalsteuerung
   3. Suchen Sie Ihre Anwendung im Bereich **Anwendungen und Befehle** und klicken Sie darauf.

![Example Final View](/images/studio/native-app-export/discord/example-final-view.jpeg)
