---
sidebar_position: 1
---

# xr:レイヤローディング

## 説明 {#description}

このイベントは、追加レイヤーのセグメンテーションのためにロードが開始されるときに発行される。

`xr:layerloading.detail : { }`.

## 例 {#example}

```javascript
this.app.on('xr:layerloading', () => {
  console.log(`Layer loading.`)
}, this)
```
