---
id: quat
---

# quat

Interface représentant un quaternion. Un quaternion est représenté par des coordonnées (x, y, z, w) et représente une rotation en 3D. Les quaternions peuvent être convertis en matrices de rotation 4x4 avec les interfaces de Mat4. Les objets Quaternion sont créés avec la QuatFactory d'ecs.math.quat, ou par des opérations sur d'autres objets Quat.

## Source

L'interface QuatSource représente tout objet ayant des propriétés x, y, z et w et pouvant donc être utilisé comme source de données pour créer un Quat. En outre, QuatSource peut être utilisé comme argument pour les algorithmes Quat, ce qui signifie que tout objet ayant les propriétés {x : nombre, y : nombre, z : nombre, w : nombre} peut être utilisé.

## Propriétés

Quat possède les propriétés énumérables suivantes :

`readonly x : number` Accéder à la composante x du quaternion.

`readonly y : number` Accéder à la composante y du quaternion.

`readonly z : number` Accéder à la composante z du quaternion.

`readonly w : number` Accéder à la composante w du quaternion.

## Usine

### axisAngle

Créer un Quat à partir d'une représentation axe-angle. La direction du vecteur aa donne l'axe de rotation, et la magnitude du vecteur donne l'angle, en radians. Par exemple, quat.axisAngle(vec3.up().scale(Math.PI / 2)) représente une rotation de 90 degrés autour de l'axe y, et est équivalent à quat.yDegrees(90). Si la cible est fournie, le résultat sera stocké dans la cible et la cible sera renvoyée. Dans le cas contraire, un nouveau Quat sera créé et renvoyé.

```ts
ecs.math.quat.axisAngle(aa : Vec3Source, target? : Quat) // -> quat
```

### de

Créer un Quat à partir d'un objet avec des propriétés x, y, z, w.

```ts
ecs.math.quat.from({x, y, z, w} : {x : nombre, y : nombre, z : nombre, w : nombre) // -> quat
```

### lookAt

Créer un Quat représentant la rotation nécessaire pour qu'un objet positionné à "eye" regarde un objet positionné à "target", avec le vecteur "up" donné.

```ts
ecs.math.quat.lookAt(eye : Vec3Source, target : Vec3Source, up : Vec3Source) // -> quat
```

### PitchYawRollDegrees

Construire un quaternion à partir d'une représentation du tangage, du lacet et du roulis, également connus sous le nom d'angles d'Euler YXZ. La rotation est spécifiée en degrés.

```ts
ecs.math.quat.pitchYawRollDegrees(v : Vec3Source) // -> quat
```

### PitchYawRollRadians

Construire un quaternion à partir d'une représentation du tangage, du lacet et du roulis, également connus sous le nom d'angles d'Euler YXZ. La rotation est spécifiée en radians.

```ts
ecs.math.quat.pitchYawRollRadians(v : Vec3Source) // -> quat
```

### xDegrees

Créez un Quat qui représente une rotation autour de l'axe x. La rotation est spécifiée en degrés.

```ts
ecs.math.quat.xDegrees(degrees : number) // -> quat
```

### xRadiens

Créez un Quat qui représente une rotation autour de l'axe x. La rotation est spécifiée en radians.

```ts
ecs.math.quat.xRadians(radians : number) // -> quat
```

### xyzw

Créer un Quat à partir des valeurs x, y, z, w.

```ts
ecs.math.quat.xyzw(x : number, y : number, z : number, w : number) // -> quat
```

### yDegrees

Créez un Quat qui représente une rotation autour de l'axe y. La rotation est spécifiée en degrés.

```ts
ecs.math.quat.yDegrees(degrees : number) // -> quat
```

### yRadiens

Créez un Quat qui représente une rotation autour de l'axe y. La rotation est spécifiée en radians.

```ts
ecs.math.quat.yRadians(radians : number) // -> quat
```

### zDegrees

Créer un Quat qui représente une rotation autour de l'axe z. La rotation est spécifiée en degrés.

```ts
ecs.math.quat.zDegrees(degrees : number) // -> quat
```

### zRadiens

Créer un Quat qui représente une rotation autour de l'axe z. La rotation est spécifiée en radians.

```ts
ecs.math.quat.zRadians(radians : number) // -> quat
```

### zéro

Créer un Quat qui représente une rotation nulle.

```ts
ecs.math.quat.zero() // -> quat
```

## Immuable

