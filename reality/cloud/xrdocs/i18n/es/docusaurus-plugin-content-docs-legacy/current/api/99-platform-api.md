# Plataforma API: Objetivos de imagen

La API de gestión de objetivos de imagen de 8th Wall permite a los desarrolladores gestionar dinámicamente la \*\*biblioteca de objetivos de imagen
\*\* asociada a sus proyectos WebAR impulsados por 8th Wall. Esta API y la documentación que la acompaña
están diseñadas para desarrolladores familiarizados con el desarrollo web y los objetivos de imagen de 8th Wall.

**Antes de empezar:** Antes de empezar a utilizar la API Image Target, su espacio de trabajo debe estar en un plan de facturación
**Enterprise**. Para actualizar, [póngase en contacto con ventas](https://www.8thwall.com/licensing).

## Autenticación {#authentication}

La autenticación se realiza mediante claves secretas. Los espacios de trabajo con un plan Enterprise pueden solicitar una clave API.
Incluirá esta clave secreta en cada solicitud para verificar que la solicitud está autorizada. Dado que la clave está asignada a su espacio de trabajo en
, tendrá acceso a todos los objetivos de imagen de todas las aplicaciones de ese espacio de trabajo en
.

Puede ver su clave en la página de su cuenta.

![Visualization showing image targets inside apps, apps inside the workspace, and the API Key inside the workspace](/images/authentication-structure.png)

#### Importante {#important}

La clave API de Image Target es una clave B2B asociada a su espacio de trabajo. Siga las mejores prácticas para proteger su clave de API en
, ya que exponer públicamente su clave de API puede dar lugar a un uso no intencionado y a un acceso no autorizado a
. En particular, evite:

- Incrustación de la clave API de Image Target en código que se ejecuta en el dispositivo de un usuario o se comparte públicamente
- Almacenamiento de la clave API de Image Target en el árbol de código fuente de la aplicación

## Límites y cuotas {#limits-and-quotas}

- 25 peticiones por minuto, con una ráfaga permitida de 500, lo que significa que puedes hacer 500 peticiones en un minuto
  , luego puedes hacer 25 peticiones por minuto después de eso, o podrías esperar 20 minutos y hacer otras
  500 peticiones.
- 10.000 solicitudes al día.

**Nota**: Estos límites sólo se aplican a la API de gestión de objetivos de imagen, que permite a los desarrolladores
gestionar dinámicamente la biblioteca de imágenes asociadas a un proyecto 8th Wall. **Estos límites no son
aplicables a las activaciones de usuario final de una experiencia web AR.**

Para solicitar un aumento de los límites de cuota de la API de destino de imágenes para los proyectos de su espacio de trabajo
, envíe una solicitud a [support](mailto:support@8thwall.com).

## Puntos finales {#endpoints}

- [Crear imagen de destino](#create-image-target)
- [Listar objetivos de imagen](#list-image-targets)
- [Obtener imagen de destino](#get-image-target)
- [Modificar destino de la imagen](#modify-image-target)
- [Borrar imagen de destino](#delete-image-target)
- [Vista previa de la imagen](#preview-image-target)

### Crear imagen de destino {#create-image-target}

Cargar un nuevo objetivo en la lista de objetivos de imagen de una aplicación

#### Solicitar {#post-request}

```bash
curl -X POST "https://api.8thwall.com/v1/apps/$APP_KEY/targets" \
    -H "X-Api-Key:$SECRET_KEY" \
    -F "name=mi-nombre-de-objetivo" \
    -F "image=@image.png"\
    -F "geometry.top=0"\
    -F "geometry.left=0"\
    -F "geometry.width=480"\
    -F "geometry.height=640"\
    -F "metadata={"customFlag\":true}"
    -F "loadAutomatically=true"
```

| Campo                                                                                             | Tipo           | Valor por defecto | Descripción                                                                                                                                                                         |
| :------------------------------------------------------------------------------------------------ | :------------- | :---------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| imagen                                                                                            | Datos binarios |                   | formato PNG o JPEG, debe ser de al menos 480x640, menos de 2048x2048 y menos de 10MB                                                                                                |
| nombre                                                                                            | Cadena         |                   | Debe ser único dentro de una aplicación, no puede incluir tildes (~) y no puede superar los 255 caracteres.                      |
| tipo [Opcional]                               | Cadena         | `'PLANAR'`        | PLANAR", "CILÍNDRICO" o "CÓNICO".                                                                                                                                   |
| metadatos [Opcional]                          | Cadena         | "null             | Debe ser JSON válido si `metadataIsJson` es verdadero, y no puede superar los 2048 caracteres                                                                                       |
| metadataIsJson [Opcional]                     | Booleano       | `true`            | Puede establecer false para utilizar la propiedad de metadatos como una cadena sin procesar                                                                                         |
| loadAutomatically [Opcional]                  | Booleano       | `false`           | Cada aplicación está limitada a 5 objetivos de imagen con `loadAutomatically: true`.                                                                                |
| geometry.isRotated [Opcional] | Booleano       | `false`           | Establecer a true si la imagen está prerrotado de horizontal a vertical.                                                                                            |
| geometría.top                                                                     | entero         |                   | Estas propiedades especifican el recorte que se aplicará a la imagen. Debe tener una relación de aspecto de 3:4 y al menos 480x640. |
| geometría.izquierda                                                               | entero         |                   |                                                                                                                                                                                     |
| geometría.anchura                                                                 | entero         |                   |                                                                                                                                                                                     |
| geometría.altura                                                                  | entero         |                   |                                                                                                                                                                                     |
| geometry.topRadius                                                                | entero         |                   | Sólo necesario para `type: 'CONICAL'`.                                                                                                                              |
| geometry.bottomRadius                                                             | entero         |                   | Sólo necesario para `type: 'CONICAL'`.                                                                                                                              |

#### Geometría de carga plana / cilíndrica {#planar--cylinder-upload-geometry}

Este diagrama muestra cómo se aplica el recorte especificado a la imagen cargada para generar
`imageUrl` y `thumbnailImageUrl`. La relación anchura:altura es siempre 3:4.

![Diagram showing how crop, rotation, and scale are applied to planar and cylinder image targets](/images/flat-geometry.jpg)

Para un recorte apaisado, cargue la imagen girada 90 grados en el sentido de las agujas del reloj, configure
`geometry.isRotated: true`, y especifique el recorte contra la imagen girada.

![Diagram showing how crop, rotation, and scale are applied to planar and cylinder image targets when isRotated is true](/images/rotated-geometry.jpg)

#### Geometría de carga cónica {#conical-upload-geometry}

Este diagrama muestra cómo se aplana y recorta la imagen cargada en función de los parámetros. La imagen cargada en
tiene un formato "arco iris" en el que los bordes superior e inferior de su contenido están alineados
a dos círculos concéntricos. Si su objetivo es más estrecho por arriba que por abajo, especifique `topRadius`
como el negativo del radio exterior, y `bottomRadius` como el radio interior (positivo). Para un recorte de paisaje
, establezca `geometry.isRotated: true`, y la imagen aplanada se rotará antes de aplicar el recorte
.

![Diagram showing how crop, rotation, and scale are applied to conical image targets](/images/cone-geometry.jpg)

#### Respuesta {#post-response}

<span id="image-target-format">Este es el formato de respuesta JSON estándar para objetivos de imagen.</span>

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

| Propiedad             | Tipo     | Descripción                                                                                                                              |
| :-------------------- | :------- | :--------------------------------------------------------------------------------------------------------------------------------------- |
| nombre                | Cadena   |                                                                                                                                          |
| uuid                  | Cadena   | ID único de este objetivo de imagen                                                                                                      |
| tipo                  | Cadena   | "PLANAR", "CILÍNDRICO" o "CÓNICO".                                                                                       |
| cargarAutomáticamente | Booleano |                                                                                                                                          |
| estado                | Cadena   | `'AVAILABLE'` o `'TAKEN_DOWN'`.                                                                                          |
| appKey                | Cadena   | La aplicación a la que pertenece el objetivo                                                                                             |
| geometría             | Objeto   | Ver más abajo                                                                                                                            |
| metadatos             | Cadena   |                                                                                                                                          |
| metadataIsJson        | Booleano |                                                                                                                                          |
| originalImageUrl      | Cadena   | URL CDN de la imagen de origen que se ha cargado                                                                                         |
| imageUrl              | Cadena   | Versión recortada de `geometryTextureUrl`.                                                                               |
| thumbnailImageUrl     | Cadena   | Versión de 350px de alto de la `imageUrl` para su uso en miniaturas                                                                      |
| geometryTextureUrl    | Cadena   | Para cónica, es una versión aplanada de la imagen original; para plana y cilíndrica, es la misma que `originalImageUrl`. |
| creado                | entero   | Fecha de creación en milisegundos después de unix epoch                                                                                  |
| actualizado           | entero   | Fecha de la última actualización en milisegundos después de unix epoch                                                                   |

#### Geometría plana {#planar-geometry}

| Propiedad      | Tipo     | Descripción                  |
| :------------- | :------- | :--------------------------- |
| top            | entero   |                              |
| izquierda      | entero   |                              |
| anchura        | entero   |                              |
| altura         | entero   |                              |
| isRotated      | Booleano |                              |
| anchooriginal  | entero   | Anchura de la imagen cargada |
| originalHeight | entero   | Altura de la imagen cargada  |

#### Geometría cilíndrica o cónica {#cylinder-or-conical-geometry}

Amplía las propiedades de geometría plana con la modificación de que `originalWidth` y
`originalHeight` se refieren a las dimensiones de la imagen aplanada almacenada en geometryTextureUrl.

| Propiedad                   | Tipo   | Descripción                                                                                                                                                                        |
| :-------------------------- | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| topRadius                   | float  |                                                                                                                                                                                    |
| bottomRadius                | float  |                                                                                                                                                                                    |
| coniness                    | float  | Siempre 0 para `type: CYLINDER`, derivado de `topRadius`/`bottomRadius` para \`type: CONICO                                                                        |
| cilindroCircunferenciaTop   | float  | La circunferencia del círculo completo trazado por el borde superior de su objetivo.                                                                               |
| targetCircumferenceTop      | float  | La longitud a lo largo del borde superior del objetivo antes de aplicar el recorte.                                                                                |
| cilindroCircunferenciaFondo | float  | Derivado de `cylinderCircumferenceTop` y `topRadius`/`bottomRadius`.                                                                                               |
| cylinderSideLength          | float  | Derivado de `targetCircumferenceTop` y las dimensiones de la imagen original                                                                                                       |
| arcAngle                    | float  | Derivado de `cylinderCircumferenceTop` y `targetCircumferenceTop`.                                                                                                 |
| inputMode                   | Cadena | BÁSICO" o "AVANZADO". Controla lo que ven los usuarios en la consola 8th Wall, ya sean controles deslizantes o cuadros de introducción de números. |

### Lista de objetivos de imagen {#list-image-targets}

Consulta de una lista de objetivos de imagen que pertenecen a una aplicación. Los resultados están paginados, lo que significa que si la aplicación
contiene más destinos de imagen de los que se pueden devolver en una respuesta, tendrá que realizar varias solicitudes a
para enumerar la lista completa de destinos de imagen.

#### Solicitar {#list-request}

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets" -H "X-Api-Key:$SECRET_KEY"
```

| Parámetro                                                                   | Tipo   | Descripción                                                                                                                                    |
| :-------------------------------------------------------------------------- | :----- | :--------------------------------------------------------------------------------------------------------------------------------------------- |
| por [Opcional]          | Cadena | Especifica la columna por la que se va a ordenar. Las opciones son "creado", "actualizado", "nombre" o "uuid". |
| dir [Opcional]          | Cadena | Controla la dirección de ordenación de la lista. Ya sea "asc" o "desc".                                        |
| inicio [Opcional]       | Cadena | Especifica que la lista comienza con los elementos que tienen este valor en la columna \`by                                                    |
| después de [Opcional]   | Cadena | Especifica que la lista comienza inmediatamente después de los elementos que tienen este valor                                                 |
| límite [Opcional]       | entero | Debe estar entre 1 y 500                                                                                                                       |
| continuación [Opcional] | Cadena | Se utiliza para buscar la página siguiente a la consulta inicial.                                                              |

#### Lista ordenada {#sorted-list}

Esta consulta enumera los objetivos de la aplicación empezando por "z" y yendo hacia "a".

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=name&dir=desc" -H "X-Api-Key:$SECRET_KEY"
```

#### Clasificación múltiple {#multiple-sorts}

Puede especificar un parámetro secundario "sort-by" que actúe como criterio de desempate en caso de duplicados en su primer valor `by`. `uuid` se utiliza como criterio de desempate por defecto si no se especifica.

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid" -H "X-Api-Key:$SECRET_KEY"
```

#### Especifique un punto de partida {#specify-a-starting-point}

Puede especificar los valores `start` o `after` que corresponden a los valores `by` para especificar su posición actual en la lista. Si quieres que tu lista empiece inmediatamente después del elemento con `updated: 333` y `uuid: 777`, usarías:

```bash
curl "https://api.8thwall.com/v1/apps/$APP_KEY/targets?by=updated&by=uuid&start=333&after=777" -H "X-Api-Key:$SECRET_KEY"
```

De este modo, los elementos con `updated: 333` se incluyen en la página siguiente si su `uuid` es posterior a `777`. Si el valor `updated` de un elemento es mayor que `333`, pero su `uuid` es menor que `777`, se incluirá en la página siguiente porque la segunda propiedad `by` sólo entra en juego para los desempates.

No es válido especificar un valor `after` para la ordenación principal mientras se proporciona un valor `start` para la ordenación de desempate. Por ejemplo, no sería válido especificar `?by=name&by=uuid&after=my-name-&start=333`. Debería ser `?by=name&by=uuid&after=my-name-` porque el segundo punto de inicio sólo entra en juego cuando el punto de inicio principal es inclusivo (usando `start`).

![Diagram showing how the by, start, and after parameters specify the starting point of the list](/images/image-target-sort.png)

#### Respuesta {#list-response}

Objeto JSON que contiene la propiedad `targets`, que es una matriz de objetos objetivo de imagen en el [formato estándar](#post-response).

Si `continuationToken` está presente, para obtener la siguiente página de objetivos de imagen, deberá especificar `?continuation=[continuationToken]` en una petición posterior para obtener la siguiente página de objetivos de imagen.

```json
{
  "continuationToken": "...",
  "targets": {
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
    "metadata": "my-metadata\": 34534}",
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

### Obtener imagen de destino {#get-image-target}

#### Solicitar {#get-request}

```bash
curl "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Respuesta {#get-response}

Objeto JSON del [formato de destino de imagen estándar](#post-response)

### Modificar el destino de la imagen {#modify-image-target}

Se pueden modificar las siguientes propiedades:

- `nombre`
- cargar automáticamente
- metadatos
- `metadataIsJson`

Se aplican las mismas reglas de validación que en la [carga inicial](#create-image-target)

Para los objetivos de imagen cilíndricos y cónicos, también se pueden modificar las siguientes propiedades del objeto `geometría`:

- CircunferenciaCilindroTopo
- `targetCircumferenceTop`
- ModoEntrada

Las demás propiedades geométricas del objetivo se actualizarán para que coincidan.

#### Solicitar {#patch-request}

```bash
curl -X PATCH "https://api.8thwall.com/v1/targets/$TARGET_UUID"\
    -H "X-Api-Key:$SECRET_KEY"\
    -H "Content-Type: application/json"\
    --data '{"name": "new-name", "geometry: {"inputMode": "BASIC"}, "metadata": "{}"}'
```

#### Respuesta {#patch-response}

Objeto JSON del [formato de destino de imagen estándar](#post-response)

### Borrar imagen de destino {#delete-image-target}

#### Solicitar {#delete-request}

```bash
curl -X DELETE "https://api.8thwall.com/v1/targets/$TARGET_UUID" -H "X-Api-Key:$SECRET_KEY"
```

#### Respuesta {#delete-response}

Una eliminación correcta devolverá una respuesta vacía con el código de estado `204: No Content`.

### Vista previa de la imagen de destino {#preview-image-target}

Generar una URL que los usuarios puedan utilizar para previsualizar el seguimiento de un objetivo.

#### Solicitar {#preview-request}

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

| Propiedad | Tipo   | Descripción                                                                                                                                        |
| :-------- | :----- | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| url       | Cadena | La URL que se puede utilizar para previsualizar el seguimiento del objetivo                                                                        |
| ficha     | Cadena | Actualmente, este token sólo puede ser utilizado por nuestra aplicación de vista previa.                                           |
| exp       | entero | La marca de tiempo en milisegundos de cuando expirará el token. Las fichas caducan una hora después de su emisión. |

La funcionalidad de previsualización está pensada para ser utilizada en el contexto de un usuario específico que gestione o configure objetivos de imagen en
. No publique las URL de previsualización en un sitio público ni las comparta con un gran número de usuarios.

**Mejores prácticas para experiencias de previsualización personalizadas:** La URL de previsualización que devuelve la API es
la octava experiencia genérica de previsualización de imágenes de destino de Wall. Si desea personalizar aún más el frontend
de su previsualización de destino de imagen siga los siguientes pasos:

1. Crear un proyecto público del 8º Muro
2. Personalice la UX de este proyecto según sus especificaciones
3. Cargue los objetivos de imagen que los usuarios quieren probar a través de la API utilizando la clave de la aplicación para el proyecto que
   creado en el paso 1
4. Genere una URL de destino de imagen comprobable para los usuarios finales utilizando la URL pública del proyecto en el paso 1
   y un parámetro URL con el nombre del destino de imagen.
5. En el proyecto que ha creado en el paso 1 utilice el parámetro URL para establecer el objetivo de imagen activo utilizando la llamada
   [`XR8.XrController.configure({imageTargets: ['theTargetName']})`](./xrcontroller/configure.md).

## Tratamiento de errores {#error-handling}

Si la API rechaza su solicitud, la respuesta será `Content-Type: application/json`, y el cuerpo de
contendrá una propiedad `message` con una cadena de error.

## Ejemplo {#example}

```json
{
  "mensaje": "App no encontrada: ..."
}
```

#### Códigos de estado {#status-codes}

| Estado | Razón                                                                                                                                                                                                                                                                                                 |
| :----- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 400    | Esto puede ocurrir si has especificado un valor no válido, o has proporcionado un parámetro que no existe.                                                                                                                                                                            |
| 403    | Esto puede ocurrir si no está proporcionando su clave secreta correctamente.                                                                                                                                                                                                          |
| 404    | La aplicación o la imagen de destino podrían haberse eliminado, o la clave de la aplicación o el UUID del destino son incorrectos. Este es también el código de respuesta si la clave de API proporcionada no coincide con el recurso al que está intentando acceder. |
| 413    | La imagen cargada ha sido rechazada por ser un archivo demasiado grande.                                                                                                                                                                                                              |
| 429    | Su clave API ha superado su [límite de velocidad] asociado(#limits-and-quotas).                                                                                                                                |
