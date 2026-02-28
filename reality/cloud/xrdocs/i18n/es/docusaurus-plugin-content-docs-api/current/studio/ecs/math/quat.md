---
id: quat
---

# quat

Interfaz que representa un cuaternión. Un cuaternión se representa mediante coordenadas (x, y, z, w) y representa una rotación 3D. Los cuaterniones pueden convertirse a y desde matrices de rotación 4x4 con las interfaces de Mat4. Los objetos Quaternion se crean con ecs.math.quat QuatFactory, o mediante operaciones sobre otros objetos Quat.

## Fuente

La interfaz QuatSource representa cualquier objeto que tenga propiedades x, y, z y w y que, por tanto, pueda utilizarse como fuente de datos para crear un Quat. Además, QuatSource se puede utilizar como argumento de los algoritmos Quat, lo que significa que se puede utilizar cualquier objeto con propiedades {x: número, y: número, z: número, w: número}.

## Propiedades

Quat tiene las siguientes propiedades enumerables:

`readonly x: number` Accede a la componente x del cuaternión.

`readonly y: number` Accede a la componente y del cuaternión.

`readonly z: number` Accede a la componente z del cuaternión.

`readonly w: number` Accede a la componente w del cuaternión.

## Fábrica

### axisAngle

Crear un Quat a partir de una representación eje-ángulo. La dirección del vector aa da el eje de rotación, y la magnitud del vector da el ángulo, en radianes. Por ejemplo, quat.axisAngle(vec3.up().scale(Math.PI / 2)) representa una rotación de 90 grados sobre el eje y y es equivalente a quat.yDegrees(90). Si se proporciona un destino, el resultado se almacenará en el destino y se devolverá el destino. En caso contrario, se creará y devolverá un nuevo Quat.

```ts
ecs.math.quat.axisAngle(aa: Vec3Source, target?: Quat) // -> quat
```

### de

Crea un Quat a partir de un objeto con propiedades x, y, z, w.

```ts
ecs.math.quat.from({x, y, z, w}: {x: número, y: número, z: número, w: número}) // -> quat
```

### ver

Crea un Quat que represente la rotación necesaria para que un objeto situado en 'ojo' mire a un objeto situado en 'objetivo', con el 'vector arriba' dado.

```ts
ecs.math.quat.lookAt(ojo: Vec3Source, objetivo: Vec3Source, arriba: Vec3Source) // -> quat
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
ecs.math.quat.xDegrees(grados: número) // -> quat
```

### xRadians

Crea un Quat que represente una rotación alrededor del eje x. La rotación se especifica en radianes.

```ts
ecs.math.quat.xRadians(radianes: número) // -> quat
```

### xyzw

Crear un Quat a partir de los valores x, y, z, w.

```ts
ecs.math.quat.xyzw(x: número, y: número, z: número, w: número) // -> quat
```

### yGrados

Crea un Quat que represente una rotación alrededor del eje y. La rotación se especifica en grados.

```ts
ecs.math.quat.yDegrees(degrees: number) // -> quat
```

### yRadianos

Crea un Quat que represente una rotación alrededor del eje y. La rotación se especifica en radianes.

```ts
ecs.math.quat.yRadians(radianes: número) // -> quat
```

### zGrados

Crea un Quat que represente una rotación alrededor del eje z. La rotación se especifica en grados.

```ts
ecs.math.quat.zGrados(grados: número) // -> quat
```

### zRadians

Crea un Quat que represente una rotación alrededor del eje z. La rotación se especifica en radianes.

```ts
ecs.math.quat.zRadians(radianes: número) // -> quat
```

### cero

Crea un Quat que represente una rotación cero.

```ts
ecs.math.quat.zero() // -> quat
```

## Inmutable

