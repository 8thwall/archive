---
sidebar_label: xrScene()
---

# XR8.Threejs.xrScene()

XR8.Threejs.xrScene()\\`を使用する。

## 説明 {#description}

xrシーン、カメラ、レンダラー、（オプションの）カメラフィードテクスチャ、および（オプションの）layerScenesへのハンドルを取得します。

## パラメータ {#parameters}

なし

## {#returns}を返す。

オブジェクト: `{ scene, camera, renderer, cameraTexture, layerScenes }`.

| プロパティ                                           | タイプ                                                                   | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------------------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| シーン                                             | [シーン\\`](https://threejs.org/docs/#api/en/scenes/Scene)              | three.jsの現場。                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| カメラ                                             | [カメラ\\`](https://threejs.org/docs/#api/en/cameras/Camera)            | three.jsのメインカメラ。                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| レンダラ                                            | [レンダラー\\`](https://threejs.org/docs/#api/en/renderers/WebGLRenderer) | three.jsのレンダラー。                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| cameraTexture [オプション］ | [テクスチャ\\`](https://threejs.org/docs/#api/en/textures/Texture)        | カメラのフィードをキャンバスサイズにトリミングしたthree.jsテクスチャ。 カメラのフィードをキャンバスサイズにトリミングしたthree.jsテクスチャ。 XR8.Threejs.configure({renderCameraTexture: true})\\`](configure.md)を呼び出すことで有効になります。                                                                                                                                                     |
| layerScenes [オプション］   | `Record<String, LayerScene>`                                          | レイヤー名とthree.jsのレイヤーシーンのマップ。 レイヤー名とthree.jsのレイヤーシーンのマップ。 XR8.Threejs.configure({layerScenes: ['sky']})\\`](configure.md)を呼び出すことで有効になるレコードが含まれます。 レイヤー名とthree.jsのレイヤーシーンのマップ。 XR8.Threejs.configure({layerScenes: ['sky']})\`](configure.md)を呼び出すことで有効になるレコードが含まれます。 |

layerScenes`オブジェクトの`LayerScene\\` は以下のプロパティを持つ：

| プロパティ | タイプ                                                        | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ----- | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| シーン   | [シーン\\`](https://threejs.org/docs/#api/en/scenes/Scene)   | このレイヤーのthree.jsシーン。 この空に追加されたコンテンツは、このレイヤーが検出されたカメラ・フィードのエリアにいるときのみ表示されます。 例えばSky Effectsでは、立方体は空にしか表示されません。 このレイヤーのthree.jsシーン。 この空に追加されたコンテンツは、このレイヤーが検出されたカメラ・フィードのエリアにいるときのみ表示されます。 例えばSky Effectsでは、立方体は空にしか表示されません。 XR8.LayersController.configure({layers: {sky: {invertLayerMask: true}}})\\`を使ってこれを反転させ、キューブが空にないときだけ表示されるようにします。 |
| カメラ   | [カメラ\\`](https://threejs.org/docs/#api/en/cameras/Camera) | このレイヤーのthree.jsカメラ。 その位置と回転はメインカメラと同期する。 その位置と回転はメインカメラと同期する。                                                                                                                                                                                                                                                                                                                                                                                                  |

## 例 {#example}

```javascript
const {scene, camera, renderer, cameraTexture} = XR8.Threejs.xrScene()
```

## 例 - スカイシーン {#example---sky-scene}

```javascript
XR8.LayersController.configure({layers: {sky: {}}})
XR8.Threejs.configure({layerScenes: ['sky']})
...
const {layerScenes} = XR8.Threejs.xrScene()
createSkyScene(layerScenes.sky.scene, layerScenes.sky.camera)
```
