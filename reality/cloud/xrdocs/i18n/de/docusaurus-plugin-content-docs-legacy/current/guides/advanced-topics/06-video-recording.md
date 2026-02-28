---
id: video-recording
---

# Anpassen der Videoaufzeichnung

Die [XRExtras](https://github.com/8thwall/web/tree/master/xrextras)-Bibliothek von 8th Wall bietet Module
, die sich mit den häufigsten Anforderungen von WebAR-Anwendungen befassen, einschließlich des Ladebildschirms, der Abläufe von Social Link-out
und der Fehlerbehandlung.

Das XRExtras [MediaRecorder](https://github.com/8thwall/web/tree/master/xrextras/src/mediarecorder)
Modul macht es einfach, die Videoaufzeichnung in Ihrem Projekt anzupassen.

In diesem Abschnitt wird beschrieben, wie Sie aufgezeichnete Videos anpassen können, z. B. das Verhalten der Aufnahmetaste
(Tippen oder Halten), das Hinzufügen von Wasserzeichen, die maximale Videolänge, das Verhalten und Aussehen der Endkarte usw.

## A-Frame-Primitive {#a-frame-primitives}

`xrextras-capture-button` : Fügt der Szene eine Aufnahmetaste hinzu.

| Parameter     | Typ      | Standard   | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                                              |
| ------------- | -------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Aufnahmemodus | `String` | `Standard` | Legt das Verhalten des Aufnahmemodus fest. **Standard**: Tippen Sie auf , um ein Foto zu machen, tippen und halten Sie, um ein Video aufzunehmen. **behoben**: Tippen Sie auf , um die Videoaufnahme umzuschalten. **Foto**: Tippen Sie auf , um ein Foto aufzunehmen. Eines von `[Standard, fest, Foto]` |

`xrextras-capture-config` : Konfiguriert die erfassten Medien.

| Parameter               | Typ       | Standard                                     | Beschreibung                                                                                                                                                                                                                                                    |
| ----------------------- | --------- | -------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| max-duration-ms         | int       | `15000`                                      | Gesamte Videodauer (in Millisekunden), die die Aufnahmetaste zulässt. Wenn die Endkarte deaktiviert ist, entspricht dies der maximalen Aufzeichnungszeit des Benutzers. 15000 standardmäßig. |
| max-Abmessung           | int       | `1280`                                       | Maximale Abmessung (Breite oder Höhe) des aufgenommenen Videos.  Für die Fotokonfiguration siehe [`XR8.CanvasScreenshot.configure()`](/legacy/api/canvasscreenshot/configure)                                                |
| enable-end-card         | `Boolean` | `true`                                       | Ob die Endkarte auf dem Datenträger enthalten ist.                                                                                                                                                                                              |
| cover-image-url         | `String`  |                                              | Bildquelle für das Umschlagbild der Endkarte. Verwendet standardmäßig das Titelbild des Projekts.                                                                                                                               |
| end-card-call-to-action | `String`  | 'Probieren Sie es aus: '\\` | Legt die Textzeichenfolge für die Aufforderung zum Handeln auf der Endkarte fest.                                                                                                                                                               |
| Kurz-Link               | `String`  |                                              | Setzt den Textstring für den Shortlink der Endkarte. Verwendet standardmäßig den Projektkurzlink.                                                                                                                               |
| footer-image-url        | `String`  | Powered by 8th Wall Bild                     | Bildquelle für das Bild in der Fußzeile der Endkarte.                                                                                                                                                                                           |
| watermark-image-url     | `String`  | `Null`                                       | Bildquelle für das Wasserzeichen.                                                                                                                                                                                                               |
| watermark-max-width     | int       | 20                                           | Maximale Breite (%) des Wasserzeichenbildes.                                                                                                                                                                                 |
| watermark-max-height    | int       | 20                                           | Maximale Höhe (%) des Wasserzeichenbildes.                                                                                                                                                                                   |
| watermark-location      | `String`  | `'bottomRight'`                              | Ort des Wasserzeichenbildes. Eine von "topLeft, topMiddle, topRight, bottomLeft, bottomMiddle, bottomRight".                                                                                                                    |
| Dateinamen-Präfix       | `String`  | "mein-fang-                                  | Legt die Textzeichenfolge fest, die dem Dateinamen den eindeutigen Zeitstempel voranstellt.                                                                                                                                                     |
| Anfrage-Mikrofon        | `String`  | `Auto'`                                      | Legt fest, ob das Mikrofon während der Initialisierung (`'auto'`) oder während der Laufzeit (`'manual'`) eingerichtet werden soll                                                                                         |
| Szene-Audio einbinden   | `Boolean` | `true`                                       | Wenn dies der Fall ist, werden die A-Frame-Sounds in der Szene in die Aufnahme einbezogen.                                                                                                                                                      |

`xrextras-capture-preview` : Fügt der Szene eine Medienvorschau hinzu, die das Abspielen, Herunterladen und Teilen ermöglicht.

| Parameter                          | Typ      | Standard  | Beschreibung                                                                                                                                                                                                        |
| ---------------------------------- | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| aktionsschaltfläche-freigeben-text | `String` | ''Aktie'' | Legt die Textzeichenfolge in der Aktionsschaltfläche fest, wenn Web Share API 2 **verfügbar** ist (Android, iOS 15 oder höher). Standardmäßig "Teilen".          |
| action-button-view-text            | `String` | Ansicht'' | Legt die Textzeichenfolge in der Aktionsschaltfläche fest, wenn Web Share API 2 in iOS (iOS 14 oder niedriger) **nicht** verfügbar ist. Standardmäßig "Ansicht". |

## XRExtras.MediaRecorder Ereignisse {#xrextrasmediarecorder-events}

XRExtras.MediaRecorder gibt die folgenden Ereignisse aus.

#### Ereignisse Emittiert {#events-emitted}

| Emittiertes Ereignis               | Beschreibung                                                                                                                                                                                       | Ereignis Detail   |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| mediarecorder-photocomplete        | Wird nach der Aufnahme eines Fotos ausgestrahlt.                                                                                                                                   | {blob}            |
| mediarecorder-recordcomplete       | Wird nach Abschluss einer Videoaufzeichnung ausgegeben.                                                                                                                            | {videoBlob}       |
| mediarecorder-previewready         | Wird ausgegeben, nachdem eine vorschaubare Videoaufnahme abgeschlossen ist. [(nur Android/Desktop)](/legacy/api/mediarecorder/recordvideo/#parameters)          | {videoBlob}       |
| mediarecorder-finalizeprogress     | Wird ausgegeben, wenn der Medienrekorder beim endgültigen Export Fortschritte macht. [(nur Android/Desktop)](/legacy/api/mediarecorder/recordvideo/#parameters) | {progress, total} |
| mediarecorder-vorschau-geöffnet    | Wird ausgegeben, nachdem die Aufnahmevorschau geöffnet wurde.                                                                                                                      | null              |
| mediarecorder-vorschau-geschlossen | Wird ausgegeben, nachdem die Aufnahmevorschau geschlossen wurde.                                                                                                                   | null              |

#### Beispiel: A-Frame-Primitive {#primitives-example}

```jsx
<xrextras-capture-button capture-mode="standard"></xrextras-capture-button>

<xrextras-capture-config
  max-duration-ms="15000"
  max-dimension="1280"
  enable-end-card="true"
  cover-image-url=""
  end-card-call-to-action="Probieren Sie es aus unter:"
  short-link=""
  footer-image-url="//cdn.8thwall.com/web/img/almostthere/v2/poweredby-horiz-white-2.svg"
  watermark-image-url="//cdn.8thwall.com/web/img/mediarecorder/8logo.png"
  watermark-max-width="100"
  watermark-max-height="10"
  watermark-location="bottomRight"
  file-name-prefix="my-capture-"
></xrextras-capture-config>

<xrextras-capture-preview
  action-button-share-text="Teilen"
  action-button-view-text="Anzeigen"
  finalize-text="Exportieren..."
></xrextras-capture-preview>
```

#### Beispiel: A-Frame-Ereignisse {#example-a-frame-events}

```javascript
window.addEventListener('mediarecorder-previewready', (e) => {
  console.log(e.detail.videoBlob)
})
```

#### Beispiel: Ändern Sie Share Button CSS {#change-share-button-example}

```css
#actionButton {
  /* Farbe der Aktionsschaltfläche ändern */
  background-color: #007aff !important;
}
```
