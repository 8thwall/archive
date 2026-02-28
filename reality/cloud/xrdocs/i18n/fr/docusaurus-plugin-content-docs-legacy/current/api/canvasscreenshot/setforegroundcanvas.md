---
sidebar_label: setForegroundCanvas()
---

# XR8.CanvasScreenshot.setForegroundCanvas()

`XR8.CanvasScreenshot.setForegroundCanvas(canvas)`

## Description {#description}

Définit un canevas d'avant-plan à afficher au-dessus du canevas de la caméra. Les dimensions doivent être identiques à celles de la toile de l'appareil photo.

Nécessaire uniquement si vous utilisez des toiles séparées pour le flux de la caméra et les objets virtuels.

## Paramètres {#parameters}

| Paramètres | Description                                                    |
| ---------- | -------------------------------------------------------------- |
| toile      | La toile à utiliser comme premier plan dans la capture d'écran |

## Retourne {#returns}

Aucun

## Exemple {#example}

```javascript
const myOtherCanvas = document.getElementById('canvas2')
XR8.CanvasScreenshot.setForegroundCanvas(myOtherCanvas)
```
