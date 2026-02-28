---
id: vps
sidebar_position: 1
---

# Événements VPS

## Evénements

### lieu trouvé

Cet événement est émis lorsqu'un emplacement de projet est trouvé pour la première fois.

#### Propriétés

| Propriété | Type           | Description                                                                                                  |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| nom       | `Chaîne`       | Le nom de l'emplacement du projet.                                                           |
| position  | `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                                          |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.locationfound', (e) => {
    console.log(e)
})
```

### localisationperdue

Cet événement est émis lorsqu'un lieu de projet n'est plus suivi.

#### Propriétés

| Propriété | Type           | Description                                                                                                  |
| --------- | -------------- | ------------------------------------------------------------------------------------------------------------ |
| nom       | `Chaîne`       | Le nom de l'emplacement du projet.                                                           |
| position  | `{x, y, z}`    | La position 3d de l'emplacement du projet localisé.                                          |
| rotation  | `{w, x, y, z}` | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.locationlost', (e) => {
    console.log(e)
})
```

### recherche de lieux

Cet événement est émis lorsque tous les emplacements de projet ont été chargés pour la numérisation.

#### Propriétés

| Propriété | Type                                  | Description                                                        |
| --------- | ------------------------------------- | ------------------------------------------------------------------ |
| lieux     | [`[LocationObject]`](#LocationObject) | Un tableau d'objets contenant des informations sur la localisation |

##### LocationObject {#LocationObject}

`LocationObject` est un objet ayant les propriétés suivantes :

| Propriété | Type     | Description                                                                        |
| --------- | -------- | ---------------------------------------------------------------------------------- |
| id        | `Chaîne` | Un identifiant pour cet emplacement de projet qui est stable au sein d'une session |
| nom       | `Chaîne` | Nom de l'emplacement du projet.                                    |
| imageUrl  | `Chaîne` | URL d'une image représentative de l'emplacement du projet.         |
| titre     | `Chaîne` | Titre de l'emplacement du projet.                                  |
| lat       | `Nombre` | Latitude de l'emplacement du projet.                               |
| lng       | `Nombre` | Longitude de l'emplacement du projet.                              |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.locationscanning', (e) => {
    console.log(e)
})
```

### trouvaille de mailles

Cet événement est émis lorsqu'une maille est trouvée pour la première fois, soit après le démarrage, soit après un `recenter()`.

#### Propriétés

| Propriété | Type                                                    | Description                                                                                                                                                            |
| --------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `Chaîne`                                                | Un identifiant pour ce maillage qui est stable au sein d'une session.                                                                                  |
| position  | `{x, y, z}`                                             | La position 3d de l'emplacement du projet localisé.                                                                                                    |
| rotation  | `{w, x, y, z}`                                          | L'orientation locale 3D (quaternion) de l'emplacement du projet localisé.                                                           |
| géométrie | `GeometryObject` (objet géométrique) | Un objet contenant des données brutes sur la géométrie du maillage. Les attributs contiennent des attributs de position et de couleur. |

##### Objet géométrique {#GeometryObject}

| Propriété | Type                                              | Description                                                                           |
| --------- | ------------------------------------------------- | ------------------------------------------------------------------------------------- |
| index     | `Chaîne`                                          | Un identifiant pour ce maillage qui est stable au sein d'une session. |
| attributs | `[PositionAttributeObject, ColorAttributeObject]` | Les données géométriques brutes du maillage.                          |

##### PositionAttributeObject {#PositionAttributeObject}

| Propriété | Type             | Description                                                  |
| --------- | ---------------- | ------------------------------------------------------------ |
| nom       | `Chaîne`         | Le nom de l'objet                                            |
| réseau    | `Float32Array()` | Les données géométriques brutes du maillage. |
| itemSize  | `Integer`        | Le nombre d'éléments dans l'objet                            |

##### ColorAttributeObject {#ColorAttributeObject}

| Propriété | Type             | Description                                                  |
| --------- | ---------------- | ------------------------------------------------------------ |
| nom       | `Chaîne`         | Le nom de l'objet                                            |
| réseau    | `Float32Array()` | Les données géométriques brutes du maillage. |
| itemSize  | `Integer`        | Le nombre d'éléments dans l'objet                            |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.meshfound', (e) => {
    console.log(e)
})
```

### meshlost

Cet événement est émis lorsque la fonction `recenter()` est appelée.

#### Propriétés

| Propriété | Type     | Description                                                                           |
| --------- | -------- | ------------------------------------------------------------------------------------- |
| id        | `Chaîne` | Un identifiant pour ce maillage qui est stable au sein d'une session. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.meshlost', (e) => {
    console.log(e)
})
```
