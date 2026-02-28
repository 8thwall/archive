---
id: quat
---

# quat

Interfaz que representa un cuaternión. A quaternion is represented by (x, y, z, w) coordinates, and represents a 3D rotation. Quaternions can be converted to and from 4x4 rotation matrices with the interfaces in Mat4. Quaternion objects are created with the ecs.math.quat QuatFactory, or through operations on other Quat objects.

## Source

The QuatSource interface represents any object that has x, y, z, and w properties and hence can be used as a data source to create a Quat. In addition, QuatSource can be used as an argument to Quat algorithms, meaning that any object with {x: number, y: number, z: number, w: number} properties can be used.

## Propiedades

Quat tiene las siguientes propiedades enumerables:

`readonly x: number` Access the x component of the quaternion.

`readonly y: number` Access the y component of the quaternion.

`readonly z: number` Access the z component of the quaternion.

`readonly w: number` Access the w component of the quaternion.

## Factory

### axisAngle

Crear un Quat a partir de una representación eje-ángulo. The direction of the aa vector gives the axis of rotation, and the magnitude of the vector gives the angle, in radians. For example, quat.axisAngle(vec3.up().scale(Math.PI / 2)) represents a 90-degree rotation about the y-axis, and is equivalent to quat.yDegrees(90). If target is supplied, the result will be stored in target and target will be returned. En caso contrario, se creará y devolverá un nuevo Quat.

```ts
ecs.math.quat.axisAngle(aa: Vec3Source, target?: Quat) // -> quat
```

### from

Crea un Quat a partir de un objeto con propiedades x, y, z, w.

```ts
ecs.math.quat.from({x, y, z, w}: {x: number, y: number, z: number, w: number) // -> quat
```

### lookAt

Create a Quat representing the rotation required for an object positioned at ‘eye’ to look at an object positioned at ‘target’, with the given ‘up vector.

```ts
ecs.math.quat.lookAt(eye: Vec3Source, target: Vec3Source, up: Vec3Source) // -> quat
```

### pitchYawRollDegrees

Construye un cuaternión a partir de una representación de cabeceo / guiñada / balanceo, también conocidos como ángulos de Euler YXZ. La rotación se especifica en grados.

```ts
ecs.math.quat.pitchYawRollDegrees(v: Vec3Source) // -> quat
```

### pitchYawRollRadians

Construye un cuaternión a partir de una representación de cabeceo / guiñada / balanceo, también conocidos como ángulos de Euler YXZ. La rotación se especifica en radianes.

```ts
ecs.math.quat.pitchYawRollRadians(v: Vec3Source) // -> quat
```

### xDegrees

Crea un Quat que represente una rotación alrededor del eje x. La rotación se especifica en grados.

```ts
ecs.math.quat.xDegrees(degrees: number) // -> quat
```

### xRadians

Crea un Quat que represente una rotación alrededor del eje x. La rotación se especifica en radianes.

```ts
ecs.math.quat.xRadians(radians: number) // -> quat
```

### xyzw

Crear un Quat a partir de los valores x, y, z, w.

```ts
ecs.math.quat.xyzw(x: number, y: number, z: number, w: number) // -> quat
```

### yDegrees

Crea un Quat que represente una rotación alrededor del eje y. La rotación se especifica en grados.

```ts
ecs.math.quat.yDegrees(degrees: number) // -> quat
```

### yRadians

Crea un Quat que represente una rotación alrededor del eje y. La rotación se especifica en radianes.

```ts
ecs.math.quat.yRadians(radians: number) // -> quat
```

### zDegrees

Crea un Quat que represente una rotación alrededor del eje z. La rotación se especifica en grados.

```ts
ecs.math.quat.zDegrees(degrees: number) // -> quat
```

### zRadians

Crea un Quat que represente una rotación alrededor del eje z. La rotación se especifica en radianes.

```ts
ecs.math.quat.zRadians(radians: number) // -> quat
```

### zero

Crea un Quat que represente una rotación cero.

```ts
ecs.math.quat.zero() // -> quat
```

## Immutable

