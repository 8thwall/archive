---
id: generate-models
sidebar_position: 2
---

# Generar modelos 3D

Para generar un modelo 3D (formato `.glb`), primero debe generar una imagen o varias imágenes para utilizarlas como entrada. Los modelos 3D se generan a partir de una sola imagen o de un conjunto de imágenes multivista.

Este proceso funciona mejor con sujetos individuales, como objetos o edificios, no con escenas enteras.

## Paso 1: Generar entradas de imagen

Empieza por seleccionar un modelo utilizando el menú desplegable.

![](/images/studio/asset-lab/model-model.png)

Cada modelo tiene diferentes puntos fuertes, así como un precio de crédito diferente por solicitud (que se muestra en el botón Generar, cerca de la parte inferior). Consulte la lista completa de precios en el documento de precios de los créditos.

Dependiendo del modelo que seleccione para generar una imagen, tendrá diferentes opciones de entrada. Consulte Flujo de trabajo de generación de imágenes para obtener más detalles sobre los modelos y entradas disponibles.

Utilice el conmutador para generar una sola imagen (lo mejor para objetos simétricos sencillos) o la vista frontal en un conjunto de varias imágenes (lo mejor para objetos más complejos o asimétricos).

Si selecciona Vista única, se genera una imagen del objeto en ¾ de vista.

![](/images/studio/asset-lab/model-single.png)

Si selecciona Multi-Vista, generará primero una vista de la "parte frontal" de su objeto. Si está satisfecho con el resultado, puede generar las vistas "derecha", "izquierda" y "trasera" del mismo objeto utilizando el botón Generar vista múltiple. Para este paso, es necesario utilizar GPT-image-1.

![](/images/studio/asset-lab/model-multi.png)

Una vez que esté satisfecho con sus entradas de imagen, puede hacer clic en el botón "Enviar a modelo 3D" en la parte inferior derecha para pasar al siguiente paso.

## Paso 2: Generar modelo 3D

Seleccione el modelo que desee y ajuste los parámetros según sea necesario.

### Modelos compatibles

**Trellis**  
Modelo a gran escala de Microsoft para mallas texturizadas de alta calidad.  
Entradas:

- Imágenes de una o varias vistas
- Orientación de la forma (0-10)
- Orientación detallada (1-10)
- Simplificación de mallas (0,9-0,98)
- Tamaño de la textura: 512x512 o 1024x1024

**Hunyuan 3D-2**  
Generador de activos de alta resolución de Tencent.  
Entradas:

- Imágenes de una o varias vistas
- Velocidad (estándar o turbo)
- Orientación (0-20)
- Detalle de la forma (1-1024)

**Hunyuan 3D-2 Mini**  
Variante de menores recursos de Hunyuan 3D-2.  
Entradas:

- Solo imágenes individuales
- Velocidad (estándar o turbo)
- Orientación (0-20)
- Detalle de forma (1-1024)

Cada modelo tiene diferentes puntos fuertes, así como un precio de crédito diferente por solicitud (que se muestra en el botón Generar, cerca de la parte inferior). Consulte la lista completa de precios en el documento de precios de los créditos.

_Seleccione el botón Generar para comenzar._

![](/images/studio/asset-lab/model-generate.png)

## Paso 3: Importar al proyecto o descargar

Utiliza los botones de la parte inferior para importar o descargar tu modelo 3D.

![](/images/studio/asset-lab/model-import.png)

Puede acceder a todos los activos generados por los usuarios en su espacio de trabajo desde la Biblioteca, disponible en la pestaña izquierda del Laboratorio de activos a pantalla completa o en la pestaña del panel lateral izquierdo en Studio. Utilice la opción de filtro para mostrar sólo modelos 3D.

![](/images/studio/asset-lab/model-library.png)

![](/images/studio/asset-lab/model-library2.png)

