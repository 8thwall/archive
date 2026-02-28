---
id: requirements
---

# Requisitos

**Todos los proyectos** deben mostrar el distintivo [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing) en la página de carga. Se incluye por defecto en el módulo de carga `` y no puede eliminarse. Consulte [aquí](/guides/advanced-topics/load-screen/) para obtener instrucciones sobre la personalización de la pantalla de carga.

## Requisitos del navegador web {#web-browser-requirements}

Los navegadores móviles requieren las siguientes funcionalidades para soportar las experiencias Web de 8th Wall:

* **WebGL** (canvas.getContext('webgl') || canvas.getContext('webgl2'))
* **getUserMedia** (navigator.mediaDevices.getUserMedia)
* **deviceorientation** (window.DeviceOrientationEvent - only needed if SLAM is enabled)
* **Web-Assembly/WASM** (window.WebAssembly)

**NOTA**: Las experiencias web de 8th Wall deben verse a través de **https**. Esto es **requerido** por los navegadores para **acceder a la cámara**.

Esto se traduce en la siguiente compatibilidad para dispositivos iOS y Android:

* iOS:
  * **Safari** (iOS 11+)
  * **Aplicaciones** que utilizan **SFSafariViewController** vistas web (iOS 13+)
    * Apple añadió soporte para getUserMedia() a SFSafariViewController en iOS 13.  8th Wall funciona en aplicaciones iOS 13 que utilizan vistas web SFSafariViewController.
    * Ejemplos: Twitter, Slack, Discord, Gmail, Hangouts, etc.
  * **Aplicaciones/navegadores** que utilizan **WKWebView** vistas web (iOS 14.3+)
    * Ejemplos:
      * Chrome
      * Firefox
      * Microsoft Edge
      * Facebook
      * Facebook Messenger
      * Instagram
      * y más...
* Android:
  * **Navegadores** conocidos por soportar de forma nativa las funciones necesarias para WebAR:
    * **Chrome**
    * **Firefox**
    * **Samsung Internet**
    * **Microsoft Edge**
  * **Aplicaciones** que utilizan Vistas Web conocidas por soportar las características requeridas para WebAR:
    * Twitter, WhatsApp, Slack, Gmail, Hangouts, Reddit, LinkedIn y más.

#### Soporte de enlace {#link-out-support}

Para las aplicaciones que no soportan de forma nativa las funciones necesarias para WebAR, nuestra biblioteca XRExtras proporciona flujos para dirigir a los usuarios al lugar adecuado, maximizando la accesibilidad de sus proyectos WebAR desde estas aplicaciones.

Ejemplos: TikTok, Facebook (Android), Facebook Messenger (Android), Instagram (Android)

Capturas de pantalla:

| Iniciar el navegador desde el menú (iOS)     | Iniciar el navegador desde el botón (Android)      | Copiar el código en el portapapeles                                        |
| -------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------------- |
| ![iOS](/images/launch-browser-from-menu.jpg) | ![Android](/images/launch-browser-from-button.jpg) | ![copiar el código en el portapapeles](/images/copy-link-to-clipboard.jpg) |

## Marcos compatibles {#supported-frameworks}

8th Wall Web se integra fácilmente en marcos JavaScript 3D como:

* A-Frame (<https://aframe.io/>)
* three.js (<https://threejs.org/>)
* Babylon.js (<https://www.babylonjs.com/>)
* PlayCanvas (<https://www.playcanvas.com>)


