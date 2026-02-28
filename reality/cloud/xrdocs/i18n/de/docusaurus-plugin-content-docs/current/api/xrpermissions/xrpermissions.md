# XR8.XrPermissions

## Beschreibung {#description}

Hilfsprogramme zum Festlegen von Berechtigungen, die für ein Pipeline-Modul erforderlich sind.

Module können angeben, welche Browserfunktionen sie benötigen, für die möglicherweise Berechtigungsanfragen erforderlich sind. Diese können vom Framework verwendet werden, um die entsprechenden Berechtigungen anzufordern, wenn sie nicht vorhanden sind, oder um Komponenten zu erstellen, die die entsprechenden Berechtigungen anfordern, bevor XR ausgeführt wird.

## Eigenschaften {#properties}

| Eigentum                        | Typ        | Beschreibung                                                                                   |
| ------------------------------- | ---------- | ---------------------------------------------------------------------------------------------- |
| [permissions()](permissions.md) | Aufzählung | Liste der Berechtigungen, die als erforderlich für ein Pipeline-Modul angegeben werden können. |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'request-gyro',
  requiredPermissions: () => ([XR8.XrPermissions.permissions().DEVICE_ORIENTATION]),
})
```
