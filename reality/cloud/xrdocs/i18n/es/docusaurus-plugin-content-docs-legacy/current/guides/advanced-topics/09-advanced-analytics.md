---
id: advanced-analytics
---

# Análisis avanzados

Los proyectos de 8th Wall proporcionan [análisis de uso básico](/legacy/guides/projects/usage-and-recent-trends),
permitiéndole ver cuántas "vistas" ha recibido su proyecto, así como el tiempo medio empleado por los usuarios de
. Si busca análisis personalizados o más detallados, le recomendamos que añada análisis web de terceros
a su proyecto.

El proceso para añadir analíticas a un proyecto es el mismo que para añadirlas a cualquier sitio web que no sea AR
.  Puede utilizar la solución analítica que prefiera.

En este ejemplo, explicaremos cómo añadir Google Analytics a su proyecto 8th Wall mediante Google Tag
Manager (GTM), lo que facilita la recopilación de análisis personalizados sobre cómo los usuarios ven su proyecto y cómo interactúan con él en
.

Mediante la interfaz de usuario basada en web de GTM, puede definir etiquetas y crear activadores que hagan que su etiqueta
se dispare cuando se produzcan determinados eventos. En su proyecto 8th Wall, dispare eventos (utilizando una sola línea de Javascript
) en los lugares deseados de su código.

## Analítica Requisitos previos {#analytics-pre-requisites}

Debe disponer ya de cuentas de Google Analytics y Google Tag Manager y tener conocimientos básicos de su funcionamiento.

Para más información, consulta la siguiente documentación de Google:

- Google Analytics 4
  - Cómo empezar: <https://support.google.com/analytics/answer/9304153>
  - Añadir un flujo de datos: <https://support.google.com/analytics/answer/9304153#stream>
- Google Tag Manager
  - Resumen: <https://support.google.com/tagmanager/answer/6102821>
  - Configuración e instalación: <https://support.google.com/tagmanager/answer/6103696>

## Añada Google Tag Manager a su proyecto 8th Wall {#add-google-tag-manager-to-your-8th-wall-project}

1. En la página Espacio de trabajo de su contenedor Tag Manager, haga clic en el ID de su contenedor (por ejemplo,
   "**GTM-XXXXXX**") para abrir el cuadro "Instalar Google Tag Manager".  Esta ventana contiene el código que
   tendrá que añadir posteriormente a su proyecto 8th Wall.

![GTM1](/images/gtm1.jpg)

2. Abra el Editor de la Nube de la 8ª Pared y pegue el bloque de código **top** en **head.html**:

![GTM2](/images/gtm2.jpg)

3. Haga clic en "+" junto a Archivos, y cree un nuevo archivo llamado **gtm.html**, luego pegue el contenido de
   el bloque de código **inferior** en este archivo:

![GTM3](/images/gtm3.jpg)

4. Añade el siguiente código en la parte superior de app.js:

```javascript
import * as googleTagManagerHtml from './gtm.html'
document.body.insertAdjacentHTML('afterbegin', googleTagManagerHtml)
```

## Configuración de Google Tag Manager {#configure-google-tag-manager}

1. Localice el [ID de medición de Google](https://support.google.com/analytics/answer/12270356) de su flujo de datos.
2. En GTM, [cree una etiqueta GA4 Configuration](https://support.google.com/tagmanager/answer/9442095#config).

Por ejemplo:

![GTM8](/images/gtm8.jpg)

## Seguimiento de páginas vistas {#tracking-page-views}

Las páginas vistas se rastrearán automáticamente a través de la etiqueta de configuración GA4. Consulte [Configurar Google Tag Manager](/legacy/guides/advanced-topics/advanced-analytics/#configure-google-tag-manager) para obtener más información.

## Seguimiento de eventos personalizados {#tracking-custom-events}

GTM también ofrece la posibilidad de activar eventos cuando se producen acciones personalizadas **dentro** de la experiencia WebAR
. Estos eventos serán particulares de tu proyecto WebAR, pero algunos ejemplos podrían ser:

- Objeto 3D colocado
- Imagen Objetivo encontrado
- Captura de pantalla realizada
- etc…

En este ejemplo, crearemos una etiqueta (con disparador) y la añadiremos al proyecto de ejemplo
["AFrame: Place Ground"](https://www.8thwall.com/8thwall/placeground-aframe) que
dispara cada vez que se genera un modelo 3D.

#### Crear disparador de eventos personalizado {#create-custom-event-trigger}

- Tipo de activador: \*\*Evento personalizado
- Nombre del evento: **lugarModelo**
- Este disparador se activa en: \*\*Todos los eventos personalizados

![GTM6](/images/gtm6.jpg)

#### Crear etiqueta {#create-tag-1}

A continuación, crea una etiqueta que se disparará cuando el disparador "placeModel" se dispare en tu código.

- Tipo de etiqueta: **Google Analytics: Evento GA4**
- Etiqueta de configuración: (Seleccione la configuración creada anteriormente)
- Nombre del evento: **Modelo de lugar**
- Activación: **Selecciona el disparador "placeModel" creado en el paso anterior.**

![GTM9](/images/gtm9.jpg)

**IMPORTANTE**:  Asegúrese de guardar todos los disparadores / etiquetas creadas y luego **Submit/Publish** su configuración
dentro de la interfaz GTM para que estén en vivo. Véase <https://support.google.com/tagmanager/answer/6107163>

#### Incendio en el interior del 8º Muro Proyecto {#fire-event-inside-8th-wall-project}

En su proyecto 8th Wall, añada la siguiente línea de javascript para activar este disparador en el lugar deseado de su código:

`window.dataLayer.push({event: 'placeModel'})`

##### Ejemplo - basado en <https://www.8thwall.com/8thwall/placeground-aframe/master/tap-place.js> {#example---based-on-httpswww8thwallcom8thwallplaceground-aframemastertap-placejs}

```javascript
export const tapPlaceComponent = {
  init: function() {
    const ground = document.getElementById('ground')
    ground.addEventListener('click', event => {
      // Crear nueva entidad para el nuevo objeto
      const newElement = document.createElement('a-entity')

      // El raycaster da una localización del toque en la escena
      const touchPoint = event.detail.intersection.point
      newElement.setAttribute('position', touchPoint)

      const randomYRotation = Math.random() * 360
      newElement.setAttribute('rotation', '0 ' + randomYRotation + ' 0')

      newElement.setAttribute('visible', 'false')
      newElement.setAttribute('scale', '0.0001 0.0001 0.0001')

      newElement.setAttribute('shadow', {
        receive: false,
      })

      newElement.setAttribute('class', 'cantap')
      newElement.setAttribute('hold-drag', '')

      newElement.setAttribute('gltf-model', '#treeModel')
      this.el.sceneEl.appendChild(newElement)

      newElement.addEventListener('model-loaded', () => {
        // Una vez cargado el modelo, estamos listos para mostrarlo emergiendo mediante una animación
        newElement.setAttribute('visible', 'true')
        newElement.setAttribute('animation', {
          property: 'scale',
          to: '7 7 7',
          easing: 'easeOutElastic',
          dur: 800,
        })

        // **************************************************
        // Dispara el evento Google Tag Manager una vez cargado el modelo
        // **************************************************
        window.dataLayer.push({event: 'placeModel'})
      })
    })
  }
}
```
