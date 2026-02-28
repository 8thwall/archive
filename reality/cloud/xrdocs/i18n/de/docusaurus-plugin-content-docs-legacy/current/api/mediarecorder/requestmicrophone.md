---
sidebar_label: requestMicrophone()
---

# XR8.MediaRecorder.requestMicrophone()

`XR8.MediaRecorder.requestMicrophone()`

## Beschreibung {#description}

Ermöglicht die Aufnahme von Audio (falls nicht automatisch aktiviert) und fordert bei Bedarf Berechtigungen an.

Gibt ein Versprechen zurück, das dem Client mitteilt, wann der Stream bereit ist.  Wenn Sie mit der Aufnahme
beginnen, bevor der Audiostream bereit ist, verpassen Sie möglicherweise die Mikrofonausgabe des Benutzers am
Beginn der Aufnahme.

## Parameter {#parameters}

Keine

## Rückgabe {#returns}

Ein Versprechen.

## Beispiel {#example}

```javascript
XR8.MediaRecorder.requestMicrophone()
.then(() => {
  console.log('Mikrofon angefordert!')
})
.catch((err) => {
  console.log('Ein Fehler ist aufgetreten: ', err)
})
```
