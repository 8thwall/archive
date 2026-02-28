---
id: math
---

# mathématiques

## Description

Cette bibliothèque comprend des types et des fonctions permettant de traiter différents types de mathématiques.

## Compatibilité

Les types de `ecs.math` représentent des paradigmes largement répandus et peuvent être facilement reliés à d'autres bibliothèques.

### three.js

Les types de `ecs.math` peuvent être convertis vers et depuis les types mathématiques correspondants de three.js `THREE.Vector3`, `THREE.Quaternion`, et `THREE.Matrix4` en suivant les exemples ci-dessous.

```ts
const {mat4, quat, vec3} = ecs.math

// Vec3 <--> THREE.Vector3
const v3js = new THREE.Vector3()
const v = vec3.zero()

v3js.copy(v) // Définit un THREE.Vector3 à partir d'un Vec3.
v.setFrom(v3js) // Définit un Vec3 à partir d'un THREE.Vector3.
const v2 = vec3.from(v3js) // Crée un nouveau Vec3 à partir d'un THREE.Vector3.

// Quat <--> THREE.Quaternion
const q3js = new THREE.Quaternion()
const q = quat.zero()

q3js.copy(q) // Définit un THREE.Quaternion à partir d'un Quat.
q.setFrom(q3js) // Définit un Quat à partir d'un THREE.Quaternion.
const q2 = quat.from(q3js) // Crée un nouveau Quat à partir d'un THREE.Quaternion.

// Mat4 <--> THREE.Matrix4
const m3js = new THREE.Matrix4()
const m = mat4.i()

m3js.fromArray(m.data()) // Définit une THREE.Matrix4 à partir d'une Mat4.
m.set(m3js.elements) // Définit une Mat4 à partir d'une matrice THREE.Matrix4.
const m2 = mat4.of(m3js.elements) // Crée une nouvelle Mat4 à partir d'une matrice THREE.Matrix4
```
