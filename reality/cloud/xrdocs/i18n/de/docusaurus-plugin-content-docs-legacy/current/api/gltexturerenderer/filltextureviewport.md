---
sidebar_label: fillTextureViewport()
---

# XR8.GlTextureRenderer.fillTextureViewport()

`XR8.GlTextureRenderer.fillTextureViewport(srcWidth, srcHeight, destWidth, destHeight)`

## Beschreibung {#description}

Convenience-Methode, um eine Viewport-Struktur zu erhalten, die eine Textur oder Leinwand aus einer Quelle
ohne Verzerrung füllt. Diese wird an die Render-Methode des Objekts übergeben, das von
[`XR8.GlTextureRenderer.create()`](create.md) erstellt wurde.

## Parameter {#parameters}

| Parameter | Typ    | Beschreibung                                            |
| --------- | ------ | ------------------------------------------------------- |
| srcBreite | Nummer | Die Breite der Textur, die Sie rendern. |
| srcHöhe   | Nummer | Die Höhe der Textur, die Sie rendern.   |
| destWidth | Nummer | Die Breite des Rendering-Ziels.         |
| destHöhe  | Nummer | Die Höhe des Renderziels.               |

## Rückgabe {#returns}

Ein Objekt: "{ Breite, Höhe, offsetX, offsetY }".

| Eigentum | Typ    | Beschreibung                                                                                                 |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| Breite   | Nummer | Die Breite (in Pixel), die gezeichnet werden soll.                        |
| Höhe     | Nummer | Die Höhe (in Pixel), die gezeichnet werden soll.                          |
| offsetX  | Nummer | Die minimale x-Koordinate (in Pixeln), bis zu der gezeichnet werden soll. |
| offsetY  | Nummer | Die minimale y-Koordinate (in Pixel), bis zu der gezeichnet werden soll.  |
