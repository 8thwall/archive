---
id: general
sidebar_position: 3
---

# Allgemeine Ereignisse

## Ereignisse

### GLTF_ANIMATION_BEENDET

Wird ausgegeben, wenn alle Schleifen eines Animationsclips beendet sind.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung           |
| ----------- | ------ | ---------------------- |
| name        | String | Der Name der Animation |

#### Beispiel (Global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_ANIMATION_FINISHED, (properties) => {
    console.log(properties.name);
});
```

#### Beispiel (Entitätsspezifisch)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_ANIMATION_FINISHED, (properties) => {
    console.log(properties.name);
});
```

### GLTF_ANIMATION_SCHLEIFE

Wird ausgegeben, wenn eine einzelne Schleife des Animationsclips beendet ist.

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung           |
| ----------- | ------ | ---------------------- |
| name        | String | Der Name der Animation |

#### Beispiel (Global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_ANIMATION_LOOP, (properties) => {
    console.log(properties.name);
});
```

#### Beispiel (Entitätsspezifisch)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_ANIMATION_LOOP, (properties) => {
    console.log(properties.name);
});
```

### GLTF_MODEL_LOADED

Wird ausgegeben, wenn ein Modell geladen wurde

#### Eigenschaften

| Eigenschaft | Typ    | Beschreibung         |
| ----------- | ------ | -------------------- |
| name        | String | Der Name des Modells |

#### Beispiel (Global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_MODEL_LOADED, (properties) => {
    console.log(properties.name);
});
```

#### Beispiel (Entitätsspezifisch)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_MODEL_LOADED, (properties) => {
    console.log(properties.name);
});
```

### SPLAT_MODEL_LOADED

Wird ausgegeben, wenn ein Splat geladen wurde

#### Eigenschaften

| Eigenschaft | Typ        | Beschreibung     |
| ----------- | ---------- | ---------------- |
| model       | SplatModel | Das Splat-Modell |

#### Beispiel (Global)

```ts
world.events.addListener(world.events.globalId, ecs.events.SPLAT_MODEL_LOADED, (model: SplatModel) => {
    console.log(model);
});
```

#### Beispiel (Entitätsspezifisch)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_MODEL_LOADED, (model: SplatModel) => {
    console.log(model);
});
```

### AUDIO_CAN_PLAY_THROUGH

Wird ausgegeben, wenn eine Entität die Fähigkeit hat, Audio abzuspielen.

#### Eigenschaften

Keine

#### Beispiel

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_CAN_PLAY_THROUGH, () => {
    console.log(`${component.eid} can now play audio.`);
});
```

### AUDIO_END

Wird ausgegeben, wenn die Audiowiedergabe auf einer Entität beendet ist.

#### Eigenschaften

Keine

#### Beispiel

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_END, () => {
    console.log(`${component.eid} finished playing audio.`);
});
```
