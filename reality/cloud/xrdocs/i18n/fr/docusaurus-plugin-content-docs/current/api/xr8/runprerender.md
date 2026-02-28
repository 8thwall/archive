---
sidebar_label: runPreRender()
---

# XR8.runPreRender()

`XR8.runPreRender( timestamp )`

## Description {#description}

Exécute toutes les mises à jour du cycle qui doivent avoir lieu avant le rendu.

**IMPORTANT** : Assurez-vous que [`onStart`](/api/camerapipelinemodule/onstart) a été appelé avant d'appeler `XR8.runPreRender()` / `XR8.runPostRender()`.

## Paramètres {#parameters}

| Paramètres | Type     | Description                         |
| ---------- | -------- | ----------------------------------- |
| horodatage | `Nombre` | L'heure actuelle, en millisecondes. |

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
// Implémentation de la méthode tick() du composant A-Frame
function tick() {
  // Vérification de la compatibilité de l'appareil, mise à jour de la géométrie de la vue et affichage du flux de la caméra.
  ...
  // Exécutez les méthodes de cycle de vie XR
  XR8.runPreRender(Date.now())
  }
```
