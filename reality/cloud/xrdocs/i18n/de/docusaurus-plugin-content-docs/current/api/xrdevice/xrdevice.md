# XR8.XrDevice

## Beschreibung {#description}

Hier finden Sie Informationen zur Kompatibilität und zu den Eigenschaften der Geräte.

## Eigenschaften {#properties}

| Eigentum                                            | Typ        | Beschreibung                                                                                  |
| --------------------------------------------------- | ---------- | --------------------------------------------------------------------------------------------- |
| [IncompatibilityReasons](incompatibilityreasons.md) | Aufzählung | Die möglichen Gründe, warum ein Gerät und ein Browser nicht mit 8th Wall Web kompatibel sind. |

## Funktionen {#functions}

| Funktion                                                  | Beschreibung                                                                                                                                                                                                                                                                                                                                                                                              |
| --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [deviceEstimate](deviceestimate.md)                       | Gibt eine Schätzung des Geräts des Benutzers (z.B. Marke/Modell) zurück, die auf den String des Benutzeragenten und anderen Faktoren basiert. Diese Informationen sind nur eine Schätzung und sollten nicht als vollständig oder zuverlässig angesehen werden.                                                                                                                                            |
| [incompatibleReasons](incompatiblereasons.md)             | Liefert ein Array von [`XR8.XrDevice.IncompatibilityReasons`](incompatibilityreasons.md) warum das Gerät das Gerät und der Browser nicht unterstützt werden. Diese enthält nur Einträge, wenn [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) false zurückgibt.                                                                                                                |
| [incompatibleReasonDetails](incompatiblereasondetails.md) | Gibt zusätzliche Details über die Gründe für die Inkompatibilität von Gerät und Browser zurück. Diese Information sollte nur als Hinweis für die weitere Fehlerbehandlung verwendet werden. Sie sollten nicht davon ausgehen, dass diese vollständig oder zuverlässig sind. Diese enthält nur Einträge, wenn [`XR8.XrDevice.isDeviceBrowserCompatible()`](isdevicebrowsercompatible.md) false zurückgibt. |
| [isDeviceBrowserCompatible](isdevicebrowsercompatible.md) | Gibt eine Einschätzung zurück, ob das Gerät und der Browser des Benutzers mit 8th Wall Web kompatibel sind. Wenn der Wert Falsch zurückgegeben wird, [`XR8.XrDevice.incompatibleReasons()`](incompatiblereasons.md) gibt Gründe zurück, warum das Gerät und der Browser nicht unterstützt werden.                                                                                                         |
