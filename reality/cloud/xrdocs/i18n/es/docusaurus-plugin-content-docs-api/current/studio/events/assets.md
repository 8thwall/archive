---
id: assets
---

# Eventos

## Modelo 3D

### GLTF_MODEL_LOADED

Se emite cuando se carga un modelo

#### Propiedades

| Propiedad | Tipo   | Descripción          |
| --------- | ------ | -------------------- |
| nombre    | cadena | El nombre del modelo |

#### Ejemplo (global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_MODEL_LOADED, (properties) => {
    console.log(properties.name);
});
```

#### Ejemplo (específico de una entidad)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_MODEL_LOADED, (properties) => {
    console.log(properties.name);
});
```

### GLTF_ANIMATION_FINISHED

Se emite cuando todos los bucles de un clip de animación han finalizado.

#### Propiedades

| Propiedad | Tipo   | Descripción               |
| --------- | ------ | ------------------------- |
| nombre    | cadena | El nombre de la animación |

#### Ejemplo (global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_ANIMATION_FINISHED, (properties) => {
    console.log(properties.name);
});
```

#### Ejemplo (específico de una entidad)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_ANIMATION_FINISHED, (properties) => {
    console.log(properties.name);
});
```

### GLTF_ANIMATION_LOOP

Se emite cuando ha finalizado un único bucle del clip de animación.

#### Propiedades

| Propiedad | Tipo   | Descripción               |
| --------- | ------ | ------------------------- |
| nombre    | cadena | El nombre de la animación |

#### Ejemplo (global)

```ts
world.events.addListener(world.events.globalId, ecs.events.GLTF_ANIMATION_LOOP, (properties) => {
    console.log(properties.name);
});
```

#### Ejemplo (específico de una entidad)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_ANIMATION_LOOP, (properties) => {
    console.log(properties.name);
});
```

## Splat gaussiano

### SPLAT_MODEL_LOADED

Se emite cuando se carga un Splat

#### Propiedades

| Propiedad | Tipo       | Descripción     |
| --------- | ---------- | --------------- |
| modelo    | SplatModel | El modelo Splat |

#### Ejemplo (global)

```ts
world.events.addListener(world.events.globalId, ecs.events.SPLAT_MODEL_LOADED, (model: SplatModel) => {
    console.log(model);
});
```

#### Ejemplo (específico de una entidad)

```ts
world.events.addListener(component.eid, ecs.events.GLTF_MODEL_LOADED, (model: SplatModel) => {
    console.log(model);
});
```

## Audio

### AUDIO_CAN_PLAY_THROUGH

Se emite cuando una entidad tiene la capacidad de reproducir Audio.

#### Propiedades

Ninguno

#### Ejemplo

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_CAN_PLAY_THROUGH, () => {
    console.log(`${component.eid} ya puede reproducir audio.`);
});
```

### AUDIO_END

Se emite cuando el audio ha terminado de reproducirse en una entidad.

#### Propiedades

Ninguno

#### Ejemplo

```ts
world.events.addListener(component.eid, ecs.events.AUDIO_END, (e) => {
    console.log(`${e.target} finished playing audio.`);
});
```

## Vídeo

### VIDEO_CAN_PLAY_THROUGH

Se emite cuando una entidad tiene la capacidad de reproducir el vídeo.

#### Propiedades

Ninguno

#### Ejemplo

```ts
world.events.addListener(component.eid, ecs.events.VIDEO_CAN_PLAY_THROUGH, (e) => {
    console.log(`${e.target} listo para reproducir vídeo.`);
});
```

### VIDEO_END

Se emite cuando el vídeo ha terminado de reproducirse en una entidad.

#### Propiedades

Ninguno

#### Ejemplo

```ts
world.events.addListener(component.eid, ecs.events.VIDEO_END, (e) => {
    console.log(`${e.target} finalizada la reproducción del vídeo.`);
});
```
