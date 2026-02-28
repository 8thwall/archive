---
sidebar_label: pipelineModule()
---

# XR8.Threejs.pipelineModule()

`XR8.Threejs.pipelineModule()`

## 説明 {#description}

three.jsの環境とライフサイクルとのインターフェイスとなるパイプラインモジュール。 three.jsの環境とライフサイクルとのインターフェイスとなるパイプラインモジュール。 three.jsのシーンは、[`XR8.Threejs.pipelineModule()`](pipelinemodule.md)の[`onStart`](/legacy/api/camerapipelinemodule/onstart)メソッドがコールされた後に、[`XR8.Threejs.xrScene()`](xrscene.md)を使用してクエリすることができます。 XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())`](/legacy/api/xr8/addcamerapipelinemodule) を呼び出した後であれば、[`XR8.Threejs.xrScene()`](xrscene.md) を参照して、別のパイプラインモジュールの [`onStart\`](/legacy/api/camerapipelinemodule/onstart) メソッドでセットアップを行うことができます。 three.jsの環境とライフサイクルとのインターフェイスとなるパイプラインモジュール。 three.jsの環境とライフサイクルとのインターフェイスとなるパイプラインモジュール。 three.jsのシーンは、[`XR8.Threejs.pipelineModule()`](pipelinemodule.md)の[`onStart`](/legacy/api/camerapipelinemodule/onstart)メソッドがコールされた後に、[`XR8.Threejs.xrScene()`](xrscene.md)を使用してクエリすることができます。 XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())`](/legacy/api/xr8/addcamerapipelinemodule) を呼び出した後であれば、[`XR8.Threejs.xrScene()`](xrscene.md) を参照して、別のパイプラインモジュールの [`onStart\`](/legacy/api/camerapipelinemodule/onstart) メソッドでセットアップを行うことができます。 XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())`](/legacy/api/xr8/addcamerapipelinemodule) を呼び出した後であれば、[`XR8.Threejs.xrScene()`](xrscene.md) を参照して、別のパイプラインモジュールの [`onStart\`](/legacy/api/camerapipelinemodule/onstart) メソッドでセットアップを行うことができます。

- [`onStart`](/legacy/api/camerapipelinemodule/onstart), three.js レンダラーとシーンが作成され、カメラフィード上に描画するように設定される。
- [`onUpdate`](/legacy/api/camerapipelinemodule/onupdate)、three.jsのカメラは携帯電話の動きで駆動する。
- [`onRender`](/legacy/api/camerapipelinemodule/onrender), レンダラーの `render()` メソッドが呼び出される。

GlTextureRendererは
。 GlTextureRendererは
。 バックグラウンドでカメラフィードを追加するには、この
モジュールをインストールする前に、
[`XR8.GlTextureRenderer.pipelineModule()`](/legacy/api/gltexturerenderer/pipelinemodule)をインストールしてください（シーンが描画される前にレンダリングされるようにします）。

## パラメータ {#parameters}

なし

## {#returns}を返す。

XR8.addCameraPipelineModule()\\`](/legacy/api/xr8/addcamerapipelinemodule)で追加できるthree.jsのパイプラインモジュールです。

## 例 {#example}

```javascript
// XrController.pipelineModule()を追加し、6DoFカメラの動き推定を可能にします。
XR8.addCameraPipelineModule(XR8.XrController.pipelineModule())

// カメラフィードをキャンバスに描画するGlTextureRendererを追加します。
XR8.addCameraPipelineModule(XR8.GlTextureRenderer.pipelineModule())

// Threejs.pipelineModule()を追加します。three.jsシーン、カメラ、レンダラーを作成し、
// 6DoFカメラの動きに基づいてシーンカメラを駆動します。
XR8.addCameraPipelineModule(XR8.Threejs.pipelineModule())

// カメラループにカスタムロジックを追加します。これは、
// 各カメラフレームを処理する重要なライフサイクル瞬間のロジックを提供するカメラパイプラインモジュールで行います。この場合、
// シーンの初期化のための onStart ロジックと、シーンの更新のための onUpdate ロジックを追加します。
XR8.addCameraPipelineModule({
  // カメラパイプラインモジュールには名前が必要です。

  name: 'myawesomeapp',

  // onStartは、カメラフィードが始まるときに一度だけ呼び出されます。

  onStart: ({canvasWidth, canvasHeight}) => {
    // three.jsシーンを取得する。これは、XR8.Threejs.pipelineModule().onStart() によって作成されました。
    // 今ここでアクセスできる理由は、'myawesomeapp' が
    // XR8.Threejs.pipelineModule() の後にインストールされたからです。
    const {scene, camera} = XR8.Threejs.xrScene()

    // いくつかのオブジェクトをシーンに追加し、カメラの開始位置を設定します。
    initScene({scene, camera})

    // xrコントローラーの6DoF位置とカメラのパレメーターをシーンに同期します。
    XR8.XrController.updateCameraProjectionMatrix({
      origin: camera.position,
      facing: camera.quaternion,
    })
  },

  // onUpdateは、レンダリング前にカメラループごとに1回呼び出されます。

  onUpdate: () => {
    // シーン内のオブジェクトの位置などを更新する
    updateScene(XR8.Threejs.xrScene())
  },
})
```
