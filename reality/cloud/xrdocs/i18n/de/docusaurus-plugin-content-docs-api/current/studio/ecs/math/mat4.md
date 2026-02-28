---
id: mat4
---

# Matte4

Die Mat4-Schnittstelle stellt eine 4x4-Matrix dar, die als 16-Element-Array in Spalten-Dur-Reihenfolge gespeichert wird. Dieser Matrixtyp wird häufig in der 3D-Geometrie verwendet, um Transformationen darzustellen, einschließlich Position, Drehung und Skalierung (auch bekannt als TRS-Matrix). Diese Matrizen sind für die Definition der Position, Ausrichtung und Größe von Objekten in einer 3D-Szene unerlässlich.

Bestimmte Matrizen, wie z. B. TRS-Matrizen, haben effizient berechenbare Inverse. In diesen Fällen ermöglicht Mat4 die Berechnung der Umkehrung in konstanter Zeit, so dass es sich um eine O(1)-Operation handelt. Mat4-Objekte werden mit Hilfe der ecs.math.mat4-Factory (Mat4Factory) oder durch Operationen auf bestehenden Mat4-Instanzen erzeugt.

## Fabrik

### i

Identitätsmatrix

```ts
ecs.math.mat4.i() // -> mat4
```

### von

Erzeugt eine Matrix mit direkt angegebenen Daten unter Verwendung der Spalten-Hauptreihenfolge. Optional kann die Umkehrung angegeben werden. Falls nicht angegeben, wird die Inverse automatisch berechnet, wenn die Matrix invertierbar ist. Der Versuch, die Inverse für eine nicht invertierbare Matrix zu berechnen, führt zu einem Fehler.

```ts
ecs.math.mat4.of(data: Zahl[], inverseData?: Zahl[]) // -> mat4
```

### r

Erzeugt eine Rotationsmatrix aus einem Quaternion.

```ts
ecs.math.mat4.r(q: QuatSource) // -> mat4
```

### Zeilen

Erzeugt eine Matrix mit den angegebenen Zeilendaten. Optional können Sie auch inverse Zeilendaten angeben. Sowohl dataRows als auch inverseDataRows sollten als Array angeordnet sein und jeweils vier Zahlen enthalten. Wenn die Inverse nicht angegeben wird, wird sie automatisch berechnet, wenn die Matrix invertierbar ist.

:::danger
Der Versuch, die Inverse für eine nicht invertierbare Matrix zu berechnen, führt zu einem Fehler.
:::

```ts
ecs.math.mat4.rows(dataRows: Zahl[][], inverseDataRows?: Zahl[][]) // -> mat4
```

### s

Erzeugt eine Skalenmatrix. Geben Sie die Skalierungsfaktoren entlang der x-, y- und z-Achse an.

```ts
ecs.math.mat4.s(x: Zahl, y: Zahl, z: Zahl) // -> mat4
```

### t

Erzeugt eine Übersetzungsmatrix. Geben Sie die Verschiebung entlang der x-, y- und z-Achse an.

```ts
ecs.math.mat4.t(x: Zahl, y: Zahl, z: Zahl) // -> mat4
```

### tr

Erzeugt eine kombinierte Translations- und Rotationsmatrix unter Verwendung eines Translationsvektors und eines Quaternions für die Rotation.

```ts
ecs.math.mat4.tr(t: Vec3Source, r: QuatSource) // -> mat4
```

### trs

Erzeugt eine kombinierte Translations-, Rotations- und Skalierungsmatrix. Verwenden Sie einen Translationsvektor, ein Quaternion für die Drehung und Skalierungsfaktoren für die x-, y- und z-Achsen.

```ts
ecs.math.mat4.trs(t: Vec3Source, r: QuatSource, s: Vec3Source) // -> mat4
```

## Unveränderlich

