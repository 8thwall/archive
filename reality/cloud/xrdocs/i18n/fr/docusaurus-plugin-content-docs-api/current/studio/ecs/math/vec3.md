---
id: vec3
---

# vec3

Interface représentant un vecteur 3D. Un vecteur 3D est représenté par des coordonnées (x, y, z) et peut représenter un point dans l'espace, un vecteur directionnel ou d'autres types de données à trois dimensions ordonnées. Les vecteurs 3D peuvent être multipliés par des matrices 4x4 (Mat4) en utilisant la mathématique des coordonnées homogènes, ce qui permet un calcul efficace de la géométrie 3D. Les objets Vec3 sont créés à l'aide de l'outil ecs.math.vec3 Vec3Factory, ou par des opérations sur d'autres objets Vec3.

## Source

L'interface Vec3Source représente tout objet possédant des propriétés x, y et z et pouvant donc être utilisé comme source de données pour créer un Vec3. En outre, Vec3Source peut être utilisé comme argument pour les algorithmes Vec3, ce qui signifie que tout objet ayant des propriétés {x: number, y: number, z: number} peut être utilisé.

## Propriétés

Vec3 possède les propriétés énumérables suivantes :

`readonly x : number` Accéder à la composante x du vecteur.

`readonly y : number` Accéder à la composante y du vecteur.

`readonly z : number` Accéder à la composante z du vecteur.

## Usine

### de

Créer un Vec3 à partir d'un Vec3, ou d'un autre objet avec des propriétés x, y.

```ts
ecs.math.vec3.from({x, y, z}: {x: number, y: number, z: number}) // -> vec3
```

### un

Créer un vec3 dont tous les éléments sont fixés à un. Ceci est équivalent à `vec3.from({x: 1, y: 1, z: 1})`.

```ts
ecs.math.vec3.one() // -> vec3
```

### échelle

Créer un vec3 dont tous les éléments sont réglés sur la valeur d'échelle s. Ceci est équivalent à `vec3.from({x: s, y: s, z: s})`.

```ts
ecs.math.vec3.scale(s : number) // -> vec3
```

### xyz

Créer un Vec3 à partir des valeurs x, y, z. Ceci est équivalent à `vec3.from({x, y, z})`.

```ts
ecs.math.vec3.xyz(x : number, y : number, z : number) // -> vec3
```

### zéro

Créer un vec3 dont tous les éléments sont mis à zéro. Ceci est équivalent à `vec3.from({x: 0, y: 0, z: 0})`.

```ts
ecs.math.vec3.zero() // -> vec3
```

## Immuable

Les méthodes suivantes effectuent des calculs basés sur la valeur actuelle d'un Vec3 mais ne modifient pas son contenu. Les méthodes qui renvoient des types Vec3 renvoient de nouveaux objets. Les API immuables sont généralement plus sûres, plus lisibles et moins sujettes aux erreurs que les API mutables, mais elles peuvent être inefficaces dans les situations où des milliers d'objets sont alloués à chaque image.

:::note
Si le ramassage des ordures a un impact sur les performances, envisagez d'utiliser l'API mutable décrite ci-dessous.
:::

### clone

Créer un nouveau vecteur avec les mêmes composantes que ce vecteur.

```ts
existingVec3.clone() // -> vec3
```

### croiser

Calculer le produit croisé de ce vecteur et d'un autre vecteur.

```ts
existingVec3.cross(v : Vec3Source) // -> vec3
```

### données

Accéder au vecteur comme un tableau homogène (quatre dimensions).

```ts
existingVec3.data() // -> nombre[]
```

### distanceTo

Calculer la distance euclidienne entre ce vecteur et un autre vecteur.

```ts
existingVec3.distanceTo(v : Vec3Source) // -> nombre
```

### diviser

Division vectorielle par éléments.

```ts
existingVec3.divide(v : Vec3Source) // -> vec3
```

### point

Calculer le produit point de ce vecteur et d'un autre vecteur.

```ts
existingVec3.dot(v : Vec3Source) // -> nombre
```

### égaux

Vérifie si deux vecteurs sont égaux, avec une tolérance en virgule flottante spécifiée.

