---
sidebar_position: 1
---

# xr:realityerror

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn bei der Initialisierung von 8th Wall Web ein Fehler aufgetreten ist. Dies ist die von empfohlene Zeit, zu der Fehlermeldungen angezeigt werden sollten. Die [`XR8.XrDevice()` API](/api/xrdevice) kann Ihnen dabei helfen, die Art der Fehlermeldung zu bestimmen, die angezeigt werden soll.

## Beispiel {#example}

```javascript
this.app.on('xr:realityerror', ({error, isDeviceBrowserSupported, compatibility}) => {
  if (detail.isDeviceBrowserSupported) {
    // Browser ist kompatibel. Drucken Sie die Ausnahme für weitere Informationen aus.
    console.log(error)
    return
  }

  // Browser ist nicht kompatibel. Überprüfen Sie die Gründe, warum es nicht in `Kompatibilität` ist
  console.log(compatibility)
}, this)
```
