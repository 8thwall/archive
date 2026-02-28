---
sidebar_label: configure()
---

# XR8.XrController.configure()

`XrController.configure({ disableWorldTracking, enableLighting, enableWorldPoints, enableVps, imageTargets: [], leftHandedAxes, mirroredDisplay, projectWayspots, scale })`

## 概要 {#description}

`XrController`が行う処理を設定します（設定によってはパフォーマンスに影響する場合があります）。

## パラメータ {#parameters}

| パラメータ                           | タイプ       | デフォルト        | 説明                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------- | --------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| disableWorldTracking [Optional] | `Boolean` | `false`      | trueの場合、効率化のためにSLAMトラッキングをオフにします。 これは、[`XR8.run()`](/api/xr8/run)が呼び出される**前**に行う必要があります。                                                                                                                                                                                                                                                                                                                                     |
| enableLighting [Optional]       | `Boolean` | `false`      | trueの場合、`lighting` は[`XR8.XrController.pipelineModule()`](pipelinemodule.md)から`processCpuResult.reality.lighting`として提供されます。                                                                                                                                                                                                                                                                                                  |
| enableWorldPoints [Optional]    | `Boolean` | `false`      | trueの場合、` worldPoints ` は[`XR8.XrController.pipelineModule()`](pipelinemodule.md)から`processCpuResult.reality.worldPoints`として提供されます。                                                                                                                                                                                                                                                                                          |
| enableVps [Optional]            | `Boolean` | `false`      | もしそうなら、プロジェクト・ロケーションとメッシュを探す。 返されるメッシュはプロジェクト・ロケーションとは関係なく、プロジェクト・ロケーションが設定されていなくても返されます。 VPS を有効にすると、 `scale`と `disableWorldTracking`の設定が上書きされます。                                                                                                                                                                                                                                                                           |
| imageTargets [Optional]         | `Array`   |              | 検出するイメージ・ターゲットの名称のリストです。 実行時に変更可能です。 注: 現在アクティブなイメージターゲットはすべて、このリストで指定されたものに置き換わります。                                                                                                                                                                                                                                                                                                                                          |
| leftHandedAxes [Optional]       | `Boolean` | `false`      | trueの場合、左利き用の座標を使用します。                                                                                                                                                                                                                                                                                                                                                                                                       |
| mirroredDisplay [Optional]      | `Boolean` | `false`      | trueの場合、出力で左右を反転させます。                                                                                                                                                                                                                                                                                                                                                                                                        |
| projectWayspots [Optional]      | `Array`   | `[]`         | ローカライズ専用のプロジェクトロケーション名のサブセット。 空の配列が渡された場合、近くにあるすべてのプロジェクトロケーションをローカライズします。                                                                                                                                                                                                                                                                                                                                                   |
| scale [Optional]                | `String`  | `responsive` | `responsive`または`absolute`のいずれかを取ります。 `'responsive'`は、フレーム 1のカメラが [`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md)で定義した原点に位置するように値を返します。 `absolute`は、カメラ、イメージ・ターゲットなどをメートル単位で返します。 開始時の`absolute`のx-position、z-position、および回転を使用する場合、スケールが推定されると、[`XR8.XrController.updateCameraProjectionMatrix()`](updatecameraprojectionmatrix.md)で設定したパラメータに従います。 y-positionは、カメラの接地面からの物理的な高さに依存します。 |

**重要:**`disableWorldTracking: true`は、[`XR8.XrController.pipelineModule()`](pipelinemodule.md)と[`XR8.run()`](/legacy/api/xr8/run)の両方が呼ばれる**前**に設定する必要があり、エンジン稼働中は変更することができません。

## 戻り値 {#returns}

なし

## 例 {#example}

```javascript
XR8.XrController.configure({enableLighting: true, disableWorldTracking: false, scale: 'absolute'})
```

## 例）VPSを有効にする {#example---enable-vps}

```javascript
XR8.XrController.configure({enableVps: true})
```

## 例）ワールド・トラッキングを無効にする {#example---disable-world-tracking}

```javascript
// ワールドトラッキング（SLAM）を無効にします。
XR8.XrController.configure({disableWorldTracking: true})
// カメラを開いてカメラランループを実行開始します。
XR8.run({canvas: document.getElementById('camerafeed')})
```

## 例）アクティブなイメージ・ターゲットセットを変更する {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
```
