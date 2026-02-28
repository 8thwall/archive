---
sidebar_label: incompatibleReasonDetails()
---

# XR8.XrDevice.incompatibleReasonDetails()

`XR8.XrDevice.incompatibleReasonDetails({ allowedDevices })`

## Descripción {#description}

Devuelve detalles adicionales sobre las razones por las que el dispositivo y el navegador son incompatibles. Esta información sólo debe utilizarse como pista para ayudar en la gestión posterior del error. No deben considerarse completos ni fiables. Sólo contendrá entradas si [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) devuelve false.

## Parámetros {#parameters}

| Parámetro                 | Descripción                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------ |
| allowedDevices [Opcional] | Clases de dispositivos compatibles, un valor en [`XR8.XrConfig.device()`](/api/xrconfig/device). |

## Devuelve {#returns}

Un objeto: `{ inAppBrowser, inAppBrowserType }`

| Propiedad        | Descripción                                                         |
| ---------------- | ------------------------------------------------------------------- |
| inAppBrowser     | El nombre del navegador in-app detectado (por ejemplo, `'Twitter'`) |
| inAppBrowserType | Una cadena que ayuda a describir cómo manejar el navegador in-app.  |
