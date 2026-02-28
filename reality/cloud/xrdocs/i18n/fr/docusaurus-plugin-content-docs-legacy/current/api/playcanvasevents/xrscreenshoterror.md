---
sidebar_position: 1
---

# xr:screenshoterror

## Description {#description}

Cet événement est émis en réponse à la [`xr:screenshotrequest`](/legacy/api/playcanvaseventlisteners/xrscreenshotrequest) qui aboutit à une erreur.

## Exemple {#example}

```javascript
this.app.on('xr:screenshoterror', (detail) => {
  console.log(detail)
  // Gérer l'erreur de capture d'écran.
}, this)
```
