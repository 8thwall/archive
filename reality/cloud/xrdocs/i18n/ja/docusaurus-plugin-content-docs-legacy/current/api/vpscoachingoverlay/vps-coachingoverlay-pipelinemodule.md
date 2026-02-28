---
sidebar_label: pipelineModule()
---

# VpsCoachingOverlay.pipelineModule()

`VpsCoachingOverlay.pipelineModule()`

## 説明 {#description}

このパイプラインモジュールをインストールすると、
Lightship VPS 対応 WebAR プロジェクトに VPS Coaching Overlay 機能が追加されます。

## パラメータ {#parameters}

なし

## {#returns}を返す。

プロジェクトにVPS Coaching Overlayを追加するパイプラインモジュール。

## 非フレーム例 {#non-aframe-example}

```javascript
// Configured here
VpsCoachingOverlay.configure({
    textColor: '#0000FF',
    promptPrefix: 'Go look for',
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
  VpsCoachingOverlay.pipelineModule(),
  ...
])
```
