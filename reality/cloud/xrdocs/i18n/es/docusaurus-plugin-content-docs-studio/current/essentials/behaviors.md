---
id: behaviors
description: Un comportamiento es una función que se ejecuta en el Mundo cada tick.
sidebar_position: 4
---

# Comportamientos

## Introducción

Un comportamiento es una función que se ejecuta en el [Mundo](../world) cada tick.

## Definir un comportamiento

El siguiente código es un ejemplo de cómo definir un comportamiento personalizado:

```ts
const behavior = (world) => {
  if (world.time.elapsed % 5000 - world.time.delta < 0) {
     const eid = world.createEntity()
     Enemy.set(world, eid, {health: 100})
  }
}
```

## Registrar un comportamiento

El siguiente código es un ejemplo de cómo registrar un comportamiento personalizado:

```ts
ecs.registerBehavior(comportamiento)
```

## Desactivar un comportamiento

El siguiente código es un ejemplo de cómo desactivar un comportamiento personalizado:

```ts
ecs.unregisterBehavior(comportamiento)
```

## Consulta de comportamiento

Los comportamientos pueden ejecutar consultas, que devuelven listas de ID de entidades.

```ts
const query = ecs.defineQuery([Enemigo, Salud])

const enemyDieBehavior = (mundo) => {
  const enemigos = query(mundo)

  for (const enemigoId de enemigos) {
    if (Salud.get(mundo, enemigoId).hp <= 0) {
      mundo.destruirEntidad(enemigoId)
    }
  }
}

ecs.registerBehavior(enemyDieBehavior)
```

## Sistemas

Los comportamientos también pueden estructurarse como Sistemas, que se ejecutan en entidades que coinciden con consultas específicas y permiten un acceso eficiente a los datos.

:::tip
Este enfoque mejora el rendimiento porque los datos como "enemigo" y "salud" están preconfigurados, lo que hace que la iteración sea más rápida.
:::

```ts
const enemyDieSystem = ecs.defineSystem([Enemigo, Salud], 
  (mundo, eid, [enemigo, salud]) => {
    if (salud.hp <= 0) {
      mundo.destruirEntidad(eid)
    }
  }
)

ecs.registerBehavior(enemyDieSystem)
```
