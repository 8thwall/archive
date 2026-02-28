---
sidebar_label: isPaused()
---

# XR8.isPaused()

`XR8.isPaused()`

## 説明 {#description}

XRセッションが一時停止されているかどうかを示す。

## パラメータ {#parameters}

なし

## を返す {#returns}

XRセッションが一時停止していればtrue、そうでなければfalse。

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