Los siguientes métodos realizan cálculos utilizando el valor actual de un Quat sin modificar su contenido. Los métodos que devuelven tipos Quat crean nuevas instancias. Aunque las API inmutables suelen ser más seguras, más legibles y reducen la probabilidad de errores, pueden resultar ineficaces cuando se asigna un gran número de objetos por fotograma.

:::note
Si la recogida de basura afecta al rendimiento, considere la posibilidad de utilizar la API Mutable que se describe a continuación.
:::

### axisAngle

Convierte el cuaternión en una representación eje-ángulo. La dirección del vector da el eje de rotación, y la magnitud del vector da el ángulo, en radianes. Si se proporciona 'target', el resultado se almacenará en 'target' y se devolverá 'target'. En caso contrario, se creará y devolverá un nuevo Vec3.

```ts
existingQuat.axisAngle(target?: Vec3) // -> vec3
```

### clonar

Crea un nuevo cuaternión con los mismos componentes que este cuaternión.

```ts
existingQuat.clone() // -> quat
```

### conjugar

Devuelve el conjugado rotacional de este cuaternión. El conjugado de un cuaternión representa la misma rotación en la dirección opuesta sobre el eje de rotación.

```ts
existingQuat.conjugate() // -> quat
```

### datos

Accede al cuaternión como una matriz de [x, y, z, w].

```ts
ecs.math.quat.data() // -> número[]
```

### degreesTo

Ángulo entre dos cuaterniones, en grados.

```ts
existingQuat.degreesTo(target: QuatSource) // -> número
```

### delta

Calcula el cuaternión necesario para rotar este cuaternión al cuaternión objetivo.

```ts
existingQuat.delta(target: QuatSource) // -> quat
```

### punto

Calcula el producto punto de este cuaternión con otro cuaternión.

```ts
existingQuat.dot(target: QuatSource) // -> número
```

### es igual a

Comprueba si dos cuaterniones son iguales, con una tolerancia en coma flotante especificada.

```ts
existingQuat.equals(q: QuatSource, tolerance: number) // -> boolean
```

### inv

Calcula el cuaternión que multiplica este cuaternión para obtener un cuaternión de rotación cero.

```ts
existingQuat.inv() // -> quat
```

### negar

Niega todos los componentes de este cuaternión. El resultado es un cuaternión que representa la misma rotación que este cuaternión.

```ts
existenteQuat.negate() // -> quat
```

### normalizar

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

### y

Suma dos cuaterniones.

```ts
ecs.math.quat.plus(q: QuatSource) // -> quat
```

### radiansTo

Ángulo entre dos cuaterniones, en radianes.

```ts
existingQuat.radiansTo(target: QuatSource) // -> número
```

### slerp

Interpolación esférica entre dos cuaterniones dado un valor de interpolación proporcionado. Si la interpolación se establece en 0, entonces devolverá este cuaternión. Si la interpolación se establece en 1, entonces devolverá el cuaternión objetivo.

```ts
ecs.math.quat.slerp(target: QuatSource, t: number) // -> quat
```

### veces

Multiplica dos cuaterniones entre sí.

```ts
existingQuat.times(q: QuatSource) // -> quat
```

### timesVec

Multiplica el cuaternión por un vector. Esto equivale a convertir el cuaternión en una matriz de rotación y multiplicar la matriz por el vector.

```ts
ecs.math.quat.times(v: Vec3Fuente, ¿objetivo?: Vec3) // -> vec3
```

## Mutable

Los siguientes métodos realizan cálculos utilizando el valor actual de un Quat y lo modifican directamente. Estos métodos se corresponden con los de la API Inmutable anterior. Cuando devuelven tipos Quat, proporcionan una referencia al mismo objeto, lo que permite encadenar métodos. Aunque las API mutables pueden ofrecer un mejor rendimiento que las inmutables, tienden a ser menos seguras, menos legibles y más propensas a errores. Si es poco probable que el código se llame con frecuencia dentro de un mismo fotograma, considere la posibilidad de utilizar la API Inmutable para mejorar la seguridad y la claridad.

