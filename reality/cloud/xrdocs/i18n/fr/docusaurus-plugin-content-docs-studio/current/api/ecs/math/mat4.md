---
id: mat4
---

# mat4

L'interface Mat4 représente une matrice 4x4, stockée sous la forme d'un tableau de 16 éléments dans l'ordre des colonnes majeures. Ce type de matrice est couramment utilisé en géométrie 3D pour représenter les transformations, y compris la position, la rotation et l'échelle (également connue sous le nom de matrice TRS). Ces matrices sont essentielles pour définir la position, l'orientation et la taille des objets dans une scène 3D.

Certaines matrices, telles que les matrices TRS, ont des inverses efficacement calculables. Dans ces cas, Mat4 permet de calculer l'inverse en temps constant, ce qui en fait une opération O(1) très rapide. Les objets Mat4 sont créés à l'aide de la fabrique ecs.math.mat4 (Mat4Factory) ou par des opérations sur des instances Mat4 existantes.

## Usine

### i

Matrice d'identité

```ts
ecs.math.mat4.i() // -> mat4
```

### de

Crée une matrice avec les données directement spécifiées, en utilisant l'ordre colonne-majeur. L'inverse peut être fourni en option. Si elle n'est pas fournie, l'inverse sera calculée automatiquement si la matrice est inversible. Toute tentative de calcul de l'inverse d'une matrice non inversible entraîne une erreur.

```ts
ecs.math.mat4.of(data : number[], inverseData? : number[]) // -> mat4
```

### r

Crée une matrice de rotation à partir d'un quaternion.

```ts
ecs.math.mat4.r(q : QuatSource) // -> mat4
```

### rangs

Crée une matrice en utilisant les données de ligne spécifiées. Vous pouvez également fournir, à titre facultatif, des données sur la ligne inverse. Les dataRows et les inverseDataRows doivent être des tableaux contenant chacun quatre nombres. Si l'inverse n'est pas fourni, il sera calculé automatiquement si la matrice est inversible.

:::danger
Toute tentative de calcul de l'inverse d'une matrice non inversible entraîne une erreur.
:::

```ts
ecs.math.mat4.rows(dataRows : number[][], inverseDataRows? : number[][]) // -> mat4
```

### s

Crée une matrice d'échelle. Spécifiez les facteurs d'échelle le long des axes x, y et z.

```ts
ecs.math.mat4.s(x : number, y : number, z : number) // -> mat4
```

### t

Crée une matrice de traduction. Spécifiez les décalages de translation le long des axes x, y et z.

```ts
ecs.math.mat4.t(x : number, y : number, z : number) // -> mat4
```

### tr

Crée une matrice combinée de translation et de rotation en utilisant un vecteur de translation et un quaternion pour la rotation.

```ts
ecs.math.mat4.tr(t : Vec3Source, r : QuatSource) // -> mat4
```

### trs

Crée une matrice combinée de translation, de rotation et d'échelle. Utilisez un vecteur de translation, un quaternion pour la rotation et des facteurs d'échelle pour les axes x, y et z.

```ts
ecs.math.mat4.trs(t : Vec3Source, r : QuatSource, s : Vec3Source) // -> mat4
```

## Immuable

Les méthodes suivantes effectuent des calculs en utilisant la valeur actuelle d'une Mat4 sans en modifier le contenu. Les méthodes qui renvoient des types Mat4 génèrent de nouvelles instances. Si les API immuables sont généralement plus sûres, plus lisibles et réduisent les erreurs par rapport aux API mutables, elles peuvent s'avérer moins efficaces dans les scénarios où des milliers d'objets sont créés à chaque image.

:::note
Si la collecte des déchets devient un problème de performance, envisagez d'utiliser l'API Mutable.
:::

### clone

Créer une nouvelle matrice avec les mêmes composants que cette matrice.

```ts
ecs.math.mat4.clone() // -> mat4
```

### données

Obtenir les données brutes de la matrice, dans l'ordre des colonnes.

```ts
ecs.math.mat4.data() // -> number[]
```

### decomposeTrs

Décomposer la matrice en ses composantes de translation, de rotation et d'échelle, en supposant qu'elle a été formée par une translation, une rotation et une échelle dans cet ordre. Si "cible" est fourni, le résultat sera stocké dans "cible" et "cible" sera renvoyé. Sinon, un nouvel objet {t, r, s} sera créé et renvoyé.

```ts
ecs.math.mat4.decomposeTrs(target? : {t: Vec3, r: Quat, s: Vec3}) // -> {t: Vec3, r: Quat, s: Vec3}
```

### déterminant

Calculer le déterminant de la matrice.

```ts
ecs.math.mat4.determinant() // -> nombre
```

### égaux

Vérifie si deux matrices sont égales, avec une tolérance en virgule flottante spécifiée.

```ts
ecs.math.mat4.equals(m : Mat4, tolerance : number) // -> booléen
```

### inv

