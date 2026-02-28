---
sidebar_position: 1
---

# xr:レイヤースキャンニング

## 説明 {#description}

このイベントは、すべてのレイヤーセグメンテーションリソースがロードされ、スキャンが開始されたときに発行される。 スキャンされるレイヤーごとに1つのイベントがディスパッチされる。 スキャンされるレイヤーごとに1つのイベントがディスパッチされる。

`xr:layerscanning.detail : { name }`.

| プロパティ                          | 説明             |
| ------------------------------ | -------------- |
| name: `string` | スキャンするレイヤーの名前。 |

## 例 {#example}

```javascript
this.app.on('xr:layerscanning', (event) => {
  console.log(`Layer ${event.name} has started scanning.`)
}, this)
```
