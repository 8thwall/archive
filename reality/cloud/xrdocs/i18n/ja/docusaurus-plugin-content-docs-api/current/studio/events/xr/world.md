---
id: world
sidebar_position: 4
---

# ワールド・エフェクト・イベント

## イベント {#events}

### trackingstatus {#trackingstatus}

このイベントは、エンジンが始動し、トラッキングの状態や理由が変化したときにWorld Effectsから発行される。

#### プロパティ

| プロパティ | タイプ | 説明                                  |
| ----- | --- | ----------------------------------- |
| ステータス | 文字列 | `LIMITED`または`NORMAL`のいずれか。          |
| 理由    | 文字列 | `INITIALIZING`または`UNDEFINED` のいずれか。 |

#### 例

```ts
world.events.addListener(world.events.globalId, 'reality.trackingstatus', (e) => {
    console.log(e)
})
```
