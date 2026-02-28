---
sidebar_label: pipelineModule()
---

# XR8.Threejs.pipelineModule()

`XR8.Threejs.pipelineModule()`

## Description {#description}

Un module de pipeline qui s'interface avec l'environnement et le cycle three.js. La scène three.js peut être interrogée à l'aide de [`XR8.Threejs.xrScene()`](xrscene.md) après que [`XR8.Threejs.pipelineModule()`](pipelinemodule.md)la méthode[`de`](/api/camerapipelinemodule/onstart) onStart soit appelée. La configuration peut être effectuée dans la méthode [`onStart`](/api/camerapipelinemodule/onstart) d'un autre module de pipeline en se référant à [`XR8.Threejs.xrScene()`](xrscene.md) à condition que [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule) soit appelé sur le second module *après* avoir appelé `XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())`.

* [`onStart`](/api/camerapipelinemodule/onstart), un moteur de rendu et une scène three.js sont créés et configurés pour dessiner sur le flux d'une caméra.
* [`onUpdate`](/api/camerapipelinemodule/onupdate), la caméra three.js est pilotée par les mouvements du téléphone.
* [`onRender`](/api/camerapipelinemodule/onrender), la méthode `render()` du moteur de rendu est invoquée.

Notez que ce module ne dessine pas le flux de la caméra sur le canevas, GlTextureRenderer s'en charge. Pour ajouter un flux de caméra en arrière-plan, installez le module [`XR8.GlTextureRenderer.pipelineModule()`](/api/gltexturerenderer/pipelinemodule) avant d'installer ce module (afin qu'il soit rendu avant que la scène ne soit dessinée).

## Paramètres {#parameters}

Aucun

## Retours {#returns}

Un module de pipeline three.js qui peut être ajouté via [`XR8.addCameraPipelineModule()`](/api/xr8/addcamerapipelinemodule).

## Exemple {#example}

```javascript
// Ajoutez XrController.pipelineModule(), qui permet l'estimation du mouvement de la caméra 6DoF.
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())

// Ajoutez un GlTextureRenderer qui dessine le flux de la caméra sur le support.
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Ajoutez Threejs.pipelineModule() qui crée une scène, une caméra et un moteur de rendu three.js, et
// pilote la caméra de la scène en fonction du mouvement de la caméra 6DoF.
XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())

// Ajoutez une logique personnalisée à la boucle de la caméra. Cela se fait à l'aide de modules de pipeline de caméra qui fournissent
// une logique pour les moments clés du cycle pour le traitement de chaque image. Dans ce cas, nous allons
// ajouter la logique onStart pour l'initialisation de la scène, et la logique onUpdate pour les mises à jour de la scène.
XR8.addCameraPipelineModule({
  // Les modules de pipeline de caméra ont besoin d'un nom. Il peut être ce que vous voulez mais doit être unique
  // dans votre application.
  name : 'myawesomeapp',

  // onStart est appelé une fois lorsque le flux de la caméra commence. Dans ce cas, nous devons attendre que la scène
  // XR8.Threejs soit prête avant de pouvoir y accéder pour ajouter du contenu.
  onStart : ({canvasWidth, canvasHeight}) => {
    // Récupère la scène three.js. Il a été créé par XR8.Threejs.pipelineModule().onStart(). La
    // raison pour laquelle nous pouvons y accéder maintenant est que 'myawesomeapp' a été installé après
    // XR8.Threejs.pipelineModule().
    const {scene, camera} = XR8.Threejs.xrScene()

    // Ajoutez quelques objets à la scène et définissez la position initiale de la caméra.
    initScene({scene, camera})

    // Synchronisez la position 6DoF du contrôleur xr et les paramètres de la caméra avec notre scène.
    XR8.XrController.updateCameraProjectionMatrix({
      origin : camera.position,
      facing : camera.quaternion,
    })
  },

  // onUpdate est appelé une fois par boucle de caméra avant le rendu. Toute scène géométrique three.js
  // se déroulerait typiquement ici.
  onUpdate : () => {
    // Mettre à jour la position des objets dans la scène, etc.
    updateScene(XR8.Threejs.xrScene())
  },
})
```
