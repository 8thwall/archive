---
id: image-targets
---

# Objetivos de imagen

Dé vida a carteles, revistas, cajas, botellas, vasos y latas con los objetivos de imagen de 8th Wall. 8th
Wall Web puede detectar y seguir objetivos de imagen de forma plana, cilíndrica y cónica, lo que le permite
dar vida al contenido estático.

No sólo su imagen designada como objetivo puede desencadenar una experiencia web AR, sino que su contenido también tiene la capacidad
de rastrearlo directamente.

Los objetivos de imagen pueden funcionar en tándem con nuestro seguimiento del mundo (SLAM), lo que permite experiencias que combinan objetivos de imagen
y seguimiento sin marcadores.

Puede rastrear hasta 5 objetivos de imagen simultáneamente con el Rastreo Mundial activado o hasta 10 cuando
está desactivado.

Hasta 5 objetivos de imagen por proyecto pueden ser **"Autoloaded "**. Un objetivo de imagen autocargado se activa
inmediatamente cuando se carga la página. Esto es útil para aplicaciones que utilizan 5 o menos objetivos de imagen, como el embalaje de un producto
, el cartel de una película o una tarjeta de visita.

El conjunto de objetivos de imagen activos puede cambiarse en cualquier momento llamando a
[XR8.XrController.configure()](/legacy/api/xrcontroller/configure). Esto le permite gestionar cientos de objetivos de imagen
por proyecto, haciendo posibles casos de uso como cacerías de objetivos de imagen geo-vallados, libros de RA, visitas guiadas a museos de arte
y mucho más. Si su proyecto utiliza SLAM la mayor parte del tiempo pero objetivos de imagen
parte del tiempo, puede mejorar el rendimiento cargando objetivos de imagen sólo cuando los necesite.
puede incluso leer los nombres de los objetivos cargados a partir de parámetros de URL almacenados en diferentes códigos QR, lo que le permite
tener diferentes objetivos cargados inicialmente en la misma aplicación web dependiendo de los códigos QR que el usuario
escanee para entrar en la experiencia.

