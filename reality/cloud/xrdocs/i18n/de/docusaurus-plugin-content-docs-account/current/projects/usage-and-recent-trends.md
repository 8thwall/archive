---
id: usage-and-recent-trends
sidebar_position: 6
---

# Nutzung und jüngste Trends

## Ansichten und Verweildauer {#views-and-dwell-time}

Die folgenden Nutzungsanalysen werden auf Projektbasis bereitgestellt:

- Ansichten
- Verweilzeit

Auf der Registerkarte "Ansichten" können Sie sehen, wie oft Ihr Projekt während seiner Laufzeit angesehen wurde. Auf
können Sie auf der Registerkarte "Verweildauer" die durchschnittliche Verweildauer der Nutzer in Ihrem Erlebnisbereich sehen. Bei den Durchschnittswerten
werden Tage mit Null-Daten nicht berücksichtigt.

Alle Zeiten im Diagramm werden in Ortszeit angezeigt, aber 8th Wall sammelt nur stündlich aggregierte Daten
in UTC. Benutzer der Karte in Zeitzonen mit nicht-stündlichen Offsets sehen die gesammelten Daten
für die ihrem Tag am nächsten liegenden UTC-Stunden. Die Verweildauer ist erst ab dem 1. Januar 2023 möglich. Der
jüngste Tag setzt sich nur aus Teildaten bis zur aktuellen Uhrzeit zusammen.

Die Tooltip-Zeiten auf dem Diagramm zeigen den Beginn des Datenerfassungszeitraums an, und der Punktwert
ist die Aggregation der Daten ab diesem Datum.

![ProjectDashboardOverview](/images/console-appkey-usage.jpg)

## CSV-Export {#csv-export}

Für weitergehende Analysen stehen auch Daten im CSV-Format zur Verfügung. Sie können diese Daten unter
herunterladen, indem Sie auf das Download-Symbol oberhalb der Grafik klicken. Die CSV-Felder sind die folgenden:

| Feld            | Beschreibung                                                                                  |
| --------------- | --------------------------------------------------------------------------------------------- |
| dt              | ISO8601-formatierte UTC-Zeit-Datumszeichenfolge.                              |
| meanDwellTimeMs | Die durchschnittliche Sitzungsdauer in Millisekunden an einem bestimmten Tag. |
| Ansichten       | Die Anzahl der an einem bestimmten Tag empfangenen Ansichten.                 |
