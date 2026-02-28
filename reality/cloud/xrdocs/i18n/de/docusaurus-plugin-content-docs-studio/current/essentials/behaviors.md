---
id: behaviors
description: >-
  Ein Verhalten ist eine Funktion, die bei jedem Tick in der Welt ausgeführt
  wird.
sidebar_position: 4
---

# Verhaltensweisen

## Einführung

Ein Verhalten ist eine Funktion, die bei jedem Tick auf der [Welt](../world) ausgeführt wird.

## Definieren eines Verhaltens

Der folgende Code ist ein Beispiel dafür, wie man ein benutzerdefiniertes Verhalten definiert:

```ts
const behavior = (world) => {
  if (world.time.elapsed % 5000 - world.time.delta < 0) {
     const eid = world.createEntity()
     Enemy.set(world, eid, {health: 100})
  }
}
```

## Registrierung eines Verhaltens

Der folgende Code ist ein Beispiel dafür, wie man ein benutzerdefiniertes Verhalten registriert:

```ts
ecs.registerBehavior(Verhalten)
```

## Deaktivieren eines Verhaltens

Der folgende Code ist ein Beispiel dafür, wie ein benutzerdefiniertes Verhalten deaktiviert werden kann:

```ts
ecs.unregisterBehavior(Verhalten)
```

## Abfrage des Verhaltens

Verhaltensmuster können Abfragen ausführen, die Listen von Entitäts-IDs zurückgeben.

```ts
const query = ecs.defineQuery([Feind, Gesundheit])

const enemyDieBehavior = (world) => {
  const enemies = query(world)

  for (const enemyId of enemies) {
    if (Health.get(world, enemyId).hp <= 0) {
      world.destroyEntity(enemyId)
    }
  }
}

ecs.registerBehavior(enemyDieBehavior)
```

## Systeme

Verhaltensweisen können auch als Systeme strukturiert werden, die auf Entitäten laufen, die bestimmten Abfragen entsprechen und einen effizienten Datenzugriff ermöglichen.

:::tip
Dieser Ansatz verbessert die Leistung, da Daten wie "Feind" und "Gesundheit" im Voraus abgefragt werden, was die Iteration beschleunigt.
:::

```ts
const enemyDieSystem = ecs.defineSystem([Enemy, Health], 
  (world, eid, [enemy, health]) => {
    if (health.hp <= 0) {
      world.destroyEntity(eid)
    }
  }
)

ecs.registerBehavior(enemyDieSystem)
```
