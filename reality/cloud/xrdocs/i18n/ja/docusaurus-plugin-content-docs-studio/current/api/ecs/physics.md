---
id: physics
---

# 物理学

## 商品説明

このライブラリには、エンティティに物理演算を適用したり、コライダーを設定したりするメソッドがあります。

## 関数一覧

### 適用力

物理コライダーがあれば、どんなエンティティにも直接力（リニアと角度）を加えることができます。
これらの力は、一定の間隔で行われる次の物理シミュレーションの更新で適用される。
この関数は、力の方向と大きさを定義する3Dベクトルを受け付ける。

:::warning
これは、requestAnimationFrame()を呼び出す頻度や、デバイスのリフレッシュ・レートに依存します。
:::

```ts
ecs.physics.applyForce(world, eid, forceX, forceY, forceZ) // -> void
```

### アプライドインパルス

この関数は、物理コライダーに1回限りの瞬時力を加え、与えられたインパルスベクトルに基づいてその速度を変更するために使用される。
この方法は、ジャンプやパンチ、突然のプッシュなど、素早いワンアクションの反応が必要な競技に有効だ。

```ts
ecs.physics.applyImpulse(world, eid, impulseX, impulseY, impulseZ) // -> void
```

### アプライドトルク

物理コライダーがあれば、どんなエンティティにも直接力（リニアと角度）を加えることができます。
これらの力は、一定の間隔で行われる次の物理シミュレーションの更新で適用される。
この関数は、力の方向と大きさを定義する3Dベクトルを受け付ける。

:::warning
これは、requestAnimationFrame()を呼び出す頻度や、デバイスのリフレッシュ・レートに依存します。
:::

```ts
ecs.physics.applyTorque(world, eid, torqueX, torqueY, torqueZ) // -> void
```

### 世界重力

これは、シーン内のすべてのオブジェクトに適用されている現在の重力力を返すシンプルなゲッター関数です。
戻り値は、関数が実行された時間によって変わるかもしれない。

```ts
ecs.physics.getWorldGravity(world) // -> 数
```

### RegisterConvexShape

凸形状を登録する。

```ts
ecs.physics.registerConvexShape(world, vertices) // -> 登録された形状のeid
```

### リニア速度

エンティティの直線速度を取得する。

```ts
ecs.physics.getLinearVelocity(world, eid) // →数値
```

### セットリニアベロシティ

エンティティの直線速度を設定する。

```ts
ecs.physics.setLinearVelocity(world, eid, velocityX, velocityY, velocityZ) // -> void
```

### セットワールド・グラビティ

世界の重力を設定する。

```ts
ecs.physics.setWorldGravity(world, gravity) // -> void
```

### UnregisterConvexShape

凸形状の登録を解除する。

```ts
ecs.physics.unregisterConvexShape(world, id) // -> void
```

## イベント

### 衝突開始イベント

エンティティとの衝突が始まったときに発せられる。

```ts
ecs.physics.COLLISION_START_EVENT.data :  { other }
```

#### プロパティ一覧

| Property | Type | 商品説明           |
| -------- | ---- | -------------- |
| その他      | イード  | 衝突したエンティティのイード |

### 衝突終了イベント

エンティティとの衝突が停止したときに発せられる。

```ts
ecs.physics.COLLISION_END_EVENT.data :  { other }
```

#### プロパティ一覧

| Property | Type | 商品説明           |
| -------- | ---- | -------------- |
| その他      | イード  | 衝突したエンティティのイード |
