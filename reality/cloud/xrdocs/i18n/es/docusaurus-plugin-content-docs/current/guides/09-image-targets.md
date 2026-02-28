---
id: image-targets
---

# Objetivos de imagen

Dé vida a carteles, revistas, cajas, botellas, vasos y latas con los objetivos de imagen de 8th Wall. la web de 8th Wall puede detectar y seguir objetivos de imagen de forma plana, cilíndrica y cónica, lo que le permite dar vida al contenido estático.

Su objetivo de imagen designado no solo puede desencadenar una experiencia WebAR, sino que su contenido también tiene la capacidad de rastrearlo directamente.

Los objetivos de imagen pueden funcionar en tándem con nuestro Rastreo de Mundo (SLAM), permitiendo experiencias que combinan objetivos de imagen y seguimiento sin marcadores.

Puede rastrear hasta 5 objetivos de imagen con el Rastreo de Mundo activado o hasta 10 cuando está desactivado.

Se pueden **cargar automáticamente** hasta 5 objetivos de imagen por proyecto. Un objetivo de imagen cargado automáticamente se activa inmediatamente al cargar la página. Esto es útil para aplicaciones que utilizan 5 o menos objetivos de imagen, como el envase de un producto, el cartel de una película o una tarjeta de visita.

El conjunto de objetivos de imagen activos puede cambiarse en cualquier momento llamando a [XR8.XrController.configure()](/api/xrcontroller/configure). Esto le permite gestionar cientos de objetivos de imagen por proyecto, haciendo posible el uso de casos como cacerías de objetivos de imagen geocercados, libros de AR, visitas guiadas a museos de arte y mucho más. Si su proyecto utiliza SLAM la mayor parte del tiempo, pero utiliza objetivos de imagen parte del tiempo, puede mejorar el rendimiento cargando objetivos de imagen solo cuando los necesite. Puede incluso leer los nombres de los objetivos cargados a partir de parámetros de URL almacenados en diferentes códigos QR, lo que le permite tener diferentes objetivos cargados inicialmente en la misma aplicación web dependiendo de los códigos QR que el usuario escanee para entrar en la experiencia.

