---
sidebar_label: konfigurieren()
---

# CoachingOverlay.configure()

`CoachingOverlay.configure({ animationColor, promptColor, promptText, disablePrompt })`

## Beschreibung {#description}

Konfiguriert das Verhalten und Aussehen des Coaching-Overlays.

## Parameter (alle fakultativ) {#parameters-all-optional}

| Parameter      | Typ       | Standard                                               | Beschreibung                                                                                                                                                                                 |
| -------------- | --------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| animationColor | `String`  | 'weiß'                                                 | Farbe der Coaching-Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                 |
| promptColor    | `String`  | 'weiß'                                                 | Farbe des gesamten Coaching Overlay Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                           |
| promptText     | `String`  | Gerät vorwärts und rückwärts bewegen". | Legt die Textzeichenfolge für den Erklärungstext der Animation fest, der die Benutzer über die Bewegung informiert, die sie ausführen müssen, um die Skalierung zu erzeugen. |
| disablePrompt  | `Boolean` | false                                                  | Auf true setzen, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay zu verwenden.                             |

## Rückgabe {#returns}

Keine

## Beispiel - Code {#example---code}

```javascript
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText: 'Um eine Skalierung zu erzeugen, drücken Sie Ihr Telefon nach vorne und ziehen Sie es dann zurück',
})
```
