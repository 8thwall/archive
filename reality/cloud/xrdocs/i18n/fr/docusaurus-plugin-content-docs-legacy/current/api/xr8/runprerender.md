---
sidebar_label: runPreRender()
---

# XR8.runPreRender()

`XR8.runPreRender( timestamp )`

## Description {#description}

Exécute toutes les mises à jour du cycle de vie qui doivent avoir lieu avant le rendu.

**IMPORTANT** : Assurez-vous que [`onStart`](/legacy/api/camerapipelinemodule/onstart) a été appelé avant d'appeler `XR8.runPreRender()` / `XR8.runPostRender()`.

## Paramètres {#parameters}

| Paramètres | Type     | Description                                         |
| ---------- | -------- | --------------------------------------------------- |
| horodatage | `Nombre` | L'heure actuelle, en millisecondes. |

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
// Mise en œuvre de la méthode tick() des composants A-Frame
function tick() {
  // Vérification de la compatibilité de l'appareil et exécution de toutes les mises à jour nécessaires de la géométrie de la vue et dessin de l'alimentation de la caméra.
  ...
  // Exécuter les méthodes du cycle de vie XR
  XR8.runPreRender(Date.now())
}
```
