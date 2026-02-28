---
sidebar_label: incompatibleReasonDetails()
---

# XR8.XrDevice.incompatibleReasonDetails()

`XR8.XrDevice.incompatibleReasonDetails({ allowedDevices })`

## Description {#description}

Renvoie des détails supplémentaires sur les raisons pour lesquelles l'appareil et le navigateur sont incompatibles. Cette information ne doit être utilisée qu'à titre indicatif pour aider à la gestion des erreurs ultérieures. Ils ne doivent pas être considérés comme complets ou fiables. Il ne contiendra des entrées que si [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) renvoie la valeur faux.

## Paramètres {#parameters}

| Paramètres                  | Description                                                                                                 |
| --------------------------- | ----------------------------------------------------------------------------------------------------------- |
| allowedDevices [Facultatif] | Classes de périphériques prises en charge, une valeur dans [`XR8.XrConfig.device()`](/api/xrconfig/device). |

## Retours {#returns}

Un objet : `{ inAppBrowser, inAppBrowserType }`

| Propriété        | Description                                                          |
| ---------------- | -------------------------------------------------------------------- |
| inAppBrowser     | Le nom du navigateur in-app détecté (par exemple, `"Twitter"`)       |
| inAppBrowserType | Une chaîne qui permet de décrire comment gérer le navigateur in-app. |
