---
sidebar_position: 1
---

# xr:layerfound

## 説明 {#description}

このイベントは、レイヤーが最初に見つかったときに発行されます。

`xr:layerfound.detail : { name, percentage }`.

| プロパティ                             | 説明            |
| --------------------------------- | ------------- |
| name: `string`    | 見つかったレイヤーの名前。 |
| パーセンテージ: `number` | 空であるピクセルの割合。  |

## 例 {#example}

```javascript
this.app.on('xr:layerfound', (event) => {
  console.log(`Layer ${event.name} found in ${event.percentage} of the screen.`)
}, this)
```
