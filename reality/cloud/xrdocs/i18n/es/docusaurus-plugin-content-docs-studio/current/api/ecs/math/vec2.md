---
id: vec2
---

# vec2

Interfaz que representa un vector 2D. A 2D vector is represented by (x, y) coordinates, and can represent a point in a plane, a directional vector, or other types of data with three ordered dimensions. Vec2 objects are created with the ecs.math.vec2 Vec2Factory, or through operations on other Vec2 objects.

## Source

The Vec2Source interface represents any object that has x and y properties and hence can be used as a data source to create a Vec2. In addition, Vec2Source can be used as an argument to Vec2 algorithms, meaning that any object with {x: number, y: number} properties can be used.

## Propiedades

Vec2Source tiene las siguientes propiedades enumerables:

`readonly x: number` Access the x component of the vector.

`readonly y: number` Access the y component of the vector.

## Factory

### from

Crea un Vec2 a partir de un Vec2, u otro objeto con propiedades x, y.

```ts
ecs.math.vec2.from({x, y}: {x: number, y: number}) // -> vec2
```

### one

Create a vec2 where all elements are set to one. This is equivalent to `vec2.from({x: 1, y: 1})`.

```ts
ecs.math.vec2.one() // -> vec2
```

### escala

Create a vec2 with all elements set to the scale value s. This is equivalent to `vec2.from({x: s, y: s})`.

```ts
ecs.math.vec2.scale(s: number) // -> vec2
```

### xy

Crea un Vec2 a partir de los valores x, y. This is equivalent to `vec2.from({x, y})`.

```ts
ecs.math.vec2.xy(x: number, y: number) // -> vec2
```

### zero

Create a vec2 where all elements are set to zero. This is equivalent to `vec2.from({x: 0, y: 0})`.

```ts
ecs.math.vec2.zero() // -> vec2
```

## Immutable

The following methods perform computations based on the current value of a Vec2, but do not modify its contents. Los métodos que devuelven tipos Vec2 devuelven nuevos objetos. Immutable APIs are typically safer, more readable, and less error-prone than mutable APIs, but may be inefficient in situations where thousands of objects are allocated each frame.

:::note
If garbage collection impacts performance, consider using the Mutable API described below.
:::

### clone

Crea un nuevo vector con los mismos componentes que este vector.

```ts
existingVec2.clone() // -> vec2
```

### cross

Calcula el producto cruz de este vector y otro vector. For 2D vectors, the cross product is the magnitude of the z component of the 3D cross product of the two vectors with 0 as the z component.

```ts
existingVec2.cross(v: Vec2Source) // -> vec2
```

### distanceTo

Compute the Euclidean distance between this vector and another vector.

```ts
existingVec2.distanceTo(v: Vec2Source) // -> vec2
```

### divide

División vectorial por elementos.

```ts
existingVec2.divide(v: Vec2Source) // -> vec2
```

### dot

Calcula el producto punto de este vector y otro vector.

```ts
existingVec2.dot(v: Vec2Source) // -> vec2
```

### equals

Comprueba si dos vectores son iguales, con una tolerancia en coma flotante especificada.

```ts
existingVec2.equals(v: Vec2Source, tolerance: number) // -> boolean
```

### length

Longitud del vector.

```ts
existingVec2.length() // -> number
```

### minus

Resta un vector de este vector.

```ts
existingVec2.minus(v: Vec2Source) // -> vec2
```

### mix

Compute a linear interpolation between this vector and another vector v with a factor t such that the result is thisVec \* (1 - t) + v \* t. El factor t debe estar comprendido entre 0 y 1.

```ts
existingVec2.mix(v: Vec2Source, t: number) // -> vec2
```

### normalize

Devuelve un nuevo vector con la misma dirección que este vector, pero con una longitud de 1.

```ts
existingVec2.normalize() // -> vec2
```

### plus

Suma dos vectores.

```ts
existingVec2.plus(v: Vec2Source) // -> vec2
```

### escala

Multiplica el vector por un escalar.

```ts
existingVec2.scale(s: number) // -> vec2
```

### times

Multiplicación vectorial por elementos.

```ts
existingVec2.times(v: Vec2Source) // -> vec2
```

## Mutable

The following methods perform computations based on the current value of a Vec2, and modify its contents in place. Son paralelos a los métodos de la API mutable anterior. Methods that return Vec2 types return a reference to the current object for convenient method chaining. Mutable APIs can be more performant than Immutable APIs, but are typically less safe, less readable, and more error-prone.

### setDivide

División vectorial por elementos. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.setDivide(v: Vec2Source) // -> vec2
```

### setMinus

Resta un vector de este vector. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.setMinus(v: Vec2Source) // -> vec2
```

### setMix

Compute a linear interpolation between this vector and another vector v with a factor t such that the result is thisVec \* (1 - t) + v \* t. El factor t debe estar comprendido entre 0 y 1. Store the result in this Vec2 and return this Vec2 for chaining.

```ts
existingVec2.setMinus(v: Vec2Source, t: number) // -> vec2
```

### setNormalize

Establece que el vector sea una versión de sí mismo con la misma dirección, pero con longitud 1. Store the result in this Vec2 and return this Vec2 for chaining.

```ts
existingVec2.setNormalize() // -> vec2
```

### setPlus

Suma dos vectores. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.setPlus(v: Vec2Source) // -> vec2
```

### setScale

Multiplica el vector por un escalar. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.setPlus(s: number) // -> vec2
```

### setTimes

Multiplicación vectorial por elementos. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.setTimes(v: Vec2Source) // -> vec2
```

### setX

Establece el componente x del Vec2. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.setX(v: number) // -> vec2
```

### setY

Establece el componente y del Vec2. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.setY(v: number) // -> vec2
```

### Set

The following methods set the value of the current Vec2 object without regard to its current content, replacing whatever was there before.

### makeOne

Establece el Vec2 para ser todos unos. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.makeOne() // -> vec2
```

### makeScale

Ajuste el Vec2 para que todos los componentes tengan el valor de escala s. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.makeScale(s: number) // -> vec2
```

### makeZero

Configura el Vec2 para que sea todo ceros. Store the result in this Vec2 and return this Vec2 for chaining.

```ts
existingVec2.makeZero() // -> vec2
```

### setFrom

Establece este Vec2 para que tenga el mismo valor que otro Vec2 u otro objeto con propiedades x e y. Store the result in this Vec2 and return this Vec2 for chaining.

```ts
existingVec2.setFrom(source: Vec2Source) // -> vec2
```

### setXy

Establece los componentes x e y del Vec2. Store the result in this Vec2 and return this Vec2 for chaining.

```ts
existingVec2.setFrom(x: number, y: number) // -> vec2
```