Les méthodes suivantes permettent d'effectuer des calculs en utilisant la valeur actuelle d'un Quat sans en modifier le contenu. Les méthodes qui renvoient des types Quat créent de nouvelles instances. Si les API immuables sont généralement plus sûres, plus lisibles et réduisent la probabilité d'erreurs, elles peuvent devenir inefficaces lorsqu'un grand nombre d'objets sont alloués par image.

:::note
Si le ramassage des ordures a un impact sur les performances, envisagez d'utiliser l'API mutable décrite ci-dessous.
:::

### axisAngle

Convertit le quaternion en une représentation axe-angle. La direction du vecteur donne l'axe de rotation, et la magnitude du vecteur donne l'angle, en radians. Si "cible" est fourni, le résultat sera stocké dans "cible" et "cible" sera renvoyé. Sinon, un nouveau Vec3 sera créé et renvoyé.

```ts
existingQuat.axisAngle(target? : Vec3) // -> vec3
```

### clone

Créer un nouveau quaternion avec les mêmes composantes que ce quaternion.

```ts
existingQuat.clone() // -> quat
```

### conjuguer

Retourne le conjugué de rotation de ce quaternion. Le conjugué d'un quaternion représente la même rotation dans le sens opposé autour de l'axe de rotation.

```ts
existingQuat.conjugate() // -> quat
```

### données

Accéder au quaternion sous la forme d'un tableau de [x, y, z, w].

```ts
ecs.math.quat.data() // -> number[]
```

### degrésTo

Angle entre deux quaternions, en degrés.

```ts
existingQuat.degreesTo(target : QuatSource) // -> nombre
```

### delta

Calculer le quaternion nécessaire pour faire pivoter ce quaternion vers le quaternion cible.

```ts
existingQuat.delta(target : QuatSource) // -> quat
```

### point

Calculez le produit en points de ce quaternion avec un autre quaternion.

```ts
existingQuat.dot(target : QuatSource) // -> quat
```

### égaux

Vérifie si deux quaternions sont égaux, avec une tolérance en virgule flottante spécifiée.

```ts
existingQuat.equals(q : QuatSource, tolerance : number) // -> booléen
```

### inv

Calculer le quaternion qui multiplie ce quaternion pour obtenir un quaternion de rotation nulle.

```ts
existingQuat.inv() // -> quat
```

### nier

Négation de toutes les composantes de ce quaternion. Le résultat est un quaternion représentant la même rotation que ce quaternion.

```ts
existingQuat.negate() // -> quat
```

### normaliser

Obtenir la version normalisée de ce quaternion avec une longueur de 1.

```ts
existingQuat.normalize() // -> quat
```

### PitchYawRollRadians

Convertir le quaternion en angles de tangage, de lacet et de roulis en radians.

```ts
ecs.math.quat.pitchYawRollRadians(target? : Vec3) // -> vec3
```

### PitchYawRollDegrees

Convertit le quaternion en angles de tangage, de lacet et de roulis en degrés.

```ts
ecs.math.quat.pitchYawRollDegrees(target? : Vec3) // -> vec3
```

### plus

Additionner deux quaternions.

```ts
ecs.math.quat.plus(q : QuatSource) // -> quat
```

### radiansTo

Angle entre deux quaternions, en radians.

```ts
ecs.math.quat.rotateToward(target : QuatSource, radians : number) // -> quat
```

### escarpolette

Interpolation sphérique entre deux quaternions à partir d'une valeur d'interpolation fournie. Si l'interpolation est fixée à 0, elle renvoie ce quaternion. Si l'interpolation est fixée à 1, elle renvoie le quaternion cible.

```ts
ecs.math.quat.slerp(target : QuatSource, t : number) // -> quat
```

### fois

Multiplier deux quaternions ensemble.

```ts
existingQuat.times(q : QuatSource) // -> quat
```

### timesVec

Multiplier le quaternion par un vecteur. Cela revient à convertir le quaternion en une matrice de rotation et à multiplier la matrice par le vecteur.

```ts
ecs.math.quat.times(v : Vec3Source, target? : Vec3) // -> vec3
```

## Mutable

Les méthodes suivantes effectuent des calculs en utilisant la valeur actuelle d'un Quat et la modifient directement. Ces méthodes correspondent à celles de l'API Immutable ci-dessus. Lorsqu'ils renvoient des types Quat, ils fournissent une référence au même objet, ce qui permet d'enchaîner les méthodes. Si les API mutables peuvent offrir de meilleures performances que les API immuables, elles ont tendance à être moins sûres, moins lisibles et plus sujettes aux erreurs. S'il est peu probable que le code soit appelé fréquemment au sein d'une même image, envisagez d'utiliser l'API Immutable pour plus de sécurité et de clarté.

