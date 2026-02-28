---
sidebar_label: incompatibleReasonDetails()
---

# XR8.XrDevice.incompatibleReasonDetails()

`XR8.XrDevice.incompatibleReasonDetails({ allowedDevices })`

## Beschreibung {#description}

Gibt zusätzliche Details über die Gründe für die Inkompatibilität von Gerät und Browser zurück. Diese Information sollte nur als Hinweis für die weitere Fehlerbehandlung verwendet werden. Es wird nicht davon ausgegangen, dass diese vollständig oder zuverlässig sind. Diese enthält nur Einträge, wenn [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) false zurückgibt.

## Parameter {#parameters}

| Parameter                                                                     | Beschreibung                                                                                                    |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| allowedDevices [Optional] | Unterstützte Geräteklassen, ein Wert in [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device). |

## Rückgabe {#returns}

Ein Objekt: `{ inAppBrowser, inAppBrowserType }`

| Eigentum         | Beschreibung                                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------------------------- |
| inAppBrowser     | Der Name des erkannten In-App-Browsers (z. B. `'Twitter'`) |
| inAppBrowserType | Eine Zeichenkette, die beschreibt, wie der In-App-Browser gehandhabt werden soll.             |
