---
sidebar_label: deviceEstimate()
---

# XR8.XrDevice.deviceEstimate()

`XR8.XrDevice.deviceEstimate()`

## Beschreibung {#description}

Gibt eine Schätzung des Geräts des Benutzers (z.B. Marke/Modell) zurück, die auf den String des Benutzeragenten und anderen Faktoren basiert. Diese Informationen sind nur eine Schätzung und sollten nicht als vollständig oder zuverlässig angesehen werden.

## Parameter {#parameters}

Keine

## Returns {#returns}

Ein Objekt: `{ locale, os, osVersion, manufacturer, model }`

| Eigentum     | Beschreibung                                |
| ------------ | ------------------------------------------- |
| lokales      | Das Gebietsschema des Benutzers.            |
| os           | Das Betriebssystem des Geräts.              |
| osVersion    | Die Version des Betriebssystems des Geräts. |
| manufacturer | Der Hersteller des Geräts.                  |
| model        | Das Gerätemodell.                           |
