---
sidebar_label: xrwebComponent()
---

# XR8.AFrame.xrwebComponent()

XR8.AFrame.xrwebComponent()\\`。

## 説明 {#description}

AFRAME.registerComponent()`で登録できるA-Frameコンポーネントを作成します。 しかし、
、一般的には直接呼び出す必要はない。 AFRAME.registerComponent()`で登録できるA-Frameコンポーネントを作成します。 しかし、
、一般的には直接呼び出す必要はない。 8番目のWall Webスクリプトのロード時に、A-Frameがロードされたことが検出されると（つまり、`window.AFRAME\`
が存在すると）、このコンポーネント
が自動的に登録されます。

## パラメータ {#parameters}

なし

## 例 {#example}

```javascript
window.AFRAME.registerComponent('xrweb', XR8.AFrame.xrwebComponent())
```
