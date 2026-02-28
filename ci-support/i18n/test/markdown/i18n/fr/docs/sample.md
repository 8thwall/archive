# H1
## H2
### H3

**texte en gras**

*texte en italique*

> citation

1. Premier élément
2. 2ème élément
3. 3ème élément

- 1er élément
- 2ème élément
- 3ème élément
- 4ème élément

### XR8.GlTextureRenderer.setGLctxParameters()

`XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)`

**Description**

Restaure les liaisons WebGL qui ont été sauvegardées avec [getGLctxParameters](#xr8gltexturerenderergetglctxparameters).

**Paramètres**

Paramètre | Description
--------- | -----------
GLctx | Le WebGLRenderingContext ou WebGL2RenderingContext sur lequel restaurer les liaisons.
restoreParams | La sortie de [getGLctxParameters](#xr8gltexturerenderergetglctxparameters).

#### Exemple

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// Modifier les paramètres du contexte si nécessaire
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// Les paramètres du contexte sont restaurés à leur état précédent
```

[titre](https://www.example.com)

~~Le monde est plat.~~

# Bonjour!

Ceci est une démo pour Show & Tell le 16 mars 2023.