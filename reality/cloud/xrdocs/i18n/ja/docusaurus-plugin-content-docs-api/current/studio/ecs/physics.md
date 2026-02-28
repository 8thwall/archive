---
id: physics
---

# 物理学

## 説明

このライブラリには、エンティティに物理演算を適用したり、コライダーを設定したりするメソッドがあります。

## 機能

### applyForce

物理コライダーがあれば、どんなエンティティにも直接力（リニアと角度）を加えることができます。
これらの力は、一定の間隔で行われる次の物理シミュレーションの更新で適用される。
この関数は、力の方向と大きさを定義する3Dベクトルを受け付ける。

```ts
ecs.physics.applyForce(world, eid, forceX, forceY, forceZ) // -> void
```

### applyImpulse

この関数は、物理コライダーに1回限りのインパルス力を適用し、与えられたインパルスベクトルに基づいてその速度を変更するために使用されます。
この方法は、ジャンプやパンチ、突然のプッシュなど、素早いワンアクションの反応が必要な競技に有効だ。

```ts
ecs.physics.applyImpulse(world, eid, impulseX, impulseY, impulseZ) // -> void
```

### applyTorque

物理コライダーがあれば、どんなエンティティにも直接力（リニアと角度）を加えることができます。
これらの力は、一定の間隔で行われる次の物理シミュレーションの更新で適用される。
この関数は、力の方向と大きさを定義する3Dベクトルを受け付ける。

```ts
ecs.physics.applyTorque(world, eid, torqueX, torqueY, torqueZ) // -> void
```

### getWorldGravity

これは、シーン内のすべてのオブジェクトに適用されている現在の重力力を返すシンプルなゲッター関数です。
戻り値は、関数が実行された時間によって変わるかもしれない。

```ts
ecs.physics.getWorldGravity(world) // -> number
```

### RegisterConvexShape

凸形状を登録する。

```ts
ecs.physics.registerConvexShape(world, vertices) // -> 登録された形状のeid
```

### getAngularVelocity

エンティティの直線速度を取得する。

```ts
ecs.physics.getLinearVelocity(world, eid) // →数値
```

### setAngularVelocity

エンティティの角速度を設定する。

```ts
ecs.physics.setAngularVelocity(world, eid) // -> {x: number, y: number, z: number}
```

### getLinearVelocity

エンティティの直線速度を取得する。

```ts
ecs.physics.getLinearVelocity(world, eid) // -> {x: number, y: number, z: number}
```

### setLinearVelocity

エンティティの直線速度を設定する。

```ts
ecs.physics.setLinearVelocity(world, eid, velocityX, velocityY, velocityZ) // -> void
```

### getWorldGravity

世界の重力を手に入れる。

```ts
ecs.physics.getWorldGravity(world, gravity) // -> 数
```

### setWorldGravity

世界の重力を設定する。

```ts
ecs.physics.setWorldGravity(world, gravity) // -> void
```

### UnregisterConvexShape

凸形状の登録を解除する。

```ts
ecs.physics.unregisterConvexShape(world, id) // -> void
```
