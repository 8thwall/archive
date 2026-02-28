---
sidebar_label: PREGUNTAS FRECUENTES
sidebar_position: 5
---

# PREGUNTAS FRECUENTES SOBRE VPS {#lightship-vps-faq}

## ¿Qué es Lightship VPS? {#what-is-lightship-vps}

Lightship VPS (Visual Positioning System) es un servicio en la nube que permite a las aplicaciones localizar el dispositivo de un usuario de
en ubicaciones del mundo real, lo que permite a los usuarios interactuar con contenidos de RA persistentes y
impulsar nuevas experiencias inmersivas. VPS determina la posición y orientación (pose) del dispositivo mediante
haciendo referencia a los datos de mapas que existen en la nube de Niantic.

## ¿Cómo funciona el VPS? {#how-does-vps-work}

Cuando un dispositivo hace una llamada al servicio VPS, éste recibe una imagen de consulta del dispositivo
del usuario junto con su ubicación aproximada (a partir del GPS) como datos de entrada e intenta localizarlo utilizando el mapa o mapas
que existan en esa ubicación. Si la localización se realiza correctamente, el servicio devuelve la posición y orientación (pose) del dispositivo
correspondientes a la marca de tiempo de la imagen que se transmitió
. Dado que existe un retardo entre el momento en que se captura una imagen de consulta VPS y el momento en que se recibe una respuesta
del servicio VPS, el dispositivo necesita disponer de un sistema de seguimiento del movimiento en
para mantenerse localizado con precisión mientras se mueve. Cuando el servicio VPS devuelve una estimación de pose al dispositivo
, la diferencia de pose del sistema de seguimiento del dispositivo se añade a la respuesta de localización
para que VPS pueda "seguir" el movimiento del dispositivo mientras espera la respuesta del servidor
a la consulta VPS.

## ¿Qué es una exploración? {#what-is-a-scan}

Los escaneos AR de jugadores, desarrolladores y topógrafos son el ingrediente fundamental utilizado para crear el
Niantic Map: El mapa 3D del mundo de Niantic. Los escaneos AR se registran y cargan utilizando el marco de escaneado AR
de Niantic, que es un módulo utilizado dentro de Pokemon Go, Ingress y la aplicación Wayfarer. Cada exploración de AR
consiste en una serie de fotogramas de vídeo con datos de apoyo procedentes de acelerómetros y sensores GPS
que construyen un modelo 3D del mundo a partir de múltiples imágenes 2D. Niantic utiliza los escáneres de realidad aumentada para crear mapas y mallas de lugares del mundo real en
.

## ¿Qué es un mapa? {#what-is-a-map}

En la jerga de VPS, un mapa es el artefacto de datos que se utiliza para localizar su dispositivo cuando se llama a la API de VPS
. Un mapa puede considerarse como una función que toma una imagen de consulta como entrada y devuelve
posición y orientación (pose) como salida. El mapa que corresponde a un lugar determinado se crea
a partir de las exploraciones que se cargaron en ese lugar. Los mapas VPS no son legibles.

## ¿Qué es una malla? {#what-is-a-mesh}

En lenguaje VPS, una malla es un modelo 3D de un lugar u objeto del mundo real. Las mallas proporcionan una representación detallada
de un espacio físico u objeto, y son útiles para comprender cómo es un lugar
, como referencia para la creación de contenidos de realidad aumentada, y para crear efectos de física y oclusión. Al igual que los mapas de
, las mallas que corresponden a un lugar determinado se crean a partir de las exploraciones que se cargaron en
ese lugar. Las mallas son legibles tanto por humanos como por máquinas.

## ¿Dónde puedo utilizar VPS? {#where-can-i-use-vps}

VPS está disponible en más de 150.000 lugares del mundo real, y cada día se añaden más lugares. En
para que una ubicación esté disponible en VPS, debe cargarse una cantidad suficiente de datos de escaneado AR en
esa ubicación y debe completarse el proceso de activación de VPS. Los desarrolladores pueden añadir nuevas ubicaciones a
el mapa y solicitar la activación de VPS de ubicaciones totalmente escaneadas mediante el navegador geoespacial.

