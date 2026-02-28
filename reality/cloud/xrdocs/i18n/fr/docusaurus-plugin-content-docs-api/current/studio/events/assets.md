---
id: assets
---

# Événements relatifs aux actifs

## Modèle 3D

### GLTF_MODEL_LOADED

Emis lorsqu'un modèle a été chargé

#### Propriétés

| Propriété | Type                 | Description      |
| --------- | -------------------- | ---------------- |
| nom       | chaîne de caractères | Le nom du modèle |

#### Exemple (global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_MODEL_LOADED, (properties) => {
    console.log(properties.name) ;
}) ;
```

#### Exemple (spécifique à l'entité)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_MODEL_LOADED, (properties) => {
    console.log(properties.name) ;
}) ;
```

### GLTF_ANIMATION_FINISHED

Emis lorsque toutes les boucles d'un clip d'animation sont terminées.

#### Propriétés

| Propriété | Type                 | Description           |
| --------- | -------------------- | --------------------- |
| nom       | chaîne de caractères | Le nom de l'animation |

#### Exemple (global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_ANIMATION_FINISHED, (properties) => {
    console.log(properties.name) ;
}) ;
```

#### Exemple (spécifique à l'entité)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_ANIMATION_FINISHED, (properties) => {
    console.log(properties.name) ;
}) ;
```

### GLTF_ANIMATION_LOOP

Emis lorsqu'une seule boucle du clip d'animation est terminée.

#### Propriétés

| Propriété | Type                 | Description           |
| --------- | -------------------- | --------------------- |
| nom       | chaîne de caractères | Le nom de l'animation |

#### Exemple (global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_ANIMATION_LOOP, (properties) => {
    console.log(properties.name) ;
}) ;
```

#### Exemple (spécifique à l'entité)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_ANIMATION_LOOP, (properties) => {
    console.log(properties.name) ;
}) ;
```

## Splat gaussien

### SPLAT_MODEL_LOADED

Emis lorsqu'un Splat a été chargé

#### Propriétés

| Propriété | Type       | Description     |
| --------- | ---------- | --------------- |
| modèle    | SplatModel | Le modèle Splat |

#### Exemple (global)

```ts
world.events.addListener(world.events.globalId, ecs.events.SPLAT_MODEL_LOADED, (model : SplatModel) => {
    console.log(model) ;
}) ;
```

#### Exemple (spécifique à l'entité)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_MODEL_LOADED, (model : SplatModel) => {
    console.log(model) ;
}) ;
```

## Audio

### AUDIO_CAN_PLAY_THROUGH

Emis lorsqu'une entité a la capacité de lire des fichiers audio.

#### Propriétés

Aucun

#### Exemple

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_CAN_PLAY_THROUGH, () => {
    console.log(`${component.eid} peut maintenant lire l'audio.`) ;
}) ;
```

### AUDIO_END

Emis lorsque la lecture de l'audio est terminée sur une entité.

#### Propriétés

Aucun

#### Exemple

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_END, (e) => {
    console.log(`${e.target} a terminé la lecture de l'audio.`) ;
}) ;
```

## Vidéo

### VIDEO_CAN_PLAY_THROUGH

Émis lorsqu'une entité a la capacité de lire la vidéo.

#### Propriétés

Aucun

#### Exemple

```ts
world.events.addListener(component.eid, ecs.events.VIDEO_CAN_PLAY_THROUGH, (e) => {
    console.log(`${e.target} ready to play video.`) ;
}) ;
```

### VIDEO_END

Emis lorsque la vidéo a fini d'être lue sur une entité.

#### Propriétés

Aucun

#### Exemple

```ts
world.events.addListener(component.eid, ecs.events.VIDEO_END, (e) => {
    console.log(`${e.target} a terminé la lecture de la vidéo.`) ;
}) ;
```
