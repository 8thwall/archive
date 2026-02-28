---
id: face
sidebar_position: 2
---

# Événements de visage

## Evénements

### face à face

Cet événement est émis par Face Effects lorsqu'un visage est trouvé pour la première fois.

#### Propriétés

| Propriété            | Type                                  | Description                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | `Nombre`                              | Un identifiant numérique de la face localisée                                                                                                                                                                                                                                                                                                                        |
| transformer          | [`TransformObject`](#TransformObject) | Informations sur la transformation du visage localisé.                                                                                                                                                                                                                                                                                               |
| sommets              | `[{x, y, z}]`                         | Position des points du visage par rapport à la transformation.                                                                                                                                                                                                                                                                                       |
| normales             | `[{x, y, z}]`                         | Direction normale des sommets, par rapport à la transformation.                                                                                                                                                                                                                                                                                      |
| points d'attachement | `{ nom, position : {x,y,z} }`         | Voir [`XR8.FaceController.AttachmentPoints`] (https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) pour la liste des points d'attache disponibles. `position` est relative à la transformation. |
| uvsInCameraFrame     | `[{u, v}]`                            | La liste des positions uv dans l'image de la caméra correspondant aux points de vertex renvoyés.                                                                                                                                                                                                                                                     |

##### TransformObject {#TransformObject}

| Propriété                   | Type           | Description                                                                                  |
| --------------------------- | -------------- | -------------------------------------------------------------------------------------------- |
| position                    | `{x, y, z}`    | La position 3D du visage situé.                                              |
| rotation                    | `{w, x, y, z}` | L'orientation locale en 3D du visage localisé.                               |
| échelle                     | `Nombre`       | Facteur d'échelle à appliquer aux objets attachés à ce visage.               |
| largeur mise à l'échelle    | `Nombre`       | Largeur approximative de la tête dans la scène, multipliée par l'échelle.    |
| hauteur mise à l'échelle    | `Nombre`       | Hauteur approximative de la tête dans la scène, multipliée par l'échelle.    |
| profondeur mise à l'échelle | `Nombre`       | Profondeur approximative de la tête dans la scène, multipliée par l'échelle. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facefound', (e) => {
    console.log(e)
})
```

### chargement frontal

Cet événement est émis par Face Effects lorsque le chargement commence pour des ressources AR supplémentaires.

#### Propriétés

| Propriété          | Type          | Description                                                                                                                                         |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | `Nombre`      | Nombre maximal de visages pouvant être traités simultanément.                                                                       |
| pointsParDetection | `Nombre`      | Nombre de sommets qui seront extraits par visage.                                                                                   |
| indices            | `[{a, b, c}]` | Index dans le tableau des sommets qui forment les triangles du maillage demandé, comme spécifié avec meshGeometry en configuration. |
| uvs                | `[{u, v}]`    | Les positions uv dans une carte de texture correspondant aux points de vertex retournés.                                            |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceloading', (e) => {
    console.log(e)
})
```

### facelost

Cet événement est émis par Face Effects lorsqu'un visage n'est plus suivi.

#### Propriétés

| Propriété | Type     | Description                                            |
| --------- | -------- | ------------------------------------------------------ |
| id        | `Nombre` | Identifiant numérique du visage perdu. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facelost', (e) => {
    console.log(e)
})
```

### numérisation des visages

Cet événement est émis par Face Effects lorsque toutes les ressources AR du visage ont été chargées et que le balayage a commencé.

#### Propriétés

| Propriété          | Type          | Description                                                                                                                                         |
| ------------------ | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| maxDetections      | `Nombre`      | Nombre maximal de visages pouvant être traités simultanément.                                                                       |
| pointsParDetection | `Nombre`      | Nombre de sommets qui seront extraits par visage.                                                                                   |
| indices            | `[{a, b, c}]` | Index dans le tableau des sommets qui forment les triangles du maillage demandé, comme spécifié avec meshGeometry en configuration. |
| uvs                | `[{u, v}]`    | Les positions uv dans une carte de texture correspondant aux points de vertex retournés.                                            |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.facescanning', (e) => {
    console.log(e)
})
```

### faceupdated

Cet événement est émis par Face Effects lorsque des visages sont trouvés par la suite.

#### Propriétés

| Propriété            | Type                                  | Description                                                                                                                                                                                                                                                                                                                                                          |
| -------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id                   | `Nombre`                              | Un identifiant numérique de la face localisée                                                                                                                                                                                                                                                                                                                        |
| transformer          | [`TransformObject`](#TransformObject) | Informations sur la transformation du visage localisé.                                                                                                                                                                                                                                                                                               |
| sommets              | `[{x, y, z}]`                         | Position des points du visage par rapport à la transformation.                                                                                                                                                                                                                                                                                       |
| normales             | `[{x, y, z}]`                         | Direction normale des sommets, par rapport à la transformation.                                                                                                                                                                                                                                                                                      |
| points d'attachement | `{ nom, position : {x,y,z} }`         | Voir [`XR8.FaceController.AttachmentPoints`] (https://www.8thwall.com/docs/api/facecontroller/attachmentpoints/) pour la liste des points d'attache disponibles. `position` est relative à la transformation. |
| uvsInCameraFrame     | `[{u, v}]`                            | La liste des positions uv dans l'image de la caméra correspondant aux points de vertex renvoyés.                                                                                                                                                                                                                                                     |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.faceupdated', (e) => {
    console.log(e)
})
```

### a cligné des yeux

Cet événement est émis par Face Effects lorsque les yeux d'un visage suivi clignotent.

#### Propriétés

| Propriété | Type     | Description                                   |
| --------- | -------- | --------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.blinked', (e) => {
    console.log(e)
})
```

