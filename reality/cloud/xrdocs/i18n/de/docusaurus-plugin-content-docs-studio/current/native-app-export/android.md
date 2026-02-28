---
id: android
description: 'In diesem Abschnitt wird erklärt, wie man nach Android exportiert.'
---

# Android

## Exportieren nach Android

1. **Öffnen Sie Ihr Studio-Projekt**. Sicherstellen, dass das Projekt die [Anforderungskriterien](/studio/native-app-export/#requirements) erfüllt.

2. Klicken Sie auf **Veröffentlichen**. Wählen Sie unter **Export** die Option **Android**.

3. **Passen Sie Ihre App-Erstellung an:**
   - **Display Name:** Der Name, der auf dem Android-Startbildschirm angezeigt wird
   - **Bundle Identifier:** Eine eindeutige Zeichenfolge, z. B. "com.mycompany.myapp".
   - **(Optional)** Hochladen eines **App-Symbols** (1024x1024)

4. Wenn Sie die grundlegenden Informationen zu Ihrer Anwendung eingegeben haben, klicken Sie auf **Fortfahren**, um die Build-Konfiguration abzuschließen.

---

## Abschluss der Build-Einstellungen

Jetzt legen Sie fest, wie Ihre Anwendung verpackt wird:

- **Version:** Semantische Versionierung verwenden (z.B. "1.0.0")
- **Orientierung:**
  - **Portrait:** Hält die App in einer vertikalen Position, auch wenn das Gerät gedreht wird.
  - **Landschaft links:** Zeigt die App horizontal an, wobei das Gerät so gedreht wird, dass die linke Seite nach unten zeigt.
  - **Landschaft rechts:** Zeigt die App horizontal an, wobei das Gerät so gedreht wird, dass die rechte Seite nach unten zeigt.
  - **Auto Rotate:** Ermöglicht es der App, der physischen Drehung des Geräts zu folgen und automatisch zwischen vertikaler und horizontaler Ansicht zu wechseln.
  - **Auto Rotate (Landscape Only):** Passt die Position der App basierend auf der Drehung des Geräts an, beschränkt sich aber auf horizontale Ansichten.
- **Statusleiste:**
  - **Ja:** Zeigt die Standard-Systemstatusleiste über der Anwendung an.
  - **Nein:** Blendet die Standard-Systemstatusleiste aus.
- **Bauart:**
  - **APK (Android-Paket):** Direkte Installationsdateien zum Testen oder Nebenbei-Laden
  - **AAB (Android App Bundle):** Erforderlich für die Veröffentlichung bei Google Play
- **Build-Modus:**
  - **Live Reload:** Zieht Aktualisierungen aus Studio, wenn Ihr Projekt aktualisiert wird
  - **Statisches Bundle:** Vollständig eigenständiges Build
- **Umgebung:** Wählen Sie aus `Dev`, `Latest`, `Staging`, oder `Production`

Wenn alles eingestellt ist, klicken Sie auf **Build**, um Ihr Anwendungspaket zu erstellen.

> Sobald der Build abgeschlossen ist, laden Sie die Datei `.apk` oder `.aab` über die in der Build-Zusammenfassung angegebenen Download-Links herunter.

---

## Veröffentlichung im Google Play Store

Sobald der Export abgeschlossen ist, können Sie Ihre App mit dem **AAB (Android App Bundle)** im Play Store veröffentlichen:

### Warum AAB?

Google verlangt seit August 2021 das AAB-Format für alle neuen Apps. AAB hilft bei der Optimierung der Bereitstellung, indem es gerätespezifische APKs generiert und die App-Größe reduziert.

### Hochladen in die Google Play-Konsole

1. Melden Sie sich bei der [Play Console](https://play.google.com/console) an und registrieren Sie sich bei Bedarf für die Play App Signierung
2. Navigieren Sie zu **"App erstellen "** → geben Sie Name, Sprache, kostenlosen/bezahlten Status ein
3. Gehen Sie zu **Test & Freigabe** → **Produktion** (oder interne/beta-Schiene). Klicken Sie auf **Neue Version erstellen**, und laden Sie dann Ihre .aab-Datei hoch, indem Sie sie in den Bereich **App-Bundles zum Hochladen hier ablegen** ziehen.
4. Vollständige Auflistung der Geschäfte, Datenschutzbestimmungen, Inhaltsbewertungen und Zielregionen
5. Überprüfen und Veröffentlichen Ihrer Veröffentlichung

🔗 [Die vollständigen Upload-Dokumente finden Sie hier: Upload Ihrer App in die Play Console](https://developer.android.com/studio/publish)

---

## Direktes Installieren auf einem Android-Gerät

### Installieren auf einem Android-Emulator

1. Aktivieren Sie **"Unbekannte Anwendungen installieren "** für Ihren Browser oder Dateimanager
2. Übertragen Sie die APK per USB, E-Mail oder Cloud-Speicher
3. Öffnen Sie die APK auf Ihrem Gerät und tippen Sie auf **Installieren**.

**Befehlszeilenmethode:**

```bash
adb install path/to/app.apk
```

### Installieren auf einem physischen Android-Gerät

1. Richten Sie einen Emulator im AVD-Manager von Android Studio ein.
2. Starten Sie den Emulator.
3. Ziehen Sie die APK von Ihrem Computer auf den Emulator, um sie zu installieren.

Im Terminal:

```bash
adb install path/to/app.apk
```