## ¿Cómo funciona la activación del VPS? {#how-does-vps-activation-work}

Para que una ubicación pueda optar a la activación del VPS, debe tener cargados al menos 10 escaneos que superen los controles de calidad mínimos de
, y la diferencia de tiempo entre el escaneo más antiguo y el más reciente en la ubicación
debe ser de al menos 5 horas. Estos requisitos garantizan que los mapas y mallas resultantes sean de
calidad suficiente y capturen variaciones suficientes para que los usuarios puedan localizarlos con fiabilidad.
El proceso de activación de VPS se ejecuta en la infraestructura de mapeado de RA de Niantic e implica muchos pasos complejos
. Del conjunto de exploraciones elegibles en la ubicación, un algoritmo selecciona la mayoría de las exploraciones para
utilizarlas para construir mapas y mallas, y el puñado restante para validarlas y medir la calidad de la localización
. El proceso de activación de una ubicación se ejecuta en los servidores de Niantic y normalmente
tarda entre 1 y 2 horas en completarse.

## ¿Puedo encontrar mis escaneos una vez realizada la activación del VPS? {#can-i-find-my-scans-after-vps-activation-is-done}

Durante el proceso de activación, los mapas y mallas creados a partir de las exploraciones cargadas se fusionan
para incorporar la mayor cantidad de información posible. El producto final, que los desarrolladores utilizan en
para crear contenidos y los usuarios para localizarlos, se compone de exploraciones de muchas fuentes diferentes de
. Los datos de escaneado se mezclan para crear una representación más completa del lugar,
por lo que no existe una relación unívoca entre los escaneados que se cargan en un lugar y los mapas y mallas
que se crean una vez que se activa el VPS.

## ¿Puedo añadir más exploraciones a una ubicación que ya está activada? {#can-i-add-more-scans-to-a-location-thats-already-activated}

En algunos casos, es posible que los desarrolladores deseen añadir exploraciones adicionales a un lugar previamente activado en
para mejorar la calidad y la cobertura de los mapas y mallas del lugar. En
para que una Ubicación pueda ser "reactivada", debe haber tenido al menos 5 escaneos adicionales
cargados desde la última vez que fue activada. Cabe destacar que aún no es posible añadir nuevas exploraciones
a un mapa fusionado existente, sino que el proceso de reactivación requiere la construcción de un nuevo mapa fusionado
que incorpore las nuevas exploraciones en el contexto de las ya existentes.

## ¿Cómo solicito la activación del VPS de una nueva ubicación? {#how-do-i-request-vps-activation-of-a-new-location}

Una vez que una ubicación tiene suficientes escaneos cargados para cumplir los requisitos de activación del VPS (al menos 10 escaneos totales en
con al menos 5 horas de diferencia entre el escaneo más antiguo y el más reciente), los desarrolladores pueden
solicitar la activación del VPS seleccionando la ubicación en la aplicación Wayfarer o en el navegador geoespacial y
pulsando el botón "activar". Esto añadirá la ubicación a la cola de activación. Normalmente, una solicitud de activación de
se completa en 2 horas. Los promotores también tienen la opción de solicitar a
la reactivación de una ubicación existente una vez que se hayan cargado 5 escaneos adicionales.

## ¿Funciona el VPS de noche o con mal tiempo? {#does-vps-work-at-night-or-in-poor-weather-conditions}

El VPS funciona mejor cuando hay buena visibilidad. Para maximizar las probabilidades de éxito de las experiencias con
VPS, lo mejor es cargar muchas exploraciones de RA que cubran una amplia gama de condiciones diferentes de
(por ejemplo, diferentes horas del día, diferentes condiciones meteorológicas, etc.). Por ejemplo, si
está construyendo una experiencia en un lugar en el que llueve mucho, contar con algunos escaneos de un día lluvioso
es muy útil.

## ¿Necesitan el escaneado AR y el VPS teléfonos con sensores LiDAR? {#do-ar-scanning-and-vps-require-phones-with-lidar-sensors}

El escaneado AR y el VPS no requieren LiDAR.
