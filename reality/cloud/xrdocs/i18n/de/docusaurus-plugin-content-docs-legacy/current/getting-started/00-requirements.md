---
id: requirements
---

# Anforderungen

**Alle Projekte** müssen das [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing)
Abzeichen auf der Ladeseite anzeigen. Es ist standardmäßig im "Lademodul" enthalten und kann nicht entfernt werden.
Eine Anleitung zum Anpassen des Ladebildschirms finden Sie [hier](/legacy/guides/advanced-topics/load-screen/).

## Anforderungen an den Webbrowser {#web-browser-requirements}

Mobile Browser benötigen die folgenden Funktionen, um 8th Wall Web-Erlebnisse zu unterstützen:

- **WebGL** (canvas.getContext('webgl') || canvas.getContext('webgl2'))
- **getUserMedia** (navigator.mediaDevices.getUserMedia)
- **Geräteausrichtung** (window.DeviceOrientationEvent - nur erforderlich, wenn SLAM aktiviert ist)
- **Web-Assembly/WASM** (window.WebAssembly)

**HINWEIS**: 8th Wall Web-Erfahrungen müssen über **https** angezeigt werden. Dies wird von den Browsern für den **Kamera-Zugang** **erforderlich**.

Daraus ergibt sich die folgende Kompatibilität für iOS- und Android-Geräte:

- iOS:
  - **Safari** (iOS 11+)
  - **Apps**, die **SFSafariViewController** Webansichten verwenden (iOS 13+)
    - Apple hat in iOS 13 die Unterstützung von getUserMedia() zu SFSafariViewController hinzugefügt.  8th Wall funktioniert in iOS 13-Apps, die SFSafariViewController-Webansichten verwenden.
    - Beispiele: Twitter, Slack, Discord, Gmail, Hangouts und mehr.
  - **Apps/Browser**, die **WKWebView** Webansichten verwenden (iOS 14.3+)
    - Beispiele:
      - Chrom
      - Firefox
      - Microsoft Edge
      - Facebook
      - Facebook Messenger
      - Instagram
      - und mehr...
- Android:
  - **Browser**, von denen bekannt ist, dass sie die für WebAR erforderlichen Funktionen von Haus aus unterstützen:
    - **Chrom**
    - **Firefox**
    - **Samsung Internet**
    - **Microsoft Edge**
  - **Anwendungen**, die Webansichten verwenden, von denen bekannt ist, dass sie die für WebAR erforderlichen Funktionen unterstützen:
    - Twitter, WhatsApp, Slack, Gmail, Hangouts, Reddit, LinkedIn und mehr.

#### Link-Out-Unterstützung {#link-out-support}

Für Anwendungen, die die für WebAR erforderlichen Funktionen nicht von Haus aus unterstützen, bietet unsere XRExtras-Bibliothek Abläufe, die die Benutzer an die richtige Stelle leiten und die Zugänglichkeit Ihrer WebAR-Projekte aus diesen Anwendungen heraus maximieren.

Beispiele: TikTok, Facebook (Android), Facebook Messenger (Android), Instagram (Android)

Screenshots:

| Browser über das Menü starten (iOS) | Browser über Schaltfläche starten (Android) | Link in die Zwischenablage kopieren                      |
| ------------------------------------------------------ | -------------------------------------------------------------- | -------------------------------------------------------- |
| ![iOS](/images/launch-browser-from-menu.jpg)           | ![Android](/images/launch-browser-from-button.jpg)             | ![copy to clipboard](/images/copy-link-to-clipboard.jpg) |

## Unterstützte Frameworks {#supported-frameworks}

8th Wall Web lässt sich leicht in 3D-JavaScript-Frameworks wie z.B.:

- A-Frame (<https://aframe.io/>)
- three.js (<https://threejs.org/>)
- Babylon.js (<https://www.babylonjs.com/>)
- PlayCanvas (<https://www.playcanvas.com>)


