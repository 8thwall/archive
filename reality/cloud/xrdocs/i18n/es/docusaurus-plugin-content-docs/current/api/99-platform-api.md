# Plataforma API: Objetivos de imagen

**La API de gestión de objetivos de imagen de 8th Wall permite a los desarrolladores gestionar dinámicamente la biblioteca de objetivos de imagen ** asociada a sus proyectos WebAR impulsados por 8th Wall. Esta API y la documentación que la acompaña están diseñadas para desarrolladores familiarizados con el desarrollo web y objetivos de imagen de 8th Wall.

**Before you begin:** Before you start using the Image Target API, your workspace needs to be on an **Pro** or **Enterprise** billing plan. Para actualizar, [póngase en contacto con ventas](https://www.8thwall.com/licensing).

## Autenticación {#authentication}

La autenticación se realiza mediante claves secretas. Workspaces on an Pro or Enterprise plan can request an API Key. Incluya esta clave secreta en cada solicitud para verificar que la solicitud está autorizada. Como la clave está asignada a su área de trabajo , tendrá acceso a todos los objetivos de imagen de todas las aplicaciones de esa área de trabajo .

Puedes ver tu clave en la página de su cuenta.

![Visualización que muestra los objetivos de imagen dentro de las apps, las apps dentro del área de trabajo y la Clave API dentro del área de trabajo](/images/authentication-structure.png)

#### Importante: {#important}

La clave API de Image Target es una clave B2B asociada a su área de trabajo. Siga las mejores prácticas para asegurar su Clave API, ya que exponer públicamente tu clave API puede dar lugar a un uso no intencionado y a un acceso no autorizado. En particular, evite:

- Incrustar la clave API de objetivo de imagen en el código que se ejecuta en el dispositivo de un usuario o que se comparte públicamente
- Almacenar la clave API del objetivo de imagen dentro del árbol de fuentes de tu aplicación

## Límites y cuotas {#limits-and-quotas}

- 25 peticiones por minuto, con una ráfaga permitida de 500, lo que significa que puedes hacer 500 peticiones en un minuto , después puedes hacer 25 peticiones por minuto, o puedes esperar 20 minutos y hacer otras 500 peticiones.
- 10.0000 solicitudes al día.

**Nota**: Estos límites solo se aplican a la API de gestión de objetivos de imagen, que permite a los desarrolladores gestionar dinámicamente la biblioteca de imágenes asociadas a un proyecto 8th Wall. **Estos límites no son aplicables a las activaciones de usuario final de una experiencia WebAR.**

Para solicitar un aumento de los límites de cuota de la API de objetivo de imagen para los proyectos de su área de trabajo , envía una solicitud a [support](mailto:support@8thwall.com).

## Puntos finales {#endpoints}

- [Crear nuevo objetivo de imagen](#create-image-target)
- [Listar objetivos de imagen](#list-image-targets)
- [Obtener objetivo de imagen](#get-image-target)
- [Modificar el objetivo de imagen](#modify-image-target)
- [Eliminar objetivo de imagen](#delete-image-target)
- [Vista previa del objetivo de imagen](#preview-image-target)

### Crear nuevo objetivo de imagen {#create-image-target}

Subir un nuevo objetivo a la lista de objetivos de imagen de una app

#### Solicitud {#post-request}

```bash
curl -X POST "https://api.8thwall.com/v1/apps/$APP_KEY/targets" \
    -H "X-Api-Key:$SECRET_KEY" \
    -F "name=my-target-name" \
    -F "image=@image.png"\
    -F "geometry.top=0"\
    -F "geometry.left=0"\
    -F "geometry.width=480"\
    -F "geometry.height=640"\
    -F "metadata={\"customFlag\":true}"
    -F "loadAutomatically=true"
```

| Campo                         | Tipo           | Valor por defecto | Descripción                                                                                                                          |
|:----------------------------- |:-------------- |:----------------- |:------------------------------------------------------------------------------------------------------------------------------------ |
| image                         | Datos binarios |                   | Formato PNG o JPEG, debe ser de al menos 480x640, menos de 2048x2048 y menos de 10MB                                                 |
| name                          | `Cadena`       |                   | Debe ser único dentro de una app, no puede incluir tildes (~) y no puede superar los 255 caracteres                                  |
| type [Optional]               | `Cadena`       | `'PLANAR'`        | `'PLANAR'`, `'CILÍNDRICO'`, o `'CÓNICO'`.                                                                                            |
| metadata (opcional)           | `Cadena`       | `nulo`            | Debe ser JSON válido si `metadataIsJson` es verdadero, y no puede superar los 2048 caracteres                                        |
| metadataIsJson [Opcional]     | `Booleano`     | `true`            | Pueds establecerlo a false para utilizar la propiedad de metadatos como una cadena sin procesar                                      |
| loadAutomatically [Opcional]  | `Booleano`     | `false`           | Cada app está limitada a 5 objetivos de imagen con `loadAutomatically: true`                                                         |
| geometry.isRotated [Opcional] | `Booleano`     | `false`           | Establézcalo como verdadero si la imagen se prerrota de horizontal a vertical.                                                       |
| geometry.top                  | integer        |                   | Estas propiedades especifican el recorte que se aplicará a su imagen. Debe tener una relación de aspecto de 3:4, y al menos 480x640. |
| geometry.left                 | integer        |                   |                                                                                                                                      |
| geometry.width                | integer        |                   |                                                                                                                                      |
| geometry.height               | integer        |                   |                                                                                                                                      |
| geometry.topRadius            | integer        |                   | Solo se necesita para `tipo: 'CONICAL'`                                                                                              |
| geometry.bottomRadius         | integer        |                   | Solo se necesita para `tipo: 'CONICAL'`                                                                                              |

#### Geometría de carga plana / cilíndrica {#planar--cylinder-upload-geometry}

Este diagrama muestra cómo se aplica el recorte especificado a la imagen que has subido para generar las imágenes `imageUrl` y `thumbnailImageUrl`. La relación anchura:altura es siempre 3:4.

![Diagrama que muestra cómo se aplican el recorte, la rotación y la escala a los objetivos de imágenes planas y cilíndricas](/images/flat-geometry.jpg)

Para un recorte apaisado, sube la imagen girada 90 grados en el sentido de las agujas del reloj, establece `geometry.isRotated: true`, y especifica el recorte contra la imagen girada.

![Diagrama que muestra cómo se aplican el recorte, la rotación y la escala a los objetivos de imagen planos y cilíndricos cuando isRotated es verdadero](/images/rotated-geometry.jpg)

#### Geometría de carga cónica {#conical-upload-geometry}

Este diagrama muestra cómo se aplana y recorta tu imagen subida en función de los parámetros. La imagen subida a tiene un formato "arco iris" en el que los bordes superior e inferior de tu contenido están alineados a dos círculos concéntricos. Si su objetivo es más estrecho por arriba que por abajo, especifica `topRadius` como el negativo del radio exterior, y `bottomRadius` como el radio interior (positivo). Para un recorte apaisado , establece `geometry.isRotated: true`, y la imagen aplanada se rotará antes de aplicarle el recorte .

![Diagrama que muestra cómo se aplican el recorte, la rotación y la escala a los objetivos de imagen cónicos](/images/cone-geometry.jpg)

#### Respuesta {#post-response}

<span id="image-target-format">Este es el formato de respuesta JSON estándar para los objetivos de imagen.</span>

```json
{
  "name": "...",
  "uuid": "...",
  "type": "PLANAR",
  "loadAutomatically": true,
  "status": "AVAILABLE",
  "appKey": "...",
  "geometry": {
    "top": 842,
    "left": 392,
    "width": 851,
    "height": 1135,
    "isRotated": true,
    "originalWidth": 2000,
    "originalHeight": 2000
  },
  "metadata": null,
  "metadataIsJson": true,
  "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
  "imageUrl": "https://cdn.8thwall.com/image-target/...",
  "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
  "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
  "created": 1613508074845,
  "updated": 1613683291310
}
```

| Propiedad          | Tipo       | Descripción                                                                                                          |
|:------------------ |:---------- |:-------------------------------------------------------------------------------------------------------------------- |
| name               | `Cadena`   |                                                                                                                      |
| uuid               | `Cadena`   | ID único de este objetivo de imagen                                                                                  |
| tipo               | `Cadena`   | `'PLANAR'`, `'CILÍNDRICO'`, o `'CÓNICO'`                                                                             |
| loadAutomatically  | `Booleano` |                                                                                                                      |
| status             | `Cadena`   | `'AVAILABLE'` o `'TAKEN_DOWN'`                                                                                       |
| appKey             | `Cadena`   | La app a la que pertenece el objetivo                                                                                |
| geometría          | `Objeto`   | Ver más abajo                                                                                                        |
| metadata           | `Cadena`   |                                                                                                                      |
| metadataIsJson     | `Booleano` |                                                                                                                      |
| originalImageUrl   | `Cadena`   | URL CDN de la imagen de origen que se subió                                                                          |
| imageUrl           | `Cadena`   | Versión recortada de `geometryTextureUrl`                                                                            |
| thumbnailImageUrl  | `Cadena`   | versión de 350px de alto de la `imageUrl` para su uso en miniaturas                                                  |
| geometryTextureUrl | `Cadena`   | Para cónica, es una versión aplanada de la imagen original; para plana y cilíndrica, es igual que `originalImageUrl` |
| created            | integer    | Fecha de creación en milisegundos después de la época unix                                                           |
| updated            | integer    | Fecha de la última actualización en milisegundos después de la época unix                                            |

#### Geometría plana {#planar-geometry}

| Propiedad      | Tipo     | Descripción                 |
|:-------------- |:-------- |:--------------------------- |
| top            | integer  |                             |
| left           | integer  |                             |
| width          | integer  |                             |
| height         | integer  |                             |
| isRotated      | Booleano |                             |
| originalWidth  | integer  | Anchura de la imagen subida |
| originalHeight | integer  | Altura de la imagen subida  |

#### Geometría cilíndrica o cónica {#cylinder-or-conical-geometry}

Amplía las propiedades de Geometría plana con la alteración de que `originalWidth` y `originalHeight` se refieren a las dimensiones de la imagen aplanada almacenada en geometryTextureUrl.

| Propiedad                   | Tipo     | Descripción                                                                                                                                               |
|:--------------------------- |:-------- |:--------------------------------------------------------------------------------------------------------------------------------------------------------- |
| topRadius                   | float    |                                                                                                                                                           |
| bottomRadius                | float    |                                                                                                                                                           |
| coniness                    | float    | Siempre 0 para `tipo: CILINDRO`, derivado de `radio superior`/`radio inferior` para `tipo: CÓNICO`                                                        |
| cylinderCircumferenceTop    | float    | La circunferencia del círculo completo trazado por el borde superior de tu objetivo                                                                       |
| targetCircumferenceTop      | float    | La longitud a lo largo del borde superior de tu objetivo antes de aplicar el recorte                                                                      |
| cylinderCircumferenceBottom | float    | Derivado de `cylinderCircumferenceTop` y `topRadius`/`bottomRadius`                                                                                       |
| cylinderSideLength          | float    | Derivado de `targetCircumferenceTop` y las dimensiones de la imagen original                                                                              |
| arcAngle                    | float    | Derivado de `cylinderCircumferenceTop` y `targetCircumferenceTop`                                                                                         |
| inputMode                   | `Cadena` | `'BASIC'` o `'ADVANCED'`. Controla lo que ven los usuarios en la consola de 8th Wall, ya sean controles deslizantes o cuadros de introducción de números. |

### Listar objetivos de imagen {#list-image-targets}

Consulte una lista de objetivos de imagen que pertenezcan a una app. Los resultados están paginados, lo que significa que si la app contiene más objetivos de imagen de los que se pueden devolver en una respuesta, tendrá que hacer varias peticiones para enumerar la lista completa de objetivos de imagen.

#### Solicitud {#list-request}

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets" -H "X-Api-Key:$SECRET_KEY"
```

| Parámetro               | Tipo     | Descripción                                                                                            |
|:----------------------- |:-------- |:------------------------------------------------------------------------------------------------------ |
| by [Opcional]           | `Cadena` | Especifica la columna por la que ordenar. Las opciones son "creado", "actualizado", "nombre" o "uuid". |
| dir [Opcional]          | `Cadena` | Controla la dirección de ordenación de la lista. O "asc" o "desc".                                     |
| start [Opcional]        | `Cadena` | Especifica que la lista comienza con los elementos que tienen este valor en la columna `by`            |
| after [Opcional]        | `Cadena` | Especifica que la lista comienza inmediatamente después de los elementos que tienen este valor         |
| limit [Opcional]        | integer  | Debe estar entre 1 y 500                                                                               |
| continuation [Opcional] | `Cadena` | Se utiliza para buscar la página siguiente a la consulta inicial.                                      |

#### Lista ordenada {#sorted-list}

Esta consulta enumera los objetivos de la app empezando por "z" y yendo hacia "a".

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=name&dir=desc" -H "X-Api-Key:$SECRET_KEY"
```

#### Múltiples clasificaciones {#multiple-sorts}

Puedes especificar un parámetro secundario "ordenar por" que actúe como criterio de desempate en caso de duplicados en tu primer valor `por`.  `uuid` se utiliza como criterio de desempate por defecto si no se especifica.

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid" -H "X-Api-Key:$SECRET_KEY"
```

#### Especifica un punto de partida {#specify-a-starting-point}

Puede especificar `inicio` o `después de los valores` que corresponden a los valores `por` para especificar tu posición actual en la lista. Si quiere que su lista comience inmediatamente después del elemento con `actualizado: 333` y `uuid: 777`, utilizaría:

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid&start=333&after=777" -H "X-Api-Key:$SECRET_KEY"
```

De esta forma, los elementos con `updated: 333` se siguen incluyendo en la página siguiente si su `uuid` es posterior a `777`. Si el valor `actualizado` de un elemento es mayor que `333`, pero su `uuid` es menor que `777`, se seguirá incluyendo en la página siguiente porque la segunda propiedad `por` sólo entra en juego para los desempates.

No es válido especificar un valor `después de` para la ordenación principal mientras se proporciona un valor `inicio` para la ordenación de desempate. Por ejemplo, no sería válido especificar `?by=name&by=uuid&after=my-name-&start=333`. En su lugar debería ser`?by=nombre&by=uuid&after=mi-nombre-` porque el segundo punto de inicio sólo entra en juego cuando el punto de inicio principal es inclusivo (utilizando `inicio`).

![Diagrama que muestra cómo los parámetros by, start y after especifican el punto inicial de la lista](/images/image-target-sort.png)

#### Respuesta {#list-response}

Objeto JSON que contiene la propiedad `targets`, que es una matriz de objetos objetivo de imagen en el formato estándar [](#image-target-format).

Si `continuationToken` está presente, para obtener la siguiente página de objetivos de imagen, tendrá que especificar `?continuation=[continuationToken]` en una petición de seguimiento para obtener la siguiente página de objetivos de imagen.

```json
{
  "continuationToken": "...",
  "targets": [{
    "name": "...",
    "uuid": "...",
    "type": "PLANAR",
    "loadAutomatically": true,
    "status": "AVAILABLE",
    "appKey": "...",
    "geometry": {
      "top": 842,
      "left": 392,
      "width": 851,
      "height": 1135,
      "isRotated": true,
      "originalWidth": 2000,
      "originalHeight": 2000
    },
    "metadata": null,
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/image-target/...",
    "imageUrl": "https://cdn.8thwall.com/image-target/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/image-target/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/image-target/...",
    "created": 1613508074845,
    "updated": 1613683291310
  }, {
    "name": "...",
    "uuid": "...",
    "type": "CONICAL",
    "loadAutomatically": true,
    "status": "AVAILABLE",
    "appKey": "...",
    "geometry": {
      "top": 0,
      "left": 0,
      "width": 480,
      "height": 640,
      "originalWidth": 886,
      "originalHeight": 2048,
      "isRotated": true,
      "cylinderCircumferenceTop": 100,
      "cylinderCircumferenceBottom": 40,
      "targetCircumferenceTop": 50,
      "cylinderSideLength": 21.63,
      "topRadius": 1600,
      "bottomRadius": 640,
      "arcAngle": 180,
      "coniness": 1.3219280948873624,
      "inputMode": "BASIC"
    },
    "metadata": "{\"my-metadata\": 34534}",
    "metadataIsJson": true,
    "originalImageUrl": "https://cdn.8thwall.com/...",
    "imageUrl": "https://cdn.8thwall.com/...",
    "thumbnailImageUrl": "https://cdn.8thwall.com/...",
    "geometryTextureUrl": "https://cdn.8thwall.com/...",
    "created": 1613508074845,
    "updated": 1613683291310
  }]
}
```

### Obtener objetivo de imagen {#get-image-target}

#### Solicitud {#get-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Respuesta {#get-response}

Objeto JSON del formato de [objetivo de imagen estándar](#image-target-format)

### Modificar el objetivo de imagen {#modify-image-target}

Se pueden modificar las siguientes propiedades:

- `name`
- `loadAutomatically`
- `metadata`
- `metadataIsJson`

Se aplican las mismas reglas de validación que en la [carga inicial](#create-image-target)

Para los objetivos de imagen cilíndricos y cónicos, también se pueden modificar las siguientes propiedades del objeto de `geometría` :

- `cylinderCircumferenceTop`
- `targetCircumferenceTop`
- `inputMode`

Las demás propiedades geométricas del objetivo se actualizarán para que coincidan.

#### Solicitud {#patch-request}

```bash
curl -X PATCH "https://api.8thwall.com/v1/targets/$TARGET_UUID"\
    -H "X-Api-Key:$SECRET_KEY"\
    -H "Content-Type: application/json"\
    --data '{"name":"new-name", "geometry: {"inputMode": "BASIC"}, "metadata": "{}"}'
```

#### Respuesta {#patch-response}

Objeto JSON del formato de [objetivo de imagen estándar](#image-target-format)

### Eliminar objetivo de imagen {#delete-image-target}

#### Solicitud {#delete-request}

```bash
curl -X DELETE "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Respuesta {#delete-response}

Una eliminación correcta devolverá una respuesta vacía con el código de estado `204: Sin contenido`.

### Vista previa del objetivo de imagen {#preview-image-target}

Genera una URL que los usuarios puedan utilizar para previsualizar el seguimiento de un objetivo.

#### Solicitud {#preview-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID/test" -H "X-Api-Key:$SECRET_KEY"
```

#### Respuesta {#preview-response}

```json
{
  "url": "https://8w.8thwall.app/previewit/?j=...",
  "token": "...",
  "exp": 1612830293128
}
```

| Propiedad | Tipo     | Descripción                                                                                                        |
|:--------- |:-------- |:------------------------------------------------------------------------------------------------------------------ |
| url       | `Cadena` | La URL que puede utilizarse para previsualizar el seguimiento del objetivo                                         |
| token     | `Cadena` | Actualmente, este token solo puede ser utilizado por nuestra aplicación de previsualización.                       |
| exp       | integer  | La marca de tiempo en milisegundos de cuándo caducará el token. Las fichas caducan una hora después de su emisión. |

La funcionalidad de previsualización está pensada para ser utilizada en el contexto de un usuario específico que gestione o configure objetivos de imagen. No publique las URL de previsualización en un sitio público ni las compartas con un gran número de usuarios.

**Prácticas recomendadas para experiencias de previsualización personalizadas:** La URL de previsualización que devuelve la API es la experiencia de 8th Wall genérica de previsualización de objetivos de imagen. Si quiere personalizar aún más el frontend de la vista previa de tu objetivo de imagen, siga estos pasos:

1. Crear un proyecto público de 8th Wall
1. Personaliza la UX de este proyecto según sus especificaciones
1. Sube los objetivos de imagen que los usuarios quieran probar a través de la API utilizando la clave de la aplicación para el proyecto que creó en el paso 1
1. Genera una URL de destino de imagen comprobable para los usuarios finales utilizando la URL pública del proyecto en el paso 1 y un parámetro URL con el nombre del objetivo de imagen
1. En el proyecto que has creado en el paso 1, utiliza el parámetro URL para establecer el objetivo de imagen activo mediante la llamada [`XR8.XrController.configure({imageTargets: ['theTargetName']})`](./xrcontroller/configure.md).

## Tratamiento de errores {#error-handling}

Si la API rechaza su solicitud, la respuesta será `Content-Type: application/json`, y el cuerpo contendrá un mensaje `` propiedad que contiene una cadena de error.

## Ejemplo {#example}

```json
{
  "message": "App not found: ..."
}
```

#### Códigos de estado {#status-codes}

| Estado | Razón                                                                                                                                                                                                                                        |
|:------ |:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400    | Esto puede ocurrir si has especificado un valor no válido, o has proporcionado un parámetro que no existe.                                                                                                                                   |
| 403    | Esto puede ocurrir si no proporcionas correctamente su clave secreta.                                                                                                                                                                        |
| 404    | La app o el objetivo de imagen podrían estar borrados, o la clave de la app o el UUID del objetivo son incorrectos. Este es también el código de respuesta si la clave API proporcionada no coincide con el recurso al que intentas acceder. |
| 413    | La imagen cargada ha sido rechazada por ser un archivo demasiado grande.                                                                                                                                                                     |
| 429    | Su Clave API ha superado su [límite de velocidad](#limits-and-quotas) asociado.                                                                                                                                                              |