Inverser la matrice, ou jeter si la matrice n'est pas inversable. Comme Mat4 stocke un inverse précalculé, cette opération est très rapide.

```ts
ecs.math.mat4.inv() // -> mat4
```

### données inverses

Obtenir les données brutes de la matrice inverse, dans l'ordre des colonnes majeures, ou null si la matrice n'est pas inversible.

```ts
ecs.math.mat4.inverseData() // -> number[] | null
```

### lookAt

Obtenir une matrice ayant la même position et la même échelle que cette matrice, mais dont la rotation est réglée pour regarder la cible.

```ts
ecs.math.mat4.lookAt(target : Vec3Source, up : Vec3Source) // -> mat4
```

### échelle

Multiplier la matrice par un scalaire.

:::danger
La mise à l'échelle par 0 provoque une erreur.
:::

```ts
ecs.math.mat4.scale(s : number) // -> mat4
```

### transposer

Obtenir la transposition de la matrice.

```ts
ecs.math.mat4.transpose() // -> mat4
```

### fois

Multiplier la matrice par une autre matrice.

```ts
ecs.math.mat4.times(m : Mat4) // -> mat4
```

### timesVec

Multiplier la matrice par un vecteur en utilisant des coordonnées homogènes.

```ts
ecs.math.mat4.timesVec(v : Vec3Source, target? : Vec3) // -> vec3
```

## Mutable

Les méthodes suivantes calculent des résultats basés sur la valeur actuelle d'une Mat4 et modifient directement son contenu. Elles reflètent les méthodes de l'API Immutable décrite plus haut. Les méthodes renvoyant des types Mat4 fournissent une référence au même objet, ce qui permet d'enchaîner les méthodes. Si les API mutables peuvent offrir de meilleures performances que les API immuables, elles ont tendance à être moins sûres, moins lisibles et plus sujettes aux erreurs.

:::note
S'il est peu probable que le code soit exécuté fréquemment dans une seule image, envisagez d'utiliser l'API Immutable pour améliorer la sécurité et la clarté du code.
:::

### setInv

Inverser la matrice, ou jeter si la matrice n'est pas inversable. Comme Mat4 stocke un inverse précalculé, cette opération est très rapide. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.setInv() // -> mat4
```

### setLookAt

Définit la rotation de la matrice pour regarder la cible, en gardant la translation et l'échelle inchangées. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.setLookAt(target : Vec3Source, up : Vec3Source) // -> mat4
```

### setPremultiply

Définit cette matrice comme le résultat de m fois cette matrice. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.setPremultiply(m : Mat4) // -> mat4
```

### setScale

Multiplier chaque élément de la matrice par une échelle. La mise à l'échelle par 0 provoque une erreur. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.setScale(s : number) // -> mat4
```

### setTimes

Fixe la matrice à sa transposée. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.setTranspose() // -> mat4
```

## Set (jeu de mots)

Les méthodes suivantes fixent la valeur de l'objet Mat4 courant sans tenir compte de son contenu actuel, en remplaçant ce qui existait auparavant.

### faire

Fixe la matrice à la matrice identité. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.makeI() // -> mat4
```

### makeR

Définit cette matrice comme une matrice de rotation à partir du quaternion spécifié. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.makeR(r : QuatSource) // -> mat4
```

### makeRows

Crée une matrice avec les données de ligne spécifiées et, éventuellement, les données de ligne inverse spécifiées. dataRows et inverseDataRows doivent être quatre tableaux, chacun contenant quatre nombres. Si l'inverse n'est pas spécifié, il sera calculé si la matrice est inversible.

:::danger
Si la matrice n'est pas inversible, l'appel à inv() provoquera une erreur.
:::

```ts
existingMat4.makeRows(rowData : number[][], inverseRowData? : number[][]) // -> mat4
```

### faireS

Définit cette matrice comme une matrice d'échelle à partir du vecteur spécifié. Aucun élément du vecteur ne doit être nul. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.makeS(s : Vec3Source) // -> mat4
```

### makeT

Définit cette matrice comme une matrice de translation à partir du vecteur spécifié. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.makeT(s : Vec3Source) // -> mat4
```

### makeTr

Définit cette matrice comme une matrice de translation et de rotation à partir du vecteur et du quaternion spécifiés. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.makeTr(t : Vec3Source, r : QuatSource) // -> mat4
```

### makeTrs

Définit cette matrice comme une matrice de translation, de rotation et d'échelle à partir des vecteurs et des quaternions spécifiés. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.makeTrs(t : Vec3Source, r : QuatSource, s : Vec3Source) // -> mat4
```

### fixer

Fixe la valeur de la matrice et de l'inverse aux valeurs fournies. Si aucun inverse n'est fourni, un inverse sera calculé si possible. Si la matrice n'est pas inversible, l'appel à inv() provoquera une erreur. Stocke le résultat dans ce Mat4 et renvoie ce Mat4 pour le chaînage.

```ts
existingMat4.set(data : number[], inverseData? : number[]) // -> mat4
```