### distance interpupillaire

Cet événement est émis par Face Effects lorsque la distance en millimètres entre les centres de chaque pupille d'un visage suivi est détectée pour la première fois.

#### Propriétés

| Propriété                | Type     | Description                                                                                |
| ------------------------ | -------- | ------------------------------------------------------------------------------------------ |
| id                       | `Nombre` | Un identifiant numérique du visage localisé.                               |
| distance interpupillaire | `Nombre` | Distance approximative en millimètres entre les centres de chaque pupille. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.interpupillarydistance', (e) => {
    console.log(e)
})
```

### lefteyebrowlowered

Cet événement est émis par Face Effects lorsque la distance en millimètres entre les centres de chaque pupille d'un visage suivi est détectée pour la première fois.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowlowered', (e) => {
    console.log(e)
})
```

### lefteyebrowraised

Cet événement est émis par Face Effects lorsque le sourcil gauche d'un visage suivi est relevé par rapport à sa position initiale lorsque le visage a été trouvé.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyebrowraised', (e) => {
    console.log(e)
})
```

### lefteyeclosed

Cet événement est émis par Face Effects lorsque l'œil gauche d'un visage suivi se ferme.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeclosed', (e) => {
    console.log(e)
})
```

### lefteyeopened

Cet événement est émis par Face Effects lorsque l'œil gauche d'un visage suivi s'ouvre.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyeopened', (e) => {
    console.log(e)
})
```

### lefteyewinked

Cet événement est émis par Face Effects lorsque l'œil gauche d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil droit reste ouvert.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.lefteyewinked', (e) => {
    console.log(e)
})
```

### bouche fermée

Cet événement est émis par Face Effects lorsque la bouche d'un visage suivi se ferme.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthclosed', (e) => {
    console.log(e)
})
```

### ouvert à la bouche

Cet événement est émis par Face Effects lorsque la bouche d'un visage suivi s'ouvre.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.mouthopened', (e) => {
    console.log(e)
})
```

### droit de l'hippocampe

Cet événement est émis par Face Effects lorsque le sourcil droit d'un visage suivi est abaissé à sa position initiale lorsque le visage a été trouvé.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowlowered', (e) => {
    console.log(e)
})
```

### sourcils droits

Cet événement est émis par Face Effects lorsque le sourcil droit d'un visage suivi est relevé par rapport à sa position initiale lorsque le visage a été trouvé.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyebrowraised', (e) => {
    console.log(e)
})
```

### droit fermé

Cet événement est émis par Face Effects lorsque l'œil droit d'un visage suivi se ferme.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeclosed', (e) => {
    console.log(e)
})
```

### œil droit ouvert

Cet événement est émis par Face Effects lorsque l'œil droit d'un visage suivi s'ouvre.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyeopened', (e) => {
    console.log(e)
})
```

### droit-de-l'hommiste

Cet événement est émis par Face Effects lorsque l'œil droit d'un visage suivi se ferme et s'ouvre dans un délai de 750 ms alors que l'œil gauche reste ouvert.

#### Propriétés

| Propriété | Type     | Description                                                  |
| --------- | -------- | ------------------------------------------------------------ |
| id        | `Nombre` | Un identifiant numérique du visage localisé. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.righteyewinked', (e) => {
    console.log(e)
})
```

### point d'écoute trouvé

Cet événement est émis par Face Effects lorsqu'un point d'oreille est trouvé.

#### Propriétés

| Propriété | Type     | Description                                                                                                                                                                                     |
| --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée                                                                                                                                                   |
| point     | `Chaîne` | Nom du point d'oreille. L'un des éléments suivants : `Lobe gauche`, `Canal gauche`, `Hélix gauche`, `Lobe droit`, `Canal droit`, `Hélix droit`. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```

### perte d'oreille

Cet événement est émis par Face Effects lorsqu'un point d'oreille est perdu.

#### Propriétés

| Propriété | Type     | Description                                                                                                                                                                                     |
| --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| id        | `Nombre` | Un identifiant numérique de la face localisée                                                                                                                                                   |
| point     | `Chaîne` | Nom du point d'oreille. L'un des éléments suivants : `Lobe gauche`, `Canal gauche`, `Hélix gauche`, `Lobe droit`, `Canal droit`, `Hélix droit`. |

#### Exemple

```ts
world.events.addListener(world.events.globalId, 'facecontroller.earpointfound', (e) => {
    console.log(e)
})
```
