---
sidebar_label: pipelineModule()
---

# XR8.CanvasScreenshot.pipelineModule()

`XR8.CanvasScreenshot.pipelineModule()`

## 説明 {#description}

カメラパイプラインモジュールを作成します。このモジュールがインストールされると、カメラが起動したときとキャンバスのサイズが変更されたときにコールバックを受け取ります。

## パラメータ {#parameters}

なし

## を返す {#returns}

[XR8.addCameraPipelineModule()](/api/engine/xr8/addcamerapipelinemodule)で追加できるCanvasScreenshotパイプラインモジュールです。

## 例 {#example}

```javascript
XR8.addCameraPipelineModule(XR8.CanvasScreenshot.pipelineModule())
```
