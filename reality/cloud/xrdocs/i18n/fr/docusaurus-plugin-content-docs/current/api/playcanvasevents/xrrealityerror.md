---
sidebar_position: 1
---

# xr:erreur de réalité

## Description {#description}

Cet événement est émis lorsqu'une erreur s'est produite lors de l'initialisation de 8th Wall Web. Il s'agit du délai recommandé pour l'affichage des messages d'erreur. L'API [`XR8.XrDevice()` ](/api/xrdevice) peut vous aider à déterminer le type de message d'erreur à afficher.

## Exemple {#example}

```javascript
this.app.on('xr:realityerror', ({error, isDeviceBrowserSupported, compatibility}) => {
  if (detail.isDeviceBrowserSupported) {
    // Le navigateur est compatible. Imprimez l'exception pour plus d'informations.
    console.log(error)
    return
  }

  // Le navigateur n'est pas compatible. Vérifiez les raisons pour lesquelles il n'est pas compatible
  console.log(compatibility)
}, this)
```
