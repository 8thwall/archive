---
sidebar_position: 1
---

# xr:bildschirmfehlermeldung

## Beschreibung {#description}

Dieses Ereignis wird als Antwort auf die [`xr:screenshotrequest`](/legacy/api/playcanvaseventlisteners/xrscreenshotrequest) ausgegeben, die zu einem Fehler führt.

## Beispiel {#example}

```javascript
this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // Bildschirmfoto-Fehler behandeln.
}, this)
```
