---
id: vec2
---

# vec2

Schnittstelle zur Darstellung eines 2D-Vektors. Ein 2D-Vektor wird durch (x, y)-Koordinaten dargestellt und kann einen Punkt in einer Ebene, einen Richtungsvektor oder andere Arten von Daten mit drei geordneten Dimensionen darstellen. Vec2-Objekte werden mit der ecs.math.vec2 Vec2Factory oder durch Operationen mit anderen Vec2-Objekten erstellt.

## Quelle

Die Schnittstelle Vec2Source stellt ein beliebiges Objekt dar, das über x- und y-Eigenschaften verfügt und somit als Datenquelle zur Erstellung eines Vec2 verwendet werden kann. Darüber hinaus kann Vec2Source als Argument für Vec2-Algorithmen verwendet werden, was bedeutet, dass jedes Objekt mit {x: number, y: number} Eigenschaften verwendet werden kann.

## Eigenschaften

Vec2Source hat die folgenden aufzählbaren Eigenschaften:

`readonly x: number` Zugriff auf die x-Komponente des Vektors.

y: Zahl\`\` Zugriff auf die y-Komponente des Vektors.

## Fabrik

### von

Erstellen Sie einen Vec2 aus einem Vec2 oder einem anderen Objekt mit x, y Eigenschaften.

```ts
ecs.math.vec2.from({x, y}: {x: number, y: number}) // -> vec2
```

### eine

Erstellen Sie einen vec2, bei dem alle Elemente auf eins gesetzt sind. Dies ist äquivalent zu `vec2.from({x: 1, y: 1})`.

```ts
ecs.math.vec2.one() // -> vec2
```

### scale

Erstellen Sie einen vec2 mit allen Elementen, die auf den Skalenwert s eingestellt sind. Dies ist äquivalent zu `vec2.from({x: s, y: s})`.

```ts
ecs.math.vec2.scale(s: Zahl) // -> vec2
```

### xy

Erstellen Sie einen Vec2 aus x- und y-Werten. Dies ist äquivalent zu `vec2.from({x, y})`.

```ts
ecs.math.vec2.xy(x: Zahl, y: Zahl) // -> vec2
```

### Null

Erstellen Sie einen vec2, bei dem alle Elemente auf Null gesetzt sind. Dies ist äquivalent zu `vec2.from({x: 0, y: 0})`.

```ts
ecs.math.vec2.zero() // -> vec2
```

## Unveränderlich

Die folgenden Methoden führen Berechnungen auf der Grundlage des aktuellen Wertes eines Vec2 durch, verändern aber nicht dessen Inhalt. Methoden, die Vec2-Typen zurückgeben, geben neue Objekte zurück. Unveränderliche APIs sind in der Regel sicherer, besser lesbar und weniger fehleranfällig als veränderliche APIs, können aber in Situationen, in denen Tausende von Objekten pro Frame zugewiesen werden, ineffizient sein.

:::note
Wenn die Garbage Collection die Leistung beeinträchtigt, sollten Sie die unten beschriebene Mutable API verwenden.
:::

### klonen.

Erstellen Sie einen neuen Vektor mit denselben Komponenten wie dieser Vektor.

```ts
existingVec2.clone() // -> vec2
```

### Kreuz

Berechnen Sie das Kreuzprodukt dieses Vektors und eines anderen Vektors. Bei 2D-Vektoren ist das Kreuzprodukt der Betrag der z-Komponente des 3D-Kreuzprodukts der beiden Vektoren mit 0 als z-Komponente.

```ts
existingVec2.cross(v: Vec2Source) // -> vec2
```

### EntfernungZu

Berechnen Sie den euklidischen Abstand zwischen diesem Vektor und einem anderen Vektor.

```ts
existingVec2.distanceTo(v: Vec2Source) // -> vec2
```

### dividieren

Elementweise Vektordivision.

```ts
existingVec2.divide(v: Vec2Source) // -> vec2
```

### Punkt

Berechnen Sie das Punktprodukt dieses Vektors und eines anderen Vektors.

```ts
existingVec2.dot(v: Vec2Source) // -> vec2
```

### ist gleich

Prüfen, ob zwei Vektoren gleich sind, mit einer bestimmten Fließkommatoleranz.

```ts
existingVec2.equals(v: Vec2Source, tolerance: number) // -> boolesch
```

### Länge

Länge des Vektors.

```ts
existingVec2.length() // -> Zahl
```

### minus

Subtrahiert einen Vektor von diesem Vektor.

```ts
existingVec2.minus(v: Vec2Source) // -> vec2
```

### mischen

Berechne eine lineare Interpolation zwischen diesem Vektor und einem anderen Vektor v mit einem Faktor t, so dass das Ergebnis thisVec \* (1 - t) + v \* t ist. Der Faktor t sollte zwischen 0 und 1 liegen.

```ts
existingVec2.mix(v: Vec2Source, t: Zahl) // -> vec2
```

### normalisieren

Gibt einen neuen Vektor mit der gleichen Richtung wie dieser Vektor zurück, aber mit der Länge 1.

```ts
existingVec2.normalize() // -> vec2
```

### plus

Zwei Vektoren zusammenfügen.

```ts
existingVec2.plus(v: Vec2Source) // -> vec2
```

### scale

Multiplizieren des Vektors mit einem Skalar.

```ts
existingVec2.scale(s: Zahl) // -> vec2
```

### mal

Elementweise Vektormultiplikation.

```ts
existingVec2.times(v: Vec2Source) // -> vec2
```

## Veränderlich

Die folgenden Methoden führen Berechnungen auf der Grundlage des aktuellen Wertes eines Vec2 durch und ändern dessen Inhalt an Ort und Stelle. Sie sind parallel zu den Methoden in der obigen veränderlichen API. Methoden, die Vec2-Typen zurückgeben, geben einen Verweis auf das aktuelle Objekt zurück, um die Methodenverkettung zu erleichtern. Veränderbare APIs können leistungsfähiger sein als unveränderliche APIs, sind aber in der Regel weniger sicher, weniger lesbar und fehleranfälliger.

### setDivide

Elementweise Vektordivision. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setDivide(v: Vec2Source) // -> vec2
```

