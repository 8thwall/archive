---
sidebar_label: erstellen()
---

# XR8.GlTextureRenderer.create()

`XR8.GlTextureRenderer.create({ GLctx, vertexSource, fragmentSource, toTexture, flipY, mirroredDisplay })`

## Beschreibung {#description}

Erzeugt ein Objekt zum Rendern von einer Textur auf eine Leinwand oder eine andere Textur.

## Parameter {#parameters}

| Parameter                                                                      | Typ                                                                          | Standard                  | Beschreibung                                                                                                                                                                                                                                                   |
| ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GLctx                                                                          | WebGlRenderingContext" oder "WebGl2RenderingContext".        |                           | Der `WebGlRenderingContext` (oder `WebGl2RenderingContext`), der für das Rendering verwendet werden soll. Wenn kein "toTexture" angegeben ist, wird der Inhalt auf die Leinwand dieses Kontexts gezeichnet. |
| vertexSource [Optional]    | `String`                                                                     | Ein No-Op-Vertex-Shader   | Die Vertex-Shader-Quelle, die für das Rendering verwendet wird.                                                                                                                                                                                |
| fragmentSource [Optional]  | `String`                                                                     | Ein No-op-Fragment-Shader | Die Fragment-Shader-Quelle, die für das Rendering verwendet wird.                                                                                                                                                                              |
| toTexture [Optional]       | [WebGlTextur](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Leinwand von "GLctx   | Eine Textur zum Zeichnen. Wenn keine Textur angegeben wird, wird auf die Leinwand gezeichnet.                                                                                                                                  |
| flipY [Fakultativ]         | `Boolean`                                                                    | false                     | Wenn ja, wird das Rendering auf den Kopf gestellt.                                                                                                                                                                                             |
| mirroredDisplay [Optional] | `Boolean`                                                                    | false                     | Wenn true, wird das Rendering von links nach rechts gespiegelt.                                                                                                                                                                                |

## Rückgabe {#returns}

Gibt ein Objekt zurück: `{render, destroy, shader}`

| Eigentum                                               | Beschreibung                                                                                                                                                                                                                                                                                               |
| ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| render({ renderTexture, viewport }) | Eine Funktion, die die RenderTextur in das angegebene Ansichtsfenster rendert. Abhängig davon, ob `toTexture` angegeben wurde, befindet sich das Ansichtsfenster entweder auf der Leinwand, die `GLctx` erstellt hat, oder es ist relativ zu der angegebenen Rendertextur. |
| zerstören                                              | Bereinigt die mit diesem `GlTextureRenderer` verbundenen Ressourcen.                                                                                                                                                                                                                       |
| Shader                                                 | Liefert ein Handle auf den Shader, der zum Zeichnen der Textur verwendet wird.                                                                                                                                                                                                             |

Die Funktion "Rendern" hat die folgenden Parameter:

| Parameter       | Beschreibung                                                                                                                                                                                                          |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderTexture   | Eine [WebGlTextur](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) (Quelle) zum Zeichnen.                                                                           |
| Ansichtsfenster | Der Bereich der Leinwand oder der Ausgabetextur, in den gezeichnet werden soll; dieser kann manuell oder mit [`XR8.GlTextureRenderer.fillTextureViewport()`](filltextureviewport.md) erstellt werden. |

Das Ansichtsfenster wird durch `{ width, height, offsetX, offsetY }` angegeben:

| Eigentum                                                                 | Typ    | Beschreibung                                                                                                 |
| ------------------------------------------------------------------------ | ------ | ------------------------------------------------------------------------------------------------------------ |
| Breite                                                                   | Nummer | Die Breite (in Pixel), die gezeichnet werden soll.                        |
| Höhe                                                                     | Nummer | Die Höhe (in Pixel), die gezeichnet werden soll.                          |
| offsetX [Optional]   | Nummer | Die minimale x-Koordinate (in Pixeln), bis zu der gezeichnet werden soll. |
| offsetY [Fakultativ] | Nummer | Die minimale y-Koordinate (in Pixel), bis zu der gezeichnet werden soll.  |
