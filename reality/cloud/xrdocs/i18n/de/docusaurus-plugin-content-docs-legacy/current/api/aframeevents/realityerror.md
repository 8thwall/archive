# realityerror

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn bei der Initialisierung von 8th Wall Web ein Fehler aufgetreten ist. Dies ist die von
empfohlene Zeit, zu der eventuelle Fehlermeldungen angezeigt werden sollten. Die [`XR8.XrDevice()` API](/legacy/api/xrdevice)
kann dabei helfen, die Art der Fehlermeldung zu bestimmen, die angezeigt werden soll.

## Beispiel {#example}

```javascript
let scene = this.el.sceneEl
  scene.addEventListener('realityerror', (event) => {
    if (XR8.XrDevice.isDeviceBrowserCompatible()) {
      // Browser ist kompatibel. Drucken Sie die Ausnahme für weitere Informationen.
      console.log(event.detail.error)
      return
    }

    // Der Browser ist nicht kompatibel. Prüfen Sie die Gründe, warum er nicht kompatibel ist.
    for (let reason of XR8.XrDevice.incompatibleReasons()) {
      // Behandeln Sie jeden XR8.XrDevice.IncompatibilityReasons
    }
  })
```
