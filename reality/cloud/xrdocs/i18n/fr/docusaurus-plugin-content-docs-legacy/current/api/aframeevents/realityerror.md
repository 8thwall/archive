# erreur de réalité

## Description {#description}

Cet événement est émis lorsqu'une erreur s'est produite lors de l'initialisation de 8th Wall Web. Il s'agit du délai recommandé par
pour l'affichage des messages d'erreur. L'API [`XR8.XrDevice()`](/legacy/api/xrdevice)
peut aider à déterminer le type de message d'erreur à afficher.

## Exemple {#example}

```javascript
let scene = this.el.sceneEl
  scene.addEventListener('realityerror', (event) => {
    if (XR8.XrDevice.isDeviceBrowserCompatible()) {
      // Le navigateur est compatible. Imprimez l'exception pour plus d'informations.
      console.log(event.detail.error)
      return
    }

    // Le navigateur n'est pas compatible. Vérifiez les raisons pour lesquelles il peut ne pas l'être.
    for (let reason of XR8.XrDevice.incompatibleReasons()) {
      // Traitez chaque XR8.XrDevice.IncompatibilityReasons
    }.
  })
```
