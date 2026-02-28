---
sidebar_label: Gerät()
---

# XR8.XrConfig.device()

Aufzählung

## Beschreibung {#description}

Geben Sie die Klasse der Geräte an, auf denen die Pipeline laufen soll. Wenn das aktuelle Gerät nicht zu dieser Klasse gehört, schlägt die Ausführung vor dem Öffnen der Kamera fehl. Wenn allowedDevices `XR8.XrConfig.device().ANY` ist, wird immer die Kamera geöffnet.

Hinweis: Welteffekte (SLAM) können nur mit `XR8.XrConfig.device().MOBILE_AND_HEADSETS` oder `XR8.XrConfig.device().MOBILE` verwendet werden.

## Eigenschaften {#properties}

| Eigentum                                                     | Wert                | Beschreibung                                                                                                                                                                                                                                                                                                                                 |
| ------------------------------------------------------------ | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| MOBIL                                                        | 'mobil'             | Einschränkung der Kamera-Pipeline auf Geräten der mobilen Klasse, z. B. Handys und Tablets.                                                                                                                                                                                                  |
| MOBIL_UND_HEADSETS | Handy und Kopfhörer | Einschränkung der Kamera-Pipeline bei mobilen Geräten und Geräten der Headset-Klasse.                                                                                                                                                                                                                                        |
| ANY                                                          | `irgendwas`         | Starten Sie die Kamera-Pipeline ohne Überprüfung der Gerätefunktionen. Dies kann zu einem bestimmten Zeitpunkt beim Start der Pipeline fehlschlagen, wenn ein erforderlicher Sensor zur Laufzeit nicht verfügbar ist (z. B. hat ein Laptop keine Kamera). |
