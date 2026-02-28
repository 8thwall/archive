---
id: requirements
---

# Requisitos

**Todos los proyectos** deben mostrar el distintivo [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing)
en la página de carga. Se incluye por defecto en el `Loading Module` y no puede eliminarse.
Consulte [aquí](/legacy/guides/advanced-topics/load-screen/) para obtener instrucciones sobre la personalización de la pantalla de carga.

## Requisitos del navegador web {#web-browser-requirements}

Los navegadores móviles requieren la siguiente funcionalidad para soportar las experiencias web de 8th Wall:

- **WebGL** (canvas.getContext('webgl') || canvas.getContext('webgl2'))
- **getUserMedia** (navigator.mediaDevices.getUserMedia)
- **orientación del dispositivo** (window.DeviceOrientationEvent - sólo necesario si SLAM está activado)
- **Web-Assembly/WASM** (window.WebAssembly)

**NOTA**: Las experiencias web de 8th Wall deben visualizarse a través de **https**. Esto es **requerido** por los navegadores para el **acceso a la cámara**.

Esto se traduce en la siguiente compatibilidad para dispositivos iOS y Android:

- iOS:
  - **Safari** (iOS 11+)
  - **Aplicaciones** que utilizan vistas web **SFSafariViewController** (iOS 13+)
    - Apple añadió soporte para getUserMedia() a SFSafariViewController en iOS 13.  8th Wall funciona en aplicaciones iOS 13 que utilizan vistas web SFSafariViewController.
    - Ejemplos: Twitter, Slack, Discord, Gmail, Hangouts, etc.
  - **Aplicaciones/navegadores** que utilizan vistas web **WKWebView** (iOS 14.3+)
    - Ejemplos:
      - Cromo
      - Firefox
      - Microsoft Edge
      - Facebook
      - Facebook Messenger
      - Instagram
      - y más...
- Android:
  - **Navegadores** conocidos por soportar de forma nativa las características requeridas para WebAR:
    - **Cromo**
    - **Firefox**
    - **Samsung Internet**
    - **Microsoft Edge**
  - **Aplicaciones** que utilizan Web Views conocidas por soportar las características requeridas para WebAR:
    - Twitter, WhatsApp, Slack, Gmail, Hangouts, Reddit, LinkedIn, etc.

#### Soporte Link-out {#link-out-support}

Para las aplicaciones que no soportan de forma nativa las funciones necesarias para WebAR, nuestra biblioteca XRExtras proporciona flujos para dirigir a los usuarios al lugar correcto, maximizando la accesibilidad de sus proyectos WebAR desde estas aplicaciones.

Ejemplos: TikTok, Facebook (Android), Facebook Messenger (Android), Instagram (Android)

Capturas de pantalla:

| Iniciar el navegador desde el menú (iOS) | Iniciar el navegador desde el botón (Android) | Copiar enlace al portapapeles                            |
| ----------------------------------------------------------- | ---------------------------------------------------------------- | -------------------------------------------------------- |
| ![iOS](/images/launch-browser-from-menu.jpg)                | ![Android](/images/launch-browser-from-button.jpg)               | ![copy to clipboard](/images/copy-link-to-clipboard.jpg) |

## Marcos compatibles {#supported-frameworks}

8th Wall Web se integra fácilmente en frameworks JavaScript 3D como:

- Marco A (<https://aframe.io/>)
- three.js (<https://threejs.org/>)
- Babylon.js (<https://www.babylonjs.com/>)
- PlayCanvas (<https://www.playcanvas.com>)