```ts
existingVec3.equals(v : Vec3Source, tolerance : number) // -> booléen
```

### longueur

Longueur du vecteur.

```ts
existingVec3.length() // -> nombre
```

### moins

Soustraire un vecteur de ce vecteur.

```ts
existingVec3.minus(v : Vec3Source) // -> vec3
```

### mélange

Calculer une interpolation linéaire entre ce vecteur et un autre vecteur v avec un facteur t de telle sorte que le résultat soit thisVec \* (1 - t) + v \* t. Le facteur t doit être compris entre zéro et 1.

```ts
existingVec3.mix(v : Vec3Source, t : number) // -> vec3
```

### normaliser

Renvoie un nouveau vecteur ayant la même direction que ce vecteur, mais avec une longueur de 1.

```ts
existingVec3.normalize() // -> vec3
```

### plus

Additionner deux vecteurs.

```ts
existingVec3.plus(v : Vec3Source) // -> vec3
```

### échelle

Multiplier le vecteur par un scalaire.

```ts
existingVec3.scale(s : number) // -> vec3
```

### fois

Multiplication vectorielle par éléments.

```ts
existingVec3.times(v : Vec3Source) // -> vec3
```

## Mutable

Les méthodes suivantes effectuent des calculs basés sur la valeur actuelle d'un Vec3 et modifient son contenu sur place. Elles sont parallèles aux méthodes de l'API mutable ci-dessus. Les méthodes qui renvoient des types Vec3 renvoient une référence à l'objet actuel pour faciliter l'enchaînement des méthodes. Les API mutables peuvent être plus performantes que les API immuables, mais elles sont généralement moins sûres, moins lisibles et plus sujettes aux erreurs.

### SetCross

Calculer le produit croisé de ce vecteur et d'un autre vecteur. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setCross(v : Vec3Source) // -> vec3
```

### setDivide

Division vectorielle par éléments. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setDivide(v : Vec3Source) // -> vec3
```

### setMinus

Soustraire un vecteur de ce vecteur. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setMinus(v : Vec3Source) // -> vec3
```

### setMix

Calculer une interpolation linéaire entre ce vecteur et un autre vecteur v avec un facteur t de telle sorte que le résultat soit thisVec \* (1 - t) + v \* t. Le facteur t doit être compris entre 0 et 1. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setMix(v : Vec3Source, t : number) // -> vec3
```

### setNormalize

Définit le vecteur comme une version de lui-même avec la même direction mais avec une longueur de 1. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setNormalize() // -> vec3
```

### setPlus

Additionner deux vecteurs. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setPlus(v : Vec3Source) // -> vec3
```

### setScale

Multiplier le vecteur par un scalaire. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setScale(s : number) // -> vec3
```

### setTimes

Multiplication vectorielle par éléments. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setTimes(v : Vec3Source) // -> vec3
```

### setX

Définit la composante x du Vec3. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setX(v : number) // -> vec3
```

### setY

Définir la composante y du Vec3. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setY(v : number) // -> vec3
```

### setZ

Définir la composante z du Vec3. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setZ(v : number) // -> vec3
```

### Set (jeu de mots)

Les méthodes suivantes fixent la valeur de l'objet Vec3 actuel sans tenir compte de son contenu actuel, en remplaçant ce qui existait auparavant.

### makeOne

Réglez le Vec3 pour qu'il ne contienne que des uns. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.makeOne() // -> vec3
```

### makeScale

Réglez le Vec3 pour que tous les composants soient réglés sur la valeur d'échelle s. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.makeScale(s : number) // -> vec3
```

### makeZero

Réglez le Vec3 sur des zéros. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.makeZero() // -> vec3
```

### setFrom

Définir ce Vec3 pour qu'il ait la même valeur qu'un autre Vec3 ou qu'un autre objet avec des propriétés x, y et z. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setFrom(source : Vec3Source) // -> vec3
```

### setXyz

Définir les composantes x, y et z du Vec3. Stocke le résultat dans ce Vec3 et renvoie ce Vec3 pour le chaînage.

```ts
existingVec3.setXyz(x : number, y : number, z : number) // -> vec3
```
