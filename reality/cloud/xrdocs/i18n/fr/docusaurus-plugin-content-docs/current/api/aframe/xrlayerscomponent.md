---
sidebar_label: xrlayersComponent()
---

# XR8.AFrame.xrlayersComponent()

`XR8.AFrame.xrlayersComponent()`

## Description {#description}

Crée un composant A-Frame qui peut être enregistré avec `AFRAME.registerComponent()`. Cependant, n'a généralement pas besoin d'être appelé directement. Lors du chargement du script Web 8th Wall, ce composant sera enregistré automatiquement s'il est détecté que A-Frame a été chargé (c'est-à-dire si `window.AFRAME` existe).

## Paramètres {#parameters}

Aucun

## Exemple {#example}

```javascript
window.AFRAME.registerComponent('xrlayers', XR8.AFrame.xrlayersComponent())
```