Die folgenden Methoden führen Berechnungen mit dem aktuellen Wert eines Mat4 durch, ohne dessen Inhalt zu verändern. Methoden, die Mat4-Typen zurückgeben, erzeugen neue Instanzen. Unveränderliche APIs sind zwar im Allgemeinen sicherer, lesbarer und fehlerärmer als veränderliche APIs, aber sie können in Szenarien, in denen Tausende von Objekten pro Frame erstellt werden, weniger effizient sein.

:::note
Wenn die Garbage Collection zu einem Leistungsproblem wird, sollten Sie die Mutable API verwenden.
:::

### klonen.

Erstellen Sie eine neue Matrix mit denselben Komponenten wie diese Matrix.

```ts
ecs.math.mat4.clone() // -> mat4
```

### Daten

Abrufen der Rohdaten der Matrix in spaltenschwerer Reihenfolge.

```ts
ecs.math.mat4.data() // -> Zahl[]
```

### zersetzenTrs

Zerlegen Sie die Matrix in ihre Translations-, Rotations- und Skalierungskomponenten, unter der Annahme, dass sie durch eine Translation, Rotation und Skalierung in dieser Reihenfolge gebildet wurde. Wird "target" angegeben, wird das Ergebnis in "target" gespeichert und "target" zurückgegeben. Andernfalls wird ein neues {t, r, s} Objekt erstellt und zurückgegeben.

```ts
ecs.math.mat4.decomposeTrs(target?: {t: Vec3, r: Quat, s: Vec3}) // -> {t: Vec3, r: Quat, s: Vec3}
```

### Bestimmend

Berechnen Sie die Determinante der Matrix.

```ts
ecs.math.mat4.determinant() // -> Zahl
```

### ist gleich

Prüfen, ob zwei Matrizen gleich sind, mit einer bestimmten Fließkommatoleranz.

```ts
ecs.math.mat4.equals(m: Mat4, tolerance: Zahl) // -> boolesch
```

### inv

Invertieren Sie die Matrix oder werfen Sie, wenn die Matrix nicht invertierbar ist. Da Mat4 die vorberechnete Inverse speichert, ist diese Operation O(1).

```ts
ecs.math.mat4.inv() // -> mat4
```

### inverseDaten

Abrufen der Rohdaten der inversen Matrix in spaltenschwerer Reihenfolge oder Null, wenn die Matrix nicht invertierbar ist.

```ts
ecs.math.mat4.inverseData() // -> Zahl[] | null
```

### siehe

Ermittelt eine Matrix mit derselben Position und Skalierung wie diese Matrix, aber mit einer Drehung, die auf das Ziel ausgerichtet ist.

```ts
ecs.math.mat4.lookAt(target: Vec3Source, up: Vec3Source) // -> mat4
```

### Skala

Multiplizieren Sie die Matrix mit einem Skalar.

:::danger
Die Skalierung durch 0 führt zu einem Fehler.
:::

```ts
ecs.math.mat4.scale(s: Zahl) // -> mat4
```

### transponieren

Ermittelt die Transponierung der Matrix.

```ts
ecs.math.mat4.transpose() // -> mat4
```

### mal

Multiplizieren Sie die Matrix mit einer anderen Matrix.

```ts
ecs.math.mat4.times(m: Mat4) // -> mat4
```

### timesVec

Multiplizieren Sie die Matrix mit einem Vektor unter Verwendung homogener Koordinaten.

```ts
ecs.math.mat4.timesVec(v: Vec3Source, target?: Vec3) // -> vec3
```

## Veränderlich

Die folgenden Methoden berechnen die Ergebnisse auf der Grundlage des aktuellen Wertes eines Mat4 und ändern dessen Inhalt direkt. Sie spiegeln die Methoden der zuvor beschriebenen unveränderlichen API wider. Methoden, die Mat4-Typen zurückgeben, liefern einen Verweis auf dasselbe Objekt und ermöglichen so die Verkettung von Methoden. Veränderbare APIs können zwar eine bessere Leistung als unveränderliche APIs bieten, sind aber tendenziell weniger sicher, weniger lesbar und fehleranfälliger.