### setMinus

Subtrahiert einen Vektor von diesem Vektor. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setMinus(v: Vec2Source) // -> vec2
```

### setMix

Berechne eine lineare Interpolation zwischen diesem Vektor und einem anderen Vektor v mit einem Faktor t, so dass das Ergebnis thisVec \* (1 - t) + v \* t ist. Der Faktor t sollte zwischen 0 und 1 liegen. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setMinus(v: Vec2Source, t: Zahl) // -> vec2
```

### setNormalize

Setzt den Vektor auf eine Version von sich selbst mit der gleichen Richtung, aber mit der Länge 1. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setNormalize() // -> vec2
```

### setPlus

Zwei Vektoren zusammenfügen. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setPlus(v: Vec2Source) // -> vec2
```

### setScale

Multiplizieren des Vektors mit einem Skalar. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setPlus(s: Zahl) // -> vec2
```

### setTimes

Elementweise Vektormultiplikation. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setTimes(v: Vec2Source) // -> vec2
```

### setX

Die x-Komponente von Vec2 einstellen. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setX(v: Zahl) // -> vec2
```

### setY

Die y-Komponente von Vec2 einstellen. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setY(v: Zahl) // -> vec2
```

### Einstellung

Die folgenden Methoden setzen den Wert des aktuellen Vec2-Objekts ohne Rücksicht auf seinen aktuellen Inhalt und ersetzen das, was vorher da war.

### makeOne

Setzen Sie den Vec2 auf alle Einsen. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.makeOne() // -> vec2
```

### makeScale

Stellen Sie den Vec2 so ein, dass alle Komponenten auf den Skalenwert s eingestellt sind. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.makeScale(s: Zahl) // -> vec2
```

### makeZero

Setzen Sie den Vec2 auf Nullen. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.makeZero() // -> vec2
```

### setFrom

Legen Sie diesen Vec2 so fest, dass er denselben Wert hat wie ein anderer Vec2 oder ein anderes Objekt mit x- und y-Eigenschaften. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setFrom(source: Vec2Source) // -> vec2
```

### setXy

Stellen Sie die x- und y-Komponenten von Vec2 ein. Speichert das Ergebnis in diesem Vec2 und gibt diesen Vec2 zur Verkettung zurück.

```ts
existingVec2.setFrom(x: Zahl, y: Zahl) // -> vec2
```
