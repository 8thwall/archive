---
id: video-recording
---

# Videoaufnahme anpassen

die Bibliothek  [XRExtras](https://github.com/8thwall/web/tree/master/xrextras) von 8th Wall bietet Module , die die häufigsten Anforderungen von WebAR-Anwendungen erfüllen, einschließlich des Ladebildschirms, des sozialen Link-Out und der Fehlerbehandlung.

Mit dem Modul XRExtras [MediaRecorder](https://github.com/8thwall/web/tree/master/xrextras/src/mediarecorder) können Sie die Benutzeroberfläche für Videoaufnahmen in Ihrem Projekt ganz einfach anpassen.

In diesem Abschnitt wird beschrieben, wie Sie aufgezeichnete Videos anpassen können, z. B. das Verhalten der Aufnahmetaste (Tippen oder Halten), das Hinzufügen von Wasserzeichen, die maximale Videolänge, das Verhalten und Aussehen der Endkarte usw.

## A-Frame Primitive {#a-frame-primitives}

`xrextras-capture-button` : Fügt der Szene eine Aufnahmeschaltfläche hinzu.

| Parameter    | Typ      | Standard     | Beschreibung                                                                                                                                                                                                                                                                                |
| ------------ | -------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| capture-mode | `String` | `'Standard'` | Legt das Verhalten des Aufnahmemodus fest. **standard**: Tippen Sie, um ein Foto aufzunehmen, tippen + halten Sie, um ein Video aufzunehmen. **** behoben: Tippen Sie, um die Videoaufnahme umzuschalten. **foto**: Tippen Sie, um ein Foto aufzunehmen. Eines von `[Standard, fest, Foto]` |

`xrextras-capture-config` : Konfiguriert die erfassten Medien.

| Parameter               | Typ         | Standard                   | Beschreibung                                                                                                                                                                                        |
| ----------------------- | ----------- | -------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| max-duration-ms         | int         | `15000`                    | Gesamtdauer des Videos (in Millisekunden), die die Schaltfläche Aufnahme zulässt. Wenn die Endkarte deaktiviert ist, entspricht dies der maximalen Aufnahmezeit des Benutzers. 15000 standardmäßig. |
| max-dimension           | int         | `1280`                     | Maximale Größe (Breite oder Höhe) des aufgenommenen Videos.  Für die Konfiguration von Fotos lesen Sie bitte [`XR8.CanvasScreenshot.configure()`](/api/canvasscreenshot/configure)                  |
| enable-end-card         | `Boolesche` | `wahr`                     | Ob die Endkarte auf dem bespielten Datenträger enthalten ist.                                                                                                                                       |
| cover-image-url         | `String`    |                            | Bildquelle für das Coverbild der Endkarte. Verwendet standardmäßig das Titelbild des Projekts.                                                                                                      |
| end-card-call-to-action | `String`    | `'Versuchen Sie es bei: '` | Legt den Textstring für den Aufruf zur Aktion auf der Endkarte fest.                                                                                                                                |
| short-link              | `String`    |                            | Legt den Textstring für den Shortlink der Endkarte fest. Verwendet standardmäßig einen Projektkurzlink.                                                                                             |
| footer-image-url        | `String`    | Powered by 8th Wall Bild   | Bildquelle für das Bild in der Fußzeile der Endkarte.                                                                                                                                               |
| watermark-image-url     | `String`    | `null`                     | Bildquelle für das Wasserzeichen.                                                                                                                                                                   |
| watermark-max-width     | int         | 20                         | Maximale Breite (%) des Wasserzeichenbildes.                                                                                                                                                        |
| watermark-max-height    | int         | 20                         | Maximale Höhe (%) des Wasserzeichenbildes.                                                                                                                                                          |
| watermark-location      | `String`    | `'bottomRight'`            | Ort des Wasserzeichenbildes. Eine von `topLeft, topMiddle, topRight, bottomLeft, bottomMiddle, bottomRight`                                                                                         |
| datei-name-prefix       | `String`    | `'meine-erfassen-'`        | Legt den Textstring fest, die dem Dateinamen den eindeutigen Zeitstempel voranstellt.                                                                                                               |
| request-mic             | `String`    | `'auto'`                   | Legt fest, ob Sie das Mikrofon während der Initialisierung (`'auto'`) oder während der Laufzeit (`'manual'`) einrichten möchten                                                                     |
| szene-Audio einbinden   | `Boolesche` | `wahr`                     | Wenn dies der Fall ist, werden die A-Frame-Sounds in der Szene Teil der aufgenommenen Ausgabe sein.                                                                                                 |

`xrextras-capture-preview` : Fügt der Szene eine Medienvorschau-Voreinstellung hinzu, die die Wiedergabe, das Herunterladen und die gemeinsame Nutzung ermöglicht.

| Parameter                | Typ      | Standard  | Beschreibung                                                                                                                                                 |
| ------------------------ | -------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| action-button-share-text | `String` | `Teilen`  | Legt den Textstring in der Aktionsschaltfläche fest, wenn Web Share API 2 **verfügbar ist** (Android, iOS 15 oder höher). `'Teilen'` standardmäßig.          |
| action-button-view-text  | `String` | `Ansicht` | Legt den Textstring in der Aktionsschaltfläche fest, wenn Web Share API 2 **nicht** in iOS (iOS 14 oder niedriger) verfügbar ist. `'Ansicht'` standardmäßig. |

## XRExtras.MediaRecorder Ereignisse {#xrextrasmediarecorder-events}

XRExtras.MediaRecorder gibt die folgenden Ereignisse aus.

#### Ausgegebene Ereignisse {#events-emitted}

| Ausgegebenes Ereignis              | Beschreibung                                                                                                                                             | Ereignis-Detail   |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| mediarecorder-photocomplete        | Wird ausgegeben, nachdem ein Foto aufgenommen wurde.                                                                                                     | {blob}            |
| mediarecorder-recordcomplete       | Wird nach Abschluss einer Videoaufnahme ausgegeben.                                                                                                      | {videoBlob}       |
| mediarecorder-vorschau-bereit      | Wird ausgegeben, nachdem eine vorschaubare Videoaufnahme abgeschlossen ist. [(nur Android/Desktop)](/api/mediarecorder/recordvideo/#parameters)          | {videoBlob}       |
| mediarecorder-finalizeprogress     | Wird ausgegeben, wenn der Medienrekorder beim endgültigen Export Fortschritte macht. [(nur Android/Desktop)](/api/mediarecorder/recordvideo/#parameters) | {progress, total} |
| mediarecorder-vorschau-geöffnet    | Wird ausgegeben, nachdem die Aufnahmevorschau geöffnet wurde.                                                                                            | null              |
| mediarecorder-vorschau-geschlossen | Wird ausgegeben, nachdem die Aufnahmevorschau geschlossen wurde.                                                                                         | null              |

#### Beispiel: A-Frame-Primitive {#primitives-example}

```jsx
<xrextras-capture-button capture-mode="standard"></xrextras-capture-button>

<xrextras-capture-config
  max-duration-ms="15000"
  max-dimension="1280"
  enable-end-card="true"
  cover-image-url=""
  end-card-call-to-action="Try it at:"
  short-link=""
  footer-image-url="//cdn.8thwall.com/web/img/almostthere/v2/poweredby-horiz-white-2.svg"
  watermark-image-url="//cdn.8thwall.com/web/img/mediarecorder/8logo.png"
  watermark-max-width="100"
  watermark-max-height="10"
  watermark-location="bottomRight"
  file-name-prefix="my-capture-"
></xrextras-capture-config>

<xrextras-capture-preview
  action-button-share-text="Share"
  action-button-view-text="View"
  finalize-text="Exporting..."
></xrextras-capture-preview>
```

#### Beispiel: A-Frame-Ereignisse {#example-a-frame-events}

```javascript
window.addEventListener('mediarecorder-previewready', (e) => {
 console.log(e.detail.videoBlob)
})
```

#### Beispiel: CSS für die Schaltfläche „Teilen“ ändern {#change-share-button-example}

```css
#actionButton {
  /* Farbe der Aktionsschaltfläche ändern */
  background-color: #007aff !important;
}
```
