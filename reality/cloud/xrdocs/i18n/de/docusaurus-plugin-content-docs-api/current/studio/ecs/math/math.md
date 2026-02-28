---
id: math
---

# Mathe

## Beschreibung

Diese Bibliothek enthält Typen und Funktionen, die verschiedene Arten von Mathematik behandeln.

## Kompatibilität

Die Typen in `ecs.math` repräsentieren weit verbreitete Paradigmen und können leicht mit anderen Bibliotheken verknüpft werden.

### drei.js

Die Typen in `ecs.math` können in und aus den entsprechenden three.js Mathe-Typen `THREE.Vector3`, `THREE.Quaternion` und `THREE.Matrix4` konvertiert werden, indem man die folgenden Beispiele befolgt.

```ts
const {mat4, quat, vec3} = ecs.math

// Vec3 <--> THREE.Vector3
const v3js = new THREE.Vector3()
const v = vec3.zero()

v3js.copy(v) // Setzen eines THREE.Vector3 aus einem Vec3.
v.setFrom(v3js) // Einen Vec3 aus einem THREE.Vector3 setzen.
const v2 = vec3.from(v3js) // Neuen Vec3 aus einem THREE.Vector3 erzeugen.

// Quat <--> THREE.Quaternion
const q3js = new THREE.Quaternion()
const q = quat.zero()

q3js.copy(q) // Ein THREE.Quaternion aus einem Quat setzen.
q.setFrom(q3js) // Ein Quat aus einem THREE.Quaternion setzen.
const q2 = quat.from(q3js) // Neues Quat aus einem THREE.Quaternion erzeugen.

// Mat4 <--> THREE.Matrix4
const m3js = new THREE.Matrix4()
const m = mat4.i()

m3js.fromArray(m.data()) // Setzen einer THREE.Matrix4 aus einer Mat4.
m.set(m3js.elements) // Setzt eine Mat4 aus einer THREE.Matrix4.
const m2 = mat4.of(m3js.elements) // Erstellt eine neue Mat4 aus einer THREE.Matrix4
```
