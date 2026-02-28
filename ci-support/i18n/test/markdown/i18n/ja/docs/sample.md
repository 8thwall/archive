# H1
## H2
### H3

**太字のテキスト**

*斜体のテキスト*

> 引用

1. 最初のアイテム
2. 2番目のアイテム
3. 3番目のアイテム

- 1番目のアイテム
- 2番目のアイテム
- 3番目のアイテム
- 4番目のアイテム

### XR8.GlTextureRenderer.setGLctxParameters()

`XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)`

**説明**

[getGLctxParameters](#xr8gltexturerenderergetglctxparameters)で保存されたWebGLバインディングを復元します。

**パラメータ**

パラメータ | 説明
--------- | -----------
GLctx | バインディングを復元するWebGLRenderingContextまたはWebGL2RenderingContext。
restoreParams | [getGLctxParameters](#xr8gltexturerenderergetglctxparameters)の出力。

#### 例

```javascript
const restoreParams = XR8.GlTextureRenderer.getGLctxParameters(GLctx, [GLctx.TEXTURE0])
// 必要に応じてコンテキストパラメータを変更する
...
XR8.GlTextureRenderer.setGLctxParameters(GLctx, restoreParams)
// コンテキストパラメータが以前の状態に復元される
```

[タイトル](https://www.example.com)

~~世界は平らです。~~

# こんにちは！

これは2023年3月16日のShow＆Tellのデモです。