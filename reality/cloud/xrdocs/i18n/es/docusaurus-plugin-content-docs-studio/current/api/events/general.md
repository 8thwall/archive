---
id: general
sidebar_position: 3
---

# General Events

## Eventos

### GLTF_ANIMATION_FINISHED

Emitted when all loops of an animation clip have finished.

#### Propiedades

| Propiedad | Tipo   | Descripción               |
| --------- | ------ | ------------------------- |
| name      | string | The name of the animation |

#### Example (Global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_ANIMATION_FINISHED, (properties) => {
    console.log(properties.name);
});
```

#### Example (Entity Specific)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_ANIMATION_FINISHED, (properties) => {
    console.log(properties.name);
});
```

### GLTF_ANIMATION_LOOP

Emitted when a single loop of the animation clip has finished.

#### Propiedades

| Propiedad | Tipo   | Descripción               |
| --------- | ------ | ------------------------- |
| name      | string | The name of the animation |

#### Example (Global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_ANIMATION_LOOP, (properties) => {
    console.log(properties.name);
});
```

#### Example (Entity Specific)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_ANIMATION_LOOP, (properties) => {
    console.log(properties.name);
});
```

### GLTF_MODEL_LOADED

Emitted when a model has loaded

#### Propiedades

| Propiedad | Tipo   | Descripción           |
| --------- | ------ | --------------------- |
| name      | string | The name of the model |

#### Example (Global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_MODEL_LOADED, (properties) => {
    console.log(properties.name);
});
```

#### Example (Entity Specific)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_MODEL_LOADED, (properties) => {
    console.log(properties.name);
});
```

### SPLAT_MODEL_LOADED

Emitted when a Splat has loaded

#### Propiedades

| Propiedad | Tipo       | Descripción     |
| --------- | ---------- | --------------- |
| model     | SplatModel | The Splat model |

#### Example (Global)

```ts
world.events.addListener(world.events.globalId, ecs.events.SPLAT_MODEL_LOADED, (model: SplatModel) => {
    console.log(model);
});
```

#### Example (Entity Specific)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_MODEL_LOADED, (model: SplatModel) => {
    console.log(model);
});
```

### AUDIO_CAN_PLAY_THROUGH

Emitted when an entity has the capability to play Audio.

#### Propiedades

Ninguno

#### Ejemplo

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_CAN_PLAY_THROUGH, () => {
    console.log(`${component.eid} can now play audio.`);
});
```

### AUDIO_END

Emitted when audio has finished playing on an entity.

#### Propiedades

Ninguno

#### Ejemplo

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_END, () => {
    console.log(`${component.eid} finished playing audio.`);
});
```
