---
sidebar_label: runPreRender()
---

# XR8.runPreRender()

XR8.runPreRender()\\`タイムスタンプ

## 説明 {#description}

レンダリング前に行われるべきすべてのライフサイクル更新を実行する。

**重要**：XR8.runPreRender()`/`XR8.runPostRender()` を呼び出す前に、[`onStart\\`](/legacy/api/camerapipelinemodule/onstart) が呼び出されていることを確認してください。

## パラメータ {#parameters}

| パラメータ   | タイプ | 説明          |
| ------- | --- | ----------- |
| タイムスタンプ | 番号  | ミリ秒単位の現在時刻。 |

## {#returns}を返す。

なし

## 例 {#example}

```javascript
// A-Frame コンポーネントの tick() メソッドの実装
function tick() {
  // デバイスの互換性をチェックし、必要なビュージオメトリの更新を実行し、カメラフィードを描画する
  ...
  // XR ライフサイクルメソッドを実行
  XR8.runPreRender(Date.now())
}.
```
