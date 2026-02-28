---
sidebar_position: 1
---

# xr:realityerror

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn bei der Initialisierung von 8th Wall Web ein Fehler aufgetreten ist. Dies ist die von
empfohlene Zeit, zu der eventuelle Fehlermeldungen angezeigt werden sollten. Die [`XR8.XrDevice()` API](/legacy/api/xrdevice)
kann dabei helfen, die Art der Fehlermeldung zu bestimmen, die angezeigt werden soll.

## Beispiel {#example}

```javascript
this.app.on('xr:realityerror', ({error, isDeviceBrowserSupported, compatibility}) => {
  if (detail.isDeviceBrowserSupported) {
    // Browser ist kompatibel. Drucken Sie die Ausnahme für weitere Informationen.
    console.log(error)
    return
  }

  // Der Browser ist nicht kompatibel. Überprüfen Sie die Gründe, warum er nicht kompatibel ist
  console.log(compatibility)
}, this)
```