:::note
Wenn es unwahrscheinlich ist, dass Code häufig innerhalb eines einzelnen Frames ausgeführt wird, sollten Sie die Immutable API verwenden, um die Codesicherheit und die Übersichtlichkeit zu verbessern.
:::

### setInv

Invertieren Sie die Matrix oder werfen Sie, wenn die Matrix nicht invertierbar ist. Da Mat4 die vorberechnete Inverse speichert, ist diese Operation O(1). Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.setInv() // -> mat4
```

### setLookAt

Legen Sie die Matrixrotation so fest, dass sie auf das Ziel ausgerichtet ist, wobei Translation und Skalierung unverändert bleiben. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.setLookAt(target: Vec3Source, up: Vec3Source) // -> mat4
```

### setPremultiply

Setzt diese Matrix auf das Ergebnis von m mal dieser Matrix. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.setPremultiply(m: Mat4) // -> mat4
```

### setScale

Multiplizieren Sie jedes Element der Matrix mit einem Skalierer. Die Skalierung durch 0 führt zu einem Fehler. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.setScale(s: Zahl) // -> mat4
```

### setTimes

Setzt die Matrix auf das Ergebnis dieser Matrix mal m. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.setTimes(target: Mat4Source) // -> mat4
```

### setTranspose

Setzt die Matrix auf ihre Transponierung. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.setTranspose() // -> mat4
```

## Einstellung

Die folgenden Methoden setzen den Wert des aktuellen Mat4-Objekts ohne Rücksicht auf seinen aktuellen Inhalt und ersetzen das, was vorher da war.

### makeI

Setzt die Matrix auf die Identitätsmatrix. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.makeI() // -> mat4
```

### makeR

Setzt diese Matrix auf eine Rotationsmatrix aus dem angegebenen Quaternion. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.makeR(r: QuatSource) // -> mat4
```

### makeRows

Erstellen einer Matrix mit angegebenen Zeilendaten und optional angegebenen inversen Zeilendaten. dataRows und inverseDataRows sollten vier Arrays mit jeweils vier Zahlen sein. Wird die Inverse nicht angegeben, so wird sie berechnet, wenn die Matrix invertierbar ist.

:::danger
Wenn die Matrix nicht invertierbar ist, führt der Aufruf von inv() zu einem Fehler.
:::

```ts
existingMat4.makeRows(rowData: Zahl[][], inverseRowData?: Zahl[][]) // -> mat4
```

### makeS

Setzt diese Matrix auf eine Skalenmatrix aus dem angegebenen Vektor. Kein Element des Vektors sollte Null sein. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.makeS(s: Vec3Source) // -> mat4
```

### makeT

Setzt diese Matrix auf eine Übersetzungsmatrix aus dem angegebenen Vektor. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.makeT(s: Vec3Source) // -> mat4
```

### makeTr

Setzt diese Matrix auf eine Translations- und Rotationsmatrix aus dem angegebenen Vektor und Quaternion. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.makeTr(t: Vec3Source, r: QuatSource) // -> mat4
```

### makeTrs

Setzt diese Matrix auf eine Translations-, Rotations- und Skalierungsmatrix aus den angegebenen Vektoren und Quaternionen. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.makeTrs(t: Vec3Source, r: QuatSource, s: Vec3Source) // -> mat4
```

### einstellen.

Setzt den Wert der Matrix und die Inverse auf die angegebenen Werte. Wird keine Umkehrung angegeben, so wird eine solche berechnet, wenn dies möglich ist. Wenn die Matrix nicht invertierbar ist, führt der Aufruf von inv() zu einem Fehler. Speichert das Ergebnis in diesem Mat4 und gibt dieses Mat4 zur Verkettung zurück.

```ts
existingMat4.set(data: Zahl[], inverseData?: Zahl[]) // -> mat4
```