The following methods perform calculations using the current value of a Quat without modifying its contents. Methods that return Quat types create new instances. While immutable APIs are generally safer, more readable, and reduce the likelihood of errors, they can become inefficient when a large number of objects are allocated per frame.

:::note
If garbage collection impacts performance, consider using the Mutable API described below.
:::

### axisAngle

Convierte el cuaternión en una representación eje-ángulo. The direction of the vector gives the axis of rotation, and the magnitude of the vector gives the angle, in radians. If ‘target’ is supplied, the result will be stored in ‘target’ and ‘target’ will be returned. Otherwise, a new Vec3 will be created and returned.

```ts
existingQuat.axisAngle(target?: Vec3) // -> vec3
```

### clone

Crea un nuevo cuaternión con los mismos componentes que este cuaternión.

```ts
existingQuat.clone() // -> quat
```

### conjugate

Devuelve el conjugado rotacional de este cuaternión. The conjugate of a quaternion represents the same rotation in the opposite direction about the rotational axis.

```ts
existingQuat.conjugate() // -> quat
```

### data

Accede al cuaternión como una matriz de [x, y, z, w].

```ts
ecs.math.quat.data() // -> number[]
```

### degreesTo

Ángulo entre dos cuaterniones, en grados.

```ts
existingQuat.degreesTo(target: QuatSource) // -> number
```

### delta

Calcula el cuaternión necesario para rotar este cuaternión al cuaternión objetivo.

```ts
existingQuat.delta(target: QuatSource) // -> quat
```

### dot

Calcula el producto punto de este cuaternión con otro cuaternión.

```ts
existingQuat.dot(target: QuatSource) // -> quat
```

### equals

Comprueba si dos cuaterniones son iguales, con una tolerancia en coma flotante especificada.

```ts
existingQuat.equals(q: QuatSource, tolerance: number) // -> boolean
```

### inv

Calcula el cuaternión que multiplica este cuaternión para obtener un cuaternión de rotación cero.

```ts
existingQuat.inv() // -> quat
```

### negate

Niega todos los componentes de este cuaternión. The result is a quaternion representing the same rotation as this quaternion.

```ts
existingQuat.negate() // -> quat
```

### normalize

Obtiene la versión normalizada de este cuaternión con una longitud de 1.

```ts
existingQuat.normalize() // -> quat
```

### pitchYawRollRadians

Convierte el cuaternión a ángulos de cabeceo, guiñada y balanceo en radianes.

```ts
ecs.math.quat.pitchYawRollRadians(target?: Vec3) // -> vec3
```

### pitchYawRollDegrees

Convierte el cuaternión a ángulos de cabeceo, guiñada y balanceo en grados.

```ts
ecs.math.quat.pitchYawRollDegrees(target?: Vec3) // -> vec3
```

### plus

Suma dos cuaterniones.

```ts
ecs.math.quat.plus(q: QuatSource) // -> quat
```

### radiansTo

Ángulo entre dos cuaterniones, en radianes.

```ts
ecs.math.quat.rotateToward(target: QuatSource, radians: number) // -> quat
```

### slerp

Interpolación esférica entre dos cuaterniones dado un valor de interpolación proporcionado. If the interpolation is set to 0, then it will return this quaternion. If the interpolation is set to 1, then it will return the target quaternion.

```ts
ecs.math.quat.slerp(target: QuatSource, t: number) // -> quat
```

### times

Multiplica dos cuaterniones entre sí.

```ts
existingQuat.times(q: QuatSource) // -> quat
```

### timesVec

Multiplica el cuaternión por un vector. This is equivalent to converting the quaternion to a rotation matrix and multiplying the matrix by the vector.

```ts
ecs.math.quat.times(v: Vec3Source, target?: Vec3) // -> vec3
```

## Mutable

The following methods perform calculations using the current value of a Quat and modify it directly. These methods correspond to those in the Immutable API above. When returning Quat types, they provide a reference to the same object, allowing for method chaining. While mutable APIs can offer better performance than immutable ones, they tend to be less safe, less readable, and more prone to errors. If the code is unlikely to be called frequently within a single frame, consider using the Immutable API for improved safety and clarity.

