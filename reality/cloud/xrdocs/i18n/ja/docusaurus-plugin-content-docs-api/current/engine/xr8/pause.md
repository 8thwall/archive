---
sidebar_label: ポーズ
---

# XR8.pause()

`XR8.pause()`

## 説明 {#description}

現在の XR セッションを一時停止する。  一時停止中は、デバイスの動きは追跡されない。

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
