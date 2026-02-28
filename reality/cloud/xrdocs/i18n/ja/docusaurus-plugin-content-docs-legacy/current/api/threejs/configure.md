---
sidebar_label: configure()
---

# XR8.Threejs.configure()

`XR8.Threejs.configure({renderCameraTexture, layerNames})`.

## 説明 {#description}

three.jsのレンダラーを設定します。

## パラメータ {#parameters}

| プロパティ                                                                            | タイプ   | デフォルト    | 説明                                                                                                                                                                                                                                                                                                                                                                                           |
| -------------------------------------------------------------------------------- | ----- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| renderCameraTexture [オプション]。 | ブーリアン | true\\` | もし `true` なら、キャンバスの大きさに切り取られたカメラ映像をテクスチャにレンダリングします。 これは、[`XR8.Threejs.xrScene()`](xrscene.md)によって `cameraTexture` として返されます。 もし `true` なら、キャンバスの大きさに切り取られたカメラ映像をテクスチャにレンダリングします。 これは、[`XR8.Threejs.xrScene()`](xrscene.md)によって `cameraTexture` として返されます。 false`または`null\\` の場合、カメラのフィードをテクスチャにレンダリングしません。                                                                                    |
| layerScenes [オプション］                                    | 文字列   | `[]`     | レイヤー名の配列。 レイヤー名の配列。 新しいthree.jsシーンを作成するレイヤー。 レイヤー名の配列。 新しいthree.jsシーンを作成するレイヤー。 シーンは `layerScene` として [`XR8.Threejs.xrScene()`](xrscene.md) によって返されます。 有効な値は`'sky'`だけである。 有効な値は`'sky'`だけである。 レイヤー名の配列。 新しいthree.jsシーンを作成するレイヤー。 シーンは `layerScene` として [`XR8.Threejs.xrScene()`](xrscene.md) によって返されます。 有効な値は`'sky'`だけである。 有効な値は`'sky'`だけである。 |

## {#returns}を返す。

なし

## 例 - カメラフィードをテクスチャにレンダリングする {#example---render-camera-feed-to-a-texture}

```javascript
XR8.Threejs.configure({renderCameraTexture: true})
...
const {cameraTexture} = XR8.Threejs.xrScene()
```

## 例 - スカイシーン {#example---sky-scene}

```javascript
XR8.Threejs.configure({layerScenes: ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