### setConjugate

Establece este cuaternión en su conjugado rotacional. The conjugate of a quaternion represents the same rotation in the opposite direction about the rotational axis. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setConjugate() // -> quat
```

### setDelta

Calcula el cuaternión necesario para rotar este cuaternión al cuaternión objetivo. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setDelta(target: QuatSource) // -> quat
```

### setInv

Establece esto al quaternion que multiplica este quaternion para obtener un quaternion de rotación cero. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setInv() // -> quat
```

### setNegate

Niega todos los componentes de este cuaternión. The result is a quaternion representing the same rotation as this quaternion. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.setNegate() // -> quat
```

### setNormalize

Obtiene la versión normalizada de este cuaternión con una longitud de 1. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.setNormalize() // -> quat
```

### setPlus

Añade este cuaternión a otro cuaternión. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.setPlus(q: QuatSource) // -> quat
```

### setPremultiply

Establece este cuaternión el resultado de q veces este cuaternión. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.setPremultiply(q: QuatSource) // -> quat
```

### setRotateToward

Rotate this quaternion towards the target quaternion by a given number of radians, clamped to the target. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.setRotateToward(target: QuatSource, radians: number) // -> quat
```

### setSlerp

Interpolación esférica entre dos cuaterniones dado un valor de interpolación proporcionado. If the interpolation is set to 0, then it will return this quaternion. If the interpolation is set to 1, then it will return the target quaternion. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.setSlerp(target: QuatSource, t: number) // -> quat
```

### setTimes

Multiplica dos cuaterniones entre sí. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.setTimes(target: QuatSource) // -> quat
```

## Set

The following methods set the value of the current Quat object without regard to its current content, replacing whatever was there before.

### makeAxisAngle

Establecer un Quat a partir de una representación eje-ángulo. The direction of the vector gives the axis of rotation, and the magnitude of the vector gives the angle, in radians. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makeAxisAngle(aa: Vec3Source) // -> quat
```

### makePitchYawRollRadians

Establece el cuaternión a una rotación especificada por los ángulos de cabeceo, guiñada y balanceo en radianes. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makePitchYawRollRadians(v: Vec3Source) // -> quat
```

### makeLookAt

Set the quaternion to a rotation that would cause the eye to look at the target with the given up vector. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makeLookAt(eye: Vec3Source, target: Vec3Source, up: Vec3Source) // -> quat
```

### makePitchYawRollDegrees

Establece el cuaternión a una rotación especificada por los ángulos de cabeceo, guiñada y balanceo en grados. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makePitchYawRollDegrees(v: Vec3Source) // -> quat
```

### makeXDegrees

Establece el cuaternión a una rotación sobre el eje x (cabeceo) en grados. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makeXDegrees(degrees: number) // -> quat
```

### makeXRadians

Establece el cuaternión a una rotación sobre el eje x (cabeceo) en radianes. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makeXRadians(radians: number) // -> quat
```

### makeYDegrees

Establece el cuaternión a una rotación sobre el eje y (guiñada) en grados. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makeYDegrees(degrees: number) // -> quat
```

### makeYRadians

Establece el cuaternión a una rotación sobre el eje y (guiñada) en radianes. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makeYRadians(radians: number) // -> quat
```

### makeZDegrees

Establece el cuaternión a una rotación sobre el eje z (balanceo) en grados. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makeZDegrees(degrees: number) // -> quat
```

### makeZRadians

Establece el cuaternión a una rotación sobre el eje z (balanceo) en radianes. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makeZRadians(radians: number) // -> quat
```

### makeZero

Establece el cuaternión en una rotación cero. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.makeZero() // -> quat
```

### setFrom

Establece este cuaternión en el valor de otro cuaternión. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.setFrom(q: QuatSource) // -> quat
```

### setXyzw

Establece el cuaternión en los valores x, y, z y w especificados. Store the result in this Quat and return this Quat for chaining.

```ts
existingQuat.setXyzw(x: number, y: number, z: number, w: number) // -> quat
```
