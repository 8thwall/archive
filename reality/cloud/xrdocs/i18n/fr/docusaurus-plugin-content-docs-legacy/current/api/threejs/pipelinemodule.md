---
sidebar_label: pipelineModule()
---

# XR8.Threejs.pipelineModule()

`XR8.Threejs.pipelineModule()`

## Description {#description}

Un module de pipeline qui s'interface avec l'environnement et le style de vie de three.js. La scène three.js peut être interrogée en utilisant [`XR8.Threejs.xrScene()`](xrscene.md) après que la méthode [\`\`onStart`](/legacy/api/camerapipelinemodule/onstart) de [`XR8.Threejs.pipelineModule()`](pipelinemodule.md) ait été appelée. La configuration peut être faite dans la méthode [`onStart`](/legacy/api/camerapipelinemodule/onstart) d'un autre module de pipeline en se référant à [`XR8.Threejs.xrScene()`](xrscene.md) tant que [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule) est appelé sur le second module *après* avoir appelé `XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())\\`.

- [`onStart`](/legacy/api/camerapipelinemodule/onstart), un moteur de rendu et une scène three.js sont créés et configurés pour dessiner sur un flux de caméra.
- [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate), la caméra three.js est pilotée par les mouvements du téléphone.
- [`onRender`](/legacy/api/camerapipelinemodule/onrender), la méthode `render()` du moteur de rendu est invoquée.

Notez que ce module ne dessine pas le flux de la caméra sur le canevas, GlTextureRenderer s'en charge
. Pour ajouter un flux de caméra en arrière-plan, installez le module
[`XR8.GlTextureRenderer.pipelineModule()`](/legacy/api/gltexturerenderer/pipelinemodule) avant d'installer ce module
(afin qu'il soit rendu avant que la scène ne soit dessinée).

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

Un module de pipeline three.js qui peut être ajouté via [`XR8.addCameraPipelineModule()`](/legacy/api/xr8/addcamerapipelinemodule).

## Exemple {#example}

```javascript
// Ajouter XrController.pipelineModule(), qui permet l'estimation du mouvement de la caméra 6DoF.
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())

// Ajoutez un GlTextureRenderer qui dessine le flux de la caméra sur le canevas.
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Ajoutez Threejs.pipelineModule() qui crée une scène, une caméra et un moteur de rendu three.js, et
// pilote la caméra de la scène en fonction du mouvement de la caméra 6DoF.
XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())

// Ajoutez une logique personnalisée à la boucle de la caméra. Ceci est fait avec des modules de pipeline de caméra qui fournissent
// de la logique pour les moments clés du cycle de vie pour le traitement de chaque image de la caméra. Dans ce cas, nous allons
// ajouter la logique onStart pour l'initialisation de la scène, et la logique onUpdate pour les mises à jour de la scène.
XR8.addCameraPipelineModule({
  // Les modules de pipeline de caméra ont besoin d'un nom. Il peut être ce que vous voulez mais doit être unique
  // dans votre application.
  name : 'myawesomeapp',

  // onStart est appelé une fois lorsque le flux de la caméra commence. Dans ce cas, nous devons attendre que la scène
  // XR8.Threejs soit prête avant de pouvoir y accéder pour ajouter du contenu.
  onStart : ({canvasWidth, canvasHeight}) => {
    // Obtenir la scène three.js. Elle a été créée par XR8.Threejs.pipelineModule().onStart(). La
    // raison pour laquelle nous pouvons y accéder maintenant est que 'myawesomeapp' a été installée après
    // XR8.Threejs.pipelineModule().
    const {scene, camera} = XR8.Threejs.xrScene()

    // Ajoutez quelques objets à la scène et définissez la position de départ de la caméra.
    initScene({scene, camera})

    // Synchronisez la position 6DoF du contrôleur xr et les paramètres de la caméra avec notre scène.
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  },

  // onUpdate est appelé une fois par boucle de caméra avant le rendu. Toute scène géométrique three.js
  // se produit typiquement ici.
  onUpdate : () => {
    // Mise à jour de la position des objets dans la scène, etc.
    updateScene(XR8.Threejs.xrScene())
  },
})
```
