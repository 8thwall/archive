---
id: vec2
---

# vec2

Interfaz que representa un vector 2D. Un vector 2D se representa mediante coordenadas (x, y) y puede representar un punto en un plano, un vector direccional u otros tipos de datos con tres dimensiones ordenadas. Los objetos Vec2 se crean con la ecs.math.vec2 Vec2Factory, o mediante operaciones sobre otros objetos Vec2.

## Fuente

La interfaz Vec2Source representa cualquier objeto que tenga propiedades x e y y, por lo tanto, puede utilizarse como fuente de datos para crear un Vec2. Además, Vec2Source se puede utilizar como argumento de algoritmos Vec2, lo que significa que se puede utilizar cualquier objeto con propiedades {x: number, y: number} .

## Propiedades

Vec2Source tiene las siguientes propiedades enumerables:

`readonly x: number` Accede a la componente x del vector.

`readonly y: number` Accede al componente y del vector.

## Fábrica

### de

Crea un Vec2 a partir de un Vec2, u otro objeto con propiedades x, y.

```ts
ecs.math.vec2.from({x, y}: {x: number, y: number}) // -> vec2
```

### un

Crea un vec2 en el que todos los elementos son iguales a uno. Esto equivale a \`\`\`vec2.from({x: 1, y: 1})\`\`.

```ts
ecs.math.vec2.one() // -> vec2
```

### escala

Crea un vec2 con todos los elementos ajustados al valor de escala s. Esto equivale a \`\`\`vec2.from({x: s, y: s})\`\`.

```ts
ecs.math.vec2.scale(s: número) // -> vec2
```

### xy

Crea un Vec2 a partir de los valores x, y. Esto equivale a \`\`\`vec2.from({x, y})\`\`.

```ts
ecs.math.vec2.xy(x: número, y: número) // -> vec2
```

### cero

Crea un vec2 donde todos los elementos son cero. Esto equivale a \`\`\`vec2.from({x: 0, y: 0})\`\`.

```ts
ecs.math.vec2.zero() // -> vec2
```

## Inmutable

Los siguientes métodos realizan cálculos basados en el valor actual de un Vec2 pero no modifican su contenido. Los métodos que devuelven tipos Vec2 devuelven nuevos objetos. Las API inmutables suelen ser más seguras, más legibles y menos propensas a errores que las mutables, pero pueden resultar ineficaces en situaciones en las que se asignan miles de objetos en cada trama.

:::note
Si la recogida de basura afecta al rendimiento, considere la posibilidad de utilizar la API Mutable que se describe a continuación.
:::

### clonar

Crea un nuevo vector con los mismos componentes que este vector.

```ts
existingVec2.clone() // -> vec2
```

### cruz

Calcula el producto cruz de este vector y otro vector. Para vectores 2D, el producto cruzado es el tamaño de la componente z del producto cruzado 3D de los dos vectores con 0 como componente z.

```ts
existingVec2.cross(v: Vec2Source) // -> número
```

### distanceTo

Calcula la distancia euclidiana entre este vector y otro vector.

```ts
existingVec2.distanceTo(v: Vec2Source) // -> número
```

### dividir

División vectorial por elementos.

```ts
existingVec2.divide(v: Vec2Source) // -> vec2
```

### punto

Calcula el producto punto de este vector y otro vector.

```ts
existingVec2.dot(v: Vec2Source) // -> número
```

### es igual a

Comprueba si dos vectores son iguales, con una tolerancia en coma flotante especificada.

```ts
existingVec2.equals(v: Vec2Source, tolerance: number) // -> boolean
```

### longitud

Longitud del vector.

```ts
existingVec2.length() // -> número
```

### menos

Resta un vector de este vector.

```ts
existingVec2.minus(v: Vec2Source) // -> vec2
```

### mezcla

Calcula una interpolación lineal entre este vector y otro vector v con un factor t tal que el resultado es esteVec \* (1 - t) + v \* t. El factor t debe estar comprendido entre cero y 1.

```ts
existingVec2.mix(v: Vec2Source, t: number) // -> vec2
```

### normalizar

Devuelve un nuevo vector con la misma dirección que este vector, pero con una longitud de 1.

```ts
existingVec2.normalize() // -> vec2
```

### y

Suma dos vectores.

```ts
existingVec2.plus(v: Vec2Source) // -> vec2
```

### escala

Multiplica el vector por un escalar.

```ts
existingVec2.scale(s: number) // -> vec2
```

### veces

Multiplicación vectorial por elementos.

```ts
existingVec2.times(v: Vec2Source) // -> vec2
```

## Mutable

Los siguientes métodos realizan cálculos basados en el valor actual de un Vec2 y modifican su contenido en su lugar. Son paralelos a los métodos de la API mutable anterior. Los métodos que devuelven tipos Vec2 devuelven una referencia al objeto actual para facilitar el encadenamiento de métodos. Las API mutables pueden ser más eficaces que las inmutables, pero suelen ser menos seguras, menos legibles y más propensas a errores.

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

Calcula una interpolación lineal entre este vector y otro vector v con un factor t tal que el resultado es esteVec \* (1 - t) + v \* t. El factor t debe estar comprendido entre 0 y 1. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.setMix(v: Vec2Source, t: number) // -> vec2
```

### setNormalize

Establece que el vector sea una versión de sí mismo con la misma dirección pero con longitud 1. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

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
existingVec2.setScale(s: number) // -> vec2
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

### Establecer

Los siguientes métodos establecen el valor del objeto Vec2 actual sin tener en cuenta su contenido actual, reemplazando lo que había antes.

### makeOne

Establece el Vec2 para que sean todos unos. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.makeOne() // -> vec2
```

### makeScale

Ajuste el Vec2 para que todos los componentes tengan el valor de escala s. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.makeScale(s: number) // -> vec2
```

### makeZero

Configura el Vec2 para que sea todo ceros. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.makeZero() // -> vec2
```

### setFrom

Establece este Vec2 para que tenga el mismo valor que otro Vec2 u otro objeto con propiedades x e y. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.setFrom(source: Vec2Source) // -> vec2
```

### setXy

Establece los componentes x e y del Vec2. Almacena el resultado en este Vec2 y devuelve este Vec2 para encadenar.

```ts
existingVec2.setXy(x: número, y: número) // -> vec2
```
