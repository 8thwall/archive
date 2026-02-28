---
sidebar_label: addCameraPipelineModules()
---

# XR8.addCameraPipelineModules()

`XR8.addCameraPipelineModules([ modules ])`

## Description {#description}

Ajoutez plusieurs modules de pipeline de caméras. Il s'agit d'une méthode pratique qui appelle [`XR8.addCameraPipelineModule()`](addcamerapipelinemodule.md) dans l'ordre sur chaque élément du tableau d'entrée.

## Paramètres {#parameters}

| Paramètres | Type       | Description                                      |
| ---------- | ---------- | ------------------------------------------------ |
| modules    | `[Object]` | Un ensemble de modules de pipeline de la caméra. |

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
const onxrloaded = () => {
  XR8.addCameraPipelineModules([ // Ajoutez les modules du pipeline de la caméra.
    // Modules de pipeline existants.
    XR8.GlTextureRenderer.pipelineModule(), // Dessine le flux de la caméra.
  ])

  // Demandez les autorisations pour la caméra et lancez-la.
  XR8.run({canvas: document.getElementById('camerafeed')})
}

// Attendez que le javascript XR soit chargé avant de faire des appels XR.
fenêtre.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```
