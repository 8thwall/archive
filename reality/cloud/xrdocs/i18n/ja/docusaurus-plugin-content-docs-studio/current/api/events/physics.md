---
id: physics
sidebar_position: 6
---

# 物理学イベント

## イベント

### 衝突開始イベント

エンティティが他のエンティティとの衝突を開始したときに発せられる。

#### プロパティ一覧

| Property | Type | 商品説明           |
| -------- | ---- | -------------- |
| その他      | イード  | 衝突するエンティティのイード |

#### 例

```ts
world.events.addListener(component.eid, ecs.physics.COLLISION_START_EVENT, (event) => {
    console.log(event.data.other)
})
```

### 衝突終了イベント

エンティティが他のエンティティとの衝突を停止したときに発せられる。

#### プロパティ一覧

| Property | Type | 商品説明           |
| -------- | ---- | -------------- |
| その他      | イード  | 衝突するエンティティのイード |

#### 例

```ts
world.events.addListener(component.eid, ecs.physics.COLLISION_END_EVENT, (event) => {
    console.log(event.data.other)
})
```
