---
sidebar_label: xrCameraBehavior()
---

# XR8.Babylonjs.xrCameraBehavior()

XR8.Babylonjs.xrCameraBehavior(config、xrConfig)\\`。

## 説明 {#description}

Babylonカメラにアタッチできるビヘイビアを、次のように取得します：camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())\\`のようにします。

## パラメータ {#parameters}

| パラメータ                                      | 説明                                                                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| config [オプション］   | XR8.run()\\`](/legacy/api/xr8/run) に渡す設定パラメータ。 |
| xrConfig [オプション］ | XR8.XrController\\`]に渡す設定パラメータ(/legacy/api/xrcontroller)          |

config\\` [オプション]は以下のプロパティを持つオブジェクトである：

| プロパティ                                                                        | タイプ                                                    | デフォルト                                                                                                | 説明                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [オプション］                                     | ブーリアン                                                  | false\\`                                                                                            | trueの場合、WebGL2が利用可能であればWebGL2を使用し、そうでなければWebGL1にフォールバックします。  false の場合、常に WebGL1 を使用します。  trueの場合、WebGL2が利用可能であればWebGL2を使用し、そうでなければWebGL1にフォールバックします。  false の場合、常に WebGL1 を使用します。  false の場合、常に WebGL1 を使用します。 |
| ownRunLoop [オプション］                                 | ブーリアン                                                  | false\\`                                                                                            | もしtrueなら、XRはそれ自身のランループを使うはずだ。  もしtrueなら、XRはそれ自身のランループを使うはずだ。  falseの場合、自分で実行ループを用意し、自分で[`runPreRender`](/legacy/api/xr8/runprerender)と[`runPostRender`](/legacy/api/xr8/runpostrender)を呼び出すことになります。             |
| cameraConfig： {direction} [オプション］                  | オブジェクト                                                 | `{direction：XR8.XrConfig.camera().BACK}`。                                                            | 使用したいカメラ 使用したいカメラ 使用可能な`direction`の値は`XR8.XrConfig.camera().BACK`または`XR8.XrConfig.camera().FRONT`です。                                                                                                            |
| glContextConfig [オプション]。 | WebGLContextAttributes\\`。                            | null\\`。                                                                                            | WebGL canvas コンテキストを設定する属性。                                                                                                                                                                                     |
| allowedDevices [オプション］                             | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device) | XR8.XrConfig.device().MOBILE\\`。 | パイプラインを実行するデバイスのクラスを指定する。  現在のデバイスがそのクラスでない場合、カメラを開く前に実行が失敗します。 allowedDevicesが`XR8.XrConfig.device().ANY`の場合、常にカメラを開きます。 ワールドトラッキングは`XR8.XrConfig.device().MOBILE`でのみ使用できることに注意してください。                         |

xrConfig\\` [オプション]は以下のプロパティを持つオブジェクトである：

| パラメータ                                                                             | 説明                                                                                                                                                                                                                                 |
| --------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| enableLighting［オプション］                                                             | trueの場合、照明情報の推定値を返す。                                                                                                                                                                                                               |
| enableWorldPoints [オプション］                               | trueの場合、トラッキングに使用されるマップポイントを返します。                                                                                                                                                                                                  |
| disableWorldTracking [オプション]。 | もしtrueなら、効率化のためにSLAMトラッキングをオフにする。                                                                                                                                                                                                  |
| imageTargets [オプション］                                    | 検出する画像ターゲットの名前のリスト。 実行時に変更可能。 注意：現在アクティブなイメージターゲットはすべて、このリストで指定されたものに置き換えられます。 実行時に変更可能。 検出する画像ターゲットの名前のリスト。 実行時に変更可能。 注意：現在アクティブなイメージターゲットはすべて、このリストで指定されたものに置き換えられます。 実行時に変更可能。 注意：現在アクティブなイメージターゲットはすべて、このリストで指定されたものに置き換えられます。 |
| leftHandedAxes [オプション]。       | trueの場合、左手座標を使用する。                                                                                                                                                                                                                 |
| imageTargets [オプション］                                    | trueの場合、出力の左右を反転する。                                                                                                                                                                                                                |

## {#returns}を返す。

バビロンJSビヘイビアは、XRエンジンをバビロンカメラに接続し、カメラフィードとトラッキングを開始します。

## 例 {#example}

```javascript
let surface, engine, scene, camera

const startScene = () => {
  const canvas = document.getElementById('renderCanvas')

  engine = new BABYLON.Engine(canvas, true, { stencil: true, preserveDrawingBuffer: true })
  engine.enableOfflineSupport = false

  scene = new BABYLON.Scene(engine)
  camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 3, 0), scene)

  initXrScene({ scene, camera }) // シーンにオブジェクトを追加し、開始カメラの位置を設定します。

  // カメラをXRエンジンに接続し、カメラフィードを表示する
  camera.addBehavior(XR8.Babylonjs.xrCameraBehavior())

  engine.runRenderLoop(() => {
    scene.render()
  })

  window.addEventListener('resize', () => {
    engine.resize()
  })
}
```
