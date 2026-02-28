---
sidebar_label: ThreejsRenderer() (非推奨)
---

# XR8.ThreejsRenderer() (非推奨)

XR8.ThreejsRenderer()\\`。

## 説明 {#description}

three.js ベースのレンダラーを返します。  シーンカメラの駆動、カメラ視野とAR視野のマッチング、カメラ実行ループ内での'render'の呼び出しを担当する。  シーンカメラの駆動、カメラ視野とAR視野のマッチング、カメラ実行ループ内での'render'の呼び出しを担当する。

three.jsを使用している場合は、three.jsシーン、カメラ、レンダラーを作成し、6DoFカメラの動きに基づいてシーンカメラを駆動するために、カメラパイプラインモジュールとしてこれを追加します。

## パラメータ {#parameters}

なし

## 例 {#example}

```javascript
window.onload = () => {
  // xr3js は three.js のシーン、カメラ、レンダラーを所有する。xr3js はシーンカメラの駆動、
  // カメラの視野と AR の視野のマッチング、
  // カメラの実行ループ内での 'render' の呼び出しを担当します。
  const xr3js = XR8.ThreejsRenderer()

  // XR コントローラーは 6DoF カメラのトラッキングとトラッキングを設定するためのインターフェイスを提供します。
  const xrController = XR8.xrController()

  // ...

  // 6DoF カメラの動き推定を可能にする xrController モジュールを追加します。
  XR8.addCameraPipelineModule(xrController.cameraPipelineModule())

  // キャンバスにカメラフィードを描画するGLRendererを追加します。
  XR8.addCameraPipelineModule(XR8.GLRenderer())

  // threejs シーン、カメラ、レンダラーを作成し、6DoF カメラモーションに基づいてシーンカメラ
  // を駆動する xr3js を追加します。
  XR8.addCameraPipelineModule(xr3js)

  // ...
}
```
