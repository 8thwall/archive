---
sidebar_label: addCameraPipelineModules()
---

# XR8.addCameraPipelineModules()

`XR8.addCameraPipelineModules([ modules ])`

## 説明 {#description}

複数のカメラパイプラインモジュールを追加。 複数のカメラパイプラインモジュールを追加。 これは、[`XR8.addCameraPipelineModule()`](addcamerapipelinemodule.md) を入力配列の各要素に対して順番に呼び出す便利なメソッドです。

## パラメータ {#parameters}

| パラメータ   | タイプ        | 説明                  |
| ------- | ---------- | ------------------- |
| modules | `[Object]` | カメラパイプラインモジュールのアレイ。 |

## を返す {#returns}

なし

## 例 {#example}

```javascript
const onxrloaded = () => {
  XR8.addCameraPipelineModules([ // カメラパイプラインモジュールを追加します。
    // 既存のパイプラインモジュール。
    XR8.GlTextureRenderer.pipelineModule(), // カメラフィードを描画します。
  ])

  // カメラのパーミッションを要求し、カメラを実行します。
  XR8.run({canvas: document.getElementById('camerafeed')}))。
}

//
window.XR8 ? onxrloaded() : window.addEventListener('xrloaded', onxrloaded)
```
