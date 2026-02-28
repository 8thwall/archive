---
sidebar_label: runPostRender()
---

# XR8.runPostRender()

`XR8.runPostRender()`

## Description {#description}

Exécute toutes les mises à jour du cycle qui doivent avoir lieu après le rendu.

**IMPORTANT** : Assurez-vous que [`onStart`](/api/camerapipelinemodule/onstart) a été appelé avant d'appeler `XR8.runPreRender()` / `XR8.runPostRender()`.

## Paramètres {#parameters}

Aucun

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
// Implémenter la méthode tock() des composants A-Frame
function tock() {
  // Vérifier si XR est initialisé
  ...
  // Exécutez les méthodes du cycle de vie XR
  XR8.runPostRender()
}
```
