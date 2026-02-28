---
sidebar_label: pipelineModule()
---

# LandingPage.pipelineModule()

`LandingPage.pipelineModule()`

## 説明 {#description}

インストールすると、プロジェクトにランディングページ機能を追加するパイプラインモジュールを作成します。

## パラメータ {#parameters}

なし

## {#returns}を返す。

あなたのプロジェクトにランディングページの機能を追加するパイプラインモジュールです。

## 非フレーム例 {#non-aframe-example}

```javascript
// ここで設定
LandingPage.configure({ 
    mediaSrc: 'https://domain.com/bat.glb',
    sceneEnvMap：'hill',
})
XR8.addCameraPipelineModules([
  XR8.GlTextureRenderer.pipelineModule(),
  XR8.Threejs.pipelineModule(),
  XR8.XrController.pipelineModule(),
  XRExtras.FullWindowCanvas.pipelineModule(),
  XRExtras.Loading.pipelineModule(),
  XRExtras.RuntimeError.pipelineModule(),
  // ここに追加
  LandingPage.pipelineModule(), 
  ...
])
```
