---
id: general
---

# Événements généraux

## Evénements

### CHANGEMENT_D'ESPACE_ACTIF

Emis lorsque le monde charge un espace (sans promesse de chargement de l'espace).

#### Propriétés

Aucun.

#### Exemple

```ts
world.events.addListener(world.events.globalId, ecs.events.ACTIVE_SPACE_CHANGE, () => {
    console.log('Active space change') ;
}) ;
```

### LOCATION_SPAWNED

Emis lorsqu'un emplacement VPS est créé sur la carte.

#### Propriétés

| Propriété | Type                 | Description                                                                      |
| --------- | -------------------- | -------------------------------------------------------------------------------- |
| id        | chaîne de caractères | L'identifiant unique du lieu                                                     |
| imageUrl  | chaîne de caractères | L'image de l'emplacement                                                         |
| titre     | chaîne de caractères | Le titre de l'emplacement                                                        |
| lat       | nombre               | Latitude du lieu                                                                 |
| lng       | nombre               | Longitude du lieu                                                                |
| mapPoint  | Aïd                  | L'entité de point de carte engendrée sous laquelle votre contenu doit être placé |

#### Exemple (global)

```ts
world.events.addListener(world.events.globalId, ecs.events.LOCATION_SPAWNED, ({data}) => {
    console.log(data)
})
```

#### Exemple (spécifique à l'entité)

```ts
world.events.addListener(mapEid, ecs.events.LOCATION_SPAWNED, ({data}) => {
    console.log(data)
})
```

### prêt pour la réalité

Cet événement est émis lorsque 8th Wall Web a été initialisé.

#### Propriétés

Aucun.

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'realityready', () => {
    console.log('realityready') ;
}) ;
```
