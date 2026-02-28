---
id: assets
---

# Asset-Ereignisse

## 3D-Modell

### GLTF_MODEL_LOADED

Wird ausgegeben, wenn ein Modell geladen wurde

#### Eigenschaften

| Eigentum | Typ    | Beschreibung         |
| -------- | ------ | -------------------- |
| Name     | String | Der Name des Modells |

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

### GLTF_ANIMATION_BEENDET

Wird ausgegeben, wenn alle Schleifen eines Animationsclips beendet sind.

#### Eigenschaften

| Eigentum | Typ    | Beschreibung           |
| -------- | ------ | ---------------------- |
| Name     | String | Der Name der Animation |

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

| Eigentum | Typ    | Beschreibung           |
| -------- | ------ | ---------------------- |
| Name     | String | Der Name der Animation |

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

## Gaußscher Splat

### SPLAT_MODEL_LOADED

Wird ausgegeben, wenn ein Splat geladen wurde

#### Eigenschaften

| Eigentum | Typ        | Beschreibung     |
| -------- | ---------- | ---------------- |
| Modell   | SplatModel | Das Splat-Modell |

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

## Audio

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
world.events.addListener(component.eid, ecs.events.AUDIO_END, (e) => {
    console.log(`${e.target} finished playing audio.`);
});
```

## Video

### VIDEO_KAN_PLAY_THROUGH

Wird ausgesendet, wenn eine Entität die Fähigkeit hat, das Video abzuspielen.

#### Eigenschaften

Keine

#### Beispiel

```ts
world.events.addListener(component.eid, ecs.events.VIDEO_CAN_PLAY_THROUGH, (e) => {
    console.log(`${e.target} ready to play video.`);
});
```

### VIDEO_ENDE

Wird ausgegeben, wenn die Wiedergabe des Videos auf einer Entität beendet ist.

#### Eigenschaften

Keine

#### Beispiel

```ts
world.events.addListener(component.eid, ecs.events.VIDEO_END, (e) => {
    console.log(`${e.target} finished playing video.`);
});
```
