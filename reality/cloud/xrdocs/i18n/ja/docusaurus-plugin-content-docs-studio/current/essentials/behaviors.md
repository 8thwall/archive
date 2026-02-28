---
id: behaviors
description: ビヘイビアとは、ワールド上で1ティックごとに実行される関数のことである。
sidebar_position: 4
---

# 行動

## はじめに

ビヘイビアとは、ティックごとに[World](../world)上で実行される関数のことです。

## 行動の定義

次のコードは、カスタムビヘイビアを定義する方法の例です：

```ts
const behavior = (world) => {
  if (world.time.elapsed % 5000 - world.time.delta < 0) {
     const eid = world.createEntity()
     Enemy.set(world, eid, {health: 100})
  }.
}
```

## 行動の登録

次のコードは、カスタムビヘイビアを登録する方法の例です：

```ts
ecs.registerBehavior(振る舞い)
```

## ビヘイビアを無効にする

次のコードは、カスタムビヘイビアを無効にする方法の例です：

```ts
ecs.unregisterBehavior(振る舞い)
```

## ビヘイビア・クエリー

ビヘイビアは、エンティティIDのリストを返すクエリを実行できます。

```ts
const query = ecs.defineQuery([Enemy, Health])

const enemyDieBehavior = (world) => {
  const enemies = query(world)

  for (const enemyId in enemies) {
    if (Health.get(world, enemyId).hp <= 0) {
      world.destroyEntity(enemyId)
    }.
  }
}

ecs.registerBehavior(enemyDieBehavior)
```

## システム

ビヘイビアは、特定のクエリにマッチするエンティティ上で実行され、効率的なデータアクセスを可能にするシステムとして構造化することもできる。

:::tip
このアプローチでは、"敵 "や "ヘルス "といったデータがあらかじめフェッチされているため、パフォーマンスが向上し、反復が速くなる。
:::

```ts
const enemyDieSystem = ecs.defineSystem([Enemy, Health], 
  (world, eid, [enemy, health]) => {
    if (health.hp <= 0) {
      world.destroyEntity(eid)
    }.
  }
)

ecs.registerBehavior(enemyDieSystem)
```
