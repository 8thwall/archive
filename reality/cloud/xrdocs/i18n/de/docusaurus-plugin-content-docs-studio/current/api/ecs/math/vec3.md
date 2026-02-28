---
id: vec3
---

# vec3

Schnittstelle, die einen 3D-Vektor darstellt. Ein 3D-Vektor wird durch (x, y, z)-Koordinaten dargestellt und kann einen Punkt im Raum, einen Richtungsvektor oder andere Arten von Daten mit drei geordneten Dimensionen darstellen. 3D-Vektoren können mit 4x4-Matrizen (Mat4) unter Verwendung homogener Koordinatenmathematik multipliziert werden, was effiziente 3D-Geometrieberechnungen ermöglicht. Vec3-Objekte werden mit der ecs.math.vec3 Vec3Factory oder durch Operationen mit anderen Vec3-Objekten erstellt.

## Quelle

Die Schnittstelle Vec3Source stellt ein beliebiges Objekt dar, das über x-, y- und z-Eigenschaften verfügt und somit als Datenquelle zur Erstellung eines Vec3 verwendet werden kann. Darüber hinaus kann Vec3Source als Argument für Vec3-Algorithmen verwendet werden, was bedeutet, dass jedes Objekt mit {x: number, y: number, z: number} Eigenschaften verwendet werden kann.

## Eigenschaften

Vec3 hat die folgenden aufzählbaren Eigenschaften:

`readonly x: number` Zugriff auf die x-Komponente des Vektors.

y: Zahl\`\` Zugriff auf die y-Komponente des Vektors.

z: Zahl\`\` Zugriff auf die z-Komponente des Vektors.

## Fabrik

### von

Erstellen Sie einen Vec3 aus einem Vec3 oder einem anderen Objekt mit x, y Eigenschaften.

```ts
ecs.math.vec3.from({x, y}: {x: number, y: number, z: number}}) // -> vec3
```

### eine

Erstellen Sie einen vec3, bei dem alle Elemente auf eins gesetzt sind. Dies ist äquivalent zu `vec3.from({x: 1, y: 1, z: 1})`.

```ts
ecs.math.vec3.one() // -> vec3
```

### scale

Erstellen Sie einen vec3 mit allen Elementen, die auf den Skalenwert s eingestellt sind. Dies ist äquivalent zu `vec3.from({x: s, y: s, z: s})`.

```ts
ecs.math.vec3.scale(s: Zahl) // -> vec3
```

### xyz

Erstellen eines Vec3 aus den Werten x, y, z. Dies ist äquivalent zu `vec3.from({x, y, z})`.

```ts
ecs.math.vec3.xyz(x: Zahl, y: Zahl, z: Zahl) // -> vec3
```

### Null

Erstellen Sie einen vec3, bei dem alle Elemente auf Null gesetzt sind. Dies ist äquivalent zu `vec3.from({x: 0, y: 0, z: 0})`.

```ts
ecs.math.vec3.zero() // -> vec3
```

## Unveränderlich

Die folgenden Methoden führen Berechnungen auf der Grundlage des aktuellen Wertes eines Vec3 durch, verändern aber nicht dessen Inhalt. Methoden, die Vec3-Typen zurückgeben, geben neue Objekte zurück. Unveränderliche APIs sind in der Regel sicherer, besser lesbar und weniger fehleranfällig als veränderliche APIs, können aber in Situationen, in denen Tausende von Objekten pro Frame zugewiesen werden, ineffizient sein.

:::note
Wenn die Garbage Collection die Leistung beeinträchtigt, sollten Sie die unten beschriebene Mutable API verwenden.
:::

### klonen.

Erstellen Sie einen neuen Vektor mit denselben Komponenten wie dieser Vektor.

```ts
existingVec3.clone() // -> vec3
```

### Kreuz

Berechnen Sie das Kreuzprodukt dieses Vektors und eines anderen Vektors.

```ts
existingVec3.cross(v: Vec3Source) // -> vec3
```

### Daten

Zugriff auf den Vektor als homogenes Array (4 Dimensionen).

```ts
existingVec3.data() // -> Zahl[]
```

### EntfernungZu

Berechnen Sie den euklidischen Abstand zwischen diesem Vektor und einem anderen Vektor.

```ts
existingVec3.distanceTo(v: Vec3Source) // -> vec3
```

### dividieren

Elementweise Vektordivision.

```ts
existingVec3.divide(v: Vec3Source) // -> vec3
```

### Punkt

Berechnen Sie das Punktprodukt dieses Vektors und eines anderen Vektors.

```ts
existingVec3.dot(v: Vec3Source) // -> vec3
```

### ist gleich

Prüfen, ob zwei Vektoren gleich sind, mit einer bestimmten Fließkommatoleranz.

```ts
existingVec3.equals(v: Vec3Source, tolerance: number) // -> boolesch
```

### Länge

Länge des Vektors.

```ts
existingVec3.length() // -> Zahl
```

### minus

Subtrahiert einen Vektor von diesem Vektor.

```ts
existingVec3.minus(v: Vec3Source) // -> vec3
```

### mischen

Berechne eine lineare Interpolation zwischen diesem Vektor und einem anderen Vektor v mit einem Faktor t, so dass das Ergebnis thisVec \* (1 - t) + v \* t ist. Der Faktor t sollte zwischen 0 und 1 liegen.

```ts
existingVec3.mix(v: Vec3Source, t: Zahl) // -> vec3
```

### normalisieren

Gibt einen neuen Vektor mit der gleichen Richtung wie dieser Vektor zurück, aber mit der Länge 1.

```ts
existingVec3.normalize() // -> vec3
```

### plus

Zwei Vektoren zusammenfügen.

```ts
existingVec3.plus(v: Vec3Source) // -> vec3
```

### scale

Multiplizieren des Vektors mit einem Skalar.

```ts
existingVec3.scale(s: Zahl) // -> vec3
```

### mal

Elementweise Vektormultiplikation.

```ts
existingVec3.times(v: Vec3Source) // -> vec3
```

## Veränderlich

Die folgenden Methoden führen Berechnungen auf der Grundlage des aktuellen Werts eines Vec3 durch und ändern dessen Inhalt an Ort und Stelle. Sie sind parallel zu den Methoden in der obigen veränderlichen API. Methoden, die Vec3-Typen zurückgeben, geben einen Verweis auf das aktuelle Objekt zurück, um die Methodenverkettung zu erleichtern. Veränderbare APIs können leistungsfähiger sein als unveränderliche APIs, sind aber in der Regel weniger sicher, weniger lesbar und fehleranfälliger.

### SetCross

Berechnen Sie das Kreuzprodukt dieses Vektors und eines anderen Vektors. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setCross(v: Vec3Source) // -> vec3
```