### setConjugate

Fixer ce quaternion à son conjugué de rotation. Le conjugué d'un quaternion représente la même rotation dans le sens opposé autour de l'axe de rotation. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setConjugate() // -> quat
```

### setDelta

Calculer le quaternion nécessaire pour faire pivoter ce quaternion vers le quaternion cible. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setDelta(target : QuatSource) // -> quat
```

### setInv

Indique le quaternion qui multiplie ce quaternion pour obtenir un quaternion de rotation nulle. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setInv() // -> quat
```

### setNegate

Négation de toutes les composantes de ce quaternion. Le résultat est un quaternion représentant la même rotation que ce quaternion. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setNegate() // -> quat
```

### setNormalize

Obtenir la version normalisée de ce quaternion avec une longueur de 1. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setNormalize() // -> quat
```

### setPlus

Ajouter ce quaternion à un autre quaternion. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setPlus(q : QuatSource) // -> quat
```

### setPremultiply

Ce quaternion est le résultat de q fois ce quaternion. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setPremultiply(q : QuatSource) // -> quat
```

### setRotateToward

Faire pivoter ce quaternion vers le quaternion cible d'un nombre donné de radians, en le fixant à la cible. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setRotateToward(target : QuatSource, radians : number) // -> quat
```

### setSlerp

Interpolation sphérique entre deux quaternions à partir d'une valeur d'interpolation fournie. Si l'interpolation est fixée à 0, elle renvoie ce quaternion. Si l'interpolation est fixée à 1, elle renvoie le quaternion cible. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setSlerp(target : QuatSource, t : number) // -> quat
```

### setTimes

Multiplier deux quaternions ensemble. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setTimes(target : QuatSource) // -> quat
```

## Set (jeu de mots)

Les méthodes suivantes fixent la valeur de l'objet Quat actuel sans tenir compte de son contenu actuel, en remplaçant ce qui existait auparavant.

### makeAxisAngle

Définir un Quat à partir d'une représentation axe-angle. La direction du vecteur donne l'axe de rotation, et la magnitude du vecteur donne l'angle, en radians. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makeAxisAngle(aa : Vec3Source) // -> quat
```

### makePitchYawRollRadians

Fixe le quaternion à une rotation spécifiée par les angles de tangage, de lacet et de roulis en radians. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makePitchYawRollRadians(v : Vec3Source) // -> quat
```

### makeLookAt

Réglez le quaternion sur une rotation qui amènerait l'œil à regarder la cible avec le vecteur ascendant donné. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makeLookAt(eye : Vec3Source, target : Vec3Source, up : Vec3Source) // -> quat
```

### makePitchYawRollDegrees

Fixe le quaternion à une rotation spécifiée par les angles de tangage, de lacet et de roulis en degrés. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makePitchYawRollDegrees(v : Vec3Source) // -> quat
```

### makeXDegrees

Définit le quaternion comme une rotation autour de l'axe x (pitch) en degrés. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makeXDegrees(degrees : number) // -> quat
```

### makeXRadians

Définit le quaternion comme une rotation autour de l'axe x (pitch) en radians. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makeXRadians(radians : number) // -> quat
```

### makeYDegrees

Définit le quaternion comme une rotation autour de l'axe des y (lacet) en degrés. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makeYDegrees(degrees : number) // -> quat
```

### faire desYRadiens

Définit le quaternion comme une rotation autour de l'axe y (yaw) en radians. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makeYRadians(radians : number) // -> quat
```

### makeZDegrees

Définit le quaternion comme une rotation autour de l'axe z (roulis) en degrés. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makeZDegrees(degrees : number) // -> quat
```

### makeZRadians

Définit le quaternion comme une rotation autour de l'axe z (roulis) en radians. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makeZRadians(radians : number) // -> quat
```

### makeZero

Fixe le quaternion à une rotation nulle. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.makeZero() // -> quat
```

### setFrom

Fixe ce quaternion à la valeur d'un autre quaternion. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setFrom(q : QuatSource) // -> quat
```

### setXyzw

Fixe le quaternion aux valeurs x, y, z et w spécifiées. Stocke le résultat dans ce Quat et renvoie ce Quat pour le chaînage.

```ts
existingQuat.setXyzw(x : number, y : number, z : number, w : number) // -> quat
```
