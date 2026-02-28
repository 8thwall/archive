---
sidebar_label: configure()
---

# CoachingOverlay.configure()

`CoachingOverlay.configure({ animationColor, promptColor, promptText, disablePrompt })`

## Beschreibung {#description}

Konfiguriert das Verhalten und Aussehen des Coaching-Overlays.

## Parameter (alle optional) {#parameters-all-optional}

| Parameter      | Typ         | Standard                         | Beschreibung                                                                                                                                                            |
| -------------- | ----------- | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | `String`    | `'weiß'`                         | Farbe der Coaching Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                            |
| promptColor    | `String`    | `'weiß'`                         | Farbe des gesamten Coaching Overlay-Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                      |
| promptText     | `String`    | `"Gerät vor- und zurückbewegen'` | Legt den Textstring für den Erklärungstext der Animation fest, der den Benutzer über die Bewegung informiert, die er ausführen muss, um die Skalierung zu erzeugen.     |
| disablePrompt  | `Boolesche` | `false`                          | Setzen Sie diesen Wert auf Wahr, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay verwenden zu können. |

## Returns {#returns}

Keine

## Beispiel - Code {#example---code}

```javascript
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Um eine Skala zu erzeugen, drücken Sie Ihr Telefon nach vorne und ziehen Sie es dann zurück',
})
```
