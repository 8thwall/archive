---
id: general
---

# Actos generales

## Eventos

### CAMBIO_ESPACIO_ACTIVO

Emitido cuando el mundo carga un Espacio (sin promesa de que el Espacio se cargue).

#### Propiedades

Ninguna.

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, ecs.events.ACTIVE_SPACE_CHANGE, () => {
    console.log('Cambio de espacio activo');
});
```

### UBICACIÓN_SPAWNED

Se emite cuando se crea una ubicación VPS en el mapa.

#### Propiedades

| Propiedad | Tipo   | Descripción                                                                  |
| --------- | ------ | ---------------------------------------------------------------------------- |
| id        | cadena | Identificador único de la ubicación                                          |
| imageUrl  | cadena | La imagen de ubicación                                                       |
| título    | cadena | El título del lugar                                                          |
| lat       | número | Latitud del lugar                                                            |
| lng       | número | Longitud del lugar                                                           |
| mapPoint  | Eid    | La entidad de punto de mapa generada bajo la que se emparentará el contenido |

#### Ejemplo (global)

```ts
world.events.addListener(world.events.globalId, ecs.events.LOCATION_SPAWNED, ({data}) => {
    console.log(data)
})
```

#### Ejemplo (específico de una entidad)

```ts
world.events.addListener(mapEid, ecs.events.LOCATION_SPAWNED, ({data}) => {
    console.log(data)
})
```

### realityready

Este evento se emite cuando 8th Wall Web se ha inicializado.

#### Propiedades

Ninguna.

#### Ejemplo

```ts
world.events.addListener(world.events.globalId, 'realityready', () => {
    console.log('realityready');
});
```
