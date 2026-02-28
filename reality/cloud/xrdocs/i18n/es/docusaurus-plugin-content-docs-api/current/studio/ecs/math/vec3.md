---
id: vec3
---

# vec3

Interfaz que representa un vector 3D. Un vector 3D se representa mediante coordenadas (x, y, z) y puede representar un punto en el espacio, un vector direccional u otros tipos de datos con tres dimensiones ordenadas. Los vectores 3D pueden multiplicarse por matrices 4x4 (Mat4) utilizando matemáticas de coordenadas homogéneas, lo que permite un cálculo geométrico 3D eficiente. Los objetos Vec3 se crean con ecs.math.vec3 Vec3Factory, o mediante operaciones sobre otros objetos Vec3.

## Fuente

La interfaz Vec3Source representa cualquier objeto que tenga propiedades x, y y z y, por lo tanto, se puede utilizar como fuente de datos para crear un Vec3. Además, Vec3Source se puede utilizar como argumento de algoritmos Vec3, lo que significa que se puede utilizar cualquier objeto con propiedades {x: number, y: number, z: number} .

## Propiedades

Vec3 tiene las siguientes propiedades enumerables:

`readonly x: number` Accede a la componente x del vector.

`readonly y: number` Accede al componente y del vector.

`readonly z: number` Accede a la componente z del vector.

## Fábrica

### de

Crea un Vec3 a partir de un Vec3, u otro objeto con propiedades x, y.

```ts
ecs.math.vec3.from({x, y, z}: {x: number, y: number, z: number}) // -> vec3
```

### un

Crea un vec3 donde todos los elementos sean uno. Esto equivale a \`\`\`vec3.from({x: 1, y: 1, z: 1})\`\`.

```ts
ecs.math.vec3.one() // -> vec3
```

### escala

Crea un vec3 con todos los elementos ajustados al valor de escala s. Esto equivale a \`\`\`vec3.from({x: s, y: s, z: s})\`\`.

```ts
ecs.math.vec3.scale(s: número) // -> vec3
```

### xyz

Crea un Vec3 a partir de los valores x, y, z. Esto equivale a \`\`\`vec3.from({x, y, z})\`\`.

```ts
ecs.math.vec3.xyz(x: número, y: número, z: número) // -> vec3
```

### cero

Crea un vec3 en el que todos los elementos sean cero. Esto equivale a \`\`\`vec3.from({x: 0, y: 0, z: 0})\`\`.

```ts
ecs.math.vec3.zero() // -> vec3
```

## Inmutable

Los siguientes métodos realizan cálculos basados en el valor actual de un Vec3 pero no modifican su contenido. Los métodos que devuelven tipos Vec3 devuelven nuevos objetos. Las API inmutables suelen ser más seguras, más legibles y menos propensas a errores que las mutables, pero pueden resultar ineficaces en situaciones en las que se asignan miles de objetos en cada trama.

:::note
Si la recogida de basura afecta al rendimiento, considere la posibilidad de utilizar la API Mutable que se describe a continuación.
:::

### clonar

Crea un nuevo vector con los mismos componentes que este vector.

```ts
existingVec3.clone() // -> vec3
```

### cruz

Calcula el producto cruz de este vector y otro vector.

```ts
existingVec3.cross(v: Vec3Source) // -> vec3
```

### datos

Accede al vector como una matriz homogénea (cuatro dimensiones).

```ts
existingVec3.data() // -> número[]
```

### distanceTo

Calcula la distancia euclidiana entre este vector y otro vector.

```ts
existingVec3.distanceTo(v: Vec3Source) // -> número
```

### dividir

División vectorial por elementos.

```ts
existingVec3.divide(v: Vec3Source) // -> vec3
```

### punto

Calcula el producto punto de este vector y otro vector.

```ts
existingVec3.dot(v: Vec3Source) // -> número
```

### es igual a

Comprueba si dos vectores son iguales, con una tolerancia en coma flotante especificada.

```ts
existingVec3.equals(v: Vec3Source, tolerance: number) // -> boolean
```

### longitud

Longitud del vector.

```ts
existingVec3.length() // -> número
```

### menos

Resta un vector de este vector.

```ts
existingVec3.minus(v: Vec3Source) // -> vec3
```

### mezcla

Calcula una interpolación lineal entre este vector y otro vector v con un factor t tal que el resultado es esteVec \* (1 - t) + v \* t. El factor t debe estar comprendido entre cero y 1.

```ts
existingVec3.mix(v: Vec3Source, t: number) // -> vec3
```

### normalizar

Devuelve un nuevo vector con la misma dirección que este vector, pero con una longitud de 1.

```ts
existingVec3.normalize() // -> vec3
```

### y

Suma dos vectores.

```ts
existingVec3.plus(v: Vec3Source) // -> vec3
```

### escala

Multiplica el vector por un escalar.

```ts
existingVec3.scale(s: number) // -> vec3
```

### veces

Multiplicación vectorial por elementos.

```ts
existingVec3.times(v: Vec3Source) // -> vec3
```

## Mutable

Los siguientes métodos realizan cálculos basados en el valor actual de un Vec3 y modifican su contenido en su lugar. Son paralelos a los métodos de la API mutable anterior. Los métodos que devuelven tipos Vec3 devuelven una referencia al objeto actual para facilitar el encadenamiento de métodos. Las API mutables pueden ser más eficaces que las inmutables, pero suelen ser menos seguras, menos legibles y más propensas a errores.

### SetCross

Calcula el producto cruz de este vector y otro vector. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setCross(v: Vec3Source) // -> vec3
```

### setDivide

División vectorial por elementos. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setDivide(v: Vec3Source) // -> vec3
```

### setMinus

Resta un vector de este vector. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setMinus(v: Vec3Source) // -> vec3
```

### setMix

Calcula una interpolación lineal entre este vector y otro vector v con un factor t tal que el resultado es esteVec \* (1 - t) + v \* t. El factor t debe estar comprendido entre 0 y 1. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setMix(v: Vec3Source, t: number) // -> vec3
```

### setNormalize

Establece que el vector sea una versión de sí mismo con la misma dirección pero con longitud 1. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setNormalize() // -> vec3
```

### setPlus

Suma dos vectores. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.setPlus(v: Vec3Source) // -> vec3
```

### setScale

Multiplica el vector por un escalar. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setScale(s: number) // -> vec3
```

### setTimes

Multiplicación vectorial por elementos. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setTimes(v: Vec3Source) // -> vec3
```

### setX

Establece el componente x del Vec3. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setX(v: number) // -> vec3
```

### setY

Establece el componente y del Vec3. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setY(v: number) // -> vec3
```

### setZ

Establece el componente z del Vec3. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setZ(v: number) // -> vec3
```

### Establecer

Los siguientes métodos establecen el valor del objeto Vec3 actual sin tener en cuenta su contenido actual, reemplazando lo que había antes.

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

Establece este Vec3 para que tenga el mismo valor que otro Vec3 u otro objeto con propiedades x e y, y z. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenarlo.

```ts
existingVec3.setFrom(source: Vec3Source) // -> vec3
```

### setXyz

Establece los componentes x, y, y z del Vec3. Almacena el resultado en este Vec3 y devuelve este Vec3 para encadenar.

```ts
existingVec3.setXyz(x: número, y: número, z: número) // -> vec3
```
