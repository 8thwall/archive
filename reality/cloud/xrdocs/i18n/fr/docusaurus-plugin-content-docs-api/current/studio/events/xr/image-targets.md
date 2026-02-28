---
id: image-targets
sidebar_position: 2
---

# Image Target Events

## Types {#types}

### ImagePropertiesObject {#ImagePropertiesObject}

`ImagePropertiesObject` est un objet ayant les propriétés suivantes :

| Propriété         | Type                                  | Description                                                   |
| ----------------- | ------------------------------------- | ------------------------------------------------------------- |
| largeur           | `Nombre`                              | Largeur de l'image cible.                     |
| hauteur           | `Nombre`                              | Hauteur de la cible de l'image.               |
| largeur originale | `Nombre`                              | Largeur de l'image téléchargée.               |
| hauteur originale | `Nombre`                              | Hauteur de l'image téléchargée.               |
| isRotated         | `bolean` (booléen) | Indique si la cible de l'image a été tournée. |

## Evénements

### imagefound {#imagefound}

Cet événement est émis lorsqu'une cible d'image est trouvée pour la première fois.

#### Propriétés

| Propriété                | Type                                              | Description                                                                                                                       |
| ------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| nom                      | `Chaîne`                                          | Nom de l'image.                                                                                                   |
| type                     | `Chaîne`                                          | Un des éléments suivants : `PLAT`, `CYLINDRIQUE`, `CONIQUE`.                                      |
| position                 | `{x, y, z}`                                       | La position 3D de l'image localisée.                                                                              |
| rotation                 | `{w, x, y, z}`                                    | L'orientation locale 3D de l'image localisée.                                                                     |
| échelle                  | `Nombre`                                          | Facteur d'échelle à appliquer aux objets attachés à cette image.                                                  |
| propriétés               | [`ImagePropertiesObject`](#ImagePropertiesObject) | Propriétés supplémentaires de la cible de l'image.                                                                |
| largeur mise à l'échelle | `Nombre`                                          | **Seulement applicable à `FLAT`**. La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre`                                          | **Seulement applicable à `FLAT`**. Hauteur de l'image dans la scène, multipliée par l'échelle.    |
| hauteur                  | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Hauteur de la cible incurvée.             |
| radiusTop                | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Rayon de la cible incurvée en haut.       |
| radiusBottom             | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Rayon de la cible incurvée en bas.        |
| arcStartRadians          | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Angle de départ en radians.               |
| arcLengthRadians         | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Angle central en radians.                 |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.imagefound', (e) => {
    console.log(e)
})
```

### Imageloading {#imageloading}

Cet événement est émis lorsque le chargement de l'image de détection commence.

#### Propriétés

| Propriété   | Type     | Description                                                                                  |
| ----------- | -------- | -------------------------------------------------------------------------------------------- |
| nom         | `Chaîne` | Nom de l'image.                                                              |
| type        | `Chaîne` | Un des éléments suivants : `PLAT`, `CYLINDRIQUE`, `CONIQUE`. |
| métadonnées | `Objet`  | Métadonnées de l'utilisateur.                                                |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.imageloading', (e) => {
    console.log(e)
})
```

### imagelost {#imagelost}

Cet événement est émis lorsqu'une cible d'image n'est plus suivie.

#### Propriétés

