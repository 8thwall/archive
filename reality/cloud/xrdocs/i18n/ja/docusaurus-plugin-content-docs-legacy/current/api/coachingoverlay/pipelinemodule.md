---
sidebar_label: pipelineModule()
---

# CoachingOverlay.pipelineModule()

`CoachingOverlay.pipelineModule()`

## 説明 {#description}

このモジュールをインストールすると、アブソリュートスケールのプロジェクトにコーチングオーバーレイ機能が追加されます。

## パラメータ {#parameters}

なし

## {#returns}を返す。

Coaching Overlayをプロジェクトに追加するパイプラインモジュール。

## 非フレーム例 {#non-aframe-example}

```javascript
// ここで設定
CoachingOverlay.configure({
    animationColor: '#E86FFF',
    promptText：'To generate scale push your phone forward and then pull back',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  LandingPage.pipelineModule(),
  // ここに追加
  CoachingOverlay.pipelineModule(),
  ...
])
```
