---
sidebar_label: configure()
---

# XR8.CanvasScreenshot.configure()

`XR8.CanvasScreenshot.configure({ maxDimension, jpgCompression })`

## Descripción {#description}

Configura el resultado esperado de las capturas de pantalla del lienzo.

## Parámetros {#parameters}

| Parámetro                  | Por defecto | Descripción                                                                                                                          |
| -------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| maxDimension: [Opcional]   | `1280`      | El valor de la mayor dimensión esperada.                                                                                             |
| jpgCompression: [Optional] | `75`        | valor de 1 a 100 que representa la calidad de compresión JPEG. 100 es poca o ninguna pérdida, y 1 es una imagen de muy baja calidad. |

## Vuelta {#returns}

Ninguno

## Ejemplo {#example}

```javascript
XR8.CanvasScreenshot.configure({ maxDimension: 640, jpgCompression: 50 })
```
