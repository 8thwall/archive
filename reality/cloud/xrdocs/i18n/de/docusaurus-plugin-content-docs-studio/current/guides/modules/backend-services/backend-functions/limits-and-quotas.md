---
id: limits-and-quotas
sidebar_position: 4
---

# Grenzwerte und Quoten

Für Backend-Funktionen gelten derzeit die folgenden Beschränkungen und Quoten:

## Streckenbegrenzungen

- Max. Leitwege pro Modul: 32
- Maximale Routen pro Projekt: 64

:::note
Jede Backend-Funktion zählt als 1 Route, die mit dem zugrunde liegenden Gateway für Ihre Anwendung verbunden ist. Jede
Proxy-Route wird ebenfalls auf dieses Limit angerechnet.
:::

## Funktion Zeitüberschreitung

Backend-Funktionen sind auf eine **maximale Ausführungszeit von 10 Sekunden** beschränkt. Wenn Sie diese Grenze überschreiten, wird die Funktion
mit einer Fehlermeldung abgebrochen.

## Paket-Unterstützung

Die Installation von NPM-Paketen wird derzeit nicht unterstützt. Zu diesem Zeitpunkt haben Sie Zugang zu allen Node.js
Kernmodulen.
