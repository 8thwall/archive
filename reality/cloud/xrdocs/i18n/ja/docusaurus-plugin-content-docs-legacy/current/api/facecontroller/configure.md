---
sidebar_position: 1
sidebar_label: configure()
---

# XR8.FaceController.configure()

`XR8.FaceController.configure({ nearClip, farClip, meshGeometry, coordinates })`.

## 説明 {#description}

FaceControllerがどのような処理を行うかを設定する。

## パラメータ {#parameters}

| パラメータ                                                                     | タイプ             | デフォルト                                                                                                                | 説明                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ------------------------------------------------------------------------- | --------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nearClip [オプション］                                | 番号              | `0.01`                                                                                                               | ニアクリッププレーンのカメラからの距離、つまりシーンオブジェクトが見えるカメラからの最も近い距離。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| farClip [オプション］                                 | 番号              | `1000`                                                                                                               | 遠いクリップ面のカメラからの距離、つまりシーンオブジェクトが見えるカメラからの最も遠い距離。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| meshGeometry [オプション]。 | `Array<String>` | XR8.FaceController.MeshGeometry.FACE]\\`。 | ヘッド形状のどの部分を表示するかを制御する。 ヘッド形状のどの部分を表示するかを制御する。 オプション：`[XR8.FaceController.MeshGeometry.FACE, XR8.FaceController.MeshGeometry.EYES, XR8.FaceController.MeshGeometry.IRIS, XR8.FaceController.MeshGeometry.MOUTH]`.                                                                                                                                                                                                                                                                                                                                                                                                            |
| maxDetections [オプション］                           | 番号              | `1`                                                                                                                  | 検出する顔の最大数。 選択肢は1、2、3のいずれか。 選択肢は1、2、3のいずれか。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| enableEars [オプション］                              | ブーリアン           | false\\`                                                                                                            | trueの場合、Face Effectsと同時に耳検出を実行し、耳のアタッチメントポイントを返す。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| uvType [オプション］                                  | 文字列             | XR8.FaceController.UvType.STANDARD]\\`。   | フェーススキャンとフェースローディングのイベントで返されるuvを指定する。 オプションは[XR8.FaceController.UvType.STANDARD、XR8.FaceController.UvType.PROJECTED]\`。 フェーススキャンとフェースローディングのイベントで返されるuvを指定する。 オプションは[XR8.FaceController.UvType.STANDARD、XR8.FaceController.UvType.PROJECTED]\`。 オプションは[XR8.FaceController.UvType.STANDARD、XR8.FaceController.UvType.PROJECTED]\`。 |
| 座標 [オプション］                                      | 座標              |                                                                                                                      | カメラの設定。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |

Coordinates\\`オブジェクトは以下のプロパティを持つ：

| パラメータ                                    | タイプ                                                     | デフォルト                                                     | 説明                                                                                   |
| ---------------------------------------- | ------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| origin [オプション］ | `{position： {x, y, z}回転：{w, x, y, z}}`. | `{position： {x: 0, y: 0, z: 0}回転：{w:1, x: 0, y：0, z: 0}}` | カメラの位置と回転。                                                                           |
| scale [オプション］  | 番号                                                      | `1`                                                       | 現場の規模。                                                                               |
| axes [オプション］   | 文字列                                                     | 右利き                                                       | LEFT_HANDED'`または`'RIGHT_HANDED'\\` を指定する。 |
| mirroredDisplay［オプション］                   | ブーリアン                                                   | 偽                                                         | trueの場合、出力の左右を反転する。                                                                  |

\*\* 重要:\*\* [`XR8.FaceController`](./facecontroller.md) と [`XR8.XrController`](../xrcontroller/xrcontroller.md) を同時に使用することはできません。

## {#returns}を返す。

なし

## 例 {#example}

```javascript
  XR8.FaceController.configure({
    meshGeometry：[XR8.FaceController.MeshGeometry.FACE],
    座標： {
      mirroredDisplay: true,
      axes: 'LEFT_HANDED',
    },
})
```
