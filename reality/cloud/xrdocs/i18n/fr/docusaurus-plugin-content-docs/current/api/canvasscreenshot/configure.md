---
sidebar_label: configure()
---

# XR8.CanvasScreenshot.configure()

`XR8.CanvasScreenshot.configure({ maxDimension, jpgCompression })`

## Description {#description}

Configure le résultat attendu des captures d'écran du support.

## Paramètres {#parameters}

| Paramètres                   | Défaut | Description                                                                                                                                                  |
| ---------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| maxDimension : [Facultatif]  | `1280` | La valeur de la plus grande dimension attendue.                                                                                                              |
| jpgCompression : [Optionnel] | `75`   | valeur de 1 à 100 représentant la qualité de la compression JPEG. 100 correspond à une perte minime, voire nulle, et 1 à une image de très mauvaise qualité. |

## Retours {#returns}

Aucun

## Exemple {#example}

```javascript
XR8.CanvasScreenshot.configure({ maxDimension: 640, jpgCompression: 50 })
```
