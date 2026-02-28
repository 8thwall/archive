---
sidebar_label: gerät()
---

# XR8.XrConfig.device()

Aufzählung

## Beschreibung {#description}

Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll. Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, öffnen Sie immer die Kamera.

Hinweis: World Effects (SLAM) kann nur mit `XR8.XrConfig.device().MOBILE_AND_HEADSETS` oder `XR8.XrConfig.device().MOBILE` verwendet werden.

## Eigenschaften {#properties}

| Eigentum             | Wert                    | Beschreibung                                                                                                                                                                                                                                                  |
| -------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MOBIL                | `'mobil'`               | Beschränken Sie die Kamera-Pipeline auf Geräten der mobilen Klasse, z.B. Handys und Tablets.                                                                                                                                                                  |
| MOBIL_UND_HEADSETS | `'Handy-und-Kopfhörer'` | Schränken Sie die Kamera-Pipeline auf mobilen Geräten und Geräten der Headset-Klasse ein.                                                                                                                                                                     |
| ANY                  | `'beliebig'`            | Starten Sie die Kamera-Pipeline, ohne die Fähigkeiten des Geräts zu überprüfen. Dies kann zu einem bestimmten Zeitpunkt beim Start der Pipeline fehlschlagen, wenn ein benötigter Sensor zur Laufzeit nicht verfügbar ist (z.B. ein Laptop hat keine Kamera). |
