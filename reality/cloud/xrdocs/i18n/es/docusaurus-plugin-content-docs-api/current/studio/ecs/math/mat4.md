---
id: mat4
---

# mat4

La interfaz Mat4 representa una matriz 4x4, almacenada como una matriz de 16 elementos en orden columna-mayor. Este tipo de matriz se utiliza habitualmente en geometría 3D para representar transformaciones, incluyendo posición, rotación y escala (también conocida como matriz TRS). Estas matrices son esenciales para definir la posición, orientación y tamaño de los objetos en una escena 3D.

Ciertas matrices, como las matrices TRS, tienen inversas eficientemente computables. En estos casos, Mat4 permite calcular la inversa en tiempo constante, convirtiéndola en una operación O(1). Los objetos Mat4 se crean utilizando la fábrica ecs.math.mat4 (Mat4Factory) o mediante operaciones sobre instancias Mat4 existentes.

## Fábrica

### i

Matriz de identidad

```ts
ecs.math.mat4.i() // -> mat4
```

### de

Crea una matriz con los datos especificados directamente, utilizando el orden columna-mayor. Opcionalmente, se puede proporcionar el inverso. Si no se proporciona, la inversa se calculará automáticamente si la matriz es invertible. Si se intenta calcular la inversa de una matriz no invertible, se producirá un error.

```ts
ecs.math.mat4.of(datos: número[], ¿datosinversos?: número[]) // -> mat4
```

### r

Crea una matriz de rotación a partir de un cuaternión.

```ts
ecs.math.mat4.r(q: QuatSource) // -> mat4
```

### filas

Crea una matriz utilizando los datos de fila especificados. También puede proporcionar opcionalmente los datos de la fila inversa. Tanto dataRows como inverseDataRows deben ser matrices que contengan cuatro números cada una. Si no se proporciona la inversa, se calculará automáticamente si la matriz es invertible.

:::danger
Si se intenta calcular la inversa de una matriz no invertible, se producirá un error.
:::

```ts
ecs.math.mat4.rows(dataRows: número[][], inverseDataRows?: número[][]) // -> mat4
```

### s

Crea una matriz de escala. Especifique los factores de escala a lo largo de los ejes x, y, y z.

```ts
ecs.math.mat4.s(x: número, y: número, z: número) // -> mat4
```

### t

Crea una matriz de traducción. Especifica los desplazamientos a lo largo de los ejes x, y, y z.

```ts
ecs.math.mat4.t(x: número, y: número, z: número) // -> mat4
```

### tr

Crea una matriz combinada de traslación y rotación utilizando un vector de traslación y un cuaternión para la rotación.

```ts
ecs.math.mat4.tr(t: Vec3Source, r: QuatSource) // -> mat4
```

### trs

Crea una matriz combinada de traslación, rotación y escala. Utiliza un vector de traslación, un cuaternión para la rotación y factores de escala para los ejes x, y y z.

```ts
ecs.math.mat4.trs(t: Vec3Source, r: QuatSource, s: Vec3Source) // -> mat4
```

## Inmutable

Los siguientes métodos realizan cálculos utilizando el valor actual de una Mat4 sin alterar su contenido. Los métodos que devuelven tipos Mat4 generan nuevas instancias. Aunque las APIs inmutables son generalmente más seguras, más legibles y reducen los errores en comparación con las APIs mutables, pueden ser menos eficientes en escenarios en los que se crean miles de objetos en cada frame.

:::note
Si la recolección de basura se convierte en un problema de rendimiento, considere el uso de la API Mutable.
:::

### clonar

Crea una nueva matriz con los mismos componentes que esta matriz.

```ts
ecs.math.mat4.clone() // -> mat4
```

### datos

Obtiene los datos brutos de la matriz, en orden columna-mayor.

```ts
ecs.math.mat4.data() // -> número[]
```

### descomponerTrs

Descomponga la matriz en sus componentes de traslación, rotación y escala, suponiendo que se formó por una traslación, rotación y escala en ese orden. Si se proporciona 'target', el resultado se almacenará en 'target' y se devolverá 'target'. En caso contrario, se creará y devolverá un nuevo objeto {t, r, s} .

```ts
ecs.math.mat4.decomposeTrs(target?: {t: Vec3, r: Quat, s: Vec3}) // -> {t: Vec3, r: Quat, s: Vec3}
```

### determinante

Calcula el determinante de la matriz.

```ts
ecs.math.mat4.determinant() // -> número
```

### es igual a

Comprueba si dos matrices son iguales, con una tolerancia en coma flotante especificada.

```ts
ecs.math.mat4.equals(m: Mat4, tolerancia: número) // -> booleano
```

### inv

Invierte la matriz o tira si la matriz no es invertible. Como Mat4 almacena la inversa precalculada, esta operación es O(1).

