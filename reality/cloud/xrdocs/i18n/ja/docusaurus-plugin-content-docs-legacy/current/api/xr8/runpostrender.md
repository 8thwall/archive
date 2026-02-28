---
sidebar_label: runPostRender()
---

# XR8.runPostRender()

XR8.runPostRender()\\`。

## 説明 {#description}

レンダリング後に行われるべきすべてのライフサイクル更新を実行する。

**重要**：XR8.runPreRender()`/`XR8.runPostRender()` を呼び出す前に、[`onStart\\`](/legacy/api/camerapipelinemodule/onstart) が呼び出されていることを確認してください。

## パラメータ {#parameters}

なし

## {#returns}を返す。

なし

## 例 {#example}

```javascript
// A-Frame コンポーネントの tock() メソッドの実装
function tock() {
  // XR が初期化されているかどうかのチェック
  ...
  // XR のライフサイクルメソッドを実行
  XR8.runPostRender()
}.
```