**Nota: Los objetivos de imagen personalizados no se pueden previsualizar actualmente en el [simulador](/getting-started/quick-start-guide/#simulator).**

## Tipos de objetivos de imagen {#image-target-types}

 |                |                                                                                                                                                                       |
 | -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
 | **Plano**      | ![FlatTarget](/images/flat.jpg)| Rastreo de imágenes 2D como carteles, señales, revistas, cajas, etc.                                                                 |
 | **Cilíndrico** | ![CylindricalTarget](/images/cylindrical.jpg)| Rastreo de imágenes de pista envueltas alrededor de objetos cilíndricos como latas y botellas.                         |
 | **Cónico**     | ![ConicalTarget](/images/conical.jpg)| Rastreo dee imágenes envueltas alrededor de objetos con diferente circunferencia superior e inferior, como tazas de café, etc. |

## Requisitos del objetivo de imagen {#image-target-requirements}

* Tipos de archivo: **.jpg**, **.jpeg** o **.png**
* Dimensiones
  * Mínimo: **480 x 640 píxeles**
  * Longitud o anchura máxima: **2048 píxeles**.
    * Nota: Si subes algo más grande, la imagen se redimensiona a una longitud/anchura máxima de 2048 , manteniendo la relación de aspecto.
* Alojamiento: Todos los objetivos de imagen deben cargarse en su proyecto 8th Wall antes de que puedan utilizarse en . Puede alojar usted mismo el resto de su experiencia Web AR (si tiene un plan Pro o Enterprise), pero el destino de la imagen de origen siempre está alojado en 8th Wall. Consulte a continuación las instrucciones para crear/cargar objetivos de imágenes planas o curvas.

## Cantidad de objetivos de la imagen {#image-target-quantities}

No hay límite en el número de objetivos de imagen que pueden asociarse a un proyecto, sin embargo, hay límite en el número de objetivos de imagen que pueden estar **activos** en un momento dado.

Pueden estar activos simultáneamente hasta 5 objetivos de imagen mientras está activado el Rastreo de Mundo (SLAM). Si el Rastreo de Mundo (SLAM) está desactivado (configurando "disableWorldTracking: true") puede tener hasta 10 objetivos de imagen activos simultáneamente.

* Imágenes activas por proyecto (Rastreo de Mundo activado): **5**
* Imágenes activas por proyecto (Rastreo de Mundo desactivado): **10**

## Gestionar objetivos de imagen {#manage-image-targets}

Haga clic en el icono Destino de imagen del navegador de la izquierda o en el enlace "Gestionar objetivos de imagen" del panel de control del proyecto para gestionar sus objetivos de imagen.

![ManageImageTargets](/images/console-appkey-imagetargets.jpg)

Esta pantalla le permite crear, editar y eliminar los objetivos de imagen asociados a su proyecto. Haga clic en un objetivo de imagen existente para editarlo.  Haga clic en el icono "+" del tipo de objetivo de imagen deseado para crear uno nuevo.

![ManageImageTargets2](/images/console-appkey-imagetarget-library.jpg)

## Crear objetivo de imagen plana {#create-flat-image-target}

1. Haga clic en el icono "+ Plano" para crear un nuevo objetivo de imagen plana.

![ImageTargetFlat1](/images/image-target-create-flat.jpg)

2. **Subir un objetivo de imagen plana**: arrastre su imagen (.jpg, .jpeg o .png) al panel de subida, o haga clic dentro de la zona de puntos y utilice su buscador de archivos para seleccionar su imagen.

3. **Establecer una región de seguimiento** (y orientación): utilice el control deslizante para establecer la región de la imagen que se utilizará para detectar y seguir a su objetivo dentro de la experiencia WebAR. El resto de la imagen se descartará y se hará un seguimiento de la región que especifique  en su experiencia.

![SetTrackingRegion](https://media.giphy.com/media/RCFntZ0hn5VO3W9Mld/giphy.gif)

4. **Editar un objetivo de imagen plana**:

* (1) Dé a su objetivo de imagen un **nombre** editando el campo de la parte superior izquierda de la ventana.
* (2) **¡IMPORTANTE!** Pruebe su objetivo de imagen: la mejor forma de determinar si su imagen subida será un objetivo de imagen bueno o malo (consulta [Optimizar el seguimiento de objetivos de imagen](#optimizing-image-target-tracking)) es utilizar el simulador para evaluar la calidad del seguimiento.  Escanee el código QR con su aplicación de cámara para abrir el enlace del simulador y, a continuación, apunte con su dispositivo a la pantalla o al objeto físico.
* (3) Haga clic en **Cargar automáticamente** si quiere que el objetivo de imagen se active automáticamente al cargar el proyecto WebAR. Se pueden cargar automáticamente hasta 5 objetivos de imagen sin escribir una línea de código.  Se pueden cargar más objetivos mediante programación a través de la API.
* (4) Opcional: si quiere añadir metadatos a su imagen, en formato Texto o JSON, haz clic en el botón **Metadatos** situado en la parte inferior de la ventana.

![EditFlatImageTarget](/images/edit-flat-image-target.jpg)

5. Los cambios realizados en esta pantalla se guardan automáticamente.  Haga clic en **Cerrar** para volver a su biblioteca de objetivos de imagen.

## Crear objetivo de imagen cilíndrica {#create-cylindrical-image-target}

1. Haga clic en el icono "+ Cilíndrico" para crear un nuevo objetivo de imagen plana.

![ObjetivoImagenPlana1](/images/image-target-create-cylindrical.jpg)

2. **Subir un objetivo de imagen plana**: arrastre su imagen (.jpg, .jpeg o .png) al panel de subida, o haga clic dentro de la zona de puntos y utilice su buscador de archivos para seleccionar su imagen.

3. **Establecer una región de seguimiento** (y orientación): utilice el control deslizante para establecer la región de la imagen que se utilizará para detectar y seguir a su objetivo dentro de la experiencia WebAR. El resto de la imagen se descartará y se hará un seguimiento de la región que especifique  en su experiencia.

![](https://media.giphy.com/media/AdgvL3hqQAULWEHWTg/giphy.gif)

4. **Editar las propiedades de un objetivo de imagen cilíndrica**

* (1) Dé a su objetivo de imagen un **nombre** editando el campo de la parte superior izquierda de la ventana.
* (2) **Arrastre los controles** deslizantes hasta que la forma de la etiqueta sea la esperada en el simulador o **introduzca las medidas** directamente.
* (3) **¡IMPORTANTE!** Pruebe su imagen objetivo: la mejor forma de determinar si la imagen que ha subido será un objetivo de imagen bueno o malo (consulta [Optimizar el seguimiento de objetivos de imagen](#optimizing-image-target-tracking)) es utilizar el simulador para evaluar la calidad del seguimiento.  Escanee el código QR con su aplicación de cámara para abrir el enlace del simulador y, a continuación, apunte con tu dispositivo a la pantalla o al objeto físico.
* (4) Haga clic en **Cargar automáticamente** si quieree que el objetivo de imagen se active automáticamente al cargar el proyecto WebAR. Se pueden cargar automáticamente hasta 5 objetivos de imagen sin escribir una línea de código.  Se pueden cargar más objetivos mediante programación a través de la API.
* (5) Opcional: Si quiere añadir metadatos a su imagen, en formato Texto o JSON, haga clic en el botón **Metadatos** situado en la parte inferior de la ventana.

![EditCylindricalImageTarget](/images/edit-cylindrical-image-target.jpg)

5. Los cambios realizados en esta pantalla se guardan automáticamente.  Haga clic en **Cerrar** para volver a su biblioteca de objetivos de imagen.

## Crear objetivo de imagen cónica {#create-conical-image-target}

1. Haga clic en el icono "+ Cónico" para crear un nuevo objetivo de imagen plana.

![ObjetivoImagenPlana1](/images/image-target-create-conical.jpg)

2. **Subir un objetivo de imagen cónica**: arrastre su imagen (.jpg, .jpeg o .png) al panel de subida, o haga clic dentro de la zona de puntos y utilice su explorador de archivos para seleccionar su imagen.  La imagen cargada debe estar en formato "desenvuelto", también conocido como "arcoíris", recortada así:

![imagen cónica arcoíris](/images/conical-rainbow-image.jpg)

3. **Establecer la alineación de arco grande**: arrastre el control deslizante hasta que la línea **roja** se superponga al **arco grande** de la imagen cargada.

![fijar arco grande](https://media.giphy.com/media/1zcOKYrjOmhaxUJ7lh/giphy.gif)

4. **Ajustar la alineación del arco pequeño**: haga lo mismo con el arco pequeño.  Arrastre el control deslizante hasta que la línea **azul** se superponga al **arco pequeño** de la imagen cargada.

5. **Establecer control de seguimiento** (y orientación): arrastre y amplíe la imagen para establecer la parte de la imagen que se detecta y se rastrea. Esta debería ser la zona más rica destacada de su imagen.

![establecer seguimiento](https://media.giphy.com/media/t2rSve9UshxGB07US2/giphy.gif)

6. **Editar las propiedades de un objetivo de imagen cónica**:

* (1) Dé a su objetivo de imagen un **nombre** editando el campo de la parte superior izquierda de la ventana.
* (2) **Arrastre los controles** deslizantes hasta que la forma de la etiqueta sea la esperada en el simulador o **introduzca las medidas** directamente.
* (3) **¡IMPORTANTE!** Pruebe su imagen objetivo: la mejor forma de determinar si la imagen que ha subido será un objetivo de imagen bueno o malo (consulta [Optimizar el seguimiento de objetivos de imagen](#optimizing-image-target-tracking)) es utilizar el simulador para evaluar la calidad del seguimiento.  Escanee el código QR con su aplicación de cámara para abrir el enlace del simulador y, a continuación, apunte con tu dispositivo a la pantalla o al objeto físico.
* (4) Haga clic en **Cargar automáticamente** si quieree que el objetivo de imagen se active automáticamente al cargar el proyecto WebAR. Se pueden cargar automáticamente hasta 5 objetivos de imagen sin escribir una línea de código.  Se pueden cargar más objetivos mediante programación a través de la API.
* (5) Opcional: Si quiere añadir metadatos a su imagen, en formato Texto o JSON, haga clic en el botón **Metadatos** situado en la parte inferior de la ventana.

![EditConicalImageTarget](/images/edit-conical-image-target.jpg)

7. Los cambios realizados en esta pantalla se guardan automáticamente.  Haga clic en **Cerrar** para volver a su biblioteca de objetivos de imagen.

## Editar objetivos de imagen {#edit-image-targets}

Haga clic en cualquiera de los objetivos de imagen en **Mis objetivos de imagen** para ver o modificar sus propiedades:

1. Nombre del objetivo de imagen
2. Deslizadores / Medidas (solo objetivos de imagen cilíndricos/cónicos)
3. Simulador de código QR
4. Eliminar objetivo de imagen
5. Cargar automáticamente
6. Metadatos
7. Orientación y dimensiones
8. Estado de autoguardado
9. Cerrar

| Tipo       | Campos                                                                 |
| ---------- | ---------------------------------------------------------------------- |
| Plano      | ![objetivo plano](/images/edit-flat-image-target-full.jpg)             |
| Cilíndrico | ![objetivo cilíndrico](/images/edit-cylindrical-image-target-full.jpg) |
| Cónico     | ![objetivo cónico](/images/edit-conical-image-target-full.jpg)         |

## Cambiar los objetivos de imagen activos {#changing-active-image-targets}

La configuración de los objetivos de imagen activos puede modificarse en tiempo de ejecución llamando a [XR8.XrController.configure()](/api/xrcontroller/configure)

Nota: la configuraciónde de los objetivos de imagen actualmente activos será **sustituida** por una contraseña de configuración nueva a [XR8.XrController.configure()](/api/xrcontroller/configure).

#### Ejemplo - Cambiar la configuración del objetivo de imagen activo {#example---change-active-image-target-set}

```javascript
XR8.XrController.configure({imageTargets: ['image-target1', 'image-target2', 'image-target3']})
```

## Optimizar el seguimiento del objetivo de la imagen {#optimizing-image-target-tracking}

Para garantizar una experiencia de seguimiento de objetivos de imagen de la máxima calidad, asegúrese de seguir estas pautas al seleccionar un objetivo de imagen.

***TIENEN***:

* muchos detalles variados
* alto contraste

***NO*** tienen:

* patrones repetitivos
* espacio muerto excesivo
* imágenes de baja resolución

Color: la detección de objetivos de imagen no puede distinguir entre colores, así que no confíe en ella como diferenciador clave entre objetivos.

Para obtener los mejores resultados, utilice imágenes en superficies planas, cilíndricas o cónicas para el seguimiento del objetivo de imagen.

Tenga en cuenta la reflectividad del material físico de su objetivo de imagen. Las superficies brillantes y los reflejos de la pantalla pueden disminuir la calidad del seguimiento. Utilice materiales mates en condiciones de iluminación difusa para obtener una calidad de seguimiento óptima.

Nota: la detección se produce más rápidamente en el centro de la pantalla.

| Marcadores buenos                              | Marcadores malos                          |
| ---------------------------------------------- | ----------------------------------------- |
| ![buen logotipo](/images/it-logo-good.jpg)     | ![mal logotipo](/images/it-logo-bad.jpg)  |
| ![cartel de cine](/images/it-movie-poster.jpg) | ![mal patrón](/images/it-pattern-bad.jpg) |

## Eventos de objetivo de imagen {#image-target-events}

8th Wall Web emite eventos / observables para varios eventos en el ciclo de vida del objetivo de imagen (por ejemplo, carga de imágenes, escaneo de imágenes, imagen encontrada, imagen actualizada, imagen perdida). Consulta la referencia de la API para obtener instrucciones sobre el manejo de estos eventos en tu aplicación Web:

* [Eventos AFrame](/api/aframeevents)
* [Observables BabylonJS](/api/babylonjs/observables)
* [Eventos PlayCanvas](/api/playcanvasevents/playcanvas-image-target-events)
* [Eventos enviados por XrController](/api/xrcontroller/pipelinemodule/#dispatched-events)

#### Proyectos de muestra {#example-projects}

<https://github.com/8thwall/web/tree/master/examples/aframe/artgallery>

<https://github.com/8thwall/web/tree/master/examples/aframe/flyer>
