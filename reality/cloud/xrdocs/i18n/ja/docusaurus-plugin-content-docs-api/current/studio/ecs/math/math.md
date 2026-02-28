---
id: math
---

# 数学

## 説明

このライブラリには、さまざまな種類の数学を扱うための型と関数が含まれている。

## 互換性

`ecs.math`の型は広く普及しているパラダイムを表しており、他のライブラリとの橋渡しが容易である。

### three.js

ecs.math`の型は、以下の例に従って、対応する three.js の数式型である `THREE.Vector3`、`THREE.Quaternion`、`THREE.Matrix4\` に変換することができる。

```ts
const {mat4, quat, vec3} = ecs.math

// Vec3 <--> THREE.Vector3
const v3js = new THREE.Vector3()
const v = vec3.zero()

v3js.copy(v)                // Set a THREE.Vector3 from a Vec3.
v.setFrom(v3js)             // Set a Vec3 from a THREE.Vector3.
const v2 = vec3.from(v3js)  // Create new Vec3 from a THREE.Vector3.

// Quat <--> THREE.Quaternion
const q3js = new THREE.Quaternion()
const q = quat.zero()

q3js.copy(q)                // Set a THREE.Quaternion from a Quat.
q.setFrom(q3js)             // Set a Quat from a THREE.Quaternion.
const q2 = quat.from(q3js)  // Create new Quat from a THREE.Quaternion.

// Mat4 <--> THREE.Matrix4
const m3js = new THREE.Matrix4()
const m = mat4.i()

m3js.fromArray(m.data())           // Set a THREE.Matrix4 from a Mat4.
m.set(m3js.elements)               // Set a Mat4 from a THREE.Matrix4.
const m2 = mat4.of(m3js.elements)  // Create a new Mat4 from a THREE.Matrix4
```
