---
id: requirements
---

# Anforderungen

**Alle Projekte** müssen das [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing) Abzeichen auf der Ladeseite anzeigen. Es ist standardmäßig im `Lademodul` enthalten und kann nicht entfernt werden. Anweisungen zum Anpassen des Ladebildschirms finden Sie unter [hier](/guides/advanced-topics/load-screen/) .

## Webbrowser-Anforderungen {#web-browser-requirements}

Mobile Browser benötigen die folgenden Funktionen, um 8th Wall Web-Erlebnisse zu unterstützen:

* **WebGL** (canvas.getContext('webgl') || canvas.getContext('webgl2'))
* **getUserMedia** (navigator.mediaDevices.getUserMedia)
* **geräteausrichtung** (window.DeviceOrientationEvent - nur erforderlich, wenn SLAM aktiviert ist)
* **Web-Assembly/WASM** (window.WebAssembly)

**HINWEIS**: 8th Wall Web-Erlebnisse müssen über **https** aufgerufen werden. Dies ist **erforderlich** von Browsern für **Kamerazugriff**.

Daraus ergibt sich die folgende Kompatibilität für iOS- und Android-Geräte:

* iOS:
  * **Safari** (iOS 11+)
  * **Apps** die **SFSafariViewController** Webansichten verwenden (iOS 13+)
    * Apple hat in iOS 13 die Unterstützung von getUserMedia() zu SFSafariViewController hinzugefügt.  8th Wall funktioniert in iOS 13-Apps, die SFSafariViewController-Webansichten verwenden.
    * Beispiele: Twitter, Slack, Discord, Gmail, Hangouts, und mehr.
  * **Apps/Browser** die **WKWebView** Webansichten verwenden (iOS 14.3+)
    * Beispiele:
      * Chrome
      * Firefox
      * Microsoft Edge
      * Facebook
      * Facebook Messenger
      * Instagram
      * und mehr...
* Android:
  * **Browser**, die bekanntermaßen die für WebAR erforderlichen Funktionen nativ unterstützen:
    * **Chrome**
    * **Firefox**
    * **Samsung Internet**
    * **Microsoft Edge**
  * **Apps** , die Web Views verwenden, von denen bekannt ist, dass sie die für WebAR erforderlichen Funktionen unterstützen:
    * Twitter, WhatsApp, Slack, Gmail, Hangouts, Reddit, LinkedIn, und mehr.

#### Link-out Unterstützung {#link-out-support}

Für Anwendungen, die die für WebAR erforderlichen Funktionen nicht nativ unterstützen, bietet unsere XRExtras-Bibliothek Abläufe, die die Benutzer an die richtige Stelle leiten und die Zugänglichkeit Ihrer WebAR-Projekte aus diesen Anwendungen heraus maximieren.

Beispiele: TikTok, Facebook (Android), Facebook Messenger (Android), Instagram (Android)

Screenshots:

| Browser über das Menü starten (iOS)          | Browser über Schaltfläche starten (Android)        | Link in die Zwischenablage kopieren                      |
| -------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------- |
| ![iOS](/images/launch-browser-from-menu.jpg) | ![Android](/images/launch-browser-from-button.jpg) | ![copy to clipboard](/images/copy-link-to-clipboard.jpg) |

## Unterstützte Frameworks {#supported-frameworks}

8th Wall Web lässt sich leicht in 3D-JavaScript-Frameworks integrieren, wie z. B:

* A-Frame (<https://aframe.io/>)
* three.js (<https://threejs.org/>)
* Babylon.js (<https://www.babylonjs.com/>)
* PlayCanvas (<https://www.playcanvas.com>)


