---
sidebar_label: create()
---

# XR8.GlTextureRenderer.create()

`XR8.GlTextureRenderer.create({ GLctx, vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })`

## Beschreibung {#description}

Erzeugt ein Objekt zum Rendern von einer Textur auf eine Leinwand oder eine andere Textur.

## Parameter {#parameters}

| Parameter                  | Typ                                                                            | Standard                  | Beschreibung                                                                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| GLctx                      | `WebGlRenderingContext` oder `WebGl2RenderingContext`                          |                           | Der `WebGlRenderingContext` (oder `WebGl2RenderingContext`), der für das Rendering verwendet werden soll. Wenn keine `toTexture` angegeben ist, wird der Inhalt auf die Leinwand dieses Kontexts gezeichnet. |
| vertexSource [Optional]    | `String`                                                                       | Ein No-Op-Vertex-Shader   | Die Vertex-Shader-Quelle, die für das Rendering verwendet wird.                                                                                                                                              |
| fragmentSource [Optional]  | `String`                                                                       | Ein No-Op-Fragment-Shader | Die Fragment-Shader-Quelle, die für das Rendering verwendet wird.                                                                                                                                            |
| toTexture [Optional]       | [`WebGlTextur`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | `GLctx`'s Leinwand        | Eine Textur zum Zeichnen. Wenn keine Textur angegeben wird, wird auf die Leinwand gezeichnet.                                                                                                                |
| flipY [Optional]           | `Boolesche`                                                                    | `false`                   | Wenn ja, wird die Darstellung auf den Kopf gestellt.                                                                                                                                                         |
| mirroredDisplay [Optional] | `Boolesche`                                                                    | `false`                   | Wenn wahr, wird die Darstellung von links nach rechts gespiegelt.                                                                                                                                            |

## Returns {#returns}

Gibt ein Objekt zurück: `{render, destroy, shader}`

| Eigentum                            | Beschreibung                                                                                                                                                                                                                                                           |
| ----------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| render({ renderTexture, viewport }) | Eine Funktion, die die RenderTextur für das angegebene Ansichtsfenster rendert. Je nachdem, ob `toTexture` angegeben wird, befindet sich das Ansichtsfenster entweder auf der Leinwand, die `GLctx` erstellt hat, oder es ist relativ zu der angegebenen Rendertextur. |
| destroy                             | Bereinigen Sie Ressourcen, die mit diesem `GlTextureRenderer` verbunden sind.                                                                                                                                                                                          |
| shader                              | Ruft ein Handle auf den Shader ab, der zum Zeichnen der Textur verwendet wird.                                                                                                                                                                                         |

Die Funktion `render` hat die folgenden Parameter:

| Parameter     | Beschreibung                                                                                                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderTexture | Eine [`WebGlTexture`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) (Quelle) zum Zeichnen.                                                                                           |
| viewport      | Der Bereich der Leinwand oder der Ausgabetextur, in den gezeichnet werden soll; dieser kann manuell oder mit [`XR8.GlTextureRenderer.fillTextureViewport()`](filltextureviewport.md) erstellt werden. |

Das Ansichtsfenster wird durch `{ width, height, offsetX, offsetY }` festgelegt:

| Eigentum           | Typ      | Beschreibung                                                             |
| ------------------ | -------- | ------------------------------------------------------------------------ |
| width              | `Nummer` | Die Breite (in Pixel), die gezeichnet werden soll.                       |
| height             | `Nummer` | Die Höhe (in Pixel), die gezeichnet werden soll.                         |
| offsetX [Optional] | `Nummer` | Die minimale x-Koordinate (in Pixel), bis zu der gezeichnet werden soll. |
| offsetY [Optional] | `Nummer` | Die minimale y-Koordinate (in Pixel), bis zu der gezeichnet werden soll. |
