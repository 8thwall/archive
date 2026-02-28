---
id: requirements
---

# Exigences

**Tous les projets** doivent afficher le badge [Powered by 8th Wall](https://drive.google.com/drive/folders/1c9d23c5hS_HspHTUD7VceV6ocqdbPN7J?usp=sharing)
sur la page de chargement. Il est inclus par défaut dans le `Module de chargement` et ne peut pas être supprimé.
Veuillez consulter [ici](/legacy/guides/advanced-topics/load-screen/) pour obtenir des instructions sur la personnalisation de l'écran de chargement.

## Exigences en matière de navigateur web {#web-browser-requirements}

Les navigateurs mobiles ont besoin des fonctionnalités suivantes pour prendre en charge les expériences de 8th Wall Web :

- **WebGL** (canvas.getContext('webgl') || canvas.getContext('webgl2'))
- **getUserMedia** (navigator.mediaDevices.getUserMedia)
- **orientation du dispositif** (window.DeviceOrientationEvent - nécessaire uniquement si le SLAM est activé)
- **Web-Assembly/WASM** (window.WebAssembly)

**NOTE** : Les expériences Web du 8e mur doivent être visualisées via **https**. Ceci est **requis** par les navigateurs pour **l'accès à la caméra**.

Cela se traduit par la compatibilité suivante pour les appareils iOS et Android :

- iOS :
  - **Safari** (iOS 11+)
  - **Apps** qui utilisent les vues web **SFSafariViewController** (iOS 13+)
    - Apple a ajouté la prise en charge de getUserMedia() à SFSafariViewController dans iOS 13.  8th Wall fonctionne dans les applications iOS 13 qui utilisent les vues web SFSafariViewController.
    - Exemples : Twitter, Slack, Discord, Gmail, Hangouts, etc.
  - **Apps/navigateurs** qui utilisent les vues web **WKWebView** (iOS 14.3+)
    - Exemples :
      - Chrome
      - Firefox
      - Microsoft Edge
      - Facebook
      - Facebook Messenger
      - Instagram
      - et plus encore...
- Android :
  - **Navigateurs** connus pour prendre en charge de manière native les fonctionnalités requises pour WebAR :
    - **Chrome**
    - **Firefox**
    - **Samsung Internet**
    - **Microsoft Edge**
  - **Applications** utilisant des vues Web connues pour prendre en charge les fonctionnalités requises pour WebAR :
    - Twitter, WhatsApp, Slack, Gmail, Hangouts, Reddit, LinkedIn, etc.

#### Support Link-out {#link-out-support}

Pour les applications qui ne supportent pas nativement les fonctionnalités requises pour WebAR, notre bibliothèque XRExtras fournit des flux pour diriger les utilisateurs au bon endroit, maximisant ainsi l'accessibilité de vos projets WebAR à partir de ces applications.

Exemples : TikTok, Facebook (Android), Facebook Messenger (Android), Instagram (Android)

Captures d'écran :

| Lancer le navigateur à partir du menu (iOS) | Lancer le navigateur à partir d'un bouton (Android) | Copier le lien dans le presse-papiers                    |
| -------------------------------------------------------------- | ---------------------------------------------------------------------- | -------------------------------------------------------- |
| ![iOS](/images/launch-browser-from-menu.jpg)                   | ![Android](/images/launch-browser-from-button.jpg)                     | ![copy to clipboard](/images/copy-link-to-clipboard.jpg) |

## Cadres supportés {#supported-frameworks}

8th Wall Web s'intègre facilement dans les frameworks JavaScript 3D tels que :

- A-Frame (<https://aframe.io/>)
- three.js (<https://threejs.org/>)
- Babylon.js (<https://www.babylonjs.com/>)
- PlayCanvas (<https://www.playcanvas.com>)