### setDivide

Elementweise Vektordivision. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setDivide(v: Vec3Source) // -> vec3
```

### setMinus

Subtrahiert einen Vektor von diesem Vektor. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setMinus(v: Vec3Source) // -> vec3
```

### setMix

Berechne eine lineare Interpolation zwischen diesem Vektor und einem anderen Vektor v mit einem Faktor t, so dass das Ergebnis thisVec \* (1 - t) + v \* t ist. Der Faktor t sollte zwischen 0 und 1 liegen. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setMinus(v: Vec3Source, t: Zahl) // -> vec3
```

### setNormalize

Setzt den Vektor auf eine Version von sich selbst mit der gleichen Richtung, aber mit der Länge 1. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setNormalize() // -> vec3
```

### setPlus

Zwei Vektoren zusammenfügen. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setPlus(v: Vec3Source) // -> vec3
```

### setScale

Multiplizieren des Vektors mit einem Skalar. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setPlus(s: Zahl) // -> vec3
```

### setTimes

Elementweise Vektormultiplikation. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setTimes(v: Vec3Source) // -> vec3
```

### setX

Stellen Sie die x-Komponente des Vec3 ein. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setX(v: Zahl) // -> vec3
```

### setY

Stellen Sie die y-Komponente des Vec3 ein. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setY(v: Zahl) // -> vec3
```

### setZ

Stellen Sie die z-Komponente des Vec3 ein. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setZ(v: Zahl) // -> vec3
```

### Satz

Die folgenden Methoden setzen den Wert des aktuellen Vec3-Objekts ohne Rücksicht auf seinen aktuellen Inhalt und ersetzen das, was vorher da war.

### makeOne

Setzen Sie den Vec3 auf alle Einsen. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.makeOne() // -> vec3
```

### makeScale

Stellen Sie den Vec3 so ein, dass alle Komponenten auf den Skalenwert s eingestellt sind. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.makeScale(s: Zahl) // -> vec3
```

### makeZero

Setzen Sie den Vec3 auf Nullen. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.makeZero() // -> vec3
```

### setFrom

Legen Sie diesen Vec3 so fest, dass er denselben Wert hat wie ein anderer Vec3 oder ein anderes Objekt mit den Eigenschaften x, y und z. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setFrom(source: Vec3Source) // -> vec3
```

### setXyz

Stellen Sie die x-, y- und z-Komponenten des Vec3 ein. Speichert das Ergebnis in diesem Vec3 und gibt diesen Vec3 zur Verkettung zurück.

```ts
existingVec3.setFrom(x: Zahl, y: Zahl, z: Zahl) // -> vec3
```
