---
id: math
---

# 数学

## 説明

このライブラリには、さまざまな種類の数学を扱うための型と関数が含まれている。

## 互換性

ecs.math\`の型は広く普及しているパラダイムを表しており、他のライブラリとの橋渡しが容易である。

### three.js

ecs.mathの型は、以下の例に従って、対応するthree.jsの数学型である`THREE.Vector3`、`THREE.Quaternion`、`THREE.Matrix4`に変換することができる。

```ts
const {mat4, quat, vec3} = ecs.math

// Vec3<--> THREE.Vector3
const v3js = new THREE.Vector3()
const v = vec3.zero()

v3js.copy(v) // Vec3 から THREE.Vector3 をセット。
v.setFrom(v3js) // THREE.Vector3 から Vec3 を設定
const v2 = vec3.from(v3js) // THREE.Vector3 から新しい Vec3 を作成。

// Quat<--> THREE.Quaternion
const q3js = new THREE.Quaternion()
const q = quat.zero()

q3js.copy(q) // Quat から THREE.Quaternion を設定します。

const q2 = quat.from(q3js) // THREE.Quaternion から新しい Quat を作成。

// Mat4<--> THREE.Matrix4
const m3js = new THREE.Matrix4()
const m = mat4.i()

m3js.fromArray(m.data()) // Mat4 から THREE.Matrix4 をセット．
m.set(m3js.elements) // THREE.Matrix4 から Mat4 をセット
const m2 = mat4.of(m3js.elements) // THREE.Matrix4 から，新しい Mat4 を作成．
```
