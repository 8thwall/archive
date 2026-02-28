---
sidebar_label: ヒットテスト
---

# XR8.XrController.hitTest()

XrController.hitTest(X、Y、includedTypes = [])\\`。

## 説明 {#description}

カメラフィード上の点の3D位置を推定する。 カメラフィード上の点の3D位置を推定する。 XとYは0から1の間の数値で指定し、(0, 0)は[`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md)で指定されたカメラでレンダリングされたカメラフィードの左上隅、(1, 1)は右下隅を表します。 位置の推定に使用されるデータソースに基づき、1つのヒットテストに対して複数の3d位置推定値が返される場合がある。 位置を推定するために使用されたデータソースは `hitTest.type` で示される。 3次元位置推定に使用されたデータのソースに基づく1回のヒットテストに対して、複数の位置推定が返される場合があります。 位置を推定するために使用されたデータソースは `hitTest.type` で示される。

## パラメータ（全てオプション） {#parameters-all-optional}

| なし    | タイプ | 商品説明                                            |
| ----- | --- | ----------------------------------------------- |
| X     | 番号  | カメラフィードの左から右への水平位置を表す0から1の間の値。                  |
| Y     | 番号  | 0から1の間の値で、カメラのフィードの上から下への垂直位置を表す。               |
| 含まれる型 | 文字列 | FEATURE_POINT'\\` を含むリスト。 |

## 戻り値 {#returns}

ヒットテストで推定された3次元位置の配列：

タイプ、位置、回転、距離 }]\\`。

| パラメータ   | タイプ                              | 概要                                                                                                                                                   |
| ------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| タイプ     | String                           | FEATURE_POINT'`、`'ESTIMATED_SURFACE'`、`'DETECTED_SURFACE'`、`'UNSPECIFIED'\\`のいずれか1つ。 |
| 位置      | {x, y, z}\\`                    | カメラフィード上の照会された点の推定3D位置。                                                                                                                              |
| ローテーション | x, y, z, w}\\`. | カメラフィード上の照会された点の推定3D回転。                                                                                                                              |
| 距離      | 番号                               | カメラフィード上の照会されたポイントのデバイスからの推定距離。                                                                                                                      |

## 例 {#example}

```javascript
const hitTestHandler = (e) => {
  const x = e.touches[0].clientX / window.innerWidth
  const y = e.touches[0].clientY / window.innerHeight
  const hitTestResults = XR8.XrController.hitTest(x, y, ['FEATURE_POINT'])
}
```
