---
id: vec3
---

# vec3

Interfaz que representa un vector 3D. A 3D vector is represented by (x, y, z) coordinates, and can represent a point in space, a directional vector, or other types of data with three ordered dimensions. 3D vectors can be multiplied by 4x4 matrices (Mat4) using homogeneous coordinate math, enabling efficient 3D geometry computation. Vec3 objects are created with the ecs.math.vec3 Vec3Factory, or through operations on other Vec3 objects.

## Source

The Vec3Source interface represents any object that has x, y, and z properties and hence can be used as a data source to create a Vec3. In addition, Vec3Source can be used as an argument to Vec3 algorithms, meaning that any object with {x: number, y: number, z: number} properties can be used.

## Propiedades

Vec3 tiene las siguientes propiedades enumerables:

`readonly x: number` Access the x component of the vector.

`readonly y: number` Access the y component of the vector.

`readonly z: number` Access the z component of the vector.

## Factory

### from

Create a Vec3 from a Vec3, or other object with x, y properties.

```ts
ecs.math.vec3.from({x, y}: {x: number, y: number, z: number}}) // -> vec3
```

### one

Create a vec3 where all elements are set to one. This is equivalent to `vec3.from({x: 1, y: 1, z: 1})`.

```ts
ecs.math.vec3.one() // -> vec3
```

### escala

Create a vec3 with all elements set to the scale value s. This is equivalent to `vec3.from({x: s, y: s, z: s})`.

```ts
ecs.math.vec3.scale(s: number) // -> vec3
```

### xyz

Crea un Vec3 a partir de los valores x, y, z. This is equivalent to `vec3.from({x, y, z})`.

```ts
ecs.math.vec3.xyz(x: number, y: number, z: number) // -> vec3
```

### zero

Create a vec3 where all elements are set to zero. This is equivalent to `vec3.from({x: 0, y: 0, z: 0})`.

```ts
ecs.math.vec3.zero() // -> vec3
```

## Immutable

The following methods perform computations based on the current value of a Vec3, but do not modify its contents. Los métodos que devuelven tipos Vec3 devuelven nuevos objetos. Immutable APIs are typically safer, more readable, and less error-prone than mutable APIs, but may be inefficient in situations where thousands of objects are allocated each frame.

:::note
If garbage collection impacts performance, consider using the Mutable API described below.
:::

### clone

Crea un nuevo vector con los mismos componentes que este vector.

```ts
existingVec3.clone() // -> vec3
```

### cross

Calcula el producto cruz de este vector y otro vector.

```ts
existingVec3.cross(v: Vec3Source) // -> vec3
```

### data

Accede al vector como una matriz homogénea (4 dimensiones).

```ts
existingVec3.data() // -> number[]
```

### distanceTo

Compute the Euclidean distance between this vector and another vector.

```ts
existingVec3.distanceTo(v: Vec3Source) // -> vec3
```

### divide

División vectorial por elementos.

```ts
existingVec3.divide(v: Vec3Source) // -> vec3
```

### dot

Calcula el producto punto de este vector y otro vector.

```ts
existingVec3.dot(v: Vec3Source) // -> vec3
```

### equals

Comprueba si dos vectores son iguales, con una tolerancia en coma flotante especificada.

```ts
existingVec3.equals(v: Vec3Source, tolerance: number) // -> boolean
```

### length

Longitud del vector.

```ts
existingVec3.length() // -> number
```

### minus

Resta un vector de este vector.

```ts
existingVec3.minus(v: Vec3Source) // -> vec3
```

### mix

Compute a linear interpolation between this vector and another vector v with a factor t such that the result is thisVec \* (1 - t) + v \* t. El factor t debe estar comprendido entre 0 y 1.

```ts
existingVec3.mix(v: Vec3Source, t: number) // -> vec3
```

### normalize

Devuelve un nuevo vector con la misma dirección que este vector, pero con una longitud de 1.

```ts
existingVec3.normalize() // -> vec3
```

### plus

Suma dos vectores.

```ts
existingVec3.plus(v: Vec3Source) // -> vec3
```

### escala

Multiplica el vector por un escalar.

```ts
existingVec3.scale(s: number) // -> vec3
```

### times

Multiplicación vectorial por elementos.

```ts
existingVec3.times(v: Vec3Source) // -> vec3
```

## Mutable

The following methods perform computations based on the current value of a Vec3, and modify its contents in place. Son paralelos a los métodos de la API mutable anterior. Methods that return Vec3 types return a reference to the current object for convenient method chaining. Mutable APIs can be more performant than Immutable APIs, but are typically less safe, less readable, and more error-prone.

### SetCross

Calcula el producto cruz de este vector y otro vector. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.setCross(v: Vec3Source) // -> vec3
```

### setDivide

División vectorial por elementos. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.setDivide(v: Vec3Source) // -> vec3
```

### setMinus

Resta un vector de este vector. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.setMinus(v: Vec3Source) // -> vec3
```

### setMix

Compute a linear interpolation between this vector and another vector v with a factor t such that the result is thisVec \* (1 - t) + v \* t. El factor t debe estar comprendido entre 0 y 1. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.setMinus(v: Vec3Source, t: number) // -> vec3
```

### setNormalize

Establece que el vector sea una versión de sí mismo con la misma dirección, pero con longitud 1. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.setNormalize() // -> vec3
```

### setPlus

Suma dos vectores. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.setPlus(v: Vec3Source) // -> vec3
```

### setScale

Multiplica el vector por un escalar. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.setPlus(s: number) // -> vec3
```

### setTimes

Multiplicación vectorial por elementos. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.setTimes(v: Vec3Source) // -> vec3
```

### setX

Establece el componente x del Vec3. Store the result in this Vec3 and return this Vec3 for chaining.

```ts
existingVec3.setX(v: number) // -> vec3
```

### setY

Establece el componente y del Vec3. Store the result in this Vec3 and return this Vec3 for chaining.

```ts
existingVec3.setY(v: number) // -> vec3
```

### setZ

Establece el componente z del Vec3. Store the result in this Vec3 and return this Vec3 for chaining.

```ts
existingVec3.setZ(v: number) // -> vec3
```

### Set

The following methods set the value of the current Vec3 object without regard to its current content, replacing whatever was there before.

### makeOne

Configura el Vec3 para que sean todos unos. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.makeOne() // -> vec3
```

### makeScale

Configura el Vec3 para que todos los componentes tengan el valor de escala s. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.makeScale(s: number) // -> vec3
```

### makeZero

Configura el Vec3 para que sea todo ceros. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.makeZero() // -> vec3
```

### setFrom

Set this Vec3 to have the same value as another Vec3 or other object with x and y, and z properties. Store the result in this Vec3 and return this Vec3 for chaining.

```ts
existingVec3.setFrom(source: Vec3Source) // -> vec3
```

### setXyz

Establece los componentes x, y, y z del Vec3. Store the result in this Vec3 and return this Vec3 for chaining.

```ts
existingVec3.setFrom(x: number, y: number, z: number) // -> vec3
```
