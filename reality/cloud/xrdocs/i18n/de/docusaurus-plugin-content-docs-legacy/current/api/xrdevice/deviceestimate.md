---
sidebar_label: deviceEstimate()
---

# XR8.XrDevice.deviceEstimate()

`XR8.XrDevice.deviceEstimate()`

## Beschreibung {#description}

Gibt eine Schätzung des Geräts des Benutzers (z. B. Marke/Modell) auf der Grundlage der Zeichenfolge des Benutzeragenten und anderer Faktoren zurück. Diese Informationen sind nur eine Schätzung und sollten nicht als vollständig oder zuverlässig angesehen werden.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Ein Objekt: "{ locale, os, osVersion, manufacturer, model }".

| Eigentum   | Beschreibung                                                |
| ---------- | ----------------------------------------------------------- |
| Standort   | Das Gebietsschema des Benutzers.            |
| os         | Das Betriebssystem des Geräts.              |
| osVersion  | Die Version des Betriebssystems des Geräts. |
| Hersteller | Der Hersteller des Geräts.                  |
| Modell     | Das Modell des Geräts.                      |
