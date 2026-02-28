---
sidebar_label: IncompatibilityReasons
---

# XR8.XrDevice.IncompatibilityReasons

Aufzählung

## Beschreibung {#description}

Die möglichen Gründe, warum ein Gerät und ein Browser nicht mit 8th Wall Web kompatibel sind.

## Eigenschaften {#properties}

| Eigentum                     | Wert | Beschreibung                                                    |
| ---------------------------- | ---- | --------------------------------------------------------------- |
| UNSPECIFIED                  | `0`  | Der Grund für die Inkompatibilität wird nicht angegeben.        |
| UNSUPPORTED_OS               | `1`  | Das geschätzte Betriebssystem wird nicht unterstützt.           |
| UNSUPPORTED_BROWSER          | `2`  | Der geschätzte Browser wird nicht unterstützt.                  |
| MISSING_DEVICE_ORIENTATION | `3`  | Der Browser unterstützt keine Ereignisse zur Geräteausrichtung. |
| MISSING_USER_MEDIA         | `4`  | Der Browser unterstützt den Zugriff auf die Medien nicht.       |
| MISSING_WEB_ASSEMBLY       | `5`  | Der Browser unterstützt keine Web-Assembly.                     |
