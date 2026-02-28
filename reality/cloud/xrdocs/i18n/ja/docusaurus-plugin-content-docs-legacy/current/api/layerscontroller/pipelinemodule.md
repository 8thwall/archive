---
sidebar_label: pipelineModule()
---

# XR8.LayersController.pipelineModule()

XR8.LayersController.pipelineModule()\\`。

## 説明 {#description}

カメラパイプラインモジュールを作成し、インストールするとセマンティックレイヤー検出を行います。

## パラメータ {#parameters}

なし

## {#returns}を返す。

戻り値は、[`onUpdate`](/legacy/api/camerapipelinemodule/onupdate) として利用可能なオブジェクトである：

processCpuResult.layerscontroller: { rotation, position, intrinsics, cameraFeedTexture, layers }\\`.

| プロパティ        | タイプ                                                                               | 説明                                                |
| ------------ | --------------------------------------------------------------------------------- | ------------------------------------------------- |
| ローテーション      | w, x, y, z}\\`.                                                  | シーン内のカメラの向き（クォータニオン）。                             |
| 位置           | {x, y, z}\\`                                                                     | シーン内のカメラの位置。                                      |
| インプリンシックス    | 数字                                                                                | レンダリングされたカメラフィードと同じ視野をシーンカメラに与える、16次元の列長4x4の投影行列。 |
| カメラフィードテクスチャ | [WebGLTexture\\`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | カメラフィードデータを含むテクスチャ。                               |
| レイヤーズ        | `Record<String, LayerOutput>`                                                     | Keyはレイヤー名、LayerOutputはそのレイヤーのセマンティック・レイヤー検出結果を含む。 |

LayerOutput\\`は以下のプロパティを持つオブジェクトである：

| プロパティ    | タイプ                                                                               | 説明                                                                                                                                                                       |
| -------- | --------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| テクスチャー   | [WebGLTexture\\`](https://developer.mozilla.org/en-US/docs/Web/API/WebGLTexture) | レイヤーデータを含むテクスチャ。 r、g、bチャンネルは、この画素に層が存在するかどうかの確信度を示す。 0.0はレイヤーが存在しないことを示し、1.0は存在することを示す。 invertLayerMask\`がtrueに設定されている場合、この値は反転されることに注意。 |
| テクスチャ幅   | 番号                                                                                | 返されたテクスチャの幅（ピクセル単位）。                                                                                                                                                     |
| テクスチャの高さ | 番号                                                                                | 返されたテクスチャの高さ（ピクセル単位）。                                                                                                                                                    |
| パーセント    | 番号                                                                                | レイヤーに関連すると分類されたピクセルの割合。 0, 1]の範囲内の値。 0, 1]の範囲内の値。                                                                    |

## 派遣イベント {#dispatched-events}

**layerloading**：追加のレイヤーセグメンテーションリソースのロードが始まるときに発生します。

`layerloading.detail : {}`.

**layerscanning**：すべてのレイヤーセグメンテーションリソースがロードされ、スキャンが開始されたときに発生します。 スキャンされるレイヤーごとに1つのイベントがディスパッチされる。 スキャンされるレイヤーごとに1つのイベントがディスパッチされる。

`layerscanning.detail : {name}`.

| プロパティ | タイプ | 説明             |
| ----- | --- | -------------- |
| 名称    | 文字列 | スキャンするレイヤーの名前。 |

**layerfound**：レイヤーが初めて見つかったときに発火します。

`layerfound.detail : {name, percentage}`.

| プロパティ | タイプ | 説明                |
| ----- | --- | ----------------- |
| 名称    | 文字列 | 見つかったレイヤーの名前。     |
| パーセント | 番号  | レイヤーに関連するピクセルの割合。 |

## 例 - パイプライン・モジュールの追加 {#example---adding-pipeline-module}

```javascript
XR8.addCameraPipelineModule(XR8.LayersController.pipelineModule())
```
