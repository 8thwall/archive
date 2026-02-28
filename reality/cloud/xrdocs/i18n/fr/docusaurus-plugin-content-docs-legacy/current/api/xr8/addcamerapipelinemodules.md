---
sidebar_label: addCameraPipelineModules()
---

# XR8.addCameraPipelineModules()

`XR8.addCameraPipelineModules([ modules ])`

## Description {#description}

Ajouter plusieurs modules de pipeline de caméras. Il s'agit d'une méthode de commodité qui appelle [`XR8.addCameraPipelineModule()`](addcamerapipelinemodule.md) dans l'ordre sur chaque élément du tableau d'entrée.

## Paramètres {#parameters}

| Paramètres | Type      | Description                                                          |
| ---------- | --------- | -------------------------------------------------------------------- |
| modules    | `[Objet]` | Un ensemble de modules de canalisation de la caméra. |

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
const onxrloaded = () => {
  XR8.addCameraPipelineModules([ // Ajouter des modules de pipeline de caméra.
    // Modules de pipeline existants.
    XR8.GlTextureRenderer.pipelineModule(), // Dessine le flux de la caméra.
  ])

  // Demande les autorisations pour la caméra et lance la caméra.
  XR8.run({canvas : document.getElementById('camerafeed')})
}

// Attendez que le javascript XR soit chargé avant de faire des appels XR.
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```
