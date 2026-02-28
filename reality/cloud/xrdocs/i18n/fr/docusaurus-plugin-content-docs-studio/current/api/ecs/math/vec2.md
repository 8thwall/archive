---
id: vec2
---

# vec2

Interface représentant un vecteur 2D. Un vecteur 2D est représenté par des coordonnées (x, y) et peut représenter un point dans un plan, un vecteur directionnel ou d'autres types de données à trois dimensions ordonnées. Les objets Vec2 sont créés à l'aide de l'outil ecs.math.vec2 Vec2Factory, ou par des opérations sur d'autres objets Vec2.

## Source

L'interface Vec2Source représente tout objet possédant des propriétés x et y et pouvant donc être utilisé comme source de données pour créer un Vec2. En outre, Vec2Source peut être utilisé comme argument pour les algorithmes Vec2, ce qui signifie que tout objet ayant des propriétés {x: number, y: number} peut être utilisé.

## Propriétés

Vec2Source possède les propriétés énumérables suivantes :

`readonly x : number` Accéder à la composante x du vecteur.

`readonly y : number` Accéder à la composante y du vecteur.

## Usine

### de

Créer un Vec2 à partir d'un Vec2, ou d'un autre objet avec des propriétés x, y.

```ts
ecs.math.vec2.from({x, y}: {x: number, y: number}) // -> vec2
```

### un

Créer un vec2 dont tous les éléments sont fixés à un. Ceci est équivalent à `vec2.from({x: 1, y: 1})`.

```ts
ecs.math.vec2.one() // -> vec2
```

### échelle

Créer un vec2 dont tous les éléments sont réglés sur la valeur d'échelle s. Ceci est équivalent à `vec2.from({x: s, y: s})`.

```ts
ecs.math.vec2.scale(s : number) // -> vec2
```

### xy

Créer un Vec2 à partir des valeurs x, y. Ceci est équivalent à `vec2.from({x, y})`.

```ts
ecs.math.vec2.xy(x : number, y : number) // -> vec2
```

### zéro

Créer un vec2 dont tous les éléments sont mis à zéro. Ceci est équivalent à `vec2.from({x: 0, y: 0})`.

```ts
ecs.math.vec2.zero() // -> vec2
```

## Immuable

Les méthodes suivantes effectuent des calculs basés sur la valeur actuelle d'un Vec2, mais ne modifient pas son contenu. Les méthodes qui renvoient des types Vec2 renvoient de nouveaux objets. Les API immuables sont généralement plus sûres, plus lisibles et moins sujettes aux erreurs que les API mutables, mais elles peuvent être inefficaces dans les situations où des milliers d'objets sont alloués à chaque image.

:::note
Si le ramassage des ordures a un impact sur les performances, envisagez d'utiliser l'API mutable décrite ci-dessous.
:::

### clone

Créer un nouveau vecteur avec les mêmes composantes que ce vecteur.

```ts
existingVec2.clone() // -> vec2
```

### croiser

Calculer le produit en croix de ce vecteur et d'un autre vecteur. Pour les vecteurs 2D, le produit croisé est la magnitude de la composante z du produit croisé 3D des deux vecteurs avec 0 comme composante z.

```ts
existingVec2.cross(v : Vec2Source) // -> vec2
```

### distanceTo

Calculer la distance euclidienne entre ce vecteur et un autre vecteur.

```ts
existingVec2.distanceTo(v : Vec2Source) // -> vec2
```

### diviser

Division vectorielle par éléments.

```ts
existingVec2.divide(v : Vec2Source) // -> vec2
```

### point

Calculer le produit point de ce vecteur et d'un autre vecteur.

```ts
existingVec2.dot(v : Vec2Source) // -> vec2
```

### égaux

Vérifie si deux vecteurs sont égaux, avec une tolérance en virgule flottante spécifiée.

```ts
existingVec2.equals(v : Vec2Source, tolerance : number) // -> booléen
```

### longueur

Longueur du vecteur.

```ts
existingVec2.length() // -> nombre
```

### moins

Soustraire un vecteur de ce vecteur.

```ts
existingVec2.minus(v : Vec2Source) // -> vec2
```

### mélange

Calculer une interpolation linéaire entre ce vecteur et un autre vecteur v avec un facteur t de telle sorte que le résultat soit thisVec \* (1 - t) + v \* t. Le facteur t doit être compris entre 0 et 1.

```ts
existingVec2.mix(v : Vec2Source, t : number) // -> vec2
```

### normaliser

Renvoie un nouveau vecteur ayant la même direction que ce vecteur, mais avec une longueur de 1.

```ts
existingVec2.normalize() // -> vec2
```

### plus

Additionner deux vecteurs.

```ts
existingVec2.plus(v : Vec2Source) // -> vec2
```

### échelle

Multiplier le vecteur par un scalaire.

```ts
existingVec2.scale(s : number) // -> vec2
```

### fois

Multiplication vectorielle par éléments.

```ts
existingVec2.times(v : Vec2Source) // -> vec2
```

## Mutable

Les méthodes suivantes effectuent des calculs basés sur la valeur actuelle d'un Vec2 et modifient son contenu sur place. Elles sont parallèles aux méthodes de l'API mutable ci-dessus. Les méthodes qui renvoient des types Vec2 renvoient une référence à l'objet actuel pour faciliter l'enchaînement des méthodes. Les API mutables peuvent être plus performantes que les API immuables, mais elles sont généralement moins sûres, moins lisibles et plus sujettes aux erreurs.

### setDivide

Division vectorielle par éléments. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setDivide(v : Vec2Source) // -> vec2
```

### setMinus

Soustraire un vecteur de ce vecteur. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setMinus(v : Vec2Source) // -> vec2
```

### setMix

Calculer une interpolation linéaire entre ce vecteur et un autre vecteur v avec un facteur t de telle sorte que le résultat soit thisVec \* (1 - t) + v \* t. Le facteur t doit être compris entre 0 et 1. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setMinus(v : Vec2Source, t : number) // -> vec2
```

### setNormalize

Définit le vecteur comme une version de lui-même avec la même direction, mais avec une longueur de 1. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setNormalize() // -> vec2
```

### setPlus

Additionner deux vecteurs. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setPlus(v : Vec2Source) // -> vec2
```

### setScale

Multiplier le vecteur par un scalaire. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setPlus(s : number) // -> vec2
```

### setTimes

Multiplication vectorielle par éléments. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setTimes(v : Vec2Source) // -> vec2
```

### setX

Définir la composante x du Vec2. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setX(v : number) // -> vec2
```

### setY

Définir la composante y du Vec2. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setY(v : number) // -> vec2
```

### Set (jeu de mots)

Les méthodes suivantes fixent la valeur de l'objet Vec2 actuel sans tenir compte de son contenu actuel, en remplaçant ce qui existait auparavant.

### makeOne

Régler le Vec2 pour qu'il ne contienne que des uns. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.makeOne() // -> vec2
```

### makeScale

Réglez le Vec2 pour que tous les composants soient réglés sur la valeur d'échelle s. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.makeScale(s : number) // -> vec2
```

### makeZero

Réglez le Vec2 sur des zéros. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.makeZero() // -> vec2
```

### setFrom

Définir ce Vec2 pour qu'il ait la même valeur qu'un autre Vec2 ou qu'un autre objet avec des propriétés x et y. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setFrom(source : Vec2Source) // -> vec2
```

### setXy

Définir les composantes x et y du Vec2. Stocke le résultat dans ce Vec2 et renvoie ce Vec2 pour le chaînage.

```ts
existingVec2.setFrom(x : number, y : number) // -> vec2
```
