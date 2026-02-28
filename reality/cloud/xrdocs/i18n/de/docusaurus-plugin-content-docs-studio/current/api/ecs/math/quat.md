---
id: quat
---

# quat

Schnittstelle, die ein Quaternion darstellt. Eine Quaternion wird durch (x, y, z, w)-Koordinaten dargestellt und repräsentiert eine 3D-Drehung. Quaternionen können mit den Schnittstellen in Mat4 in und aus 4x4-Rotationsmatrizen umgewandelt werden. Quaternion-Objekte werden mit der ecs.math.quat QuatFactory oder durch Operationen mit anderen Quat-Objekten erzeugt.

## Quelle

Die Schnittstelle QuatSource stellt ein beliebiges Objekt dar, das über die Eigenschaften x, y, z und w verfügt und somit als Datenquelle für die Erstellung eines Quat verwendet werden kann. Darüber hinaus kann QuatSource als Argument für Quat-Algorithmen verwendet werden, was bedeutet, dass jedes Objekt mit den Eigenschaften {x: Zahl, y: Zahl, z: Zahl, w: Zahl} verwendet werden kann.

## Eigenschaften

Quat hat die folgenden aufzählbaren Eigenschaften:

Nur lesen x: Zahl\`\` Zugriff auf die x-Komponente des Quaternions.

Nur lesen y: Zahl\`\` Zugriff auf die y-Komponente des Quaternions.

Nur lesen z: Zahl\`\` Zugriff auf die z-Komponente des Quaternions.

w: Zahl\`\` Zugriff auf die w-Komponente des Quaternions.

## Fabrik

### axisAngle

Erstellen Sie einen Quat aus einer Achsen-Winkel-Darstellung. Die Richtung des aa-Vektors gibt die Drehachse an, und der Betrag des Vektors gibt den Winkel in Radiant an. Zum Beispiel stellt quat.axisAngle(vec3.up().scale(Math.PI / 2)) eine 90-Grad-Drehung um die y-Achse dar und ist äquivalent zu quat.yDegrees(90). Wenn target angegeben wird, wird das Ergebnis in target gespeichert und target zurückgegeben. Andernfalls wird ein neuer Quat erstellt und zurückgegeben.

```ts
ecs.math.quat.axisAngle(aa: Vec3Source, target?: Quat) // -> quat
```

### von

Erstellen Sie einen Quat aus einem Objekt mit den Eigenschaften x, y, z, w.

```ts
ecs.math.quat.from({x, y, z, w}: {x: Zahl, y: Zahl, z: Zahl, w: Zahl) // -> quat
```

### lookAt

Erstellen einer Quat, die die Drehung darstellt, die erforderlich ist, damit ein Objekt, das sich an der Position "Auge" befindet, auf ein Objekt blickt, das sich an der Position "Ziel" befindet, mit dem angegebenen "Aufwärtsvektor".

```ts
ecs.math.quat.lookAt(eye: Vec3Source, target: Vec3Source, up: Vec3Source) // -> quat
```

### pitchYawRollDegrees

Konstruieren Sie ein Quaternion aus einer Pitch/Gaw/Roll-Darstellung, auch bekannt als YXZ-Euler-Winkel. Die Drehung wird in Grad angegeben.

```ts
ecs.math.quat.pitchYawRollDegrees(v: Vec3Source) // -> quat
```

### pitchYawRollRadians

Konstruieren Sie ein Quaternion aus einer Pitch/Gaw/Roll-Darstellung, auch bekannt als YXZ-Euler-Winkel. Die Drehung wird in Radiant angegeben.

```ts
ecs.math.quat.pitchYawRollRadians(v: Vec3Source) // -> quat
```

### xDegrees

Erstellen Sie ein Quat, das eine Drehung um die x-Achse darstellt. Die Drehung wird in Grad angegeben.

```ts
ecs.math.quat.xDegrees(degrees: number) // -> quat
```

### xRadianer

Erstellen Sie ein Quat, das eine Drehung um die x-Achse darstellt. Die Drehung wird in Radiant angegeben.

```ts
ecs.math.quat.xRadians(radians: Zahl) // -> quat
```

### xyzw

Erstellen Sie einen Quat aus den Werten x, y, z, w.

```ts
ecs.math.quat.xyzw(x: Zahl, y: Zahl, z: Zahl, w: Zahl) // -> quat
```

### yGrad

Erstellen Sie ein Quat, das eine Drehung um die y-Achse darstellt. Die Drehung wird in Grad angegeben.

```ts
ecs.math.quat.yDegrees(degrees: Zahl) // -> quat
```

### yRadianer

Erstellen Sie ein Quat, das eine Drehung um die y-Achse darstellt. Die Drehung wird in Radiant angegeben.

```ts
ecs.math.quat.yRadians(radians: Zahl) // -> quat
```

### zDegrees

Erstellen Sie einen Quat, der eine Drehung um die z-Achse darstellt. Die Drehung wird in Grad angegeben.

```ts
ecs.math.quat.zDegrees(degrees: number) // -> quat
```

### zRadianer

Erstellen Sie einen Quat, der eine Drehung um die z-Achse darstellt. Die Drehung wird in Radiant angegeben.

```ts
ecs.math.quat.zRadians(radians: Zahl) // -> quat
```

### Null

Erstellen Sie einen Quat, der eine Nullrotation darstellt.

```ts
ecs.math.quat.zero() // -> quat
```

## Unveränderlich

Die folgenden Methoden führen Berechnungen mit dem aktuellen Wert eines Quat durch, ohne dessen Inhalt zu verändern. Methoden, die Quat-Typen zurückgeben, erzeugen neue Instanzen. Während unveränderliche APIs im Allgemeinen sicherer und besser lesbar sind und die Wahrscheinlichkeit von Fehlern verringern, können sie ineffizient werden, wenn eine große Anzahl von Objekten pro Frame zugewiesen wird.

:::note
Wenn die Garbage Collection die Leistung beeinträchtigt, sollten Sie die unten beschriebene Mutable API verwenden.
:::

### axisAngle

Konvertiert die Quaternion in eine Achsen-Winkel-Darstellung. Die Richtung des Vektors gibt die Drehachse an, und der Betrag des Vektors gibt den Winkel in Radiant an. Wird "target" angegeben, wird das Ergebnis in "target" gespeichert und "target" zurückgegeben. Andernfalls wird ein neuer Vec3 erstellt und zurückgegeben.

```ts
existingQuat.axisAngle(target?: Vec3) // -> vec3
```

### klonen.

Erstellen Sie eine neue Quaternion mit denselben Komponenten wie diese Quaternion.

```ts
existingQuat.clone() // -> quat
```

### konjugieren

Gibt die Rotationskonjugierte dieses Quaternions zurück. Die Konjugierte einer Quaternion stellt die gleiche Drehung in der entgegengesetzten Richtung um die Drehachse dar.

```ts
existingQuat.conjugate() // -> quat
```

### Daten

Zugriff auf die Quaternion als Array von [x, y, z, w].

```ts
ecs.math.quat.data() // -> Zahl[]
```

### GradZu

Winkel zwischen zwei Quaternionen, in Grad.

```ts
existingQuat.degreesTo(target: QuatSource) // -> Zahl
```

### delta

Berechnen Sie die Quaternion, die erforderlich ist, um diese Quaternion in die Zielquaternion zu drehen.

```ts
existingQuat.delta(target: QuatSource) // -> quat
```

### Punkt

Berechnen Sie das Punktprodukt dieses Quaternions mit einem anderen Quaternion.

```ts
existingQuat.dot(target: QuatSource) // -> quat
```

### ist gleich

Prüfen, ob zwei Quaternionen gleich sind, mit einer bestimmten Fließkommatoleranz.

```ts
existingQuat.equals(q: QuatSource, tolerance: number) // -> boolean
```

### inv

Berechnen Sie die Quaternion, die diese Quaternion multipliziert, um eine Null-Drehung-Quaternion zu erhalten.

```ts
existingQuat.inv() // -> quat
```

### verneinen

Negiert alle Komponenten dieses Quaternions. Das Ergebnis ist ein Quaternion, das die gleiche Drehung wie dieses Quaternion darstellt.

```ts
existingQuat.negate() // -> quat
```

### normalisieren

Ermittelt die normalisierte Version dieses Quaternions mit der Länge 1.

```ts
existingQuat.normalize() // -> quat
```

### pitchYawRollRadians

Wandeln Sie die Quaternion in Neigungs-, Gier- und Rollwinkel im Bogenmaß um.

```ts
ecs.math.quat.pitchYawRollRadians(target?: Vec3) // -> vec3
```

### pitchYawRollDegrees

Wandeln Sie die Quaternionen in Neigungs-, Gier- und Rollwinkel in Grad um.

```ts
ecs.math.quat.pitchYawRollDegrees(target?: Vec3) // -> vec3
```

### plus

Zwei Quaternionen zusammenzählen.

```ts
ecs.math.quat.plus(q: QuatSource) // -> quat
```

### radiansTo

Winkel zwischen zwei Quaternionen, in Radiant.

```ts
ecs.math.quat.rotateToward(target: QuatSource, radians: number) // -> quat
```

### slerp

Sphärische Interpolation zwischen zwei Quaternionen mit einem vorgegebenen Interpolationswert. Wenn die Interpolation auf 0 gesetzt ist, wird diese Quaternion zurückgegeben. Wenn die Interpolation auf 1 gesetzt ist, wird die Ziel-Quaternion zurückgegeben.

```ts
ecs.math.quat.slerp(target: QuatSource, t: number) // -> quat
```

### mal

Zwei Quaternionen miteinander multiplizieren.

```ts
existingQuat.times(q: QuatSource) // -> quat
```

### timesVec

Multiplizieren Sie die Quaternion mit einem Vektor. Dies ist gleichbedeutend mit der Umwandlung der Quaternion in eine Drehmatrix und der Multiplikation der Matrix mit dem Vektor.

```ts
ecs.math.quat.times(v: Vec3Source, target?: Vec3) // -> vec3
```

## Veränderlich

Die folgenden Methoden führen Berechnungen mit dem aktuellen Wert eines Quat durch und ändern ihn direkt. Diese Methoden entsprechen denen in der obigen Unveränderlichen API. Bei der Rückgabe von Quat-Typen liefern sie einen Verweis auf dasselbe Objekt, was eine Methodenverkettung ermöglicht. Veränderbare APIs können zwar eine bessere Leistung als unveränderliche APIs bieten, sind aber tendenziell weniger sicher, weniger lesbar und fehleranfälliger. Wenn es unwahrscheinlich ist, dass der Code häufig innerhalb eines einzelnen Frames aufgerufen wird, sollten Sie die Immutable API verwenden, um die Sicherheit und Übersichtlichkeit zu erhöhen.

### setConjugate

Setzen Sie diese Quaternion auf ihre Rotationskonjugierte. Die Konjugierte einer Quaternion stellt die gleiche Drehung in der entgegengesetzten Richtung um die Drehachse dar. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setConjugate() // -> quat
```

### setDelta

Berechnen Sie die Quaternion, die erforderlich ist, um diese Quaternion in die Zielquaternion zu drehen. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setDelta(target: QuatSource) // -> quat
```

### setInv

Setzen Sie dies auf die Quaternion, die diese Quaternion multipliziert, um eine Nullrotationsquaternion zu erhalten. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setInv() // -> quat
```

### setNegate

Negiert alle Komponenten dieses Quaternions. Das Ergebnis ist ein Quaternion, das die gleiche Drehung wie dieses Quaternion darstellt. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setNegate() // -> quat
```

### setNormalize

Ermittelt die normalisierte Version dieses Quaternions mit der Länge 1. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setNormalize() // -> quat
```

### setPlus

Diese Quaternion wird zu einer anderen Quaternion addiert. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setPlus(q: QuatSource) // -> quat
```

### setPremultiply

Setzt diese Quaternion auf das Ergebnis von q mal dieser Quaternion. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setPremultiply(q: QuatSource) // -> quat
```

### setRotateToward

Drehen Sie diese Quaternion in Richtung der Zielquaternion um eine bestimmte Anzahl von Radianten, die an das Ziel geklammert ist. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setRotateToward(target: QuatSource, radians: number) // -> quat
```

### setSlerp

Sphärische Interpolation zwischen zwei Quaternionen mit einem vorgegebenen Interpolationswert. Wenn die Interpolation auf 0 gesetzt ist, wird diese Quaternion zurückgegeben. Wenn die Interpolation auf 1 gesetzt ist, wird die Ziel-Quaternion zurückgegeben. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setSlerp(target: QuatSource, t: number) // -> quat
```

### setTimes

Zwei Quaternionen miteinander multiplizieren. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setTimes(target: QuatSource) // -> quat
```

## Satz

Die folgenden Methoden setzen den Wert des aktuellen Quat-Objekts ohne Rücksicht auf seinen aktuellen Inhalt und ersetzen das, was vorher da war.

### makeAxisAngle

Setzen eines Quat aus einer Achsen-Winkel-Darstellung. Die Richtung des Vektors gibt die Drehachse an, und der Betrag des Vektors gibt den Winkel in Radiant an. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makeAxisAngle(aa: Vec3Source) // -> quat
```

### makePitchYawRollRadians

Setzen Sie die Quaternion auf eine Drehung, die durch Nick-, Gier- und Rollwinkel in Radiant angegeben wird. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makePitchYawRollRadians(v: Vec3Source) // -> quat
```

### makeLookAt

Setzen Sie die Quaternion auf eine Drehung, die dazu führt, dass das Auge das Ziel mit dem angegebenen Aufwärtsvektor anschaut. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makeLookAt(eye: Vec3Source, target: Vec3Source, up: Vec3Source) // -> quat
```

### makePitchYawRollDegrees

Setzen Sie die Quaternion auf eine Drehung, die durch Nick-, Gier- und Rollwinkel in Grad angegeben wird. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makePitchYawRollDegrees(v: Vec3Source) // -> quat
```

### makeXDegrees

Setzen Sie die Quaternion auf eine Drehung um die x-Achse (Pitch) in Grad. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makeXDegrees(degrees: number) // -> quat
```

### makeXRadians

Setzen Sie die Quaternion auf eine Drehung um die x-Achse (Pitch) im Bogenmaß. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makeXRadians(radians: Zahl) // -> quat
```

### makeYDegrees

Setzen Sie die Quaternion auf eine Drehung um die y-Achse (Gieren) in Grad. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makeYDegrees(degrees: number) // -> quat
```

### makeYRadians

Setzen Sie die Quaternion auf eine Drehung um die y-Achse (Gieren) im Bogenmaß. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makeYRadians(radians: Zahl) // -> quat
```

### makeZDegrees

Setzen Sie die Quaternion auf eine Drehung um die z-Achse (Roll) in Grad. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makeZDegrees(degrees: number) // -> quat
```

### makeZRadians

Setzen Sie die Quaternion auf eine Drehung um die z-Achse (Roll) im Bogenmaß. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makeZRadians(radians: number) // -> quat
```

### makeZero

Setzen Sie die Quaternion auf eine Null-Drehung. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.makeZero() // -> quat
```

### setFrom

Setzt diese Quaternion auf den Wert einer anderen Quaternion. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setFrom(q: QuatSource) // -> quat
```

### setXyzw

Setzt die Quaternion auf die angegebenen x-, y-, z- und w-Werte. Speichern Sie das Ergebnis in diesem Quat und geben Sie diesen Quat zur Verkettung zurück.

```ts
existingQuat.setXyzw(x: Zahl, y: Zahl, z: Zahl, w: Zahl) // -> quat
```
