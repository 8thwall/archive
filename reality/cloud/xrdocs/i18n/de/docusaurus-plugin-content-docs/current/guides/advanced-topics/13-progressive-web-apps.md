---
id: progressive-web-apps
---

# Progressive Webanwendungen

Progressive Web-Apps (PWAs) nutzen moderne Webfunktionen, um Benutzern ein Erlebnis zu bieten, das einer nativen Anwendung ähnelt. Mit dem 8th Wall Cloud Editor können Sie eine PWA-Version Ihres Projekts erstellen, so dass die Benutzer es zu ihrem Startbildschirm hinzufügen können. Benutzer müssen über **mit dem Internet verbunden sein** , um darauf zugreifen zu können.

So aktivieren Sie die PWA-Unterstützung für Ihr WebAR-Projekt:

1. Rufen Sie die Seite mit den Projekteinstellungen auf und erweitern Sie den Bereich "Progressive Web App". (Nur sichtbar für bezahlte Arbeitsbereiche)
2. Schieben Sie den Schieberegler auf PWA-Unterstützung aktivieren.
3. Passen Sie den Namen, das Symbol und die Farben Ihrer PWA an.
4. Klicken Sie auf "Speichern"

![project-settings-pwa](/images/project-settings-pwa.jpg)

**Hinweis**: Bei Cloud Editor-Projekten werden Sie möglicherweise aufgefordert, Ihr Projekt zu erstellen und erneut zu veröffentlichen, wenn es zuvor veröffentlicht wurde. Wenn Sie sich gegen eine Neuveröffentlichung entscheiden, wird die PWA-Unterstützung bei der nächsten Erstellung Ihres Projekts integriert.

## PWA API-Referenz {#pwa-api-reference}

die Bibliothek **XRExtras** von 8th Wall bietet eine API zur automatischen Anzeige einer Installationsaufforderung in Ihrer Webanwendung.

Bitte lesen Sie die `PwaInstaller` API-Referenz unter <https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule>

## PWA-Symbol Anforderungen {#pwa-icon-requirements}

* Dateitypen: **.png**
* Bildseitenverhältnis: **1:1**
* Abmessungen:
  * Minimum: **512 x 512 Pixel**
    * Hinweis: Wenn Sie ein Bild hochladen, das größer als 512x512 ist, wird es auf ein Seitenverhältnis von 1:1 beschnitten und auf 512x512 verkleinert.

## Anpassung der PWA-Installationsaufforderung {#pwa-install-prompt-customization}

Das Modul [PwaInstaller](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule) von XRExtras zeigt eine Installationsaufforderung an, die den Benutzer auffordert, Ihre Webanwendung zu seinem Startbildschirm hinzuzufügen.

Um das Aussehen Ihrer Installationsaufforderung anzupassen, können Sie über die API [XRExtras.PwaInstaller.configure()](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#configure) benutzerdefinierte Stringwerte angeben.

Für eine vollständig angepasste Installationsaufforderung konfigurieren Sie das Installationsprogramm mit [displayInstallPrompt](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#displayinstallprompt) und [hideInstallPrompt](https://github.com/8thwall/web/tree/master/xrextras/src/pwainstallermodule#hideinstallprompt)

## Selbstgehostete PWA-Nutzung {#self-hosted-pwa-usage}

Bei selbst gehosteten Anwendungen können wir die Details der PWA nicht automatisch in den HTML-Code einfügen. erfordert die Verwendung der Konfigurations-API mit dem Namen und dem Symbol, die in der Aufforderung zur Installation erscheinen sollen.

Fügen Sie die folgenden `` Tags in den `` Ihrer html-Datei ein:

`<meta name="8thwall:pwa_name" content="My PWA Name">`

`<meta name="8thwall:pwa_icon" content="//cdn.mydomain.com/my_icon.png">`

## PWA Code Beispiele {#pwa-code-examples}

#### Grundlegendes Beispiel (AFrame) {#basic-example-aframe}

```html
<a-scene
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer
  xrweb>
```

#### Grundlegendes Beispiel (Non-AFrame) {#basic-example-non-aframe}

```javascript
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.AlmostThere.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),

  XRExtras.PwaInstaller.pipelineModule(), // Hier hinzugefügt

  // Benutzerdefinierte Pipeline-Module.
  myCustomPipelineModule(),
])

```

#### Beispiel für einen angepassten Look (AFrame) {#customized-look-example-aframe}

```html
<a-scene
  xrextras-gesture-detector
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer="name: My Cool PWA;
    iconSrc: '//cdn.8thwall.com/my_custom_icon';
    installTitle: 'My CustomTitle';
    installSubtitle: 'My Custom Subtitle';
    installButtonText: 'Custom Install';
    iosInstallText: 'Custom iOS Install'"
  xrweb>
```

#### Beispiel für einen angepassten Look (ohne Rahmen) {#customized-look-example-non-aframe}

```javascript
XRExtras.PwaInstaller.configure({
  displayConfig: {
    name: 'Mein benutzerdefinierter PWA-Name',
    iconSrc: '//cdn.8thwall.com/my_custom_icon',
    installTitle: ' Mein benutzerdefinierter Titel',
    installSubtitle: 'Mein benutzerdefinierter Untertitel',
    installButtonText: 'Benutzerdefinierte Installation',
    iosInstallText: 'Benutzerdefinierte iOS-Installation',
  }
})
```

#### Beispiel für eine angepasste Anzeigezeit (AFrame) {#customized-display-time-example-aframe}

```html
<a-scene
  xrweb="disableWorldTracking: true"
  xrextras-gesture-detector
  xrextras-almost-there
  xrextras-loading
  xrextras-runtime-error
  xrextras-pwa-installer="minNumVisits: 5;
    displayAfterDismissalMillis: 86400000;"
>
```

#### Beispiel für eine benutzerdefinierte Anzeigezeit (Non-AFrame) {#customized-display-time-example-non-aframe}

```javascript
XRExtras.PwaInstaller.configure({
  promptConfig: {
    minNumVisits: 5, // Benutzer müssen die Web-App 5 Mal besuchen, bevor sie gefragt werden
    displayAfterDismissalMillis: 86400000 // Ein Tag
  }
})
```