**Nota: Los objetivos de imagen personalizados no se pueden previsualizar actualmente en el
[Simulator](/legacy/getting-started/quick-start-guide/#simulator).**

## Tipos de objetivo de imagen {#image-target-types}

\| |
\-|-|-
**Plano**|![FlatTarget](/images/flat.jpg)| Rastrea imágenes 2D como carteles, señales, revistas, cajas, etc.
**Cylindrical**|![CylindricalTarget](/images/cylindrical.jpg)| Seguimiento de imágenes envueltas alrededor de elementos cilíndricos como latas y botellas.
**Conical**|![ConicalTarget](/images/conical.jpg)| Rastrea imágenes envueltas alrededor de objetos con diferente circunferencia superior e inferior, como tazas de café, etc.

## Requisitos del objetivo de imagen {#image-target-requirements}

- Tipos de archivo: **.jpg**, **.jpeg** o **.png**
- Dimensiones:
  - Mínimo: \*\*480 x 640 píxeles
  - Longitud o anchura máximas: **2048 píxeles**.
    - Nota: Si subes algo más grande, la imagen se redimensiona a una longitud/anchura máxima de 2048
      , manteniendo la relación de aspecto.
- Alojamiento: Todos los objetivos de imagen deben cargarse en su proyecto 8th Wall antes de que puedan utilizarse en
  . Puede alojar usted mismo el resto de su experiencia Web AR (si tiene un plan Enterprise o Legacy Pro
  ), pero el destino de la imagen de origen siempre está alojado en 8th Wall. Consulte a continuación las instrucciones
  sobre la creación/carga de objetivos de imágenes planas o curvas.

## Imagen Cantidades objetivo {#image-target-quantities}

No hay límite en el número de objetivos de imagen que se pueden asociar a un proyecto, sin embargo,
hay límites en el número de objetivos de imagen que pueden estar **activos** en el navegador del usuario en cualquier
momento dado.

- Objetivos de imagen activos por proyecto: **32**

## Gestión de objetivos de imagen {#manage-image-targets}

Haga clic en el icono Destino de imagen de la barra de navegación de la izquierda o en el enlace "Gestionar destinos de imagen" del panel de control del proyecto
para gestionar sus destinos de imagen.

![ManageImageTargets](/images/console-appkey-imagetargets.jpg)

Esta pantalla le permite crear, editar y eliminar los objetivos de imagen asociados a su proyecto.
Haga clic en un destino de imagen existente para editarlo.  Haga clic en el icono "+" del tipo de destino de imagen deseado para
crear uno nuevo.

![ManageImageTargets2](/images/console-appkey-imagetarget-library.jpg)

## Crear objetivo de imagen plana {#create-flat-image-target}

1. Haz clic en el icono "+ Plano" para crear un nuevo objetivo de imagen plana.

![ImageTargetFlat1](/images/image-target-create-flat.jpg)

2. **Cargar imagen plana**: Arrastre su imagen (.jpg, .jpeg o .png) al panel de carga, o haga clic dentro de la región punteada y utilice su explorador de archivos para seleccionar su imagen.

3. **Establecer región de seguimiento** (y orientación): Utilice el control deslizante para establecer la región de la imagen que se utilizará para detectar y rastrear su objetivo dentro de la experiencia WebAR. El resto de la imagen se descartará, y la región que especifique será rastreada en su experiencia.

![SetTrackingRegion](https://media.giphy.com/media/RCFntZ0hn5VO3W9Mld/giphy.gif)

4. **Editar propiedades del objetivo de imagen plana**:

- (1) Asigne un **nombre** a su imagen de destino editando el campo situado en la parte superior izquierda de la ventana.
- (2) **¡IMPORTANTE!** Pruebe su imagen objetivo: La mejor manera de determinar si su imagen cargada será un buen o mal objetivo de imagen (véase [Optimización del seguimiento de objetivos de imagen](#optimizing-image-target-tracking)) es utilizar el Simulador para evaluar la calidad del seguimiento.  Escanee el código QR con su aplicación de cámara para abrir el enlace del simulador y, a continuación, apunte con su dispositivo a la pantalla o al objeto físico.
- (3) Haga clic en **Cargar automáticamente** si desea que el destino de imagen se active automáticamente al cargar el proyecto WebAR. Se pueden cargar automáticamente hasta 5 objetivos de imagen sin escribir una sola línea de código.  Se pueden cargar más objetivos mediante programación a través de la API de Javascript.
- (4) Opcional: Si desea añadir metadatos a su imagen, en formato Texto o JSON, haga clic en el botón **Metadatos** situado en la parte inferior de la ventana.

![EditFlatImageTarget](/images/edit-flat-image-target.jpg)

5. Los cambios realizados en esta pantalla se guardan automáticamente.  Haga clic en **Cerrar** para volver a la biblioteca de imágenes de destino.

## Crear objetivo de imagen cilíndrica {#create-cylindrical-image-target}

1. Haz clic en el icono "+ Cilíndrico" para crear un nuevo objetivo de imagen plana.

![ImageTargetFlat1](/images/image-target-create-cylindrical.jpg)

2. **Cargar imagen plana**: Arrastre su imagen (.jpg, .jpeg o .png) al panel de carga, o haga clic dentro de la región punteada y utilice su explorador de archivos para seleccionar su imagen.

3. **Establecer región de seguimiento** (y orientación): Utilice el control deslizante para establecer la región de la imagen que se utilizará para detectar y rastrear su objetivo dentro de la experiencia WebAR. El resto de la imagen se descartará, y la región que especifique será rastreada en su experiencia.

![](https://media.giphy.com/media/AdgvL3hqQAULWEHWTg/giphy.gif)

4. **Editar propiedades del objetivo de imagen cilíndrica**:

- (1) Asigne un **nombre** a su imagen de destino editando el campo situado en la parte superior izquierda de la ventana.
- (2) **Arrastre los controles deslizantes** hasta que la forma de su etiqueta aparezca como se espera en el simulador, o **introduzca directamente las medidas**.
- (3) **¡IMPORTANTE!** Pruebe su imagen objetivo: La mejor manera de determinar si su imagen cargada será un buen o mal objetivo de imagen (véase [Optimización del seguimiento de objetivos de imagen](#optimizing-image-target-tracking)) es utilizar el Simulador para evaluar la calidad del seguimiento.  Escanee el código QR con su aplicación de cámara para abrir el enlace del simulador y, a continuación, apunte con su dispositivo a la pantalla o al objeto físico.
- (4) Haga clic en **Cargar automáticamente** si desea que el objetivo de imagen se active automáticamente al cargar el proyecto WebAR. Se pueden cargar automáticamente hasta 5 objetivos de imagen sin escribir una sola línea de código.  Se pueden cargar más objetivos mediante programación a través de la API de Javascript.
- (5) Opcional: Si desea añadir metadatos a su imagen, en formato Texto o JSON, haga clic en el botón **Metadatos** situado en la parte inferior de la ventana.

![EditCylindricalImageTarget](/images/edit-cylindrical-image-target.jpg)

5. Los cambios realizados en esta pantalla se guardan automáticamente.  Haga clic en **Cerrar** para volver a la biblioteca de imágenes de destino.

## Crear objetivo de imagen cónica {#create-conical-image-target}

1. Haz clic en el icono "+ Cónica" para crear un nuevo objetivo de imagen plana.

![ImageTargetFlat1](/images/image-target-create-conical.jpg)

2. **Cargar imagen cónica**: Arrastre su imagen (.jpg, .jpeg o .png) al panel de carga, o haga clic dentro de la región punteada y utilice su explorador de archivos para seleccionar su imagen.  La imagen cargada debe estar en formato "sin envolver", también conocido como "arco iris", recortada de esta forma:

![conical rainbow image](/images/conical-rainbow-image.jpg)

3. **Establecer alineación de arco grande**: Arrastre el control deslizante hasta que la línea **roja** se superponga al **arco grande** de la imagen cargada.

![set large arc](https://media.giphy.com/media/1zcOKYrjOmhaxUJ7lh/giphy.gif)

4. **Alinear el arco pequeño**: Haz lo mismo para el arco pequeño.  Arrastre el control deslizante hasta que la línea **azul** se superponga al **arco pequeño** de la imagen cargada.

5. **Establecer región de seguimiento** (y orientación): Arrastre y amplíe la imagen para establecer la parte de la imagen que se detecta y rastrea. Esta debe ser la zona más rica en funciones de su imagen.

![set tracking](https://media.giphy.com/media/t2rSve9UshxGB07US2/giphy.gif)

6. **Editar propiedades del objetivo de imagen cónica**:

- (1) Asigne un **nombre** a su imagen de destino editando el campo situado en la parte superior izquierda de la ventana.
- (2) **Arrastre los controles deslizantes** hasta que la forma de su etiqueta aparezca como se espera en el simulador, o **introduzca directamente las medidas**.
- (3) **¡IMPORTANTE!** Pruebe su imagen objetivo: La mejor manera de determinar si su imagen cargada será un buen o mal objetivo de imagen (véase [Optimización del seguimiento de objetivos de imagen](#optimizing-image-target-tracking)) es utilizar el Simulador para evaluar la calidad del seguimiento.  Escanee el código QR con su aplicación de cámara para abrir el enlace del simulador y, a continuación, apunte con su dispositivo a la pantalla o al objeto físico.
- (4) Haga clic en **Cargar automáticamente** si desea que el objetivo de imagen se active automáticamente al cargar el proyecto WebAR. Se pueden cargar automáticamente hasta 5 objetivos de imagen sin escribir una sola línea de código.  Se pueden cargar más objetivos mediante programación a través de la API de Javascript.
- (5) Opcional: Si desea añadir metadatos a su imagen, en formato Texto o JSON, haga clic en el botón **Metadatos** situado en la parte inferior de la ventana.

![EditConicalImageTarget](/images/edit-conical-image-target.jpg)

7. Los cambios realizados en esta pantalla se guardan automáticamente.  Haga clic en **Cerrar** para volver a la biblioteca de imágenes de destino.

## Editar objetivos de imagen {#edit-image-targets}

Haga clic en cualquiera de los objetivos de imagen de **Mis objetivos de imagen** para ver y/o modificar sus propiedades:

1. Nombre del destino de la imagen
2. Deslizadores / Mediciones (sólo objetivos de imagen cilíndricos/cónicos)
3. Simulador de código QR
4. Borrar imagen de destino
5. Cargar automáticamente
6. Metadatos
7. Orientación y dimensiones
8. Estado de autoguardado
9. Cerrar

| Tipo       | Campos                                                                |
| ---------- | --------------------------------------------------------------------- |
| Plano      | ![flat target](/images/edit-flat-image-target-full.jpg)               |
| Cilíndrico | ![cylindrical target](/images/edit-cylindrical-image-target-full.jpg) |
| Cónica     | ![conical target](/images/edit-conical-image-target-full.jpg)         |

## Cambio de objetivos de imagen activos {#changing-active-image-targets}

El conjunto de objetivos de imagen activos puede modificarse en tiempo de ejecución llamando a
[XR8.XrController.configure()](/legacy/api/xrcontroller/configure)

Nota: El conjunto de objetivos de imagen actualmente activos será **reemplazado** con el nuevo conjunto passwd a
[XR8.XrController.configure()](/legacy/api/xrcontroller/configure).

#### Ejemplo - Cambiar el conjunto de destino de imagen activo {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['imagen-objetivo1', 'imagen-objetivo2', 'imagen-objetivo3']})
```

## Optimización del seguimiento de imágenes {#optimizing-image-target-tracking}

Para garantizar una experiencia de seguimiento de objetivos de imagen de la máxima calidad, asegúrese de seguir estas directrices al seleccionar un objetivo de imagen.

_**DO**_ tener:

- muchos detalles variados
- alto contraste

_**DON'T**_ tener:

- patrones repetitivos
- espacio muerto excesivo
- imágenes de baja resolución

Color: La detección de objetivos por imagen no puede distinguir entre colores, por lo que no debe confiarse en ella como un diferenciador clave entre objetivos.

Para obtener los mejores resultados, utilice imágenes en superficies planas, cilíndricas o cónicas para el seguimiento de objetivos por imagen.

Tenga en cuenta la reflectividad del material físico de su objetivo de imagen. Las superficies brillantes y los reflejos de la pantalla pueden reducir la calidad del seguimiento. Utilice materiales mate en condiciones de iluminación difusa para obtener una calidad de seguimiento óptima.

Nota: La detección es más rápida en el centro de la pantalla.

| Buenos marcadores                            | Marcadores malos                           |
| -------------------------------------------- | ------------------------------------------ |
| ![good logo](/images/it-logo-good.jpg)       | ![bad logo](/images/it-logo-bad.jpg)       |
| ![movie poster](/images/it-movie-poster.jpg) | ![bad pattern](/images/it-pattern-bad.jpg) |

## Imagen Eventos de destino {#image-target-events}

8th Wall Web emite Eventos / Observables para varios eventos en el ciclo de vida del objetivo de imagen (por ejemplo, imageloading, imagescaning, imagefound, imageupdated, imagelost) Por favor, consulte la referencia de la API para obtener instrucciones sobre el manejo de estos eventos en su aplicación web:

- [Eventos AFrame](/legacy/api/aframeevents)
- [BabylonJS Observables](/legacy/api/babylonjs/observables)
- [Eventos PlayCanvas](/legacy/api/playcanvasevents/playcanvas-image-target-events)
- [Eventos despachados XrController](/legacy/api/xrcontroller/pipelinemodule/#dispatched-events)

#### Ejemplos de proyectos {#example-projects}

<https://github.com/8thwall/web/tree/master/examples/aframe/artgallery>

<https://github.com/8thwall/web/tree/master/examples/aframe/flyer>
