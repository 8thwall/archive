---
sidebar_label: InkompatibilitätGründe
---

# XR8.XrDevice.IncompatibilityReasons

Aufzählung

## Beschreibung {#description}

Die möglichen Gründe, warum ein Gerät und ein Browser nicht mit 8th Wall Web kompatibel sind.

## Eigenschaften {#properties}

| Eigentum                                                           | Wert | Beschreibung                                                                    |
| ------------------------------------------------------------------ | ---- | ------------------------------------------------------------------------------- |
| UNBESTIMMT                                                         | `0`  | Der Grund für die Unvereinbarkeit ist nicht angegeben.          |
| UNSUPPORTED_OS                                | `1`  | Das geschätzte Betriebssystem wird nicht unterstützt.           |
| NICHT UNTERSTÜTZTE_BROWSER                    | `2`  | Der geschätzte Browser wird nicht unterstützt.                  |
| FEHLENDE_GERÄTEAUSRICHTUNG                    | `3`  | Der Browser unterstützt keine Ereignisse zur Geräteausrichtung. |
| FEHLENDE_BENUTZER_MEDIEN | `4`  | Der Browser unterstützt den Zugriff auf die Medien nicht.       |
| FEHLENDE_WEB_ASSEMBLY    | `5`  | Der Browser unterstützt keine Webmontage.                       |
