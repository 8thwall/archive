---
sidebar_label: runPostRender()
---

# XR8.runPostRender()

`XR8.runPostRender()`

## Description {#description}

Exécute toutes les mises à jour du cycle de vie qui doivent avoir lieu après le rendu.

**IMPORTANT** : Assurez-vous que [`onStart`](/legacy/api/camerapipelinemodule/onstart) a été appelé avant d'appeler `XR8.runPreRender()` / `XR8.runPostRender()`.

## Paramètres {#parameters}

Aucun

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
// Mettre en œuvre la méthode tock() des composants A-Frame
function tock() {
  // Vérifier si XR est initialisé
  ...
  // Exécuter les méthodes du cycle de vie du XR
  XR8.runPostRender()
}
```
