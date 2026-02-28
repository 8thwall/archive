# realityerror

## Beschreibung {#description}

Dieses Ereignis wird ausgelöst, wenn bei der Initialisierung von 8th Wall Web ein Fehler aufgetreten ist. Dies ist die von empfohlene Zeit, zu der Fehlermeldungen angezeigt werden sollten. Die [`XR8.XrDevice()` API](/api/xrdevice) kann Ihnen dabei helfen, die Art der Fehlermeldung zu bestimmen, die angezeigt werden soll.

## Beispiel {#example}

```javascript
let scene = this.el.sceneEl
  scene.addEventListener('realityerror', (event) => {
    if (XR8.XrDevice.isDeviceBrowserCompatible()) {
      // Browser ist kompatibel. Drucken Sie die Ausnahme für weitere Informationen aus.
      console.log(event.detail.error)
      return
    }

    // Browser ist nicht kompatibel. Prüfen Sie die Gründe, warum das nicht der Fall sein könnte.
    for (let reason of XR8.XrDevice.incompatibleReasons()) {
      // Behandeln Sie jeden XR8.XrDevice.IncompatibilityReasons
    }
  })
```
