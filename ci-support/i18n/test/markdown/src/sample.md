# H1
## H2
### H3

**bold text**

*italicized text*

> blockquote

1. First item
2. 2nd item
3. 3rd item

- 1st item
- 2nd item
- 3rd item
- 4th item

### XR8.GlTextureRenderer.setGLctxParameters()

`XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)`

**Description**

Restores the WebGL bindings that were saved with [getGLctxParameters](#xr8gltexturerenderergetglctxparameters).

**Parameters**

Parameter | Description
--------- | -----------
GLctx | The WebGLRenderingContext or WebGL2RenderingContext to restore bindings on.
restoreParams | The output of [getGLctxParameters](#xr8gltexturerenderergetglctxparameters).

#### Example

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Alter context parameters as needed
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Context parameters are restored to their previous state
```

[title](https://www.example.com)

~~The world is flat.~~

# Hello!

This is a demo for Show & Tell on March 16 2023.
