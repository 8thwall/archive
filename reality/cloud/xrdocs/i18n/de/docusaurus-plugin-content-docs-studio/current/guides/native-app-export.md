---
id: native-app-export
description: 'In diesem Abschnitt wird erklärt, wie Sie den Native App Export verwenden.'
---

# Export von nativen Anwendungen

:::info[Beta Merkmal]
Native App Export befindet sich derzeit in der Beta-Phase und ist auf Android-Builds beschränkt. Unterstützung für iOS, Desktop und Headsets folgt in Kürze.
:::

Native App Export ermöglicht es Ihnen, Ihr Studio-Projekt als eigenständige Anwendung zu verpacken.

---

## Anforderungen

Der native Export ist nur für reine 3D-Projekte verfügbar, die nicht in AR erstellt wurden. Ihr Projekt **darf** nicht verwenden:

- Kamera- oder AR-Funktionen
- GPS
- Landscape-Modus
- Virtuelle oder physische Tastaturen
- Gamepads
- Vibration
- Push-Benachrichtigungen
- In-App-Käufe
- Video-Texturen
- MediaRecorder API
- Daten zur Gesundheit
- WebXR
- CSS

> Vergewissern Sie sich, dass Ihr Projekt mindestens einmal erfolgreich erstellt wurde, bevor Sie versuchen, es zu exportieren.

---

## Exportieren nach Android

1. Öffnen Sie Ihr Studio-Projekt.
   Stellen Sie sicher, dass das Projekt die oben genannten Anforderungskriterien erfüllt.

2. Klicken Sie auf **Veröffentlichen**.
   Wählen Sie unter **Build for Native Platforms** die Option **Android (Beta)**.

3. Passen Sie Ihre App-Erstellung an:
   - **App-Name:** Der Name, der auf dem Android-Startbildschirm angezeigt wird
   - **Bundle Identifier:** Eine eindeutige Zeichenfolge, z. B. "com.mycompany.myapp".
   - _(Optional)_ Hochladen eines App-Symbols (1024x1024)

4. Wenn Sie die grundlegenden Informationen zu Ihrer Anwendung eingegeben haben, klicken Sie auf **Fortfahren**, um die Build-Konfiguration abzuschließen.

---

## Abschluss der Build-Einstellungen

Jetzt legen Sie fest, wie Ihre Anwendung verpackt wird:

- **Versionsname:** Verwenden Sie eine semantische Versionierung (z. B. "1.0.0")
- **Orientierung:**
  - **Portrait:** Hält die App an vertikaler Position fest, auch wenn das Gerät gewechselt wird.
  - **Querformat links:** Zeigt die App horizontal an, wenn das Gerät gedreht ist, so dass die linke Seite unten ist.
  - **Querformat rechts:** Zeigt die App horizontal an, wenn das Gerät gedreht wurde, so dass die rechte Seite ausgeschaltet ist.
  - **Automatisch drehen:** Ermöglicht der App, der physischen Drehung des Geräts zu folgen, wobei automatisch zwischen vertikalen und horizontalen Ansichten gewechselt wird.
  - **Automatisch drehen (Nur Landschaft):** Stellt die Position der App basierend auf der Rotation des Geräts fest, beschränkt sie aber nur auf horizontale Ansichten.
- **Statusleiste:**
  - **Ja:** Zeigt die Standard-System-Statusleiste über der Anwendung an.
  - **Nein:** Versteckt die Standard-Statusleiste.
- **Exporttyp:**
  - **APK (Android-Paket):** Direkte Installationsdateien zum Testen oder Nebenbei-Laden
  - **AAB (Android App Bundle):** Erforderlich für die Veröffentlichung bei Google Play
- **Build-Modus:**
  - **Statisches Bundle:** Vollständig eigenständiges Build
  - **Live Reload:** Zieht Aktualisierungen aus Studio, wenn Ihr Projekt aktualisiert wird
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
adb install pfad/zu/app.apk
```

### Installieren auf einem physischen Android-Gerät

1. Richten Sie einen Emulator im AVD-Manager von Android Studio ein.
2. Starten Sie den Emulator.
3. Ziehen Sie die APK von Ihrem Computer auf den Emulator, um sie zu installieren.

Im Terminal:

```bash
adb install pfad/zu/app.apk
```
