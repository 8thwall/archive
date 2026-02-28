---
id: behaviors
description: Un comportement est une fonction qui s'exécute sur le monde à chaque tic-tac.
sidebar_position: 4
---

# Comportements

## Introduction

Un comportement est une fonction qui s'exécute sur le [World](../world) à chaque tic-tac.

## Définir un comportement

Le code suivant est un exemple de définition d'un comportement personnalisé :

```ts
const behavior = (world) => {
  if (world.time.elapsed % 5000 - world.time.delta < 0) {
     const eid = world.createEntity()
     Enemy.set(world, eid, {health: 100})
  }
}
```

## Enregistrement d'un comportement

Le code suivant est un exemple d'enregistrement d'un comportement personnalisé :

```ts
ecs.registerBehavior(comportement)
```

## Désactiver un comportement

Le code suivant est un exemple de désactivation d'un comportement personnalisé :

```ts
ecs.unregisterBehavior(comportement)
```

## Requête sur le comportement

Les comportements peuvent exécuter des requêtes qui renvoient des listes d'identifiants d'entités.

```ts
const query = ecs.defineQuery([Enemy, Health])

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

## Systèmes

Les comportements peuvent également être structurés comme des systèmes, qui s'exécutent sur des entités correspondant à des requêtes spécifiques et permettent un accès efficace aux données.

:::tip
Cette approche améliore les performances car les données telles que l'"ennemi" et la "santé" sont prédéfinies, ce qui accélère l'itération.
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
