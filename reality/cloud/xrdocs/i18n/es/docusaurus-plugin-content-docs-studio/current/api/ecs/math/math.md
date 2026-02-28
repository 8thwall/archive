---
id: math
---

# math

## Descripción

This library includes types and functions to handle different types of math.

## Compatibility

The types in `ecs.math` represent widely followed paradigms and can be bridged easily to other libraries.

### three.js

The types in ecs.math can be converted to and from the corresponding three.js math types `THREE.Vector3`, `THREE.Quaternion`, and `THREE.Matrix4` by following the examples below.

```ts
const {mat4, quat, vec3} = ecs.math

// Vec3 <--> THREE.Vector3
const v3js = new THREE.Vector3()
const v = vec3.zero()

v3js.copy(v) // Establece un THREE.Vector3 a partir de un Vec3.
v.setFrom(v3js) // Establece un Vec3 a partir de un THREE.Vector3.
const v2 = vec3.from(v3js) // Crea un nuevo Vec3 a partir de un THREE.Vector3.

// Quat <--> THREE.Quaternion
const q3js = new THREE.Quaternion()
const q = quat.zero()

q3js.copy(q) // Establece un THREE.Quaternion a partir de un Quat.
q.setFrom(q3js) // Establece un Quat a partir de un THREE.Quaternion.
const q2 = quat.from(q3js) // Crea un nuevo Quat a partir de un THREE.Quaternion.

// Mat4 <--> THREE.Matrix4
const m3js = new THREE.Matrix4()
const m = mat4.i()

m3js.fromArray(m.data()) // Establece una THREE.Matrix4 a partir de una Mat4.
m.set(m3js.elements) // Establece una Mat4 a partir de una THREE.Matrix4.
const m2 = mat4.of(m3js.elements) // Crea una nueva Mat4 a partir de una THREE.Matrix4
```
