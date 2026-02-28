---
sidebar_label: setForegroundCanvas()
---

# XR8.CanvasScreenshot.setForegroundCanvas()

`XR8.CanvasScreenshot.setForegroundCanvas(canvas)`

## Description {#description}

Définit un support d'avant-plan à afficher au-dessus du support de la caméra. Les dimensions doivent être identiques à celles du support de l'appareil photo.

Nécessaire uniquement si vous utilisez des supports séparés pour le flux de la caméra et les objets virtuels.

## Paramètres {#parameters}

| Paramètres | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| support    | Le support à utiliser comme premier plan dans la capture d'écran |

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
const myOtherCanvas = document.getElementById('canvas2')
XR8.CanvasScreenshot.setForegroundCanvas(myOtherCanvas)
```