```ts
ecs.math.mat4.inv() // -> mat4
```

### inverseData

Obtiene los datos brutos de la matriz inversa, en orden columna-mayor, o null si la matriz no es invertible.

```ts
ecs.math.mat4.inverseData() // -> número[] | null
```

### ver

Obtiene una matriz con la misma posición y escala que esta matriz, pero con la rotación ajustada para que mire al objetivo.

```ts
ecs.math.mat4.lookAt(target: Vec3Source, up: Vec3Source) // -> mat4
```

### escala

Multiplica la matriz por un escalar.

:::danger
Escalar por 0 produce un error.
:::

```ts
ecs.math.mat4.scale(s: número) // -> mat4
```

### transponer

Obtiene la transposición de la matriz.

```ts
ecs.math.mat4.transpose() // -> mat4
```

### veces

Multiplica la matriz por otra matriz.

```ts
ecs.math.mat4.times(m: Mat4) // -> mat4
```

### timesVec

Multiplica la matriz por un vector utilizando coordenadas homogéneas.

```ts
ecs.math.mat4.timesVec(v: Vec3Fuente, ¿objetivo?: Vec3) // -> vec3
```

## Mutable

Los siguientes métodos calculan resultados basados en el valor actual de una Mat4 y modifican su contenido directamente. Reflejan los métodos de la API Inmutable descritos anteriormente. Los métodos que devuelven tipos Mat4 proporcionan una referencia al mismo objeto, lo que permite encadenar métodos. Aunque las API mutables pueden ofrecer un mejor rendimiento que las inmutables, tienden a ser menos seguras, menos legibles y más propensas a errores.

:::note
Si es poco probable que el código se ejecute con frecuencia dentro de un único fotograma, considere la posibilidad de utilizar la API Inmutable para una mayor seguridad y claridad del código.
:::

### setInv

Invierte la matriz o tira si la matriz no es invertible. Como Mat4 almacena la inversa precalculada, esta operación es O(1). Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.setInv() // -> mat4
```

### setLookAt

Establece la rotación de la matriz para que mire al objetivo, manteniendo la traslación y la escala sin cambios. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.setLookAt(target: Vec3Source, up: Vec3Source) // -> mat4
```

### setPremultiply

Establece esta matriz el resultado de m veces esta matriz. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.setPremultiply(m: Mat4) // -> mat4
```

### setScale

Multiplica cada elemento de la matriz por un escalador. Escalar por 0 produce un error. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.setScale(s: number) // -> mat4
```

### setTimes

Establece la matriz como el resultado de esta matriz multiplicado por m. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.setTimes(target: Mat4Source) // -> mat4
```

### setTranspose

Establece la matriz a su transpuesta. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.setTranspose() // -> mat4
```

## Establecer

Los siguientes métodos establecen el valor del objeto Mat4 actual sin tener en cuenta su contenido actual, reemplazando lo que había antes.

### makeI

Establece la matriz como matriz identidad. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.makeI() // -> mat4
```

### makeR

Establece esta matriz en una matriz de rotación a partir del cuaternión especificado. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.makeR(r: QuatSource) // -> mat4
```

### makeRows

Crea una matriz con los datos de fila especificados y, opcionalmente, los datos de fila inversos especificados. dataRows y inverseDataRows deben ser cuatro matrices, cada una con cuatro números. Si no se especifica la inversa, se calculará si la matriz es invertible.

:::danger
Si la matriz no es invertible, inv() producirá un error.
:::

```ts
existingMat4.makeRows(rowData: número[][], inverseRowData?: número[][]) // -> mat4
```

### makeS

Establece esta matriz a una matriz de escala del vector especificado. Ningún elemento del vector debe ser cero. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.makeS(s: Vec3Source) // -> mat4
```

### makeT

Establece esta matriz como una matriz de traslación del vector especificado. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.makeT(s: Vec3Source) // -> mat4
```

### makeTr

Establece esta matriz como una matriz de traslación y rotación a partir del vector y el cuaternión especificados. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.makeTr(t: Vec3Source, r: QuatSource) // -> mat4
```

### makeTrs

Establece esta matriz como una matriz de traslación, rotación y escala a partir de los vectores y el cuaternión especificados. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.makeTrs(t: Vec3Source, r: QuatSource, s: Vec3Source) // -> mat4
```

### configure

Establece el valor de la matriz y la inversa a los valores proporcionados. Si no se proporciona ningún inverso, se calculará uno si es posible. Si la matriz no es invertible, inv() producirá un error. Almacena el resultado en esta Mat4 y devuelve esta Mat4 para encadenar.

```ts
existingMat4.set(data: number[], inverseData?: number[]) // -> mat4
```
