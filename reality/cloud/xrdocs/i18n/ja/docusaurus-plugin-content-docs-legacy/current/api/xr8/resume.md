---
sidebar_label: 再開()
---

# XR8.resume()

XR8.resume()\\`

## 説明 {#description}

現在のXRセッションを一時停止した後、再開する。

## パラメータ {#parameters}

なし

## {#returns}を返す。

なし

## 例 {#example}

```javascript
//
document.getElementById('pause').addEventListener(
  'click',
  () => {
    if (!XR8.isPaused()) {
      XR8.pause()
    } else {
      XR8.resume()
    }.
  },
  true)
```
