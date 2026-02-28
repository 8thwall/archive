# onRender()

`onRender: ()`

## 説明 {#description}

`onRender()`は、[`onUpdate`](onupdate.md)の後に呼び出されます。 これはレンダリングエンジンがWebGLの描画コマンドを発行する時間です。 アプリケーションが独自のランループを提供し、[`XR8.runPreRender()`](/api/engine/xr8/runprerender)と[`XR8.runPostRender()`](/api/engine/xr8/runprerender)に依存している場合、このメソッドは呼び出されず、すべてのレンダリングは外部のランループによって調整されなければなりません。

## パラメータ {#parameters}

なし

## 例 {#example}

```javascript
XR8.addCameraPipelineModule({
  name: 'mycamerapipelinemodule',
  onRender: () => {
    // これは既にXR8.Threejs.pipelineModule()によって実行されていますが、説明のためにここで提供します。
    XR8.Threejs.xrScene().renderer.render()
  },
})
```
