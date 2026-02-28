---
sidebar_label: ThreejsRenderer() (obsolète)
---

# XR8.ThreejsRenderer() (obsolète)

`XR8.ThreejsRenderer()`

## Description {#description}

Renvoie un moteur de rendu basé sur three.js.  Il est chargé de piloter la caméra de la scène, de faire correspondre le champ de vision de la caméra au champ de vision de l'AR et d'appeler "render" dans la boucle d'exécution de la caméra.

Si vous utilisez three.js, ajoutez ceci en tant que module de pipeline de caméra pour créer la scène three.js, la caméra, le moteur de rendu et piloter la caméra de la scène en fonction du mouvement de la caméra 6DoF.

## Paramètres {#parameters}

Aucun

## Exemple {#example}

```javascript
window.onload = () => {
  // xr3js possède la scène three.js, la caméra et le moteur de rendu. Il est chargé de piloter la caméra de la scène,
  // de faire correspondre le champ de vision de la caméra au champ de vision de l'AR, et d'appeler "render" dans la boucle d'exécution de la caméra
  //.
  const xr3js = XR8.ThreejsRenderer()

  // Le contrôleur XR fournit un suivi de caméra 6DoF et des interfaces pour configurer le suivi.
  const xrController = XR8.xrController()

  // ...

  // Ajoutez le module xrController, qui permet l'estimation du mouvement de la caméra 6DoF.
  XR8.addCameraPipelineModule(xrController.cameraPipelineModule())

  // Ajoutez un GLRenderer qui dessine le flux de la caméra sur le support.
  XR8.addCameraPipelineModule(XR8.GLRenderer())

  // Ajoutez xr3js qui crée une scène, une caméra et un moteur de rendu threejs, et pilote la caméra de la scène
  // en fonction du mouvement de la caméra 6DoF.
  XR8.addCameraPipelineModule(xr3js)

  // ...
}
```