| Propriété                | Type                                              | Description                                                                                                                       |
| ------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| nom                      | `Chaîne`                                          | Nom de l'image.                                                                                                   |
| type                     | `Chaîne`                                          | Un des éléments suivants : `PLAT`, `CYLINDRIQUE`, `CONIQUE`.                                      |
| position                 | `{x, y, z}`                                       | La position 3D de l'image localisée.                                                                              |
| rotation                 | `{w, x, y, z}`                                    | L'orientation locale 3D de l'image localisée.                                                                     |
| échelle                  | `Nombre`                                          | Facteur d'échelle à appliquer aux objets attachés à cette image.                                                  |
| propriétés               | [`ImagePropertiesObject`](#ImagePropertiesObject) | Propriétés supplémentaires de la cible de l'image.                                                                |
| largeur mise à l'échelle | `Nombre`                                          | **Seulement applicable à `FLAT`**. La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre`                                          | **Seulement applicable à `FLAT`**. Hauteur de l'image dans la scène, multipliée par l'échelle.    |
| hauteur                  | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Hauteur de la cible incurvée.             |
| radiusTop                | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Rayon de la cible incurvée en haut.       |
| radiusBottom             | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Rayon de la cible incurvée en bas.        |
| arcStartRadians          | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Angle de départ en radians.               |
| arcLengthRadians         | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Angle central en radians.                 |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.imagelost', (e) => {
    console.log(e)
})
```

### images numérisation {#imagescanning}

Cet événement est émis lorsque toutes les images de détection ont été chargées et que le balayage a commencé.

#### Propriétés

| Propriété                | Type     | Description                                                                                                                                                                                                                                                                 |
| ------------------------ | -------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| nom                      | `Chaîne` | Nom de l'image.                                                                                                                                                                                                                                             |
| type                     | `Chaîne` | Un des éléments suivants : `PLAT`, `CYLINDRIQUE`, `CONIQUE`.                                                                                                                                                                                |
| métadonnées              | `Objet`  | Métadonnées de l'utilisateur.                                                                                                                                                                                                                               |
| géométrie                | `Objet`  | Objet contenant des données géométriques. Si type=FLAT : `{scaledWidth, scaledHeight}`, sinon si type=CYLINDRICAL ou type=CONICAL : `{height, radiusTop, radiusBottom, arcStartRadians, arcLengthRadians}`. |
| largeur mise à l'échelle | `Nombre` | **Seulement applicable à `FLAT`**. La largeur de l'image dans la scène, multipliée par l'échelle.                                                                                                                                           |
| hauteur mise à l'échelle | `Nombre` | **Seulement applicable à `FLAT`**. Hauteur de l'image dans la scène, multipliée par l'échelle.                                                                                                                                              |
| hauteur                  | `Nombre` | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Hauteur de la cible incurvée.                                                                                                                                                       |
| radiusTop                | `Nombre` | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Rayon de la cible incurvée en haut.                                                                                                                                                 |
| radiusBottom             | `Nombre` | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Rayon de la cible incurvée en bas.                                                                                                                                                  |
| arcStartRadians          | `Nombre` | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Angle de départ en radians.                                                                                                                                                         |
| arcLengthRadians         | `Nombre` | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Angle central en radians.                                                                                                                                                           |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.imagescanning', (e) => {
    console.log(e)
})
```

### imageupdated {#imageupdated}

Cet événement est émis lorsqu'une cible d'image change de position, de rotation ou d'échelle.

#### Propriétés

| Propriété                | Type                                              | Description                                                                                                                       |
| ------------------------ | ------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| nom                      | `Chaîne`                                          | Nom de l'image.                                                                                                   |
| type                     | `Chaîne`                                          | Un des éléments suivants : `PLAT`, `CYLINDRIQUE`, `CONIQUE`.                                      |
| position                 | `{x, y, z}`                                       | La position 3D de l'image localisée.                                                                              |
| rotation                 | `{w, x, y, z}`                                    | L'orientation locale 3D de l'image localisée.                                                                     |
| échelle                  | `Nombre`                                          | Facteur d'échelle à appliquer aux objets attachés à cette image.                                                  |
| propriétés               | [`ImagePropertiesObject`](#ImagePropertiesObject) | Propriétés supplémentaires de la cible de l'image.                                                                |
| largeur mise à l'échelle | `Nombre`                                          | **Seulement applicable à `FLAT`**. La largeur de l'image dans la scène, multipliée par l'échelle. |
| hauteur mise à l'échelle | `Nombre`                                          | **Seulement applicable à `FLAT`**. Hauteur de l'image dans la scène, multipliée par l'échelle.    |
| hauteur                  | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Hauteur de la cible incurvée.             |
| radiusTop                | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Rayon de la cible incurvée en haut.       |
| radiusBottom             | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Rayon de la cible incurvée en bas.        |
| arcStartRadians          | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Angle de départ en radians.               |
| arcLengthRadians         | `Nombre`                                          | **Uniquement applicable à `CYLINDRICAL` ou `CONICAL`**. Angle central en radians.                 |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'reality.imageupdated', (e) => {
    console.log(e)
})
```
