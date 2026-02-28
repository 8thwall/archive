---
sidebar_label: pipelineModule()
---

# XR8.GlTextureRenderer.pipelineModule()

`XR8.GlTextureRenderer.pipelineModule({ vertexSource, fragmentSource, toTexture, flipY })`

## Beschreibung {#description}

Erstellt ein Pipelinemodul, das den Kamerafeed auf die Leinwand zeichnet.

## Parameter {#parameters}

| Parameter                                                                     | Typ                                                                          | Standard                  | Beschreibung                                                                                                                  |
| ----------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| vertexSource [Optional]   | `String`                                                                     | Ein No-Op-Vertex-Shader   | Die Vertex-Shader-Quelle, die für das Rendering verwendet wird.                                               |
| fragmentSource [Optional] | `String`                                                                     | Ein No-op-Fragment-Shader | Die Fragment-Shader-Quelle, die für das Rendering verwendet wird.                                             |
| toTexture [Optional]      | [WebGlTextur](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | Die Leinwand              | Eine Textur zum Zeichnen. Wenn keine Textur angegeben wird, wird auf die Leinwand gezeichnet. |
| flipY [Fakultativ]        | `Boolean`                                                                    | false                     | Wenn ja, wird das Rendering auf den Kopf gestellt.                                                            |

## Rückgabe {#returns}

Rückgabewert ist ein Objekt `{viewport, shader}`, das
[`onProcessCpu`](/legacy/api/camerapipelinemodule/onprocesscpu) und
[`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) als zur Verfügung gestellt wird:

processGpuResult.gltexturerenderer" mit den folgenden Eigenschaften:

| Eigentum        | Typ                                | Beschreibung                                                                                                                                                                                                          |
| --------------- | ---------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Ansichtsfenster | `{Breite, Höhe, offsetX, offsetY}` | Der Bereich der Leinwand oder der Ausgabetextur, in den gezeichnet werden soll; dieser kann manuell oder mit [`XR8.GlTextureRenderer.fillTextureViewport()`](filltextureviewport.md) erstellt werden. |
| Shader          |                                    | Ein Handle auf den Shader, der zum Zeichnen der Textur verwendet wird.                                                                                                                                |

processGpuResult.gltexturerenderer.viewport: `{ Breite, Höhe, offsetX, offsetY }`

| Eigentum | Typ    | Beschreibung                                                                                                 |
| -------- | ------ | ------------------------------------------------------------------------------------------------------------ |
| Breite   | Nummer | Die Breite (in Pixel), die gezeichnet werden soll.                        |
| Höhe     | Nummer | Die Höhe (in Pixel), die gezeichnet werden soll.                          |
| offsetX  | Nummer | Die minimale x-Koordinate (in Pixeln), bis zu der gezeichnet werden soll. |
| offsetY  | Nummer | Die minimale y-Koordinate (in Pixel), bis zu der gezeichnet werden soll.  |

## Beispiel {#example}

```javascript
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onProcessCpu: ({ processGpuResult }) => {
    const {viewport, shader} = processGpuResult.gltexturerenderer
    if (!viewport) {
      return
    }
    const { width, height, offsetX, offsetY } = viewport

    // ...
  },
```
