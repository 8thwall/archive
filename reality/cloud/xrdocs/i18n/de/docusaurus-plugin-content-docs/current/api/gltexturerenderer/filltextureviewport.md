---
sidebar_label: fillTextureViewport()
---

# XR8.GlTextureRenderer.fillTextureViewport()

`XR8.GlTextureRenderer.fillTextureViewport(srcWidth, srcHeight, destWidth, destHeight)`

## Beschreibung {#description}

Komfortable Methode, um eine Ansichtsfenster-Struktur zu erhalten, die eine Textur oder Leinwand aus einer Quelle ohne Verzerrung füllt. Dies wird an die Render-Methode des Objekts übergeben, das von [`XR8.GlTextureRenderer.create() erstellt wurde`](create.md)

## Parameter {#parameters}

| Parameter  | Typ      | Beschreibung                            |
| ---------- | -------- | --------------------------------------- |
| scrWidth   | `Nummer` | Die Breite der Textur, die Sie rendern. |
| srcHeight  | `Nummer` | Die Höhe der Textur, die Sie rendern.   |
| destWidth  | `Nummer` | Die Breite des Renderziels.             |
| destHeight | `Nummer` | Die Höhe des Renderziels.               |

## Returns {#returns}

Ein Objekt: `{ width, height, offsetX, offsetY }`

| Eigentum | Typ      | Beschreibung                                                             |
| -------- | -------- | ------------------------------------------------------------------------ |
| width    | `Nummer` | Die Breite (in Pixel), die gezeichnet werden soll.                       |
| height   | `Nummer` | Die Höhe (in Pixel), die gezeichnet werden soll.                         |
| offsetX  | `Nummer` | Die minimale x-Koordinate (in Pixel), bis zu der gezeichnet werden soll. |
| offsetY  | `Nummer` | Die minimale y-Koordinate (in Pixel), bis zu der gezeichnet werden soll. |
