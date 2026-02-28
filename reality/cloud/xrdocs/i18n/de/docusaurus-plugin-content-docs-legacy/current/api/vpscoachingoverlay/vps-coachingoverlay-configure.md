---
sidebar_label: konfigurieren()
---

# VpsCoachingOverlay.configure()

`VpsCoachingOverlay.configure({ wayspotName, hintImage, animationColor, animationDuration, textColor, promptPrefix, promptSuffix, statusText, disablePrompt })`

## Beschreibung {#description}

Konfiguriert das Verhalten und das Aussehen des Lightship VPS Coaching Overlays.

## Parameter (alle fakultativ) {#parameters-all-optional}

| Parameter         | Typ       | Standard                                                                       | Beschreibung                                                                                                                                                                                                                                                                                                                |
| ----------------- | --------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| wayspotName       | `String`  |                                                                                | Der Name des Ortes, an dem das Coaching-Overlay den Benutzer zur Lokalisierung anleitet. Wenn kein Standortname angegeben wird, wird der nächstgelegene Projektstandort verwendet. Wenn das Projekt keine Projektstandorte hat, wird der nächstgelegene Standort verwendet. |
| hintImage         | `String`  |                                                                                | Bild, das dem Benutzer angezeigt wird, um ihn zum tatsächlichen Standort zu führen. Wenn kein Hinweisbild angegeben wird, wird das Standardbild für den Ort verwendet. Wenn für den Ort kein Standardbild vorhanden ist, wird kein Bild angezeigt.                          |
| animationColor    | `String`  | `'#ffffff'`                                                                    | Farbe der Coaching-Overlay-Animation. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                                                                                                                                                |
| animationDuration | Nummer    | `5000`                                                                         | Gesamtzeit, die das Hinweisbild vor dem Verkleinern angezeigt wird (in Millisekunden).                                                                                                                                                                                                   |
| textColor         | `String`  | `'#ffffff'`                                                                    | Farbe des gesamten Coaching Overlay Textes. Dieser Parameter akzeptiert gültige CSS-Farbargumente.                                                                                                                                                                                          |
| promptPrefix      | `String`  | Richten Sie Ihre Kamera auf... | Legt die Textzeichenfolge für die angezeigte Benutzeraktion über dem Namen des Standorts fest.                                                                                                                                                                                                              |
| promptSuffix      | `String`  | und bewegen Sie sich".                                         | Legt die Textzeichenfolge für die angezeigte Benutzeraktion unter dem Namen des Standorts fest.                                                                                                                                                                                                             |
| statusText        | `String`  | "Scannen...                    | Legt die Textzeichenfolge fest, die unter dem Hinweisbild angezeigt wird, wenn es sich im geschrumpften Zustand befindet.                                                                                                                                                                                   |
| disablePrompt     | `Boolean` | false                                                                          | Auf true setzen, um das Standard-Coaching-Overlay auszublenden, um Coaching-Overlay-Ereignisse für ein benutzerdefiniertes Overlay zu verwenden.                                                                                                                                                            |

## Rückgabe {#returns}

Keine

## Beispiel - Code {#example---code}

```javascript
VpsCoachingOverlay.configure({
    textColor: '#0000FF',
    promptPrefix: 'Go look for',
})
```
