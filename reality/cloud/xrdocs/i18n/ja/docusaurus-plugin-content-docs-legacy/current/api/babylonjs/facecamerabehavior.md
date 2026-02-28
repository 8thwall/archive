---
sidebar_label: faceCameraBehavior()
---

# XR8.Babylonjs.faceCameraBehavior()

`XR8.Babylonjs.faceCameraBehavior(config,faceConfig)`。

## 説明 {#description}

Babylonのカメラにアタッチできるビヘイビアを取得します：camera.addBehavior(XR8.Babylonjs.faceCameraBehavior())\\`のようにします。

## パラメータ {#parameters}

| パラメータ                                        | 説明                                                                                                                              |
| -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| config [オプション］     | XR8.run()\\`](/legacy/api/xr8/run) に渡す設定パラメータ。 |
| faceConfig [オプション］ | XR8.FaceController\\`](/legacy/api/facecontroller) に渡す顔設定パラメータ。   |

config\\` [オプション]は以下のプロパティを持つオブジェクトである：

| プロパティ                                                                        | タイプ                                                    | デフォルト                                                                                                | 説明                                                                                                                                                                                                              |
| ---------------------------------------------------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| webgl2 [オプション］                                     | ブーリアン                                                  | false\\`                                                                                            | trueの場合、WebGL2が利用可能であればWebGL2を使用し、そうでなければWebGL1にフォールバックします。  false の場合、常に WebGL1 を使用します。  trueの場合、WebGL2が利用可能であればWebGL2を使用し、そうでなければWebGL1にフォールバックします。  false の場合、常に WebGL1 を使用します。  false の場合、常に WebGL1 を使用します。 |
| ownRunLoop [オプション］                                 | ブーリアン                                                  | true\\`                                                                                             | もしtrueなら、XRはそれ自身のランループを使うはずだ。  もしtrueなら、XRはそれ自身のランループを使うはずだ。  falseの場合、自分で実行ループを用意し、自分で[`runPreRender`](/legacy/api/xr8/runprerender)と[`runPostRender`](/legacy/api/xr8/runpostrender)を呼び出すことになります。             |
| cameraConfig： {direction} [オプション］                  | オブジェクト                                                 | `{direction：XR8.XrConfig.camera().BACK}`。                                                            | 使用したいカメラ 使用したいカメラ 使用可能な`direction`の値は`XR8.XrConfig.camera().BACK`または`XR8.XrConfig.camera().FRONT`です。                                                                                                            |
| glContextConfig [オプション]。 | WebGLContextAttributes\\`。                            | null\\`。                                                                                            | WebGL canvas コンテキストを設定する属性。                                                                                                                                                                                     |
| allowedDevices [オプション］                             | [`XR8.XrConfig.device()`](/legacy/api/xrconfig/device) | XR8.XrConfig.device().MOBILE\\`。 | パイプラインを実行するデバイスのクラスを指定する。  現在のデバイスがそのクラスでない場合、カメラを開く前に実行が失敗します。 allowedDevicesが`XR8.XrConfig.device().ANY`の場合、常にカメラを開きます。 ワールドトラッキングは`XR8.XrConfig.device().MOBILE`でのみ使用できることに注意してください。                         |

faceConfig\\` [Optional] は以下のプロパティを持つオブジェクトである：

| パラメータ                                                                       | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [オプション］                                  | ニアクリッププレーンのカメラからの距離。 ニアクリッププレーンのカメラからの距離。 デフォルトでは、Babylon camera.minZを使用します。                                                                                                                                                                                                                                                                                                                                                                                                                         |
| farClip [オプション］                                   | 遠いクリップ面のカメラからの距離。 デフォルトでは、Babylon camera.maxZを使用します。                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| meshGeometry [オプション]。   | フェーススキャンとフェースローディングのイベントで返されるuvを指定する。 オプションはXR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`.  ヘッドのジオメトリのどの部分が見えるかを示すリスト。  オプションはXR8.FaceController.MeshGeometry.FACE, XR8.FaceController.MeshGeometry.EYES, XR8.FaceController.MeshGeometry.MOUTH, XR8.FaceController.MeshGeometry.IRIS]`. デフォルトは `[XR8.FaceController.MeshGeometry.FACE]\` です。 |
| maxDetections [オプション］                             | 検出する顔の最大数。 選択肢は1、2、3のいずれか。 デフォルトは1。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| uvType [オプション］                                    | フェーススキャンとフェースローディングのイベントで返されるuvを指定する。 オプションはXR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`. オプションはXR8.FaceController.UvType.STANDARD, XR8.FaceController.UvType.PROJECTED]`. デフォルトは `[XR8.FaceController.UvType.STANDARD]\` です。                                                                                                                |
| leftHandedAxes [オプション]。 | trueの場合、左手座標を使用する。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| imageTargets [オプション］                              | trueの場合、出力の左右を反転する。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

## {#returns}を返す。

Face EffectsエンジンをBabylonカメラに接続し、カメラ・フィードとトラッキングを開始するBabylon JSビヘイビア。

## 例 {#example}

```javascript
const startScene = (canvas) => {
  const engine = new BABYLON.Engine(canvas, true /* アンチエイリアス */)
  const scene = new BABYLON.Scene(engine)
  scene.useRightHandedSystem = false

  const camera = new BABYLON.FreeCamera('camera', new BABYLON.Vector3(0, 0, 0), scene)
  camera.rotation = new BABYLON.Vector3(0, scene.useRightHandedSystem ? Math.PI : 0, 0)
  camera.minZ = 0.0001
  camera.maxZ = 10000

  // シーンにライトを追加する
  const directionalLight =
  new BABYLON.DirectionalLight("DirectionalLight", new BABYLON.Vector3(-5, -10, 7), scene)
  directionalLight.intensity = 0.5

  // メッシュロジック
  const faceMesh = new BABYLON.Mesh("face", scene);
  const material = new BABYLON.StandardMaterial("boxMaterial", scene)
  material.diffuseColor = new BABYLON.Color3(173 / 255.0, 80 / 255.0, 255 / 255.0)
  faceMesh.material = material

  let facePoints = []

  const runConfig = {
    cameraConfig：{XR8.XrConfig.camera().FRONT},
    allowedDevices：XR8.XrConfig.device().ANY,
    verbose: true,
  }

  camera.addBehavior(XR8.Babylonjs.faceCameraBehavior(runConfig))//

  engine.runRenderLoop(() => {
    scene.render()
  })
}
```
