---
sidebar_position: 1
---

# xr:screenshoterror

## Beschreibung {#description}

Dieses Ereignis wird als Reaktion auf die [`xr:screenshotrequest`](/api/playcanvaseventlisteners/xrscreenshotrequest) ausgegeben, die zu einem Fehler führt.

## Beispiel {#example}

```javascript
this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // Behandeln Sie Screenshot-Fehler.
}, this)
```