### setConjugate

Establece este cuaternión en su conjugado rotacional. El conjugado de un cuaternión representa la misma rotación en la dirección opuesta sobre el eje de rotación. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

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

Niega todos los componentes de este cuaternión. El resultado es un cuaternión que representa la misma rotación que este cuaternión. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setNegate() // -> quat
```

### setNormalize

Obtiene la versión normalizada de este cuaternión con una longitud de 1. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setNormalize() // -> quat
```

### setPlus

Añade este cuaternión a otro cuaternión. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setPlus(q: QuatSource) // -> quat
```

### setPremultiply

Establece este cuaternión como el resultado de q veces este cuaternión. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setPremultiply(q: QuatSource) // -> quat
```

### setRotateToward

Gira este cuaternión hacia el cuaternión objetivo un número determinado de radianes, fijado al objetivo. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setRotateToward(target: QuatSource, radians: number) // -> quat
```

### setSlerp

Interpolación esférica entre dos cuaterniones dado un valor de interpolación proporcionado. Si la interpolación se establece en 0, entonces devolverá este cuaternión. Si la interpolación se establece en 1, entonces devolverá el cuaternión objetivo. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setSlerp(target: QuatSource, t: number) // -> quat
```

### setTimes

Multiplica dos cuaterniones entre sí. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setTimes(target: QuatSource) // -> quat
```

## Establecer

Los siguientes métodos establecen el valor del objeto Quat actual sin tener en cuenta su contenido actual, reemplazando lo que había antes.

### makeAxisAngle

Establecer un Quat a partir de una representación eje-ángulo. La dirección del vector da el eje de rotación, y la magnitud del vector da el ángulo, en radianes. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makeAxisAngle(aa: Vec3Source) // -> quat
```

### makePitchYawRollRadians

Establece el cuaternión a una rotación especificada por los ángulos de cabeceo, guiñada y balanceo en radianes. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makePitchYawRollRadians(v: Vec3Source) // -> quat
```

### makeLookAt

Ajusta el cuaternión a una rotación que haga que el ojo mire al objetivo con el vector dado. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makeLookAt(eye: Vec3Source, target: Vec3Source, up: Vec3Source) // -> quat
```

### makePitchYawRollDegrees

Establece el cuaternión a una rotación especificada por los ángulos de cabeceo, guiñada y balanceo en grados. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makePitchYawRollDegrees(v: Vec3Source) // -> quat
```

### makeXDegrees

Establece el cuaternión a una rotación sobre el eje x (cabeceo) en grados. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makeXDegrees(grados: número) // -> quat
```

### makeXRadians

Establece el cuaternión a una rotación sobre el eje x (cabeceo) en radianes. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makeXRadians(radianes: número) // -> quat
```

### makeYDegrees

Establece el cuaternión a una rotación sobre el eje y (guiñada) en grados. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makeYDegrees(grados: número) // -> quat
```

### makeYRadians

Establece el cuaternión a una rotación sobre el eje y (guiñada) en radianes. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makeYRadians(radianes: número) // -> quat
```

### makeZDegrees

Establece el cuaternión a una rotación sobre el eje z (balanceo) en grados. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makeZDegrees(grados: número) // -> quat
```

### makeZRadians

Establece el cuaternión a una rotación sobre el eje z (balanceo) en radianes. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makeZRadians(radianes: número) // -> quat
```

### makeZero

Establece el cuaternión en una rotación cero. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.makeZero() // -> quat
```

### setFrom

Establece este cuaternión en el valor de otro cuaternión. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setFrom(q: QuatSource) // -> quat
```

### setXyzw

Establece el cuaternión en los valores x, y, z y w especificados. Almacena el resultado en este Quat y devuelve este Quat para encadenarlo.

```ts
existingQuat.setXyzw(x: número, y: número, z: número, w: número) // -> quat
```
