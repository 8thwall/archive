---
sidebar_label: 実行()
---

# XR8.PlayCanvas.run()

`XR8.PlayCanvas.run( {pcCamera, pcApp}, [extraModules], config )`.

## 説明 {#description}

指定したパイプラインモジュールを追加し、カメラを開きます。

## パラメータ {#parameters}

| パラメータ                                          | タイプ                                                                                     | 説明                                                                                                             |
| ---------------------------------------------- | --------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| pcCamera                                       | [`pc.CameraComponent`](https://developer.playcanvas.com/en/api/pc.CameraComponent.html) | ARでドライブするPlayCanvasシーンカメラ。                                                                                     |
| pcApp                                          | [`pc.Application`](https://developer.playcanvas.com/en/api/pc.Application.html)         | PlayCanvas アプリ、通常は `this.app`。                                                                                 |
| extraModules [オプション］ | オブジェクト                                                                                  | インストールする追加パイプラインモジュールの配列（オプション）。                                                                               |
| コンフィグ                                          | canvas、webgl2、ownRunLoop、cameraConfig、glContextConfig、allowedDevices、layers}\\`。       | XR8.run()`](/legacy/api/xr8/run)に渡す設定パラメータと、PlayCanvas固有の設定（`layers\\`など）。 |

config\\`は以下のプロパティを持つオブジェクトである：

| プロパティ                                                                        | タイプ                                                                                         | デフォルト                                                                                                | 説明                                                                                                                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| キャンバス                                                                        | [HTMLCanvasElement\\`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement) |                                                                                                      | カメラフィードが描画されるHTMLキャンバス。 カメラフィードが描画されるHTMLキャンバス。 通常、これは `document.getElementById('application-canvas')` です。 カメラフィードが描画されるHTMLキャンバス。 通常、これは `document.getElementById('application-canvas')` です。                                                                                                                                              |
| webgl2 [オプション］                                     | ブーリアン                                                                                       | false\\`                                                                                            | trueの場合、WebGL2が利用可能であればWebGL2を使用し、そうでなければWebGL1にフォールバックします。  false の場合、常に WebGL1 を使用します。  trueの場合、WebGL2が利用可能であればWebGL2を使用し、そうでなければWebGL1にフォールバックします。  false の場合、常に WebGL1 を使用します。  false の場合、常に WebGL1 を使用します。                                                                                                                            |
| ownRunLoop [オプション］                                 | ブーリアン                                                                                       | false\\`                                                                                            | もしtrueなら、XRはそれ自身のランループを使うはずだ。  もしtrueなら、XRはそれ自身のランループを使うはずだ。  falseの場合、実行ループを自分で用意し、[`XR8.runPreRender()`](/legacy/api/xr8/runprerender)と[`XR8.runPostRender()`](/legacy/api/xr8/runpostrender)を自分で呼び出す必要があります。                                                                                                                            |
| cameraConfig： {direction} [オプション］                  | オブジェクト                                                                                      | `{direction：XR8.XrConfig.camera().BACK}`。                                                            | 使用したいカメラ 使用したいカメラ 使用可能な`direction`の値は`XR8.XrConfig.camera().BACK`または`XR8.XrConfig.camera().FRONT`です。                                                                                                                                                                                                                                       |
| glContextConfig [オプション]。 | WebGLContextAttributes\\`。                                                                 | null\\`。                                                                                            | WebGL canvas コンテキストを設定する属性。                                                                                                                                                                                                                                                                                                                |
| allowedDevices [オプション］                             | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device)                                      | XR8.XrConfig.device().MOBILE\\`。 | パイプラインを実行するデバイスのクラスを指定する。  現在のデバイスがそのクラスでない場合、カメラを開く前に実行が失敗します。 allowedDevicesが`XR8.XrConfig.device().ANY`の場合、常にカメラを開きます。 ワールドトラッキングは`XR8.XrConfig.device().MOBILE`でのみ使用できることに注意してください。                                                                                                                                                    |
| レイヤー [オプション］                                       | `[]`                                                                                        | `[]`                                                                                                 | GlTextureRenderer`を使って描画するレイヤーのリストを指定する。 GlTextureRenderer`を使って描画するレイヤーのリストを指定する。 キーは8th Wallのレイヤー名で、値は8th Wallレイヤーを使用してテクスチャとマスクにレンダリングするPlayCanvasレイヤー名のリストです。 値の例: `{"sky"：["FirstSkyLayer", "SecondSkyLayer"]}\`. 値の例: `{"sky"：["FirstSkyLayer", "SecondSkyLayer"]}`. |

## {#returns}を返す。

なし

## 例 {#example}

```javascript
var layerscontroller = pc.createScript('layerscontroller')

layerscontroller.prototype.initialize = function() {
  // XRが完全にロードされた後、カメラフィードを開き、AR表示を開始する。
  const runOnLoad = ({pcCamera, pcApp}, extramodules) => () => {
    // キャンバス名を渡す。
    const config = {
      canvas: document.getElementById('application-canvas'),
      layers：{"sky"：[空"]}。
    }
    XR8.PlayCanvas.run({pcCamera, pcApp}, extraModules, config)
  } // PlayCanvas内のカメラを検索します。


  //
  const pcCamera = XRExtras.PlayCanvas.findOneCamera(this.entity)

  // XRがまだロードしている間に、役に立つものを表示します。
  // もうすぐです：ユーザーの環境が Web ar をサポートできるかどうかを検出し、サポートしていない場合は
  // エクスペリエンスを表示する方法のヒントを表示します。
  // 読み込み中: カメラの許可を求めるプロンプトを表示し、表示の準備が整うまでシーンを隠します。
  // ランタイムエラー：予期しないことが発生した場合、エラー画面を表示します。
  XRExtras.Loading.showLoading({onxrloaded: runOnLoad({pcCamera, pcApp: this.app}, [
    // 開発者がカスタマイズまたはテーマ化したいオプションモジュール。
    XRExtras.AlmostThere.pipelineModule(), // サポートされていないブラウザを検出し、ヒントを与えます。
    XRExtras.Loading.pipelineModule(), // 起動時のローディング画面を管理します。
    XRExtras.RuntimeError.pipelineModule(), // ランタイムエラー時にエラー画像を表示する。
    XR8.LayersController.pipelineModule(), // スカイエフェクトのサポートを追加します。
  ])})
}
```
